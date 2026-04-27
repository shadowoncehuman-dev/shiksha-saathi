-- Alter winners table to allow separate ranks per group
ALTER TABLE public.winners DROP CONSTRAINT winners_year_rank_key;
ALTER TABLE public.winners ADD CONSTRAINT winners_year_group_rank_key UNIQUE(year, group_name, rank);
ALTER TABLE public.winners DROP CONSTRAINT winners_rank_check;
ALTER TABLE public.winners ADD CONSTRAINT winners_rank_check CHECK (rank BETWEEN 1 AND 3);