import {randomUUID} from 'node:crypto';
import {database,passwordHash,verifyPassword,randomHex,hashToken,send} from './_db.js';
export default async function handler(req,res){
 if(req.method!=='POST')return send(res,405,{error:'Use POST.'});
 const {mode,username,password}=req.body||{};
 if(!['register','login'].includes(mode)||typeof username!=='string'||typeof password!=='string')return send(res,400,{error:'Invalid request.'});
 const name=username.trim().toLowerCase();
 if(!/^[a-z0-9_]{3,25}$/.test(name))return send(res,400,{error:'Username must be 3–25 letters, numbers or underscores.'});
 if(password.length<8||password.length>128)return send(res,400,{error:'Password must be between 8 and 128 characters.'});
 try{
 const sql=database();
 let user;
 if(mode==='register'){
 const old=await sql`SELECT id FROM arcade_users WHERE username=${name}`;
 if(old.length)return send(res,409,{error:'That username is already taken.'});
 const id=randomUUID(),salt=randomHex(16),hash=passwordHash(password,salt);
 const rows=await sql`INSERT INTO arcade_users(id,username,password_salt,password_hash) VALUES(${id},${name},${salt},${hash}) ON CONFLICT(username) DO NOTHING RETURNING id,username`;
 if(!rows.length)return send(res,409,{error:'That username is already taken.'});
 user=rows[0];
 }else{
 const rows=await sql`SELECT id,username,password_salt,password_hash FROM arcade_users WHERE username=${name} LIMIT 1`;
 const found=rows[0];if(!found||!verifyPassword(password,found.password_salt,found.password_hash))return send(res,401,{error:'Incorrect username or password.'});user={id:found.id,username:found.username};
 }
 const token=randomHex(32);
 await sql`INSERT INTO arcade_sessions(token_hash,user_id,expires_at) VALUES(${hashToken(token)},${user.id},now()+interval '30 days')`;
 return send(res,200,{token,user:{username:user.username}});
 }catch(e){return send(res,503,{error:e.message.includes('DATABASE_URL')?'Cloud accounts need database setup.':'Account service temporarily unavailable.'})}
}
