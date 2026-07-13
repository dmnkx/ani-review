"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimeCard } from "@/components/AnimeCard";
import { ReviewCard } from "@/components/ReviewCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { SupabaseSetupBanner } from "@/components/SupabaseSetupBanner";
import { fetchRecentReviews } from "@/lib/api";
import { fetchTopAnime } from "@/lib/jikan";
import type { Anime, Review } from "@/types";

export default function HomePage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [animeLoading, setAnimeLoading] = useState(true);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetchTopAnime(1).then((result) => {
      setAnimeList(result.anime.slice(0, 8));
      setAnimeLoading(false);
    });
    fetchRecentReviews(4).then((reviews) => {
      setRecentReviews(reviews);
      setReviewsLoading(false);
    });
  }, []);

  return (
    <>
      <SupabaseSetupBanner />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            좋아하는 애니를
            <br />
            <span className="gradient-text">리뷰하고 공유하세요</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
            MyAnimeList의 방대한 애니 목록에서 골라, 나만의 리뷰를 남겨보세요.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/anime"
              className="rounded-xl bg-accent px-6 py-3 font-medium text-white transition-colors hover:bg-accent-hover"
            >
              애니 둘러보기
            </Link>
            <Link
              href="/write"
              className="glass rounded-xl px-6 py-3 font-medium text-white transition-colors hover:bg-surface-hover"
            >
              리뷰 작성하기
            </Link>
          </div>
        </div>
      </section>

      {/* Top Anime */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">인기 애니</h2>
              <p className="mt-1 text-sm text-muted">MyAnimeList 인기 순위</p>
            </div>
            <Link href="/anime" className="text-sm text-accent hover:underline">
              전체 보기 →
            </Link>
          </div>

          {animeLoading ? (
            <LoadingSpinner />
          ) : animeList.length === 0 ? (
            <EmptyState icon="🎬" title="애니를 불러오지 못했습니다" description="잠시 후 다시 시도해주세요." />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {animeList.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">최신 리뷰</h2>
              <p className="mt-1 text-sm text-muted">커뮤니티의 생생한 리뷰</p>
            </div>
            <Link href="/reviews" className="text-sm text-accent hover:underline">
              전체 보기 →
            </Link>
          </div>

          {reviewsLoading ? (
            <LoadingSpinner message="리뷰 불러오는 중..." />
          ) : recentReviews.length === 0 ? (
            <EmptyState
              icon="✍️"
              title="아직 리뷰가 없습니다"
              description="첫 번째 리뷰를 작성해보세요!"
              action={
                <Link
                  href="/write"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                >
                  리뷰 작성하기
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
