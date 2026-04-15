-- MedGym Supabase スキーマ
-- Supabase Dashboard → SQL Editor にコピペして一度だけ実行してください

-- ────────────────────────────────────────
-- プロフィール(表示名を保存)
-- ────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  created_at timestamptz default now()
);

-- サインアップ時に auto で profiles 行を作るトリガ
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ────────────────────────────────────────
-- ワークアウト記録
-- ────────────────────────────────────────
create table if not exists public.workouts (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  muscle_group text not null,
  exercise_id text not null,
  exercise_name text not null,
  reps int not null,
  sets int not null,
  weight_kg numeric not null,
  created_at timestamptz default now()
);
create index if not exists workouts_user_date_idx on public.workouts (user_id, date);

-- ────────────────────────────────────────
-- カスタムメニュー
-- ────────────────────────────────────────
create table if not exists public.custom_exercises (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  muscle_group text not null,
  name text not null,
  created_at timestamptz default now()
);
create index if not exists custom_exercises_user_idx on public.custom_exercises (user_id);

-- ────────────────────────────────────────
-- 閲覧済み問題
-- ────────────────────────────────────────
create table if not exists public.viewed_questions (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  exercise_id text not null,
  question_id text not null,
  created_at timestamptz default now(),
  unique(user_id, question_id)
);
create index if not exists viewed_questions_user_date_idx on public.viewed_questions (user_id, date);

-- ────────────────────────────────────────
-- クイズ結果
-- ────────────────────────────────────────
create table if not exists public.quiz_results (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  exercise_id text not null,
  selected_answer int not null,
  is_correct boolean not null,
  created_at timestamptz default now()
);
create index if not exists quiz_results_user_date_idx on public.quiz_results (user_id, date);

-- ────────────────────────────────────────
-- Row Level Security: 自分の行だけ見れる/触れる
-- ────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.custom_exercises enable row level security;
alter table public.viewed_questions enable row level security;
alter table public.quiz_results enable row level security;

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users manage own workouts" on public.workouts;
create policy "Users manage own workouts" on public.workouts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own custom exercises" on public.custom_exercises;
create policy "Users manage own custom exercises" on public.custom_exercises
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own viewed questions" on public.viewed_questions;
create policy "Users manage own viewed questions" on public.viewed_questions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users manage own quiz results" on public.quiz_results;
create policy "Users manage own quiz results" on public.quiz_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
