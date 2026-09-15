import { readFileSync, writeFileSync } from 'fs';

const file = 'src/app/[section]/page.tsx';
let src = readFileSync(file, 'utf8');

// Find line 26 (the smp section) and replace the entire mangled block
// with the original pristine version
const BROKEN = ` if(section==='smp'||section==='season-5'){const s=await getSettings('season');const number=String(s.number||5),ip=String(s.serverIp||''),date=String(s.releaseDate||'');const posts=await db.select().from(announcements).where(eq(announcements.section,'smp')).orderBy(desc(announcements.createdAt));return <><section className="smp-hero" style={{backgroundImage:\`url(\${String(s.banner||'/images/terrain.webp')})\`,backgroundSize:'cover',backgroundPosition:'center 40%'}}><div className="smp-hero-overlay"/><div className="container smp-hero-inner"><div className="smp-logo-col"><img src="/images/smp-logo.png" alt="HOMELAND SMP" className="smp-logo-img"/></div><div className="smp-hero-content"><div className="eyebrow"><span/>A DIFFERENT KIND OF HOMELAND</div><h1>{String(s.title||'HOMELAND SMP')}</h1><h2>SEASON {number}</h2><span className="coming-soon">COMING SOON</span><p>{String(s.description||'A new chapter. A world of possibilities.')}</p>{date&&Number.isFinite(Date.parse(date))?<Countdown date={date}/>:<p style={{fontSize:10}}>The release date is still under wraps. Stay close.</p>}<div className="hero-buttons">{validLink(s.discord)?<a className="button secondary" href={validLink(s.discord)} target="_blank" rel="noreferrer"><Users size={16}/>Join the community<ArrowUpRight size={15}/></a>:<Link className="button secondary" href="/community"><Users size={16}/>Stay in the loop<ArrowUpRight size={15}/></Link>}{validLink(s.trailer)&&<a className="button secondary" href={validLink(s.trailer)} target="_blank" rel="noreferrer"><Play size={15}/>Watch the trailer</a>}</div></div></div></section>`;

const ORIGINAL = ` if(section==='smp'||section==='season-5'){const s=await getSettings('season');const number=String(s.number||5),ip=String(s.serverIp||''),date=String(s.releaseDate||'');const posts=await db.select().from(announcements).where(eq(announcements.section,'smp')).orderBy(desc(announcements.createdAt));return <><section className="smp-hero" style={{backgroundImage:\`linear-gradient(0deg,#080c09 0%,#08110980 50%,#080c0950),url(\${String(s.banner||'/images/terrain.png')})\`}}><div className="container"><div className="eyebrow"><span/>A DIFFERENT KIND OF HOMELAND</div><h1>{String(s.title||'HOMELAND SMP')}</h1><h2>SEASON {number}</h2><span className="coming-soon">COMING SOON</span><p>{String(s.description||'A new chapter. A world of possibilities.')}</p>{date&&Number.isFinite(Date.parse(date))?<Countdown date={date}/>:<p style={{fontSize:10}}>The release date is still under wraps. Stay close.</p>}<div className="hero-buttons">{validLink(s.discord)?<a className="button secondary" href={validLink(s.discord)} target="_blank" rel="noreferrer"><Users size={16}/>Join the community<ArrowUpRight size={15}/></a>:<Link className="button secondary" href="/community"><Users size={16}/>Stay in the loop<ArrowUpRight size={15}/></Link>}{validLink(s.trailer)&&<a className="button secondary" href={validLink(s.trailer)} target="_blank" rel="noreferrer"><Play size={15}/>Watch the trailer</a>}</div></div></section>`;

if (!src.includes(BROKEN)) {
  console.error('Could not find broken string — file may already be restored or further mangled.');
  console.log('Current line 26 start:', src.split('\n')[25]?.slice(0, 120));
  process.exit(1);
}

src = src.replace(BROKEN, ORIGINAL);
writeFileSync(file, src, 'utf8');
console.log('Restored successfully.');
