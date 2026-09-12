import { getTemplateBySlug } from '@/db/queries'
import { notFound } from 'next/navigation'
import PreviewShell from './PreviewShell'

interface PreviewPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function LivePreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params
  const template = await getTemplateBySlug(resolvedParams.slug)

  if (!template) {
    notFound()
  }

  const previewUrl = template.previewUrl || `/demo/${resolvedParams.slug}/index.html`

  // Format harga untuk tombol beli di top-bar
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(template.price))

  return <PreviewShell title={template.title} slug={template.slug} previewUrl={previewUrl} formattedPrice={formattedPrice} templateId={template.id} />
}