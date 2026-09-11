# Ricette del motore — come si costruisce la pagina (entrambe le corsie)

Non è un template. Queste sono le meccaniche portanti che scrivi *dentro* ogni build su
misura. Tutto il resto — markup, stile, forma del motion, copy — lo progetti fresco per
ogni brand.

---

## Motore di scrub (Corsia B) — canvas + frame, mai `<video>`

Lo scrubbing di `<video currentTime>` scatta (latenza di seek). L'unica via senza scatti:
frame JPEG pre-estratti disegnati su un `<canvas>` a tutto viewport, guidato dallo scroll.

**Struttura:** un driver di scroll alto (`~170vh per capitolo`, es. `850vh` per 5) che
contiene uno stage `position:sticky; top:0; height:100vh` con canvas + overlay. Progresso:

```js
const r = filmScroll.getBoundingClientRect();
const p = Math.max(0, Math.min(1, -r.top / (r.height - innerHeight)));
```

**Playhead smorzato** (è questo il burro — la mappatura diretta sa di meccanico):

```js
currentFrame += (target - currentFrame) * 0.14;   // target = p * (FRAME_COUNT - 1)
```

**Il cuore anti-scatto — finestra scorrevole di ImageBitmap.** `drawImage(HTMLImageElement)`
forza una decodifica JPEG *sincrona* sul main thread al primo paint e di nuovo dopo
l'eviction della cache del browser: quei picchi di decodifica sono la sensazione
"frame-per-frame che scatta". Decodifica fuori thread attorno al playhead così ogni draw è
un puro blit GPU:

```js
const bitmaps = new Map(), decoding = new Set();
const B_AVANTI = 48, B_TIENI = 60; let bmpCentro = -999;   // finestra in SECONDI di film, non in frame fissi
function ensureBitmaps(centro){
  if (Math.abs(centro - bmpCentro) < 3) return;
  bmpCentro = centro;
  const lo = Math.max(0, centro - 20), hi = Math.min(FRAME_COUNT - 1, centro + B_AVANTI);
  for (let i = lo; i <= hi; i++){
    if (bitmaps.has(i) || decoding.has(i) || !images[i]) continue;
    decoding.add(i);
    createImageBitmap(images[i]).then(b => {
      decoding.delete(i);
      if (Math.abs(i - bmpCentro) > B_TIENI){ b.close(); return; }
      bitmaps.set(i, b);
      if (i === mostrato) drawFrame(i, true);      // ridisegna se il frame mostrato è migliorato
    }).catch(() => decoding.delete(i));
  }
  for (const k of Array.from(bitmaps.keys()))
    if (k < centro - B_TIENI || k > centro + B_TIENI){ bitmaps.get(k).close(); bitmaps.delete(k); }
}
// draw: preferisci bitmaps.get(idx), ripiega sull'HTMLImageElement caricato più vicino
```

Chiama `ensureBitmaps(Math.round(currentFrame))` a ogni tick, **pre-scalda attorno al
frame 0 al boot**.

**Dimensiona la finestra in SECONDI di film, non in frame.** 18 frame avanti sono ~2s di
film a 300 frame totali ma **0,75s** a 1.728 — e un flick veloce la sorpassa subito.
Regola: ~2s in avanti (48 frame a 24fps), ~1,3s dietro. Tenere ~80 ImageBitmap a 1024×576
è ~190MB: è per questo che è una finestra scorrevole e non un preload — mai accodare tutti
i frame in anticipo a cadenza nativa.

**Caricamento frame:** pompa a concorrenza limitata (~10-12 in volo) dentro un array, un
loader con barra di avanzamento vera, e un fallback `nearestFrame()` (scansione verso
l'esterno dall'indice richiesto) così un frame mancante non svuota mai il canvas. Mai
bloccare il primo paint sull'intero film: precarica una breve corsa iniziale, poi streama.

**Estrai alla cadenza NATIVA del film, non a un numero tondo.**

```bash
ffmpeg -v error -y -i master.mp4 -vf "fps=24,scale=1024:-1" -q:v 6 frames/f_%04d.jpg
```

Un film da 72 secondi a 24fps è **1.728 frame**. Estrarne "circa 300" butta via l'83% del
girato e lascia il visitatore a scrubbare una **slideshow a 4fps**. Comportamento
indicativo dei frame adiacenti:

| frame | fps | SSIM adiacente |
|---|---|---|
| 300 | 4,2 | **0,39 – 0,45** |
| 865 | 12 | 0,47 – 0,49 |
| **1.728** | **24** | **0,63 — il tetto** |

Nota il tetto: anche a cadenza nativa questo girato arriva solo a 0,63, perché la camera
copre strada veloce su dettaglio ad alta frequenza. Va bene come *video*; nessun numero di
frame salva un film la cui camera si muove troppo (vedi la regola dello storyboard nel
playbook). La cadenza sistema il campionamento; non sistema la distanza.

Scambia risoluzione per frame, mai il contrario: **1024px a `-q:v 6` batte 1280px a
`-q:v 4`** a parità di byte, perché la fluidità temporale è molto più visibile della
nitidezza per-frame su un'immagine in movimento. ~1.700 frame a 1024px ≈ 85–105MB.

**Adatta, non coprire alla cieca.** `Math.max(cw/w, ch/h)` è giusto su desktop landscape e
catastrofico su un telefono: un film 16:9 in un viewport 390×844 tiene solo il **26%**
centrale di ogni frame — il 74% della composizione vola via dai lati. E ingrandisce ~1,5×,
amplificando ogni movimento di camera. Copri finché il ritaglio è modesto, letterbox
quando non lo è più — soglia sulla frazione di ritaglio, non su un breakpoint:

```js
var MAX_CROP = 0.22;
function fit(bm){
  var cw=canvas.width, ch=canvas.height;
  var sCover = Math.max(cw/bm.width, ch/bm.height);
  var crop = 1 - Math.min(cw/(bm.width*sCover), ch/(bm.height*sCover));
  var s = crop > MAX_CROP ? Math.min(cw/bm.width, ch/bm.height) : sCover;
  var w = bm.width*s, h = bm.height*s;
  ctx.drawImage(bm, (cw-w)/2, (ch-h)/2, w, h);
}
```

**DPR a 1.0, e fai combaciare la larghezza della sorgente.** Un frame da 1024px disegnato
in un canvas da 2268px è un upscale 2,2× che si legge come *pixelato* — e l'istinto
sbagliato è alzare il DPR peggiorando. La nitidezza dello scrub viene dalla sorgente che
combacia 1:1 col canvas: estrai a ~1440px e tieni il DPR a 1.0.

## Beat sovrapposti (copy sopra il film)

> **Il brief del mondo è appunti di produzione, non copy sorgente.**
>
> È il modo più affidabile di rovinare una build finita: il documento che descrive il film
> in prosa vivida è scritto *per chi genera il girato*. Un modello senza altre immagini in
> stanza può parafrasarlo dritto in pagina e spedire una lista di inquadrature invece del
> copy del brand.
>
> **Il test:** chi non può vedere il film deve comunque leggere ogni riga come pubblicità
> del prodotto. Se una riga ha senso solo accanto all'immagine, è una didascalia — e per
> le didascalie c'è già l'immagine.
>
> Mai nominare la posizione della camera, la direzione, ciò che sta oltrepassando. Niente
> *discesa*, *arretramento*, *ripresa continua*, niente elenchi di ciò che è in quadro.
> I beat portano ciò che l'immagine non può: **il claim, il rifiuto, la battuta.**
> `scripts/copy-gate.js` boccia tutto questo — eseguilo, mai modificarlo per farlo passare.

Overlay in posizione assoluta con inviluppi di progresso, guidati dallo stesso tick:

```html
<div class="beat" data-in="0.16" data-peak="0.235" data-out="0.31"><h2>…</h2></div>
```
```js
function beatAlpha(b, p){
  if (p < b.in || p > b.out) return 0;
  if (p < b.peak) return (p - b.in) / Math.max(1e-4, b.peak - b.in);
  if (b.out > 1.5) return 1;                    // finale: data-out="2" non sfuma mai
  return 1 - (p - b.peak) / Math.max(1e-4, b.out - b.peak);
}
// alpha → style.opacity, più un piccolo translateY contro la direzione di scroll
```

Il beat-hero dev'essere visibile a scroll 0: `data-in="-0.1" data-peak="0"`. Se il frame
finale ha il soggetto centrato, ancora il pannello finale a lato così il soggetto resta
protagonista.

## Header adattivo (chrome fisso sopra un film che cambia)

Campiona la striscia alta del frame disegnato ogni ~180ms in un canvas offscreen 16×4,
media la luminanza, attiva/disattiva una classe `.on-light` (soglia ≈ 138). Tutti i colori
del header passano da `currentColor` così una classe sola ribalta tutto. Un **readout di
capitolo** (etichetta + barra sottile) fa da UI narrativa e di progresso — o tematizzalo
(es. un altimetro vivo che scende col film).

## Passaggio di cucitura (film → contenuto, nessuna linea visibile)

Lo script di assemblaggio campiona il colore della striscia bassa dell'ultimo frame.
La sezione successiva parte **esattamente da quell'hex**, e sullo stage del film un
overlay di dissolvenza verso il basso entra negli ultimi ~8% di progresso
(`(p - 0.92) / 0.08`). Grana e vignettatura sfumano con la stessa rampa. Se il film
finisce scuro e il contenuto è chiaro, costruisci una "zona di atterraggio" a gradiente
alto che scioglie scuro → chiaro-brand nel primo blocco di contenuto.

## Strato ambientale del hero (facoltativo, gratis, vende l'apertura)

Particelle canvas a tema (luccichio di neve, polline dorato, scintille) sopra il primo
frame statico, che sfumano nei primi ~7% di scroll: uno sprite offscreen a gradiente
radiale da 32px, `drawImage` per particella con profondità per-particella
(dimensione/velocità/alpha), twinkle a seno. Mai `shadowBlur` (costoso). Smetti del tutto
di renderizzare quando l'alpha arriva a 0. Salta sotto `prefers-reduced-motion`.

## Il contratto dev (ganci di verifica — in ogni build)

```js
const JUMP = new URLSearchParams(location.search).get('jump');
if (JUMP !== null) history.scrollRestoration = 'manual';   // e salta l'init dello smooth-scroll
// dopo che tutto è caricato e assestato:
if (JUMP !== null){ scrollTo(0, +JUMP || 0); /* ricalcola il progresso, disegna, un tick */ }
window.__ready = true;   // con ?jump: SOLO a film interamente caricato e frame di destinazione disegnato
```

`?jump=<y>` deve atterrare già scrollato con tutto lo stato scroll-driven forzato a regime
(per le build pure-code: `ScrollTrigger.update()` e poi imposta esplicitamente il
`totalProgress` di ogni animazione scrubbata). `__ready` fa da cancello per il banco di
screenshot. Nascondi eventuali cursori-follower fino al primo `mousemove` vero o
fotobombano le catture a (0,0).

Misuratore di scatti per la console: traccia i delta rAF per frame, logga il `max` ogni
2s. Giudica p95/max, mai gli fps medi — una media a 60fps nasconde perfettamente picchi di
decodifica da 80ms.

---

## Film in puro codice (Corsia A) — il vocabolario del motion

Il "film" è una sequenza di scene guidate dallo scroll. Aggancia Lenis al ticker di GSAP:

```js
const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
```

Vocabolario da cui comporre (scegli ciò che racconta il viaggio di QUESTO brand):
- **Rivelazione del wordmark carattere-per-carattere** — split in span, stagger
  `yPercent:120 → 0` con `power4.out`.
- **Scene fissate e scrubbate** — timeline `pin: true, scrub: true, end: '+=140%'`
  (una forma che cresce/ruota, un "vortice" di blend, una maschera che si apre a tutto
  schermo).
- **Corsa orizzontale fissata** — trasla una traccia `width:max-content` di
  `-(scrollWidth - innerWidth)`; dai ai figli la loro parallasse via `containerAnimation`.
  Usa `invalidateOnRefresh: true`.
- **Rivelazioni clip-path** — `inset(0 0 100% 0) → inset(0)` allo scroll per righe
  editoriali.
- **Velocity-skew** — inclina un nastro/marquee con `ScrollTrigger.getVelocity()`
  clampato.
- **Contatori** — trigger `once: true` con `snap: { textContent: 1 }`.
- **Deriva marquee** — `xPercent: -50, repeat: -1` su una riga raddoppiata.

**Legge di ordinamento (killer silenzioso):** gli ScrollTrigger si aggiornano in *ordine
di creazione*. Crea prima TUTTE le scene fissate, gli effetti ambientali/di sfondo
**dopo** — altrimenti le posizioni calcolate prima che esistano gli spacer dei pin sono
silenziosamente sbagliate (effetti che partono migliaia di pixel prima).

Prestazioni: solo proprietà GPU (transform/opacity), `will-change` sui pochi nodi in
movimento, nessuna lettura che sporca il layout nei ticker. Stesso contratto dev + stesso
misuratore di scatti della Corsia B.
