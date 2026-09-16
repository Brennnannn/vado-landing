-- Public bucket for site imagery (founder headshots under founders/).
-- Public buckets serve objects by URL without a select policy; there are deliberately no
-- insert/update/delete policies, so uploads happen through the dashboard or service role only.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'public-assets',
    'public-assets',
    true,
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;
