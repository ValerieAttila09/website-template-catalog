import Link from 'next/link'

interface Template {
  id: string
  title: string
  slug: string
  price: string
  thumbnailUrl: string | null
  techStack: string[] | null
}

export default function TemplateCard({ template }: { template: Template }) {
  // Format harga ke Rupiah (Opsional, sesuaikan dengan mata uang Anda)
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(template.price))

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail Gambar */}
      <div className="aspect-video bg-slate-100 relative overflow-hidden">
        <img 
          src={template.thumbnailUrl || '/placeholder.png'} 
          alt={template.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Konten Kartu */}
      <div className="p-5">
        <div className="flex gap-2 mb-2 flex-wrap">
          {template.techStack?.map((tech, idx) => (
            <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
              {tech}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-lg text-slate-800 mb-2 line-clamp-1">
          {template.title}
        </h3>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <span className="font-bold text-blue-600">{formattedPrice}</span>
          <Link 
            href={`/template/${template.slug}`}
            className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  )
}