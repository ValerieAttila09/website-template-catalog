import { getTemplateBySlug } from '@/db/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TemplateDetailPage({ params }: PageProps) {
  // Menangkap slug dari URL (Next.js App Router menggunakan async params pada versi terbaru)
  const resolvedParams = await params
  const template = await getTemplateBySlug(resolvedParams.slug)

  // Jika template tidak ditemukan di database, kembalikan halaman 404
  if (!template) {
    notFound()
  }

  // Format harga ke Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(template.price))

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Tombol Kembali */}
        <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
          &larr; Kembali ke Katalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Sisi Kiri: Gambar Thumbnail */}
          <div>
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
              <img 
                src={template.thumbnailUrl || '/placeholder.png'} 
                alt={template.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Sisi Kanan: Informasi Produk */}
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {template.techStack?.map((tech, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">
                  {tech}
                </span>
              ))}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              {template.title}
            </h1>

            <p className="text-3xl font-extrabold text-blue-600 mb-6">
              {formattedPrice}
            </p>

            <p className="text-slate-600 leading-relaxed mb-8">
              {template.description}
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4">
              {template.previewUrl && (
                <Link 
                  href={`/template/${template.slug}/preview`}
                  className="flex-1 text-center bg-slate-100 text-slate-800 font-medium py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
                >
                    Live Preview
                </Link>
              )}
              <button 
                className="flex-1 bg-blue-600 text-white font-medium py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}