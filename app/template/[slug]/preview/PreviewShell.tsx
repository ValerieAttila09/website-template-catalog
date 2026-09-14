'use client'

import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react'
import { ArrowLeft, Check, ExternalLink, Monitor, QrCode, RotateCw, Smartphone, Tablet, X, ZoomIn } from 'lucide-react'
import { useEffect, useState } from 'react'

type PreviewMode = 'desktop' | 'tablet' | 'mobile'
type Orientation = 'portrait' | 'landscape'

const modes: Array<{ id: PreviewMode; label: string; width: string; icon: typeof Monitor }> = [
  { id: 'desktop', label: 'Desktop', width: '100%', icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: '768px', icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: '380px', icon: Smartphone },
]

interface PreviewShellProps {
  title: string
  slug: string
  previewUrl: string
  formattedPrice: string
  templateId: string
}

export default function PreviewShell({ title, slug, previewUrl, formattedPrice, templateId }: PreviewShellProps) {
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0]
  const frameDimensions = mode === 'mobile'
    ? orientation === 'portrait' ? { width: '375px', height: '667px' } : { width: '667px', height: '375px' }
    : mode === 'tablet'
      ? orientation === 'portrait' ? { width: '768px', height: '1024px' } : { width: '1024px', height: '768px' }
      : { width: '100%', height: 'calc(100vh - 154px)' }

  useEffect(() => {
    if (!isQrOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsQrOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isQrOpen])

  const openQrPopover = () => {
    setShareUrl(window.location.href)
    setIsCopied(false)
    setIsQrOpen(true)
  }

  const copyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    window.setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#111817] text-white">
      <header className="z-20 shrink-0 border-b border-white/10 bg-[#111817] px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href={`/template/${slug}`} aria-label="Kembali ke detail" className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white">
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{title}</p>
              <p className="hidden text-[10px] uppercase tracking-[.16em] text-slate-500 sm:block">Interactive live preview</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button type="button" onClick={openQrPopover} title="Uji di HP" aria-label="Uji di HP" aria-expanded={isQrOpen} className="grid size-9 place-items-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white">
              <QrCode className="size-4" />
            </button>
            <span className="hidden text-sm font-bold text-lime-300 md:block">{formattedPrice}</span>
            <a href={`/api/checkout?templateId=${templateId}`} className="rounded-xl bg-lime-300 px-3 py-2 text-xs font-extrabold text-slate-950 transition hover:bg-lime-200 sm:px-4 sm:py-2.5">Buy template <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </header>

      {isQrOpen && (
        <div className="fixed inset-0 z-40" role="presentation">
          <button type="button" aria-label="Tutup Uji di HP" className="absolute inset-0 size-full cursor-default bg-black/30" onClick={() => setIsQrOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="qr-preview-title" className="absolute right-4 top-[4.75rem] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#111817] p-5 text-center shadow-2xl shadow-black/50 sm:right-6">
            <div className="mb-4 flex items-start justify-between gap-3 text-left">
              <div>
                <h2 id="qr-preview-title" className="text-sm font-extrabold text-white">Uji di HP</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">Pindai kode QR ini menggunakan kamera HP untuk mencoba template langsung di perangkat fisik kamu.</p>
              </div>
              <button type="button" onClick={() => setIsQrOpen(false)} aria-label="Tutup" className="grid size-7 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <div className="mx-auto flex size-[196px] items-center justify-center rounded-xl bg-white p-2">
              {shareUrl && <QRCodeCanvas value={shareUrl} size={180} bgColor="#ffffff" fgColor="#111817" level="M" includeMargin={false} />}
            </div>
            <button type="button" onClick={copyShareUrl} disabled={!shareUrl} className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
              {isCopied ? <Check className="size-3.5 text-lime-300" /> : <ExternalLink className="size-3.5" />}
              {isCopied ? 'Tersalin' : 'Salin Link'}
            </button>
          </div>
        </div>
      )}

      <section className="relative flex min-h-0 flex-1 items-start justify-center overflow-auto bg-[#1c2523]">
        <div className={`relative flex min-h-full w-full justify-center ${mode === 'desktop' ? 'py-0' : 'py-3'}`}>
          <div className={`relative shrink-0 overflow-hidden bg-white shadow-2xl shadow-black/40 transition-all duration-300 ease-in-out ${mode === 'mobile' ? 'rounded-[2rem] border-[6px] border-slate-700' : mode === 'tablet' ? 'rounded-xl border-4 border-slate-700' : 'rounded-none'}`} style={{ width: frameDimensions.width, height: frameDimensions.height, maxWidth: '100%' }}>
            {mode === 'mobile' && <div className="absolute left-1/2 top-1.5 z-10 h-4 w-24 -translate-x-1/2 rounded-full bg-slate-900" aria-hidden="true" />}
            <iframe src={previewUrl} title={`${title} ${activeMode.label} preview`} className="absolute inset-0 size-full border-0 bg-white" sandbox="allow-scripts allow-same-origin allow-forms" />
          </div>
        </div>
        <div className="pointer-events-none fixed bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-[10px] font-semibold text-slate-400 shadow-xl backdrop-blur md:flex"><ZoomIn className="size-3.5 text-lime-300" /> Preview viewport mengikuti ukuran device yang dipilih</div>
        <div className="w-auto space-y-2 min-h-full p-3 bg-[#111817] border-l border-white/10 pt-3">
          <div className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 p-1">
            {modes.map((item) => {
              const Icon = item.icon
              const isActive = item.id === mode
              return <button key={item.id} type="button" onClick={() => setMode(item.id)} aria-pressed={isActive} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[11px] font-bold transition sm:px-3 ${isActive ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}><Icon className="size-3.5" /> <span className="hidden sm:inline">{item.label}</span></button>
            })}
          </div>
          {mode !== 'desktop' && <button type="button" onClick={() => setOrientation((current) => current === 'portrait' ? 'landscape' : 'portrait')} aria-pressed={orientation === 'landscape'} title={`Ubah ke mode ${orientation === 'portrait' ? 'landscape' : 'portrait'}`} className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-[11px] font-bold transition-all duration-300 ease-in-out ${orientation === 'landscape' ? 'border-lime-300/40 bg-lime-300 text-slate-950' : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}><RotateCw className="size-3.5" /> <span className="hidden sm:inline">{orientation === 'portrait' ? 'Landscape' : 'Portrait'}</span></button>}
          <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500"><span className="hidden sm:inline">Viewport: {frameDimensions.width} x {frameDimensions.height}</span><a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-300 hover:text-white"><ExternalLink className="size-3.5" /> Open separately</a></div>
        </div>
      </section>
    </main>
  )
}
