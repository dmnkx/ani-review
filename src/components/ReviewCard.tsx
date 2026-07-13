import Image from "next/image";
import Link from "next/link";
import type { Review } from "@/types";
import { formatDate, getRatingColor, getRatingLabel, truncate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="glass rounded-2xl p-5 transition-all duration-300 hover:border-accent/30">
      <div className="flex gap-4">
        {review.anime_image && (
          <Link
            href={`/anime/view?id=${review.mal_id}`}
            className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg"
          >
            <Image
              src={review.anime_image}
              alt={review.anime_title}
              fill
              className="object-cover"
              sizes="56px"
            />
          </Link>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/anime/view?id=${review.mal_id}`}
                className="text-xs text-accent hover:underline"
              >
                {review.anime_title}
              </Link>
              <h3 className="mt-1 font-semibold text-white">{review.title}</h3>
            </div>
            <div className="shrink-0 text-right">
              <div className={`text-xl font-bold ${getRatingColor(review.rating)}`}>
                {review.rating}
              </div>
              <div className="text-xs text-muted">{getRatingLabel(review.rating)}</div>
            </div>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted">
            {truncate(review.content, 150)}
          </p>

          <div className="mt-3 flex items-center gap-2 text-xs text-muted/70">
            <span>{review.author_name}</span>
            <span>·</span>
            <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
          </div>
        </div>
      </div>
    </article>
  );
}
