import 'dotenv/config';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { db } from './index';
import { templatesTable } from './schema';

type TemplateMeta = {
  title: string;
  category: string;
  description: string;
  techStack: string[];
  price: string;
  thumbnailFile?: string;
  entrypoint?: string;
};

const demoMeta: Record<string, TemplateMeta> = {
  'agilitycms-nextjs-starter-out1': {
    title: 'Agility CMS Next.js Starter', category: 'SaaS & CMS',
    description: 'Starter modern untuk membangun website berbasis content management system dengan struktur halaman yang fleksibel.',
    techStack: ['Next.js', 'React', 'CMS'], price: '175000.00',
  },
  'buttercms-nextjs-starter-out1': {
    title: 'Butter CMS Next.js Starter', category: 'SaaS & CMS',
    description: 'Template editorial berbasis Next.js dengan halaman blog dummy dan fondasi konten yang mudah dikembangkan.',
    techStack: ['Next.js', 'React', 'Butter CMS'], price: '175000.00', entrypoint: 'blog/index.html',
  },
  'chef-kitchen-nextjs-landing-page-template-main-out1': {
    title: 'Chef Kitchen', category: 'Food & Restaurant',
    description: 'Landing page hangat untuk restoran, chef, dan bisnis kuliner dengan fokus pada menu serta reservasi.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'], price: '145000.00',
  },
  'eLearning-tailwind-nextjs-free-out1': {
    title: 'eLearning Academy', category: 'Education',
    description: 'Template platform kursus online untuk menampilkan program belajar, mentor, dan materi edukasi secara terstruktur.',
    techStack: ['Next.js', 'Tailwind CSS', 'React'], price: '125000.00',
  },
  'finewise-landing-page-out1': {
    title: 'Finewise Finance', category: 'Finance',
    description: 'Website fintech editorial dengan visual dashboard, insight keuangan, dan blok kepercayaan untuk produk finansial.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'], price: '195000.00', thumbnailFile: 'hero-mockup.webp',
  },
  'kupinglung-out1': {
    title: 'Kupinglung Store', category: 'E-commerce',
    description: 'Etalase e-commerce modern untuk produk audio dengan katalog, detail produk, cart, dan checkout dummy.',
    techStack: ['Next.js', 'React', 'E-commerce'], price: '225000.00', thumbnailFile: 'main.png',
  },
  'Raft-Landing-page-out1': {
    title: 'Raft Wealth Management', category: 'Finance',
    description: 'Landing page premium untuk layanan wealth management dengan komposisi editorial dan call to action yang kuat.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'], price: '185000.00', thumbnailFile: 'big_banner.png',
  },
  'Resume - Shadcn UI Resume and Portfolio Template-out1': {
    title: 'Shadcn Resume Portfolio', category: 'Portfolio',
    description: 'Template portfolio personal yang rapi untuk menampilkan pengalaman, keahlian, project, dan profil profesional.',
    techStack: ['Next.js', 'React', 'Shadcn UI'], price: '95000.00',
  },
  'shopco-next-ecommerce-out1': {
    title: 'Shopco Fashion Store', category: 'E-commerce',
    description: 'Storefront fashion dengan hero campaign, product grid, halaman shop, cart, dan pengalaman belanja yang lengkap.',
    techStack: ['Next.js', 'React', 'E-commerce'], price: '225000.00', thumbnailFile: 'header-homepage.png',
  },
  'Sustainable-nextjs-main-out1': {
    title: 'Sustainable Studio', category: 'Agency & Studio',
    description: 'Website agency berkarakter untuk studio digital yang ingin menampilkan layanan, portfolio, blog, dan dokumentasi.',
    techStack: ['Next.js', 'React', 'Tailwind CSS'], price: '165000.00',
  },
  test: {
    title: 'Studio Grid Portfolio', category: 'Portfolio',
    description: 'Template portfolio kreatif dengan halaman project, blog, tim, dan layout editorial untuk studio kecil.',
    techStack: ['HTML5', 'CSS', 'JavaScript'], price: '85000.00', thumbnailFile: 'hero.png',
  },
  'Typefolio-shadcn-ui-personal-portfolio-template-main-out1': {
    title: 'Typefolio Personal Portfolio', category: 'Portfolio',
    description: 'Portfolio personal minimal dengan tipografi kuat untuk developer, designer, dan pekerja kreatif.',
    techStack: ['Next.js', 'React', 'Shadcn UI'], price: '95000.00',
  },
};

function toSlug(folderName: string) {
  return folderName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toTitle(folderName: string) {
  return folderName
    .replace(/[-_]+/g, ' ')
    .replace(/\b(out\d*|dist|main|free|nextjs|tailwind)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function inferTechStack(folderName: string) {
  const name = folderName.toLowerCase();
  const stack = ['HTML5', 'CSS', 'JavaScript'];

  if (name.includes('next') || name.includes('shadcn') || name.includes('astro')) {
    stack.unshift('Next.js');
  }
  if (name.includes('tailwind')) {
    stack.splice(1, 0, 'Tailwind CSS');
  }
  if (name.includes('react') || name.includes('next') || name.includes('shadcn')) {
    stack.splice(1, 0, 'React');
  }

  return [...new Set(stack)];
}

function findEntrypoint(folderName: string, preferredEntrypoint?: string) {
  const demoPath = path.join(process.cwd(), 'public', 'demo', folderName);
  const candidates = [
    preferredEntrypoint,
    'index.html',
    'client/index.html',
    'src/index.html',
    'dist/index.html',
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of candidates) {
    if (existsSync(path.join(demoPath, candidate))) {
      return candidate;
    }
  }

  const indexFiles: string[] = [];
  const visit = (currentPath: string, relativePath = '') => {
    for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
      const entryRelativePath = path.join(relativePath, entry.name);
      if (entry.isDirectory()) {
        visit(path.join(currentPath, entry.name), entryRelativePath);
      } else if (entry.name === 'index.html' && !/(^|\/)(404|_not-found)(\/|\.)/.test(entryRelativePath)) {
        indexFiles.push(entryRelativePath);
      }
    }
  };

  visit(demoPath);
  return indexFiles.sort((first, second) => first.length - second.length)[0] || 'index.html';
}

function toPreviewUrl(folderName: string, entrypoint: string) {
  const encodedEntrypoint = entrypoint.split(path.sep).map((segment) => encodeURIComponent(segment)).join('/');
  return `/demo/${encodeURIComponent(folderName)}/${encodedEntrypoint}`;
}

function getThumbnailUrl(folderName: string, thumbnailFile?: string) {
  if (thumbnailFile) {
    const thumbnailPath = path.join(process.cwd(), 'public', 'demo', folderName, 'images', thumbnailFile);
    if (existsSync(thumbnailPath)) {
      return `/demo/${encodeURIComponent(folderName)}/images/${encodeURIComponent(thumbnailFile)}`;
    }
  }

  return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop';
}

function getTemplateMeta(folderName: string): TemplateMeta {
  return demoMeta[folderName] || {
    title: toTitle(folderName),
    category: 'Website Template',
    description: `Template website ${toTitle(folderName)} yang siap dikustomisasi untuk kebutuhan brand dan project digital Anda.`,
    techStack: inferTechStack(folderName),
    price: '125000.00',
  };
}

async function main() {
  const demoRoot = path.join(process.cwd(), 'public', 'demo');
  const folders = readdirSync(demoRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const values = folders.map((folderName) => {
    const meta = getTemplateMeta(folderName);
    const slug = toSlug(folderName);
    const entrypoint = findEntrypoint(folderName, meta.entrypoint);

    return {
      title: meta.title,
      slug,
      description: meta.description,
      category: meta.category,
      price: meta.price,
      previewUrl: toPreviewUrl(folderName, entrypoint),
      filePath: folderName,
      thumbnailUrl: getThumbnailUrl(folderName, meta.thumbnailFile),
      techStack: meta.techStack,
      isActive: true,
    };
  });

  if (values.length === 0) {
    throw new Error('Tidak ada folder demo yang cocok dengan metadata seed.');
  }

  for (const value of values) {
    await db.insert(templatesTable).values(value).onConflictDoUpdate({
      target: templatesTable.slug,
      set: {
        title: value.title,
        description: value.description,
        category: value.category,
        price: value.price,
        previewUrl: value.previewUrl,
        filePath: value.filePath,
        thumbnailUrl: value.thumbnailUrl,
        techStack: value.techStack,
        isActive: true,
      },
    });
  }

  console.log(`Berhasil melakukan seed ${values.length} template demo.`);
  process.exit(0);
}

main().catch((error) => {
  console.error('Gagal melakukan seeding data:', error);
  process.exitCode = 1;
});
