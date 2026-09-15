import type { MetadataRoute } from 'next';
import { getContent,getCreators } from '@/lib/data';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.NEXT_PUBLIC_SITE_URL||'https://homeland.example';const [content,creators]=await Promise.all([getContent(),getCreators()]);return [...['','/free','/paid','/categories','/creators','/community','/smp','/contact','/terms','/privacy'].map(path=>({url:base+path,changeFrequency:'weekly' as const,priority:path===''?1:.8})),...content.map(c=>({url:base+'/stuff/'+c.slug,lastModified:c.createdAt,changeFrequency:'weekly' as const,priority:.7})),...creators.map(c=>({url:base+'/creator/'+c.username,changeFrequency:'weekly' as const,priority:.6}))];}
