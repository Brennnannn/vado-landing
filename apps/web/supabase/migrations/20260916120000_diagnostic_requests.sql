-- Leads from the "Book a Process Diagnostic" form, later enriched by the Cal.com webhook
-- once the visitor actually picks a time.

create table public.diagnostic_requests (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),

    name text not null check (char_length(name) between 1 and 200),
    email text not null check (char_length(email) between 3 and 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    company text not null check (char_length(company) between 1 and 200),
    process text not null check (char_length(process) between 1 and 2000),

    status text not null default 'new' check (status in ('new', 'booked', 'cancelled', 'contacted', 'closed')),
    booking_uid text unique,
    booking_start timestamptz
);

comment on table public.diagnostic_requests is 'Landing page diagnostic requests. Anon may insert only; reads/updates are service-role (dashboard, cal-webhook).';

-- The webhook matches bookings back to the latest lead for an email
create index diagnostic_requests_email_created_idx on public.diagnostic_requests (lower(email), created_at desc);

alter table public.diagnostic_requests enable row level security;

-- Public form can create a lead, but can't pre-fill the booking/status columns.
-- No select/update/delete policies: anon can't read anyone's submission back.
create policy "Visitors can submit a diagnostic request"
    on public.diagnostic_requests
    for insert
    to anon, authenticated
    with check (status = 'new' and booking_uid is null and booking_start is null);
