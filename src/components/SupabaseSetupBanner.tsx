import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";

export function SupabaseSetupBanner() {
  if (isSupabaseConfigured()) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-amber-200">
          <span className="font-medium">Supabase 미설정</span> — 환경 변수를 설정하면 데이터를 불러올 수
          있습니다.
        </p>
        <Link
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-amber-300 underline hover:text-amber-200"
        >
          Supabase 대시보드 →
        </Link>
      </div>
    </div>
  );
}
