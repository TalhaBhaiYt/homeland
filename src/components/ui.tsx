import Link from 'next/link';
import { ArrowUpRight, Palette, Box, LayoutTemplate, Code2, AudioLines, Grid2X2, LucideIcon, Download, Layers3, Users, Heart, Sparkles, ShieldCheck, MessageCircle, Phone, Mail } from 'lucide-react';
import type { ReactNode } from 'react';

/* ── Social links config ─────────────────────────────────────── */
function IgIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>; }
function YtIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>; }
function TtIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>; }
function DcIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>; }
function WaIcon()  { return <Phone size={16} aria-hidden="true"/>; }
function EmIcon()  { return <Mail  size={16} aria-hidden="true"/>; }

const SOCIALS: { label: string; href: string; Ico: () => JSX.Element; color: string }[] = [
  { label: 'Instagram', href: 'https://instagram.com/im_klay01',  Ico: IgIcon, color: '#e1306c' },
  { label: 'YouTube',   href: 'https://youtube.com/@klay_x04',     Ico: YtIcon, color: '#ff0000' },
  { label: 'Discord',   href: 'https://discord.gg/7hYe4NCPwJ',    Ico: DcIcon, color: '#5865f2' },
  { label: 'WhatsApp',  href: 'https://wa.me/923021442468',        Ico: WaIcon, color: '#25d366' },
  { label: 'TikTok',    href: 'https://tiktok.com/@im_klay01',    Ico: TtIcon, color: '#ffffff' },
  { label: 'Email',     href: 'mailto:homelandgang@gmail.com',     Ico: EmIcon, color: '#ed3657' },
];
export function Logo({small=false}:{small?:boolean}){return <Link href="/" className={'brand '+(small?'small':'')} aria-label="HOMELAND home"><svg width="33" height="35" viewBox="0 0 36 38" fill="none" aria-hidden="true"><path d="M3 10 10 6v10l8-4 8 4V6l7 4v23l-7-4V23l-8-4-8 4v6l-7 4V10Z" fill="currentColor"/><path d="m11 5 7-4 7 4v8l-7-4-7 4V5Z" fill="#f13a59"/></svg><span>HOMELAND<span className="brand-period">.</span></span></Link>}
const icons:Record<string,LucideIcon>={palette:Palette,box:Box,layout:LayoutTemplate,code:Code2,audio:AudioLines,grid:Grid2X2,download:Download,layers:Layers3,users:Users,heart:Heart,sparkles:Sparkles,shield:ShieldCheck};
export function Icon({name,size=22,...props}:{name:string;size?:number;className?:string}){const Component=icons[name]||Grid2X2;return <Component size={size} {...props} aria-hidden="true"/>;}
export function SectionHead({eyebrow,title,description,href,link='Explore all'}:{eyebrow?:string;title:string;description?:string;href?:string;link?:string}){return <div className="section-head"><div>{eyebrow&&<div className="eyebrow"><span/>{eyebrow}</div>}<h2>{title}</h2>{description&&<p>{description}</p>}</div>{href&&<Link href={href} className="text-link">{link}<ArrowUpRight size={16}/></Link>}</div>}
export function PageHeading({eyebrow,title,description,children}:{eyebrow?:string;title:string;description:string;children?:ReactNode}){return <div className="page-heading"><div className="eyebrow"><span/>{eyebrow||'THE HOMELAND COLLECTION'}</div><h1>{title}<span className="red">.</span></h1><p>{description}</p>{children}</div>}
export function EmptyState({title='Your next discovery is out there.',description='Explore the collection and find something you love.',href='/free',label='Explore Free Stuff'}:{title?:string;description?:string;href?:string;label?:string}){return <div className="empty-state"><Layers3 size={34}/><h3>{title}</h3><p>{description}</p><Link className="button secondary" href={href}>{label}<ArrowUpRight size={16}/></Link></div>}
export function CategoryCard({category}:{category:{id:string;icon:string;name:string;count:number}}){return <Link href={'/search?category='+category.id} className="category-card"><span className={'category-icon '+category.id}><Icon name={category.icon}/></span><h3>{category.name}</h3><span className="muted">{category.count} resources</span><ArrowUpRight className="category-arrow" size={16}/></Link>}
/* ── Exported social links strip ───────────────────────────── */
export function SocialLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`social-links ${className}`}>
      {SOCIALS.map(({ label, href, Ico, color }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('mailto') ? undefined : '_blank'}
          rel="noreferrer"
          aria-label={label}
          className="social-link"
          style={{ '--sl-color': color } as React.CSSProperties}
        >
          <Ico />
          <span>{label}</span>
        </a>
      ))}
    </div>
  );
}

export function Footer(){return <footer><div className="container footer-main"><div className="footer-brand"><Logo/><p>A premium digital content platform<br/>for creators and communities.</p><SocialLinks className="footer-socials"/><span className="footer-note"><span className="live-dot"/> A home for every creator.</span></div>{[{title:'Platform',links:[['Free Stuff','/free'],['Paid Stuff','/paid'],['Categories','/categories'],['Creators','/creators']]},{title:'Community',links:[['Our Community','/community'],['Announcements','/community#announcements'],['HOMELAND SMP','/smp'],['Become a Creator','/creator']]},{title:'Account',links:[['Login','/login'],['Register','/register'],['Dashboard','/dashboard'],['Favorites','/favorites']]},{title:'Support',links:[['Contact Us','/contact'],['FAQs','/#faq'],['Terms of Use','/terms'],['Privacy Policy','/privacy']]}].map(group=><div className="footer-column" key={group.title}><h4>{group.title}</h4>{group.links.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</div>)}</div><div className="container footer-bottom"><span>© {new Date().getFullYear()} HOMELAND. All rights reserved.</span><div className="footer-team"><span className="team-badge owner">IM_KLAY <span>OWNER</span></span><span className="team-badge dev">KYREX4u <span>DEVELOPER</span></span></div><a href="mailto:homelandgang@gmail.com">homelandgang@gmail.com</a></div></footer>}
