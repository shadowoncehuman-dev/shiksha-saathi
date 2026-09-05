ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS exam_year integer NOT NULL DEFAULT 2027;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS exam_year integer NOT NULL DEFAULT 2027;

UPDATE public.registrations SET exam_year = 2026;
UPDATE public.results SET exam_year = 2026;

DROP INDEX IF EXISTS public.idx_unique_registration;
CREATE UNIQUE INDEX idx_unique_registration
  ON public.registrations (exam_year, LOWER(TRIM(name)), LOWER(TRIM(father_name)), class);

CREATE INDEX IF NOT EXISTS idx_registrations_exam_year ON public.registrations (exam_year);
CREATE INDEX IF NOT EXISTS idx_results_exam_year ON public.results (exam_year);