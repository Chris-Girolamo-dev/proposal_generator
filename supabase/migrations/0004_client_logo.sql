-- Client logo: uploaded per-proposal, auto-populated into the header on every page.

alter table public.proposals
  add column if not exists client_logo_url text;

-- Public bucket: logos need to render in the exported PDF (fetched by headless Chromium)
-- without auth, and they aren't sensitive. Writes are restricted to authenticated users.
insert into storage.buckets (id, name, public)
values ('client-logos', 'client-logos', true)
on conflict (id) do nothing;

drop policy if exists "Public read client logos" on storage.objects;
create policy "Public read client logos"
  on storage.objects for select
  using (bucket_id = 'client-logos');

drop policy if exists "Authenticated upload client logos" on storage.objects;
create policy "Authenticated upload client logos"
  on storage.objects for insert
  with check (bucket_id = 'client-logos' and auth.uid() is not null);

drop policy if exists "Authenticated update client logos" on storage.objects;
create policy "Authenticated update client logos"
  on storage.objects for update
  using (bucket_id = 'client-logos' and auth.uid() is not null);

drop policy if exists "Authenticated delete client logos" on storage.objects;
create policy "Authenticated delete client logos"
  on storage.objects for delete
  using (bucket_id = 'client-logos' and auth.uid() is not null);
