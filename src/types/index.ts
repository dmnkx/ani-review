export interface Anime {
  mal_id: number;
  title: string;
  title_jp: string | null;
  cover_image: string | null;
  synopsis: string | null;
  genres: string[];
  year: number | null;
  studio: string | null;
  score: number | null;
}

export interface Review {
  id: string;
  mal_id: number;
  anime_title: string;
  anime_image: string | null;
  author_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
}

export interface ReviewFormData {
  mal_id: number;
  anime_title: string;
  anime_image?: string | null;
  author_name: string;
  rating: number;
  title: string;
  content: string;
}
