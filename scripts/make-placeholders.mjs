import { mkdirSync, writeFileSync, readdirSync } from 'fs';

// Minimal valid 1x1 PNG (RGB, known-good bytes)
const PNG = Buffer.from(
  '89504e470d0a1a0a' + // PNG signature
  '0000000d49484452' + // IHDR length=13
  '00000001' +         // width=1
  '00000001' +         // height=1
  '08020000' +         // bitdepth=8, colortype=2(RGB), compress=0, filter=0
  '0090fa17f0' +       // interlace=0, CRC
  '0000000c49444154' + // IDAT length=12
  '08d76360f8cf' +     // zlib header + deflate
  'c000000002' +       // pixel data
  '00016e022129' +     // adler32
  '00000000' +         // IDAT CRC placeholder
  '0000000049454e44ae426082', // IEND
  'hex'
);

mkdirSync('resources/originals', { recursive: true });
writeFileSync('resources/originals/aurora.png', PNG);
writeFileSync('resources/originals/terrain.png', PNG);
writeFileSync('resources/originals/chrome.png', PNG);

console.log('resources/originals:', readdirSync('resources/originals'));

// WebP: minimal valid 1x1 white WebP
const WEBP = Buffer.from(
  '52494646' + // RIFF
  '24000000' + // file size - 8
  '57454250' + // WEBP
  '56503820' + // VP8 chunk
  '17000000' + // chunk size
  '30010000' + // frame tag
  '9d012a01000100003425a4009c4b48000000', // VP8 bitstream
  'hex'
);

mkdirSync('public/images', { recursive: true });
writeFileSync('public/images/aurora.webp', WEBP);
writeFileSync('public/images/terrain.webp', WEBP);
writeFileSync('public/images/chrome.webp', WEBP);
writeFileSync('public/images/hero-art.webp', WEBP);

console.log('public/images:', readdirSync('public/images'));
