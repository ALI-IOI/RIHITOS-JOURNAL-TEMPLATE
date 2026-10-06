/* Journal app: all logic. Content lives in data/*.js */
"use strict";
(() => {
const PH=Object.fromEntries(PHASES.map(p=>[p.k,p]));
const BY=Object.fromEntries(ITEMS.map(i=>[i.id,i]));



function renderSkills(){
  const proto=[["Stuck 30–45 min?","Check the official docs and search the forum archive first; most questions were asked before."],["Then ask","Use the question template on the Community page, in the one community that fits."],["Learn just enough","Finish the project; note what you skipped in the README's Lessons section."],["Make it stick","Write 3 Anki cards and set the K item to Done in the tracker."]];
  document.getElementById("skills").innerHTML=`<div class="proto">${proto.map(([a,b])=>`<div class="glass"><b>${a}</b><span>${b}</span></div>`).join("")}</div>`+
  DOMAINS.map(dm=>`<div class="dom ph-${dm.k}"><h2>${esc(dm.name)}</h2><p>${esc(dm.lead)}</p><div class="sk-grid">${SKILLS.filter(s=>s.d===dm.k).map(s=>`<article class="sk glass ph-${dm.k}"><div class="top-line"><span class="kid">${s.id}</span>${pillSelect("s",s.id,st(s.id))}</div><h3>${esc(s.t)}</h3><div class="trig"><b>Learn when</b>${esc(s.when)}. ${esc(s.why)}</div><ul>${s.learn.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="links">${s.res.map(r=>`<a href="${r.u}" target="_blank" rel="noopener">${r.best?'<span class="tag best">★</span>':""}<span class="tag ${r.c==="Free"?"free":"paid"}">${r.c}</span><span class="t">${esc(r.t)} ↗</span></a>`).join("")}</div><div class="ask"><b>Ask at</b>${esc(s.ask)}</div></article>`).join("")}</div></div>`).join("");
}
function renderCommunity(){
  const tpl=`Title: [What you're doing] fails with [symptom] on [hardware/software + version]

Goal: what you're trying to make happen.
What happens instead: exact error text, or what you observe (with numbers).
Setup: board, firmware/ROS/PX4 version, OS, wiring photo or diagram.
Minimal example: the smallest code or config that still shows the problem.
What I tried: each attempt and what changed.
Logs: attach the flight log / terminal output / scope capture.`;
  const rules=[["Search first","Search the forum and docs; link what you found so people see you tried."],["One problem per post","Small, specific questions get answered within hours; vague ones get ignored."],["Close the loop","Post the fix when you find it, and mark the answer. People remember who does."],["Give back","Answer beginner questions in your strongest area. It cements your own learning and builds a public reputation."]];
  document.getElementById("community").innerHTML=`<div class="sec-h" style="margin-top:20px"><h2>How to ask so experts answer</h2><small>Works on every forum, Reddit and Discord</small></div>
  <div class="cols"><pre class="ask-tpl glass">${esc(tpl)}</pre><div class="proto" style="margin:0">${rules.map(([a,b])=>`<div class="glass"><b>${a}</b><span>${b}</span></div>`).join("")}</div></div>
  ${COMM.map(g=>`<div class="dom ph-${g.ph}"><h2>${esc(g.k)}</h2><div class="cm-grid">${g.list.map(([n,p,u,f])=>`<a class="cm glass ph-${g.ph}" href="${u}" target="_blank" rel="noopener"><span class="pf">${esc(p)}</span><span class="nm">${esc(n)} ↗</span><span class="fo">${esc(f)}</span></a>`).join("")}</div></div>`).join("")}
  ${TEXT.communityNote?`<div class="note glass">${TEXT.communityNote}</div>`:""}`;
}


/* ---------- learning links per item ---------- */
const linksOf=id=>LINKS[id]||(BY[id]&&BY[id].links)||[];
const linkList=(id,cls="lk")=>linksOf(id).map(([t,u])=>`<a class="${cls}" href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join("");

let prog={}, store=null, canWrite=true, mode="local";
const st=id=>prog[id]?.status??0, rv=id=>prog[id]?.review??0;
const LKEY=PROFILE.key+"-progress";
try{const s=localStorage.getItem(LKEY); if(s) prog=JSON.parse(s)||{};}catch(e){}
const saveLocal=()=>{try{localStorage.setItem(LKEY,JSON.stringify(prog));}catch(e){}};
const pending={};
function write(id,patch){
  prog[id]=Object.assign({status:0,review:0,notes:""},prog[id],patch,{u:Date.now()}); renderAll(); markDirty();
  if(mode==="db"&&store){
    const body={status:prog[id].status,review:prog[id].review,notes:prog[id].notes||"",updated:new Date().toISOString()};
    pending[id]=(pending[id]||Promise.resolve()).then(()=>store.doc("progress/"+id).set(body)).catch(e=>{ if(e&&e.code==="invalid_argument"){canWrite=false;applyReadOnly();} setSync(false,"Save failed");});
  } else saveLocal();
}

let today=new Date(); today.setHours(0,0,0,0);
const d=s=>new Date(s+"T00:00:00");
const daysTo=s=>Math.max(0,Math.ceil((d(s)-today)/864e5));
const isLate=it=>st(it.id)<2&&d(it.due)<today;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const phaseItems=k=>ITEMS.filter(i=>i.phase===k);
const countable=it=>st(it.id)!==3;
function pillSelect(kind,id,val){const opts=(kind==="s"?STATUS:REVIEW).map((o,i)=>`<option value="${i}" ${i===val?"selected":""}>${o}</option>`).join("");
  return `<select class="pill ${kind==="s"?"s":"r"}-${val}" data-kind="${kind}" data-id="${id}" id="${kind}-${id}" aria-label="${kind==="s"?"Status":"Review"} for ${id}" ${canWrite?"":"disabled"}>${opts}</select>`;}
document.addEventListener("change",e=>{const el=e.target; if(el.matches("select.pill[data-id]")) write(el.dataset.id, el.dataset.kind==="s"?{status:+el.value}:{review:+el.value});});

let scene={};
const VIEWS=[["home","Home"],["mission","Mission"],["tracker","Tracker"],["daily","Daily"],["board","Board"],["plan","Plan"],["learn","Learn"],["books","Books"],["parts","Parts"],["cred","Credentials"],["skills","Skills"],["community","Community"],["port","Portfolio"],["apply","Apply"],["console","Console"]];
const nav=document.getElementById("nav"), onav=document.getElementById("overlay-nav"), overlay=document.getElementById("overlay");
nav.innerHTML=VIEWS.map(([k,n])=>`<button class="tab" role="tab" id="tab-${k}" data-view="${k}" aria-selected="false">${n}</button>`).join("");
onav.innerHTML=VIEWS.map(([k,n])=>`<button data-view="${k}">${n}</button>`).join("");
const REDUCE=matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentView=null, swapTimer=null;
const replay=(el,cls)=>{el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);};
function swap(v){
  VIEWS.forEach(([k])=>{const el=document.getElementById("view-"+k); el.hidden=k!==v; el.classList.remove("leave","enter"); document.getElementById("tab-"+k).setAttribute("aria-selected",k===v);});
  onav.querySelectorAll("button").forEach(b=>b.setAttribute("aria-current",b.dataset.view===v));
  window.scrollTo({top:0,behavior:"instant"});
  const el=document.getElementById("view-"+v); if(!REDUCE) replay(el,"enter");
  currentView=v; homeMode(v==="home"); requestAnimationFrame(()=>{window.armReveals&&window.armReveals(el); window.parallaxRefresh&&window.parallaxRefresh();});
}
function show(v){
  if(!VIEWS.some(([k])=>k===v)) v="mission";
  try{localStorage.setItem(PROFILE.key+"-view",v);}catch(e){}
  scene.setView&&scene.setView(v);
  if(v===currentView){window.scrollTo({top:0,behavior:REDUCE?"instant":"smooth"}); return;}
  const old=currentView&&document.getElementById("view-"+currentView);
  clearTimeout(swapTimer);
  if(REDUCE||!old){swap(v); return;}
  replay(document.getElementById("sweep"),"run"); replay(document.getElementById("veil"),"run");
  old.classList.remove("enter"); old.classList.add("leave");
  swapTimer=setTimeout(()=>swap(v),290);
}
nav.addEventListener("click",e=>{const b=e.target.closest(".tab"); if(b) show(b.dataset.view);});
document.getElementById("menu-btn").addEventListener("click",()=>{overlay.hidden=false; onav.querySelector('[aria-current="true"]')?.focus();});
function hideAnimated(el,after){ if(REDUCE||el.hidden){el.hidden=true; after&&after(); return;} el.classList.add("closing"); setTimeout(()=>{el.hidden=true; el.classList.remove("closing"); after&&after();},260); }
document.getElementById("menu-close").addEventListener("click",()=>hideAnimated(overlay));
onav.addEventListener("click",e=>{const b=e.target.closest("button"); if(b){hideAnimated(overlay); show(b.dataset.view);}});
document.getElementById("home-link").addEventListener("click",e=>{e.preventDefault(); show("home");});

function renderMission(){
  const counted=ITEMS.filter(countable), done=counted.filter(i=>st(i.id)===2).length;
  document.getElementById("g-done").textContent=done; document.getElementById("g-total").textContent=counted.length;
  document.querySelectorAll("[data-cd]").forEach(g=>{const c=COUNTDOWNS[+g.dataset.cd]; if(!c){g.hidden=true; return;} g.hidden=false; g.querySelector("b").textContent=daysTo(c.date); g.querySelector(".cd-l").textContent=c.label; g.classList.toggle("hard",!!c.hard);});
  document.getElementById("legs").innerHTML=MAIN.map((p,ix)=>{const its=phaseItems(p.k).filter(countable), dn=its.filter(i=>st(i.id)===2).length, pct=its.length?Math.round(dn/its.length*100):0, now=d(p.start)<=today&&today<=d(p.end);
    return `<button class="moment ph-${p.k} ${now?"now":""}" data-phase="${p.k}" type="button"><span class="mc"><span>${p.code}${now?" · NOW":""}</span><span>${esc(p.dates)}</span></span>${p.hard?'<span class="gate-tag hard">Hard gate</span>':""}<span class="mnum">0${ix+1}</span><h3>${esc(p.name)}</h3><span class="stat">${its.length} items · ${dn} done · ${pct}%</span><div class="bar"><i style="width:${pct}%"></i></div><span class="g">Gate: ${esc(p.gate)}</span></button>`;}).join("");
  const cur=MAIN.find(p=>d(p.start)<=today&&today<=d(p.end)), nxt=MAIN.find(p=>d(p.start)>today);
  document.getElementById("todaytext").textContent=cur?`Now in ${cur.code} ${cur.name}. Gate: ${cur.gate}`:nxt?`Next: ${nxt.code} ${nxt.name}, from ${nxt.dates.split("–")[0].trim()}. Gate: ${nxt.gate}`:"All phases complete.";
  document.getElementById("cap-now").innerHTML=cur?`Now · <b>${cur.code} ${esc(cur.name)}</b>`:nxt?`Next · <b>${nxt.code} ${esc(nxt.name)}</b>`:"";
  document.getElementById("tools").innerHTML=TOOLS.map(([n,ph,l,u])=>`<a class="tool ph-${ph}" href="${u}" target="_blank" rel="noopener"><span>${esc(l)}</span><b>${esc(n)} ↗</b></a>`).join("");
  document.getElementById("buildlog").innerHTML=FLAG.map(id=>{const i=BY[id]; return `<button class="shot ph-${i.phase}" data-open="${id}" type="button"><div class="frame"><em>${PH[i.phase].code}</em><span class="st">${STATUS[st(id)]}</span><b>${id}</b></div><span class="cap">${esc(i.title)}</span><span class="sub">${esc(i.target)}</span></button>`;}).join("");
  const list=[...ITEMS.filter(i=>st(i.id)===1),...ITEMS.filter(i=>st(i.id)===0).sort((a,b)=>a.due.localeCompare(b.due))].slice(0,7);
  document.getElementById("upnext").innerHTML=list.length?list.map(i=>`<div class="list-row" data-open="${i.id}" tabindex="0" role="button"><span class="idb ph-${i.phase}">${i.id}</span><span class="t">${esc(i.title)}${i.star?'<span class="star">★</span>':""}</span><span class="when ${isLate(i)?"due late":""}">${st(i.id)===1?"In progress":esc(i.target)}</span></div>`).join(""):`<div class="empty">Everything is done or skipped.</div>`;
  document.getElementById("harddates").innerHTML=HARD.map(([w,t,iso,h,u])=>`<div class="kv">${u?`<a href="${u}" target="_blank" rel="noopener"><span>${esc(t)} ↗</span></a>`:`<span>${esc(t)}</span>`}<b class="${h?"crit":""}">${w} · ${daysTo(iso)} d</b></div>`).join("");
}

const fPhase=document.getElementById("f-phase"), fStatus=document.getElementById("f-status"), q=document.getElementById("q"), fStar=document.getElementById("f-star"), fLate=document.getElementById("f-late");
fPhase.innerHTML=`<option value="">All tracks</option>`+PHASES.map(p=>`<option value="${p.k}">${p.code} · ${esc(p.name)}</option>`).join("");
[fPhase,fStatus].forEach(el=>el.addEventListener("change",renderTracker)); q.addEventListener("input",renderTracker);
const toggle=b=>b.setAttribute("aria-pressed",b.getAttribute("aria-pressed")!=="true"), on=b=>b.getAttribute("aria-pressed")==="true";
[fStar,fLate].forEach(b=>b.addEventListener("click",()=>{toggle(b);renderTracker();}));
document.getElementById("legs").addEventListener("click",e=>{const b=e.target.closest(".moment"); if(!b) return; fPhase.value=b.dataset.phase; renderTracker(); show("tracker");});
function renderTracker(){
  const term=q.value.trim().toLowerCase();
  const rows=ITEMS.filter(i=>(!fPhase.value||i.phase===fPhase.value)&&(fStatus.value===""||st(i.id)===+fStatus.value)&&(!on(fStar)||i.star)&&(!on(fLate)||isLate(i))&&(!term||(i.id+" "+i.title+" "+i.desc).toLowerCase().includes(term)));
  let html="";
  PHASES.forEach(p=>{const its=rows.filter(i=>i.phase===p.k); if(!its.length) return; const all=phaseItems(p.k).filter(countable);
    html+=`<tr class="group-row ph-${p.k}"><td colspan="6">${esc(p.name)}<small>${p.dates} · ${all.filter(x=>st(x.id)===2).length}/${all.length} done</small></td></tr>`;
    its.forEach(i=>{html+=`<tr class="row"><td class="idc"><span class="idb ph-${i.phase}">${i.id}</span></td><td class="title" data-open="${i.id}"><span class="nm">${esc(i.title)}</span>${i.star?'<span class="star" title="Never cut">★</span>':""}${linksOf(i.id).length?`<span class="link-count" title="Learning links">${linksOf(i.id).length} links</span>`:""}<span class="open">Open</span></td><td><span class="phase-tag ph-${i.phase}">${PH[i.phase].code}</span></td><td><span class="due ${isLate(i)?"late":""}">${esc(i.target)}</span></td><td>${pillSelect("s",i.id,st(i.id))}</td><td>${pillSelect("r",i.id,rv(i.id))}</td></tr>`;});});
  document.getElementById("tbody").innerHTML=html||`<tr><td colspan="6" class="empty">No items match these filters.</td></tr>`;
}

const bPhase=document.getElementById("b-phase");
bPhase.innerHTML=PHASES.map(p=>`<option value="${p.k}">${p.code} · ${esc(p.name)}</option>`).join("")+`<option value="">All tracks</option>`;
bPhase.addEventListener("change",renderBoard);
function renderBoard(){const its=ITEMS.filter(i=>!bPhase.value||i.phase===bPhase.value);
  document.getElementById("board").innerHTML=STATUS.map((s,si)=>{const col=its.filter(i=>st(i.id)===si), shown=col.slice(0,40);
    return `<div class="lane glass" data-status="${si}"><h3>${s}<span>${col.length}</span></h3>${shown.map(i=>`<div class="card ph-${i.phase}" draggable="${canWrite}" data-id="${i.id}" data-open="${i.id}" tabindex="0"><div class="nm">${esc(i.title)}${i.star?'<span class="star">★</span>':""}</div><div class="meta"><span class="mono">${i.id}</span><span class="${isLate(i)?"due late":""}">${esc(i.target)}</span></div></div>`).join("")}${col.length>shown.length?`<div class="more">+${col.length-shown.length} more</div>`:""}</div>`;}).join("");}
let dragId=null; const boardEl=document.getElementById("board");
boardEl.addEventListener("dragstart",e=>{const c=e.target.closest(".card"); if(!c) return; dragId=c.dataset.id; e.dataTransfer.setData("text/plain",dragId);});
boardEl.addEventListener("dragover",e=>{const l=e.target.closest(".lane"); if(!l||!dragId) return; e.preventDefault(); boardEl.querySelectorAll(".lane").forEach(x=>x.classList.toggle("over",x===l));});
boardEl.addEventListener("drop",e=>{const l=e.target.closest(".lane"); if(!l||!dragId) return; e.preventDefault(); const id=dragId; dragId=null; write(id,{status:+l.dataset.status});});
boardEl.addEventListener("dragend",()=>{dragId=null; boardEl.querySelectorAll(".lane").forEach(x=>x.classList.remove("over"));});

function renderPlan(){
  document.getElementById("toc").innerHTML=PLAN.map(s=>`<a href="#sec-${s.id}">${esc(s.h.split(":")[0])}</a>`).join("");
  document.getElementById("doc").innerHTML=PLAN.map(s=>{let extra=""; if(s.phase){extra=`<div class="proj">${phaseItems(s.phase).map(i=>`<span class="mono">${i.id}</span><span>${esc(i.title)}${i.star?' <span class="star">★</span>':""} <span style="color:var(--faint)">· ${esc(i.target)} · ${STATUS[st(i.id)]}</span>${linksOf(i.id).length?`<span class="lks">${linkList(i.id)}</span>`:""}</span>`).join("")}</div><div class="gate"><b>Gate</b>${esc(PH[s.phase].gate)}</div>`;}
    return `<section id="sec-${s.id}" class="glass ${s.phase?"ph-"+s.phase:""}"><h2>${esc(s.h)}</h2><span class="sub">${esc(s.sub)}</span>${s.body}${extra}</section>`;}).join("");
}
document.getElementById("toc").addEventListener("click",e=>{const a=e.target.closest("a"); if(!a) return; e.preventDefault(); const el=document.querySelector(a.getAttribute("href")); if(el) window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-90,behavior:"smooth"});});

const lTrack=document.getElementById("l-track"), lFree=document.getElementById("l-free"), lPaid=document.getElementById("l-paid"), lBest=document.getElementById("l-best");
lTrack.innerHTML=`<option value="">All topics</option>`+TRACKS.map(t=>`<option value="${t.k}">${esc(t.name)}</option>`).join("");
lTrack.addEventListener("change",renderLearn);
[lFree,lPaid,lBest].forEach(b=>b.addEventListener("click",()=>{ if(b===lFree&&on(lPaid)) lPaid.setAttribute("aria-pressed","false"); if(b===lPaid&&on(lFree)) lFree.setAttribute("aria-pressed","false"); toggle(b); renderLearn();}));
let bkEss=false,bkFree=false,bkHide=false,bkQ="";
function cover(b,big){const [bg,ink]=COV[b.c];const L=Math.max(...b.t.split(/\s+/).map(w=>w.length));const fs=big?Math.min(b.t.length>34?21:26,150/(L*.62)):Math.min(b.t.length>34?10.5:12,66/(L*.62));return `<div class="bk-cover${big?" big":""}${b.t.length>34?" long":""}" lang="en" style="--cb:${bg};--ci:${ink}" aria-hidden="true"><span class="bk-ct" style="font-size:${fs.toFixed(1)}px">${esc(b.t)}</span><span class="bk-ca">${esc(b.by)}</span></div>`;}
function renderBooks(){
  const host=document.getElementById("books"); if(!host) return;
  const done=BOOKS.filter(b=>st(b.id)===2).length, essAll=BOOKS.filter(b=>b.ess), essDone=essAll.filter(b=>st(b.id)===2).length;
  const f=BOOKS.find(b=>b.ess&&st(b.id)<2)||BOOKS[0];
  const focusQ=document.activeElement&&document.activeElement.id==="bk-q";
  const list=BOOKS.filter(b=>(!bkEss||b.ess)&&(!bkFree||b.cost==="Free")&&(!bkHide||st(b.id)!==2)&&(!bkQ||(b.t+" "+b.by).toLowerCase().includes(bkQ.toLowerCase())));
  const shelves=SHELVES.map(([k,n])=>{const bs=list.filter(b=>b.sh===k); if(!bs.length) return "";
    return `<div class="bk-shelf glass"><div class="bk-vlabel">${esc(n)}</div><div class="bk-row">${bs.map(b=>`<article class="bk-card${st(b.id)===2?" is-done":""}">${cover(b)}<div class="bk-info"><div class="bk-tags">${b.ess?'<span class="tag best">★ Essential</span>':""}<span class="tag ${b.cost==="Free"?"free":"paid"}">${b.cost}</span></div><h3>${esc(b.t)}</h3><div class="bk-by">${esc(b.by)} · ${esc(b.pub)}</div><div class="bk-when">${esc(b.when)}</div><p class="bk-read"><b>Read:</b> ${esc(b.read)}</p><div class="bk-act"><a class="bk-open" href="${b.url}" target="_blank" rel="noopener">Open ↗</a>${pillSelect("s",b.id,st(b.id))}</div></div></article>`).join("")}</div><div class="bk-ledge" aria-hidden="true"></div></div>`;}).join("");
  host.innerHTML=`<div class="bk-stage glass"><div class="bk-hero">
    <div class="bk-intro"><h2>Read<br>next</h2><p>The next essential book you haven't finished.</p><input id="bk-q" class="bk-search" type="search" placeholder="Titles or authors" value="${esc(bkQ)}" aria-label="Search books"></div>
    <div class="bk-feature">${cover(f,1)}</div>
    <div class="bk-side"><div class="bk-vlabel">Why this one</div><div class="bk-why"><div class="bk-why-t">${esc(f.t)}</div><div class="bk-by">${esc(f.by)}</div><p>${esc(f.why)}</p><p class="bk-read"><b>Read:</b> ${esc(f.read)}</p><a class="bk-open dark" href="${f.url}" target="_blank" rel="noopener">Open ↗</a></div></div>
    <div class="bk-side"><div class="bk-vlabel">Your shelf</div><div class="bk-prog glass"><div class="bk-big">${done}<span>/${BOOKS.length}</span></div><div class="bk-by">books done</div><div class="bk-bar"><i style="width:${Math.round(essDone/essAll.length*100)}%"></i></div><div class="bk-by">${essDone} of ${essAll.length} essentials</div><div class="bk-fs"><span>${esc(f.when)}</span>${pillSelect("s",f.id,st(f.id))}</div></div></div>
  </div><div class="bk-ledge big" aria-hidden="true"></div></div>
  <div class="toolbar bk-tools"><button class="chip glass" data-bk="ess" aria-pressed="${bkEss}">★ Essential only</button><button class="chip glass" data-bk="free" aria-pressed="${bkFree}">Free only</button><button class="chip glass" data-bk="hide" aria-pressed="${bkHide}">Hide finished</button></div>
  ${shelves||'<div class="note glass">No books match these filters.</div>'}`;
  if(focusQ){const q=document.getElementById("bk-q"); q.focus(); q.setSelectionRange(q.value.length,q.value.length);}
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-bk]"); if(!b) return; const k=b.dataset.bk; if(k==="ess") bkEss=!bkEss; if(k==="free") bkFree=!bkFree; if(k==="hide") bkHide=!bkHide; renderBooks();});
document.addEventListener("input",e=>{if(e.target.id==="bk-q"){bkQ=e.target.value; renderBooks();}});

const PKEY=PROFILE.key+"-parts";
const seedParts=()=>({inv:INV0.map((r,i)=>({id:"i"+i,name:r[0],qty:r[1],cat:r[2],note:r[3]})),buy:BUY0.map((r,i)=>({id:"b"+i,seq:i,name:r[0],qty:r[1],for:r[2],by:r[3],lo:r[4],hi:r[5],note:r[6],cat:r[7]}))});
let parts=null, partsLocalEdited=false;
try{const v=localStorage.getItem(PKEY); if(v){const o=JSON.parse(v); if(o&&Array.isArray(o.inv)&&Array.isArray(o.buy)){parts=o; partsLocalEdited=true;}}}catch(e){}
if(!parts) parts=seedParts();
let partsSaveTimer=null, partsSaving=Promise.resolve(), partsUndo=null, partsUndoTimer=null, ptEdit=null, ptQ="", ptResetArm=false, ptFormReset=false, ptKeep={};
const uidP=k=>k+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36);
function savePartsSoon(){
  parts.u=Date.now(); markDirty(); partsLocalEdited=true; try{localStorage.setItem(PKEY,JSON.stringify(parts));}catch(e){}
  if(mode!=="db"||!store||!canWrite) return;
  clearTimeout(partsSaveTimer);
  partsSaveTimer=setTimeout(()=>{const body={inv:parts.inv,buy:parts.buy,u:parts.u,updated:new Date().toISOString()};
    partsSaving=partsSaving.then(()=>store.doc("parts/state").set(body)).catch(e=>{ if(e&&e.code==="invalid_argument"){canWrite=false;applyReadOnly();} setSync(false,"Save failed");});},500);
}
function changeParts(fn,undoLabel){ if(!canWrite) return; const before=JSON.stringify(parts); fn(); if(undoLabel){partsUndo={label:undoLabel,state:before}; clearTimeout(partsUndoTimer); partsUndoTimer=setTimeout(()=>{partsUndo=null; renderParts();},8000);} savePartsSoon(); renderParts(); }
const fmtMon=m=>{if(!m||!/^\d{4}-\d{2}/.test(m)) return "Any time"; const [y,mo]=m.split("-"); return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1]+" "+y;};
const monPhase=m=>{if(!m) return null; const d=m+"-15"; return MAIN.find(p=>d>=p.start&&d<=p.end)||(d<MAIN[0].start?MAIN[0]:null)||MAIN.find(p=>d<p.start)||null;};
const money=n=>(PROFILE.currency||"")+Math.round(n).toLocaleString("en-US");
const estTxt=b=>(b.lo||b.hi)?(b.lo&&b.hi&&b.lo!==b.hi?money(b.lo)+"–"+Math.round(b.hi).toLocaleString("en-US"):money(b.hi||b.lo)):"—";
const parseEst=t=>{const n=String(t||"").replace(/[^\d.\-–to]/g,"").split(/[–\-to]+/).map(Number).filter(x=>!isNaN(x)&&x>0); if(!n.length) return [0,0]; return [Math.min(...n),Math.max(...n)];};
function forChips(t){return esc(t||"").replace(/\b(A\d{1,2}|E\d|P\d|R\d|D\d|X\d|M\d|K\d{1,2}|T\d|C\d|G\d|S\d|OD1|CS1|PF\d|CR\d|L\d|J\d)\b/g,id=>BY[id]?`<button type="button" class="pt-for" data-open="${id}" title="${esc(BY[id].title)}">${id}</button>`:id);}
const hl=t=>{const q=ptQ.trim(); const e=esc(t); if(!q) return e; const i=String(t).toLowerCase().indexOf(q.toLowerCase()); if(i<0) return e; return esc(String(t).slice(0,i))+"<mark>"+esc(String(t).slice(i,i+q.length))+"</mark>"+esc(String(t).slice(i+q.length));};
const sortedBuy=()=>parts.buy.slice().sort((a,b)=>(a.by||"9999-99").localeCompare(b.by||"9999-99")||((a.seq??0)-(b.seq??0)));
function catOpts(sel){return PCATS.map(c=>`<option${c===sel?" selected":""}>${esc(c)}</option>`).join("");}
function renderParts(){
  const host=document.getElementById("parts"); if(!host) return;
  const act=document.activeElement; if(act&&host.contains(act)&&act.matches("input,select,textarea")&&act.dataset.live!=="1"){host.dataset.stale="1"; return;}
  host.dataset.stale="";
  if(ptFormReset) ptKeep={}; else ["pt-buy-form","pt-inv-form"].forEach(fid=>{const f=document.getElementById(fid); if(f){ptKeep[fid]={}; [...f.elements].forEach(el=>{if(el.name) ptKeep[fid][el.name]=el.value;});}}); ptFormReset=false; const keep=ptKeep;
  const buy=sortedBuy(), now=new Date().toISOString().slice(0,7);
  const lo=buy.reduce((a,b)=>a+(+b.lo||0),0), hi=buy.reduce((a,b)=>a+(+b.hi||+b.lo||0),0);
  const pieces=parts.inv.reduce((a,b)=>a+(+b.qty||0),0), next=buy[0];
  const ro=!canWrite;
  const eb=ptEdit&&ptEdit.list==="buy"?parts.buy.find(x=>x.id===ptEdit.id):null, ei=ptEdit&&ptEdit.list==="inv"?parts.inv.find(x=>x.id===ptEdit.id):null;
  const q=ptQ.trim().toLowerCase();
  const hitB=b=>!q||[b.name,b.note,b.for,b.cat,fmtMon(b.by),estTxt(b)].join(" ").toLowerCase().includes(q);
  let lastPh="";
  const buyShown=buy.map((b,i)=>[b,i+1]).filter(([b])=>hitB(b));
  const buyRows=buyShown.map(([b,rank])=>{const ph=monPhase(b.by), due=b.by&&b.by<now;
    const head=ph&&ph.k!==lastPh?`<div class="pt-phase ph-${ph.k}"><span>${esc(ph.code)}</span>${esc(ph.name)}</div>`:""; if(ph) lastPh=ph.k;
    return head+`<div class="pt-row pt-buy ${ph?"ph-"+ph.k:""}${eb&&eb.id===b.id?" is-editing":""}"><span class="idb pt-rank">${rank}</span><div class="pt-main"><div class="pt-name">${hl(b.name)}${b.qty>1?` <span class="pt-x">× ${esc(b.qty)}</span>`:""}</div>${b.note?`<div class="pt-note">${esc(b.note)}</div>`:""}</div><div class="pt-for-cell">${b.for?`<span class="pt-lbl">For</span> ${forChips(b.for)}`:""}</div><div class="pt-when${due?" due":""}"><span class="pt-lbl">${due?"Overdue":"Buy by"}</span> ${esc(fmtMon(b.by))}</div><div class="pt-est">${estTxt(b)}</div>${ro?"":`<div class="pt-act"><button type="button" class="pt-btn good" data-pt="bought" data-id="${b.id}">Bought</button><button type="button" class="pt-ico" data-pt="edit-buy" data-id="${b.id}" aria-label="Edit ${esc(b.name)}">✎</button><button type="button" class="pt-ico del" data-pt="del-buy" data-id="${b.id}" aria-label="Delete ${esc(b.name)}">×</button></div>`}</div>`;}).join("");
  const invList=parts.inv.filter(x=>!q||(x.name+" "+(x.note||"")+" "+x.cat).toLowerCase().includes(q));
  const cats=[...PCATS,...new Set(parts.inv.map(x=>x.cat).filter(c=>!PCATS.includes(c)))];
  const invRows=cats.map(c=>{const xs=invList.filter(x=>(x.cat||"Other")===c); if(!xs.length) return "";
    return `<div class="pt-cat"><h3>${esc(c)} <span>${xs.length}</span></h3><div class="pt-grid">${xs.map(x=>`<div class="pt-row pt-inv${(+x.qty||0)<=0?" is-out":""}${ei&&ei.id===x.id?" is-editing":""}"><div class="pt-main"><div class="pt-name">${hl(x.name)}</div>${x.note?`<div class="pt-note">${esc(x.note)}</div>`:""}</div><div class="pt-qty">${ro?"":`<button type="button" class="pt-ico" data-pt="dec" data-id="${x.id}" aria-label="One less ${esc(x.name)}">−</button>`}<b>${esc(x.qty)}</b>${ro?"":`<button type="button" class="pt-ico" data-pt="inc" data-id="${x.id}" aria-label="One more ${esc(x.name)}">+</button>`}</div>${ro?"":`<div class="pt-act"><button type="button" class="pt-ico" data-pt="edit-inv" data-id="${x.id}" aria-label="Edit ${esc(x.name)}">✎</button><button type="button" class="pt-ico del" data-pt="del-inv" data-id="${x.id}" aria-label="Delete ${esc(x.name)}">×</button></div>`}</div>`).join("")}</div></div>`;}).join("");
  const fb=eb||{name:"",qty:1,for:"",by:"",lo:0,hi:0,note:"",cat:"Other"}, fi=ei||{name:"",qty:1,cat:"Other",note:""};
  const buyForm=ro?"":`<form class="pt-form glass" id="pt-buy-form" autocomplete="off"><div class="pt-ftitle">${eb?"Edit part to buy":"Add a part to buy"}</div>
    <label class="w2">Part<input name="name" required maxlength="120" placeholder="e.g. 5 mm LEDs" value="${esc(fb.name)}"></label>
    <label>Qty<input name="qty" type="number" min="0" step="1" value="${esc(fb.qty)}"></label>
    <label>For project<input name="for" maxlength="60" placeholder="e.g. A1 or E8" value="${esc(fb.for||"")}"></label>
    <label>Buy by<input name="by" type="month" value="${esc(fb.by||"")}"></label>
    <label>Est. ৳<input name="est" maxlength="30" placeholder="e.g. 800-1500" value="${fb.lo||fb.hi?esc(fb.lo&&fb.hi&&fb.lo!==fb.hi?fb.lo+"-"+fb.hi:(fb.hi||fb.lo)):""}"></label>
    <label>Category<select name="cat">${catOpts(fb.cat)}</select></label>
    <label class="w2">Note<input name="note" maxlength="200" placeholder="Optional" value="${esc(fb.note||"")}"></label>
    <div class="pt-fbtns"><button class="pt-btn solid" type="submit">${eb?"Save changes":"Add to buy list"}</button>${eb?`<button class="pt-btn" type="button" data-pt="cancel">Cancel</button>`:""}</div></form>`;
  const invForm=ro?"":`<form class="pt-form glass" id="pt-inv-form" autocomplete="off"><div class="pt-ftitle">${ei?"Edit inventory part":"Add a part you own"}</div>
    <label class="w2">Part<input name="name" required maxlength="120" placeholder="e.g. HC-05 Bluetooth module" value="${esc(fi.name)}"></label>
    <label>Qty<input name="qty" type="number" min="0" step="1" value="${esc(fi.qty)}"></label>
    <label>Category<select name="cat">${catOpts(fi.cat)}</select></label>
    <label class="w2">Note<input name="note" maxlength="200" placeholder="Optional" value="${esc(fi.note||"")}"></label>
    <div class="pt-fbtns"><button class="pt-btn solid" type="submit">${ei?"Save changes":"Add to inventory"}</button>${ei?`<button class="pt-btn" type="button" data-pt="cancel">Cancel</button>`:""}</div></form>`;
  host.innerHTML=`<div class="pt-stats">
    <div class="pt-stat glass"><span class="pt-lbl">Next to buy</span><b>${next?esc(next.name):"Nothing on the list"}</b><small>${next?`By ${esc(fmtMon(next.by))}${next.for?" · for "+esc(next.for):""}`:"Add parts below"}</small></div>
    <div class="pt-stat glass"><span class="pt-lbl">To buy</span><b>${buy.length} items</b><small>About ${money(lo)}–${Math.round(hi).toLocaleString("en-US")} in total${buy.some(x=>/optional/i.test(x.name))?` · ${money(buy.filter(x=>!/optional/i.test(x.name)).reduce((a,x)=>a+(+x.lo||0),0))}–${Math.round(buy.filter(x=>!/optional/i.test(x.name)).reduce((a,x)=>a+(+x.hi||+x.lo||0),0)).toLocaleString("en-US")} without optional items`:""}</small></div>
    <div class="pt-stat glass"><span class="pt-lbl">In inventory</span><b>${parts.inv.length} parts</b><small>${pieces} pieces in total</small></div></div>
  <div class="pt-searchbar glass"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="pt-q" type="search" data-live="1" placeholder="Search parts: name, project (E8), month (Feb 2027), category…" value="${esc(ptQ)}" aria-label="Search parts in both lists">${q?`<span class="pt-hits">${buyShown.length} to buy · ${invList.length} owned</span><button type="button" class="pt-ico" data-pt="clearq" aria-label="Clear search">×</button>`:""}</div>
  ${partsUndo?`<div class="pt-undo glass" role="status">${esc(partsUndo.label)} <button type="button" class="pt-btn" data-pt="undo">Undo</button></div>`:""}
  <section class="pt-sec"><div class="pt-sec-head"><h2>Need to buy</h2><p>Ranked by when a project needs it. Buy each part only when its month comes; prices fall and plans change.</p></div>${q&&!eb?"":buyForm}
    <div class="pt-list glass">${buyRows||`<div class="pt-empty">${q?"No parts to buy match “"+esc(ptQ)+"”.":"Nothing left to buy."}</div>`}</div></section>
  <section class="pt-sec"><div class="pt-sec-head"><h2>Inventory</h2><p>Everything from your handwritten parts list, grouped by type.</p></div>${q&&!ei?"":invForm}
    <div class="pt-list glass pt-invlist">${invRows||`<div class="pt-empty">${q?"Nothing you own matches “"+esc(ptQ)+"”.":"Your inventory is empty."}</div>`}</div></section>
  ${ro?"":`<div class="pt-reset"><button type="button" class="pt-btn" data-pt="reset">${ptResetArm?"Press again to restore both original lists":"Restore my original lists"}</button></div>`}`;
  Object.keys(keep).forEach(fid=>{const f=document.getElementById(fid); if(f) Object.entries(keep[fid]).forEach(([n,v])=>{if(f.elements[n]) f.elements[n].value=v;});});
  if(act&&act.id==="pt-q"){const qi=document.getElementById("pt-q"); qi.focus(); qi.setSelectionRange(qi.value.length,qi.value.length);}
}
document.addEventListener("focusout",e=>{const host=document.getElementById("parts"); if(host&&host.dataset.stale==="1"&&host.contains(e.target)) setTimeout(()=>{if(!host.contains(document.activeElement)) renderParts();},0);});
document.addEventListener("input",e=>{if(e.target.id==="pt-q"){ptQ=e.target.value; renderParts();}});
document.addEventListener("submit",e=>{const f=e.target; if(f.id!=="pt-buy-form"&&f.id!=="pt-inv-form") return; e.preventDefault(); if(!canWrite) return;
  ptFormReset=true; const g=n=>(f.elements[n]&&f.elements[n].value||"").trim(); const name=g("name"); if(!name) return; const qty=Math.max(0,parseInt(g("qty"),10)||0);
  if(f.id==="pt-buy-form"){const [lo,hi]=parseEst(g("est")); const rec={name,qty:qty||1,for:g("for"),by:g("by"),lo,hi,note:g("note"),cat:g("cat")||"Other"};
    changeParts(()=>{ if(ptEdit&&ptEdit.list==="buy"){const x=parts.buy.find(b=>b.id===ptEdit.id); if(x) Object.assign(x,rec);} else parts.buy.push(Object.assign({id:uidP("b"),seq:Date.now()},rec)); ptEdit=null; });
  } else { const rec={name,qty,cat:g("cat")||"Other",note:g("note")};
    changeParts(()=>{ if(ptEdit&&ptEdit.list==="inv"){const x=parts.inv.find(b=>b.id===ptEdit.id); if(x) Object.assign(x,rec);} else parts.inv.push(Object.assign({id:uidP("i")},rec)); ptEdit=null; });
  }
});
document.addEventListener("click",e=>{const b=e.target.closest("[data-pt]"); if(!b) return; const k=b.dataset.pt, id=b.dataset.id;
  if(k!=="reset") ptResetArm=false;
  if(k==="undo"&&partsUndo){const st=JSON.parse(partsUndo.state); partsUndo=null; changeParts(()=>{parts=st;}); return;}
  if(k==="clearq"){ptQ=""; renderParts(); const qi=document.getElementById("pt-q"); if(qi) qi.focus(); return;}
  if(k==="cancel"){ptEdit=null; ptFormReset=true; renderParts(); return;}
  if(k==="edit-buy"||k==="edit-inv"){ptEdit={list:k==="edit-buy"?"buy":"inv",id}; ptFormReset=true; renderParts(); const f=document.getElementById(k==="edit-buy"?"pt-buy-form":"pt-inv-form"); if(f){f.scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"center"}); f.elements.name.focus();} return;}
  if(k==="reset"){ if(!ptResetArm){ptResetArm=true; renderParts(); return;} ptResetArm=false; ptFormReset=true; changeParts(()=>{parts=seedParts(); ptEdit=null;},"Original lists restored."); return;}
  if(k==="del-buy"){const x=parts.buy.find(p=>p.id===id); if(x) changeParts(()=>{parts.buy=parts.buy.filter(p=>p.id!==id); if(ptEdit&&ptEdit.id===id) ptEdit=null;},`Removed “${x.name}” from the buy list.`); return;}
  if(k==="del-inv"){const x=parts.inv.find(p=>p.id===id); if(x) changeParts(()=>{parts.inv=parts.inv.filter(p=>p.id!==id); if(ptEdit&&ptEdit.id===id) ptEdit=null;},`Removed “${x.name}” from inventory.`); return;}
  if(k==="inc"||k==="dec"){changeParts(()=>{const x=parts.inv.find(p=>p.id===id); if(x) x.qty=Math.max(0,(+x.qty||0)+(k==="inc"?1:-1));}); return;}
  if(k==="bought"){const x=parts.buy.find(p=>p.id===id); if(!x) return; changeParts(()=>{parts.buy=parts.buy.filter(p=>p.id!==id); const d=new Date(); parts.inv.push({id:uidP("i"),name:x.name,qty:x.qty||1,cat:PCATS.includes(x.cat)?x.cat:"Other",note:"Bought "+fmtMon(d.toISOString().slice(0,7))+(x.for?" for "+x.for:"")}); if(ptEdit&&ptEdit.id===id) ptEdit=null;},`Moved “${x.name}” to inventory.`); return;}
});
const ART={
 cal:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="30" y="14" width="100" height="76" rx="6"/><path d="M30 30h100" opacity=".7"/><path d="M44 8v12M116 8v12"/></g><g fill="currentColor"><rect x="40" y="38" width="10" height="10" rx="1.5"/><rect x="54" y="38" width="10" height="10" rx="1.5"/><rect x="68" y="52" width="10" height="10" rx="1.5"/><rect x="96" y="52" width="10" height="10" rx="1.5"/><rect x="54" y="66" width="10" height="10" rx="1.5"/><rect x="110" y="66" width="10" height="10" rx="1.5"/></g><g fill="none" stroke="currentColor" stroke-width="1" opacity=".35"><rect x="68" y="38" width="10" height="10"/><rect x="82" y="38" width="10" height="10"/><rect x="40" y="52" width="10" height="10"/><rect x="82" y="66" width="10" height="10"/></g></svg>',
 drone:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M50 30l60 40M110 30l-60 40"/><rect x="68" y="40" width="24" height="20" rx="4"/><ellipse cx="50" cy="30" rx="20" ry="5"/><ellipse cx="110" cy="30" rx="20" ry="5"/><ellipse cx="50" cy="70" rx="20" ry="5"/><ellipse cx="110" cy="70" rx="20" ry="5"/><path d="M80 60v10M74 76h12" opacity=".6"/></g></svg>',
 check:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="40" y="12" width="80" height="78" rx="8"/><path d="M52 32l6 6 10-12M52 54l6 6 10-12M52 76l6 6"/><path d="M78 32h30M78 54h30M78 76h22" opacity=".6"/></g></svg>',
 board:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="22" y="14" width="34" height="74" rx="6"/><rect x="63" y="14" width="34" height="74" rx="6"/><rect x="104" y="14" width="34" height="74" rx="6"/><rect x="28" y="24" width="22" height="12" rx="3"/><rect x="28" y="42" width="22" height="12" rx="3"/><rect x="69" y="24" width="22" height="12" rx="3"/><rect x="110" y="24" width="22" height="12" rx="3"/><rect x="110" y="42" width="22" height="12" rx="3"/><rect x="110" y="60" width="22" height="12" rx="3"/></g></svg>',
 plan:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 82C48 82 40 52 72 52S98 22 132 22" stroke-dasharray="4 5"/><circle cx="18" cy="82" r="5"/><circle cx="72" cy="52" r="5"/><circle cx="104" cy="34" r="4"/><path d="M132 22V6l14 6-14 6"/></g></svg>',
 learn:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="12" width="100" height="62" rx="6"/><path d="M72 30v26l22-13z"/><path d="M60 88h40M80 74v14"/></g></svg>',
 books:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="34" y="20" width="18" height="70" rx="2"/><rect x="56" y="12" width="20" height="78" rx="2"/><path d="M84 22l18-4 16 70-18 4z"/><path d="M38 34h10M60 28h12M60 76h12M38 78h10"/><path d="M24 90h112"/></g></svg>',
 chip:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="50" y="22" width="60" height="56" rx="6"/><rect x="64" y="36" width="32" height="28" rx="3" opacity=".6"/><path d="M60 22V10M72 22V10M84 22V10M96 22V10M60 78v12M72 78v12M84 78v12M96 78v12M50 36H38M50 50H38M50 64H38M110 36h12M110 50h12M110 64h12"/></g></svg>',
 medal:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M64 8l12 30M96 8L84 38"/><circle cx="80" cy="62" r="26"/><path d="M80 48l4 9 10 1-8 6 3 10-9-6-9 6 3-10-8-6 10-1z"/></g></svg>',
 gear:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="64" cy="50" r="12"/><path d="M64 22v8M64 70v8M36 50h8M84 50h8M44 30l6 6M78 64l6 6M44 70l6-6M78 36l6-6"/><path d="M98 78l26-26a10 10 0 0 0 10-14l-8 8-7-2-2-7 8-8a10 10 0 0 0-14 10L85 65"/></g></svg>',
 nodes:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="80" cy="50" r="10"/><circle cx="34" cy="24" r="7"/><circle cx="126" cy="24" r="7"/><circle cx="34" cy="78" r="7"/><circle cx="126" cy="78" r="7"/><circle cx="80" cy="12" r="5"/><circle cx="80" cy="90" r="5"/><path d="M71 45L40 28M89 45l31-17M71 55L40 74M89 55l31 19M80 40V17M80 60v25" opacity=".7"/></g></svg>',
 window:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="12" width="112" height="76" rx="6"/><path d="M24 26h112"/><circle cx="33" cy="19" r="1.5"/><circle cx="40" cy="19" r="1.5"/><path d="M36 76l18-20 12 12 16-22 22 30z"/><circle cx="110" cy="42" r="6"/></g></svg>',
 plane:'<svg viewBox="0 0 160 100"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M136 14L26 50l38 10 10 30 16-22 24 14z"/><path d="M64 60l72-46"/><path d="M14 84c14-4 22-14 36-18" stroke-dasharray="3 5" opacity=".6"/></g></svg>'
};
const curPhase=()=>MAIN.find(p=>d(p.start)<=today&&today<=d(p.end))||MAIN.find(p=>d(p.start)>today)||MAIN[MAIN.length-1];
const monthsTo=s=>{const e=d(s); return Math.max(0,(e.getFullYear()-today.getFullYear())*12+e.getMonth()-today.getMonth());};
const nextOpen=list=>list.filter(i=>st(i.id)<2).sort((a,b)=>a.due.localeCompare(b.due))[0];
const TONE={mission:"black",tracker:"white",board:"black",plan:"white",learn:"black",books:"white",parts:"black",cred:"white",skills:"black",community:"white",port:"black",apply:"red"};
function renderLx(){
  const el=id=>document.getElementById(id); if(!el("lx-stage")) return;
  const pr=k=>{const its=phaseItems(k).filter(countable); return `${its.filter(i=>st(i.id)===2).length} / ${its.length} done`;};
  LX.forEach(([lbl,k],i)=>{if(el("lx-n"+(i+1))){el("lx-n"+(i+1)).textContent=PH[k]?pr(k):""; el("lx-l"+(i+1)).textContent=lbl;}});
  const cur=curPhase(), ix=MAIN.indexOf(cur);
  el("lx-phname").textContent=cur.name;
  const phPct=p=>{const its=phaseItems(p.k).filter(countable); return its.length?Math.round(its.filter(i=>st(i.id)===2).length/its.length*100):0;}, tPct=p=>Math.max(0,Math.min(100,Math.round((today-d(p.start))/(d(p.end)-d(p.start))*100)));
  el("lx-seg").innerHTML=MAIN.map((p,k)=>{const f=phPct(p), t=tPct(p); return `<i class="${k<ix?"past":k===ix?"on":""}" title="${esc(p.code+" "+p.name)}: ${f}% done, ${t}% of the time used" style="--f:${f}%;--t:${t}%"><b></b>${k===ix?"<u></u>":""}</i>`;}).join("");
  {const c=MAIN[ix]; el("lx-phname").textContent=`${cur.name} · ${phPct(c)}% done`;}
  el("lx-capnow").innerHTML=(d(cur.start)>today?"Next":"Now")+` · <b>${esc(cur.code)} ${esc(cur.name)}</b>`;
  const nh=HARD.find(h=>h[2]&&d(h[2])>=today); if(nh){el("lx-c1").textContent=nh[1]; el("lx-c1s").textContent=`${daysTo(nh[2])} days · ${nh[0]}`;}
  const counted=ITEMS.filter(countable), dn=counted.filter(i=>st(i.id)===2).length, pct=counted.length?Math.round(dn/counted.length*100):0;
  el("lx-c2").textContent=pct+"%"; el("lx-c2b").style.width=Math.max(pct,2)+"%";
}
const H={streak:()=>dailyStreak(),todayPct:()=>pctOf(today)??0,weekPct:()=>weekPct(),daysTo:s=>daysTo(s),curPhase:()=>curPhase(),monthsTo:s=>monthsTo(s),nextOpen:l=>nextOpen(l),st:id=>st(id),rv:id=>rv(id),countable:it=>countable(it),parts:()=>parts,sortedBuy:()=>sortedBuy(),fmtMon:m=>fmtMon(m)};
function renderDeck(){
  renderLx();
  const host=document.getElementById("deck"); if(!host) return;
  host.innerHTML=DECK.map((c,i)=>{const [sl,sv]=c.st(H); const cost=n=>`<span class="bw-cost">${"<i></i>".repeat(n)}</span>`;
    return `<button type="button" class="bw t-${c.k==="apply"?"red":i%2?"white":"black"}" data-go="${c.k}" style="--i:${i}" aria-label="${esc(c.n)}: open this section">
      <span class="bw-glass"></span><span class="bw-tex"></span><span class="bw-art" aria-hidden="true">${ART[c.art]}</span>
      <span class="bw-body">
        <span class="bw-top"><span class="bw-stage">${esc(c.ty)}</span><span class="bw-hp"><small>${esc(sl)}</small><b>${esc(sv)}</b><i class="bw-type"></i></span></span>
        <span class="bw-name">${esc(c.n)}${c.holo?"<em>ex</em>":""}</span>
        <span class="bw-gap"></span>
        <span class="bw-moves">${c.m.map((m,j)=>`<span class="bw-move"><span class="bw-mh">${cost(j+1)}<b>${esc(m[0])}</b><span class="bw-dmg">${esc(m[1](H))}</span></span><small>${esc(m[2])}</small></span>`).join("")}</span>
        <span class="bw-wrr"><span><small>Weakness</small>${esc(c.w[0])} ×2</span><span><small>Resistance</small>${esc(c.w[1])}</span><span><small>Retreat</small>${esc(c.w[2])}</span></span>
        <span class="bw-flavor">${esc(c.f)}</span>
        <span class="bw-foot"><span>Illus. ${esc(PROFILE.name)}</span><span>${esc(PROFILE.code)} · ${String(i+1).padStart(3,"0")}/${String(DECK.length).padStart(3,"0")} <em class="bw-rar" aria-label="Black White rare"><i></i><i></i></em></span></span>
      </span><span class="bw-sheen" aria-hidden="true"></span></button>`;}).join("");
}
/* home: greeting first, then the deck; wheel/swipe moves the cards sideways */
const HM={on:false,x:0,tx:0,max:0,raf:0,dealt:false,visits:0,timer:0,drag:null,moved:0};
function hmGreeting(){const h=new Date().getHours(); return h<5?"Still up":h<12?"Good morning":h<17?"Good afternoon":h<22?"Good evening":"Good night";}
function hmMeasure(){const r=document.getElementById("deck"), st=document.getElementById("hm-stage"); if(!r||!st) return; HM.max=Math.max(0,r.scrollWidth-st.clientWidth); HM.tx=Math.min(HM.max,Math.max(0,HM.tx));}
function homeMode(on){
  const hm=document.getElementById("hm"); if(!hm) return;
  document.documentElement.classList.toggle("on-home",on);
  clearTimeout(HM.timer);
  if(!on){HM.on=false; HM.dealt=false; hm.classList.remove("is-dealt","is-greeting"); cancelAnimationFrame(HM.raf); return;}
  HM.on=true; HM.visits++; HM.x=HM.tx=0; HM.dealt=false;
  document.getElementById("hm-hello").textContent=hmGreeting()+", "+PROFILE.first+". Welcome back to";
  const cur=curPhase(), days=daysTo(cur.start);
  document.getElementById("hm-line").textContent=TEXT.homeLine+" "+(d(cur.start)>today?`${cur.code.replace("PH ","Phase ")} · ${cur.name} starts in ${days} day${days===1?"":"s"}.`:`You're in ${cur.code.replace("PH ","Phase ")} · ${cur.name}.`)+` Your deck is being dealt…`;
  hm.classList.remove("is-dealt"); void hm.offsetWidth; hm.classList.add("is-greeting");
  HM.timer=setTimeout(()=>{hm.classList.remove("is-greeting"); hm.classList.add("is-dealt"); HM.dealt=true; requestAnimationFrame(hmMeasure);},5000);
  cancelAnimationFrame(HM.raf); HM.raf=requestAnimationFrame(hmTick);
}
function hmTick(){
  if(!HM.on) return;
  HM.x+=(HM.tx-HM.x)*(REDUCE?1:.11);
  const r=document.getElementById("deck"), st=document.getElementById("hm-stage");
  if(r&&st){ r.style.transform=`translate3d(${(-HM.x).toFixed(1)}px,0,0)`;
    const sr=st.getBoundingClientRect(), mid=sr.left+sr.width/2; let best=0,bd=1e9;
    [...r.children].forEach((c,i)=>{const cr=c.getBoundingClientRect(), cc=cr.left+cr.width/2, off=(cc-mid)/sr.width; if(Math.abs(cc-mid)<bd){bd=Math.abs(cc-mid); best=i;}
      if(HM.dealt&&!REDUCE){c.style.setProperty("--ry",(Math.max(-1,Math.min(1,off))*-26).toFixed(2)+"deg"); c.style.setProperty("--sc",(1-Math.min(1,Math.abs(off))*.14).toFixed(3)); c.style.setProperty("--sx",(50+off*120).toFixed(1)+"%");}});
    document.getElementById("hm-count").textContent=String(best+1).padStart(2,"0")+" / "+String(DECK.length).padStart(2,"0");
    document.getElementById("hm-prog").style.width=(HM.max?HM.x/HM.max*100:0).toFixed(1)+"%";
  }
  const u=scene.loopU?scene.loopU():0, sec=Math.floor(u*30); document.getElementById("hm-loop").textContent=`0:${String(sec).padStart(2,"0")} / 0:30`;
  HM.raf=requestAnimationFrame(hmTick);
}
const hmPush=dv=>{if(!HM.on||!HM.dealt) return; hmMeasure(); HM.tx=Math.min(HM.max,Math.max(0,HM.tx+dv));};
addEventListener("wheel",e=>{if(!HM.on) return; if(e.target.closest&&e.target.closest(".peek,.menu-overlay,.nav")) return; e.preventDefault(); const dv=(Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX)*(e.deltaMode===1?32:1); hmPush(dv*1.15);},{passive:false});
addEventListener("keydown",e=>{if(!HM.on||e.target.closest("input,textarea,select")) return; const step=(document.querySelector(".bw")?.getBoundingClientRect().width||300)+36;
  if(["ArrowDown","ArrowRight","PageDown"," "].includes(e.key)){e.preventDefault(); hmPush(step);} else if(["ArrowUp","ArrowLeft","PageUp"].includes(e.key)){e.preventDefault(); hmPush(-step);} else if(e.key==="Home"){HM.tx=0;} else if(e.key==="End"){hmMeasure(); HM.tx=HM.max;}});
addEventListener("touchstart",e=>{if(!HM.on) return; const t=e.touches[0]; HM.drag={x:t.clientX,y:t.clientY}; HM.moved=0;},{passive:true});
addEventListener("touchmove",e=>{if(!HM.on||!HM.drag) return; const t=e.touches[0], dx=HM.drag.x-t.clientX, dy=HM.drag.y-t.clientY; HM.drag={x:t.clientX,y:t.clientY}; HM.moved+=Math.abs(dx)+Math.abs(dy); e.preventDefault(); hmPush((Math.abs(dy)>Math.abs(dx)?dy:dx)*1.6);},{passive:false});
addEventListener("touchend",()=>{HM.drag=null;},{passive:true});
document.addEventListener("click",e=>{if(HM.on&&HM.moved>12&&e.target.closest(".bw")){e.stopPropagation(); e.preventDefault(); HM.moved=0;}},true);
addEventListener("resize",()=>{if(HM.on) hmMeasure();});

function renderLearn(){
  const out=TRACKS.filter(t=>!lTrack.value||t.k===lTrack.value).map(t=>{const rs=RES.filter(r=>r.track===t.k&&(!on(lFree)||r.cost==="Free")&&(!on(lPaid)||r.cost==="Paid")&&(!on(lBest)||r.best)); if(!rs.length) return "";
    return `<div class="res-group ph-${t.ph}"><h2>${esc(t.name)}</h2><p>${esc(t.lead)}</p><div class="res-grid">${rs.map(r=>`<article class="res glass ph-${t.ph}"><div class="tags">${r.best?'<span class="tag best">★ Best pick</span>':""}<span class="tag ${r.cost==="Free"?"free":"paid"}">${r.cost}</span><span class="tag">${esc(r.kind)}</span></div><h3><a href="${r.url}" target="_blank" rel="noopener">${esc(r.title)}</a></h3><div class="by">${esc(r.by)}</div><p>${esc(r.why)}</p><div class="when">${esc(r.when)}</div></article>`).join("")}</div></div>`;}).join("");
  document.getElementById("learn").innerHTML=out||`<div class="note glass">No materials match these filters.</div>`;
}

function renderCred(){
  document.getElementById("cred").innerHTML=CREDS.map(t=>`<div class="tier"><div class="tier-h"><h2>${t.tier}</h2><span>${esc(t.lead)}</span></div><div class="cred-grid">${t.items.map(c=>`<article class="cred glass"><h3><a href="${c.url}" target="_blank" rel="noopener" style="text-decoration:none">${esc(c.name)} ↗</a></h3><dl><dt>By</dt><dd>${esc(c.by)}</dd><dt>Evaluated</dt><dd>${esc(c.how)}</dd><dt>When</dt><dd>${esc(c.when)}</dd><dt>Cost</dt><dd>${esc(c.cost)}</dd><dt>Value</dt><dd><span class="value" role="img" aria-label="Value ${c.val} of 5">${[1,2,3,4,5].map(n=>`<i class="${n<=c.val?"on":""}"></i>`).join("")}</span></dd></dl><p style="margin:0;font-size:14px;color:var(--muted)">${esc(c.why)}</p></article>`).join("")}</div></div>`).join("")+(TEXT.credNote?`<div class="note glass">${TEXT.credNote}</div>`:"");
}

function renderPort(){
  const {links:CHL,channels:ch,readme:tpl,docs:cv}=PORT;
  document.getElementById("port").innerHTML=`<div class="chan-grid">${ch.map(c=>`<article class="chan glass"><span class="k">${c.k}</span><h3>${c.h}</h3><ul>${c.li.map(x=>`<li>${esc(x)}</li>`).join("")}</ul><div class="lks">${(CHL[c.h]||[]).map(([t,u])=>`<a class="lk" href="${u}" target="_blank" rel="noopener">${esc(t)} ↗</a>`).join("")}</div><div class="cad">${esc(c.cad)}</div></article>`).join("")}</div>
  <div class="sec-h"><h2>README template</h2><small>Copy into every project repo</small></div><pre class="tpl glass">${esc(tpl)}</pre>
  <div class="sec-h"><h2>Application documents</h2><small>What turns the portfolio into an offer</small></div><div class="cv-grid">${cv.map(([a,b])=>`<div class="cv glass"><b>${a}</b><span>${esc(b)}</span></div>`).join("")}</div>`;
}

function renderApply(){
  const {countries:C,timeline:T}=APPLY;
  document.getElementById("apply").innerHTML=`<div class="country-grid">${C.map(c=>`<article class="country glass ph-${c.ph}"><div class="flagline"><h3>${c.n}</h3><span class="role">${c.role}</span></div><ul>${c.li.map(x=>`<li>${x}</li>`).join("")}</ul><div class="uni">${esc(c.uni)}</div><div class="tags">${c.links.map(([a,u])=>`<a class="tag" href="${u}" target="_blank" rel="noopener" style="text-decoration:none">${esc(a)} ↗</a>`).join("")}</div></article>`).join("")}</div>
  <div class="sec-h"><h2>Application timeline</h2><small>Diamond markers are hard deadlines</small></div>
  <div class="timeline glass">${T.map(([w,t,id,ph,h])=>`<div class="tl ph-${ph} ${h?"hard":""}" data-open="${id}" style="cursor:pointer"><span class="d">${w}</span><span class="m"></span><span class="t"><b>${esc(t)}</b><span>${id} · ${STATUS[st(id)]}</span></span></div>`).join("")}</div>`;
}

const peek=document.getElementById("peek"), scrim=document.getElementById("scrim"), ta=document.getElementById("pk-notes");
let openId=null, noteTimer=null;
function openPeek(id){const i=BY[id]; if(!i) return; openId=id;
  document.getElementById("pk-id").textContent=i.id; document.getElementById("pk-title").textContent=i.title; document.getElementById("pk-links").innerHTML=linkList(id); document.getElementById("pk-learn").hidden=!linksOf(id).length;
  document.getElementById("pk-phase").textContent=`${PH[i.phase].code} · ${PH[i.phase].name}`;
  const tg=document.getElementById("pk-target"); tg.textContent=i.target; tg.className=isLate(i)?"due late":"";
  document.getElementById("pk-star").textContent=i.star?"★ Never cut":"Can be cut if behind";
  document.getElementById("pk-desc").textContent=i.desc; fillPeek();
  ta.value=prog[id]?.notes||""; ta.readOnly=!canWrite; document.getElementById("pk-saved").textContent="";
  peek.hidden=false; scrim.hidden=false; document.getElementById("pk-close").focus();}
function fillPeek(){if(!openId) return; const s=document.getElementById("pk-status"), r=document.getElementById("pk-review");
  s.innerHTML=STATUS.map((o,i)=>`<option value="${i}">${o}</option>`).join(""); s.value=st(openId); s.className="pill s-"+st(openId); s.dataset.kind="s"; s.dataset.id=openId; s.disabled=!canWrite;
  r.innerHTML=REVIEW.map((o,i)=>`<option value="${i}">${o}</option>`).join(""); r.value=rv(openId); r.className="pill r-"+rv(openId); r.dataset.kind="r"; r.dataset.id=openId; r.disabled=!canWrite;}
function closePeek(){flushNotes(); openId=null; hideAnimated(peek); hideAnimated(scrim);}
document.getElementById("pk-close").addEventListener("click",closePeek); scrim.addEventListener("click",closePeek);
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ if(!peek.hidden) closePeek(); if(!overlay.hidden) hideAnimated(overlay); }
  if((e.key==="Enter"||e.key===" ")&&e.target.dataset&&e.target.dataset.open&&!e.target.matches("select")){e.preventDefault(); openPeek(e.target.dataset.open);} });
document.addEventListener("click",e=>{ if(e.target.closest("select,a")) return; const o=e.target.closest("[data-open]"); if(o&&!peek.contains(o)) openPeek(o.dataset.open);});
ta.addEventListener("input",()=>{document.getElementById("pk-saved").textContent="Typing…"; clearTimeout(noteTimer); noteTimer=setTimeout(flushNotes,900);});
function flushNotes(){clearTimeout(noteTimer); if(!openId||!canWrite) return; const v=ta.value; if((prog[openId]?.notes||"")===v) return; write(openId,{notes:v}); document.getElementById("pk-saved").textContent="Saved";}

function renderAll(){renderDeck(); renderBooks(); renderParts(); renderMission(); renderTracker(); renderStats(); renderBoard(); renderPlan(); renderApply(); renderSkills(); renderDaily&&renderDaily(); if(openId&&!peek.hidden) fillPeek();}
function setSync(onl,text){document.getElementById("syncdot").className="dot"+(onl?" on":""); document.getElementById("synctext").textContent=text;}
function applyReadOnly(){document.getElementById("readonly").hidden=canWrite; renderAll();}

const SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', MOON='<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
const root=document.documentElement;
const currentTheme=()=>root.getAttribute("data-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
function paintToggle(){const dark=currentTheme()==="dark"; document.getElementById("mode-icon").innerHTML=dark?SUN:MOON; document.getElementById("mode-text").textContent=dark?"Light":"Dark"; document.getElementById("mode").setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode"); scene.recolor&&scene.recolor();}
{let t=null; try{t=localStorage.getItem(PROFILE.key+"-theme");}catch(e){} root.setAttribute("data-theme",t==="light"?"light":"dark");}
document.getElementById("mode").addEventListener("click",()=>{const n=currentTheme()==="dark"?"light":"dark"; root.setAttribute("data-theme",n); try{localStorage.setItem(PROFILE.key+"-theme",n);}catch(e){} paintToggle();});
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",paintToggle);}catch(e){}


/* ---------- editorial behaviour ---------- */
const legsEl=document.getElementById("legs");
document.getElementById("m-prev").addEventListener("click",()=>legsEl.scrollBy({left:-legsEl.clientWidth*.8,behavior:REDUCE?"auto":"smooth"}));
document.getElementById("m-next").addEventListener("click",()=>legsEl.scrollBy({left:legsEl.clientWidth*.8,behavior:REDUCE?"auto":"smooth"}));
document.addEventListener("click",e=>{const g=e.target.closest("[data-go]"); if(g) show(g.dataset.go);});
document.getElementById("foot-nav").innerHTML=VIEWS.map(([k,n])=>`<button type="button" data-go="${k}">${n}</button>`).join("");
document.getElementById("to-top").addEventListener("click",()=>window.scrollTo({top:0,behavior:REDUCE?"auto":"smooth"}));
// scroll reveals: only elements below the first screen start hidden
let io=null;
function armReveals(root){
  if(REDUCE||!("IntersectionObserver" in window)) return;
  if(!io) io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove("pre"); io.unobserve(en.target);}}),{rootMargin:"0px 0px -8% 0px"});
  root.querySelectorAll(".rv").forEach(el=>{ if(el.getBoundingClientRect().top>innerHeight*.92){el.classList.add("pre"); io.observe(el);} });
}
window.armReveals=armReveals;
// loader
(function(){const L=document.getElementById("loader"), P=document.getElementById("loader-pct"); if(!L) return;
  if(REDUCE){L.remove(); return;}
  let p=0; const mark=L.querySelector(".mark");
  const tick=setInterval(()=>{p=Math.min(100,p+Math.ceil(Math.random()*9)); P.textContent=p+"%"; mark.style.setProperty("--p",p+"%"); if(p>=100){clearInterval(tick); setTimeout(()=>{L.classList.add("done"); setTimeout(()=>L.remove(),800);},180);}},45);
})();


/* ---------- scroll parallax for page layers ---------- */
(function(){ if(REDUCE) return;
  const sel=".jj-hero .name,.big-line,.statement p,.manifesto,.moment .mnum,.shot .frame b,.carousel-head h2,.view-head h1,.dom > h2,.res-group > h2";
  let ticking=false;
  function run(){ ticking=false; const vh=innerHeight;
    document.querySelectorAll(".view:not([hidden]) :is("+sel+")").forEach(el=>{
      const r=el.getBoundingClientRect(); if(r.bottom<-200||r.top>vh+200) return;
      const off=(r.top+r.height/2-vh/2)/vh; // -1..1 around screen centre
      const k=el.matches(".big-line,.jj-hero .name")?-60:el.matches(".mnum,.shot .frame b")?-40:-24;
      const x=el.matches(".big-line")?off*-40:0;
      el.style.transform=`translate3d(${x.toFixed(1)}px,${(off*k).toFixed(1)}px,0)`; el.dataset.par="";
    });
    document.querySelectorAll(".view:not([hidden]) .shot .frame").forEach(f=>{const r=f.getBoundingClientRect(); f.style.setProperty("--py",((r.top-innerHeight/2)*-.15).toFixed(1)+"px");});
  }
  const req=()=>{ if(!ticking){ticking=true; requestAnimationFrame(run);} };
  addEventListener("scroll",req,{passive:true}); addEventListener("resize",req);
  window.parallaxRefresh=req; setTimeout(req,50);
})();


/* ---------- tracker statistic + goals ---------- */
function renderStats(){
  const g=document.getElementById("goals"); if(!g) return;
  const tracks=MAIN.filter(p=>{const n=today; return true;});
  const cur=MAIN.findIndex(p=>d(p.start)<=today&&today<=d(p.end)); const startIx=Math.max(0,cur<0?MAIN.findIndex(p=>d(p.start)>today):cur);
  const pick=MAIN.slice(startIx,startIx+4).length===4?MAIN.slice(startIx,startIx+4):MAIN.slice(-4);
  g.innerHTML=pick.map(p=>{const its=phaseItems(p.k).filter(countable), dn=its.filter(i=>st(i.id)===2).length, pct=its.length?Math.round(dn/its.length*100):0;
    return `<button type="button" class="goal glass ph-${p.k}" data-phase="${p.k}"><b>${pct}%</b><div class="tbar" role="img" aria-label="${pct}% done"><i style="width:${pct}%"></i></div><span>${esc(p.name)} · ${dn}/${its.length}</span></button>`;}).join("");
  // monthly cumulative series
  const months=[]; for(let y=2026,m=9;y<2029||(y===2029&&m<=6);m++){if(m>11){m=0;y++;} months.push([y,m]); if(y===2029&&m===6) break;}
  const counted=ITEMS.filter(countable), N=Math.max(1,counted.length);
  const endOf=([y,m])=>new Date(y,m+1,0);
  const rows=months.map(ym=>{const e=endOf(ym); const plan=counted.filter(i=>d(i.due)<=e).length/N*100; const done=e<=new Date(today.getFullYear(),today.getMonth()+1,0)?counted.filter(i=>st(i.id)===2&&d(i.due)<=e).length/N*100:null; return {ym,plan,done};});
  const W=640,H=230,L=34,R=10,T=14,B=26, x=i=>L+i*(W-L-R)/(rows.length-1), yv=v=>T+(1-v/100)*(H-T-B);
  const smooth=pts=>{if(pts.length<2) return ""; let p=`M${pts[0][0]},${pts[0][1]}`; for(let i=0;i<pts.length-1;i++){const [x0,y0]=pts[Math.max(0,i-1)],[x1,y1]=pts[i],[x2,y2]=pts[i+1],[x3,y3]=pts[Math.min(pts.length-1,i+2)]; p+=` C${x1+(x2-x0)/6},${y1+(y2-y0)/6} ${x2-(x3-x1)/6},${y2-(y3-y1)/6} ${x2},${y2}`;} return p;};
  const P=rows.map((r,i)=>[x(i),yv(r.plan)]), D=rows.map((r,i)=>r.done==null?null:[x(i),yv(r.done)]).filter(Boolean);
  const MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ticks=rows.map((r,i)=>r.ym[1]===0||i===0?`<text x="${x(i)}" y="${H-6}" text-anchor="middle" font-size="11" fill="var(--faint)">${r.ym[1]===0?r.ym[0]:MN[r.ym[1]]+" '"+String(r.ym[0]).slice(2)}</text>`:"").join("");
  const grid=[0,50,100].map(v=>`<line x1="${L}" x2="${W-R}" y1="${yv(v)}" y2="${yv(v)}" stroke="var(--line)"/><text x="${L-8}" y="${yv(v)+4}" text-anchor="end" font-size="11" fill="var(--faint)">${v}%</text>`).join("");
  const ti=rows.findIndex(r=>r.ym[0]===today.getFullYear()&&r.ym[1]===today.getMonth());
  const nowLine=ti>=0?`<line x1="${x(ti)}" x2="${x(ti)}" y1="${T}" y2="${H-B}" stroke="var(--line-strong)" stroke-dasharray="3 4"/>`:"";
  const last=D.at(-1);
  document.getElementById("chart").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Planned versus done, cumulative share of items by month">${grid}${nowLine}<path d="${smooth(P)}" fill="none" stroke="var(--faint)" stroke-width="2" stroke-dasharray="5 5"/><path d="${smooth(D)}" fill="none" stroke="var(--accent)" stroke-width="2.5"/>${last?`<circle cx="${last[0]}" cy="${last[1]}" r="5" fill="var(--accent)" stroke="var(--bg)" stroke-width="2"/>`:""}${ticks}<line id="xh" x1="0" x2="0" y1="${T}" y2="${H-B}" stroke="var(--fg)" stroke-opacity=".25" visibility="hidden"/><rect x="${L}" y="${T}" width="${W-L-R}" height="${H-T-B}" fill="transparent" id="hit"/></svg><div class="tip" id="tip"></div>`;
  const svg=document.querySelector("#chart svg"), tip=document.getElementById("tip"), xh=document.getElementById("xh");
  const hitMove=e=>{const r=svg.getBoundingClientRect(); const px=(e.clientX-r.left)/r.width*W; const i=Math.max(0,Math.min(rows.length-1,Math.round((px-L)/((W-L-R)/(rows.length-1))))); const row=rows[i];
    xh.setAttribute("x1",x(i)); xh.setAttribute("x2",x(i)); xh.setAttribute("visibility","visible");
    tip.innerHTML=`<b>${MN[row.ym[1]]} ${row.ym[0]}</b>Planned ${row.plan.toFixed(0)}%${row.done!=null?` · Done ${row.done.toFixed(0)}%`:""}`; tip.style.left=(x(i)/W*100)+"%"; tip.style.top=(yv(row.plan)/H*100)+"%"; tip.style.opacity=1;};
  document.getElementById("hit").addEventListener("pointermove",hitMove);
  document.getElementById("hit").addEventListener("pointerleave",()=>{tip.style.opacity=0; xh.setAttribute("visibility","hidden");});
}
document.addEventListener("click",e=>{const b=e.target.closest(".goal[data-phase]"); if(b){fPhase.value=b.dataset.phase; renderTracker();}});

/* WebGL flight scene */
scene=(function(){
  const api={}; const canvas=document.getElementById("scene");
  if(!window.THREE){canvas.hidden=true; return api;}
  let renderer; try{renderer=new THREE.WebGLRenderer({canvas,antialias:true});}catch(e){canvas.hidden=true; return api;}
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  const S=new THREE.Scene(), cam=new THREE.PerspectiveCamera(55,1,0.1,400);
  S.fog=new THREE.Fog(0x000000,28,130);
  const css=n=>getComputedStyle(root).getPropertyValue(n).trim();
  const col=n=>{const c=new THREE.Color(); const v=css(n); try{ if(v) c.set(v.startsWith("rgba")?v.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/,"rgb($1,$2,$3)"):v);}catch(e){} return c;};
  const P=[[-60,6,10],[-40,10,-6],[-20,4,8],[0,12,-4],[20,6,10],[40,14,-8],[60,8,6]].map(a=>new THREE.Vector3(...a));
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-82,4,0),...P,new THREE.Vector3(82,10,0)]);
  const pathMat=new THREE.LineDashedMaterial({dashSize:1.2,gapSize:.9,transparent:true,opacity:.5});
  const path=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(600)),pathMat); path.computeLineDistances(); S.add(path);
  const ringVars=["--accent","--blue","--good","--crit","--accent","--blue","--good"];
  const rings=P.map((p,i)=>{const g=new THREE.Group(); const m=new THREE.MeshBasicMaterial({transparent:true,opacity:.85}); const m2=new THREE.MeshBasicMaterial({transparent:true,opacity:.3});
    g.add(new THREE.Mesh(new THREE.TorusGeometry(3.2,.08,8,80),m), new THREE.Mesh(new THREE.TorusGeometry(3.9,.03,6,80),m2));
    g.position.copy(p); const t=curve.getTangent((i+1)/(P.length+1)); g.lookAt(p.clone().add(t)); S.add(g); return {g,m,m2,v:ringVars[i]};});
  const grid=new THREE.GridHelper(400,100); grid.position.y=-6; grid.material.transparent=true; grid.material.opacity=.18; S.add(grid);
  const N=reduce?500:1400, pos=new Float32Array(N*3); for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*260;pos[i*3+1]=Math.random()*60-4;pos[i*3+2]=(Math.random()-.5)*160;}
  const pg=new THREE.BufferGeometry(); pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
  const pm=new THREE.PointsMaterial({size:.18,transparent:true,opacity:.6}); const pts=new THREE.Points(pg,pm); S.add(pts);
  const drone=new THREE.Group(); const lineMat=new THREE.LineBasicMaterial(); const fillMat=new THREE.MeshBasicMaterial({transparent:true,opacity:.2});
  const addEdges=(geo,x=0,y=0,z=0,ry=0)=>{const m=new THREE.Mesh(geo,fillMat); m.position.set(x,y,z); m.rotation.y=ry; const e=new THREE.LineSegments(new THREE.EdgesGeometry(geo),lineMat); e.position.copy(m.position); e.rotation.copy(m.rotation); drone.add(m,e);};
  addEdges(new THREE.BoxGeometry(1.1,.32,1.1)); addEdges(new THREE.BoxGeometry(3.6,.08,.16),0,0,0,Math.PI/4); addEdges(new THREE.BoxGeometry(3.6,.08,.16),0,0,0,-Math.PI/4);
  const props=[]; const propMat=new THREE.MeshBasicMaterial({transparent:true,opacity:.5,side:THREE.DoubleSide});
  [[1.27,1.27],[-1.27,1.27],[1.27,-1.27],[-1.27,-1.27]].forEach(([x,z])=>{const ring=new THREE.Mesh(new THREE.RingGeometry(.15,.62,24),propMat); ring.rotation.x=-Math.PI/2; ring.position.set(x,.14,z); drone.add(ring); const blade=new THREE.Mesh(new THREE.BoxGeometry(1.2,.02,.08),fillMat); blade.position.set(x,.16,z); drone.add(blade); props.push(blade);});
  drone.scale.setScalar(1.2); S.add(drone);
  api.recolor=()=>{const bg=col("--bg"), fg=col("--fg"); renderer.setClearColor(bg,1); S.fog.color.copy(bg);
    pathMat.color.copy(fg); pm.color.copy(fg); grid.material.color=col("--faint"); lineMat.color.copy(fg); fillMat.color.copy(col("--accent")); propMat.color.copy(col("--accent"));
    rings.forEach(r=>{const c=col(r.v); r.m.color.copy(c); r.m2.color.copy(c);});
    const dark=currentTheme()==="dark"; pm.opacity=dark?.6:.35; pathMat.opacity=dark?.5:.42; grid.material.opacity=dark?.16:.24; if(reduce) draw();};
  const curIdx=(()=>{const i=MAIN.findIndex(p=>d(p.start)<=today&&today<=d(p.end)); if(i>=0) return i; const n=MAIN.findIndex(p=>d(p.start)>today); return n<0?6:n;})();
  const VIEWT={daily:.23,console:.97,tracker:.18,board:.28,plan:.38,learn:.48,books:.515,parts:.545,cred:.575,skills:.66,community:.74,port:.83,apply:.93};
  const home=(curIdx+1)/(P.length+1);
  let targetT=home, t=home, roam=true, clock=0;
  let boost=0, currentViewKey="home", loopMode=true, lastU=0, loopU=0; const LOOP=30;
  api.loopU=()=>loopU; api.setView=v=>{currentViewKey=v; roam=v==="mission"; loopMode=v==="home"; if(!loopMode) canvas.style.opacity=""; targetT=roam?home:loopMode?t:VIEWT[v]; boost=1; if(reduce){t=targetT; place(1); draw();}};
  const mouse={x:0,y:0}; addEventListener("pointermove",e=>{mouse.x=e.clientX/innerWidth-.5; mouse.y=e.clientY/innerHeight-.5;},{passive:true});
  function resize(){const w=innerWidth,h=innerHeight; renderer.setSize(w,h,false); cam.aspect=w/h; cam.updateProjectionMatrix(); if(reduce) draw();}
  const camPos=new THREE.Vector3(), look=new THREE.Vector3(), up=new THREE.Vector3(0,1,0);
  let lastSY=window.scrollY, vel=0, spS=0;
  function place(dt){
    const maxS=Math.max(1,document.documentElement.scrollHeight-innerHeight), sp=Math.min(1,Math.max(0,window.scrollY/maxS));
    const loop=loopMode; let u=0, wrapped=false;
    if(loop){u=(clock%LOOP)/LOOP; loopU=u; wrapped=u<lastU; lastU=u; spS=u;} else spS+=(sp-spS)*(reduce?1:Math.min(1,dt*4));
    const dy=window.scrollY-lastSY; lastSY=window.scrollY; vel+=((dt>0?dy/dt:0)-vel)*Math.min(1,dt*6); const v=loop?Math.sin(u*Math.PI*6)*.25:Math.max(-1,Math.min(1,vel/2500));
    // scroll flies the drone along its path: the home page spans the whole route, other pages a stretch around their waypoint
    if(loop){const e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2; targetT=.03+.94*e; t=targetT;}
    else if(roam) targetT=Math.max(.04,home-.06)+spS*Math.min(.9,.95-home+.06)+(reduce?0:Math.sin(clock*.6)*.015);
    else targetT=VIEWT[currentViewKey]+(spS-.5)*.14;
    boost=Math.max(0,boost-dt*.7); const ease=1.6+boost*2.6; if(!loop) t+=(targetT-t)*(reduce?1:Math.min(1,dt*ease)); t=Math.min(.985,Math.max(.015,t));
    const p=curve.getPointAt(t), tan=curve.getTangentAt(t);
    drone.position.copy(p); drone.position.y+=Math.sin(clock*3)*.15;
    drone.lookAt(p.clone().add(new THREE.Vector3(tan.x,0,tan.z))); drone.rotateZ(-tan.y*.6); drone.rotateX(v*.45);
    const side=new THREE.Vector3().crossVectors(tan,up).normalize();
    // camera orbits the drone as you scroll
    const a=loop?u*Math.PI*2-.35:spS*Math.PI*1.1-.35, near=!loop&&roam&&window.scrollY<innerHeight*.8?1:0, dist=(loop?10+3*Math.sin(u*Math.PI*4):near?8:15)*(innerWidth<innerHeight?1.7:innerWidth<900?1.3:1);
    const dir=side.clone().multiplyScalar(Math.cos(a)).addScaledVector(tan,-Math.sin(a)).normalize();
    camPos.copy(p).addScaledVector(dir,dist); camPos.y+=(near?2.5:5)+Math.sin(spS*Math.PI)*6-mouse.y*4; camPos.addScaledVector(tan,mouse.x*5);
    drone.scale.setScalar(drone.scale.x+((loop?1.6:1.2)-drone.scale.x)*Math.min(1,dt*2));
    if(loop) cam.setViewOffset(innerWidth,innerHeight,0,-innerHeight*.33,innerWidth,innerHeight); else if(cam.view&&cam.view.enabled) cam.clearViewOffset();
    if(loop) canvas.style.opacity=String(Math.max(0,Math.min(1,u>.965?(1-u)/.035:u<.025?u/.025:1)));
    if(reduce||wrapped){cam.position.copy(camPos); look.copy(p);} else {cam.position.lerp(camPos,Math.min(1,dt*1.8)); look.lerp(p,Math.min(1,dt*2.2));}
    cam.lookAt(look);
    // depth layers move at different speeds
    pts.position.y=-spS*30; pts.position.x=-spS*20; grid.position.z=(spS*60)%4; grid.position.y=-6-spS*3;
    rings.forEach((r,i)=>{r.g.rotation.z=spS*Math.PI*(i%2?1:-1)*.6; r.g.scale.setScalar(i===curIdx&&!reduce?1+Math.sin(clock*4)*.05:1); r.m.opacity=i===curIdx?1:.65;});
  }
  const draw=()=>renderer.render(S,cam);
  if(reduce) addEventListener("scroll",()=>{place(1);draw();},{passive:true});
  addEventListener("resize",resize); resize(); api.recolor();
  cam.position.set(home*0,10,30); place(1); cam.position.copy(camPos); look.copy(drone.position); cam.lookAt(look); draw();
  { let last=performance.now(), running=!document.hidden;
    const frame=now=>{ if(!running) return; const dt=Math.min(.05,(now-last)/1000); last=now; if(reduce&&!loopMode){requestAnimationFrame(frame); return;} clock+=dt; props.forEach((b,i)=>b.rotation.y+=dt*(i%2?-38:38)); pts.rotation.y+=dt*.004; place(dt); draw(); requestAnimationFrame(frame); };
    document.addEventListener("visibilitychange",()=>{running=!document.hidden; if(running){last=performance.now(); requestAnimationFrame(frame);}});
    requestAnimationFrame(frame);
  }
  return api;
})();

/* =====================================================================
   DAILY TRACKER · CONSOLE · GIST SYNC · MIDNIGHT REFRESH
   ===================================================================== */
const DKEY=PROFILE.key+"-daily", CKEY=PROFILE.key+"-custom", GKEY=PROFILE.key+"-gist";
const iso=dt=>{const z=n=>String(n).padStart(2,"0"); return dt.getFullYear()+"-"+z(dt.getMonth()+1)+"-"+z(dt.getDate());};
const addDays=(dt,n)=>{const x=new Date(dt); x.setDate(x.getDate()+n); return x;};
const hm2m=s=>{const [h,m]=String(s||"0:0").split(":").map(Number); return (h||0)*60+(m||0);};
const m2hm=m=>String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");

/* ---------- fill personal text from data ---------- */
document.querySelectorAll("[data-t]").forEach(el=>{const v=TEXT[el.dataset.t]; if(v!=null) el.innerHTML=v;});
(function(){const h=document.getElementById("hm-name"); if(!h) return; const w=(PROFILE.titleWords||[PROFILE.title]).filter(Boolean); let n=0;
  h.setAttribute("aria-label",PROFILE.title||w.join(" ")); h.dataset.text=w.join("\n");
  h.innerHTML=w.map((word,i)=>`<span class="hm-w${i?" j":""}">${[...word].map(ch=>`<span style="--l:${n++}">${esc(ch)}</span>`).join("")}</span>`).join("");})();

/* ---------- daily data: {"YYYY-MM-DD":{s:{slotIndex:activityIndex},u:timestamp}} ---------- */
let daily={};
try{const v=JSON.parse(localStorage.getItem(DKEY)||"null"); if(v&&typeof v==="object") daily=v;}catch(e){}
let dailyTimer=null;
function saveDaily(){
  try{localStorage.setItem(DKEY,JSON.stringify(daily));}catch(e){}
  if(mode==="db"&&store&&canWrite){clearTimeout(dailyTimer); dailyTimer=setTimeout(()=>{store.doc("daily/state").set({days:daily,updated:new Date().toISOString()}).catch(()=>setSync(false,"Save failed"));},600);}
  markDirty();
}
const slotMin=()=>Math.max(5,+DAILY.slot||30);
const slotCount=()=>Math.max(1,Math.floor((hm2m(DAILY.to)-hm2m(DAILY.from))/slotMin()));
const slotsOf=k=>Object.keys((daily[k]||{}).s||{}).length;
const hoursOf=k=>slotsOf(k)*slotMin()/60;
const targetOf=dt=>+(DAILY.targets||[])[dt.getDay()]||0;
function pctOf(dt){const k=iso(dt), h=hoursOf(k), t=targetOf(dt); if(!t) return h>0?100:null; return Math.round(h/t*100);}
function planFor(dt){ // {slotIndex:activityIndex}
  const out={}, base=hm2m(DAILY.from), sm=slotMin(), acts=DAILY.acts||[];
  ((DAILY.plan||[])[dt.getDay()]||[]).forEach(line=>{const m=String(line).match(/^\s*(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})\s*(.*)$/); if(!m) return;
    let a=acts.findIndex(x=>x[0].toLowerCase()===m[3].trim().toLowerCase()); if(a<0) a=0;
    for(let t=hm2m(m[1]);t<hm2m(m[2]);t+=sm){const i=Math.floor((t-base)/sm); if(i>=0&&i<slotCount()) out[i]=a;}});
  return out;
}
const weekStartOf=dt=>{const ws=+PROFILE.weekStart||0; const x=new Date(dt); x.setHours(0,0,0,0); x.setDate(x.getDate()-((x.getDay()-ws+7)%7)); return x;};
let dlWeek=weekStartOf(today), dlBrush=0, dlRange="week", dlPaint=null;
const DN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], MN=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const isoWeek=dt=>{const x=new Date(Date.UTC(dt.getFullYear(),dt.getMonth(),dt.getDate())); const n=x.getUTCDay()||7; x.setUTCDate(x.getUTCDate()+4-n); const y0=new Date(Date.UTC(x.getUTCFullYear(),0,1)); return Math.ceil(((x-y0)/864e5+1)/7);};
const actColor=a=>((DAILY.acts||[])[a]||["","var(--accent)"])[1];

function renderDaily(){
  const grid=document.getElementById("dl-grid"); if(!grid) return;
  const days=[...Array(7)].map((_,i)=>addDays(dlWeek,i)), n=slotCount(), base=hm2m(DAILY.from), sm=slotMin();
  document.getElementById("dl-wk").textContent="Week "+isoWeek(addDays(dlWeek,3));
  const e=days[6]; document.getElementById("dl-range").textContent=`${dlWeek.getDate()} ${MN[dlWeek.getMonth()]} – ${e.getDate()} ${MN[e.getMonth()]} ${e.getFullYear()}`;
  document.getElementById("dl-today").disabled=+dlWeek===+weekStartOf(today);
  document.getElementById("dl-brushes").innerHTML=(DAILY.acts||[]).map(([nm,c],i)=>`<button type="button" class="dl-brush" role="radio" aria-checked="${i===dlBrush}" data-b="${i}" style="--c:${esc(c)}"><i></i>${esc(nm)}</button>`).join("");
  const plans=days.map(planFor);
  let h=`<div class="dl-corner"></div>`+days.map(dt=>{const now=+dt===+today; return `<div class="dl-dh${now?" now":""}" role="columnheader"><b>${DN[dt.getDay()]}</b><span>${dt.getDate()}</span></div>`;}).join("");
  for(let r=0;r<n;r++){
    const t=base+r*sm, lbl=t%60===0?m2hm(t):"";
    h+=`<div class="dl-t${t%60===0?" hr":""}" role="rowheader">${lbl}</div>`;
    days.forEach((dt,c)=>{const k=iso(dt), a=((daily[k]||{}).s||{})[r], p=plans[c][r], fut=dt>today;
      h+=`<button type="button" class="dl-c${a!=null?" on":""}${p!=null?" plan":""}${t%60===0?" hr":""}${+dt===+today?" now":""}" data-d="${k}" data-r="${r}" ${fut||!canWrite?"disabled":""} style="${a!=null?`--c:${esc(actColor(a))};`:""}${p!=null?`--p:${esc(actColor(p))}`:""}" aria-pressed="${a!=null}" aria-label="${DN[dt.getDay()]} ${dt.getDate()} ${MN[dt.getMonth()]}, ${m2hm(t)}${a!=null?", "+esc((DAILY.acts[a]||["Done"])[0]):""}${p!=null?" (planned)":""}"></button>`;});
  }
  grid.style.setProperty("--rows",n); grid.innerHTML=h;
  renderDailyScore(days); renderDailyChart(); renderDailyYear();
}
function renderDailyScore(days){
  let th=0,tt=0;
  document.getElementById("dl-score").innerHTML=`<table class="dl-tab"><thead><tr><th>Day</th><th>Hours</th><th>%</th></tr></thead><tbody>${days.map(dt=>{const k=iso(dt), hrs=hoursOf(k), t=targetOf(dt), p=pctOf(dt), fut=dt>today; th+=hrs; tt+=t;
    const cls=p==null?"":p>=100?"full":p>=50?"half":"low";
    return `<tr class="${+dt===+today?"now":""}${fut?" fut":""}"><td><b>${DN[dt.getDay()]}</b><small>${dt.getDate()} ${MN[dt.getMonth()]}</small></td><td class="mono">${hrs.toFixed(1)}<small>/${t}</small></td><td><span class="dl-pct ${cls}">${fut?"–":p==null?"rest":p+"%"}</span><span class="dl-mbar"><i style="height:${Math.min(100,p||0)}%"></i></span></td></tr>`;}).join("")}</tbody></table>`;
  const wp=tt?Math.round(th/tt*100):0;
  document.getElementById("dl-weektot").innerHTML=`<div class="dl-vbar" role="img" aria-label="Week ${wp}% of target"><i style="height:${Math.min(100,wp)}%"></i></div><div><small>This week</small><b>${wp}%</b><span>${th.toFixed(1)} of ${tt} h</span></div>`;
}
function seriesFor(range){
  const pts=[];
  if(range==="year"){ // weekly averages for the last 52 weeks
    let w=weekStartOf(addDays(today,-7*51));
    for(let i=0;i<52;i++,w=addDays(w,7)){let th=0,tt=0; for(let j=0;j<7;j++){const dt=addDays(w,j); if(dt>today) break; th+=hoursOf(iso(dt)); tt+=targetOf(dt);}
      pts.push({x:w,y:tt?Math.round(th/tt*100):(th?100:null),lab:`Week ${isoWeek(addDays(w,3))} · ${w.getDate()} ${MN[w.getMonth()]}`,h:th});}
  } else {
    const start=range==="week"?dlWeek:addDays(today,-29), len=range==="week"?7:30;
    for(let i=0;i<len;i++){const dt=addDays(start,i); pts.push({x:dt,y:dt>today?undefined:pctOf(dt),lab:`${DN[dt.getDay()]} ${dt.getDate()} ${MN[dt.getMonth()]}`,h:hoursOf(iso(dt))});}
  }
  return pts;
}
function renderDailyChart(){
  const host=document.getElementById("dl-plot"); if(!host) return;
  const pts=seriesFor(dlRange), W=Math.max(320,host.clientWidth||900), Hh=dlRange==="week"?260:240, P={l:44,r:16,t:16,b:30};
  const vals=pts.filter(p=>p.y!=null&&p.y!==undefined).map(p=>p.y), ymax=Math.max(100,Math.ceil(Math.max(0,...vals)/25)*25);
  const X=i=>P.l+(pts.length===1?0:i*(W-P.l-P.r)/(pts.length-1)), Y=v=>P.t+(1-v/ymax)*(Hh-P.t-P.b);
  const sub={week:"Daily score this week",month:"Daily score, last 30 days",year:"Weekly score, last 52 weeks"}[dlRange];
  const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
  document.getElementById("dl-chart-sub").textContent=`${sub} · average ${avg}%`;
  let path="", seg=false; pts.forEach((p,i)=>{if(p.y==null){seg=false; return;} path+=(seg?"L":"M")+X(i).toFixed(1)+" "+Y(p.y).toFixed(1); seg=true;});
  const ticks=[]; for(let v=0;v<=ymax;v+=25) ticks.push(v);
  const every=dlRange==="week"?1:dlRange==="month"?5:8;
  host.innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" width="100%" height="${Hh}" role="img" aria-label="${esc(sub)}, average ${avg}%">
    <defs><pattern id="gp-s" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" class="gp-minor"/></pattern>
    <pattern id="gp-l" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="url(#gp-s)"/><path d="M50 0H0V50" fill="none" class="gp-major"/></pattern></defs>
    <rect x="${P.l}" y="${P.t}" width="${W-P.l-P.r}" height="${Hh-P.t-P.b}" fill="url(#gp-l)" class="gp-bg"/>
    ${ticks.map(v=>`<line x1="${P.l}" x2="${W-P.r}" y1="${Y(v)}" y2="${Y(v)}" class="${v===100?"gp-goal":"gp-tick"}"/><text x="${P.l-8}" y="${Y(v)+4}" text-anchor="end" class="gp-lab">${v}%</text>`).join("")}
    ${pts.map((p,i)=>i%every===0||i===pts.length-1?`<text x="${X(i)}" y="${Hh-10}" text-anchor="middle" class="gp-lab">${dlRange==="year"?MN[p.x.getMonth()]:dlRange==="week"?DN[p.x.getDay()]:p.x.getDate()}</text>`:"").join("")}
    <path d="${path}" class="gp-line"/>
    ${pts.map((p,i)=>p.y==null?"":`<circle cx="${X(i)}" cy="${Y(p.y)}" r="${dlRange==="year"?3.5:5}" class="gp-dot${p.y>=100?" hit":""}"/>`).join("")}
    <line class="gp-cross" x1="0" x2="0" y1="${P.t}" y2="${Hh-P.b}" visibility="hidden"/>
    <rect x="${P.l}" y="0" width="${W-P.l-P.r}" height="${Hh}" fill="transparent" class="gp-hit"/></svg><div class="gp-tip" hidden></div>`;
  const svg=host.querySelector("svg"), tip=host.querySelector(".gp-tip"), cross=host.querySelector(".gp-cross");
  const move=ev=>{const r=svg.getBoundingClientRect(), x=(ev.clientX-r.left)*W/r.width; let i=Math.round((x-P.l)/((W-P.l-P.r)/Math.max(1,pts.length-1))); i=Math.max(0,Math.min(pts.length-1,i)); const p=pts[i];
    cross.setAttribute("x1",X(i)); cross.setAttribute("x2",X(i)); cross.setAttribute("visibility","visible");
    tip.hidden=false; tip.innerHTML=`<b>${esc(p.lab)}</b><span>${p.y==null?(p.x>today?"Not yet":"Rest day"):p.y+"%"} · ${p.h.toFixed(1)} h</span>`;
    const px=X(i)*r.width/W; tip.style.left=Math.min(r.width-150,Math.max(0,px+12))+"px";};
  svg.addEventListener("pointermove",move); svg.addEventListener("pointerleave",()=>{tip.hidden=true; cross.setAttribute("visibility","hidden");});
}
function renderDailyYear(){
  const host=document.getElementById("dl-year"); if(!host) return;
  const y=today.getFullYear(), first=weekStartOf(new Date(y,0,1)), last=new Date(y,11,31);
  let cells="", act=0, goal=0, hrs=0;
  for(let w=first;w<=last;w=addDays(w,7)){cells+=`<div class="dy-col">`; for(let j=0;j<7;j++){const dt=addDays(w,j), inY=dt.getFullYear()===y, k=iso(dt), p=inY&&dt<=today?pctOf(dt):null, hh=hoursOf(k);
      if(inY&&hh>0){act++; hrs+=hh;} if(inY&&p!=null&&p>=100&&targetOf(dt)) goal++;
      const lv=!inY||dt>today?"x":hh===0?"0":p>=100?"4":p>=66?"3":p>=33?"2":"1";
      cells+=`<i class="l${lv}${+dt===+today?" now":""}" title="${inY?`${DN[dt.getDay()]} ${dt.getDate()} ${MN[dt.getMonth()]}: ${hh.toFixed(1)} h${p!=null&&dt<=today?" · "+p+"%":""}`:""}" data-go-d="${inY&&dt<=today?k:""}"></i>`;}
    cells+=`</div>`;}
  host.innerHTML=cells;
  const streak=dailyStreak();
  let best=0,cur=0; Object.keys(daily).sort().forEach((k,i,arr)=>{if(!slotsOf(k)) return; const prev=i?arr[i-1]:null; cur=(prev&&slotsOf(prev)&&(d(k)-d(prev))/864e5===1)?cur+1:1; best=Math.max(best,cur);});
  document.getElementById("dl-year-h").textContent=y+" at a glance";
  document.getElementById("dl-year-sub").textContent="Each square is a day; darker means closer to your target.";
  document.getElementById("dl-stats").innerHTML=[["Streak",streak+" d"],["Best",Math.max(best,streak)+" d"],["Active days",act],["Goal days",goal],["Hours",hrs.toFixed(0)]].map(([a,b])=>`<span><small>${a}</small><b>${b}</b></span>`).join("");
}
function paintCell(btn,on){
  const k=btn.dataset.d, r=+btn.dataset.r; const day=daily[k]||(daily[k]={s:{},u:0});
  if(on) day.s[r]=dlBrush; else delete day.s[r]; day.u=Date.now();
  btn.classList.toggle("on",on); btn.setAttribute("aria-pressed",on); if(on) btn.style.setProperty("--c",actColor(dlBrush));
}
(function wireDaily(){
  const grid=document.getElementById("dl-grid"); if(!grid) return;
  grid.addEventListener("pointerdown",ev=>{const b=ev.target.closest(".dl-c"); if(!b||b.disabled) return; ev.preventDefault();
    const cur=((daily[b.dataset.d]||{}).s||{})[b.dataset.r]; dlPaint=!(cur!=null&&+cur===dlBrush); paintCell(b,dlPaint);
    try{grid.setPointerCapture(ev.pointerId);}catch(e){}});
  grid.addEventListener("pointermove",ev=>{if(dlPaint==null) return; const el=document.elementFromPoint(ev.clientX,ev.clientY), b=el&&el.closest&&el.closest(".dl-c"); if(!b||b.disabled) return; const cur=((daily[b.dataset.d]||{}).s||{})[b.dataset.r]; if(dlPaint?!(cur!=null&&+cur===dlBrush):cur!=null) paintCell(b,dlPaint);});
  const end=()=>{if(dlPaint==null) return; dlPaint=null; saveDaily(); renderDailyScore([...Array(7)].map((_,i)=>addDays(dlWeek,i))); renderDailyChart(); renderDailyYear(); renderDeck();};
  grid.addEventListener("pointerup",end); grid.addEventListener("pointercancel",end);
  grid.addEventListener("keydown",ev=>{const b=ev.target.closest(".dl-c"); if(!b||b.disabled) return; if(ev.key===" "||ev.key==="Enter"){ev.preventDefault(); const cur=((daily[b.dataset.d]||{}).s||{})[b.dataset.r]; paintCell(b,!(cur!=null&&+cur===dlBrush)); saveDaily(); renderDailyScore([...Array(7)].map((_,i)=>addDays(dlWeek,i))); renderDailyChart(); renderDailyYear();}});
  document.getElementById("dl-brushes").addEventListener("click",ev=>{const b=ev.target.closest(".dl-brush"); if(!b) return; dlBrush=+b.dataset.b; document.querySelectorAll(".dl-brush").forEach(x=>x.setAttribute("aria-checked",x===b));});
  document.getElementById("dl-prev").addEventListener("click",()=>{dlWeek=addDays(dlWeek,-7); renderDaily();});
  document.getElementById("dl-next").addEventListener("click",()=>{dlWeek=addDays(dlWeek,7); renderDaily();});
  document.getElementById("dl-today").addEventListener("click",()=>{dlWeek=weekStartOf(today); renderDaily();});
  document.getElementById("dl-ranges").addEventListener("click",ev=>{const b=ev.target.closest("[data-r]"); if(!b) return; dlRange=b.dataset.r; document.querySelectorAll("#dl-ranges [data-r]").forEach(x=>x.setAttribute("aria-pressed",x===b)); renderDailyChart();});
  document.getElementById("dl-year").addEventListener("click",ev=>{const c=ev.target.closest("[data-go-d]"); if(!c||!c.dataset.goD) return; dlWeek=weekStartOf(d(c.dataset.goD)); renderDaily(); document.getElementById("dl-grid").scrollIntoView({behavior:REDUCE?"auto":"smooth",block:"start"});});
  let rt=null; addEventListener("resize",()=>{clearTimeout(rt); rt=setTimeout(()=>{if(currentView==="daily") renderDailyChart();},150);});
})();

/* ---------- midnight refresh: dates, countdowns and "today" stay current ---------- */
setInterval(()=>{const n=new Date(); n.setHours(0,0,0,0); if(+n!==+today){const wasThis=+dlWeek===+weekStartOf(today); today=n; if(wasThis) dlWeek=weekStartOf(today); renderAll(); }},60000);

/* ---------- console ---------- */
let CUSTOM=window.CUSTOM||{};
function saveCustom(next,msg){
  next.u=Date.now(); CUSTOM=next;
  try{localStorage.setItem(CKEY,JSON.stringify(next));}catch(e){}
  if(mode==="db"&&store&&canWrite) store.doc("custom/state").set({json:JSON.stringify(next),updated:new Date().toISOString()}).catch(()=>{});
  const go=()=>{try{sessionStorage.setItem(PROFILE.key+"-msg",msg||"Saved"); sessionStorage.setItem(PROFILE.key+"-goto","console");}catch(e){} location.reload();};
  if(gcfg().token&&gcfg().id) pushGist().finally(go); else go();
}
const clone=o=>JSON.parse(JSON.stringify(o||{}));
const fld=(id,label,val,type="text",extra="")=>`<label>${esc(label)}<input id="${id}" type="${type}" value="${esc(val??"")}" ${extra}></label>`;
function renderConsole(){
  const pf=document.getElementById("cs-profile-f"); if(!pf) return;
  pf.innerHTML=fld("cp-name","Full name",PROFILE.name)+fld("cp-first","Name in the greeting",PROFILE.first)+fld("cp-title","Page title",PROFILE.title)+
    fld("cp-w1","Big title, line 1",(PROFILE.titleWords||[])[0])+fld("cp-w2","Big title, line 2",(PROFILE.titleWords||[])[1])+fld("cp-code","Card code",PROFILE.code)+
    fld("cp-cur","Currency symbol",PROFILE.currency)+fld("cp-start","Journey starts",PROFILE.start,"date")+fld("cp-end","Journey ends",PROFILE.end,"date")+
    `<label>Week starts on<select id="cp-ws">${DN.map((n,i)=>`<option value="${i}" ${+PROFILE.weekStart===i?"selected":""}>${n}</option>`).join("")}</select></label>`+
    `<details class="cs-more"><summary>Page text</summary>${Object.keys(TEXT).map(k=>`<label>${esc(k)}<textarea data-tk="${esc(k)}" rows="2">${esc(TEXT[k])}</textarea></label>`).join("")}</details>`;
  document.getElementById("cs-cd-f").innerHTML=[0,1,2].map(i=>{const c=COUNTDOWNS[i]||{}; return `<div class="cs-line">${fld("cd-l"+i,"Label",c.label)}${fld("cd-d"+i,"Date",c.date,"date")}<label class="cs-chk"><input type="checkbox" id="cd-h${i}" ${c.hard?"checked":""}>Hard</label></div>`;}).join("");
  const hardRows=HARD.map(h=>h.slice());
  const drawHard=()=>{document.getElementById("cs-hard-f").innerHTML=hardRows.map((h,i)=>`<div class="cs-line cs-hl" data-i="${i}">${fld("hw"+i,"When",h[0])}${fld("ht"+i,"What",h[1])}${fld("hd"+i,"Date",h[2],"date")}${fld("hu"+i,"Link",h[4]||"","url")}<label class="cs-chk"><input type="checkbox" id="hh${i}" ${h[3]?"checked":""}>Hard</label><button type="button" class="cs-x" data-del="${i}" aria-label="Delete ${esc(h[1])}">×</button></div>`).join("");};
  drawHard();
  document.getElementById("cs-hard-f").onclick=e=>{const b=e.target.closest("[data-del]"); if(!b) return; readHard(); hardRows.splice(+b.dataset.del,1); drawHard();};
  const readHard=()=>hardRows.forEach((h,i)=>{if(!document.getElementById("hw"+i)) return; h[0]=val("hw"+i); h[1]=val("ht"+i); h[2]=val("hd"+i); h[3]=document.getElementById("hh"+i).checked?1:0; h[4]=val("hu"+i);});
  document.getElementById("cs-hard-add").onclick=()=>{readHard(); hardRows.push(["","",iso(addDays(today,30)),0,""]); drawHard();};
  document.getElementById("cs-hard").onsubmit=e=>{e.preventDefault(); readHard(); const c=clone(CUSTOM); c.hard=hardRows.filter(h=>h[1]&&h[2]).sort((a,b)=>a[2].localeCompare(b[2])); saveCustom(c,"Hard dates saved");};
  const df=document.getElementById("cs-daily-f");
  df.innerHTML=fld("cdl-from","Day starts",DAILY.from,"time")+fld("cdl-to","Day ends",DAILY.to==="24:00"?"23:59":DAILY.to,"time")+
    `<label>Square length<select id="cdl-slot">${[15,20,30,60].map(m=>`<option ${+DAILY.slot===m?"selected":""} value="${m}">${m} min</option>`).join("")}</select></label>`+
    DN.map((n,i)=>fld("cdl-t"+i,`${n} target (h)`,(DAILY.targets||[])[i]??0,"number",'min="0" max="24" step="0.5"')).join("");
  const acts=(DAILY.acts||[]).map(a=>a.slice());
  const drawActs=()=>{document.getElementById("cs-acts").innerHTML=acts.map((a,i)=>`<div class="cs-line cs-ar">${fld("ca-n"+i,"Name",a[0])}<label>Colour<input type="color" id="ca-c${i}" value="${esc(/^#[0-9a-f]{6}$/i.test(a[1])?a[1]:"#888888")}"></label><button type="button" class="cs-x" data-adel="${i}" aria-label="Delete ${esc(a[0])}">×</button></div>`).join("")+`<button type="button" class="btn-ghost" id="ca-add">+ Activity</button>`;};
  const readActs=()=>acts.forEach((a,i)=>{if(document.getElementById("ca-n"+i)){a[0]=val("ca-n"+i); a[1]=val("ca-c"+i);}});
  drawActs();
  document.getElementById("cs-acts").onclick=e=>{const b=e.target.closest("[data-adel]"); if(b){readActs(); if(acts.length>1) acts.splice(+b.dataset.adel,1); drawActs();} if(e.target.id==="ca-add"){readActs(); acts.push(["New","#8888ff"]); drawActs();}};
  document.getElementById("cs-plan").innerHTML=DN.map((n,i)=>`<label>${n}<textarea id="cpl-${i}" rows="3" spellcheck="false">${esc(((DAILY.plan||[])[i]||[]).join("\n"))}</textarea></label>`).join("");
  document.getElementById("cs-daily").onsubmit=e=>{e.preventDefault(); readActs(); const c=clone(CUSTOM); let to=val("cdl-to"); if(to==="23:59"||to==="00:00") to="24:00";
    c.daily={from:val("cdl-from")||"06:00",to,slot:+val("cdl-slot"),targets:DN.map((_,i)=>Math.max(0,+val("cdl-t"+i)||0)),acts:acts.filter(a=>a[0]),plan:DN.map((_,i)=>val("cpl-"+i).split("\n").map(s=>s.trim()).filter(Boolean))};
    if(c.daily.slot!==+DAILY.slot||c.daily.from!==DAILY.from){if(!confirmSoft("cs-daily","Changing the start time or square length shifts squares you already ticked. Press save again to confirm.")) return;}
    saveCustom(c,"Daily tracker saved");};
  document.getElementById("cs-profile").onsubmit=e=>{e.preventDefault(); const c=clone(CUSTOM);
    c.profile=Object.assign({},c.profile,{name:val("cp-name"),first:val("cp-first"),title:val("cp-title"),titleWords:[val("cp-w1"),val("cp-w2")],code:val("cp-code"),currency:val("cp-cur"),start:val("cp-start")||PROFILE.start,end:val("cp-end")||PROFILE.end,weekStart:+val("cp-ws")});
    const t={}; document.querySelectorAll("[data-tk]").forEach(x=>{if(x.value!==TEXT[x.dataset.tk]) t[x.dataset.tk]=x.value;}); c.text=Object.assign({},c.text,t);
    saveCustom(c,"Profile saved");};
  document.getElementById("cs-cd").onsubmit=e=>{e.preventDefault(); const c=clone(CUSTOM); c.countdowns=[0,1,2].map(i=>({label:val("cd-l"+i),date:val("cd-d"+i),hard:document.getElementById("cd-h"+i).checked?1:0})).filter(x=>x.date); saveCustom(c,"Countdowns saved");};
  // items
  const ph=document.getElementById("cs-ph");
  if(!ph.options.length){ph.innerHTML=PHASES.map(p=>`<option value="${p.k}">${esc(p.code+" · "+p.name)}</option>`).join(""); ph.onchange=drawItems; document.getElementById("cs-iq").oninput=drawItems;
    document.getElementById("cs-new").onclick=()=>{csEdit="__new"; drawItems();};
    document.getElementById("cs-ilist").onclick=itemClick; document.getElementById("cs-ilist").onsubmit=itemSave;}
  drawItems();
  document.getElementById("cs-rawtxt").value=JSON.stringify(CUSTOM,null,2);
  document.getElementById("cs-raw").onsubmit=e=>{e.preventDefault(); let o; try{o=JSON.parse(document.getElementById("cs-rawtxt").value||"{}");}catch(err){dstat("That isn't valid JSON: "+err.message,1); return;} if(!o||typeof o!=="object"||Array.isArray(o)){dstat("The top level must be an object.",1); return;} saveCustom(o,"Raw edits applied");};
  const g=gcfg(); document.getElementById("cs-tok").value=g.token||""; document.getElementById("cs-gid").value=g.id||""; gstat();
}
const val=id=>{const el=document.getElementById(id); return el?el.value.trim():"";};
const softArm={};
function confirmSoft(k,msg){if(softArm[k]) {softArm[k]=0; return true;} softArm[k]=1; dstat(msg,1); setTimeout(()=>softArm[k]=0,6000); return false;}
function dstat(t,bad){const el=document.getElementById("cs-dstat"); if(el){el.textContent=t; el.classList.toggle("bad",!!bad);} const s=document.getElementById("cs-gstat"); if(bad&&s&&t.includes("Changing")) s.textContent="";}
let csEdit=null;
function drawItems(){
  const k=val("cs-ph"), q=val("cs-iq").toLowerCase(), host=document.getElementById("cs-ilist");
  const its=ITEMS.filter(i=>i.phase===k&&(!q||(i.id+" "+i.title).toLowerCase().includes(q)));
  const form=(i)=>`<form class="cs-iform" data-id="${esc(i?i.id:"")}">${i?"":fld("ci-id","ID (short, unique)","","text",'required pattern="[A-Za-z0-9_-]{1,12}"')}${fld("ci-title","Title",i?i.title:"","text","required")}${fld("ci-target","Target (when, in words)",i?i.target:"")}${fld("ci-due","Due",i?i.due:iso(addDays(today,14)),"date","required")}<label class="cs-chk"><input type="checkbox" id="ci-star" ${i&&i.star?"checked":""}>★ Priority</label><label class="cs-full">Description (HTML allowed)<textarea id="ci-desc" rows="3">${esc(i?i.desc:"")}</textarea></label><label class="cs-full">Links, one per line: <code>Title | https://…</code><textarea id="ci-links" rows="3">${esc((i?linksOf(i.id):[]).map(([t,u])=>t+" | "+u).join("\n"))}</textarea></label><div class="cs-act">${i?`<button type="button" class="btn-ghost danger" data-idel="${esc(i.id)}">Delete</button>`:""}<button type="button" class="btn-ghost" data-icancel>Cancel</button><button class="btn-pill" type="submit">${i?"Save item":"Add item"}</button></div></form>`;
  host.innerHTML=(csEdit==="__new"?form(null):"")+(its.length?its.map(i=>csEdit===i.id?form(i):`<div class="cs-item"><span class="idb ph-${i.phase}">${esc(i.id)}</span><span class="t">${esc(i.title)}${i.star?' <span class="star">★</span>':""}</span><span class="when">${esc(i.due)}</span><button type="button" class="btn-ghost" data-iedit="${esc(i.id)}">Edit</button></div>`).join(""):`<div class="empty">No items in this phase${q?" match":""}.</div>`);
}
function itemClick(e){const b=e.target.closest("button"); if(!b) return;
  if(b.dataset.iedit){csEdit=b.dataset.iedit; drawItems(); return;}
  if(b.hasAttribute("data-icancel")){csEdit=null; drawItems(); return;}
  if(b.dataset.idel){const id=b.dataset.idel; if(!confirmSoft("del"+id,`Press Delete again to remove ${id}.`)) return; const c=clone(CUSTOM); c.items=Object.assign({},c.items,{[id]:null}); saveCustom(c,id+" deleted");}}
function itemSave(e){e.preventDefault(); const f=e.target; const isNew=!f.dataset.id; const id=isNew?val("ci-id"):f.dataset.id;
  if(isNew&&(BY[id]||!/^[A-Za-z0-9_-]{1,12}$/.test(id))){dstat(`ID "${id}" is taken or invalid.`,1); return;}
  const links=val("ci-links").split("\n").map(l=>l.split("|").map(s=>s.trim())).filter(x=>x[0]&&/^https?:\/\//.test(x[1]||"")).map(x=>[x[0],x[1]]);
  const patch={title:val("ci-title"),target:val("ci-target"),due:val("ci-due"),star:document.getElementById("ci-star").checked,desc:document.getElementById("ci-desc").value,links};
  if(isNew) patch.phase=val("cs-ph");
  const c=clone(CUSTOM); c.items=Object.assign({},c.items,{[id]:Object.assign({},(c.items||{})[id]||{},patch)}); if(!isNew&&LINKS[id]) {/* keep shipped links unless changed */ if(JSON.stringify(links)===JSON.stringify(LINKS[id])) delete c.items[id].links; else LINKS[id]=links;}
  saveCustom(c,(isNew?"Added ":"Saved ")+id);}
document.getElementById("cs-export")?.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(bundle(),null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`${PROFILE.key}-backup-${iso(new Date())}.json`; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},500); dstat("Backup downloaded.");});
document.getElementById("cs-import")?.addEventListener("change",async e=>{const f=e.target.files[0]; if(!f) return; try{const o=JSON.parse(await f.text()); if(!o||o.v!==1) throw new Error("not a journal backup"); mergeBundle(o,true); dstat("Imported. Reloading…"); setTimeout(()=>location.reload(),600);}catch(err){dstat("Import failed: "+err.message,1);} e.target.value="";});
document.getElementById("cs-reset")?.addEventListener("click",()=>{if(!confirmSoft("reset","Press Reset again to remove all console edits.")) return; saveCustom({},"Console edits removed");});
(function(){let m=null; try{m=sessionStorage.getItem(PROFILE.key+"-msg"); sessionStorage.removeItem(PROFILE.key+"-msg");}catch(e){} if(m) setTimeout(()=>dstat(m),50);})();

/* ---------- sync bundle (backup file and Gist share one format) ---------- */
function bundle(){return {v:1,app:PROFILE.key,saved:new Date().toISOString(),progress:prog,parts,daily,custom:CUSTOM};}
function mergeBundle(o,force){
  let changed=false, customChanged=false;
  if(o.progress&&typeof o.progress==="object") Object.entries(o.progress).forEach(([id,x])=>{if(!x) return; const l=prog[id]; if(force||!l||(x.u||0)>(l.u||0)){if(JSON.stringify(l)!==JSON.stringify(x)){prog[id]=x; changed=true;}}});
  if(o.parts&&Array.isArray(o.parts.inv)&&Array.isArray(o.parts.buy)&&(force||(o.parts.u||0)>(parts.u||0))&&JSON.stringify(o.parts)!==JSON.stringify(parts)){parts=o.parts; try{localStorage.setItem(PKEY,JSON.stringify(parts));}catch(e){} changed=true;}
  if(o.daily&&typeof o.daily==="object") Object.entries(o.daily).forEach(([k,x])=>{if(!x||typeof x!=="object") return; const l=daily[k]; if(force||!l||(x.u||0)>(l.u||0)){if(JSON.stringify(l)!==JSON.stringify(x)){daily[k]=x; changed=true;}}});
  if(o.custom&&typeof o.custom==="object"&&(force||(o.custom.u||0)>(CUSTOM.u||0))&&JSON.stringify(o.custom)!==JSON.stringify(CUSTOM)){try{localStorage.setItem(CKEY,JSON.stringify(o.custom));}catch(e){} customChanged=true;}
  if(changed){saveLocal(); try{localStorage.setItem(DKEY,JSON.stringify(daily));}catch(e){} renderAll(); renderParts();}
  return {changed,customChanged};
}
/* ---------- private Gist sync ---------- */
const gcfg=()=>{try{return JSON.parse(localStorage.getItem(GKEY)||"{}")||{};}catch(e){return {};}};
const GAPI="https://api.github.com/gists";
let gTimer=null, gBusy=false, gDirty=false, gLast=null;
function gstat(t,bad){const el=document.getElementById("cs-gstat"); const g=gcfg(); if(!el) return; el.classList.toggle("bad",!!bad); el.textContent=t||(g.token&&g.id?`Connected to gist ${g.id.slice(0,8)}…${gLast?" · last sync "+gLast.toLocaleTimeString():""}`:"Not connected. Progress stays in this browser.");}
async function gfetch(url,opt={}){const g=gcfg(); const r=await fetch(url,Object.assign({cache:"no-store"},opt,{headers:Object.assign({"Accept":"application/vnd.github+json","Authorization":"Bearer "+g.token,"X-GitHub-Api-Version":"2022-11-28"},opt.headers||{})})); if(!r.ok){const e=new Error(r.status===401?"Token rejected (401)":r.status===404?"Gist not found (404)":"GitHub error "+r.status); e.status=r.status; throw e;} return r.json();}
function markDirty(){ if(syncing) return; gDirty=true; const g=gcfg(); if(!g.token||!g.id) return; clearTimeout(gTimer); gTimer=setTimeout(pushGist,2500); }
let syncing=false;
async function pushGist(){const g=gcfg(); if(!g.token||!g.id||gBusy) return; gBusy=true;
  try{await gfetch(GAPI+"/"+g.id,{method:"PATCH",body:JSON.stringify({files:{"journal.json":{content:JSON.stringify(bundle())}}})}); gDirty=false; gLast=new Date(); gstat(); if(mode!=="db") setSync(true,"Gist synced");}
  catch(e){gstat("Push failed: "+e.message,1); if(mode!=="db") setSync(false,"Sync failed");} finally{gBusy=false;}}
async function pullGist(){const g=gcfg(); if(!g.token||!g.id||gBusy) return; gBusy=true; syncing=true;
  try{const j=await gfetch(GAPI+"/"+g.id); const f=j.files&&j.files["journal.json"]; let o=null;
    if(f){let txt=f.content; if(f.truncated&&f.raw_url) txt=await (await fetch(f.raw_url,{cache:"no-store"})).text(); o=JSON.parse(txt||"{}");}
    syncing=false;
    if(o&&o.v===1){const r=mergeBundle(o,false); if(r.customChanged){gBusy=false; location.reload(); return;}}
    gLast=new Date(); gstat(); if(mode!=="db") setSync(true,"Gist synced");
    gBusy=false; if(!o||gDirty||JSON.stringify(o.progress)!==JSON.stringify(prog)||JSON.stringify(o.daily)!==JSON.stringify(daily)||JSON.stringify(o.parts)!==JSON.stringify(parts)) await pushGist();
  }catch(e){gstat("Pull failed: "+e.message,1); if(mode!=="db") setSync(false,"Sync failed");} finally{gBusy=false; syncing=false;}}
document.getElementById("cs-gsave")?.addEventListener("click",async()=>{const token=val("cs-tok"), id=val("cs-gid"); if(!token){gstat("Paste a token first.",1); return;}
  try{localStorage.setItem(GKEY,JSON.stringify({token,id}));}catch(e){}
  try{ if(!id){gstat("Creating a private gist…"); const j=await gfetch(GAPI,{method:"POST",body:JSON.stringify({description:PROFILE.title+" · journal sync",public:false,files:{"journal.json":{content:JSON.stringify(bundle())}}})}); localStorage.setItem(GKEY,JSON.stringify({token,id:j.id})); document.getElementById("cs-gid").value=j.id; gLast=new Date(); gstat(`Created gist ${j.id}. Paste this ID on your other devices.`); setSync(true,"Gist synced");}
    else {gstat("Syncing…"); await pullGist();}}
  catch(e){gstat("Couldn't connect: "+e.message,1);}});
document.getElementById("cs-gforget")?.addEventListener("click",()=>{try{localStorage.removeItem(GKEY);}catch(e){} document.getElementById("cs-tok").value=""; document.getElementById("cs-gid").value=""; gstat("Forgotten on this device. Your gist is untouched.");});
if(gcfg().token&&gcfg().id){setSync(false,"Connecting…"); pullGist(); setInterval(()=>{if(!document.hidden) pullGist();},5*60000); document.addEventListener("visibilitychange",()=>{if(!document.hidden) pullGist(); else if(gDirty) pushGist();});}

/* ---------- artifact database hook (claude.ai only) ---------- */
function dbHook(db){
  db.doc("daily/state").onSnapshot(sn=>{ if(!sn.exists){ if(Object.keys(daily).length&&canWrite) saveDaily(); return; } const x=(sn.data()||{}).days; if(x&&typeof x==="object"&&dlPaint==null){daily=x; try{localStorage.setItem(DKEY,JSON.stringify(daily));}catch(e){} renderDaily();}},()=>{});
  db.doc("custom/state").onSnapshot(sn=>{ if(!sn.exists){ if(CUSTOM.u&&canWrite) db.doc("custom/state").set({json:JSON.stringify(CUSTOM),updated:new Date().toISOString()}).catch(()=>{}); return; }
    let o=null; try{o=JSON.parse((sn.data()||{}).json||"null");}catch(e){} if(o&&(o.u||0)>(CUSTOM.u||0)){try{localStorage.setItem(CKEY,JSON.stringify(o));}catch(e){} location.reload();}},()=>{});
}
function dailyStreak(){let n=0; for(let dt=new Date(today);;dt=addDays(dt,-1)){if(hoursOf(iso(dt))>0) n++; else if(+dt!==+today) break; if(n>3660) break;} return n;}
function weekPct(){const w=weekStartOf(today); let th=0,tt=0; for(let j=0;j<7;j++){const dt=addDays(w,j); th+=hoursOf(iso(dt)); tt+=targetOf(dt);} return tt?Math.round(th/tt*100):0;}
renderConsole();
if(window.claude&&claude.use){["cs-sync","cs-data"].forEach(id=>{const el=document.getElementById(id); if(el) el.innerHTML=id==="cs-sync"?'<h2>Sync</h2><p class="cs-note">This copy runs on claude.ai and already syncs through your account. Gist sync and backups are available in the GitHub version.</p>':'';}); const d=document.getElementById("cs-data"); if(d) d.hidden=true;}
window.__J={ITEMS,PHASES,RES,BOOKS,HARD,COUNTDOWNS,DAILY,PROFILE,TEXT,get daily(){return daily;},get prog(){return prog;},bundle,mergeBundle};

renderLearn(); renderCred(); renderPort(); renderCommunity(); renderAll(); paintToggle();
let startView="home"; try{if(sessionStorage.getItem(PROFILE.key+"-goto")){startView=sessionStorage.getItem(PROFILE.key+"-goto"); sessionStorage.removeItem(PROFILE.key+"-goto");}}catch(e){}
swap(startView); scene.setView&&scene.setView(startView);
setSync(false,"This browser");
(async()=>{
  if(!window.claude||!claude.use) return;
  const db=await claude.use("db"); if(!db){setSync(false,"This browser only"); return;}
  const user=await claude.use("user"); if(user){const can=await user.can("data.write"); if(can===false) canWrite=false;}
  store=db; mode="db"; dbHook(db); setSync(true,canWrite?"Synced":"Read-only"); applyReadOnly();
  let first=true;
  db.doc("parts/state").onSnapshot(sn=>{
    if(sn.exists){const d=sn.data()||{}; if(Array.isArray(d.inv)&&Array.isArray(d.buy)){parts={inv:d.inv,buy:d.buy,u:d.u||0}; try{localStorage.setItem(PKEY,JSON.stringify(parts));}catch(e){} renderParts();}}
    else if(partsLocalEdited&&canWrite){savePartsSoon();}
  },()=>setSync(false,"Sync stopped"));
  db.collection("progress").onSnapshot(snap=>{
    const next={}; snap.docs.forEach(doc=>{const x=doc.data()||{}; next[doc.id]={status:+x.status||0,review:+x.review||0,notes:x.notes||"",u:Date.parse(x.updated)||0};});
    if(first&&snap.empty&&canWrite&&Object.keys(prog).length){first=false; Object.keys(prog).forEach(id=>write(id,prog[id])); return;}
    first=false; if(openId&&document.activeElement===ta&&next[openId]) next[openId].notes=ta.value;
    prog=next; renderAll();
  },()=>setSync(false,"Sync stopped"));
})();
})();