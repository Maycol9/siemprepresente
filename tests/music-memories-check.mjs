import {chromium} from 'playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
for(let n=1;n<=3;n++){
 const svg=fs.readFileSync(`public/assets/memories/${n}.svg`,'utf8');
 const jpeg=Buffer.from(svg.match(/base64,([^"]+)/)[1],'base64');
 assert.equal(jpeg.readUInt16BE(0),0xffd8);
 assert.equal(jpeg.readUInt16BE(jpeg.length-2),0xffd9);
 assert.equal(jpeg.includes(Buffer.from('Exif\0\0')),false);
 console.log(`Foto ${n}: JPEG íntegro sin EXIF, ${jpeg.length} bytes`);
}
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173',{waitUntil:'domcontentloaded'});
await page.locator('#youtube iframe').waitFor();
assert.equal(await page.locator('#youtube iframe').count(),1);
assert.match(await page.locator('#youtube iframe').getAttribute('allow'),/autoplay/);
await page.waitForTimeout(20000);
await page.getByRole('button',{name:'Reproducir música',exact:true}).click();
await page.getByText('La canción acompaña tu aventura.',{exact:true}).waitFor({timeout:30000});
console.log('YouTube confirmó PLAYING tras pulsar reproducir');
await page.getByRole('button',{name:'Pausar música',exact:true}).click();
await page.getByText('Música en pausa. Puedes retomarla cuando quieras.',{exact:true}).waitFor();
await page.getByRole('button',{name:'Reproducir música',exact:true}).click();
await page.getByText('La canción acompaña tu aventura.',{exact:true}).waitFor();
await page.screenshot({path:'music-ready.png'});
const images=await browser.newPage();
for(let n=1;n<=3;n++){
 const response=await images.goto(`http://127.0.0.1:5173/assets/memories/${n}.svg`);
 assert.equal(response.status(),200);
 await images.screenshot({path:`photo-${n}.png`});
}
assert.deepEqual(errors,[]);
console.log('Reproducción, pausa, reanudación y rutas de las tres fotos: OK');
await browser.close();
