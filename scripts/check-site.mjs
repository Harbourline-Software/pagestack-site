// Checks the built site (_site): every page has a title, meta description, canonical URL and
// social tags; every internal link and asset resolves; no personal details or leftover
// template placeholders. No dependencies.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = '_site';
const brand = JSON.parse(readFileSync('src/_data/brand.json', 'utf8'));
const prefix = brand.customDomain ? '/' : brand.sitePathPrefix;
const errors = [];

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const pages = walk(OUT).filter((f) => f.endsWith('.html'));
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const r = relative(OUT, file);
  for (const [label, re] of [
    ['title', /<title>[^<]{3,}<\/title>/],
    ['meta description', /<meta name="description" content="[^"]{20,}"/],
    ['canonical', /<link rel="canonical" href="https:\/\//],
    ['og:image', /<meta property="og:image" content="https:\/\//],
    ['lang', /<html lang="/],
  ]) {
    if (!re.test(html)) errors.push(`${r}: missing ${label}`);
  }
  if (/\{\{|\{%|undefined/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) errors.push(`${r}: leftover template text or "undefined"`);
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)/g)) {
    const url = m[1];
    if (/^(https?:|mailto:)/.test(url)) continue;
    if (!url.startsWith(prefix)) {
      errors.push(`${r}: link "${url}" lacks the path prefix ${prefix}`);
      continue;
    }
    const path = join(OUT, url.slice(prefix.length));
    const target = url.endsWith('/') ? join(path, 'index.html') : path;
    if (!existsSync(target)) errors.push(`${r}: broken link ${url}`);
  }
}
if (!existsSync(join(OUT, 'sitemap.xml')) || !existsSync(join(OUT, 'robots.txt'))) errors.push('sitemap.xml or robots.txt missing');
const all = pages.map((f) => readFileSync(f, 'utf8')).join('\n');
if (/\+?\b61\s?4\d{2}\s?\d{3}\s?\d{3}\b|\bPO Box\b/i.test(all)) errors.push('possible phone number or postal address on the site');

if (errors.length) {
  console.error(`check-site: ${errors.length} problem(s)\n - ${errors.join('\n - ')}`);
  process.exit(1);
}
console.log(`check-site: OK (${pages.length} pages)`);
