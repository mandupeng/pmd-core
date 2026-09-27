-- Run once in the shared PMD Supabase project (SQL editor), same place as 0001.
-- Only for products whose intake picked monetization = 'membership':
--   select public.pmd_enable_membership('translator');
create or replace function public.pmd_enable_membership(slug text) returns void
language plpgsql security definer as $$
begin
  execute format($f$create table if not exists %I.subscriptions (
    user_id uuid primary key references auth.users on delete cascade,
    tier text not null,
    stripe_customer_id text not null,
    stripe_subscription_id text not null unique,
    status text not null,
    current_period_end timestamptz not null,
    updated_at timestamptz not null default now())$f$, slug);
  execute format('alter table %I.subscriptions enable row level security', slug);
  execute format('drop policy if exists "own subscription" on %I.subscriptions', slug);
  -- Read-only for the user; writes go through the service role from the webhook handler only.
  execute format($f$create policy "own subscription" on %I.subscriptions for select to authenticated
    using (user_id = auth.uid())$f$, slug);
  execute format('grant select on %I.subscriptions to authenticated', slug);
  execute format('grant all on %I.subscriptions to service_role', slug);
end $$;

revoke all on function public.pmd_enable_membership(text) from public, anon, authenticated;
