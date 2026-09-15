import { db } from '@/db';
import { users, categories, contents, uploads, settings, announcements } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './auth';
import { randomBytes, createHash } from 'crypto';
import { readFile } from 'fs/promises';
import path from 'path';
import { storeFile } from './storage';

let pending: Promise<void> | null = null;
let seeded = false;

export function ensureData() {
  if (seeded) return Promise.resolve();
  if (!pending) pending = seed().then(() => { seeded = true; }).catch(e => {
    pending = null;
    // Log but don't propagate — a DB hiccup on cold start shouldn't 500 the page.
    console.error('[seed] failed:', e?.cause?.message ?? e?.message);
  });
  return pending;
}

async function seed() {
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.id, 'homeland-originals')).limit(1);
  if (!existing.length) {
    await db.insert(users).values({
      id: 'homeland-originals', name: 'HOMELAND Originals', username: 'homeland',
      email: 'originals@homeland.local', password: await hashPassword(randomBytes(48).toString('hex')),
      role: 'CREATOR', bio: 'Original resources, made for your next great idea. Explore the official HOMELAND starter collection.'
    }).onConflictDoNothing();

    const cats = [
      ['graphics', 'Graphics & Design', 'Assets that make your ideas stand out.', 'palette'],
      ['minecraft', 'Minecraft', 'New possibilities for your next world.', 'box'],
      ['templates', 'Templates', 'A head start on something great.', 'layout'],
      ['tools', 'Software & Tools', 'Make your workflow work for you.', 'code'],
      ['audio', 'Audio & Music', 'Find the sound of your next project.', 'audio'],
      ['other', 'More to Explore', 'Discover something unexpected.', 'grid'],
    ];
    await db.insert(categories).values(cats.map(([id, name, description, icon], position) => ({ id, name, description, icon, position }))).onConflictDoNothing();

    const starters = [
      { id: 'aurora', title: 'Aurora Gradient Collection', description: 'A little color. A whole new perspective.', image: 'aurora', categoryId: 'graphics', price: 0, tags: 'wallpaper,gradients,backgrounds,design' },
      { id: 'verdant', title: 'Verdant \u2014 Voxel Landscapes', description: 'A new world of creative possibilities.', image: 'terrain', categoryId: 'minecraft', price: 0, tags: 'minecraft,voxel,landscape,art' },
      { id: 'chromatic', title: 'Chromatic 3D Elements', description: 'Extraordinary shapes. Endless inspiration.', image: 'chrome', categoryId: 'graphics', price: 1200, tags: '3d,chrome,design,elements' },
      { id: 'aurora-desktop', title: 'Aurora Desktop Wallpaper', description: 'Bring a calmer kind of color to your desktop.', image: 'aurora', categoryId: 'graphics', price: 0, tags: 'desktop,wallpaper,purple' },
      { id: 'creator-kit', title: 'Creator Brand Inspiration Kit', description: 'Find a fresh direction for your next identity.', image: 'chrome', categoryId: 'templates', price: 1800, tags: 'branding,template,creator' },
      { id: 'worlds', title: "Worldbuilder's Moodboard", description: 'Your next adventure starts with an idea.', image: 'terrain', categoryId: 'minecraft', price: 0, tags: 'voxel,moodboard,inspiration' },
    ];
    for (const item of starters) {
      const buffer = await readFile(path.join(process.cwd(), 'resources/originals', item.image + '.png'));
      const key = 'original-' + item.id + '.png';
      await storeFile(key, buffer, 'image/png');
      await db.insert(uploads).values({ id: 'file-' + item.id, userId: 'homeland-originals', key, name: item.id + '.png', mime: 'image/png', size: buffer.length, hash: createHash('sha256').update(buffer).digest('hex') }).onConflictDoNothing();
      await db.insert(contents).values({
        id: item.id, slug: item.id, title: item.title, description: item.description,
        body: 'An original HOMELAND visual resource, created to inspire your next project. This starter collection includes the high-resolution PNG artwork shown in the preview. ' + (item.categoryId === 'minecraft' ? 'This is voxel-inspired artwork, not a playable map or game add-on. ' : '') + 'Use it as a wallpaper, a creative moodboard, or a starting point for your personal projects.',
        thumbnail: '/images/' + item.image + '.png', creatorId: 'homeland-originals', categoryId: item.categoryId,
        price: item.price, status: 'published', featured: ['aurora', 'verdant', 'chromatic'].includes(item.id),
        uploadId: 'file-' + item.id, tags: item.tags,
        metadata: { requirements: 'Any application that supports PNG images.', installation: 'Download the image and open it in your preferred image viewer or design application.', changelog: '1.0 \u2014 Original release.', license: 'Personal use. Redistribution of the original file is not permitted.', credits: 'Original AI-assisted artwork created for HOMELAND.', fileType: 'PNG' }
      }).onConflictDoNothing();
    }

    await db.insert(announcements).values({ id: 'welcome', title: 'A new home for your next big idea.', body: "Welcome to HOMELAND. Discover the Originals collection, create an account, and start sharing what you love. We're building a community where every creator belongs.", section: 'community' }).onConflictDoNothing();

    await db.insert(settings).values([
      { key: 'homepage', value: { eyebrow: 'A HOME FOR YOUR NEXT BIG IDEA', description: 'Your premium destination for digital content, creator resources, tools, downloads and community creations.', communityTitle: 'Great things happen together.', communityDescription: 'Find your people. Share your work. Build something that matters.' } },
      { key: 'season', value: { number: 5, title: 'HOMELAND SMP', description: 'A new chapter. A world of possibilities. The next HOMELAND adventure is on its way.', releaseDate: '', serverIp: '', version: 'To be announced', status: 'Coming soon', trailer: '', discord: '', youtube: '', banner: '/images/terrain.png', rules: 'Be respectful.\nNo cheating or griefing.\nBuild together. Play fair.', features: 'A fresh survival world\nCommunity-driven adventures\nA place for every play style' } },
      { key: 'community', value: { discord: '', youtube: '' } },
      { key: 'faq', value: { items: [{ q: 'What is HOMELAND?', a: 'HOMELAND is a digital content platform for discovering resources, downloading original creations, and connecting with creators.' }, { q: 'Is Free Stuff actually free?', a: 'Yes. Every resource in Free Stuff is free to download. Check the license on each resource for usage details.' }, { q: 'How does Paid Stuff work?', a: 'Premium resources have a one-time price. Purchases are unavailable until a verified payment provider is connected. We never grant access on an unverified payment.' }, { q: 'How do I become a creator?', a: 'Create a free account, then choose Become a Creator in your dashboard. You can upload your work and submit it for review.' }, { q: 'What files can I upload?', a: 'Archives, images, audio, video, documents, code and supported game resources are welcome. Files must be legitimate and follow our community guidelines.' }, { q: 'What is HOMELAND SMP?', a: 'Our Minecraft community has its own space in the SMP tab. Season 5 is coming soon; the release date has not been announced.' }] } },
    ]).onConflictDoNothing();

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const email = process.env.ADMIN_EMAIL.toLowerCase();
      const [admin] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
      if (!admin && process.env.ADMIN_PASSWORD.length >= 12)
        await db.insert(users).values({ id: 'initial-owner', name: 'Platform Owner', username: 'platform-owner', email, password: await hashPassword(process.env.ADMIN_PASSWORD), role: 'OWNER' }).onConflictDoNothing();
    }
  }
}
