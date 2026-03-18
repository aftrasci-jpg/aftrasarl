export type UserRole = 'admin' | 'company';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  companyName: string;
  country: string;
  address: string;
  website?: string;
  representativeName: string;
  position: string;
  phone: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
}

export type LOIStatus = 'searching' | 'offer_sent' | 'negotiating' | 'provider_identified' | 'finalized';

export interface AdminResponse {
  proposedQuantity: string;
  incoterm: string;
  location: string;
  price: string;
  deliveryTime: string;
  attachments?: string[];
  updatedAt: string;
}

export interface LOI {
  id: string;
  companyId: string;
  companyName: string;
  product: string;
  quantity: string;
  budget?: string;
  incoterm?: string;
  port?: string;
  deadline?: string;
  additionalInfo?: string;
  status: LOIStatus;
  adminResponse?: AdminResponse;
  createdAt: string;
}

export const STATUS_COLORS: Record<LOIStatus, string> = {
  searching: 'bg-blue-50 text-aftras-blue-text',
  offer_sent: 'bg-aftras-blue-text text-white',
  negotiating: 'bg-orange-50 text-aftras-orange',
  provider_identified: 'bg-green-50 text-green-600',
  finalized: 'bg-green-600 text-white',
};

export const STATUS_LABELS: Record<LOIStatus, string> = {
  searching: 'En recherche fournisseur',
  offer_sent: 'Offre envoyée',
  negotiating: 'En négociation',
  provider_identified: 'Fournisseur identifié',
  finalized: 'Transaction finalisée',
};

export const PRODUCT_CATEGORIES = [
  'cereals',
  'legumes',
  'nuts',
  'export',
  'spices',
  'fruits',
  'processed'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];
