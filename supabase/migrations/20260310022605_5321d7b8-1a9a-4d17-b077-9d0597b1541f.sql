
CREATE TABLE public.winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  rank integer NOT NULL CHECK (rank BETWEEN 1 AND 3),
  name text NOT NULL,
  father_name text NOT NULL DEFAULT '',
  class integer NOT NULL,
  group_name text NOT NULL DEFAULT '',
  roll_number text NOT NULL DEFAULT '',
  percentage numeric(5,2) NOT NULL DEFAULT 0,
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(year, rank)
);

ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read winners" ON public.winners FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert winners" ON public.winners FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update winners" ON public.winners FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete winners" ON public.winners FOR DELETE TO public USING (true);
