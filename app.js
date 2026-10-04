const c=document.getElementById('c'),g=c.getContext('2d');let O=[],sel=-1,tool='select',playing=false,player={x:45,y:300,vy:0,mode:'cube',speed:1,onGround:false,dead:false};
const ids={block:1,spike:8,orb:36,portal:10,trigger:901};
function resize(){c.width=c.clientWidth*devicePixelRatio;c.height=c.clientHeight*devicePixelRatio;g.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);draw()}addEventListener('resize',resize);resize();
document.querySelectorAll('.tool').forEach(b=>b.onclick=()=>tool=b.dataset.t);
document.getElementById('mode').onchange=e=>{if(!playing)player.mode=e.target.value};
document.getElementById('speed').onchange=e=>player.speed=+e.target.value;
c.onpointerdown=e=>{let r=c.getBoundingClientRect(),x=Math.round((e.clientX-r.left)/30)*30,y=Math.round((e.clientY-r.top)/30)*30;if(playing)return;if(tool==='select'){sel=O.findIndex(o=>Math.abs(o.x-x)<16&&Math.abs(o.y-y)<16);props();draw();return}O.push({id:ids[tool],type:tool,x,y,group:0,rot:0});sel=O.length-1;props();draw()};
onkeydown=e=>{if(e.key==='Delete'&&!playing&&sel>=0){O.splice(sel,1);sel=-1;props();draw()}if(playing&&(e.code==='Space'||e.code==='ArrowUp'))jump()};
function jump(){if(player.dead)return;if(player.mode==='cube'||player.mode==='robot'||player.mode==='spider'){if(player.onGround){player.vy=-10;player.onGround=false}}else if(player.mode==='ufo'){player.vy=-7}else if(player.mode==='ship'){player.vy=-7}else if(player.mode==='wave'){player.vy=-9}else if(player.mode==='ball'){player.vy=-9}}
function start(){playing=true;player={x:45,y:300,vy:0,mode:document.getElementById('mode').value,speed:+document.getElementById('speed').value,onGround:false,dead:false};document.getElementById('bar').textContent='ТЕСТ: Space/↑ = действие · R = рестарт';requestAnimationFrame(loop)}
function loop(t){if(!playing)return;step();draw();requestAnimationFrame(loop)}
function step(){let s=player.speed;player.x+=4*s;
 if(player.mode==='wave')player.vy=keys?((keys.up?-9:9)):9;
 else if(player.mode==='ship')player.vy+=(keys&&keys.up?-0.55:0.38);
 else if(player.mode==='ufo')player.vy+=0.42;
 else {player.vy+=0.55}
 player.y+=player.vy;
 if(player.y>330){player.y=330;player.vy=0;player.onGround=true}else player.onGround=false;
 if(player.y<5){player.y=5;player.vy=1}
 for(const o of O){if(o.type==='portal'&&hit(player,o)){const ms=['cube','ship','ball','ufo','wave','robot','spider'];let n=ms[(ms.indexOf(player.mode)+1)%ms.length];player.mode=n}
 if(o.type==='spike'&&hit(player,o)){player.dead=true;playing=false;report('❌ Смерть: столкновение с шипом на X='+Math.round(player.x));}
 if(o.type==='block'&&hit(player,o)&&player.vy>0){player.y=o.y-24;player.vy=0;player.onGround=true}}
 if(player.x>Math.max(1500,...O.map(o=>o.x+50))){playing=false;report('✅ Тест завершён: финиш достигнут.')}
}
let keys={up:false};addEventListener('keydown',e=>{if(e.code==='ArrowUp'||e.code==='Space')keys.up=true;if(e.code==='KeyR'&&playing)start()});addEventListener('keyup',e=>{if(e.code==='ArrowUp'||e.code==='Space')keys.up=false});
function hit(p,o){return p.x+18>o.x&&p.x<o.x+30&&p.y+24>o.y&&p.y<o.y+30}
function draw(){g.clearRect(0,0,c.clientWidth,c.clientHeight);g.fillStyle='#080b0f';g.fillRect(0,0,c.clientWidth,c.clientHeight);g.strokeStyle='#182129';for(let x=0;x<c.clientWidth;x+=30){g.beginPath();g.moveTo(x,0);g.lineTo(x,c.clientHeight);g.stroke()}for(let y=0;y<c.clientHeight;y+=30){g.beginPath();g.moveTo(0,y);g.lineTo(c.clientWidth,y);g.stroke()}for(let i=0;i<O.length;i++){let o=O[i];g.fillStyle=i===sel?'white':'#5ca8ff';if(o.type==='spike'){g.beginPath();g.moveTo(o.x+15,o.y);g.lineTo(o.x+30,o.y+30);g.lineTo(o.x,o.y+30);g.fill()}else if(o.type==='orb'){g.beginPath();g.arc(o.x+15,o.y+15,12,0,7);g.fill()}else if(o.type==='portal'){g.strokeStyle='#c46cff';g.lineWidth=5;g.beginPath();g.ellipse(o.x+15,o.y+15,9,14,0,0,7);g.stroke();g.lineWidth=1}else{g.fillRect(o.x,o.y,30,30)}}if(playing){g.fillStyle='#fff';g.fillRect(player.x,player.y,24,24)}}
function props(){document.getElementById('props').textContent=sel<0?'Нет выбора':`ID ${O[sel].id} | ${O[sel].type} | X=${O[sel].x} Y=${O[sel].y} | Group=${O[sel].group}`}
document.getElementById('applyGroup').onclick=()=>{if(sel>=0){O[sel].group=+document.getElementById('group').value;props()}};
document.getElementById('test').onclick=()=>start();
function report(s){document.getElementById('report').textContent=s}
document.getElementById('new').onclick=()=>{O=[];sel=-1;playing=false;draw();props();report('Новый уровень')};
document.getElementById('imp').onclick=()=>document.getElementById('file').click();
document.getElementById('file').onchange=async e=>{let f=e.target.files[0];if(f)document.getElementById('bar').textContent='Импортирован '+f.name};
document.getElementById('exp').onclick=()=>{let rec=O.map(o=>`${o.id}_2_${o.x}_3_${o.y}_6_${o.group||0}`).join('|');let xml=`<?xml version="1.0"?><plist version="1.0"><dict><k>kCEK</k><i>4</i><k>k2</k><s>New Level</s><k>k4</k><s>${btoa(rec)}</s></dict></plist>`;let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([xml]));a.download='New_Level.gmd';a.click()};
draw();