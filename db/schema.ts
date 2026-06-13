import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  doublePrecision,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const spotCategoryEnum = pgEnum("spot_category", [
  "stay",    // 宿・ホテル
  "cafe",    // カフェ・グルメ
  "nature",  // 公園・自然
  "sight",   // 観光・体験
]);

// ─── trips ───────────────────────────────────────────────────────────────────

export const trips = pgTable("trips", {
  id:           uuid("id").primaryKey().defaultRandom(),
  title:        text("title").notNull(),
  area:         text("area").notNull(),
  pref:         text("pref").notNull(),
  visitedAt:    date("visited_at").notNull(),
  nights:       text("nights"),             // "1泊2日" など
  lead:         text("lead").notNull(),
  body:         text("body"),
  thumbnailUrl: text("thumbnail_url"),
  youtubeId:    text("youtube_id"),
  published:    boolean("published").default(false).notNull(),
  createdAt:    timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:    timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── spots ───────────────────────────────────────────────────────────────────

export const spots = pgTable("spots", {
  id:         uuid("id").primaryKey().defaultRandom(),
  name:       text("name").notNull(),
  category:   spotCategoryEnum("category").notNull(),
  area:       text("area").notNull(),
  pref:       text("pref").notNull(),
  lead:       text("lead").notNull(),
  body:       text("body"),
  address:    text("address"),
  lat:        doublePrecision("lat"),
  lng:        doublePrecision("lng"),
  websiteUrl: text("website_url"),
  youtubeId:  text("youtube_id"),
  tips:       text("tips").array(),         // ["朝が空いている", ...]
  dogTags:    text("dog_tags").array(),     // ["店内同伴OK", "ドッグラン有", ...]
  published:  boolean("published").default(false).notNull(),
  createdAt:  timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt:  timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── spot_images ─────────────────────────────────────────────────────────────

export const spotImages = pgTable("spot_images", {
  id:        uuid("id").primaryKey().defaultRandom(),
  spotId:    uuid("spot_id").notNull().references(() => spots.id, { onDelete: "cascade" }),
  url:       text("url").notNull(),
  alt:       text("alt"),
  position:  integer("position").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── trip_spots (タイムライン) ────────────────────────────────────────────────
// spot_id は nullable（スポットなしの移動・自由行動ステップに対応）

export const tripSpots = pgTable("trip_spots", {
  id:        uuid("id").primaryKey().defaultRandom(),
  tripId:    uuid("trip_id").notNull().references(() => trips.id, { onDelete: "cascade" }),
  spotId:    uuid("spot_id").references(() => spots.id, { onDelete: "set null" }),
  position:  integer("position").notNull(),
  timeLabel: text("time_label"),   // "1日目 / 午前" など
  stepText:  text("step_text"),    // spot なしステップのテキスト
  note:      text("note"),         // 補足メモ
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Relations ───────────────────────────────────────────────────────────────

export const tripsRelations = relations(trips, ({ many }) => ({
  tripSpots: many(tripSpots),
}));

export const spotsRelations = relations(spots, ({ many }) => ({
  tripSpots: many(tripSpots),
  images:    many(spotImages),
}));

export const tripSpotsRelations = relations(tripSpots, ({ one }) => ({
  trip: one(trips, { fields: [tripSpots.tripId], references: [trips.id] }),
  spot: one(spots, { fields: [tripSpots.spotId], references: [spots.id] }),
}));

export const spotImagesRelations = relations(spotImages, ({ one }) => ({
  spot: one(spots, { fields: [spotImages.spotId], references: [spots.id] }),
}));
