import { readFileSync, writeFileSync } from 'fs';
const f = 'src/app/[section]/page.tsx';
const src = readFileSync(f, 'utf8');
const out = src.replaceAll('https://youtube.com/@imklay01', 'https://youtube.com/@klay_x04');
if (out === src) { console.error('URL not found'); process.exit(1); }
writeFileSync(f, out, 'utf8');
console.log('YouTube URL fixed in page.tsx');
