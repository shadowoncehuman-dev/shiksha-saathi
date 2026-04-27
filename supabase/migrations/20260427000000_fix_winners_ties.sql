-- Fix winners table to allow tied ranks
ALTER TABLE public.winners DROP CONSTRAINT winners_year_group_rank_key;