import type { Anime } from "@/types";

const JIKAN_BASE = "https://api.jikan.moe/v4";

interface JikanImage {
  image_url?: string;
  large_image_url?: string;
}

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  title_japanese?: string | null;
  images?: {
    jpg?: JikanImage;
    webp?: JikanImage;
  };
  synopsis?: string | null;
  genres?: { name: string }[];
  year?: number | null;
  aired?: { prop?: { from?: { year?: number | null } } };
  studios?: { name: string }[];
  score?: number | null;
}

interface JikanPagination {
  has_next_page: boolean;
  current_page: number;
  last_visible_page: number;
}

export interface JikanListResult {
  anime: Anime[];
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
}

// Jikan은 한국어 제목을 제공하지 않아, 공식 한국어 제목(라프텔/넷플릭스 기준)을
// mal_id 기준으로 오버라이드합니다. 목록에 없는 작품은 Jikan 원제목을 그대로 사용합니다.
const KO_TITLE_OVERRIDES: Record<number, string> = {
  5114: "강철의 연금술사: 브라더후드",
  9253: "슈타인즈 게이트",
  11061: "헌터×헌터",
  16498: "진격의 거인",
  1535: "데스노트",
  30276: "원펀맨",
  38000: "귀멸의 칼날",
  52991: "장송의 프리렌",
  21: "원피스",
  32281: "너의 이름은.",
  50265: "스파이 패밀리",
  40748: "주술회전",
  44511: "체인소 맨",
};

function mapAnime(item: JikanAnime): Anime {
  return {
    mal_id: item.mal_id,
    title: KO_TITLE_OVERRIDES[item.mal_id] || item.title_english || item.title,
    title_jp: item.title_japanese ?? null,
    cover_image:
      item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
    synopsis: item.synopsis ?? null,
    genres: item.genres?.map((g) => g.name) ?? [],
    year: item.year ?? item.aired?.prop?.from?.year ?? null,
    studio: item.studios?.map((s) => s.name).join(", ") || null,
    score: item.score ?? null,
  };
}

async function jikanFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JIKAN_BASE}${path}`);
    if (!res.ok) {
      console.error(`jikan ${path}: ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error(`jikan ${path}:`, err);
    return null;
  }
}

export async function fetchTopAnime(page = 1): Promise<JikanListResult> {
  const data = await jikanFetch<{ data: JikanAnime[]; pagination: JikanPagination }>(
    `/top/anime?page=${page}&limit=24`
  );

  if (!data) {
    return { anime: [], hasNextPage: false, currentPage: page, lastPage: page };
  }

  return {
    anime: data.data.map(mapAnime),
    hasNextPage: data.pagination?.has_next_page ?? false,
    currentPage: data.pagination?.current_page ?? page,
    lastPage: data.pagination?.last_visible_page ?? page,
  };
}

export async function searchAnime(query: string, page = 1): Promise<JikanListResult> {
  const data = await jikanFetch<{ data: JikanAnime[]; pagination: JikanPagination }>(
    `/anime?q=${encodeURIComponent(query)}&page=${page}&limit=24&order_by=members&sort=desc&sfw=true`
  );

  if (!data) {
    return { anime: [], hasNextPage: false, currentPage: page, lastPage: page };
  }

  return {
    anime: data.data.map(mapAnime),
    hasNextPage: data.pagination?.has_next_page ?? false,
    currentPage: data.pagination?.current_page ?? page,
    lastPage: data.pagination?.last_visible_page ?? page,
  };
}

export async function fetchAnimeByMalId(malId: number): Promise<Anime | null> {
  const data = await jikanFetch<{ data: JikanAnime }>(`/anime/${malId}/full`);
  if (!data?.data) return null;
  return mapAnime(data.data);
}
