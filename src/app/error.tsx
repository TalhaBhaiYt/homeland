'use client';
import Link from 'next/link';
import { ArrowUpRight,RotateCcw } from 'lucide-react';
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <div className="container error-page"><span>500</span><h1>A little bump in the road.</h1><p>Something went wrong on our side. Let’s give that another try.</p><div className="hero-buttons"><button className="button primary" onClick={reset}><RotateCcw size={15}/>Try again</button><Link href="/" className="button secondary">Go home<ArrowUpRight size={15}/></Link></div></div>}
