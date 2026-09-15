import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.mp4': 'video/mp4',
  '.otf': 'font/otf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ttf': 'font/ttf',
  '.webm': 'video/webm',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function isInside(root: string, candidate: string) {
  const relativePath = path.relative(root, candidate)
  return relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
}

async function findByName(root: string, fileName: string): Promise<string | null> {
  const entries = await readdir(root, { withFileTypes: true })
  const matches: string[] = []

  for (const entry of entries) {
    const entryPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      const nestedMatch = await findByName(entryPath, fileName)
      if (nestedMatch) matches.push(nestedMatch)
    } else if (entry.name === fileName) {
      matches.push(entryPath)
    }
  }

  return matches.sort((first, second) => first.length - second.length)[0] || null
}

export async function GET(request: NextRequest) {
  const folder = request.nextUrl.searchParams.get('folder') || request.headers.get('x-uplift-demo-folder')
  const requestedPath = request.nextUrl.searchParams.get('path') || request.headers.get('x-uplift-demo-path')

  if (!folder || !requestedPath || folder.includes('/') || folder.includes('\\')) {
    return new NextResponse('Invalid demo asset request', { status: 400 })
  }

  const demoRoot = path.join(process.cwd(), 'public', 'demo')
  const folderRoot = path.join(demoRoot, folder)
  const normalizedPath = decodeURIComponent(requestedPath).replace(/^\/+/, '')
  const directPath = path.resolve(folderRoot, normalizedPath)
  let assetPath: string | null = null

  if (isInside(folderRoot, directPath)) {
    try {
      if ((await stat(directPath)).isFile()) assetPath = directPath
    } catch {
      assetPath = null
    }
  }

  if (!assetPath) {
    const requestedName = path.basename(normalizedPath)
    const aliases = [requestedName]
    if (requestedName.startsWith('_next.')) aliases.push(`_${requestedName}`)
    if (requestedName.startsWith('_next_')) aliases.push(`__next._${requestedName.slice('_next_'.length)}`)

    for (const alias of aliases) {
      assetPath = await findByName(folderRoot, alias)
      if (assetPath) break
    }
  }

  if (!assetPath) return new NextResponse('Demo asset not found', { status: 404 })

  const body = await readFile(assetPath)
  const extension = path.extname(assetPath).toLowerCase()
  return new NextResponse(body, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    },
  })
}
