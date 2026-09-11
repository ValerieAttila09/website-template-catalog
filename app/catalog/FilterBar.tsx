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
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Cari nama atau deskripsi template..."
          defaultValue={searchParams.get('q') || ''}
          onChange={(e) => handleFilterChange('q', e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Filter Kategori */}
      <select
        defaultValue={searchParams.get('category') || 'all'}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Semua Kategori</option>
        <option value="portfolio">Portfolio</option>
        <option value="ecommerce">E-Commerce</option>
        <option value="dashboard">Dashboard</option>
        <option value="landing-page">Landing Page</option>
      </select>

      {/* Filter Tech Stack */}
      <select
        defaultValue={searchParams.get('tech') || 'all'}
        onChange={(e) => handleFilterChange('tech', e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Semua Tech Stack</option>
        <option value="Next.js">Next.js</option>
        <option value="React">React</option>
        <option value="Tailwind">Tailwind CSS</option>
        <option value="TypeScript">TypeScript</option>
      </select>

      {/* Sortir Harga & Tanggal */}
      <select
        defaultValue={searchParams.get('sort') || 'newest'}
        onChange={(e) => handleFilterChange('sort', e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="newest">Terbaru</option>
        <option value="price-asc">Harga: Rendah ke Tinggi</option>
        <option value="price-desc">Harga: Tinggi ke Rendah</option>
      </select>
    </div>
  );
}