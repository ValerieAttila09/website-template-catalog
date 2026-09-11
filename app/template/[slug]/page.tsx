import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !template) {
    notFound();
  }

  const isDev = process.env.NODE_ENV === 'development';

// Gunakan path folder public saat dev, atau URL database saat production
  const demoUrl = isDev 
    ? `/demo/${slug}/index.html` 
    : template.previewUrl || `https://${slug}.demo.domainkamu.com`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/catalog" className="hover:underline">Katalog</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{template.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Visual & Deskripsi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-2xl overflow-hidden shadow-sm bg-white">
            <img
              src={template.thumbnail_url || '/placeholder.png'}
              alt={template.title}
              className="w-full h-auto object-cover max-h-[450px]"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Deskripsi Template</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {template.description || 'Tidak ada deskripsi tersedia.'}
            </p>
          </div>
        </div>

        {/* Info Harga & Aksi */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6 sticky top-6">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-600 uppercase">
                {template.category || 'General'}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-3">{template.title}</h1>
              <p className="text-3xl font-extrabold text-gray-900 mt-4">
                Rp {Number(template.price).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={`/api/checkout?templateId=${template.id}`}
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition shadow-sm"
              >
                Beli Sekarang
              </a>
              {/* Link ini mengarah ke sub-folder preview */}
              <Link
                href={demoUrl}
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition"
              >
                Live Preview
              </Link>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {template.tech_stack?.map((item: string) => (
                  <span
                    key={item}
                    className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-md"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}