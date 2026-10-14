import { ForumThread, ForumReply, INITIAL_THREADS } from '../data/forumData';
import { CommunityMember } from '../types/admin';

export const THREADS_STORAGE_KEY = 'iaf_community_threads_v1';
export const BLOCKED_USERS_STORAGE_KEY = 'iaf_blocked_community_users_v1';
export const REMOVED_USERS_STORAGE_KEY = 'iaf_removed_community_users_v1';

export interface BlockedUserInfo {
  name: string;
  blockedAt: string;
  reason: string;
  blockedBy: string;
}

/**
 * Get all threads from local storage or initial dataset
 */
export function getStoredThreads(): ForumThread[] {
  try {
    const saved = localStorage.getItem(THREADS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored threads:', e);
  }
  return INITIAL_THREADS;
}

/**
 * Save threads to local storage and broadcast change
 */
export function saveStoredThreads(threads: ForumThread[]): void {
  try {
    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threads));
    window.dispatchEvent(new CustomEvent('iaf_community_updated'));
  } catch (e) {
    console.error('Error saving threads:', e);
  }
}

/**
 * Get map of all blocked users
 */
export function getBlockedUsers(): Record<string, BlockedUserInfo> {
  try {
    const saved = localStorage.getItem(BLOCKED_USERS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading blocked users:', e);
  }
  return {};
}

/**
 * Check if a user name or email is currently blocked
 */
export function isUserBlocked(name: string): boolean {
  if (!name) return false;
  const blockedMap = getBlockedUsers();
  return Boolean(blockedMap[name.trim().toLowerCase()]);
}

/**
 * Block a community user
 */
export function blockCommunityUser(name: string, reason: string = 'Violation of community moderation rules', adminName: string = 'Admin'): void {
  if (!name) return;
  const key = name.trim().toLowerCase();
  const current = getBlockedUsers();
  current[key] = {
    name: name.trim(),
    blockedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    reason,
    blockedBy: adminName
  };
  try {
    localStorage.setItem(BLOCKED_USERS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('iaf_community_updated'));
  } catch (e) {
    console.error('Error saving blocked user:', e);
  }
}

/**
 * Unblock a community user
 */
export function unblockCommunityUser(name: string): void {
  if (!name) return;
  const key = name.trim().toLowerCase();
  const current = getBlockedUsers();
  if (current[key]) {
    delete current[key];
    try {
      localStorage.setItem(BLOCKED_USERS_STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent('iaf_community_updated'));
    } catch (e) {
      console.error('Error unblocking user:', e);
    }
  }
}

/**
 * Check if user is in removed/banned list
 */
export function getRemovedUsers(): string[] {
  try {
    const saved = localStorage.getItem(REMOVED_USERS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading removed users:', e);
  }
  return [];
}

/**
 * Permanently remove user from community
 * @param userName The name of the user to remove
 * @param purgeContent If true, delete all threads and replies by this user; if false, mask their name
 */
export function removeCommunityUser(userName: string, purgeContent: boolean = true): void {
  if (!userName) return;
  const normalized = userName.trim().toLowerCase();

  // Add to removed users list
  const removed = getRemovedUsers();
  if (!removed.includes(normalized)) {
    removed.push(normalized);
    try {
      localStorage.setItem(REMOVED_USERS_STORAGE_KEY, JSON.stringify(removed));
    } catch (e) {
      console.error(e);
    }
  }

  // Also ensure they are blocked so they cannot post
  blockCommunityUser(userName, 'Permanently removed from community by Administrator');

  // Purge or mask content from threads
  const threads = getStoredThreads();
  let updatedThreads: ForumThread[] = [];

  if (purgeContent) {
    // Delete all threads authored by this user, and filter out their replies
    updatedThreads = threads
      .filter(t => t.author.trim().toLowerCase() !== normalized)
      .map(t => ({
        ...t,
        replies: t.replies.filter(r => r.author.trim().toLowerCase() !== normalized)
      }));
  } else {
    // Keep threads but label author as [Removed Member]
    updatedThreads = threads.map(t => {
      const isAuthor = t.author.trim().toLowerCase() === normalized;
      const updatedReplies = t.replies.map(r => {
        if (r.author.trim().toLowerCase() === normalized) {
          return {
            ...r,
            author: '[Removed Member]',
            content: '[This reply was deleted by community administration]'
          };
        }
        return r;
      });

      if (isAuthor) {
        return {
          ...t,
          author: '[Removed Member]',
          content: '[This post was moderated and author has been removed from the community]',
          replies: updatedReplies
        };
      }
      return {
        ...t,
        replies: updatedReplies
      };
    });
  }

  saveStoredThreads(updatedThreads);
}

/**
 * Delete a specific thread by ID
 */
export function deleteCommunityThread(threadId: string): void {
  const threads = getStoredThreads();
  const updated = threads.filter(t => t.id !== threadId);
  saveStoredThreads(updated);
}

/**
 * Delete a specific reply from a thread
 */
export function deleteCommunityReply(threadId: string, replyId: string): void {
  const threads = getStoredThreads();
  const updated = threads.map(t => {
    if (t.id === threadId) {
      return {
        ...t,
        replies: t.replies.filter(r => r.id !== replyId)
      };
    }
    return t;
  });
  saveStoredThreads(updated);
}

/**
 * Extract distinct community members from threads, replies, and blocked lists
 */
export function extractCommunityMembers(threads: ForumThread[]): CommunityMember[] {
  const membersMap = new Map<string, CommunityMember>();
  const blockedMap = getBlockedUsers();

  // Seed default core active community members from IAF data
  const baseMembers: Array<{ name: string; city: string; badge: string; avatar: string; email?: string; date: string }> = [
    { name: 'Rohan Sharma', city: 'Bengaluru, KA', badge: 'Verified Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', email: 'rohan.sharma@autoindia.in', date: 'Jan 2026' },
    { name: 'Karan Malhotra', city: 'Delhi NCR', badge: 'Verified Owner', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', email: 'karan.m@iaf-enthusiast.com', date: 'Feb 2026' },
    { name: 'Vikram Joshi', city: 'Mumbai, MH', badge: 'Senior Contributor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', email: 'v.joshi@garages.org', date: 'Mar 2026' },
    { name: 'Siddharth Nair', city: 'Kochi, KL', badge: 'Forum Veteran', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', email: 'sid.nair@keraladrivers.com', date: 'Dec 2025' },
    { name: 'Ananya Deshmukh', city: 'Pune, MH', badge: 'Verified Owner', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', email: 'ananya.d@maharashtra.auto', date: 'Apr 2026' },
    { name: 'Dr. Arindam Bose', city: 'Kolkata, WB', badge: 'Verified Owner', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', email: 'dr.bose@kolkatamed.org', date: 'Feb 2026' },
    { name: 'Preeti Varma', city: 'Hyderabad, TS', badge: 'Community Moderator', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', email: 'preeti.mod@iaf.in', date: 'Nov 2025' },
    { name: 'Aditya Rajput', city: 'Jaipur, RJ', badge: 'Forum Veteran', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200', email: 'aditya.rajput@rajasthanriders.com', date: 'Jan 2026' },
  ];

  baseMembers.forEach((bm, i) => {
    const key = bm.name.trim().toLowerCase();
    const blockedInfo = blockedMap[key];
    membersMap.set(key, {
      id: `comm-usr-${i + 1}`,
      name: bm.name,
      email: bm.email,
      avatar: bm.avatar,
      city: bm.city,
      badge: bm.badge,
      joinedDate: bm.date,
      status: blockedInfo ? 'Blocked' : 'Active',
      threadsCount: 0,
      repliesCount: 0,
      blockedReason: blockedInfo?.reason,
      blockedAt: blockedInfo?.blockedAt
    });
  });

  // Calculate stats from threads
  threads.forEach(t => {
    if (!t.author || t.author.startsWith('[Removed')) return;
    const key = t.author.trim().toLowerCase();
    const blockedInfo = blockedMap[key];

    if (membersMap.has(key)) {
      const existing = membersMap.get(key)!;
      existing.threadsCount += 1;
      if (t.authorBadge && existing.badge === 'Verified Owner') {
        existing.badge = t.authorBadge;
      }
      if (t.authorCity) {
        existing.city = t.authorCity;
      }
      if (blockedInfo) {
        existing.status = 'Blocked';
        existing.blockedReason = blockedInfo.reason;
        existing.blockedAt = blockedInfo.blockedAt;
      }
    } else {
      membersMap.set(key, {
        id: `comm-usr-dyn-${membersMap.size + 1}`,
        name: t.author,
        email: `${key.replace(/\s+/g, '.')}@member.iaf.in`,
        avatar: t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        city: t.authorCity || 'India',
        badge: t.authorBadge || 'Verified Owner',
        joinedDate: t.createdAt ? t.createdAt.split('•')[0].trim() : '2026',
        status: blockedInfo ? 'Blocked' : 'Active',
        threadsCount: 1,
        repliesCount: 0,
        blockedReason: blockedInfo?.reason,
        blockedAt: blockedInfo?.blockedAt
      });
    }

    // Replies
    if (Array.isArray(t.replies)) {
      t.replies.forEach(r => {
        if (!r.author || r.author.startsWith('[Removed')) return;
        const rKey = r.author.trim().toLowerCase();
        const rBlockedInfo = blockedMap[rKey];

        if (membersMap.has(rKey)) {
          const existing = membersMap.get(rKey)!;
          existing.repliesCount += 1;
        } else {
          membersMap.set(rKey, {
            id: `comm-usr-dyn-${membersMap.size + 1}`,
            name: r.author,
            email: `${rKey.replace(/\s+/g, '.')}@member.iaf.in`,
            avatar: r.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            city: r.authorCity || 'India',
            badge: r.authorBadge || 'Verified Owner',
            joinedDate: r.createdAt ? r.createdAt.split('•')[0].trim() : '2026',
            status: rBlockedInfo ? 'Blocked' : 'Active',
            threadsCount: 0,
            repliesCount: 1,
            blockedReason: rBlockedInfo?.reason,
            blockedAt: rBlockedInfo?.blockedAt
          });
        }
      });
    }
  });

  return Array.from(membersMap.values());
}
