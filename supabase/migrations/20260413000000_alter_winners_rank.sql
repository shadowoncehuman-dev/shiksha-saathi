-- Alter winners table to allow ranks 1-6 instead of 1-3
ALTER TABLE public.winners DROP CONSTRAINT winners_rank_check;
ALTER TABLE public.winners ADD CONSTRAINT winners_rank_check CHECK (rank BETWEEN 1 AND 6);