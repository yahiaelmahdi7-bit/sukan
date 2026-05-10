-- Feature 2: listing-photos storage bucket + policies
-- Apply via: supabase db push

-- Create the bucket (public = readable without auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  5242880,  -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Policy 1: Public read
create policy "Public read listing photos"
  on storage.objects for select
  using ( bucket_id = 'listing-photos' );

-- Policy 2: Authenticated users can upload
create policy "Authenticated upload listing photos"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'listing-photos' );

-- Policy 3: Owner can delete their own photos
-- Path convention: {userId}/{listingId}/{filename}
create policy "Owner delete listing photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
