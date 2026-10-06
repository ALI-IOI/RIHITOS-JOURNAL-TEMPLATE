/* Applies the edits made in the Console (stored in this browser, synced by Gist)
   on top of data/journal.js, before the app starts. */
"use strict";
(function(){
  let c = null;
  try { c = JSON.parse(localStorage.getItem(PROFILE.key + "-custom") || "null"); } catch (e) {}
  window.CUSTOM = (c && typeof c === "object") ? c : {};
  const C = window.CUSTOM;
  const obj = v => v && typeof v === "object" && !Array.isArray(v);
  try {
    if (obj(C.profile)) Object.assign(PROFILE, C.profile);
    if (obj(C.text)) Object.assign(TEXT, C.text);
    if (Array.isArray(C.countdowns)) COUNTDOWNS.splice(0, COUNTDOWNS.length, ...C.countdowns.filter(x => x && x.date));
    if (Array.isArray(C.hard)) HARD.splice(0, HARD.length, ...C.hard.filter(h => Array.isArray(h) && h[2]));
    if (obj(C.daily)) Object.assign(DAILY, C.daily);
    if (obj(C.phases)) PHASES.forEach(p => { const x = C.phases[p.k]; if (obj(x)) Object.assign(p, x); });
    if (Array.isArray(C.lx)) LX.splice(0, LX.length, ...C.lx);
    if (obj(C.plan)) PLAN.forEach(p => { const x = C.plan[p.id]; if (obj(x)) Object.assign(p, x); });
    if (obj(C.apply)) { if (Array.isArray(C.apply.countries)) APPLY.countries = C.apply.countries; if (Array.isArray(C.apply.timeline)) APPLY.timeline = C.apply.timeline; }
    if (obj(C.items)) {
      Object.entries(C.items).forEach(([id, patch]) => {
        const ix = ITEMS.findIndex(i => i.id === id);
        if (patch === null) { if (ix >= 0) ITEMS.splice(ix, 1); return; }
        if (!obj(patch)) return;
        if (Array.isArray(patch.links) && patch.links.length) LINKS[id] = patch.links;
        if (ix >= 0) Object.assign(ITEMS[ix], patch);
        else if (patch.title && patch.phase) ITEMS.push(Object.assign({ id, target: "", due: PROFILE.end, star: false, desc: "" }, patch));
      });
    }
    if (obj(C.learn) && typeof WIZARD !== "undefined" && Array.isArray(WIZARD.learn)) {
      const pats = WIZARD.learn.filter(x => (C.learn.platforms || []).includes(x[0])).map(x => new RegExp(x[2], "i"));
      RES.forEach(r => { r.mine = pats.some(re => re.test(r.url)); });
      RES.sort((a, b) => (b.mine ? 1 : 0) - (a.mine ? 1 : 0));
      const score = u => { const v = /youtube|videos|lecture/i.test(u), rd = /docs\.|documentation|book|\.pdf|fbswiki|lavalle|tutorial/i.test(u), bd = /github|project|instructables|randomnerd|examples/i.test(u);
        return C.learn.style === "video" ? (v ? 0 : 1) : C.learn.style === "read" ? (rd ? 0 : 1) : (bd ? 0 : 1); };
      Object.keys(LINKS).forEach(k => { const l = LINKS[k]; if (Array.isArray(l)) LINKS[k] = l.slice().sort((a, b) => score(a[1]) - score(b[1]) || (pats.some(re => re.test(b[1])) ? 1 : 0) - (pats.some(re => re.test(a[1])) ? 1 : 0)); });
      if (C.learn.paid === "free") { const b = document.getElementById("l-free"); if (b) b.setAttribute("aria-pressed", "true"); }
    }
  } catch (e) { console.warn("Console edits could not be applied", e); }
  document.title = PROFILE.title || document.title;
})();
