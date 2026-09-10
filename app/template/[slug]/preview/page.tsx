import { getTemplateBySlug } from '@/db/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PreviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LivePreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params
  const template = await getTemplateBySlug(resolvedParams.slug)

  if (!template || !template.previewUrl) {
    notFound()
  }

  // Format harga untuk tombol beli di top-bar
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(template.price))

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-900">
      {/* Top-Bar Preview / Header Navigasi */}
      <header className="h-16 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link 
            href={`/template/${template.slug}`}
            className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            &larr; Kembali ke Detail
          </Link>
          <h1 className="font-medium text-slate-100 hidden sm:block truncate max-w-md">
            {template.title} <span className="text-xs text-slate-400 ml-2">(Live Preview)</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-bold text-emerald-400 hidden md:inline">
            {formattedPrice}
          </span>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors shadow-lg shadow-blue-600/20"
          >
            Beli Template Ini
          </button>
        </div>
      </header>

      {/* Area Iframe Full-Screen */}
      <div className="flex-1 w-full bg-white relative">
        <iframe 
          src={template.previewUrl} 
          title={template.title}
          className="w-full h-full border-0 absolute inset-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    </div>
  )
}