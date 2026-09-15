import 'dotenv/config';
import { db,pool } from '@/db';
import { users,contents,uploads,favorites,reviews,downloads,sessions,activity,messages,resets } from '@/db/schema';
import { ilike,eq,sql } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import path from 'path';
async function cleanup(){const testUsers=await db.select().from(users).where(ilike(users.username,'smoke_%'));for(const user of testUsers){const events=await db.select().from(downloads).where(eq(downloads.userId,user.id));for(const event of events)await db.update(contents).set({downloads:sql`greatest(0,${contents.downloads}-1)`}).where(eq(contents.id,event.contentId));await db.delete(downloads).where(eq(downloads.userId,user.id));await db.delete(reviews).where(eq(reviews.userId,user.id));await db.delete(favorites).where(eq(favorites.userId,user.id));await db.delete(contents).where(eq(contents.creatorId,user.id));const files=await db.select().from(uploads).where(eq(uploads.userId,user.id));for(const file of files)await unlink(path.join(process.cwd(),'.storage',file.key)).catch(()=>{});await db.delete(uploads).where(eq(uploads.userId,user.id));await db.delete(sessions).where(eq(sessions.userId,user.id));await db.delete(resets).where(eq(resets.userId,user.id));await db.delete(activity).where(eq(activity.userId,user.id));await db.delete(users).where(eq(users.id,user.id));console.log('Removed test account and all associated records:',user.username);}await db.delete(messages).where(ilike(messages.email,'smoke_%'));await pool.end();}
cleanup().catch(e=>{console.error(e);process.exit(1)});
