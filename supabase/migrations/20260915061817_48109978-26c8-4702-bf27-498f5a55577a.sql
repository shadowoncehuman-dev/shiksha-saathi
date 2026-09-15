CREATE TABLE public.exam_config (
  id integer PRIMARY KEY DEFAULT 1,
  exam_year integer NOT NULL DEFAULT 2027,
  exam_date text NOT NULL DEFAULT '11 April 2027',
  exam_center text NOT NULL DEFAULT 'Govt. School, Nayagaon',
  group1_classes text NOT NULL DEFAULT '6,7,8',
  group1_time text NOT NULL DEFAULT '11:00-12:30',
  group2_classes text NOT NULL DEFAULT '9,10,11,12',
  group2_time text NOT NULL DEFAULT '14:00-16:00',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT exam_config_singleton CHECK (id = 1)
);

GRANT SELECT ON public.exam_config TO anon;
GRANT SELECT, INSERT, UPDATE ON public.exam_config TO authenticated;
GRANT ALL ON public.exam_config TO service_role;

ALTER TABLE public.exam_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exam_config" ON public.exam_config FOR SELECT USING (true);
CREATE POLICY "Anyone can update exam_config" ON public.exam_config FOR UPDATE USING (true) WITH CHECK (true);

GRANT UPDATE ON public.exam_config TO anon;

INSERT INTO public.exam_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.touch_exam_config() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER exam_config_touch BEFORE UPDATE ON public.exam_config FOR EACH ROW EXECUTE FUNCTION public.touch_exam_config();