-- 애니리뷰 Supabase 스키마
-- 애니 메타데이터는 Jikan API(MyAnimeList)에서 가져오므로,
-- Supabase에는 리뷰만 저장합니다. 애니는 mal_id로 식별합니다.
-- Supabase Dashboard > SQL Editor 에서 실행하세요.

create extension if not exists "uuid-ossp";

-- 리뷰 테이블
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  mal_id integer not null,
  anime_title text not null,
  anime_image text,
  author_name text not null,
  rating integer not null check (rating >= 1 and rating <= 10),
  title text not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- 인덱스
create index if not exists reviews_mal_id_idx on public.reviews(mal_id);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

-- RLS 활성화
alter table public.reviews enable row level security;

-- 읽기: 누구나 가능
create policy "reviews_select_public"
  on public.reviews for select
  using (true);

-- 쓰기: 누구나 가능 (익명 리뷰 허용)
-- 추후 Supabase Auth 연동 시 정책을 변경하세요.
create policy "reviews_insert_public"
  on public.reviews for insert
  with check (true);

-- 샘플 리뷰 (mal_id는 MyAnimeList 기준)
-- 50265: SPY x FAMILY, 40748: 주술회전, 44511: 체인소 맨
insert into public.reviews (mal_id, anime_title, anime_image, author_name, rating, title, content) values
(
  50265,
  'SPY x FAMILY',
  'https://cdn.myanimelist.net/images/anime/1441/122795l.jpg',
  '애니덕후',
  9,
  '가족 드라마의 정석',
  '스파이, 암살자, 초능력자가 한 가족이 된다는 설정이 참신하면서도, 각 캐릭터의 성장과 가족애가 잘 그려져 있습니다. 코미디와 감동의 밸런스가 훌륭해요.'
),
(
  40748,
  'Jujutsu Kaisen',
  'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',
  '주술덕',
  10,
  '2020년대 액션 애니의 기준',
  '작화, 연출, OST 모두 최고 수준입니다. 특히 시부야 사건 편은 애니메이션 역사에 남을 명작이에요.'
),
(
  44511,
  'Chainsaw Man',
  'https://cdn.myanimelist.net/images/anime/1806/126216l.jpg',
  '맨덕',
  8,
  '독특한 분위기의 액션작',
  'MAPPA 특유의 화려한 연출과 독특한 세계관이 매력적입니다. 다소 잔인한 장면이 있지만, 그만큼 몰입감이 뛰어납니다.'
);
