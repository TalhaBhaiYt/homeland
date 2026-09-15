import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { HttpError } from './auth';
const root=path.join(process.cwd(),'.storage');
function safeKey(key:string){if(!/^[a-zA-Z0-9_.-]+$/.test(key)||key.includes('..'))throw new HttpError(400,'Invalid storage key.');return key;}
function s3(){return new S3Client({region:process.env.S3_REGION||'auto',endpoint:process.env.S3_ENDPOINT,forcePathStyle:!!process.env.S3_ENDPOINT,credentials:process.env.S3_ACCESS_KEY_ID&&process.env.S3_SECRET_ACCESS_KEY?{accessKeyId:process.env.S3_ACCESS_KEY_ID,secretAccessKey:process.env.S3_SECRET_ACCESS_KEY}:undefined});}
export async function storeFile(key:string,buffer:Buffer,mime:string){safeKey(key);if(process.env.S3_BUCKET){await s3().send(new PutObjectCommand({Bucket:process.env.S3_BUCKET,Key:key,Body:buffer,ContentType:mime}));return;}await mkdir(root,{recursive:true});await writeFile(path.join(root,key),buffer);}
export async function deliverFile(key:string,name:string,mime:string){safeKey(key);const disposition=`attachment; filename="${name.replace(/[^a-zA-Z0-9._-]/g,'_')}"`;if(process.env.S3_BUCKET){const url=await getSignedUrl(s3(),new GetObjectCommand({Bucket:process.env.S3_BUCKET,Key:key,ResponseContentDisposition:disposition}),{expiresIn:60});return Response.redirect(url,302);}const buffer=await readFile(path.join(root,key));return new Response(new Uint8Array(buffer),{headers:{'Content-Type':mime,'Content-Disposition':disposition,'X-Content-Type-Options':'nosniff','Cache-Control':'private, no-store'}});}
