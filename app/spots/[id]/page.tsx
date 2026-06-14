import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, and, ne } from "drizzle-orm";
import { db } from "@/db";
import { spots, tripSpots, trips } from "@/db/schema";
import { SpotCard } from "@/components/SpotCard";
import type { Metadata } from "next";

const CATEGORY: Record<string, { label: string; color: string }> = {
  stay:   { label: "宿・ホテル",   color: "#C75A39" },
  cafe:   { label: "カフェ・グルメ", color: "#C9912F" },
  nature: { label: "公園・自然",   color: "#6E7F58" },
  sight:  { label: "観光・体験",   color: "#9C7B5B" },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const [spot] = await db.select().from(spots).where(and(eq(spots.id, id), eq(spots.published, true)));
  return { title: spot?.name ?? "スポット詳細" };
}

export default async function SpotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [spot] = await db.select().from(spots).where(and(eq(spots.id, id), eq(spots.published, true)));
  if (!spot) notFound();

  const cat = CATEGORY[spot.category] ?? { label: spot.category, color: "#9C7B5B" };

  // この旅行
  const [tripRow] = await db
    .select({ trip: trips, ts: tripSpots })
    .from(tripSpots)
    .leftJoin(trips, eq(trips.id, tripSpots.tripId))
    .where(eq(tripSpots.spotId, id));

  const trip = tripRow?.trip ?? null;

  // 同じ旅行の他スポット
  let otherSpots: (typeof spots.$inferSelect)[] = [];
  if (trip) {
    const rows = await db
      .select({ spot: spots })
      .from(tripSpots)
      .leftJoin(spots, eq(spots.id, tripSpots.spotId))
      .where(and(eq(tripSpots.tripId, trip.id), ne(tripSpots.spotId, id)));
    otherSpots = rows.map((r) => r.spot).filter(Boolean) as (typeof spots.$inferSelect)[];
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-12 border-b border-[#EAE0D1]">
        <div className="mx-auto max-w-[1120px] px-6">
          <nav className="flex items-center gap-2 text-sm text-[#6E6055] mb-5">
            <Link href="/" className="hover:text-[#C75A39] transition-colors">ホーム</Link>
            <span>/</span>
            {trip && (
              <>
                <Link href={`/trips/${trip.id}`} className="hover:text-[#C75A39] transition-colors">{trip.title}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#392F27]">{spot.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* 画像プレースホルダー */}
            <div
              className="aspect-[4/3] rounded-2xl flex items-center justify-center text-6xl"
              style={{ background: `${cat.color}18` }}
            >
              🐾
            </div>

            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm text-white mb-4"
                style={{ background: cat.color, fontFamily: "var(--font-head)" }}
              >
                {cat.label}
              </span>
              <h1
                className="text-4xl font-bold text-[#392F27] mb-3 leading-tight"
                style={{ fontFamily: "var(--font-head)" }}
              >
                {spot.name}
              </h1>
              <p className="text-sm text-[#9C7B5B] mb-4">🐾 {spot.area}・{spot.pref}</p>
              <p className="text-[#6E6055] leading-relaxed mb-5">{spot.lead}</p>

              {spot.dogTags && spot.dogTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {spot.dogTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-sm bg-[#EEF1E6] text-[#6E7F58]"
                    >
                      🐾 {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 詳細 */}
      <section className="py-12">
        <div className="mx-auto max-w-[1120px] px-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <div>
            {spot.body && (
              <>
                <h2 className="text-xl font-bold text-[#392F27] mb-4" style={{ fontFamily: "var(--font-head)" }}>
                  🐾 このスポットについて
                </h2>
                <p className="text-[#6E6055] leading-relaxed whitespace-pre-line mb-8">{spot.body}</p>
              </>
            )}

            {spot.tips && spot.tips.length > 0 && (
              <div className="bg-[#F8EFD8] border border-[#EAD89A] rounded-2xl p-6">
                <h3
                  className="font-bold text-[#392F27] mb-3"
                  style={{ fontFamily: "var(--font-head)" }}
                >
                  ✨ ころも的・行く前メモ
                </h3>
                <ul className="space-y-2">
                  {spot.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6E6055]">
                      <span className="text-[#C9912F] mt-0.5 flex-shrink-0">🐾</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {spot.websiteUrl && (
              <div className="mt-6">
                <a
                  href={spot.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#C75A39] hover:text-[#A8462B] transition-colors"
                >
                  公式サイトへ ↗
                </a>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <aside className="space-y-5">
            {spot.youtubeId && (
              <div className="bg-white rounded-2xl border border-[#EAE0D1] p-5 shadow-sm">
                <h3 className="font-bold text-[#392F27] mb-3 text-sm" style={{ fontFamily: "var(--font-head)" }}>
                  ▶ このスポットの動画
                </h3>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${spot.youtubeId}?rel=0`}
                    title={`${spot.name}の動画`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-[#6E6055] mt-2">実際の雰囲気は動画でどうぞ。</p>
              </div>
            )}

            {trip && (
              <Link
                href={`/trips/${trip.id}`}
                className="block bg-white rounded-2xl border border-[#EAE0D1] p-5 shadow-sm hover:border-[#C75A39] transition-colors group"
              >
                <p className="text-xs text-[#6E6055] mb-1">この旅の記録</p>
                <p className="font-bold text-[#392F27] group-hover:text-[#C75A39] transition-colors" style={{ fontFamily: "var(--font-head)" }}>
                  {trip.title}
                </p>
                <p className="text-xs text-[#9C7B5B] mt-1">{trip.visitedAt}・{trip.nights} →</p>
              </Link>
            )}
          </aside>
        </div>
      </section>

      {/* 同じ旅の他スポット */}
      {otherSpots.length > 0 && (
        <section className="py-12 border-t border-[#EAE0D1]">
          <div className="mx-auto max-w-[1120px] px-6">
            <h2 className="text-xl font-bold text-[#392F27] mb-6" style={{ fontFamily: "var(--font-head)" }}>
              同じ旅のほかのスポット
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherSpots.map((s) => (
                <SpotCard key={s.id} spot={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
