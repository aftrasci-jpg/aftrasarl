export type UserRole = 'admin' | 'company';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  company_name: string;
  country: string;
  address: string;
  website?: string;
  representative_name: string;
  position: string;
  phone: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
}

export type LOIStatus = 'searching' | 'offer_sent' | 'negotiating' | 'provider_identified' | 'finalized' | 'cancelled';

export interface AdminResponse {
  proposed_quantity: string;
  incoterm: string;
  location: string;
  price: string;
  delivery_time: string;
  attachments?: string[];
  updated_at: string;
}

export interface LOI {
  id: string;
  company_id: string;
  company_name: string;
  product: string;
  quantity: string;
  budget?: string;
  incoterm?: string;
  port?: string;
  deadline?: string;
  additional_info?: string;
  status: LOIStatus;
  admin_response?: AdminResponse;
  created_at: string;
}

export const STATUS_COLORS: Record<LOIStatus, string> = {
  searching: 'bg-blue-50 text-aftras-blue-text',
  offer_sent: 'bg-aftras-blue-text text-white',
  negotiating: 'bg-orange-50 text-aftras-orange',
  provider_identified: 'bg-green-50 text-green-600',
  finalized: 'bg-green-600 text-white',
  cancelled: 'bg-red-50 text-red-600',
};

export const STATUS_LABELS: Record<LOIStatus, string> = {
  searching: 'En recherche fournisseur',
  offer_sent: 'Offre envoyée',
  negotiating: 'En négociation',
  provider_identified: 'Fournisseur identifié',
  finalized: 'Transaction finalisée',
  cancelled: 'Annulé',
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
