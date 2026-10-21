/** One visible official YouTube player, independent of the game scenes. */
let music: ReturnType<typeof initializeMusic> | undefined;
export function createMusic(){return music ??= initializeMusic();}
function initializeMusic(){
 const host=document.getElementById('youtube')!;
 const status=document.getElementById('music-status')!;
 const toggle=document.getElementById('music-toggle')!;
 const retry=document.createElement('button');
 retry.id='music-retry';retry.textContent='Reintentar conexión';retry.hidden=true;
 host.after(retry);
 let player:any,ready=false,wanted=false,playing=false,apiScript:HTMLScriptElement|undefined;
 let timeout:number|undefined;
 const globals=window as any;
 const prompt='Pulsa Reproducir música o ▶ en el video. Puedes seguir jugando sin música.';
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
    else if(event.data===2){wanted=false;status.textContent='Música en pausa. Puedes retomarla cuando quieras.';}
    else if(event.data===0){wanted=false;status.textContent='La canción terminó. Puedes volver a reproducirla.';}
   },
   onAutoplayBlocked:()=>{wanted=false;toggle.textContent='Reproducir música';status.textContent=prompt;},
   onError:(event:{data:number})=>{
    wanted=false;playing=false;toggle.textContent='Reproducir música';
    const reasons:Record<number,string>={
     2:'ID del video o parámetros inválidos (error 2).',
     5:'Error de reproducción HTML5 (error 5).',
     100:'YouTube informa que el video fue eliminado o es privado (error 100).',
     101:'El propietario no permite insertar esta canción (error 101).',
     150:'El propietario no permite insertar esta canción (error 150).',
     153:'YouTube no recibió el Referer o la identificación del cliente (error 153). Abre el juego desde su dirección HTTPS pública.'
    };
    unavailable(`${reasons[event.data]??`Error de YouTube ${event.data}.`} Puedes jugar sin música o usar «Abrir canción en YouTube».`);
   }
  }});
 }
 function connect(){
  window.clearTimeout(timeout);
  if(globals.YT?.Player){attach();}
  else if(!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')){
   apiScript=document.createElement('script');
   apiScript.src='https://www.youtube.com/iframe_api';apiScript.async=true;
   apiScript.onerror=()=>{apiScript?.remove();unavailable('No se pudo conectar con YouTube. Puedes usar el reproductor, reintentar o abrir la canción con el enlace.');};
   document.head.append(apiScript);
  }
  timeout=window.setTimeout(()=>{if(!ready)unavailable('YouTube está tardando en conectar. Prueba el botón ▶ del reproductor o reintenta.');},15000);
 }
 const previousReady=globals.onYouTubeIframeAPIReady;
 globals.onYouTubeIframeAPIReady=()=>{try{previousReady?.();}finally{attach();}};
 frame();connect();
 toggle.onclick=()=>{if(ready&&playing){wanted=false;player.pauseVideo();}else play();};
 retry.onclick=()=>{
  if(ready&&playing)return;
  retry.hidden=true;
  if(ready)play();else{status.textContent='Conectando con YouTube…';connect();}
 };
 function hidden(){
  wanted=false;
  if(ready)player.pauseVideo();
  else host.querySelector('iframe')?.contentWindow?.postMessage(JSON.stringify({event:'command',func:'pauseVideo',args:[]}),url.origin);
 }
 function visible(){status.textContent=prompt;}
 return {play,hidden,visible};
}
