import { readFileSync, writeFileSync } from 'fs';

const file = 'src/app/[section]/page.tsx';
let src = readFileSync(file, 'utf8');

// The old SMP hero section (single line, line 26)
const OLD = `if(section==='smp'||section==='season-5'){const s=await getSettings('season');const number=String(s.number||5),ip=String(s.serverIp||''),date=String(s.releaseDate||'');const posts=await db.select().from(announcements).where(eq(announcements.section,'smp')).orderBy(desc(announcements.createdAt));return <><section className="smp-hero" style={{backgroundImage:\`linear-gradient(0deg,#080c09 0%,#08110980 50%,#080c0950),url(\${String(s.banner||'/images/terrain.png')})\`}}>`;

const NEW = `if(section==='smp'||section==='season-5'){const s=await getSettings('season');const number=String(s.number||5),ip=String(s.serverIp||''),date=String(s.releaseDate||'');const posts=await db.select().from(announcements).where(eq(announcements.section,'smp')).orderBy(desc(announcements.createdAt));return <><section className="smp-hero" style={{backgroundImage:\`url(\${String(s.banner||'/images/terrain.webp')})\`,backgroundSize:'cover',backgroundPosition:'center 40%'}}><div className="smp-hero-overlay"/><div className="container smp-hero-inner"><div className="smp-logo-col"><img src="/images/smp-logo.png" alt="HOMELAND SMP" className="smp-logo-img"/></div><div className="smp-hero-content">`;

// Also need to replace the closing </div></section> to account for new structure
// Old: </div></div></section>  (container > content)
// New: </div></div></div></section>  (container > smp-hero-inner > smp-hero-content + smp-logo-col)
const OLD_CLOSE = `</div></div></section>`;
const NEW_CLOSE = `</div></div></div></section>`;

if (!src.includes(OLD)) {
  console.error('Could not find OLD SMP hero string');
  process.exit(1);
}

src = src.replace(OLD, NEW);

// Replace the first occurrence of </div></div></section> after the smp-hero start
// to add the extra closing div for smp-hero-inner
const heroIdx = src.indexOf('smp-hero-inner');
const closeIdx = src.indexOf('</div></section>', heroIdx);
src = src.slice(0, closeIdx) + '</div></div></section>' + src.slice(closeIdx + '</div></section>'.length);

writeFileSync(file, src, 'utf8');
console.log('Patched successfully');
