import { createClient } from '@/lib/supabase/server';
import FilterBar from './FilterBar';
import Link from 'next/link';
import { LikeButton } from '@/components/InteractiveButtons';

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

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (tech && tech !== 'all') {
    query = query.contains('tech_stack', [tech]);
  }
  if (sort === 'price-asc') {
    query = query.order('price', { ascending: true });
  } else if (sort === 'price-desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: templates, error } = await query;
  const templateCount = templates?.length ?? 0;

  // Cek data like milik user yang terautentikasi
  const { data: { user } } = await supabase.auth.getUser();
  let userLikesSet = new Set<string>();

  if (user) {
    const { data: likes } = await supabase.from('likes').select('template_id').eq('user_id', user.id);
    userLikesSet = new Set(likes?.map((l) => l.template_id) || []);
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-lime-300">T</span>
            <span className="font-heading text-lg font-extrabold tracking-tight">Template Haven</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
            <Link href="/catalog" className="text-slate-950">Catalog</Link>
            <Link href="/dashboard" className="transition hover:text-slate-950">Dashboard</Link>
          </nav>
          <Link href="/dashboard" className="rounded-full border border-slate-200 px-4 py-2 text-xs font-bold transition hover:border-slate-950 hover:bg-slate-950 hover:text-white">
            My workspace
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8 lg:pt-14">
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-900/10 sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute -right-20 -top-28 size-72 rounded-full bg-lime-300/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-lime-300">Curated digital goods</p>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">A better starting point for your next launch.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">Template premium yang rapi, cepat dikustomisasi, dan siap membantu ide Anda terlihat profesional sejak hari pertama.</p>
          </div>
          <div className="relative mt-9 flex flex-wrap gap-8 border-t border-white/15 pt-6 text-sm">
            <div><strong className="block text-2xl text-white">{templateCount}</strong><span className="text-slate-400">template aktif</span></div>
            <div><strong className="block text-2xl text-white">4.9/5</strong><span className="text-slate-400">rata-rata rating</span></div>
            <div><strong className="block text-2xl text-white">100%</strong><span className="text-slate-400">responsive-ready</span></div>
          </div>
        </section>

        <div className="mb-7 mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Explore the collection</p>
            <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight">Find your next favorite.</h2>
          </div>
          <p className="text-sm text-slate-500"><span className="font-bold text-slate-900">{templateCount}</span> hasil ditemukan</p>
        </div>

        <FilterBar />

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Gagal memuat data template.</div>
        )}

        {templates && templates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <p className="font-semibold text-slate-700">Tidak ada template yang sesuai dengan filter.</p>
            <p className="mt-2 text-sm text-slate-500">Coba ubah kata kunci atau kategori Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {templates?.map((template) => (
              <article key={template.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10">
                <div className="relative overflow-hidden bg-slate-100">
                  <Link href={`/template/${template.slug}`} className="block aspect-[16/10] overflow-hidden">
                    <img src={template.thumbnail_url || '/placeholder.png'} alt={template.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                  </Link>
                  {/* Floating Like Button di sudut thumbnail */}
                  <div className="absolute right-3 top-3 z-10">
                    <LikeButton templateId={template.id} initialLiked={userLikesSet.has(template.id)} />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="text-lime-700">{template.category || 'General'}</span>
                    <span>{new Date(template.created_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h2 className="mt-3 truncate font-heading text-xl font-extrabold tracking-tight text-slate-950">{template.title}</h2>
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{template.description || 'Template fleksibel untuk kebutuhan digital Anda.'}</p>
                  <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
                    {template.tech_stack?.slice(0, 3).map((techItem: string) => (
                      <span key={techItem} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{techItem}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-heading text-lg font-extrabold text-slate-950">Rp {Number(template.price).toLocaleString('id-ID')}</span>
                    <Link href={`/template/${template.slug}`} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-lime-500 hover:text-slate-950">View template <span aria-hidden="true">↗</span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}