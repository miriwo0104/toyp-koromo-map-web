"use client";

import { useState, useMemo } from "react";
import { SpotCard } from "./SpotCard";
import { type spots } from "@/db/schema";

type Spot = typeof spots.$inferSelect;

const CATEGORIES = [
  { value: "stay",   label: "宿・ホテル" },
  { value: "cafe",   label: "カフェ・グルメ" },
  { value: "nature", label: "公園・自然" },
  { value: "sight",  label: "観光・体験" },
];

const DOG_TAGS = [
  "店内同伴OK", "ドッグラン有", "テラス席可", "小型犬向け",
  "大型犬可", "ノーリードエリア有", "貸切風呂", "おやつ提供",
];

export function SearchSection({ allSpots }: { allSpots: Spot[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [selectedDogTags, setSelectedDogTags] = useState<string[]>([]);

  const areas = useMemo(
    () => [...new Set(allSpots.map((s) => s.area))],
    [allSpots]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSpots.filter((s) => {
      if (category && s.category !== category) return false;
      if (area && s.area !== area) return false;
      if (selectedDogTags.length > 0 && !selectedDogTags.every((t) => s.dogTags?.includes(t))) return false;
      if (q) {
        const hay = [s.name, s.area, s.pref, s.lead, s.body ?? "", ...(s.dogTags ?? [])].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allSpots, query, category, area, selectedDogTags]);

  const hasFilter = query || category || area || selectedDogTags.length > 0;

  const toggleDogTag = (tag: string) =>
    setSelectedDogTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const reset = () => {
    setQuery(""); setCategory(""); setArea(""); setSelectedDogTags([]);
  };

  const selectCls =
    "px-3 py-2 border border-[#EAE0D1] rounded-lg text-sm bg-white text-[#392F27] focus:outline-none focus:ring-2 focus:ring-[#C75A39] focus:border-transparent";

  return (
    <section id="search" className="py-16">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mb-8">
          <p className="text-xs font-medium text-[#C75A39] mb-1" style={{ fontFamily: "var(--font-head)" }}>Find a spot</p>
          <h2 className="text-3xl font-bold text-[#392F27]" style={{ fontFamily: "var(--font-head)" }}>スポットを探す</h2>
          <p className="text-[#6E6055] mt-2 text-sm">行った場所から、犬連れで安心して過ごせるスポットを探せます。</p>
        </div>

        {/* フィルターバー */}
        <div className="bg-white rounded-2xl border border-[#EAE0D1] p-5 mb-6 shadow-sm">
          {/* テキスト検索 */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C75A39]">🐾</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="スポット名・キーワードで検索（例：温泉、ドッグラン）"
              className="w-full pl-10 pr-4 py-2.5 border border-[#EAE0D1] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C75A39] focus:border-transparent"
            />
          </div>

          {/* ドロップダウン */}
          <div className="flex flex-wrap gap-3">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
              <option value="">すべての種類</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={selectCls}>
              <option value="">すべてのエリア</option>
              {areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* 犬OK条件チェックボックス */}
          <div className="mt-4">
            <p className="text-xs text-[#6E6055] mb-2">犬の条件で絞り込む</p>
            <div className="flex flex-wrap gap-2">
              {DOG_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDogTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    selectedDogTags.includes(tag)
                      ? "bg-[#EEF1E6] border-[#6E7F58] text-[#6E7F58] font-medium"
                      : "bg-white border-[#EAE0D1] text-[#6E6055] hover:border-[#6E7F58]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 件数表示 */}
        {hasFilter && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-[#6E6055]">
              <strong className="text-[#392F27]">{results.length}</strong> 件のスポット
            </p>
            <button
              onClick={reset}
              className="text-sm text-[#C75A39] hover:text-[#A8462B] transition-colors"
            >
              絞り込みをクリア
            </button>
          </div>
        )}

        {/* 結果グリッド */}
        {!hasFilter ? null : results.length === 0 ? (
          <div className="text-center py-16 text-[#6E6055]">
            <p className="text-4xl mb-4">🐾</p>
            <p>条件に合うスポットが見つかりませんでした。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
