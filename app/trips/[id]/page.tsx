import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { trips, tripSpots, spots } from "@/db/schema";
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
  const [trip] = await db.select().from(trips).where(and(eq(trips.id, id), eq(trips.published, true)));
  return { title: trip?.title ?? "旅の記録" };
}

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [trip] = await db.select().from(trips).where(and(eq(trips.id, id), eq(trips.published, true)));
  if (!trip) notFound();

  const timeline = await db
    .select({ ts: tripSpots, spot: spots })
    .from(tripSpots)
    .leftJoin(spots, eq(spots.id, tripSpots.spotId))
    .where(eq(tripSpots.tripId, id))
    .orderBy(tripSpots.position);

  const tripSpotList = timeline.filter((r) => r.spot !== null).map((r) => r.spot!);

  return (
    <div>
      {/* Hero */}
      <section className="py-12 border-b border-[#EAE0D1]">
        <div className="mx-auto max-w-[1120px] px-6">
          <Link href="/#trips" className="text-sm text-[#6E6055] hover:text-[#C75A39] transition-colors mb-4 inline-block">
            ← 旅の記録一覧
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs border border-[#EAE0D1] text-[#6E6055]">
                  🐾 {trip.area}・{trip.pref}
                </span>
                <span className="px-3 py-1 rounded-full text-xs border border-[#EAE0D1] text-[#6E6055]">
                  {trip.visitedAt}
                </span>
                {trip.nights && (
                  <span className="px-3 py-1 rounded-full text-xs border border-[#EAE0D1] text-[#6E6055]">
                    {trip.nights}
                  </span>
                )}
              </div>
              <h1
                className="text-4xl font-bold text-[#392F27] mb-4 leading-tight"
                style={{ fontFamily: "var(--font-head)" }}
              >
                {trip.title}
              </h1>
              <p className="text-[#6E6055] leading-relaxed max-w-xl">{trip.lead}</p>
            </div>
            {trip.youtubeId && (
              <a
                href={`https://www.youtube.com/watch?v=${trip.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                style={{ fontFamily: "var(--font-head)" }}
              >
                ▶ この旅の動画をみる ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* タイムライン */}
      <section className="py-12">
        <div className="mx-auto max-w-[1120px] px-6">
          <h2 className="text-xl font-bold text-[#392F27] mb-6" style={{ fontFamily: "var(--font-head)" }}>
            🐾 旅のながれ
          </h2>
          <ol className="space-y-4">
            {timeline.map((step, i) => {
              const cat = step.spot ? (CATEGORY[step.spot.category] ?? { label: step.spot.category, color: "#9C7B5B" }) : null;
              return (
                <li key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#C75A39] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < timeline.length - 1 && <div className="w-0.5 bg-[#EAE0D1] flex-1 mt-1" />}
                  </div>
                  <div className="pb-4 flex-1">
                    {step.ts.timeLabel && (
                      <p className="text-xs text-[#6E6055] mb-1">{step.ts.timeLabel}</p>
                    )}
                    {step.spot ? (
                      <Link
                        href={`/spots/${step.spot.id}`}
                        className="flex items-center gap-2 hover:text-[#C75A39] transition-colors group"
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: cat?.color }}
                        />
                        <span className="font-medium text-[#392F27] group-hover:text-[#C75A39]">
                          {step.spot.name}
                        </span>
                        <span className="text-xs text-[#9C7B5B]">{cat?.label}</span>
                        <span className="text-[#C75A39] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    ) : (
                      <p className="text-[#392F27]">{step.ts.stepText}</p>
                    )}
                    {step.ts.note && (
                      <p className="text-sm text-[#6E6055] mt-1 ml-4">{step.ts.note}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* スポット一覧 */}
      {tripSpotList.length > 0 && (
        <section className="py-12 border-t border-[#EAE0D1]">
          <div className="mx-auto max-w-[1120px] px-6">
            <h2 className="text-xl font-bold text-[#392F27] mb-6" style={{ fontFamily: "var(--font-head)" }}>
              ✨ この旅の立ち寄りスポット
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tripSpotList.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
