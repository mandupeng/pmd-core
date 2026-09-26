-- Run once in the shared PMD Supabase project (SQL editor).
-- Then per product:  select public.pmd_create_product_schema('translator');
-- and add the slug to Settings > API > Exposed schemas.
create or replace function public.pmd_create_product_schema(slug text) returns void
language plpgsql security definer as $$
begin
  execute format('create schema if not exists %I', slug);
  execute format('grant usage on schema %I to anon, authenticated, service_role', slug);
  execute format('alter default privileges in schema %I grant all on tables to authenticated, service_role', slug);
  execute format($f$create table if not exists %I.profiles (
    id uuid primary key references auth.users on delete cascade,
    display_name text,
    created_at timestamptz not null default now())$f$, slug);
  execute format('alter table %I.profiles enable row level security', slug);
  execute format('drop policy if exists "own profile" on %I.profiles', slug);
  execute format($f$create policy "own profile" on %I.profiles for all to authenticated
    using (id = auth.uid()) with check (id = auth.uid())$f$, slug);
  execute format('grant all on %I.profiles to authenticated, service_role', slug);
end $$;

revoke all on function public.pmd_create_product_schema(text) from public, anon, authenticated;
