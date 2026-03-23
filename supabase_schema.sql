-- Supabase SQL Schema for AFTRAS CI (Secure & Idempotent Version)

-- 1. Users Profile Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'company' CHECK (role IN ('admin', 'company', 'community_manager')),
  company_name TEXT,
  country TEXT,
  city TEXT,
  business_registry_number TEXT,
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
  name_en TEXT,
  category TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
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
  product_image TEXT,
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

-- ==========================================
-- SECURITY & POLICIES (Idempotent)
-- ==========================================

-- Helper functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Function to delete a user from auth.users
CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF public.is_admin() THEN
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;
END;
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lois ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by owner or admin." ON public.profiles;
CREATE POLICY "Profiles are viewable by owner or admin." 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile." ON public.profiles;
CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete any profile." ON public.profiles;
CREATE POLICY "Admins can delete any profile." ON public.profiles FOR DELETE USING (public.is_admin());

-- 2. Products Policies
DROP POLICY IF EXISTS "Products are viewable by everyone." ON public.products;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins and CMs can modify products." ON public.products;
CREATE POLICY "Only admins and CMs can modify products." ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'community_manager'))
);

-- 3. LOIs Policies
DROP POLICY IF EXISTS "Users can view their own LOIs." ON public.lois;
CREATE POLICY "Users can view their own LOIs." ON public.lois FOR SELECT USING (
  auth.uid() = company_id OR public.is_admin() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'community_manager')
);

DROP POLICY IF EXISTS "Users can insert their own LOIs." ON public.lois;
CREATE POLICY "Users can insert their own LOIs." ON public.lois FOR INSERT WITH CHECK (auth.uid() = company_id);

DROP POLICY IF EXISTS "Users can update their own LOIs (limited)." ON public.lois;
DROP POLICY IF EXISTS "Users can update their own LOIs if not finalized." ON public.lois;
CREATE POLICY "Users can update their own LOIs if not finalized."
  ON public.lois FOR UPDATE
  USING (
    (auth.uid() = company_id AND status = 'searching') OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Only admins can delete LOIs." ON public.lois;
CREATE POLICY "Only admins can delete LOIs." ON public.lois FOR DELETE USING (public.is_admin());

-- 4. Notifications Policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications (mark as read)" ON public.notifications;
CREATE POLICY "Users can update their own notifications (mark as read)"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can create notifications (for the system to handle)" ON public.notifications;
DROP POLICY IF EXISTS "Users can only create notifications for admins or themselves" ON public.notifications;
CREATE POLICY "Users can only create notifications for admins or themselves"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;
CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Storage Buckets & Policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Admins and CMs can upload product images" ON storage.objects;
CREATE POLICY "Admins and CMs can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'community_manager'))
);

-- 6. Functions & Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    company_name, 
    country, 
    city, 
    business_registry_number, 
    representative_name, 
    position, 
    phone
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'company'),
    COALESCE(new.raw_user_meta_data->>'company_name', 'N/A'),
    COALESCE(new.raw_user_meta_data->>'country', 'N/A'),
    COALESCE(new.raw_user_meta_data->>'city', 'N/A'),
    COALESCE(new.raw_user_meta_data->>'business_registry_number', 'N/A'),
    COALESCE(new.raw_user_meta_data->>'representative_name', 'N/A'),
    COALESCE(new.raw_user_meta_data->>'position', 'N/A'),
    COALESCE(new.raw_user_meta_data->>'phone', 'N/A')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    company_name = EXCLUDED.company_name,
    country = EXCLUDED.country,
    city = EXCLUDED.city,
    business_registry_number = EXCLUDED.business_registry_number,
    representative_name = EXCLUDED.representative_name,
    position = EXCLUDED.position,
    phone = EXCLUDED.phone;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
