"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimeCard } from "@/components/AnimeCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { fetchTopAnime, searchAnime } from "@/lib/jikan";
import type { Anime } from "@/types";

export default function AnimeListPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const requestId = useRef(0);

  const load = useCallback(
    async (query: string, nextPage: number, append: boolean) => {
      const currentRequest = ++requestId.current;
      if (append) setLoadingMore(true);
      else setLoading(true);

      const result = query.trim()
        ? await searchAnime(query.trim(), nextPage)
        : await fetchTopAnime(nextPage);

      if (currentRequest !== requestId.current) return;

      setAnimeList((prev) => {
        const base = append ? prev : [];
        const seen = new Set(base.map((a) => a.mal_id));
        const merged = [...base];
        for (const a of result.anime) {
          if (!seen.has(a.mal_id)) {
            seen.add(a.mal_id);
            merged.push(a);
          }
        }
        return merged;
      });
      setHasNext(result.hasNextPage);
      setPage(result.currentPage);
      setLoading(false);
      setLoadingMore(false);
    },
    []
  );

  useEffect(() => {
    load("", 1, false);
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveQuery(search);
      load(search, 1, false);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function handleLoadMore() {
    load(activeQuery, page + 1, true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">애니 목록</h1>
        <p className="mt-2 text-muted">MyAnimeList 인기 애니메이션 (Jikan API)</p>
      </div>

      <div className="mb-8">
        <input
          type="search"
          placeholder="애니 제목으로 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="glass w-full max-w-md rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : animeList.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없습니다"
          description="다른 키워드로 검색해보세요."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {animeList.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>

          {hasNext && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {loadingMore ? "불러오는 중..." : "더 보기"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
