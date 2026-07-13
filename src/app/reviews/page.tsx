"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ReviewCard } from "@/components/ReviewCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { SupabaseSetupBanner } from "@/components/SupabaseSetupBanner";
import { fetchAllReviews } from "@/lib/api";
import type { Review } from "@/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SupabaseSetupBanner />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">전체 리뷰</h1>
            <p className="mt-2 text-muted">커뮤니티의 모든 리뷰</p>
          </div>
          <Link
            href="/write"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            리뷰 작성
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : reviews.length === 0 ? (
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
          <div className="grid gap-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
