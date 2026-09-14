'use client'

import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react'
import { ArrowLeft, Check, CheckCircle2, ChevronLeft, ChevronRight, Cpu, ExternalLink, Info, Monitor, QrCode, RotateCw, ShoppingBag, Smartphone, Star, Tablet, X, ZoomIn } from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'

type PreviewMode = 'desktop' | 'tablet' | 'mobile'
type Orientation = 'portrait' | 'landscape'
type License = 'personal' | 'commercial'
type MobileDeviceType = 'iphone' | 'android'

interface MockupProps {
  children: ReactNode
  className?: string
  url?: string
  orientation?: Orientation
}

function SafariMockup({ children, className = '', url = 'preview.local' }: MockupProps) {
  const displayUrl = url.replace(/^https?:\/\//, '').split('/')[0] || 'preview.local'

  return (
    <div className={`flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-600/80 bg-slate-200 p-1.5 shadow-2xl drop-shadow-2xl ${className}`}>
      <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-t-lg border-b border-slate-300 bg-slate-100 px-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-auto flex h-5 max-w-[18rem] flex-1 items-center justify-center truncate rounded-md bg-white/80 px-3 text-[9px] font-medium text-slate-500 shadow-inner">{displayUrl}</div>
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-lg bg-white">{children}</div>
    </div>
  )
}

function IPhoneMockup({ children, className = '', orientation = 'portrait' }: MockupProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[2.5rem] border-[7px] border-slate-700 bg-slate-950 p-1 shadow-2xl drop-shadow-2xl ${className}`}>
      <div className={`pointer-events-none absolute z-10 rounded-full bg-black transition-all duration-300 ${orientation === 'landscape' ? 'left-2 top-1/2 h-32 w-6 -translate-y-1/2' : 'left-1/2 top-2 h-6 w-32 -translate-x-1/2'}`} aria-hidden="true" />
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-white">{children}</div>
    </div>
  )
}

function AndroidMockup({ children, className = '', orientation = 'portrait' }: MockupProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[2rem] border-[7px] border-slate-700 bg-slate-950 p-1.5 shadow-2xl drop-shadow-2xl ${className}`}>
      <div className={`pointer-events-none absolute z-10 size-5 rounded-full border-2 border-slate-800 bg-black transition-all duration-300 ${orientation === 'landscape' ? 'left-2 top-1/2 -translate-y-1/2' : 'left-1/2 top-2 -translate-x-1/2'}`} aria-hidden="true" />
      <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-white">{children}</div>
    </div>
  )
}

function TabletMockup({ children, className = '' }: MockupProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-[1.5rem] border-[10px] border-slate-700 bg-slate-950 p-1.5 shadow-2xl drop-shadow-2xl ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[1rem] bg-white">{children}</div>
    </div>
  )
}

const modes: Array<{ id: PreviewMode; label: string; width: string; icon: typeof Monitor }> = [
  { id: 'desktop', label: 'Desktop', width: '100%', icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: '768px', icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: '380px', icon: Smartphone },
] 

interface PreviewShellProps {
  title: string
  slug: string
  previewUrl: string
  templateId: string
  category: string
  techStack: string[]
  salesCount: number
}

export default function PreviewShell({ title, slug, previewUrl, templateId, category, techStack, salesCount }: PreviewShellProps) {
  const [mode, setMode] = useState<PreviewMode>('desktop')
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const [mobileDeviceType, setMobileDeviceType] = useState<MobileDeviceType>('iphone')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [license, setLicense] = useState<License>('personal')
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const activeMode = modes.find((item) => item.id === mode) ?? modes[0]
  const frameDimensions = mode === 'mobile'
    ? orientation === 'portrait' ? { width: '375px', height: '724px' } : { width: '724px', height: '375px' }
    : mode === 'tablet'
      ? orientation === 'portrait' ? { width: '768px', height: '1024px' } : { width: '1024px', height: '768px' }
      : { width: '100%', height: '100%' }
  const licensePrices: Record<License, string> = {
    personal: 'Rp 165.000',
    commercial: 'Rp 450.000',
  }
  const checkoutUrl = `/api/checkout?templateId=${templateId}&license=${license}`

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

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

  const addToCart = () => {
    setIsAddedToCart(true)
    window.setTimeout(() => setIsAddedToCart(false), 2200)
  }

  const previewFrame = <iframe src={previewUrl} title={`${title} ${activeMode.label} preview`} className="absolute inset-0 size-full border-0 bg-white" sandbox="allow-scripts allow-same-origin allow-forms" />

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
            <button type="button" onClick={() => setIsSidebarOpen(true)} title="Info & Tech Stack" aria-label="Info & Tech Stack" aria-expanded={isSidebarOpen} className="grid size-9 place-items-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white">
              <Info className="size-4" />
            </button>
            <button type="button" onClick={openQrPopover} title="Uji di HP" aria-label="Uji di HP" aria-expanded={isQrOpen} className="grid size-9 place-items-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white">
              <QrCode className="size-4" />
            </button>
            <span className="hidden text-sm font-bold text-lime-300 md:block">{licensePrices[license]}</span>
            <a href={checkoutUrl} className="rounded-xl bg-lime-300 px-3 py-2 text-xs font-extrabold text-slate-950 transition hover:bg-lime-200 sm:px-4 sm:py-2.5">Buy template <span aria-hidden="true">↗</span></a>
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

      <section className="relative flex min-h-0 h-[calc(100vh-45px)] flex-1 items-start justify-center overflow-hidden bg-[#1c2523]">
        <div className={`relative flex h-full min-h-0 w-full justify-center ${mode === 'desktop' ? 'py-0' : 'py-3'}`}>
          <div
            className="relative shrink-0 transition-all duration-300 ease-in-out"
            style={{
              width: frameDimensions.width,
              height: frameDimensions.height,
              maxWidth: '100%'
            }}>
            {mode === 'desktop' && <SafariMockup url={previewUrl}>{previewFrame}</SafariMockup>}
            {mode === 'tablet' && <TabletMockup>{previewFrame}</TabletMockup>}
            {mode === 'mobile' && (mobileDeviceType === 'iphone' ? <IPhoneMockup orientation={orientation}>{previewFrame}</IPhoneMockup> : <AndroidMockup orientation={orientation}>{previewFrame}</AndroidMockup>)}
          </div>
        </div>
        <div className="pointer-events-none fixed bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-[10px] font-semibold text-slate-400 shadow-xl backdrop-blur md:flex"><ZoomIn className="size-3.5 text-lime-300" /> Preview viewport mengikuti ukuran device yang dipilih</div>
        <aside className={`relative flex h-full shrink-0 flex-col border-l border-white/10 bg-[#111817] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-12'}`} aria-label="Preview controls and template information">
          {/* <button type="button" onClick={() => setIsSidebarOpen((open) => !open)} aria-label={isSidebarOpen ? 'Tutup panel kontrol' : 'Buka panel kontrol'} title={isSidebarOpen ? 'Tutup panel kontrol' : 'Buka panel kontrol'} className="absolute -left-4 top-4 z-10 grid size-8 place-items-center rounded-full border border-white/10 bg-slate-950 text-slate-300 shadow-lg transition hover:border-lime-300/40 hover:text-lime-300">
            {isSidebarOpen ? <PanelRightClose className="size-4" /> : <PanelRightOpen className="size-4" />}
          </button> */}

          {isSidebarOpen ? <>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div><p className="flex items-center gap-2 text-xs font-extrabold text-white"><Cpu className="size-3.5 text-lime-300" /> Preview controls</p><p className="mt-1 text-[10px] text-slate-500">Shape the viewport and explore details</p></div>
              <button type="button" onClick={() => setIsSidebarOpen(false)} aria-label="Tutup panel" className="grid size-7 place-items-center rounded-lg text-slate-500 transition hover:bg-white/10 hover:text-white"><ChevronRight className="size-4" /></button>
            </div>
            <div className="preview-scrollbar flex-1 space-y-5 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb:hover]:bg-lime-300/40 [&::-webkit-scrollbar-track]:bg-transparent">
              <section>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Device & viewport</p>
                <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                  {modes.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === mode
                    return <button key={item.id} type="button" onClick={() => setMode(item.id)} aria-pressed={isActive} className={`flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-bold transition ${isActive ? 'bg-lime-300 text-slate-950 shadow-sm' : 'text-slate-500 hover:bg-white/10 hover:text-white'}`}><Icon className="size-4" /><span>{item.label}</span></button>
                  })}
                </div>
                {mode === 'mobile' && <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
                  {(['iphone', 'android'] as MobileDeviceType[]).map((device) => <button key={device} type="button" onClick={() => setMobileDeviceType(device)} aria-pressed={mobileDeviceType === device} className={`rounded-md px-2 py-1.5 text-[10px] font-bold transition ${mobileDeviceType === device ? 'bg-white text-slate-950' : 'text-slate-500 hover:bg-white/10 hover:text-white'}`}>{device === 'iphone' ? 'iPhone (iOS)' : 'Android'}</button>)}
                </div>}
                <div className="mt-2 flex items-center gap-2">
                  {mode !== 'desktop' && <button type="button" onClick={() => setOrientation((current) => current === 'portrait' ? 'landscape' : 'portrait')} aria-pressed={orientation === 'landscape'} className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-[10px] font-bold transition ${orientation === 'landscape' ? 'border-lime-300/40 bg-lime-300 text-slate-950' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}><RotateCw className="size-3.5" />{orientation === 'portrait' ? 'Landscape' : 'Portrait'}</button>}
                  <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 text-[10px] font-semibold text-slate-500">{frameDimensions.width} x {frameDimensions.height}</span>
                </div>
                <a href={previewUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 transition hover:text-lime-300"><ExternalLink className="size-3" /> Open separately</a>
              </section>

              <section>
                <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Choose your license</p><span className="text-[10px] font-bold text-lime-300">{licensePrices[license]}</span></div>
                <div className="space-y-2">
                  {(['personal', 'commercial'] as License[]).map((item) => <label key={item} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${license === item ? 'border-lime-300/50 bg-lime-300/10' : 'border-white/10 bg-white/[0.03] hover:border-white/20'}`}><span className="flex items-center gap-2"><input type="radio" name="license" value={item} checked={license === item} onChange={() => setLicense(item)} className="accent-lime-300" /><span><span className="block text-xs font-bold text-white">{item === 'personal' ? 'Personal License' : 'Commercial License'}</span><span className="mt-0.5 block text-[10px] text-slate-500">{item === 'personal' ? 'For one personal project' : 'For client and business work'}</span></span></span><span className="text-xs font-extrabold text-lime-300">{licensePrices[item]}</span></label>)}
                </div>
              </section>

              <section>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">What is included</p>
                <div className="space-y-2">
                  {['Next.js 16 & App Router Ready', 'Tailwind CSS Styling', '100% Fully Responsive Layout', '99+ Speed & SEO Lighthouse Score', 'Figma Design File Included'].map((feature) => <div key={feature} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[11px] font-semibold text-slate-300"><CheckCircle2 className="size-3.5 shrink-0 text-lime-300" />{feature}</div>)}
                </div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">Template snapshot</p><span className="text-[10px] font-bold text-slate-500">{salesCount.toLocaleString('id-ID')} sold</span></div>
                <p className="text-xs font-bold text-white">{category}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{(techStack.length > 0 ? techStack : ['Next.js', 'React', 'Tailwind CSS']).map((technology) => <span key={technology} className="rounded-md border border-lime-300/20 bg-lime-300/10 px-2 py-1 text-[10px] font-bold text-lime-200">{technology}</span>)}</div>
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between"><div><p className="text-sm font-extrabold text-white">Studio Pixel</p><span className="mt-1 inline-flex rounded-full bg-lime-300/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-lime-300">Pro Author</span></div><div className="text-right"><p className="flex items-center gap-1 text-sm font-extrabold text-white"><Star className="size-3.5 fill-lime-300 text-lime-300" /> 4.9/5</p><p className="mt-1 text-[10px] text-slate-500">48 reviews</p></div></div>
                <blockquote className="mt-4 border-l-2 border-lime-300/50 pl-3 text-[11px] italic leading-5 text-slate-400">“Template paling rapi dan kodenya mudah disesuaikan. Setup hanya butuh 5 menit!”<footer className="mt-2 not-italic font-bold text-slate-300">Alex R. <span className="font-normal text-slate-500">· Verified Buyer</span></footer></blockquote>
              </section>
            </div>
            <div className="space-y-2 border-t border-white/10 p-4">
              <a href={checkoutUrl} className="block rounded-xl bg-lime-300 px-4 py-3 text-center text-xs font-extrabold text-slate-950 transition hover:bg-lime-200">Buy Template · {licensePrices[license]}</a>
              <button type="button" onClick={addToCart} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-white/10">{isAddedToCart ? <Check className="size-3.5 text-lime-300" /> : <ShoppingBag className="size-3.5" />}{isAddedToCart ? 'Added to Collection' : 'Add to Cart / Collection'}</button>
              <Link href={`/template/${slug}`} className="block pt-1 text-center text-[10px] font-bold text-slate-500 transition hover:text-white">View full template details</Link>
            </div>
          </> : <div className="flex h-full flex-col items-center gap-4 pt-4"><button type="button" onClick={() => setIsSidebarOpen(true)} aria-label="Buka panel kontrol" className="grid size-8 place-items-center rounded-lg bg-white/5 text-slate-400 transition hover:bg-lime-300 hover:text-slate-950"><ChevronLeft className="size-4" /></button><div className="flex flex-col items-center gap-3 text-slate-500"><Monitor className="size-4" /><ShoppingBag className="size-4" /><Info className="size-4" /></div></div>}
        </aside>
      </section>
    </main>
  )
}
