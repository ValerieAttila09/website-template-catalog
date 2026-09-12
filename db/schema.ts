import { pgTable, uuid, text, numeric, boolean, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';

export const profilesTable = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Update Tabel Templates
export const templatesTable = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').references(() => profilesTable.id), // Created by who
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  category: text('category'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  previewUrl: text('preview_url'),
  filePath: text('file_path').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  techStack: text('tech_stack').array(),
  salesCount: integer('sales_count').default(0).notNull(), // Jumlah penjualan
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tabel Reviews & Ratings
export const reviewsTable = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profilesTable.id, { onDelete: 'cascade' }).notNull(),
  templateId: uuid('template_id').references(() => templatesTable.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(), // Skala 1 - 5
  reviewText: text('review_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tabel Likes
export const likesTable = pgTable('likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profilesTable.id, { onDelete: 'cascade' }).notNull(),
  templateId: uuid('template_id').references(() => templatesTable.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex('user_template_like_idx').on(t.userId, t.templateId) // 1 user hanya bisa 1x like per template
]);

// Tabel Comments
export const commentsTable = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profilesTable.id, { onDelete: 'cascade' }).notNull(),
  templateId: uuid('template_id').references(() => templatesTable.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id'), // Dukungan untuk balasan komentar
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Tabel Cart / Collections
export const cartItemsTable = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profilesTable.id, { onDelete: 'cascade' }).notNull(),
  templateId: uuid('template_id').references(() => templatesTable.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex('user_template_cart_idx').on(t.userId, t.templateId)
]);

// Tabel Testimonials (Ulasan Platform Utama)
export const testimonialsTable = pgTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profilesTable.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});