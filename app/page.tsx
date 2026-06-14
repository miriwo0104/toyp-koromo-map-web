import { db } from "@/db";
import { trips, spots, tripSpots } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { TripCard } from "@/components/TripCard";
import { SearchSection } from "@/components/SearchSection";

export default async function HomePage() {
  const [allTrips, allSpots] = await Promise.all([
    db.select().from(trips).where(eq(trips.published, true)).orderBy(desc(trips.visitedAt)),
    db.select().from(spots).where(eq(spots.published, true)),
  ]);

  // 旅行ごとのスポット数
  const tripSpotCounts = await db
    .select({ tripId: tripSpots.tripId })
    .from(tripSpots);

  const countMap = tripSpotCounts.reduce<Record<string, number>>((acc, r) => {
    if (r.tripId) acc[r.tripId] = (acc[r.tripId] ?? 0) + 1;
    return acc;
  }, {});

  const prefCount = new Set(allSpots.map((s) => s.pref)).size;

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-medium text-[#C75A39] mb-3 tracking-widest" style={{ fontFamily: "var(--font-head)" }}>
                Toy Poodle Koromo&apos;s Outing Diary
              </p>
              <h1
                className="text-5xl sm:text-6xl font-bold text-[#392F27] leading-tight mb-6"
                style={{ fontFamily: "var(--font-head)" }}
              >
                ころもと、<br />犬連れの旅へ。
              </h1>
              <p className="text-lg text-[#6E6055] leading-relaxed mb-8 max-w-md">
                レッドのトイプードル・ころもと巡った、犬同伴OKの宿・カフェ・公園。
                動画では伝えきれない「行ってわかったこと」をテキストでまとめています。
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <a
                  href="#trips"
                  className="px-5 py-3 bg-[#C75A39] hover:bg-[#A8462B] text-white rounded-full text-sm font-medium transition-colors"
                  style={{ fontFamily: "var(--font-head)" }}
                >
                  🐾 旅の記録をみる
                </a>
                <a
                  href="#search"
                  className="px-5 py-3 bg-white hover:bg-[#FBEDE7] text-[#392F27] rounded-full text-sm font-medium border border-[#EAE0D1] transition-colors"
                  style={{ fontFamily: "var(--font-head)" }}
                >
                  スポットを探す
                </a>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div>
                  <p className="text-3xl font-bold text-[#C75A39]" style={{ fontFamily: "var(--font-head)" }}>{allTrips.length}</p>
                  <p className="text-xs text-[#6E6055] mt-0.5">つの旅</p>
                </div>
                <div className="w-px bg-[#EAE0D1]" />
                <div>
                  <p className="text-3xl font-bold text-[#C75A39]" style={{ fontFamily: "var(--font-head)" }}>{allSpots.length}</p>
                  <p className="text-xs text-[#6E6055] mt-0.5">スポット</p>
                </div>
                <div className="w-px bg-[#EAE0D1]" />
                <div>
                  <p className="text-3xl font-bold text-[#C75A39]" style={{ fontFamily: "var(--font-head)" }}>{prefCount}</p>
                  <p className="text-xs text-[#6E6055] mt-0.5">都道府県</p>
                </div>
              </div>
            </div>

            {/* 写真プレースホルダー */}
            <div className="hidden lg:block">
              <div className="aspect-[4/5] max-w-sm mx-auto bg-gradient-to-br from-[#FBEDE7] to-[#EEF1E6] rounded-3xl flex items-center justify-center shadow-lg border-4 border-white">
                <div className="text-center">
                  <p className="text-8xl mb-4">🐩</p>
                  <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full inline-flex items-center gap-2 text-sm font-medium text-[#392F27]">
                    🐾 ころも
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trips ─── */}
      <section id="trips" className="py-16 border-t border-[#EAE0D1]">
        <div className="mx-auto max-w-[1120px] px-6">
          <div className="mb-8">
            <p className="text-xs font-medium text-[#C75A39] mb-1" style={{ fontFamily: "var(--font-head)" }}>Travel log</p>
            <h2 className="text-3xl font-bold text-[#392F27]" style={{ fontFamily: "var(--font-head)" }}>旅の記録</h2>
            <p className="text-[#6E6055] mt-2 text-sm">一回の旅ごとに、まわった順番と立ち寄りスポットをまとめています。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {allTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                spotCount={countMap[trip.id] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Search ─── */}
      <div className="border-t border-[#EAE0D1]">
        <SearchSection allSpots={allSpots} />
      </div>

      {/* ─── YouTube CTA ─── */}
      <section className="py-16 bg-[#392F27] text-white">
        <div className="mx-auto max-w-[1120px] px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-head)" }}>旅のようすは動画でも。</h2>
            <p className="text-white/70 text-sm">ころもの表情や宿の雰囲気は、ぜひ動画で。チャンネル登録もうれしいです。</p>
          </div>
          <a
            href="https://www.youtube.com/@toyp-koromo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium text-sm whitespace-nowrap transition-colors"
            style={{ fontFamily: "var(--font-head)" }}
          >
            ▶ YouTubeチャンネルへ ↗
          </a>
        </div>
      </section>
    </>
  );
}
