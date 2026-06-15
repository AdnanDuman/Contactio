-- Contactio – Supabase Schema
-- Im Supabase SQL Editor ausführen.

create extension if not exists "pgcrypto";

create table if not exists public.contacts (
  id           uuid primary key default gen_random_uuid(),
  salutation   text        not null default '',
  title        text        not null default '',
  first_name   text        not null default '',
  last_name    text        not null default '',
  position     text        not null default '',
  department   text        not null default '',
  company      text        not null default '',
  street       text        not null default '',
  postal_code  text        not null default '',
  city         text        not null default '',
  country      text        not null default '',
  -- Kontaktmöglichkeiten als JSON-Array:
  -- [{ "id": "...", "kind": "phone|mobile|email", "label": "Geschäftlich", "value": "..." }]
  channels     jsonb       not null default '[]'::jsonb,
  notes        text        not null default '',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists contacts_last_name_idx on public.contacts (last_name);
create index if not exists contacts_company_idx on public.contacts (company);

-- updated_at automatisch pflegen
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.contacts enable row level security;

-- Demo-Policy: voller Zugriff (für Entwicklung).
-- In Produktion durch auth-basierte Policies ersetzen!
drop policy if exists "contacts_all_access" on public.contacts;
create policy "contacts_all_access"
  on public.contacts for all
  using (true)
  with check (true);

-- Optionale Beispieldaten
insert into public.contacts
  (salutation, title, first_name, last_name, position, department, company,
   street, postal_code, city, country, channels, notes)
values
  ('Frau', 'Dr.', 'Lena', 'Hoffmann', 'Head of Treasury', 'Finance', 'Nordbank AG',
   'Ballindamm 27', '20095', 'Hamburg', 'Deutschland',
   '[{"id":"s1","kind":"phone","label":"Geschäftlich","value":"+49 40 123 456-0"},
     {"id":"s2","kind":"mobile","label":"Privat","value":"+49 151 2345 6789"},
     {"id":"s3","kind":"email","label":"Geschäftlich","value":"l.hoffmann@nordbank.de"}]'::jsonb,
   'Bevorzugt Termine am Vormittag.'),
  ('Herr', '', 'Marco', 'Bertsch', 'Procurement Lead', 'Einkauf', 'Helvetia Logistics GmbH',
   'Industriestraße 4', '70565', 'Stuttgart', 'Deutschland',
   '[{"id":"s4","kind":"phone","label":"Zentrale","value":"+49 711 998 22-100"},
     {"id":"s5","kind":"email","label":"Geschäftlich","value":"m.bertsch@helvetia-log.com"}]'::jsonb,
   'Reagiert schneller per E-Mail.')
on conflict do nothing;
