# Il Playbook dello Scroll-Film (Corsia B — riprese cinematografiche)

Regole per rendere l'intera pagina un unico film generato continuo. Sono un
pavimento, non un soffitto: infrangile sapendolo, mai per sbaglio.

## 1. Legge del girato-prima
Il film è la fonte di verità; il sito è un proiettore. Progetta prima l'arco della camera
(un solo viaggio continuo, ~5 capitoli), poi costruisci la pagina attorno al girato che
torna DAVVERO. Mai fare lo storyboard del sito e forzare il girato a combaciare: il girato
deriva, il copy costa niente da spostare.

## 1b. La forma di default — 5 clip × 5s. Parti da qui, poi conferma con la persona.

Usa questo confronto come modello di pianificazione:

| | forma consigliata | forma sovradimensionata |
|---|---|---|
| clip | **5** | 9 |
| per clip | **~5s** | 8s |
| totale | **~25s** | 72s |
| frame a 24fps | **~600** | 1.728 |
| scrub effettivo se tagli a 300 frame | **~12fps** | ~4fps |

**Proponi 5 × 5s = 25s come default e conferma con la persona prima di generare.**
Di' numero di clip, secondi ciascuna, durata totale e l'ordine di grandezza del costo
(vedi DISCIPLINA DEI COSTI nella SKILL), e fatti dire sì. Mai generare una forma di film
che nessuno ha approvato.

Perché il corto vince (e non è una questione di gusto):

- **Un film da 25s è ~600 frame. Uno da 72s è ~1.728.** La pagina deve spedire abbastanza
  frame da preservare il movimento, o lo scrub degrada in proporzione esatta. ~600 JPEG a
  1024px sono un peso sano; 1.728 no — e allora qualcuno li "ottimizza" a ~300, che su 72
  secondi è una **slideshow a 4fps**. È la prima causa di movimento visibilmente scattoso:
  il motore è sano, semplicemente non ha nulla da disegnare.
- **La distanza per clip è ciò che rompe la continuità.** Cinque secondi di viaggio sono un
  salto che il modello sa fare. Otto secondi gli chiedono location, scala e luce insieme:
  teletrasporta a metà clip e ottieni il jump-cut.
- **Costa meno.**

Vai più lungo solo se la persona lo chiede E accetta il peso dei frame. Se vuole un viaggio
più lungo: **più clip**, non più secondi per clip — 7 × 5s batte 5 × 7s sempre.

---

## 2. Legge della catena (giunture perfette)

**Usa Seedance 2.0, o il Seedance più nuovo che il provider espone** (su fal:
`bytedance/seedance-2.0/image-to-video`). Mai scendere in silenzio a un modello più
vecchio o non-Seedance perché una chiamata ha dato errore: riprova, o fermati e dillo.
Un film fatto zitti su un modello più debole non sembra rotto: sembra economico.

**L'UNICA LEGGE, VERA PER OGNI MOTORE (fal, Higgsfield, Kie, Replicate — tutti):
l'immagine di partenza della clip N è il LETTERALE ULTIMO FRAME estratto con ffmpeg
della clip N−1 — i pixel renderizzati veri — mai il keyframe.** Solo l'estremo lontano
(`end_image_url` / `end_image`) è il keyframe successivo. Il keyframe d'apertura avvia la
clip 1 e nient'altro.

### 2a. Il percorso lo decide il MOTORE, non la durata

È la prima decisione della Corsia B ed è quella che decide se il film dura 25 secondi o 15.
Falla giusta prima di spendere qualsiasi cosa. **La forma da 25s è raggiungibile solo
incatenando, e la catena funziona solo su un motore che onora davvero il pin di
partenza.** La domanda unica: questo motore atterra sui pixel che gli fissi?

| motore | onora il pin di partenza? | percorso |
|---|---|---|
| **fal Seedance 2.0 (pieno)** | verificato sul campo (2026-08): sì | PERCORSO A |
| **fal Seedance 2.0 `fast`** | meno fedele (giuntura sotto soglia nei test): solo bozze | bozze, mai master |
| **Higgsfield Seedance** | testare il modello corrente; servono `start_image` E `end_image` nativi | PERCORSO A se il preflight passa |
| **Kie Seedance/Veo** | i wrapper possono reinterpretare i pin: misuralo | PERCORSO A solo se il preflight passa; altrimenti B |
| qualsiasi altro | **ignoto — misuralo** | una clip, una giuntura, poi decidi |

**PERCORSO A — il default. Incatena fino alla forma di riferimento.** Segui §1b, fissa
ENTRAMBI gli estremi di ogni clip come in §2b, e valuta ogni giuntura con §3. Non
accorciare il film per evitare il lavoro sulle giunture: le giunture SONO il mestiere.

**PERCORSO B — il ripiego, e ti costa la seconda metà del film.** Quando il motore non
onora il pin di partenza, la catena non può produrre una giuntura pulita a nessun prezzo:
la risposta migliore è una singola ripresa, al massimo della durata consentita, fissata al
keyframe iniziale e finale, con l'intero viaggio scritto come un unico movimento. È un
**salvataggio, non uno stile**: compra la continuità rinunciando al ~40% della durata e ai
capitoli distinti. Dillo chiaramente invece di consegnare in silenzio la versione corta.

Su entrambi i percorsi, scrivi il prompt come un'unica catena di frasi attraverso i
capitoli ("inizia su X… scende oltre Y… continua giù fino a Z"), e sul Percorso B aggiungi
esplicitamente *"one single unbroken shot, no cuts, no edits, continuous camera move
throughout"*.

### 2b. La catena — come si fa, e la trappola che la fa fallire

**Non dare per scontato che un motore atterri esattamente sui frame che fissi.** Alcuni
wrapper trattano il pin come un suggerimento visivo, non come un frame fedele al byte. Il
test decisivo: estrai l'ultimo frame della clip 1, verificane l'upload, usalo come
partenza della clip 2. Se la clip 2 apre su un'immagine visibilmente diversa, il motore ha
re-immaginato il pin — e **nessun trucco di prompt lo sistema**: verifica sulla PRIMA
giuntura prima di pagare il resto.

**Anche un prompt che contraddice il pin finale rompe la giuntura.** L'errore comune è
usare le descrizioni dei keyframe come prompt di movimento: la clip descrive dov'è già,
invece di viaggiare verso la destinazione, quindi si pianta o inventa uno stacco.

> **Il prompt di una clip descrive il VIAGGIO dal pin iniziale al pin finale — mai lo
> stato di uno dei due estremi.** *"Continua la stessa discesa e viaggia verso l'apertura
> scura"* si muove. *"Il soggetto riposa nel punto di partenza"* no.

Due controlli gratuiti prima di spendere:

- **Audit dello sfasamento.** N keyframe = N−1 clip. Se l'array di clip è lungo N, o i
  suoi elementi si chiamano `kf*`, stai per mandare descrizioni di keyframe come prompt di
  movimento. Stampa `clip[i].prompt` accanto a `kf[i] → kf[i+1]` e leggili come una frase:
  *questo testo mi porta dalla prima immagine alla seconda?*
- **Parole di destinazione.** Ogni prompt di clip deve nominare qualcosa di visibile nel
  keyframe FINALE che è assente in quello iniziale.

Per i motori a URL l'ultimo frame estratto è un file **locale**: va caricato per avere un
URL (su fal: REST `storage/upload/initiate` + PUT, ridotto a JPEG ~1080px). I keyframe
stanno già su un CDN; gli ultimi frame veri no.

Ogni partenza è l'**ultimo frame letterale estratto con ffmpeg** della clip precedente —
non un keyframe somigliante: i pixel veri. E **fissa anche l'estremo lontano**:

```bash
ffmpeg -sseof -0.05 -i clipN.mp4 -update 1 -q:v 1 clipN-ultimo.png
# su fal: image_url = clipN-ultimo (caricato) · end_image_url = kf(N+1)
# duration 5 · generate_audio false · risoluzione scelta dalla persona
```

**Entrambi gli estremi, sempre.** Una clip fissata a un solo estremo è libera di vagare e
poi "tagliare" verso dove deve arrivare — e quel taglio è il salto che il visitatore vede.
Solo il keyframe d'apertura avvia la catena; ogni partenza successiva è un ultimo frame
reale. La catena è **sequenziale** (la clip N finisce prima che parta la N+1: mai in
parallelo). Una direzione di camera continua (sempre in discesa / sempre in avanti): le
inversioni si leggono come stacchi. Clip di lunghezza uniforme = velocità di scrub
costante. Audio spento: uno scroll-film è muto.

## 2c. Leggere l'SSIM senza gridare al lupo

Un punteggio basso tra due frame significa **guarda**, non **bocciato**. Il movimento
veloce abbatte l'SSIM anche su un movimento perfetto. Distingui guardando tre campioni
consecutivi:

- **Movimento veloce** — stessi oggetti, stessa luce, stesso mondo, trasformati
  progressivamente. Va bene.
- **Teletrasporto / stacco** — composizione diversa, luce diversa, un oggetto che appare o
  sparisce. Fallimento vero.

Dentro una singola clip un vero stacco è raro per costruzione; tra due clip generate
separatamente è il default. Giudica **severamente le giunture** e **generosamente
l'interno delle clip**.

## 3. Il gate di giuntura (misurato, mai a occhio)
```bash
ffmpeg -i A-ultimo.png -i B-primo.png -lavfi ssim -f null - 2>&1 | grep All
```
- **≥ 0,88 promossa** · 0,80–0,88 guardala in movimento · un vero fallimento è
  **strutturale**.
- L'SSIM sottostima sulle texture caotiche (nuvole ~0,66, braci/scintille ~0,72,
  caustiche ~0,60 possono essere perfette). Il numero dice *dove* guardare; il confronto
  fianco-a-fianco decide.
- Il fallimento reale #1 è la **deriva di grading/geometria** (un'alba inventata, un
  orizzonte nuovo). Si ripara rigenerando con: *"Continue the exact same shot from the
  reference frame, identical framing, identical colour grade. Do not change the colour
  grade."* — e generando il keyframe di arrivo DALL'ultimo frame reale, non dal keyframe
  precedente.
- **Dissolvenze sopra una giuntura cattiva: VIETATE** — lo scrub permette di fermarsi
  esattamente sulla cucitura, e la maschera si vede subito. Ripara, non nascondere.

## 4. Verità di fatturazione
- **Audio off** è LA leva di costo.
- La qualità la sceglie la persona allo STEP 1 (default alta). Ordine di grandezza prima,
  dashboard del provider per il consuntivo. Niente preventivi al centesimo.
- Se un job fallisce lato server, verifica lo stato di fatturazione prima di rilanciare.

## 5. Assemblaggio
- Concatena scartando il frame doppio di giuntura (`select='gte(n,1)'` dalle clip 2 in
  poi), e **sempre `-fps_mode vfr`** sul master: il sync CFR imbottisce ~5 frame duplicati
  per giuntura = zone di scrub congelate.
- Estrai **ogni frame** alla cadenza nativa (25s/24fps = tutti i **601** JPEG) a
  **1024-1440px, `-q:v 5-6`**. Mai decimare: dimezzare i frame dimezza lo scrub. Se pesa
  troppo, riduci **larghezza e qualità, mai il numero di frame**.
- Campiona il colore del bordo dell'ultimo frame → l'hex della cucitura per il passaggio
  film→contenuto.

`scripts/assemble.sh` implementa concat+estrazione (percorso Higgsfield in
`scripts/chain-step.sh`; su fal stesse operazioni via REST/MCP con lo stesso contratto).

## 6. Il motore di scrub (perché è senza scatti)
- **Canvas + JPEG pre-estratti**, mai lo scrubbing di `<video currentTime>` (stutter).
- **Finestra scorrevole di ImageBitmap**: `drawImage(HTMLImageElement)` forza una
  decodifica JPEG *sincrona* sul main thread al primo paint — quel picco È lo scatto.
  `createImageBitmap` decodifica fuori thread; finestra di bitmap attorno al playhead
  (~2s di film in avanti, chiudi ed espelli oltre): ogni draw è un puro blit GPU.
- Playhead smorzato (`current += (target-current)*0.14`). DPR massimo 1.0-1.5.
- Lenis per lo scroll; pompa immagini a concorrenza limitata; fallback `nearestFrame()`
  così un frame mancante non svuota mai il canvas.
- **Scatti misurati coi delta rAF (p95/max), mai fps medi.** Target max <50ms.

## 7. Chrome della pagina, cucitura e strato ambientale
- **Header adattivo**: campiona la luminanza della striscia alta del frame (~ogni 180ms) →
  classe `.on-light`. Un header fisso sopra un film che cambia non ha un colore solo.
- **Passaggio senza cuciture**: la sezione dopo il film parte ESATTAMENTE dal colore
  campionato dell'ultimo frame.
- **Strato ambientale del hero** (facoltativo, gratis): particelle canvas a sprite in tema
  (scintille, polline, neve) sopra il primo frame, che sfumano nei primi ~7% di scroll.
  Uno sprite radiale offscreen + `drawImage` per particella (mai `shadowBlur`); rendering
  spento del tutto ad alpha 0.
- Grana e vignettatura vendono la "ripresa unica"; sfumale col passaggio.

## 8. Il banco di verifica
Le anteprime nei pannelli host strozzano i tab nascosti (rAF congelato → screenshot
stantii). Via affidabile: puppeteer-core + Chrome di sistema + contratto dev:
- `?jump=<scrollY>` → atterra già scrollato, stato forzato a regime.
- `window.__ready = true` solo a frame decodificati e assestati (con `?jump`: a
  caricamento completo del film).
- Cattura: `goto → waitForFunction(__ready) → ~1200ms → screenshot`. Su ogni beat E ogni
  giuntura. Cursori-follower nascosti fino al primo mousemove vero.

`scripts/verify.js` fa cattura + test degli scatti.

## 9. Governo del processo
Gusto e codice del design: solo il modello Claude. Passi meccanici (ffmpeg, SSIM,
puppeteer, vercel): puro codice, senza modello. Ordine di grandezza dei costi prima di
spendere; consuntivo dopo. Una ripresa continua, un mondo per brand.
