-- Supabase SQL Schema for AFTRAS CI

-- 1. Users Profile Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'company' CHECK (role IN ('admin', 'company')),
  company_name TEXT,
  country TEXT,
  address TEXT,
  website TEXT,
  representative_name TEXT,
  position TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOI Table
CREATE TABLE IF NOT EXISTS public.lois (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT,
  product TEXT NOT NULL,
  quantity TEXT NOT NULL,
  budget TEXT,
  incoterm TEXT,
  port TEXT,
  deadline TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'searching' CHECK (status IN ('searching', 'offer_sent', 'negotiating', 'provider_identified', 'finalized', 'cancelled')),
  admin_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'loi_created', 'loi_updated', 'system'
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications (mark as read)"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create notifications (for the system to handle)"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- 6. Storage Buckets
-- Note: Buckets can also be created via the Supabase UI.
-- This SQL creates the 'products' bucket and sets up RLS policies.

INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'products' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' AND
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Row Level Security (RLS)

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Only admins can modify products." ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- LOIs
ALTER TABLE public.lois ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own LOIs." ON public.lois FOR SELECT USING (auth.uid() = company_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert their own LOIs." ON public.lois FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Users can update their own LOIs (limited)." ON public.lois FOR UPDATE USING (auth.uid() = company_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Only admins can delete LOIs." ON public.lois FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 6. Functions & Triggers (to automatically create profile on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'company');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
