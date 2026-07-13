import type { Review, ReviewFormData } from "@/types";
import { getSupabase } from "./supabase";

export async function fetchReviewsByMalId(malId: number): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("mal_id", malId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchReviewsByMalId:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchRecentReviews(limit = 6): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("fetchRecentReviews:", error.message);
    return [];
  }

  return data ?? [];
}

export async function fetchAllReviews(): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchAllReviews:", error.message);
    return [];
  }

  return data ?? [];
}

export async function createReview(form: ReviewFormData): Promise<Review | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("reviews")
    .insert(form)
    .select()
    .single();

  if (error) {
    console.error("createReview:", error.message);
    return null;
  }

  return data;
}

export function getAverageRating(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
