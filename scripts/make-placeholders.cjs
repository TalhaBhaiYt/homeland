#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function buildPng(w, h, r, g, b) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8]=8; ihdr[9]=2; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 3);
    row[0] = 0;
    for (let x = 0; x < w; x++) { row[1+x*3]=r; row[2+x*3]=g; row[3+x*3]=b; }
    rows.push(row);
  }
  const idat = zlib.deflateSync(Buffer.concat(rows));
  return Buffer.concat([sig, chunk('IHDR',ihdr), chunk('IDAT',idat), chunk('IEND',Buffer.alloc(0))]);
}

const root = path.join(__dirname, '..');
const log = [];

try {
  fs.mkdirSync(path.join(root,'resources','originals'), {recursive:true});
  fs.writeFileSync(path.join(root,'resources','originals','aurora.png'),  buildPng(400,300,130,60,180));
  fs.writeFileSync(path.join(root,'resources','originals','terrain.png'), buildPng(400,300,40,120,80));
  fs.writeFileSync(path.join(root,'resources','originals','chrome.png'),  buildPng(400,300,80,120,200));
  log.push('resources/originals: ' + fs.readdirSync(path.join(root,'resources','originals')).join(', '));

  fs.mkdirSync(path.join(root,'public','images'), {recursive:true});
  const imgs = {aurora:[130,60,180], terrain:[40,120,80], chrome:[80,120,200], 'hero-art':[20,20,40]};
  for (const [name,[r,g,b]] of Object.entries(imgs)) {
    fs.writeFileSync(path.join(root,'public','images',name+'.webp'), buildPng(800,600,r,g,b));
  }
  log.push('public/images: ' + fs.readdirSync(path.join(root,'public','images')).join(', '));
  log.push('SUCCESS');
} catch(e) {
  log.push('ERROR: ' + e.message);
}

fs.writeFileSync(path.join(__dirname, 'make-placeholders.log'), log.join('\n') + '\n');
