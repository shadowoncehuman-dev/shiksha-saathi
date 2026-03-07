
-- Create pdfs table
create table public.pdfs (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  file_url text not null,
  file_name text not null default '',
  category text not null default 'General',
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default now()
);

alter table public.pdfs enable row level security;

create policy "Anyone can read pdfs" on public.pdfs for select using (true);
create policy "Anyone can insert pdfs" on public.pdfs for insert with check (true);
create policy "Anyone can update pdfs" on public.pdfs for update using (true);
create policy "Anyone can delete pdfs" on public.pdfs for delete using (true);

-- Create storage bucket for PDFs
insert into storage.buckets (id, name, public) values ('pdf-files', 'pdf-files', true);

-- Storage policies for pdf-files bucket
create policy "Anyone can read pdf files" on storage.objects for select using (bucket_id = 'pdf-files');
create policy "Anyone can upload pdf files" on storage.objects for insert with check (bucket_id = 'pdf-files');
create policy "Anyone can delete pdf files" on storage.objects for delete using (bucket_id = 'pdf-files');
