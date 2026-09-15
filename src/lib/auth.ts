import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash, randomUUID } from 'crypto';
import { promisify } from 'util';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { users, sessions, rateLimits, activity } from '@/db/schema';
import { eq, and, gt, sql } from 'drizzle-orm';
const scrypt = promisify(scryptCallback);
export const adminRoles = ['OWNER','ADMIN'];
export const creatorRoles = ['OWNER','ADMIN','CREATOR','EDITOR'];
export const digest = (s:string)=>createHash('sha256').update(s).digest('hex');
export async function hashPassword(password:string) { const salt=randomBytes(16).toString('hex'); const hash=await scrypt(password,salt,64) as Buffer;return salt+':'+hash.toString('hex'); }
export async function verifyPassword(password:string,stored:string) {const [salt,hash]=stored.split(':');if(!salt||!hash)return false;const result=await scrypt(password,salt,64) as Buffer;const expected=Buffer.from(hash,'hex');return expected.length===result.length&&timingSafeEqual(expected,result);}
export async function getUser() {const token=(await cookies()).get('homeland_session')?.value;if(!token)return null;const [row]=await db.select({user:users}).from(sessions).innerJoin(users,eq(sessions.userId,users.id)).where(and(eq(sessions.id,digest(token)),gt(sessions.expiresAt,new Date())));if(!row||row.user.suspended)return null;const {password:_,...user}=row.user;return user;}
export async function requireUser(roles?:string[]) {const user=await getUser();if(!user)throw new HttpError(401,'Please log in to continue.');if(roles&&!roles.includes(user.role))throw new HttpError(403,'You do not have permission to perform this action.');return user;}
export async function createSession(userId:string,remember=false) {const token=randomBytes(32).toString('hex');const age=remember?60*60*24*30:60*60*24;await db.insert(sessions).values({id:digest(token),userId,expiresAt:new Date(Date.now()+age*1000)});(await cookies()).set('homeland_session',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:age});}
export async function logout() {const cookie=await cookies();const token=cookie.get('homeland_session')?.value;if(token)await db.delete(sessions).where(eq(sessions.id,digest(token)));cookie.delete('homeland_session');}
export function destination(role:string){return adminRoles.includes(role)?'/admin':creatorRoles.includes(role)?'/creator':'/dashboard';}
export class HttpError extends Error { constructor(public status:number,message:string){super(message);} }
export function checkOrigin(req:Request) {const origin=req.headers.get('origin');const host=(req.headers.get('x-forwarded-host')||req.headers.get('host')||new URL(req.url).host).split(',')[0].trim();if(!origin)throw new HttpError(403,'Request origin is not allowed.');let originHost='';try{originHost=new URL(origin).host;}catch{throw new HttpError(403,'Request origin is not allowed.');}if(originHost!==host)throw new HttpError(403,'Request origin is not allowed.');}
export async function rateLimit(req:Request,action:string,max=15){const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';const key=digest(ip+action);const now=new Date();const [row]=await db.insert(rateLimits).values({key,hits:1,resetAt:new Date(Date.now()+600000)}).onConflictDoUpdate({target:rateLimits.key,set:{hits:sql`CASE WHEN ${rateLimits.resetAt} < ${now} THEN 1 ELSE ${rateLimits.hits}+1 END`,resetAt:sql`CASE WHEN ${rateLimits.resetAt} < ${now} THEN ${new Date(Date.now()+600000)} ELSE ${rateLimits.resetAt} END`}}).returning();if(row.hits>max)throw new HttpError(429,'Too many requests. Please try again in a few minutes.');}
export async function audit(userId:string,action:string,details=''){await db.insert(activity).values({id:randomUUID(),userId,action,details});}
