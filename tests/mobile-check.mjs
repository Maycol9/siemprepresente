// Optional Playwright/Edge check: emulated touch, not a physical phone.
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:4173/siemprepresente/');
 await page.getByRole('button',{name:'Comenzar →',exact:true}).click();
 await page.getByRole('button',{name:'Saltar introducción'}).click();
 await page.evaluate(()=>{
  window.pointerLog=[];
  for(const type of ['pointerdown','pointerup','pointercancel'])document.querySelector('#touch').addEventListener(type,e=>window.pointerLog.push({type,key:e.target.closest('button')?.dataset.key,id:e.pointerId}));
 });
 const right=await page.getByRole('button',{name:'Mover a la derecha',exact:true}).boundingBox();
 const attack=await page.getByRole('button',{name:'Lanzar magia',exact:true}).boundingBox();
 const client=await page.context().newCDPSession(page);
 const points=[right,attack].map((r,i)=>({x:r.x+r.width/2,y:r.y+r.height/2,id:i+1}));
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});
 await page.waitForTimeout(800);
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});
 await client.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
 const log=await page.evaluate(()=>window.pointerLog);
 for(const type of ['pointerdown','pointerup','pointercancel'])for(const key of ['right','attack'])assert.ok(log.some(e=>e.type===type&&e.key===key),`${type}: ${key}`);
 await page.getByRole('button',{name:'Ⅱ Pausa'}).click();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.screenshot({path:'mobile.png'});
 for(const width of [320,390,844]){
  await page.setViewportSize({width,height:width===844?390:844});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const layout=await page.evaluate(()=>{
   const stage=document.querySelector('#stage').getBoundingClientRect();
   const frame=document.querySelector('#youtube iframe').getBoundingClientRect();
   return {frame:{width:frame.width,height:frame.height},separate:frame.top>=stage.bottom||frame.left>=stage.right,buttons:[...document.querySelectorAll('#touch button')].every(b=>{const r=b.getBoundingClientRect();return r.left>=stage.left&&r.right<=stage.right&&r.top>=stage.top&&r.bottom<=stage.bottom;})};
  });
  assert.ok(layout.buttons);assert.ok(layout.separate);assert.ok(layout.frame.width>=200&&layout.frame.height>=200);
 }
 await page.getByRole('button',{name:'Ⅱ Pausa'}).click();
 await page.getByRole('button',{name:'Volver al inicio'}).click();
 await page.getByRole('button',{name:'Empezar una aventura nueva'}).click();
 await page.getByRole('button',{name:'Sí, empezar de nuevo'}).click();
 await page.getByRole('button',{name:'Entrar al reino'}).click();
 assert.equal(await page.locator('#chapter').textContent(),'CAPÍTULO I / III');
 assert.deepEqual(errors,[]);
 console.log('Multitáctil emulado, pointerup/pointercancel, pausa, reinicio y límites a 320/390/844 px: OK');
}finally{await browser.close();}
