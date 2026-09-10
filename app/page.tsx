import { getActiveTemplates } from '@/db/queries'
import TemplateCard from '@/components/common/TemplateCard'

// Memaksa halaman selalu dinamis agar data selalu segar
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Mengambil data menggunakan Drizzle ORM
  const templates = await getActiveTemplates()

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Template Website Profesional untuk Bisnis Anda
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Siap pakai, responsif, dan dirancang khusus untuk mempercepat peluncuran bisnis digital Anda dalam hitungan menit.
          </p>
        </div>
      </section>

      {/* Grid Katalog Produk */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Katalog Pilihan</h2>
          <span className="text-sm text-slate-500">
            {templates.length} Template Tersedia
          </span>
        </div>

        {/* Kondisi jika data kosong */}
        {templates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Belum ada template yang diunggah ke katalog.</p>
          </div>
        )}

        {/* Grid Template */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </main>
  )
}