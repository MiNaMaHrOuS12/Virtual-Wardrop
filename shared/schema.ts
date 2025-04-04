import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  isAdmin: boolean("is_admin").default(false),
  brandSettings: jsonb("brand_settings"),
  createdAt: text("created_at").notNull().default("now()"),
});

// Clothing items table
export const clothingItems = pgTable("clothing_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  modelUrl: text("model_url"),
  size: text("size").notNull(),
  color: text("color").notNull(),
  brand: text("brand").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  createdAt: text("created_at").notNull().default("now()"),
});

// Mannequin configurations table
export const mannequinConfigs = pgTable("mannequin_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gender: text("gender").notNull(),
  measurements: jsonb("measurements").notNull(),
  name: text("name"),
  createdAt: text("created_at").notNull().default("now()"),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertClothingItemSchema = createInsertSchema(clothingItems);

export const insertMannequinConfigSchema = createInsertSchema(mannequinConfigs);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClothingItem = z.infer<typeof insertClothingItemSchema>;
export type ClothingItem = typeof clothingItems.$inferSelect;

export type InsertMannequinConfig = z.infer<typeof insertMannequinConfigSchema>;
export type MannequinConfig = typeof mannequinConfigs.$inferSelect;
