CREATE OR REPLACE FUNCTION public.is_registration_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT registration_status = 'Open'
                     AND COALESCE(exam_notice_type, 'info') NOT IN ('cancelled','rescheduled')
                   FROM public.site_settings WHERE id = 1), false)
$$;

DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.registrations;
CREATE POLICY "Insert registrations only while open"
ON public.registrations FOR INSERT
TO anon, authenticated
WITH CHECK (public.is_registration_open());