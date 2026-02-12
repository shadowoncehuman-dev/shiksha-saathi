
-- Create registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  class INTEGER NOT NULL,
  "group" TEXT NOT NULL,
  phone TEXT NOT NULL,
  village TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Public read/insert for registrations (no auth needed for exam portal)
CREATE POLICY "Anyone can read registrations"
  ON public.registrations FOR SELECT USING (true);

CREATE POLICY "Anyone can insert registrations"
  ON public.registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update registrations"
  ON public.registrations FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete registrations"
  ON public.registrations FOR DELETE USING (true);

-- Roll counters table
CREATE TABLE public.roll_counters (
  class INTEGER PRIMARY KEY,
  last_number INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.roll_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read roll_counters"
  ON public.roll_counters FOR SELECT USING (true);

CREATE POLICY "Anyone can update roll_counters"
  ON public.roll_counters FOR UPDATE USING (true);

-- Seed roll counters for each class
INSERT INTO public.roll_counters (class, last_number) VALUES
  (6, 0), (7, 0), (8, 0), (9, 0), (10, 0), (11, 0), (12, 0);

-- Results table
CREATE TABLE public.results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_number TEXT NOT NULL UNIQUE,
  subject1 INTEGER NOT NULL DEFAULT 0,
  subject2 INTEGER NOT NULL DEFAULT 0,
  subject3 INTEGER NOT NULL DEFAULT 0,
  subject4 INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  grade TEXT NOT NULL DEFAULT 'F',
  status TEXT NOT NULL DEFAULT 'FAIL'
);

ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read results"
  ON public.results FOR SELECT USING (true);

CREATE POLICY "Anyone can insert results"
  ON public.results FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update results"
  ON public.results FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete results"
  ON public.results FOR DELETE USING (true);

-- Site settings table (single row)
CREATE TABLE public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  registration_status TEXT NOT NULL DEFAULT 'Not Started',
  result_status TEXT NOT NULL DEFAULT 'Not Declared',
  result_publish_date TEXT,
  result_expiry_date TEXT
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Anyone can update site_settings"
  ON public.site_settings FOR UPDATE USING (true);

-- Seed initial settings
INSERT INTO public.site_settings (id, registration_status, result_status) VALUES (1, 'Not Started', 'Not Declared');
