export type AdminRole = 'Super Admin' | 'Moderator' | 'Buyer' | 'Seller';
export type AdminUserStatus = 'Active' | 'Pending' | 'Blocked';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  registrationDate: string;
  status: AdminUserStatus;
  avatar?: string;
}

export type VehicleCategoryType = 'Classic Cars' | 'Vintage Bikes' | 'Antique Trucks' | 'Commercial';
export type VehicleStatusType = 'available' | 'sold' | 'pending';

export interface AdminVehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  basePrice: number;
  discountedPrice?: number;
  category: VehicleCategoryType | string;
  status: VehicleStatusType;
  image: string;
  gallery: string[];
  ownerId: string;
  createdAt: string;
}

export interface AdminReview {
  id: string;
  user: string;
  vehicleName: string;
  rating: number;
  text: string;
  status: 'Approved' | 'Hidden' | 'Pending';
  date: string;
}

export interface CmsCategory {
  id: string;
  name: string;
  subcategoriesCount: number;
  status: 'Active' | 'Inactive';
  description: string;
}

export interface CmsMedia {
  id: string;
  url: string;
  name: string;
  category: 'Banner' | 'Promo' | 'Detail' | 'General';
  size: string;
}

export interface CmsBlog {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  date: string;
  status: 'Draft' | 'Published';
  image: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'Subscribed' | 'Unsubscribed';
  date: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  city: string;
  badge: 'Verified Owner' | 'Forum Veteran' | 'Senior Contributor' | 'Community Moderator' | string;
  joinedDate: string;
  status: 'Active' | 'Blocked';
  threadsCount: number;
  repliesCount: number;
  blockedReason?: string;
  blockedAt?: string;
}
