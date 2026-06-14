import Link from "next/link";
import { type trips } from "@/db/schema";

type Trip = typeof trips.$inferSelect;

export function TripCard({ trip, spotCount }: { trip: Trip; spotCount: number }) {
  return (
    <Link
      href={`/trips/${trip.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-[#EAE0D1]"
    >
      {/* 画像エリア（プレースホルダー） */}
      <div className="aspect-[16/9] flex items-center justify-center relative bg-gradient-to-br from-[#FBEDE7] to-[#EEF1E6]">
        <span className="text-5xl">🐕</span>
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs text-[#392F27] bg-white/80 backdrop-blur-sm">
          {trip.visitedAt}・{trip.nights}
        </span>
      </div>

      {/* 本文 */}
      <div className="p-5">
        <p
          className="text-xs text-[#C75A39] font-medium mb-1"
          style={{ fontFamily: "var(--font-head)" }}
        >
          {trip.area}・{trip.pref}
        </p>
        <h3
          className="text-2xl font-bold text-[#392F27] mb-2 leading-snug group-hover:text-[#C75A39] transition-colors"
          style={{ fontFamily: "var(--font-head)" }}
        >
          {trip.title}
        </h3>
        <p className="text-sm text-[#6E6055] line-clamp-2 leading-relaxed mb-4">{trip.lead}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#9C7B5B]">立ち寄り {spotCount} スポット</span>
          <span className="text-[#C75A39] font-medium group-hover:translate-x-0.5 transition-transform inline-block">
            旅をみる →
          </span>
        </div>
      </div>
    </Link>
  );
}
