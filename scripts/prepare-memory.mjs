// Lossless JPEG metadata removal. Pixels are neither recompressed nor altered.
// SVG is only a portable container for the original JPEG image data.
import fs from 'node:fs';
const source=fs.readFileSync(process.argv[2]);
if(source.readUInt16BE(0)!==0xffd8)throw Error('Se esperaba un JPEG');
const parts=[source.subarray(0,2)];let offset=2,width=0,height=0;
while(offset<source.length){
 const start=offset;
 if(source[offset++]!==0xff)throw Error('JPEG inválido');
 while(source[offset]===0xff)offset++;
 const marker=source[offset++];
 if(marker===0xda||marker===0xd9){parts.push(source.subarray(start));break;}
 const length=source.readUInt16BE(offset),end=offset+length;
 if(end>source.length)throw Error('JPEG truncado');
 if([0xc0,0xc1,0xc2].includes(marker)){height=source.readUInt16BE(offset+3);width=source.readUInt16BE(offset+5);}
 if(marker===0xe1&&source.toString('ascii',offset+2,offset+8)==='Exif\0\0'){
  const t=offset+8,le=source.toString('ascii',t,t+2)==='II';
  const u16=p=>le?source.readUInt16LE(p):source.readUInt16BE(p);
  const u32=p=>le?source.readUInt32LE(p):source.readUInt32BE(p);
  const dir=t+u32(t+4),count=u16(dir);
  for(let i=0;i<count;i++){const p=dir+2+i*12;if(u16(p)===0x112&&u16(p+8)!==1)throw Error('Aplicar orientación EXIF antes de exportar');}
 }
 if(![0xe1,0xed,0xfe].includes(marker))parts.push(source.subarray(start,end));
 offset=end;
}
if(!width||!height)throw Error('Dimensiones ausentes');
const jpeg=Buffer.concat(parts);
process.stdout.write(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" href="data:image/jpeg;base64,${jpeg.toString('base64')}"/></svg>\n`);
