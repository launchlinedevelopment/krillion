import {neon} from '@neondatabase/serverless';
import {randomBytes,pbkdf2Sync,timingSafeEqual,createHash} from 'node:crypto';
export function database(){if(!process.env.DATABASE_URL)throw Error('Account database not configured. Add DATABASE_URL in Vercel and run schema.sql.');return neon(process.env.DATABASE_URL)}
export const hashToken=token=>createHash('sha256').update(token).digest('hex');
export function passwordHash(password,salt){return pbkdf2Sync(password,Buffer.from(salt,'hex'),220000,32,'sha256').toString('hex')}
export function verifyPassword(password,salt,hash){let expected=Buffer.from(hash,'hex');let given=Buffer.from(passwordHash(password,salt),'hex');return expected.length===given.length&&timingSafeEqual(expected,given)}
export const randomHex=n=>randomBytes(n).toString('hex');
export function send(res,code,value){res.status(code).setHeader('Cache-Control','no-store').json(value)}
export async function sessionUser(req,sql){let auth=req.headers.authorization||'';let token=auth.startsWith('Bearer ')?auth.slice(7):'';if(!/^[a-f0-9]{64}$/.test(token))return null;const rows=await sql`SELECT u.id,u.username FROM arcade_sessions s JOIN arcade_users u ON u.id=s.user_id WHERE s.token_hash=${hashToken(token)} AND s.expires_at>now() LIMIT 1`;return rows[0]||null}
