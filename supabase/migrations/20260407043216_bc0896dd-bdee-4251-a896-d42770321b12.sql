ALTER TABLE public.site_settings ADD COLUMN exam_notice TEXT DEFAULT NULL;
ALTER TABLE public.site_settings ADD COLUMN exam_notice_type TEXT DEFAULT 'info';