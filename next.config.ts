import type { NextConfig } from 'next';
const isDev = process.env.NODE_ENV === 'development';
const scriptSrc = isDev ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";
const nextConfig:NextConfig={
  poweredByHeader:false,
  serverExternalPackages:['pg'],
  experimental:{
    serverActions:{bodySizeLimit:'100mb'},
  },
  async rewrites(){
    return ['aurora','terrain','chrome','hero-art'].map(name=>({source:'/images/'+name+'.png',destination:'/images/'+name+'.webp'}));
  },
  async headers(){
    return [{
      source:'/:path*',
      headers:[
        {key:'X-Content-Type-Options',value:'nosniff'},
        {key:'X-Frame-Options',value:'DENY'},
        {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
        {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
        {key:'Content-Security-Policy',value:`default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https:; media-src 'self' https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`},
      ],
    }];
  },
};
export default nextConfig;
