"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { StarRating } from "@/components/StarRating";
import { SupabaseSetupBanner } from "@/components/SupabaseSetupBanner";
import { fetchReviewsByMalId, getAverageRating } from "@/lib/api";
import { fetchAnimeByMalId } from "@/lib/jikan";
import { formatDate, getRatingColor } from "@/lib/utils";
import type { Anime, Review } from "@/types";

function AnimeDetailContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const malId = idParam ? parseInt(idParam, 10) : NaN;

  const [anime, setAnime] = useState<Anime | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idParam || Number.isNaN(malId)) {
      setLoading(false);
      return;
    }

    async function load() {
      const [animeData, reviewsData] = await Promise.all([
        fetchAnimeByMalId(malId),
        fetchReviewsByMalId(malId),
      ]);
      setAnime(animeData);
      setReviews(reviewsData);
      setLoading(false);
    }
    load();
  }, [idParam, malId]);

  if (!idParam || Number.isNaN(malId)) {
    return (
      <EmptyState
        icon="❓"
        title="애니를 찾을 수 없습니다"
        description="올바른 링크인지 확인해주세요."
        action={
          <Link
            href="/anime"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            애니 목록으로
          </Link>
        }
      />
    );
  }

  if (loading) return <LoadingSpinner />;

  if (!anime) {
    return (
      <EmptyState
        icon="😢"
        title="애니를 찾을 수 없습니다"
        description="존재하지 않거나 불러오지 못한 애니입니다."
        action={
          <Link
            href="/anime"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            애니 목록으로
          </Link>
        }
      />
    );
  }

  const avgRating = getAverageRating(reviews);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/anime" className="text-sm text-muted hover:text-accent">
        ← 애니 목록
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl bg-surface-hover">
          {anime.cover_image ? (
            <Image
              src={anime.cover_image}
              alt={anime.title}
              fill
              className="object-cover"
              sizes="280px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🎬</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{anime.title}</h1>
          {anime.title_jp && <p className="mt-1 text-lg text-muted">{anime.title_jp}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {anime.year && <span className="text-sm text-muted">{anime.year}년</span>}
            {anime.studio && <span className="text-sm text-muted">· {anime.studio}</span>}
            {anime.score !== null && (
              <span className="text-sm text-amber-400">MAL ★ {anime.score}</span>
            )}
            {avgRating !== null && (
              <span className={`text-lg font-bold ${getRatingColor(avgRating)}`}>
                내 커뮤니티 ★ {avgRating} ({reviews.length})
              </span>
            )}
          </div>

          {anime.genres && anime.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-accent-muted px-3 py-1 text-sm text-purple-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {anime.synopsis && (
            <p className="mt-6 leading-relaxed text-muted">{anime.synopsis}</p>
          )}

          <Link
            href={`/write?mal_id=${anime.mal_id}`}
            className="mt-6 inline-block rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            이 애니 리뷰 작성
          </Link>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-white">리뷰 ({reviews.length})</h2>

        <SupabaseSetupBanner />

        {reviews.length === 0 ? (
          <EmptyState
            icon="✍️"
            title="아직 리뷰가 없습니다"
            description="이 애니의 첫 번째 리뷰를 작성해보세요!"
            action={
              <Link
                href={`/write?mal_id=${anime.mal_id}`}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                리뷰 작성하기
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="glass rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{review.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {review.author_name} · {formatDate(review.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getRatingColor(review.rating)}`}>
                      {review.rating}
                    </div>
                    <StarRating value={review.rating} readonly size="sm" />
                  </div>
                </div>
                <p className="mt-4 leading-relaxed text-muted">{review.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function AnimeDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimeDetailContent />
    </Suspense>
  );
}
