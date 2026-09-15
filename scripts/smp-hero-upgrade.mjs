import { readFileSync, writeFileSync } from 'fs';

const file = 'src/app/[section]/page.tsx';
const src = readFileSync(file, 'utf8');

// The exact old <section>...</section> block (single line, line 26)
const OLD_SECTION = `<section className="smp-hero" style={{backgroundImage:\`linear-gradient(0deg,#080c09 0%,#08110980 50%,#080c0950),url(\${String(s.banner||'/images/terrain.png')})\`}}><div className="container"><div className="eyebrow"><span/>A DIFFERENT KIND OF HOMELAND</div><h1>{String(s.title||'HOMELAND SMP')}</h1><h2>SEASON {number}</h2><span className="coming-soon">COMING SOON</span><p>{String(s.description||'A new chapter. A world of possibilities.')}</p>{date&&Number.isFinite(Date.parse(date))?<Countdown date={date}/>:<p style={{fontSize:10}}>The release date is still under wraps. Stay close.</p>}<div className="hero-buttons">{validLink(s.discord)?<a className="button secondary" href={validLink(s.discord)} target="_blank" rel="noreferrer"><Users size={16}/>Join the community<ArrowUpRight size={15}/></a>:<Link className="button secondary" href="/community"><Users size={16}/>Stay in the loop<ArrowUpRight size={15}/></Link>}{validLink(s.trailer)&&<a className="button secondary" href={validLink(s.trailer)} target="_blank" rel="noreferrer"><Play size={15}/>Watch the trailer</a>}</div></div></section>`;

// New <section> — split layout: logo col left, content col right
// Background: smp-banner.jpg + dark cinematic gradient overlay
// Logo: tilted -12deg, zoom-pulse animation
// All original content preserved untouched
const NEW_SECTION = `<section className="smp-hero smp-hero-v2" style={{backgroundImage:\`linear-gradient(to right, rgba(6,10,8,0.82) 0%, rgba(6,10,8,0.55) 50%, rgba(6,10,8,0.72) 100%), linear-gradient(to top, rgba(6,10,8,0.90) 0%, rgba(6,10,8,0.30) 40%, rgba(6,10,8,0.20) 100%), url('/images/smp-banner.jpg')\`,backgroundSize:'cover',backgroundPosition:'center 35%'}}><div className="container smp-hero-split"><div className="smp-logo-side"><img src="/images/smp-logo.png" alt="HOMELAND SMP Season 5 Logo" className="smp-logo-hero" width="280" height="280"/></div><div className="smp-content-side"><div className="eyebrow"><span/>A DIFFERENT KIND OF HOMELAND</div><h1>{String(s.title||'HOMELAND SMP')}</h1><h2>SEASON {number}</h2><span className="coming-soon">COMING SOON</span><p>{String(s.description||'A new chapter. A world of possibilities.')}</p>{date&&Number.isFinite(Date.parse(date))?<Countdown date={date}/>:<p style={{fontSize:10}}>The release date is still under wraps. Stay close.</p>}<div className="hero-buttons">{validLink(s.discord)?<a className="button secondary" href={validLink(s.discord)} target="_blank" rel="noreferrer"><Users size={16}/>Join the community<ArrowUpRight size={15}/></a>:<Link className="button secondary" href="/community"><Users size={16}/>Stay in the loop<ArrowUpRight size={15}/></Link>}{validLink(s.trailer)&&<a className="button secondary" href={validLink(s.trailer)} target="_blank" rel="noreferrer"><Play size={15}/>Watch the trailer</a>}</div></div></div></section>`;

if (!src.includes(OLD_SECTION)) {
  console.error('ERROR: Could not find the old section. No changes made.');
  process.exit(1);
}

const out = src.replace(OLD_SECTION, NEW_SECTION);
writeFileSync(file, out, 'utf8');
console.log('Done — SMP hero upgraded.');
