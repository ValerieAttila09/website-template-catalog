import { db } from './index'
import { templatesTable } from './schema'
import { eq, desc } from 'drizzle-orm'

// 1. Mengambil semua template yang aktif untuk halaman beranda
export async function getActiveTemplates() {
  try {
    const templates = await db
      .select()
      .from(templatesTable)
      .where(eq(templatesTable.isActive, true))
      .orderBy(desc(templatesTable.createdAt))
    
    return templates
  } catch (error) {
    console.error('Gagal mengambil data template:', error)
    return []
  }
}

// 2. Mengambil detail satu template berdasarkan slug (untuk halaman Detail Produk / PDP)
export async function getTemplateBySlug(slug: string) {
  try {
    const [template] = await db
      .select()
      .from(templatesTable)
      .where(eq(templatesTable.slug, slug))
      .limit(1)

    return template || null
  } catch (error) {
    console.error(`Gagal mengambil template dengan slug ${slug}:`, error)
    return null
  }
}