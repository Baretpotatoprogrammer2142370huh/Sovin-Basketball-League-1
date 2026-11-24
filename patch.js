// patch.js: twarze Fornal / Mugsy / Baret / RJ Barrett + zawodnik Stan Fabissor
// Ładować po głównym <script> gry.
(function () {
  // Gra ładuje twarze jako `${id}1.png` i `${id}2.png`.
  // Nadpisujemy faceImage, żeby obsłużyć też inne nazwy plików.
  const FILE_NAMES = {
    fornal:       'fornal',
    mugsy_bogues: 'mugsy',
    baret:        'baret',
    rj_barrett:   'barrett',
    stanley:      'stanley'
  };

  Object.keys(FILE_NAMES).forEach(id => FACE_IDS.add(id));

  const origFaceImage = faceImage;
  faceImage = function (id, variant) {
    if (!FILE_NAMES[id]) return origFaceImage(id, variant);
    const key = id + variant;
    if (!FACE_IMAGES[key]) {
      const img = new Image();
      img.src = `${FILE_NAMES[id]}${variant}.png`;
      FACE_IMAGES[key] = img;
    }
    const img = FACE_IMAGES[key];
    return img.complete && img.naturalWidth > 0 ? img : null;
  };

  // Stan Fabissor
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
