import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCreators,getContent,getCategories } from '@/lib/data';
import { BrowseContent } from '@/components/content';
import { Check,Sparkles } from 'lucide-react';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{username:string}>}):Promise<Metadata>{const {username}=await params;return {title:'@'+username+' — Creator',alternates:{canonical:'/creator/'+username}};}
export default async function CreatorProfile({params}:{params:Promise<{username:string}>}){const {username}=await params;const creator=(await getCreators()).find(c=>c.username===username);if(!creator)notFound();const [items,categories]=await Promise.all([getContent({creator:creator.id}),getCategories()]);return <div className="container browse-page"><div className="profile-banner"/><div className="public-profile"><div className="creator-avatar">{creator.name[0]}<span><Check size={12}/></span></div><div><h1>{creator.name}</h1><p>@{creator.username} · {creator.username==='homeland'?'Official HOMELAND creator':'Independent creator'}</p></div></div><p className="profile-bio">{creator.bio||'A new creator with a world of possibilities.'}</p><div style={{display:'flex',gap:30,margin:'0 0 30px 30px',fontSize:11,color:'#a795b1'}}><span><strong style={{color:'#eee'}}>{creator.uploads}</strong> original resources</span><span><strong style={{color:'#eee'}}>{creator.downloads}</strong> downloads</span></div><BrowseContent items={items} categories={categories}/></div>}
