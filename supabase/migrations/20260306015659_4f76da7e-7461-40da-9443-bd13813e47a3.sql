
-- Team members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Member',
  father_name text NOT NULL DEFAULT '',
  post text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  photo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert team_members" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update team_members" ON public.team_members FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete team_members" ON public.team_members FOR DELETE USING (true);

-- Gallery images table
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gallery_images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Anyone can insert gallery_images" ON public.gallery_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update gallery_images" ON public.gallery_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete gallery_images" ON public.gallery_images FOR DELETE USING (true);

-- Per-class marks configuration
CREATE TABLE public.marks_config (
  class integer PRIMARY KEY,
  total_out_of integer NOT NULL DEFAULT 400
);

ALTER TABLE public.marks_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read marks_config" ON public.marks_config FOR SELECT USING (true);
CREATE POLICY "Anyone can update marks_config" ON public.marks_config FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert marks_config" ON public.marks_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete marks_config" ON public.marks_config FOR DELETE USING (true);

-- Seed default marks config for classes 6-12
INSERT INTO public.marks_config (class, total_out_of) VALUES
  (6, 400), (7, 400), (8, 400), (9, 400), (10, 400), (11, 400), (12, 400);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-photos', 'gallery-photos', true);

-- Storage RLS policies
CREATE POLICY "Public read team-photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');
CREATE POLICY "Anyone can upload team-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'team-photos');
CREATE POLICY "Anyone can update team-photos" ON storage.objects FOR UPDATE USING (bucket_id = 'team-photos');
CREATE POLICY "Anyone can delete team-photos" ON storage.objects FOR DELETE USING (bucket_id = 'team-photos');

CREATE POLICY "Public read gallery-photos" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-photos');
CREATE POLICY "Anyone can upload gallery-photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-photos');
CREATE POLICY "Anyone can update gallery-photos" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-photos');
CREATE POLICY "Anyone can delete gallery-photos" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-photos');
