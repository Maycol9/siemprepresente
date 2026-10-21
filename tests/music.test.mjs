import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function setup(preloaded=false){
 const nodes=new Map(),scripts=[],calls=[];
 const element=()=>({hidden:false,textContent:'',after(node){nodes.set(node.id,node);},replaceChildren(node){nodes.set(node.id,node);this.child=node;},querySelector(){return this.child;},remove(){scripts.splice(scripts.indexOf(this),1);},contentWindow:{postMessage(){calls.push('postPause');}}});
 for(const id of ['youtube','music-status','music-toggle'])nodes.set(id,element());
 const document={hidden:false,getElementById:id=>nodes.get(id),createElement:element,querySelector:()=>scripts[0],head:{append:node=>scripts.push(node)}};
 let events,players=0;
 const YT={Player:class {constructor(_id,options){players++;events=options.events;}playVideo(){calls.push('play');}pauseVideo(){calls.push('pause');}unMute(){calls.push('unmute');}setVolume(){}}};
 const window={location:{origin:'https://maycol9.github.io'},setTimeout:()=>1,clearTimeout(){},...(preloaded?{YT}:{})};
 const exports={};
 vm.runInNewContext(ts.transpileModule(readFileSync('src/music.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{document,window,location:window.location,URL,URLSearchParams,exports});
 const music=exports.createMusic();
 return {nodes,scripts,calls,document,window,music,exports,load(){window.YT=YT;window.onYouTubeIframeAPIReady();},get events(){return events;},get players(){return players;}};
}
test('one script/player, delayed readiness, retry preserves iframe',()=>{
 const s=setup(),iframe=s.nodes.get('player');
 assert.equal(s.exports.createMusic(),s.music);
 s.music.play();assert.deepEqual(s.calls,[]);
 s.nodes.get('music-retry').onclick();assert.equal(s.scripts.length,1);
 s.load();s.load();assert.equal(s.players,1);
 s.events.onReady();assert.ok(s.calls.includes('play'));
 s.nodes.get('music-retry').onclick();assert.equal(s.nodes.get('player'),iframe);
 assert.match(iframe.src,/origin=https%3A%2F%2Fmaycol9.github.io/);
 assert.match(iframe.src,/playsinline=1/);
});
test('already loaded API; blocked playback and visibility respect explicit choice',()=>{
 const s=setup(true);assert.equal(s.scripts.length,0);s.events.onReady();
 s.music.play();s.events.onAutoplayBlocked();assert.match(s.nodes.get('music-status').textContent,/▶/);
 s.events.onStateChange({data:1});s.document.hidden=true;s.music.hidden();
 const count=s.calls.length;s.document.hidden=false;s.music.visible();assert.equal(s.calls.length,count);
 s.events.onStateChange({data:2});s.nodes.get('music-toggle').onclick();assert.equal(s.calls.at(-1),'play');
});
test('errors are distinct and leave an external link fallback',()=>{
 const s=setup(true);s.events.onReady();
 for(const code of [2,5,100,101,150,153]){s.events.onError({data:code});assert.match(s.nodes.get('music-status').textContent,new RegExp(`error ${code}`));assert.match(s.nodes.get('music-status').textContent,/jugar sin música/);}
});
test('failed API script may retry, without replacing the player frame',()=>{
 const s=setup(),frame=s.nodes.get('player');s.scripts[0].onerror();assert.equal(s.scripts.length,0);
 s.nodes.get('music-retry').onclick();assert.equal(s.scripts.length,1);assert.equal(s.nodes.get('player'),frame);
 s.music.play();s.document.hidden=true;s.music.hidden();s.load();s.events.onReady();assert.ok(!s.calls.includes('play'));
});
