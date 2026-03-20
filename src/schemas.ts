import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
});

export const loiSchema = z.object({
  productName: z.string().min(2, 'Le nom du produit est requis'),
  quantity: z.string().min(1, 'La quantité est requise'),
  specifications: z.string().min(10, 'Veuillez fournir plus de détails sur les spécifications'),
  targetPrice: z.string().optional(),
  destination: z.string().min(2, 'La destination est requise'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Le nom du produit est requis'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  category: z.string().min(1, 'La catégorie est requise'),
  image_url: z.string().url('URL de l\'image invalide'),
  is_featured: z.boolean().default(false),
});
