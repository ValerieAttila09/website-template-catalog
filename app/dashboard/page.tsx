import Link from 'next/link'
import { ArrowUpRight, Bell, BookOpen, CalendarDays, ChevronRight, Clock3, FileText, FolderKanban, LayoutDashboard, Library, Menu, MoreHorizontal, Plus, Search, Settings, Sparkles, Tags } from 'lucide-react'
import { getActiveTemplates } from '@/db/queries'

const projects = [
	{ name: 'The Medallion Plot', type: 'Novel', progress: 68, updated: 'Today, 13:17', color: 'bg-amber-100' },
	{ name: 'Climate Change Paper', type: 'Research', progress: 40, updated: 'Today, 12:17', color: 'bg-sky-100' },
	{ name: 'The Slottin Plot', type: 'Novel', progress: 72, updated: 'Yesterday', color: 'bg-rose-100' },
	{ name: 'Generate Paper', type: 'Research', progress: 50, updated: 'Yesterday', color: 'bg-violet-100' },
]

const sources = [
	{ title: 'The Medieval Climate: Novel opener', type: 'PDF', author: 'Valerie', icon: FileText, color: 'text-red-500 bg-red-50' },
	{ title: 'Web link: https://www.sources.name', type: 'LINK', author: 'Biare', icon: ArrowUpRight, color: 'text-sky-600 bg-sky-50' },
	{ title: 'Book A-nnuting and Nobor Laredocologis', type: 'BOOK', author: 'Johann Crawin', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
]

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
	return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><div className="mt-3 flex items-end justify-between gap-2"><strong className="font-heading text-2xl font-extrabold tracking-tight text-slate-950">{value}</strong><span className="text-[10px] font-bold text-emerald-600">{note}</span></div></div>
}

export default async function DashboardPage() {
	const templates = await getActiveTemplates()
	return (
			<main className="min-h-screen bg-[#f4f7f6] text-slate-950">
				<div className="flex min-h-screen">
					<aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
						<div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
							<span className="grid size-9 place-items-center rounded-xl bg-[#505F62] font-heading text-sm font-extrabold text-[#FFCF00]">U</span>
							<span className="font-heading text-lg font-extrabold tracking-tight">UPLIFT</span>
						</div>
						<div className="flex-1 px-4 py-6">
							<p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Workspace</p>
							<nav className="space-y-1 text-sm font-semibold">
								<Link href="/dashboard" className="flex items-center gap-3 rounded-xl bg-slate-950 px-3 py-3 text-white"><LayoutDashboard className="size-4" /> Overview</Link>
								<Link href="#projects" className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><FolderKanban className="size-4" /> Projects <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">4</span></Link>
								<Link href="#sources" className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><Library className="size-4" /> Sources</Link>
								<Link href="#notes" className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><BookOpen className="size-4" /> Notes</Link>
								<Link href="#calendar" className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><CalendarDays className="size-4" /> Calendar</Link>
							</nav>
							<p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Account</p>
							<Link href="#settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><Settings className="size-4" /> Settings</Link>
						</div>
						<div className="m-4 rounded-2xl bg-slate-950 p-4 text-white">
							<Sparkles className="size-5 text-lime-300" />
							<p className="mt-4 text-sm font-bold">Make space for better ideas.</p>
							<p className="mt-1 text-xs leading-5 text-slate-400">Explore new templates for your next project.</p>
							<Link href="/catalog" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-lime-300">Browse catalog <ArrowUpRight className="size-3" /></Link>
						</div>
					</aside>

					<section className="min-w-0 flex-1">
						<header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-5 backdrop-blur lg:px-8">
							<div className="flex items-center gap-3">
								<button type="button" aria-label="Open navigation" className="grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden"><Menu className="size-4" /></button>
								<label className="relative hidden sm:block"><span className="sr-only">Search workspace</span><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input placeholder="Search your workspace..." className="h-10 w-64 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white" /></label>
							</div>
							<div className="flex items-center gap-3"><button type="button" aria-label="Notifications" className="relative grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-500"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" /></button><div className="hidden h-7 w-px bg-slate-200 sm:block" /><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-full bg-lime-200 text-xs font-extrabold text-slate-800">VA</span><div className="hidden sm:block"><p className="text-xs font-bold">Valerie</p><p className="text-[10px] text-slate-400">Personal workspace</p></div></div></div>
						</header>

						<div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
							<div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-lime-700">Thursday, September 11</p><h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Good morning, Valerie.</h1><p className="mt-2 text-sm text-slate-500">A clear space for your best thinking today.</p></div><button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-lime-500 hover:text-slate-950"><Plus className="size-4" /> New project</button></div>

							<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active projects" value="05" note="+2 this month" /><StatCard label="Total sources" value="124" note="+18 this week" /><StatCard label="Notes captured" value="512" note="+36 this week" /><StatCard label="Words this month" value="8.5K" note="On track" /></div>

							<div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
								<section id="projects" className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-heading text-xl font-extrabold">My projects</h2><p className="mt-1 text-xs text-slate-400">Your active work, all in one place.</p></div><Link href="#projects" className="text-xs font-bold text-slate-500 hover:text-slate-950">See all <ChevronRight className="inline size-3" /></Link></div><div className="grid gap-3 sm:grid-cols-2">{projects.map((project) => <Link href="#projects" key={project.name} className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"><div className="flex items-start justify-between gap-3"><span className={`grid size-9 place-items-center rounded-xl ${project.color}`}><FolderKanban className="size-4 text-slate-600" /></span><MoreHorizontal className="size-4 text-slate-400" /></div><h3 className="mt-4 truncate text-sm font-extrabold text-slate-900">{project.name} <span className="font-medium text-slate-400">· {project.type}</span></h3><div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400"><span>{project.updated}</span><span className="text-slate-700">{project.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-lime-500" style={{ width: `${project.progress}%` }} /></div></Link>)}</div></section>

								<section id="notes" className="rounded-3xl border border-slate-200 bg-lime-100 p-5 shadow-sm sm:p-6"><div className="flex items-start justify-between"><div><span className="grid size-9 place-items-center rounded-xl bg-white text-lime-700"><Plus className="size-4" /></span><h2 className="mt-5 font-heading text-xl font-extrabold">Quick capture</h2><p className="mt-1 text-xs leading-5 text-slate-600">Save a thought before it disappears.</p></div><Sparkles className="size-5 text-lime-700" /></div><textarea placeholder="Write a quick note..." className="mt-6 h-24 w-full resize-none rounded-2xl border border-lime-200 bg-white/80 p-3 text-sm outline-none placeholder:text-slate-400 focus:border-lime-500" /><button type="button" className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800">Capture note</button></section>
							</div>

							<div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
								<section id="sources" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-heading text-xl font-extrabold">Latest sources</h2><p className="mt-1 text-xs text-slate-400">Recently added to your library.</p></div><Link href="#sources" className="text-xs font-bold text-slate-500 hover:text-slate-950">See all <ChevronRight className="inline size-3" /></Link></div><div className="divide-y divide-slate-100">{sources.map((source) => { const SourceIcon = source.icon; return <div key={source.title} className="flex items-center gap-3 py-3"><span className={`grid size-9 shrink-0 place-items-center rounded-xl ${source.color}`}><SourceIcon className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{source.title}</p><p className="mt-1 text-[10px] text-slate-400">{source.type} · Added by {source.author}</p></div><Clock3 className="hidden size-4 text-slate-300 sm:block" /></div> })}</div></section>

								<section id="calendar" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-heading text-xl font-extrabold">Next up</h2><p className="mt-1 text-xs text-slate-400">Your focus for today.</p></div><CalendarDays className="size-5 text-slate-400" /></div><div className="mt-5 space-y-3"><div className="flex gap-3 rounded-2xl bg-slate-50 p-3"><span className="mt-0.5 size-2 rounded-full bg-lime-500" /><div><p className="text-xs font-bold">Review research notes</p><p className="mt-1 text-[10px] text-slate-400">Today · 14:00</p></div></div><div className="flex gap-3 rounded-2xl bg-slate-50 p-3"><span className="mt-0.5 size-2 rounded-full bg-sky-500" /><div><p className="text-xs font-bold">Draft chapter outline</p><p className="mt-1 text-[10px] text-slate-400">Tomorrow · 09:30</p></div></div></div></section>
							</div>

							<section className="mt-6 rounded-3xl bg-slate-950 p-5 text-white shadow-sm sm:p-6"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime-300 text-slate-950"><Tags className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[.15em] text-lime-300">Recommended for you</p><h2 className="mt-2 font-heading text-xl font-extrabold">Keep your creative system fresh.</h2><p className="mt-1 max-w-xl text-sm text-slate-400">{templates.length ? `Explore ${templates.length} curated templates and find a better starting point for your next project.` : 'Explore curated templates and find a better starting point for your next project.'}</p></div></div><Link href="/catalog" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-slate-950 transition hover:bg-lime-300">Explore catalog <ArrowUpRight className="size-3.5" /></Link></div></section>
						</div>
					</section>
				</div>
			</main>
		)
}
