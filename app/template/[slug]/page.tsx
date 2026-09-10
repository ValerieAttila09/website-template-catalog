'use client';
import { useState, use } from 'react';

export default function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  const demoUrl = `https://${slug}.demo.domainkamu.com`;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 overflow-hidden">
      <header className="h-14 bg-gray-800 border-b border-gray-700 text-white flex items-center justify-between px-6 z-10">
        <a href="/" className="font-bold text-lg text-blue-400">Katalog Template</a>
        
        <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-700">
          <button 
            onClick={() => setViewMode('desktop')} 
            className={`px-3 py-1 text-sm rounded ${viewMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
          >
            Desktop
          </button>
          <button 
            onClick={() => setViewMode('mobile')} 
            className={`px-3 py-1 text-sm rounded ${viewMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
          >
            Mobile
          </button>
        </div>

        <a 
          href={`/checkout?template=${slug}`} 
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Beli Template
        </a>
      </header>

      <main className="flex-1 bg-gray-900 flex justify-center items-center p-4 overflow-hidden">
        <div className={`h-full transition-all duration-300 ${
          viewMode === 'mobile' 
            ? 'w-[375px] h-[667px] border-[12px] border-gray-800 rounded-[36px] shadow-2xl overflow-hidden' 
            : 'w-full h-full'
        }`}>
          <iframe
            src={demoUrl}
            className="w-full h-full border-0 bg-white"
            title="Live Preview"
          />
        </div>
      </main>
    </div>
  );
}