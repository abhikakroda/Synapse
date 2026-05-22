-- Synapse Supabase setup
-- Run this file in the Supabase SQL editor. It is safe to run more than once.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  program text,
  college text default '',
  message text default '',
  created_at timestamptz default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text,
  phone text not null,
  email text,
  name text not null,
  college text default '',
  updated_at timestamptz default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  clerk_id text,
  email text,
  phone text not null,
  name text,
  course text not null,
  payment_id text not null,
  amount numeric default 0,
  status text default 'paid',
  created_at timestamptz default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  cert_id text not null,
  student_name text,
  course text,
  issued_at date,
  status text default 'valid',
  created_at timestamptz default now()
);

create table if not exists public.admin_workshops (
  id text primary key,
  title text not null,
  host text,
  status text default 'upcoming',
  day text,
  date text,
  month text,
  time text,
  description text,
  youtube_url text,
  google_meet_url text,
  details jsonb default '[]'::jsonb,
  resources jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.admin_courses (
  slug text primary key,
  title text not null,
  mentor text,
  role text,
  status text,
  cta text,
  price text,
  old_price text,
  discount text,
  duration text,
  poster text,
  summary text,
  bundle text,
  highlights jsonb default '[]'::jsonb,
  syllabus jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.admin_coupons (
  code text primary key,
  course_slug text default 'ai-ml',
  type text default 'flat',
  discount numeric default 0,
  usage_limit integer default 0,
  used_count integer default 0,
  active boolean default true,
  deleted boolean default false,
  expires_at timestamptz,
  updated_at timestamptz default now()
);

alter table public.leads add column if not exists id uuid default gen_random_uuid();
alter table public.leads add column if not exists name text;
alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists program text;
alter table public.leads add column if not exists college text default '';
alter table public.leads add column if not exists message text default '';
alter table public.leads add column if not exists created_at timestamptz default now();

alter table public.users add column if not exists id uuid default gen_random_uuid();
alter table public.users add column if not exists clerk_id text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists email text;
alter table public.users add column if not exists name text;
alter table public.users add column if not exists college text default '';
alter table public.users add column if not exists updated_at timestamptz default now();

alter table public.purchases add column if not exists id uuid default gen_random_uuid();
alter table public.purchases add column if not exists clerk_id text;
alter table public.purchases add column if not exists email text;
alter table public.purchases add column if not exists phone text;
alter table public.purchases add column if not exists name text;
alter table public.purchases add column if not exists course text;
alter table public.purchases add column if not exists payment_id text;
alter table public.purchases add column if not exists amount numeric default 0;
alter table public.purchases add column if not exists status text default 'paid';
alter table public.purchases add column if not exists created_at timestamptz default now();

alter table public.certificates add column if not exists id uuid default gen_random_uuid();
alter table public.certificates add column if not exists cert_id text;
alter table public.certificates add column if not exists student_name text;
alter table public.certificates add column if not exists course text;
alter table public.certificates add column if not exists issued_at date;
alter table public.certificates add column if not exists status text default 'valid';
alter table public.certificates add column if not exists created_at timestamptz default now();

alter table public.admin_workshops add column if not exists title text;
alter table public.admin_workshops add column if not exists host text;
alter table public.admin_workshops add column if not exists status text default 'upcoming';
alter table public.admin_workshops add column if not exists day text;
alter table public.admin_workshops add column if not exists date text;
alter table public.admin_workshops add column if not exists month text;
alter table public.admin_workshops add column if not exists time text;
alter table public.admin_workshops add column if not exists description text;
alter table public.admin_workshops add column if not exists youtube_url text;
alter table public.admin_workshops add column if not exists google_meet_url text;
alter table public.admin_workshops add column if not exists details jsonb default '[]'::jsonb;
alter table public.admin_workshops add column if not exists resources jsonb default '[]'::jsonb;
alter table public.admin_workshops add column if not exists updated_at timestamptz default now();

alter table public.admin_courses add column if not exists title text;
alter table public.admin_courses add column if not exists mentor text;
alter table public.admin_courses add column if not exists role text;
alter table public.admin_courses add column if not exists status text;
alter table public.admin_courses add column if not exists cta text;
alter table public.admin_courses add column if not exists price text;
alter table public.admin_courses add column if not exists old_price text;
alter table public.admin_courses add column if not exists discount text;
alter table public.admin_courses add column if not exists duration text;
alter table public.admin_courses add column if not exists poster text;
alter table public.admin_courses add column if not exists summary text;
alter table public.admin_courses add column if not exists bundle text;
alter table public.admin_courses add column if not exists highlights jsonb default '[]'::jsonb;
alter table public.admin_courses add column if not exists syllabus jsonb default '[]'::jsonb;
alter table public.admin_courses add column if not exists projects jsonb default '[]'::jsonb;
alter table public.admin_courses add column if not exists updated_at timestamptz default now();

alter table public.admin_coupons add column if not exists course_slug text default 'ai-ml';
alter table public.admin_coupons add column if not exists type text default 'flat';
alter table public.admin_coupons add column if not exists discount numeric default 0;
alter table public.admin_coupons add column if not exists usage_limit integer default 0;
alter table public.admin_coupons add column if not exists used_count integer default 0;
alter table public.admin_coupons add column if not exists active boolean default true;
alter table public.admin_coupons add column if not exists deleted boolean default false;
alter table public.admin_coupons add column if not exists expires_at timestamptz;
alter table public.admin_coupons add column if not exists updated_at timestamptz default now();

drop index if exists purchases_payment_id_key;
drop index if exists users_phone_key;
drop index if exists certificates_cert_id_key;
drop index if exists admin_workshops_id_key;
drop index if exists admin_courses_slug_key;
drop index if exists admin_coupons_code_key;

create unique index if not exists users_clerk_id_key on public.users (clerk_id) where clerk_id is not null;
create index if not exists purchases_payment_id_idx on public.purchases (payment_id);

do $$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_class t on t.oid = i.indrelid
    join pg_namespace n on n.oid = t.relnamespace
    join pg_attribute a on a.attrelid = t.oid and a.attnum = any(i.indkey)
    where n.nspname = 'public'
      and t.relname = 'users'
      and i.indisunique
      and array_length(i.indkey, 1) = 1
      and a.attname = 'phone'
  ) then
    create unique index users_phone_key on public.users (phone);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_class t on t.oid = i.indrelid
    join pg_namespace n on n.oid = t.relnamespace
    join pg_attribute a on a.attrelid = t.oid and a.attnum = any(i.indkey)
    where n.nspname = 'public'
      and t.relname = 'certificates'
      and i.indisunique
      and array_length(i.indkey, 1) = 1
      and a.attname = 'cert_id'
  ) then
    create unique index certificates_cert_id_key on public.certificates (cert_id);
  end if;
end $$;

alter table public.leads enable row level security;
alter table public.users enable row level security;
alter table public.purchases enable row level security;
alter table public.certificates enable row level security;
alter table public.admin_workshops enable row level security;
alter table public.admin_courses enable row level security;
alter table public.admin_coupons enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on
  public.leads,
  public.users,
  public.purchases,
  public.certificates,
  public.admin_workshops,
  public.admin_courses,
  public.admin_coupons
to anon, authenticated;

drop policy if exists "Anyone can create leads" on public.leads;
drop policy if exists "Allow all" on public.leads;
drop policy if exists "Anon can manage leads" on public.leads;
drop policy if exists "Allow all" on public.users;
drop policy if exists "Anon can manage users" on public.users;
drop policy if exists "Allow all" on public.purchases;
drop policy if exists "Anon can manage purchases" on public.purchases;
drop policy if exists "Allow all" on public.certificates;
drop policy if exists "Public can verify certificates" on public.certificates;
drop policy if exists "Anon can manage certificates" on public.certificates;
drop policy if exists "Public can read admin workshops" on public.admin_workshops;
drop policy if exists "Public can read admin courses" on public.admin_courses;
drop policy if exists "Public can read active coupons" on public.admin_coupons;
drop policy if exists "Anon can manage admin workshops" on public.admin_workshops;
drop policy if exists "Anon can insert admin workshops" on public.admin_workshops;
drop policy if exists "Anon can update admin workshops" on public.admin_workshops;
drop policy if exists "Anon can delete admin workshops" on public.admin_workshops;
drop policy if exists "Anon can manage admin courses" on public.admin_courses;
drop policy if exists "Anon can insert admin courses" on public.admin_courses;
drop policy if exists "Anon can update admin courses" on public.admin_courses;
drop policy if exists "Anon can delete admin courses" on public.admin_courses;
drop policy if exists "Anon can manage admin coupons" on public.admin_coupons;
drop policy if exists "Anon can insert admin coupons" on public.admin_coupons;
drop policy if exists "Anon can update admin coupons" on public.admin_coupons;
drop policy if exists "Anon can delete admin coupons" on public.admin_coupons;

create policy "Anon can manage leads"
  on public.leads for all
  using (true)
  with check (true);

create policy "Anon can manage users"
  on public.users for all
  using (true)
  with check (true);

create policy "Anon can manage purchases"
  on public.purchases for all
  using (true)
  with check (true);

create policy "Public can verify certificates"
  on public.certificates for select
  using (status = 'valid');

create policy "Anon can manage certificates"
  on public.certificates for all
  using (true)
  with check (true);

create policy "Public can read admin workshops"
  on public.admin_workshops for select
  using (true);

create policy "Public can read admin courses"
  on public.admin_courses for select
  using (true);

create policy "Public can read active coupons"
  on public.admin_coupons for select
  using (active = true and deleted = false);

create policy "Anon can insert admin workshops"
  on public.admin_workshops for insert
  with check (true);

create policy "Anon can update admin workshops"
  on public.admin_workshops for update
  using (true)
  with check (true);

create policy "Anon can delete admin workshops"
  on public.admin_workshops for delete
  using (true);

create policy "Anon can insert admin courses"
  on public.admin_courses for insert
  with check (true);

create policy "Anon can update admin courses"
  on public.admin_courses for update
  using (true)
  with check (true);

create policy "Anon can delete admin courses"
  on public.admin_courses for delete
  using (true);

create policy "Anon can insert admin coupons"
  on public.admin_coupons for insert
  with check (true);

create policy "Anon can update admin coupons"
  on public.admin_coupons for update
  using (true)
  with check (true);

create policy "Anon can delete admin coupons"
  on public.admin_coupons for delete
  using (true);
