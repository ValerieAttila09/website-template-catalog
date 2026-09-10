import 'dotenv/config';
import { db } from './index';
import { templatesTable } from './schema';

async function main() {
  console.log('Memulai proses seeding data dummy template...');

  // Data dummy template untuk pemilik bisnis
  const dummyTemplates = [
    {
      title: 'BizPro - Modern Corporate Landing Page',
      slug: 'bizpro-corporate-landing-page',
      description: 'Template website profesional yang dirancang khusus untuk perusahaan, agensi, dan konsultan bisnis. Dilengkapi dengan bagian layanan, testimoni, dan formulir kontak.',
      price: '150000.00',
      previewUrl: 'https://example.com/demo/bizpro',
      filePath: 'templates/bizpro-v1.zip',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      techStack: ['Next.js', 'Tailwind CSS', 'React'],
      isActive: true,
    },
    {
      title: 'ShopMaster - E-Commerce Storefront',
      slug: 'shopmaster-ecommerce-storefront',
      description: 'Solusi toko online modern untuk UMKM dan pemilik brand lokal. Tampilan produk yang elegan dengan keranjang belanja interaktif.',
      price: '250000.00',
      previewUrl: 'https://example.com/demo/shopmaster',
      filePath: 'templates/shopmaster-v1.zip',
      thumbnailUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=800&auto=format&fit=crop',
      techStack: ['React', 'Tailwind CSS'],
      isActive: true,
    },
    {
      title: 'CafeAroma - Coffee Shop & Restaurant',
      slug: 'cafearoma-restaurant-template',
      description: 'Template elegan untuk kafe, restoran, atau bisnis kuliner. Memiliki fitur daftar menu digital, galeri foto, dan integrasi reservasi meja.',
      price: '120000.00',
      previewUrl: 'https://example.com/demo/cafearoma',
      filePath: 'templates/cafearoma-v1.zip',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop',
      techStack: ['HTML5', 'Tailwind CSS', 'JavaScript'],
      isActive: true,
    },
  ];

  // Masukkan data ke dalam tabel templates
  await db.insert(templatesTable).values(dummyTemplates);

  console.log('Berhasil! Data dummy template telah dimasukkan ke database.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Gagal melakukan seeding data:', err);
  process.exit(1);
});