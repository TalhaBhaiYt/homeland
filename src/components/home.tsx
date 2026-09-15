'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Download, Sparkles, Box, Plus, Layers3, Check, ChevronDown, ShieldCheck, Users, Code2, PenTool, Zap } from 'lucide-react';
import { useEffect, useRef, useState, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHead, CategoryCard, Icon } from './ui';
import { FeaturedContent } from './content';
import type { ContentItem } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/* ─── Reveal wrapper: fade + rise on scroll ─── */
function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set(el, { opacity: 0, y: 36 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, delay, ease: 'power3.out' }),
    });
    return () => trigger.kill();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ─── Stagger group: children cascade in ─── */
function StaggerReveal({ children, className = '', stagger = 0.1 }: { children: ReactNode; className?: string; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = Array.from(el.children) as HTMLElement[];
    gsap.set(items, { opacity: 0, y: 40 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.8, stagger, ease: 'power3.out' }),
    });
    return () => trigger.kill();
  }, [stagger]);
  return <div ref={ref} className={className}>{children}</div>;
}

/* ─── Animated counter ─── */
function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(value); return; }
    let frame = 0;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - start) / 1400, 1);
          setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
    });
    return () => { trigger.kill(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}

/* ─── Hero: split-char title + floating tags + parallax art ─── */
function HeroSection({ homepage }: { homepage: Record<string, unknown> }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const artRef = useRef<HTMLImageElement>(null);
  const tag1Ref = useRef<HTMLDivElement>(null);
  const tag2Ref = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      // split h1 into word spans
      const h1 = titleRef.current;
      if (h1) {
        const words = h1.innerText.split('\n');
        h1.innerHTML = words.map(w =>
          `<span class="hero-word" style="display:block;overflow:hidden"><span style="display:block">${w}</span></span>`
        ).join('');
        const spans = h1.querySelectorAll('.hero-word > span');
        gsap.set(spans, { yPercent: 110 });
        gsap.to(spans, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.2 });
      }

      // eyebrow + copy fade in
      gsap.set([eyebrowRef.current, copyRef.current], { opacity: 0, y: 18 });
      gsap.to([eyebrowRef.current], { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' });
      gsap.to(copyRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.55, ease: 'power3.out' });

      // art parallax on scroll
      if (artRef.current) {
        gsap.to(artRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { trigger: artRef.current, start: 'top top', end: 'bottom top', scrub: 1.2 },
        });
      }

      // floating tags gentle bob (idle)
      if (tag1Ref.current) {
        gsap.set(tag1Ref.current, { opacity: 0, x: 20 });
        gsap.to(tag1Ref.current, { opacity: 1, x: 0, duration: 0.7, delay: 0.9, ease: 'power3.out' });
        gsap.to(tag1Ref.current, { y: -9, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4 });
      }
      if (tag2Ref.current) {
        gsap.set(tag2Ref.current, { opacity: 0, x: -20 });
        gsap.to(tag2Ref.current, { opacity: 1, x: 0, duration: 0.7, delay: 1.1, ease: 'power3.out' });
        gsap.to(tag2Ref.current, { y: 9, duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero">
      <div className="hero-grid" />
      {/* ambient glow blobs */}
      <div className="glow-blob glow-blob-1" aria-hidden="true" />
      <div className="glow-blob glow-blob-2" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy">
          <div ref={eyebrowRef} className="hero-eyebrow">
            <span className="pulse-dot" />
            {String(homepage.eyebrow || 'A HOME FOR YOUR NEXT BIG IDEA')}
            <ArrowUpRight size={12} />
          </div>
          <h1 ref={titleRef}>DISCOVER.<br />DOWNLOAD.<br /><span>CREATE.</span></h1>
          <div ref={copyRef}>
            <p>{String(homepage.description || 'Your premium destination for digital content, creator resources, tools, downloads and community creations.')}</p>
            <div className="hero-buttons">
              <Link href="/free" className="button primary"><Download size={17} />Explore Free Stuff<ArrowUpRight size={16} /></Link>
              <Link href="/paid" className="button secondary">Explore Paid Stuff<ArrowUpRight size={16} /></Link>
            </div>
            <div className="hero-trust">
              <span><ShieldCheck size={13} />Creator-made content</span>
              <span className="dot-separator" />
              <span><Zap size={13} />Instant inspiration</span>
              <span className="dot-separator" />
              <span>No limits.</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <img ref={artRef} className="hero-art" src="/images/hero-art.png" alt="Sculptural crimson and chrome portals" fetchPriority="high" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div ref={tag1Ref} className="float-tag tag-resource">
            <span className="float-icon red-icon"><Layers3 size={19} /></span>
            <div><strong>Endless possibilities.</strong><span>One creative home.</span></div>
            <span className="tag-spark">✧</span>
          </div>
          <div className="float-square square-top"><Code2 size={23} /></div>
          <div className="float-square square-bottom"><PenTool size={22} /></div>
          <div ref={tag2Ref} className="float-tag tag-create">
            <span className="float-icon purple-icon"><Sparkles size={19} /></span>
            <div><strong>Made to make more.</strong><span>By creators. For creators.</span></div>
          </div>
          <div className="art-caption"><span /> YOUR NEXT IDEA STARTS HERE <span /></div>
        </div>
      </div>
      <div className="container hero-bottom">
        <span><span className="live-dot" />THE CREATOR PLATFORM</span>
        <a href="#explore">A little scroll. A lot to discover.<ChevronDown size={13} /></a>
        <span>FREE TO EXPLORE. BUILT TO INSPIRE.</span>
      </div>
    </section>
  );
}

/* ─── Stats band: pinned scrub + counter ─── */
function StatsBand({ stats }: { stats: { total: number; downloads: number; creators: number; users: number } }) {
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bandRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const items = el.querySelectorAll('.stat');
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const statList = [
    { label: 'Creative resources', value: stats.total, icon: 'layers' },
    { label: 'Total downloads', value: stats.downloads, icon: 'download' },
    { label: 'Independent creators', value: stats.creators, icon: 'sparkles' },
    { label: 'Community members', value: stats.users, icon: 'users' },
  ];

  return (
    <div ref={bandRef} className="stats-band">
      <div className="container stats-grid">
        {statList.map(s => (
          <div className="stat" key={s.label}>
            <Icon name={s.icon} size={22} />
            <div>
              <strong><Counter value={s.value} /><span className="stat-accent">{s.value > 0 ? '+' : ''}</span></strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ ─── */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.q}>
          <summary>
            <span className="faq-number">{String(i + 1).padStart(2, '0')}</span>
            {item.q}
            <Plus size={18} />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ─── Main Home component ─── */
export function Home({
  items, categories, stats, homepage, season, faq, creators,
}: {
  items: ContentItem[];
  categories: { id: string; name: string; icon: string; count: number }[];
  stats: { total: number; downloads: number; creators: number; users: number };
  homepage: Record<string, unknown>;
  season: Record<string, unknown>;
  faq: { q: string; a: string }[];
  creators: { name: string; username: string; bio: string; uploads: number }[];
}) {
  return (
    <>
      {/* film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* 1 — Hero */}
      <HeroSection homepage={homepage} />

      {/* 2 — Stats */}
      <StatsBand stats={stats} />

      {/* 3 — Explore / Content grid */}
      <section className="section container" id="explore">
        <Reveal><SectionHead eyebrow="CURATED FOR THE CURIOUS" title="Good finds. Great possibilities." description="Handpicked resources to take your next project a little further." /></Reveal>
        <StaggerReveal className="content-stagger-wrap" stagger={0.08}>
          <FeaturedContent items={items} />
        </StaggerReveal>
        <Reveal delay={0.15}>
          <div className="collection-note">
            <ShieldCheck size={14} />
            <span>Original resources. Real creators. A whole lot of potential.</span>
            <span className="originals-label">HOMELAND ORIGINALS <ArrowUpRight size={12} /></span>
          </div>
        </Reveal>
      </section>

      {/* 4 — Categories */}
      <section className="section categories-section">
        <div className="container">
          <Reveal><SectionHead eyebrow="FIND YOUR CREATIVE CORNER" title="A little bit of everything." description="Whatever you're into, there's something here for you." href="/categories" link="All categories" /></Reveal>
          <StaggerReveal className="category-grid" stagger={0.07}>
            {categories.map(category => <CategoryCard category={category} key={category.id} />)}
          </StaggerReveal>
        </div>
      </section>

      {/* 5 — Free / Paid promos */}
      <section className="section container">
        <StaggerReveal className="two-collections" stagger={0.13}>
          <div className="collection-promo free-promo">
            <div className="eyebrow"><span />GOOD THINGS COME FREE</div>
            <span className="promo-icon"><Download size={37} /></span>
            <h2>Big ideas.<br />Zero price tag.</h2>
            <p>Quality resources, ready for your next project.<br />Yours to discover. Free to download.</p>
            <Link href="/free" className="button secondary">Explore Free Stuff<ArrowUpRight size={16} /></Link>
            <div className="promo-decoration"><Download size={175} strokeWidth={0.65} /></div>
          </div>
          <div className="collection-promo paid-promo">
            <div className="eyebrow"><span />A LITTLE EXTRAORDINARY</div>
            <span className="promo-icon"><Sparkles size={37} /></span>
            <h2>For your next<br />level of creation.</h2>
            <p>Thoughtfully crafted premium content.<br />Support a creator. Elevate your work.</p>
            <Link href="/paid" className="button secondary">Explore Paid Stuff<ArrowUpRight size={16} /></Link>
            <div className="promo-decoration"><Sparkles size={175} strokeWidth={0.65} /></div>
          </div>
        </StaggerReveal>
      </section>

      {/* 6 — Creators */}
      <section className="section creator-section">
        <div className="container">
          <Reveal><SectionHead eyebrow="THE PEOPLE BEHIND THE POSSIBILITIES" title="Creators make this place." description="Independent minds. Original work." href="/creators" link="Meet the creators" /></Reveal>
          <StaggerReveal className="creator-strip" stagger={0.12}>
            {creators.slice(0, 2).map(c => (
              <Link href={'/creator/' + c.username} key={c.username} className="creator-feature">
                <div className="creator-avatar">H<span><Check size={12} /></span></div>
                <div><h3>{c.name}</h3><p>@{c.username} <span>·</span> {c.uploads} resources</p><span className="small-label">OFFICIAL CREATOR</span></div>
                <ArrowUpRight size={21} />
              </Link>
            ))}
            <div className="creator-invite">
              <span className="dashed-avatar"><Plus size={23} /></span>
              <div><h3>There's a place for you here.</h3><p>Your ideas deserve to be out in the world.</p></div>
              <Link href="/creator" className="text-link">Become a creator<ArrowUpRight size={16} /></Link>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* 7 — Process steps */}
      <section className="section container process-section">
        <Reveal><SectionHead eyebrow="LESS FRICTION. MORE CREATION." title="From a spark to something great." description="Three simple steps. Endless ways to make them yours." /></Reveal>
        <StaggerReveal className="process-grid" stagger={0.15}>
          {[
            { n: '01', icon: 'grid', title: 'Find your inspiration.', text: 'Explore original resources, discover new creators, and find that missing piece.' },
            { n: '02', icon: 'download', title: 'Make it yours.', text: 'Download free content or discover premium resources for your next big project.' },
            { n: '03', icon: 'sparkles', title: 'Create your next thing.', text: 'Put your ideas into the world. Share your work and grow with the community.' },
          ].map((p, i) => (
            <div className="process-card" key={p.n}>
              <div className="process-top">
                <span>{p.n}</span>
                <Icon name={p.icon} size={24} />
                {i < 2 && <ArrowRight className="process-arrow" size={19} />}
              </div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </StaggerReveal>
      </section>

      {/* 8 — Built for creators panel */}
      <section className="section container">
        <Reveal>
          <div className="built-panel">
            <div className="built-intro">
              <div className="eyebrow"><span />YOUR WORK. YOUR WORLD.</div>
              <h2>Built for creators.<br /><span className="muted">Made for possibility.</span></h2>
              <p>Not just a place to download.<br />A place to make your mark.</p>
              <Link href="/creator" className="button primary">Become a Creator<ArrowUpRight size={17} /></Link>
              <span className="no-fee"><Check size={13} />No creator subscription. Just create.</span>
            </div>
            <StaggerReveal className="built-features" stagger={0.1}>
              {[
                { icon: 'layers', title: 'Upload your ideas.', text: 'From tools and templates to textures and tracks.' },
                { icon: 'users', title: 'Find your audience.', text: 'Your own profile. A community that gets you.' },
                { icon: 'download', title: 'Share free. Sell premium.', text: 'Your content. Your choice. Your creative journey.' },
                { icon: 'code', title: 'Stay in control.', text: 'Manage your content and track every download.' },
              ].map(f => (
                <div key={f.title}>
                  <span className="feature-icon"><Icon name={f.icon} size={21} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </Reveal>
      </section>

      {/* 9 — Community */}
      <section className="section container">
        <Reveal>
          <div className="community-panel">
            <div className="community-orb"><Users size={45} /><span className="orb-ring" /></div>
            <div>
              <div className="eyebrow"><span />BETTER, TOGETHER</div>
              <h2>{String(homepage.communityTitle || 'Great things happen together.')}</h2>
              <p>{String(homepage.communityDescription || 'Find your people. Share your work. Build something that matters.')}</p>
            </div>
            <Link href="/community" className="button secondary">Find your community<ArrowUpRight size={17} /></Link>
          </div>
        </Reveal>
      </section>

      {/* 10 — SMP Teaser */}
      <section className="container smp-teaser">
        <Reveal>
          <div className="smp-teaser-inner" style={{ backgroundImage: `linear-gradient(90deg,#090e0b 10%,rgba(9,14,11,.82) 40%,rgba(9,14,11,.15)),url(${String(season.banner || '/images/terrain.png')})` }}>
            <div>
              <span className="season-label"><span />A DIFFERENT KIND OF ADVENTURE</span>
              <h2>HOMELAND SMP<span className="season-small">SEASON {String(season.number || 5)} <span>— COMING SOON</span></span></h2>
              <p>New world. New stories. Same HOMELAND spirit.</p>
              <Link href="/smp" className="button secondary">Explore Season {String(season.number || 5)}<ArrowUpRight size={16} /></Link>
            </div>
            <span className="smp-corner"><Box size={16} /> THE NEXT CHAPTER</span>
          </div>
        </Reveal>
      </section>

      {/* 11 — FAQ */}
      <section className="section container faq-section" id="faq">
        <Reveal className="faq-intro">
          <div className="eyebrow"><span />A LITTLE CLARITY</div>
          <h2>Good questions.<br />Straight answers.</h2>
          <p>Everything you need to feel right at home.</p>
          <Link className="text-link" href="/contact">Still curious? Let's talk<ArrowUpRight size={15} /></Link>
        </Reveal>
        <Reveal><FAQ items={faq} /></Reveal>
      </section>

      {/* 12 — Final CTA */}
      <section className="final-cta">
        <div className="container">
          <Reveal>
            <div className="eyebrow"><span />THE NEXT GREAT THING STARTS WITH YOU</div>
            <h2>Make yourself <span>at HOMELAND.</span></h2>
            <p>Discover something new. Download something useful. Create something yours.</p>
            <div className="hero-buttons">
              <Link href="/free" className="button primary">Start exploring<ArrowUpRight size={16} /></Link>
              <Link href="/register" className="button secondary">Create an account<ArrowUpRight size={16} /></Link>
            </div>
            <div className="final-caption"><span />DISCOVER. DOWNLOAD. CREATE.<span /></div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
