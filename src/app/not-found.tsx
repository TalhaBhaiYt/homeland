import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export default function NotFound(){return <div className="container error-page"><span>404</span><h1>LOST IN HOMELAND<span className="red">.</span></h1><p>Looks like this page doesn’t exist.<br/>There’s still a whole world of possibilities to discover.</p><div className="hero-buttons"><Link href="/" className="button primary">Go home<ArrowUpRight size={16}/></Link><Link href="/free" className="button secondary">Explore Free Stuff<ArrowUpRight size={16}/></Link></div></div>}
