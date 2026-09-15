import { readFileSync, writeFileSync } from 'fs';

const file = 'src/app/[section]/page.tsx';
let src = readFileSync(file, 'utf8');

// Remove the stray nested container div that got left in
src = src.replace(
  `</div><div className="smp-hero-content"><div className="container"><div className="eyebrow">`,
  `</div><div className="smp-hero-content"><div className="eyebrow">`
);

// Fix the closing: the extra </div> we added via the script needs to be correct
// Current (wrong): ...</div></div></div></section>
// Should be: smp-hero-content close + smp-hero-inner close = ...</div></div></section>
// The section currently has: hero-content div + hero-inner div + section tag
// Let's verify by checking what's there now

const idx = src.indexOf('smp-hero-inner');
const heroSlice = src.slice(idx, idx + 200);
console.log('Hero structure check:\n', heroSlice);

writeFileSync(file, src, 'utf8');
console.log('Done');
