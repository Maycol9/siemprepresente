/** One visible official YouTube player, independent of the game scenes. */
export function createMusic(){
 const host=document.getElementById('youtube')!;
 const status=document.getElementById('music-status')!;
 const toggle=document.getElementById('music-toggle')!;
 const retry=document.createElement('button');
 retry.id='music-retry';retry.textContent='Reintentar conexión';retry.hidden=true;
 host.after(retry);
 let player:any,ready=false,wanted=false,playing=false,apiScript:HTMLScriptElement|undefined;
 let timeout:number|undefined;
 const globals=window as any;
 const prompt='Pulsa reproducir para acompañar la aventura con música.';
 const url=new URL('https://www.youtube.com/embed/nyerdKDi45s');
 url.search=new URLSearchParams({enablejsapi:'1',playsinline:'1',controls:'1',origin:location.origin,rel:'0'}).toString();
 function frame(){
  const iframe=document.createElement('iframe');
  iframe.id='player';iframe.title='Nuestra canción — reproductor de YouTube';
  iframe.width='100%';iframe.height='220';iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen=true;iframe.referrerPolicy='strict-origin-when-cross-origin';
  iframe.src=url.href;host.replaceChildren(iframe);
 }
 function unavailable(message:string){status.textContent=message;retry.hidden=false;}
 function play(){
  wanted=true;
  if(document.hidden)return;
  if(ready){player.unMute();player.setVolume(65);player.playVideo();status.textContent=prompt;}
  else{status.textContent='Pulsa ▶ en el reproductor de YouTube. Si no aparece, reintenta la conexión.';retry.hidden=false;}
 }
 function attach(){
  if(player||!globals.YT?.Player)return;
  player=new globals.YT.Player('player',{events:{
   onReady:()=>{ready=true;window.clearTimeout(timeout);retry.hidden=true;status.textContent=prompt;if(wanted&&!document.hidden)play();},
   onStateChange:(event:{data:number})=>{
    playing=event.data===1;
    toggle.textContent=playing?'Pausar música':'Reproducir música';
    if(playing){wanted=true;retry.hidden=true;if(document.hidden){player.pauseVideo();return;}status.textContent='La canción acompaña tu aventura.';}
    else if(event.data===2)status.textContent='Música en pausa. Puedes retomarla cuando quieras.';
    else if(event.data===0){wanted=false;status.textContent='La canción terminó. Puedes volver a reproducirla.';}
   },
   onAutoplayBlocked:()=>{status.textContent=prompt;},
   onError:(event:{data:number})=>{
    playing=false;toggle.textContent='Reproducir música';
    const reason=event.data===101||event.data===150?'YouTube no permite reproducir esta canción dentro del juego. Ábrela con «Escuchar en YouTube».':event.data===153?'YouTube no pudo identificar esta página. Abre el juego desde su dirección http:// y reintenta.':event.data===100?'La canción no está disponible en YouTube.':'YouTube no pudo reproducir la canción. Reintenta o ábrela con el enlace.';
    unavailable(reason);
   }
  }});
 }
 function connect(){
  window.clearTimeout(timeout);
  if(globals.YT?.Player){attach();}
  else{
   apiScript?.remove();apiScript=document.createElement('script');
   apiScript.src='https://www.youtube.com/iframe_api';apiScript.async=true;
   apiScript.onerror=()=>unavailable('No se pudo conectar con YouTube. Puedes usar el reproductor, reintentar o abrir la canción con el enlace.');
   document.head.append(apiScript);
  }
  timeout=window.setTimeout(()=>{if(!ready)unavailable('YouTube está tardando en conectar. Prueba el botón ▶ del reproductor o reintenta.');},15000);
 }
 globals.onYouTubeIframeAPIReady=attach;
 frame();connect();
 toggle.onclick=()=>{if(ready&&playing){wanted=false;player.pauseVideo();}else play();};
 retry.onclick=()=>{
  if(ready&&playing)return;
  player?.destroy();player=undefined;ready=false;playing=false;
  retry.hidden=true;status.textContent='Conectando con YouTube…';frame();connect();
 };
 function hidden(){
  if(ready)player.pauseVideo();
  else{const iframe=host.querySelector('iframe');if(iframe)iframe.src=url.href;}
 }
 function visible(){if(wanted)status.textContent='Pulsa reproducir para retomar la música.';}
 return {play,hidden,visible};
}
