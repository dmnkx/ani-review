import Link from "next/link";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/anime", label: "애니 목록" },
  { href: "/reviews", label: "리뷰" },
  { href: "/write", label: "리뷰 작성" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-lg">
            🎬
          </span>
          <span className="text-lg font-bold tracking-tight">
            애니<span className="text-accent">리뷰</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-hover hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/write"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:hidden"
        >
          리뷰 작성
        </Link>
      </div>
    </header>
  );
}
