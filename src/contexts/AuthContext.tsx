import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  subscription: 'free' | 'silver' | 'gold' | 'platinum';
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Check if they are admin locally
      let isLocalAdmin = false;
      try {
        isLocalAdmin = sessionStorage.getItem('vintage_admin_authenticated') === 'true';
      } catch (e) {}

      if (currentUser) {
        setUser(currentUser);
        // Fetch or create user data
        const path = `users/${currentUser.uid}`;
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          
          const expectedRole = isLocalAdmin ? 'admin' : 'user';

          if (userSnap.exists()) {
            const data = userSnap.data() as UserData;
            // If local admin but the firestore document is not admin, update it!
            if (isLocalAdmin && data.role !== 'admin') {
              try {
                await updateDoc(userRef, { role: 'admin' });
                setUserData({ ...data, role: 'admin' });
              } catch (upErr) {
                console.error("Failed to upgrade firestore role to admin:", upErr);
                setUserData(data);
              }
            } else {
              setUserData(data);
            }
          } else {
            const newUserData: UserData = {
              uid: currentUser.uid,
              email: currentUser.email || (isLocalAdmin ? 'admin@vintagemarket.com' : 'demo@vintageguru.com'),
              displayName: currentUser.displayName || (isLocalAdmin ? 'Admin Console' : 'Demo Collector'),
              photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              role: expectedRole,
              subscription: 'free',
              createdAt: serverTimestamp(),
            };
            try {
              await setDoc(userRef, newUserData);
              setUserData(newUserData);
            } catch (error) {
              console.warn("Firestore user creation failed (offline). Using local new user data.", error);
              setUserData(newUserData);
            }
          }
        } catch (error) {
          console.warn("Firestore user fetching failed (offline). Using fallback user data.", error);
          if (isLocalAdmin) {
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email || 'admin@vintagemarket.com',
              displayName: currentUser.displayName || 'Admin Console (Local)',
              photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              role: 'admin',
              subscription: 'platinum',
              createdAt: new Date(),
            });
          } else {
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email || 'demo@vintageguru.com',
              displayName: currentUser.displayName || 'Demo Collector (Local)',
              photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              role: 'user',
              subscription: 'free',
              createdAt: new Date(),
            });
          }
        }
        setLoading(false);
      } else {
        setUser(null);
        setUserData(null);
        
        // If they are local admin but no Firebase user, let's log them in anonymously!
        if (isLocalAdmin) {
          try {
            await signInAnonymously(auth);
          } catch (anonError) {
            console.warn('Anonymous admin auto-login failed or restricted in Firebase console:', anonError);
            // Fallback to local admin user state so the UI still displays correctly and admin tools work!
            setUser({
              uid: 'admin-local-fallback',
              email: 'admin@vintagemarket.com',
              displayName: 'Admin Console (Local)',
              photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              emailVerified: true,
              isAnonymous: true,
            } as any);
            setUserData({
              uid: 'admin-local-fallback',
              email: 'admin@vintagemarket.com',
              displayName: 'Admin Console (Local)',
              photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              role: 'admin',
              subscription: 'platinum',
              createdAt: new Date(),
            });
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Error signing in with Google', error);
      // Fallback to anonymous sign-in inside iframe when popup is blocked/closed
      if (
        error?.code === 'auth/popup-closed-by-user' || 
        error?.code === 'auth/cancelled-popup-request' ||
        error?.message?.includes('closed') || 
        error?.message?.includes('popup')
      ) {
        console.warn('Iframe popup blocked or closed. Falling back to anonymous guest sign-in.');
        try {
          await signInAnonymously(auth);
          return;
        } catch (anonError) {
          console.warn('Anonymous fallback sign-in also failed (possibly disabled in Firebase Console):', anonError);
          // Fall back to local guest user so they can still browse and view the app inside the iframe!
          setUser({
            uid: 'guest-local-fallback',
            email: 'demo@vintageguru.com',
            displayName: 'Demo Collector (Local)',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
            emailVerified: false,
            isAnonymous: true,
          } as any);
          setUserData({
            uid: 'guest-local-fallback',
            email: 'demo@vintageguru.com',
            displayName: 'Demo Collector (Local)',
            photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
            role: 'user',
            subscription: 'free',
            createdAt: new Date(),
          });
          setLoading(false);
          return;
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
