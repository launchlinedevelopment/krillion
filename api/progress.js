import {database,sessionUser,send} from './_db.js';
export default async function handler(req,res){
 if(!['GET','POST'].includes(req.method))return send(res,405,{error:'Method not allowed.'});
 try{
 const sql=database(),user=await sessionUser(req,sql);
 if(!user)return send(res,401,{error:'Please log in.'});
 if(req.method==='GET'){
 const rows=await sql`SELECT progress FROM arcade_progress WHERE user_id=${user.id}`;
 return send(res,200,{user:{username:user.username},progress:rows[0]?.progress||null});
 }
 const value=req.body?.progress;
 if(!value||typeof value!=='object'||Array.isArray(value)||JSON.stringify(value).length>25000)return send(res,400,{error:'Invalid progress.'});
 const progress={
 xp:Math.max(0,Math.min(1e9,Number(value.xp)||0)),
 played:Math.max(0,Math.min(1e7,Number(value.played)||0)),
 best:Math.max(0,Math.min(1e9,Number(value.best)||0)),
 streak:Math.max(0,Math.min(1e6,Number(value.streak)||0)),
 lastDay:typeof value.lastDay==='string'?value.lastDay.slice(0,10):'',
 wins:(value.wins&&typeof value.wins==='object'&&!Array.isArray(value.wins))?value.wins:{}
 };
 await sql`INSERT INTO arcade_progress(user_id,progress) VALUES(${user.id},${JSON.stringify(progress)}::jsonb) ON CONFLICT(user_id) DO UPDATE SET progress=EXCLUDED.progress,updated_at=now()`;
 return send(res,200,{ok:true});
 }catch(e){return send(res,503,{error:e.message.includes('DATABASE_URL')?'Database not configured.':'Progress service unavailable.'})}
}
