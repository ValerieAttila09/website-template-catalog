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

  return (
    <main className="min-h-screen bg-[#f7f8f6] text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 text-sm font-black text-lime-300">T</span>
            <span className="font-heading text-lg font-extrabold tracking-tight">Template Haven</span>
          </Link>
          <Link href="/catalog" className="text-sm font-bold text-slate-500 transition hover:text-slate-950">Back to catalog <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pt-12">
        <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/catalog" className="font-semibold transition hover:text-slate-950">Catalog</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-slate-700">{template.title}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-lime-700">{template.category || 'General'} template</p>
                <h1 className="max-w-3xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">{template.title}</h1>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-500">Updated recently</span>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
              <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-100">
                <img src={template.thumbnail_url || '/placeholder.png'} alt={template.title} className="size-full object-cover" />
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_.7fr]">
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">About this template</p>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight">Built to make a strong first impression.</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-600">{template.description || 'Tidak ada deskripsi tersedia.'}</p>
              </section>
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Tech stack</p>
                <div className="flex flex-wrap gap-2">
                  {template.tech_stack?.map((item: string) => <span key={item} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200">{item}</span>)}
                </div>
              </section>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3">
              {['Responsive by default', 'Easy to customize', 'Optimized for launch'].map((item, index) => (
                <div key={item} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                  <span className="text-lg text-lime-600">0{index + 1}</span>
                  <p className="mt-2 text-sm font-bold text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/15 sm:p-7">
              <p className="text-sm text-slate-400">One-time purchase</p>
              <p className="mt-2 font-heading text-4xl font-extrabold tracking-tight">Rp {Number(template.price).toLocaleString('id-ID')}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">Dapatkan akses template dan mulai kustomisasi project Anda hari ini.</p>
              <div className="mt-7 space-y-3">
                <a href={`/api/checkout?templateId=${template.id}`} className="block w-full rounded-2xl bg-lime-300 px-4 py-3.5 text-center text-sm font-extrabold text-slate-950 transition hover:bg-lime-200">Buy this template <span aria-hidden="true">↗</span></a>
                <Link href={`/template/${template.slug}/preview`} className="block w-full rounded-2xl border border-white/20 px-4 py-3.5 text-center text-sm font-bold text-white transition hover:bg-white hover:text-slate-950">View live preview</Link>
              </div>
              <div className="mt-7 border-t border-white/15 pt-5 text-sm text-slate-300">
                <div className="flex justify-between py-2"><span>License</span><span className="font-bold text-white">Personal + commercial</span></div>
                <div className="flex justify-between py-2"><span>Format</span><span className="font-bold text-white">Ready to use</span></div>
                <div className="flex justify-between py-2"><span>Support</span><span className="font-bold text-white">Included</span></div>
              </div>
            </div>
            <p className="mt-4 text-center text-xs leading-5 text-slate-400">Secure checkout. Instant access after payment.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}