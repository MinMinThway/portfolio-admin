
export interface NavItem {
  name: string;
  icon: React.ReactNode;
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: UserStatus;
  phoneNumber: string;
  password?: string;
}

export interface SaleData {
  month: string;
  revenue: number;
  profit: number;
}

export interface StatCardData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

export interface CompanyProfile {
  id: number;
  companyName: string;
  description: string;
  address1: string;
  address2: string;
  facebookLink: string;
  youtubeLink: string;
  instagramLink: string;
  tiktokLink: string;
  infoMail: string;
  headOfficeAddress: string;
  hrMail: string;
  hotlinePhoneNumber: string;
  phone1: string;
  phone2: string;
  email: string;
  photoUrl: string;
  aboutUs: string;
}

export interface Shop {
  id: number;
  location: string;
  address: string;
  mapLink: string;
  phone: string;
  photoUrl: string;
  remarks: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  contentBody: string;
  imagesUrl: string[];
  publishDate: string; // YYYY-MM-DD format
}

export interface PrivacyPolicy {
  id: number;
  policyName1: string;
  description1: string;
  policyName2: string;
  description2: string;
  policyName3: string;
  description3: string;
  policyName4: string;
  description4: string;
  policyName5: string;
  description5: string;
}
