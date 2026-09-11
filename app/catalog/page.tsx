import { createClient } from '@/lib/supabase/server';
import FilterBar from './FilterBar';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    tech?: string;
    sort?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { q, category, tech, sort } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('templates').select('*').eq('is_active', true);

  // 1. Filter Pencarian Teks
  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // 2. Filter Kategori
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  // 3. Filter Tech Stack (ARRAY TEXT[])
  if (tech && tech !== 'all') {
    query = query.contains('tech_stack', [tech]);
  }

  // 4. Sortir Data
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: templates, error } = await query;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Katalog Template</h1>
        <p className="text-gray-600 mt-1">Temukan berbagai template pilihan untuk proyek Anda.</p>
      </div>

      <FilterBar />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-6">
          Gagal memuat data template.
        </div>
      )}

      {templates && templates.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed">
          <p className="text-gray-500 font-medium">Tidak ada template yang sesuai dengan filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => (
            <div key={template.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <img
                src={template.thumbnail_url || '/placeholder.png'}
                alt={template.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-600 uppercase">
                      {template.category || 'General'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(template.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg text-gray-800 line-clamp-1">{template.title}</h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{template.description}</p>
                  
                  {/* Badges Tech Stack */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tech_stack?.map((techItem: string) => (
                      <span key={techItem} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {techItem}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <span className="font-bold text-lg text-gray-900">
                    Rp {Number(template.price).toLocaleString('id-ID')}
                  </span>
                  <Link
                    href={`/template/${template.slug}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}