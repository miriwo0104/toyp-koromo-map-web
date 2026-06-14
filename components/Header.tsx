import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#EAE0D1] bg-[#FBF6EC]/90 backdrop-blur-sm backdrop-saturate-150">
      <div className="mx-auto max-w-[1120px] px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#C75A39] flex items-center justify-center text-white text-lg">
            🐾
          </div>
          <div>
            <div className="text-sm font-bold leading-tight" style={{ fontFamily: "var(--font-head)" }}>
              トイプーころものおでかけ日記
            </div>
            <div className="text-[11px] text-[#6E6055]">犬同伴スポットガイド</div>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-[#392F27]">
          <Link href="/#trips" className="hover:text-[#C75A39] transition-colors">
            旅の記録
          </Link>
          <Link href="/#search" className="hover:text-[#C75A39] transition-colors">
            スポットを探す
          </Link>
          <a
            href="https://www.youtube.com/@toyp-koromo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-[#C75A39] text-white rounded-full text-sm font-medium hover:bg-[#A8462B] transition-colors"
            style={{ fontFamily: "var(--font-head)" }}
          >
            YouTube ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
