import { readFileSync, writeFileSync } from 'fs';
const f = 'src/app/[section]/page.tsx';
const src = readFileSync(f, 'utf8');
const lines = src.split('\n');
const idx = lines.findIndex(l => l.includes("section==='contact'"));
if (idx === -1) { console.error('contact line not found'); process.exit(1); }

let line = lines[idx];

// Identify the old contact-layout block by its unique start marker
// We replace from <div className="contact-layout"> to the end of the line (which ends with </div></div>;)
const MARKER = '<div className="contact-layout">';
const markerPos = line.indexOf(MARKER);
if (markerPos === -1) { console.error('contact-layout marker not found'); process.exit(1); }

const BEFORE = line.slice(0, markerPos); // everything up to contact-layout div
const SOCIAL_ROW = `<div className="contact-socials-row"><a href="https://instagram.com/im_klay01" target="_blank" rel="noreferrer" className="contact-social-card" style={{'--sl-color':'#e1306c'} as React.CSSProperties}><span className="csc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></span><div><strong>Instagram</strong><span>Follow IM KLAY</span></div></a><a href="https://youtube.com/@imklay01" target="_blank" rel="noreferrer" className="contact-social-card" style={{'--sl-color':'#ff0000'} as React.CSSProperties}><span className="csc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg></span><div><strong>YouTube</strong><span>Watch IM KLAY</span></div></a><a href="https://discord.gg/7hYe4NCPwJ" target="_blank" rel="noreferrer" className="contact-social-card" style={{'--sl-color':'#5865f2'} as React.CSSProperties}><span className="csc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.043.031.057a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg></span><div><strong>Discord</strong><span>Join HOMELAND</span></div></a><a href="https://wa.me/923021442468" target="_blank" rel="noreferrer" className="contact-social-card" style={{'--sl-color':'#25d366'} as React.CSSProperties}><span className="csc-icon"><Phone size={20}/></span><div><strong>WhatsApp</strong><span>Contact us</span></div></a><a href="https://tiktok.com/@im_klay01" target="_blank" rel="noreferrer" className="contact-social-card" style={{'--sl-color':'#ffffff'} as React.CSSProperties}><span className="csc-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg></span><div><strong>TikTok</strong><span>Follow IM KLAY</span></div></a><a href="mailto:homelandgang@gmail.com" className="contact-social-card" style={{'--sl-color':'#ed3657'} as React.CSSProperties}><span className="csc-icon"><Mail size={20}/></span><div><strong>Email</strong><span>Contact HOMELAND</span></div></a></div>`;

// Find the end: line ends with </div></div>;
// Replace the old contact-layout section with: SOCIAL_ROW + updated contact-layout
const REST = line.slice(markerPos); // from <div className="contact-layout"> to end

// Insert SOCIAL_ROW before the existing contact-layout, and add team badges inside the left column
// Find where the team info paragraph ends inside the left div
const TEAM_INJECT = `</div></div><div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}><span className="team-badge owner">IM_KLAY <span>OWNER</span></span><span className="team-badge dev">KYREX4u <span>DEVELOPER</span></span></div></div>`;
const OLD_LEFT_END = `</p></div><ContactForm/></div></div>;`;
const NEW_LEFT_END = `</p><div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}><span className="team-badge owner">IM_KLAY <span>OWNER</span></span><span className="team-badge dev">KYREX4u <span>DEVELOPER</span></span></div></div><ContactForm/></div></div>;`;

if (!REST.includes(OLD_LEFT_END)) {
  // Try to find what the actual ending looks like
  const endIdx = REST.lastIndexOf('</div></div>;');
  console.log('REST ending:', JSON.stringify(REST.slice(endIdx - 100)));
  console.error('Could not find OLD_LEFT_END');
  process.exit(1);
}

const NEW_REST = SOCIAL_ROW + REST.replace(OLD_LEFT_END, NEW_LEFT_END);
lines[idx] = BEFORE + NEW_REST;
writeFileSync(f, lines.join('\n'), 'utf8');
console.log('Contact page patched OK.');
