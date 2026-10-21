// Optional: npm install --no-save playwright, start npm run dev, then node tests/browser-check.mjs.
import { chromium } from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.GAME_URL||'http://127.0.0.1:5173/siemprepresente/',{waitUntil:'domcontentloaded'});
await page.locator('canvas').waitFor();
await page.screenshot({path:'desktop.png'});
await page.getByRole('button',{name:'Comenzar →',exact:true}).click();
await page.getByRole('button',{name:'Saltar introducción',exact:true}).click();
await page.getByRole('button',{name:'Ⅱ Pausa',exact:true}).click();
await page.getByRole('button',{name:'Modo tranquilo: no',exact:true}).click();
await page.getByRole('button',{name:'Continuar',exact:true}).click();
for(let n=0;n<3;n++){
 await page.keyboard.down('d');await page.waitForTimeout(5800);await page.keyboard.up('d');
 await page.keyboard.press('Space');
 await page.keyboard.down('j');
 await page.getByRole('button',{name:n===2?'Ver el amanecer →':'Continuar la aventura →',exact:true}).waitFor({timeout:45000});
 await page.keyboard.up('j');
 console.log(`Combate y carta ${n+1}: OK`);
 await page.locator('#photo').evaluate(img=>img.decode());
 await page.getByRole('button',{name:'Ampliar fotografía ↗',exact:true}).click();
 await page.locator('#zoom[open] img').evaluate(img=>img.decode());
 await page.getByRole('button',{name:'Cerrar fotografía',exact:true}).click();
 console.log(`Fotografía ${n+1} y ampliación: OK`);
 await page.screenshot({path:`memory-${n+1}.png`});
 await page.getByRole('button',{name:n===2?'Ver el amanecer →':'Continuar la aventura →',exact:true}).click();
}
await page.getByRole('button',{name:'Volver a ver los recuerdos',exact:true}).waitFor();
await page.reload({waitUntil:'domcontentloaded'});
await page.getByRole('button',{name:'Continuar →',exact:true}).waitFor();
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'mobile.png'});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Desbordamiento horizontal móvil');
console.log('Final, progreso, diseño móvil:',errors.length?'ERRORES':'OK',errors);
await browser.close();
if(errors.length)process.exitCode=1;
