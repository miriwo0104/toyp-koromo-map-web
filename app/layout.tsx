import type { Metadata } from "next";
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-maru",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "トイプーころものおでかけ日記",
    template: "%s | トイプーころものおでかけ日記",
  },
  description:
    "レッドのトイプードル・ころもと巡った、犬同伴OKの宿・カフェ・公園。動画では伝えきれないおでかけ情報をまとめています。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`${zenMaru.variable} ${zenKaku.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
