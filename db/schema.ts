import { pgTable, uuid, text, numeric, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Mendefinisikan ENUM untuk status transaksi sesuai skema database kita
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'success', 'failed']);

// 1. Tabel Profiles (Relasi ke auth.users Supabase)
export const profilesTable = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Tabel Templates (Katalog Produk)
export const templatesTable = pgTable('templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  category: text('category'), // Kolom kategori baru
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  previewUrl: text('preview_url'),
  filePath: text('file_path').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  techStack: text('tech_stack').array(), // Tipe array PostgreSQL
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Tabel Transactions (Riwayat Pembelian)
export const transactionsTable = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => profilesTable.id).notNull(),
  templateId: uuid('template_id').references(() => templatesTable.id).notNull(),
  paymentId: text('payment_id'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  status: transactionStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Tabel Licenses (Sistem Lisensi Produk)
export const licensesTable = pgTable('licenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactionsTable.id).notNull(),
  userId: uuid('user_id').references(() => profilesTable.id).notNull(),
  templateId: uuid('template_id').references(() => templatesTable.id).notNull(),
  licenseKey: uuid('license_key').defaultRandom().notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});