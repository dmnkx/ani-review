import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "애니리뷰 | 애니메이션 리뷰 커뮤니티",
    template: "%s | 애니리뷰",
  },
  description: "애니메이션 리뷰를 읽고, 직접 작성해보세요. 애니리뷰에서 최신 애니 리뷰를 만나보세요.",
  keywords: ["애니메", "애니메이션", "리뷰", "평점", "애니리뷰"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
