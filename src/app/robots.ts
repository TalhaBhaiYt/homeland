import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/api/','/admin','/dashboard','/creator?','/favorites','/profile','/reset-password']},sitemap:(process.env.NEXT_PUBLIC_SITE_URL||'https://homeland.example')+'/sitemap.xml'};}
