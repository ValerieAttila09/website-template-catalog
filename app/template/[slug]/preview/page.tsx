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

  return <PreviewShell title={template.title} slug={template.slug} previewUrl={previewUrl} templateId={template.id} category={template.category || 'Website Template'} techStack={template.techStack || []} salesCount={template.salesCount} />
}