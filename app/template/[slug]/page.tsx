import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LikeButton, AddToCartButton } from '@/components/InteractiveButtons';

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

  // Cek Auth User & Status Interaksi
  const { data: { user } } = await supabase.auth.getUser();

  let isLiked = false;
  let inCart = false;
  let likeCount = 0;

  // Total Like untuk Template ini
  const { count } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('template_id', template.id);
  likeCount = count || 0;

  if (user) {
    const { data: like } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('template_id', template.id)
      .maybeSingle();

    const { data: cart } = await supabase
      .from('cart_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('template_id', template.id)
      .maybeSingle();

    isLiked = !!like;
    inCart = !!cart;
  }

  return (
    <main className="min-h-screen bg-[#F9F2E7] font-sans text-[#505F62]">
      <header className="border-b border-[#D0BDA8] bg-[#F9F2E7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#505F62] font-heading text-sm font-extrabold text-[#FFCF00]">U</span>
            <span><span className="block font-heading text-lg font-extrabold tracking-tight">UPLIFT</span><span className="hidden text-[9px] font-semibold tracking-[.14em] text-[#F18744] sm:block">LIFT YOUR BRAND HIGHER</span></span>
          </Link>
          <Link href="/catalog" className="text-sm font-bold text-[#778083] transition hover:text-[#F18744]">Back to catalog <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 lg:px-8 lg:pt-12">
        <div className="mb-8 flex items-center gap-2 text-sm text-[#778083]">
          <Link href="/catalog" className="font-semibold transition hover:text-[#F18744]">Catalog</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate text-slate-700">{template.title}</span>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#F18744]">{template.category || 'General'} template</p>
                <h1 className="max-w-3xl font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">{template.title}</h1>
              </div>
              <div className="flex items-center gap-3">
                <LikeButton templateId={template.id} initialLiked={isLiked} likeCount={likeCount} />
                <span className="rounded-full border border-[#D0BDA8] bg-[#F1E6D8] px-3 py-1.5 text-xs font-bold text-[#778083]">Updated recently</span>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#D0BDA8] bg-[#F9F2E7] p-2 shadow-xl shadow-[#505F62]/10">
              <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-slate-100">
                <img src={template.thumbnail_url || '/placeholder.png'} alt={template.title} className="size-full object-cover" />
              </div>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-[1.3fr_.7fr]">
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#778083]">About this template</p>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight">Built to make a strong first impression.</h2>
                <p className="mt-4 whitespace-pre-line text-base leading-7 text-[#667276]">{template.description || 'Tidak ada deskripsi tersedia.'}</p>
              </section>
              <section>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#778083]">Tech stack</p>
                <div className="flex flex-wrap gap-2">
                  {template.tech_stack?.map((item: string) => <span key={item} className="rounded-full bg-[#FFCF00] px-3 py-2 text-xs font-bold text-[#505F62]">{item}</span>)}
                </div>
              </section>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-[#D0BDA8] pt-6 sm:grid-cols-3">
              {['Responsive by default', 'Easy to customize', 'Optimized for launch'].map((item, index) => (
                <div key={item} className="rounded-2xl bg-[#F1E6D8] p-4 ring-1 ring-[#D0BDA8]">
                  <span className="text-lg text-[#F18744]">0{index + 1}</span>
                  <p className="mt-2 text-sm font-bold text-[#505F62]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[2rem] bg-[#505F62] p-6 text-[#F9F2E7] shadow-xl shadow-[#505F62]/20 sm:p-7">
              <p className="text-sm text-[#F9F2E7]/65">One-time purchase</p>
              <p className="mt-2 font-heading text-4xl font-extrabold tracking-tight">Rp {Number(template.price).toLocaleString('id-ID')}</p>
              <p className="mt-3 text-sm leading-6 text-[#F9F2E7]/75">Dapatkan akses template dan mulai kustomisasi project Anda hari ini.</p>
              
              <div className="mt-7 space-y-3">
                <a href={`/api/checkout?templateId=${template.id}`} className="block w-full rounded-2xl bg-[#F18744] px-4 py-3.5 text-center text-sm font-extrabold text-[#F9F2E7] transition hover:bg-[#FFCF00] hover:text-[#505F62]">Buy this template <span aria-hidden="true">↗</span></a>
                
                {/* Interaktif Add to Cart Button */}
                <AddToCartButton templateId={template.id} initialInCart={inCart} />
                
                <Link href={`/template/${template.slug}/preview`} className="block w-full rounded-2xl border border-[#F9F2E7]/25 px-4 py-3.5 text-center text-sm font-bold text-[#F9F2E7] transition hover:bg-[#F9F2E7] hover:text-[#505F62]">View live preview</Link>
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