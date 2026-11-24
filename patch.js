// patch.js: twarze Fornal / Mugsy / Baret + zawodnik Stan Fabissor
// Ładować po głównym <script> gry.
(function () {
  // 1. Twarze PNG (nazwy plików = id + 1.png / 2.png)
  ['fornal', 'mugsy_bogues', 'barrett', 'stanley'].forEach(id => FACE_IDS.add(id));

  // 2. Nowy zawodnik: Stan Fabissor (id musi być takie jak nazwa plików: stanley1.png, stanley2.png)
  const raw = {
    id: 'stanley', name: 'Fabissor', full: 'Stan Fabissor (Stanley)', num: 21,
    color: '#1e5a3c', shorts: '#101010', sock: '#f2f2f2', shoe: '#1a1a1a', pos: 'PF',
    h: 187, w: 108,
    s: { acc: 86, three: 52, dunk: 58, block: 82, steal: 80, def: 76, speed: 44, stamina: 70, handle: 40, reb: 72 },
    sk: ['glove'],
    f: { skin: '#e8b890', hair: '#3b2a1c', hs: 'buzz', gl: null, build: 1.45, belly: 1, head: 1.03 }
  };
  const p = applyBody(raw);
  RAW.push(raw);
  BASE.push(p);
  NORMAL_BASE.push(p);
  ALL.push(p);
  BYID[p.id] = p;
})();
