import Link from "next/link";
import { type spots } from "@/db/schema";

type Spot = typeof spots.$inferSelect;

const CATEGORY: Record<string, { label: string; color: string }> = {
  stay:   { label: "宿・ホテル",   color: "#C75A39" },
  cafe:   { label: "カフェ・グルメ", color: "#C9912F" },
  nature: { label: "公園・自然",   color: "#6E7F58" },
  sight:  { label: "観光・体験",   color: "#9C7B5B" },
};

export function SpotCard({ spot }: { spot: Spot }) {
  const cat = CATEGORY[spot.category] ?? { label: spot.category, color: "#9C7B5B" };

  return (
    <Link
      href={`/spots/${spot.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-[#EAE0D1]"
    >
      {/* 画像エリア（プレースホルダー） */}
      <div
        className="aspect-[16/10] flex items-center justify-center relative"
        style={{ background: `${cat.color}18` }}
      >
        <span className="text-4xl">🐾</span>
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs text-white font-medium"
          style={{ background: cat.color, fontFamily: "var(--font-head)" }}
        >
          {cat.label}
        </span>
      </div>

      {/* 本文 */}
      <div className="p-4">
        <p className="text-xs text-[#9C7B5B] mb-1">{spot.area}・{spot.pref}</p>
        <h3
          className="text-[17px] font-bold text-[#392F27] mb-2 leading-snug group-hover:text-[#C75A39] transition-colors"
          style={{ fontFamily: "var(--font-head)" }}
        >
          {spot.name}
        </h3>
        <p className="text-sm text-[#6E6055] line-clamp-2 leading-relaxed">{spot.lead}</p>
        {spot.dogTags && spot.dogTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {spot.dogTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs bg-[#EEF1E6] text-[#6E7F58]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
