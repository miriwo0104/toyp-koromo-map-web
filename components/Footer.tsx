import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#EAE0D1] bg-[#FFFCF5] mt-20">
      <div className="mx-auto max-w-[1120px] px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C75A39] flex items-center justify-center text-white text-lg">
              🐾
            </div>
            <div>
              <div className="text-sm font-bold" style={{ fontFamily: "var(--font-head)" }}>
                トイプーころものおでかけ日記
              </div>
              <div className="text-xs text-[#6E6055] mt-0.5">
                レッドのトイプードル・ころもと犬同伴の旅を記録するブログ
              </div>
            </div>
          </div>
          <nav className="flex gap-6 text-sm text-[#6E6055]">
            <Link href="/" className="hover:text-[#C75A39] transition-colors">ホーム</Link>
            <Link href="/#trips" className="hover:text-[#C75A39] transition-colors">旅の記録</Link>
            <Link href="/#search" className="hover:text-[#C75A39] transition-colors">スポット検索</Link>
            <a
              href="https://www.youtube.com/@toyp-koromo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C75A39] transition-colors"
            >
              YouTube ↗
            </a>
          </nav>
        </div>
        <div className="mt-8 text-xs text-[#6E6055]">
          © トイプーころものおでかけ日記
        </div>
      </div>
    </footer>
  );
}
