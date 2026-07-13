export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} 애니리뷰. 애니메이션 리뷰 커뮤니티.
          </p>
          <p className="text-xs text-muted/60">
            Powered by Supabase · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
