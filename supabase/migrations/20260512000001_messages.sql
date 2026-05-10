-- Two-way chat between inquiry participants (tenant + landlord).
-- Inquiries serve as thread roots; one message thread per inquiry row.

create table public.messages (
  id           uuid primary key default gen_random_uuid(),
  inquiry_id   uuid not null references public.inquiries(id) on delete cascade,
  sender_id    uuid not null references auth.users(id) on delete cascade,
  body         text,
  attachments  text[] not null default '{}',
  read_at      timestamptz,
  created_at   timestamptz not null default now(),
  check (
    coalesce(length(trim(body)), 0) > 0
    or coalesce(array_length(attachments, 1), 0) > 0
  )
);

create index messages_inquiry_idx on public.messages (inquiry_id, created_at);

alter table public.messages enable row level security;

create or replace function public.is_inquiry_participant(_inquiry_id uuid, _user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.inquiries i
    join public.listings  l on l.id = i.listing_id
    where i.id = _inquiry_id
      and (i.inquirer_id = _user_id or l.owner_id = _user_id)
  );
$$;

create policy "messages: participants read"
  on public.messages for select
  to authenticated
  using ( public.is_inquiry_participant(inquiry_id, auth.uid()) );

create policy "messages: participants insert"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and public.is_inquiry_participant(inquiry_id, auth.uid())
  );

create policy "messages: recipient marks read"
  on public.messages for update
  to authenticated
  using (
    public.is_inquiry_participant(inquiry_id, auth.uid())
    and sender_id <> auth.uid()
  )
  with check (
    public.is_inquiry_participant(inquiry_id, auth.uid())
    and sender_id <> auth.uid()
  );

alter publication supabase_realtime add table public.messages;
