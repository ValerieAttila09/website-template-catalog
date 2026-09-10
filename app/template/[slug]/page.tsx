import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: template } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!template) {
    notFound();
  }

  // URL subdomain dinamis berdasarkan slug dari DB
  const isDev = process.env.NODE_ENV === 'development';

  // Gunakan path lokal saat development, dan subdomain saat production
  const demoUrl = isDev 
    ? `/demo/${slug}/index.html` 
    : `https://${slug}.demo.domainkamu.com`;

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900">
      <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-6">
        <h1 className="font-bold">{template.title}</h1>
        <a 
          href={`/api/checkout?templateId=${template.id}`}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Beli - Rp {Number(template.price).toLocaleString('id-ID')}
        </a>
      </header>

      <main className="flex-1 w-full h-full">
        <iframe 
          src={demoUrl} 
          className="w-full h-full border-0 bg-white" 
          title="Live Preview" 
        />
      </main>
    </div>
  );
}