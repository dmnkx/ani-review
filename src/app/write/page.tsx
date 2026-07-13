"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StarRating } from "@/components/StarRating";
import { SupabaseSetupBanner } from "@/components/SupabaseSetupBanner";
import { createReview } from "@/lib/api";
import { fetchAnimeByMalId, searchAnime } from "@/lib/jikan";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Anime } from "@/types";

function WriteReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedMalId = searchParams.get("mal_id");

  const [selected, setSelected] = useState<Anime | null>(null);
  const [initLoading, setInitLoading] = useState(Boolean(preselectedMalId));

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRequest = useRef(0);

  const [form, setForm] = useState({
    author_name: "",
    rating: 8,
    title: "",
    content: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!preselectedMalId) return;
    const malId = parseInt(preselectedMalId, 10);
    if (Number.isNaN(malId)) {
      setInitLoading(false);
      return;
    }
    fetchAnimeByMalId(malId).then((anime) => {
      setSelected(anime);
      setInitLoading(false);
    });
  }, [preselectedMalId]);

  useEffect(() => {
    if (selected || !search.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const currentRequest = ++searchRequest.current;
      setSearching(true);
      const result = await searchAnime(search.trim(), 1);
      if (currentRequest !== searchRequest.current) return;
      setResults(result.anime);
      setSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selected]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selected) {
      setError("리뷰할 애니를 선택해주세요.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError("Supabase 환경 변수가 설정되지 않았습니다.");
      return;
    }

    if (!form.author_name.trim() || !form.title.trim() || !form.content.trim()) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    const review = await createReview({
      mal_id: selected.mal_id,
      anime_title: selected.title,
      anime_image: selected.cover_image,
      author_name: form.author_name.trim(),
      rating: form.rating,
      title: form.title.trim(),
      content: form.content.trim(),
    });

    if (!review) {
      setError("리뷰 작성에 실패했습니다. 다시 시도해주세요.");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(`/anime/view?id=${selected.mal_id}`);
    }, 1500);
  }

  if (initLoading) return <LoadingSpinner />;

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl">🎉</span>
        <h2 className="mt-4 text-xl font-bold text-white">리뷰가 등록되었습니다!</h2>
        <p className="mt-2 text-muted">잠시 후 애니 페이지로 이동합니다...</p>
      </div>
    );
  }

  const inputClass =
    "glass w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none";
  const labelClass = "mb-2 block text-sm font-medium text-white";

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/reviews" className="text-sm text-muted hover:text-accent">
        ← 리뷰 목록
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-white">리뷰 작성</h1>
      <p className="mt-2 text-muted">애니를 검색해 선택하고 리뷰를 남겨주세요</p>

      <SupabaseSetupBanner />

      <div className="mt-8 space-y-6">
        {/* Anime selection */}
        <div>
          <label className={labelClass}>
            애니 선택 <span className="text-rose-400">*</span>
          </label>

          {selected ? (
            <div className="glass flex items-center gap-4 rounded-xl p-4">
              {selected.cover_image && (
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={selected.cover_image}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{selected.title}</p>
                {selected.title_jp && (
                  <p className="truncate text-sm text-muted">{selected.title_jp}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setSearch("");
                }}
                className="shrink-0 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-hover hover:text-white"
              >
                변경
              </button>
            </div>
          ) : (
            <>
              <input
                type="search"
                placeholder="애니 제목으로 검색 (예: 주술회전)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={inputClass}
                autoComplete="off"
              />

              {searching && (
                <p className="mt-2 text-sm text-muted">검색 중...</p>
              )}

              {!searching && results.length > 0 && (
                <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
                  {results.map((anime) => (
                    <button
                      key={anime.mal_id}
                      type="button"
                      onClick={() => {
                        setSelected(anime);
                        setResults([]);
                      }}
                      className="glass flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:border-accent/40"
                    >
                      {anime.cover_image && (
                        <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={anime.cover_image}
                            alt={anime.title}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {anime.title}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {[anime.year, anime.studio].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="author_name" className={labelClass}>
              닉네임 <span className="text-rose-400">*</span>
            </label>
            <input
              id="author_name"
              type="text"
              value={form.author_name}
              onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              placeholder="리뷰어 닉네임"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              평점 <span className="text-rose-400">*</span>
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                value={form.rating}
                onChange={(rating) => setForm({ ...form, rating })}
              />
              <span className="text-lg font-bold text-amber-400">{form.rating}/10</span>
            </div>
          </div>

          <div>
            <label htmlFor="review_title" className={labelClass}>
              리뷰 제목 <span className="text-rose-400">*</span>
            </label>
            <input
              id="review_title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="한 줄 요약"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="content" className={labelClass}>
              리뷰 내용 <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              placeholder="이 애니에 대한 솔직한 리뷰를 작성해주세요"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-accent py-3 font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "등록 중..." : "리뷰 등록"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WriteReviewContent />
    </Suspense>
  );
}
