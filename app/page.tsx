import { getActiveTemplates } from '@/db/queries'
import Link from 'next/link'
import { ArrowRight, Layers3, Menu, Play, Search, ShieldCheck, Sparkles, Star, WandSparkles, Zap } from 'lucide-react'

// Memaksa halaman selalu dinamis agar data selalu segar
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Mengambil data menggunakan Drizzle ORM
  const templates = await getActiveTemplates()
  const featuredTemplates = templates.slice(0, 3)
  const heroTemplate = templates[0]

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f8f6] text-slate-950">
      <header className="relative z-10 border-b border-slate-200/70 bg-[#f7f8f6]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-950 font-heading text-sm font-extrabold text-lime-300">T</span>
            <span className="font-heading text-lg font-extrabold tracking-tight">Template Haven</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
            <Link href="#collection" className="transition hover:text-slate-950">Collection</Link>
            <Link href="#why-us" className="transition hover:text-slate-950">Why us</Link>
            <Link href="#process" className="transition hover:text-slate-950">How it works</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden text-sm font-bold text-slate-600 transition hover:text-slate-950 sm:block">Sign in</Link>
            <Link href="/catalog" className="rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-lime-500 hover:text-slate-950">Browse catalog</Link>
            <button type="button" aria-label="Open menu" className="grid size-10 place-items-center rounded-full border border-slate-200 md:hidden"><Menu className="size-4" /></button>
          </div>
        </div>
      </header>

      <section className="relative border-b border-slate-200/70 px-5 pb-16 pt-14 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="absolute -left-32 top-20 size-80 rounded-full bg-lime-200/50 blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-96 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm">
              <Sparkles className="size-3.5 text-lime-600" /> Curated for ambitious launches
            </div>
            <h1 className="max-w-2xl font-heading text-5xl font-extrabold leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">Your next great website starts <span className="text-lime-600">here.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Template website premium yang siap dipakai, mudah dikustomisasi, dan dirancang untuk membuat brand Anda terlihat meyakinkan sejak first click.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/catalog" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-lime-500 hover:text-slate-950">Explore templates <ArrowRight className="size-4" /></Link>
              <Link href="#process" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:border-slate-950"><Play className="size-3.5 fill-current" /> See how it works</Link>
            </div>
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
              <div className="flex -space-x-2"><span className="grid size-8 place-items-center rounded-full border-2 border-[#f7f8f6] bg-amber-200 text-xs font-bold">AS</span><span className="grid size-8 place-items-center rounded-full border-2 border-[#f7f8f6] bg-sky-200 text-xs font-bold">RP</span><span className="grid size-8 place-items-center rounded-full border-2 border-[#f7f8f6] bg-rose-200 text-xs font-bold">DN</span></div>
              <span><strong className="text-slate-900">1,200+</strong> creators already building</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -right-3 top-7 z-10 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-xl backdrop-blur sm:-right-5 sm:top-10">
              <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-xl bg-lime-100 text-lime-700"><Zap className="size-4 fill-current" /></span><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Launch faster</p><p className="text-sm font-extrabold">Ready in minutes</p></div></div>
            </div>
            <div className="absolute -bottom-5 -left-4 z-10 rounded-2xl border border-white/80 bg-slate-950 px-4 py-3 text-white shadow-xl sm:-left-8">
              <div className="flex items-center gap-3"><Star className="size-5 fill-lime-300 text-lime-300" /><div><p className="text-sm font-extrabold">4.9 / 5.0</p><p className="text-[10px] text-slate-400">Loved by builders</p></div></div>
            </div>
            <div className="rounded-[2rem] border border-white bg-white/70 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur sm:p-3">
              <div className="overflow-hidden rounded-[1.5rem] bg-slate-100">
                {heroTemplate ? <img src={heroTemplate.thumbnailUrl || '/placeholder.png'} alt={heroTemplate.title} className="aspect-[16/11] w-full object-cover" /> : <div className="aspect-[16/11] bg-gradient-to-br from-sky-100 via-white to-lime-100" />}
              </div>
              <div className="flex items-center justify-between px-3 py-3 sm:px-5 sm:py-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Featured template</p><p className="mt-1 font-heading text-base font-extrabold sm:text-lg">{heroTemplate?.title || 'Your next project'}</p></div><Link href={heroTemplate ? `/template/${heroTemplate.slug}` : '/catalog'} className="grid size-10 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-lime-500 hover:text-slate-950"><ArrowRight className="size-4" /></Link></div>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
          <div><p className="text-xs font-bold uppercase tracking-[.2em] text-lime-700">Designed for momentum</p><h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Skip the blank canvas. Start with something excellent.</h2><p className="mt-5 leading-7 text-slate-600">Kami menyusun setiap template untuk mengurangi pekerjaan repetitif, bukan mengurangi ruang untuk ide Anda.</p></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[[WandSparkles, 'Distinct by design', 'Visual yang punya karakter kuat tanpa mengorbankan usability.'], [Zap, 'Ship at speed', 'Struktur siap pakai mempercepat Anda dari ide menuju live.'], [ShieldCheck, 'Built with care', 'Layout responsif dan detail yang dipikirkan untuk berbagai layar.'], [Layers3, 'Easy to make yours', 'Ganti konten, warna, dan style tanpa mulai dari nol.']].map(([Icon, title, description]) => { const FeatureIcon = Icon as typeof WandSparkles; return <div key={title as string} className="rounded-3xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="grid size-10 place-items-center rounded-2xl bg-lime-100 text-lime-700"><FeatureIcon className="size-5" /></span><h3 className="mt-5 font-heading text-lg font-extrabold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description as string}</p></div> })}
          </div>
        </div>
      </section>

      <section id="collection" className="border-y border-slate-200/70 bg-white px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-lime-700">The collection</p><h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">A head start for every kind of idea.</h2></div><Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700 hover:text-lime-700">View all templates <ArrowRight className="size-4" /></Link></div>
          {featuredTemplates.length ? <div className="grid gap-5 md:grid-cols-3">{featuredTemplates.map((template, index) => <Link key={template.id} href={`/template/${template.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-[#f7f8f6] transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[1.35/1] overflow-hidden bg-slate-100"><img src={template.thumbnailUrl || '/placeholder.png'} alt={template.title} className="size-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">0{index + 1} / featured</span></div><div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-heading text-xl font-extrabold">{template.title}</h3><ArrowRight className="size-4 transition group-hover:translate-x-1" /></div><div className="mt-3 flex flex-wrap gap-1.5">{template.techStack?.slice(0, 3).map((tech) => <span key={tech} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">{tech}</span>)}</div><p className="mt-5 text-sm font-extrabold">Rp {Number(template.price).toLocaleString('id-ID')}</p></div></Link>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 py-16 text-center text-slate-500">Koleksi template sedang disiapkan.</div>}
        </div>
      </section>

      <section id="process" className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-lime-700">Simple by design</p><h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">From “what if?” to “it’s live.”</h2><p className="mt-5 leading-7 text-slate-600">Proses yang singkat, transparan, dan dibuat supaya energi Anda tetap ada untuk hal-hal yang penting.</p></div><div className="grid gap-3 sm:grid-cols-3">{[['01', 'Explore', 'Temukan template yang paling dekat dengan visi Anda.'], ['02', 'Make it yours', 'Sesuaikan konten dan visual dengan identitas brand.'], ['03', 'Go live', 'Publish dengan percaya diri dan mulai mendapatkan traction.']].map(([number, title, description]) => <div key={number} className="border-t-2 border-slate-950 pt-4"><span className="text-sm font-extrabold text-lime-700">{number}</span><h3 className="mt-6 font-heading text-xl font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>)}</div></div>
      </section>

      <section className="px-5 pb-16 lg:px-8 lg:pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white sm:px-12"><Search className="mx-auto size-7 text-lime-300" /><h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Your best work deserves a better starting point.</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-300">Browse the collection and find the building blocks for something people will remember.</p><Link href="/catalog" className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-lime-200">Explore the catalog <ArrowRight className="size-4" /></Link></div></section>

      <footer className="border-t border-slate-200 px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-slate-500 sm:flex-row sm:items-center"><div className="flex items-center gap-2 font-heading font-extrabold text-slate-950"><span className="grid size-7 place-items-center rounded-lg bg-slate-950 text-[10px] text-lime-300">T</span> Template Haven</div><p>Thoughtful templates for ambitious ideas.</p><div className="flex gap-4"><Link href="/catalog" className="hover:text-slate-950">Catalog</Link><Link href="/dashboard" className="hover:text-slate-950">Workspace</Link></div></div></footer>
    </main>
  )
}