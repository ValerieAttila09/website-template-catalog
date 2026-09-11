'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Cari template</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
        <input
          type="text"
          placeholder="Cari template, gaya, atau fitur..."
          defaultValue={searchParams.get('q') || ''}
          onChange={(e) => handleFilterChange('q', e.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white focus:ring-4 focus:ring-slate-950/5"
        />
        </label>

        <label className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:min-w-44">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</span>
          <select
            aria-label="Filter kategori"
            defaultValue={searchParams.get('category') || 'all'}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
          >
            <option value="all">Semua kategori</option>
            <option value="portfolio">Portfolio</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="dashboard">Dashboard</option>
            <option value="landing-page">Landing Page</option>
          </select>
        </label>

        <label className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:min-w-44">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Built with</span>
          <select
            aria-label="Filter tech stack"
            defaultValue={searchParams.get('tech') || 'all'}
            onChange={(e) => handleFilterChange('tech', e.target.value)}
            className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
          >
            <option value="all">Semua tech stack</option>
            <option value="Next.js">Next.js</option>
            <option value="React">React</option>
            <option value="Tailwind">Tailwind CSS</option>
            <option value="TypeScript">TypeScript</option>
          </select>
        </label>

        <label className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:min-w-48">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sort by</span>
          <select
            aria-label="Urutkan template"
            defaultValue={searchParams.get('sort') || 'newest'}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="mt-0.5 w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="price-asc">Harga terendah</option>
            <option value="price-desc">Harga tertinggi</option>
          </select>
        </label>
      </div>
    </div>
  );
}