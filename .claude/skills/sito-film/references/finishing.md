# Rifinitura — le parti che decidono se sembra costoso

Il film è solo metà del lavoro. I problemi di rifinitura in questo file possono minare un
girato forte: leggilo prima di scrivere la pagina.

---

## 1. Rifila la testa del film. Quasi sempre.

I film generati spesso aprono su un'inquadratura che non appartiene al movimento — una
macro statica, un framing diverso, un beat che non ha ancora iniziato a viaggiare. Si
legge come un jump-cut dentro il tuo stesso film, ed è la prima cosa che chiunque vede.

**Guarda il primo secondo frame per frame prima di cablare qualsiasi cosa**, e taglia
finché il primo frame non è già *dentro* il movimento:

```bash
# occhio ai primi 2s (24fps → f_0001..f_0048)
ffmpeg -v error -i film.mp4 -vf "select='lt(n,49)',scale=300:-1" -vsync 0 /tmp/testa_%03d.jpg
# poi ri-estrai dal frame che scorre davvero
ffmpeg -y -v error -ss 2.0 -i film.mp4 -vf scale=1024:-2 -q:v 6 frames/f_%04d.jpg
```

Poi **aggiorna `FRAME_COUNT` al nuovo conteggio** — dimenticarlo è il modo più comune in
cui un film rifilato si rompe (il motore chiede frame che non esistono più e il canvas si
svuota a fine scroll).

---

## 2. Chrome sopra il girato

Un header che galleggia sopra un film deve restare leggibile su **ogni** frame, e un film
passa da alte luci accecanti a quasi-nero in uno scroll. Crema-su-favo-luminoso sparisce.

La soluzione sono tre cose economiche insieme:

```css
.brand-word, nav a{ color:#fff; text-shadow:0 1px 22px rgba(0,0,0,.55); }
.brand-mark{ filter:drop-shadow(0 1px 10px rgba(0,0,0,.5)); }
.site-header::before{        /* scrim morbido: il chrome non poggia mai su girato nudo */
  content:""; position:absolute; inset:0 0 auto 0; height:180%; z-index:-1;
  background:linear-gradient(to bottom, rgba(8,4,2,.62), rgba(8,4,2,0));
}
```

**Bianco, non crema** — il crema si legge come sporco sopra girato luminoso. Stesso
trattamento per il testo dei beat: uno scrim radiale morbido sotto ogni beat tiene il
carattere attraverso il centro scuro del film senza appiattire l'immagine.

```css
.beat::before{
  content:""; position:absolute; z-index:-1; inset:-70% -24% -70% -14%;
  background:radial-gradient(60% 58% at 22% 50%, rgba(6,3,1,.72), rgba(6,3,1,.42) 45%, transparent 78%);
}
```

Verifica entrambi gli estremi con uno screenshot: il frame più luminoso e il più scuro.

---

## 3. La pagina sotto il film è dove le build si sgonfiano

Il film può sembrare cinematografico e poi crollare in una pila di blocchetti di testo
corti ed equidistanti. Le sezioni sotto devono conservare la stessa sicurezza e lo stesso
ritmo visivo.

Minimi per ogni sezione sotto il film:

- **Presenza verticale.** `min-height: min(92vh, 900px)` e contenuto centrato in
  verticale. Le sezioni corte si leggono come riempitivo, per quanto buono sia il copy.
- **Contrasto di scala.** Ogni sezione ha UN elemento molto più grande del resto. Se ogni
  titolo è grande come gli altri, la pagina non ha ritmo.
- **Movimento d'arrivo.** Salita-e-dissolvenza all'intersezione, sfalsata sui figli di
  ~90ms. Sempre dietro `prefers-reduced-motion`.

```css
.section .wrap > *{ opacity:0; transform:translateY(26px);
  transition:opacity .9s var(--ease-out), transform .9s var(--ease-out); }
.section.in .wrap > *{ opacity:1; transform:none; }
.section.in .wrap > *:nth-child(2){ transition-delay:.09s; }
```
```js
const io = new IntersectionObserver((es)=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}), { rootMargin:'0px 0px -12% 0px', threshold:.12 });
document.querySelectorAll('.section').forEach(s=>io.observe(s));
```

- **La CTA primaria dev'essere l'elemento più sicuro di sé della pagina.** Non un link
  testuale: un trattamento vero — bagliore a riposo, sweep di luce all'hover, sollevamento
  alla pressione — e se c'è un prezzo, mettilo nel font display dietro un divisore, con
  peso suo.

---

## 4. Loghi di brand veri — scaricali, mai disegnarli

Quando il brand esiste, usa il **suo** asset. Disegnare a mano un marchio come SVG inline
brucia 20-30 minuti e il risultato non è mai giusto. Budget: **un** tentativo, poi passa a
testo vivo nel carattere del brand.

```bash
curl -sL -A "Mozilla/5.0" https://brand.com/ -o /tmp/b.html
grep -oiE 'https?://[^"'"'"' ]*\.(svg|png|webp)' /tmp/b.html | grep -iE 'logo|brand' | head
```

I brand di solito pubblicano un marchio monocolore. Se è nero e il sito è scuro,
ricoloralo invece di cercare la versione bianca — conserva l'alpha, sostituisci l'RGB:

```python
from PIL import Image
im = Image.open('logo.png').convert('RGBA'); px = im.load()
for y in range(im.size[1]):
    for x in range(im.size[0]):
        r,g,b,a = px[x,y]
        if a: px[x,y] = (255,255,255,a)
im.save('logo-bianco.png')
```

---

## 5. Il mobile è un film diverso, non un film più stretto

Un film 16:9 in letterbox o ritagliato al centro su un telefono butta via il soggetto.
Genera un **vero passaggio 9:16** (stesso viaggio, stesso grading,
`aspect_ratio: "9:16"`), tieni i due set di frame alla stessa lunghezza così il playhead
mappa 1:1, e scambia al breakpoint:

```js
const mq = window.matchMedia('(max-width: 768px)');
let FRAME_DIR = mq.matches ? DIR_MOBILE : DIR_DESKTOP;
mq.addEventListener('change', () => {
  FRAME_DIR = mq.matches ? DIR_MOBILE : DIR_DESKTOP;
  frames.forEach(b => b && b.close && b.close());   // le bitmap decodificate appartengono al vecchio set
  frames.clear(); pending.clear();
  warmAround(current);                              // ricarica: il canvas non deve mai svuotarsi
});
```

Chiudere le vecchie `ImageBitmap` conta: saltarlo perde memoria GPU a ogni rotazione.

---

## 6. Verificare senza ingannarsi

- **Uno screenshot di un viewport nascosto o a dimensione zero è nero.** Prima di credere
  a una cattura nera, leggi `canvas.width`/`innerWidth`: se sono 0 il pannello è nascosto,
  non rotto.
- **Campiona il canvas, non fidarti dell'immagine.** `getImageData` al centro per tre
  posizioni di scroll: tre colori diversi = il film sta davvero scrubbando.
- La corsa headless è il controllo deterministico — viewport fisso, nessun pannello di
  mezzo. È inclusa in `scripts/shot.js`. **Setup una-tantum su una macchina nuova:**

```bash
cd scripts && npm install    # una volta, scarica puppeteer-core (nella cartella della skill)
```

```bash
node scripts/shot.js http://localhost:PORTA out.png 1440 900 0.35   # url, out, w, h, frazioneScroll
```

  Serve Chrome o Chromium installato (imposta `CHROME_PATH` se sta in un posto insolito),
  e stampa cosa ha catturato davvero — `innerWidth`, `scrollY`, la dimensione del canvas e
  se la pagina straborda in orizzontale. **`canvas: none` o `innerWidth: 0` significa che
  la pagina non è mai montata, non che il film è nero.**

- Verifica **entrambi** i breakpoint (es. 1440×900 e 390×844) ogni volta che film o layout
  cambiano. Il mobile è una consegna, non un ripiego.
