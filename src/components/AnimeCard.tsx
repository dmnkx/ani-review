import Image from "next/image";
import Link from "next/link";
import type { Anime } from "@/types";
import { getRatingColor } from "@/lib/utils";

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link
      href={`/anime/view?id=${anime.mal_id}`}
      className="group glass overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-hover">
        {anime.cover_image ? (
          <Image
            src={anime.cover_image}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🎬</div>
        )}
        {anime.score !== null && (
          <div className="absolute right-2 top-2 rounded-lg bg-black/70 px-2 py-1 text-sm font-bold backdrop-blur-sm">
            <span className={getRatingColor(anime.score)}>★ {anime.score}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-white group-hover:text-accent">
          {anime.title}
        </h3>
        {anime.title_jp && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{anime.title_jp}</p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {anime.year && <span className="text-xs text-muted">{anime.year}</span>}
          {anime.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-accent-muted px-2 py-0.5 text-xs text-purple-300"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
