---
name: sito-film
description: >-
  Costruisce un sito web scroll-film davvero bello: l'intera pagina è un'unica ripresa
  cinematografica continua che avanza mentre il visitatore scorre. Fa una breve intervista,
  propone 2-3 concept con un nome, definisce la direzione artistica e poi costruisce tutto
  da zero. Due corsie: motion in puro codice GSAP/Lenis (gratis, zero setup, funziona per
  chiunque), oppure un film di riprese generate con il motore image-to-video dell'utente
  (riferimento: Seedance 2.0 su fal.ai; Higgsfield o Kie.ai come alternative).
  Attivare su: "sito film", "sito cinematografico", "scroll-film", "scrollytelling",
  "sito che si muove mentre scorri", "sito animato premium", "sito a ripresa continua",
  "costruiscimi un sito animato/scroll". NON per slide deck, spiegazioni HTML o siti
  brochure statici.
---

# Sito-Film Studio

> La skill di Michele Cotti per i siti scroll-film. Motore video di riferimento: fal.ai.

## COSA SERVE (leggi prima di promettere qualsiasi cosa alla persona)

- **Sempre**: Claude Code su macOS o Linux (su Windows serve WSL: gli script di verifica e
  assemblaggio sono shell). Connessione internet (GSAP/Lenis via CDN, font Google).
- **Per le verifiche automatiche** (screenshot + fluidità): Node con `npm install` fatto
  una volta nella cartella `scripts/` della skill, e un Chrome/Chromium installato.
- **Solo Corsia B (film vero)**: `ffmpeg` installato (`brew install ffmpeg` su Mac) e una
  chiave fal (`FAL_KEY`) — la guida alla connessione è nello STEP 0, domanda 5.
- Se manca qualcosa, **dillo subito e guida l'installazione**: mai fallire a metà build
  per un prerequisito che si poteva controllare all'inizio.
- I **prompt verso i modelli video e immagine li scrivi in inglese** (rendono meglio);
  con la persona parli nella sua lingua e il copy del sito è nella sua lingua.

Costruisci **siti scroll-film**: l'hero *è* la pagina — un'unica ripresa cinematografica
senza stacchi che avanza mentre il visitatore scorre, e poi si dissolve senza cuciture nel
contenuto sottostante. Questa skill è un **processo, non un template** — non ci sono pagine
da copiare. Ogni sito è progettato e scritto da zero per il suo brand, guidato dal processo
qui sotto e dalla legge tecnica in `references/`.

Due modi per fare il film:

- **Corsia A — Puro codice (default, zero setup):** il "film" è motion GSAP + Lenis —
  scene fissate (pinned), parallasse, rivelazioni con clip-path, corse orizzontali. Costa
  zero, non servono account, funziona per chiunque scarichi questa skill.
- **Corsia B — Riprese cinematografiche (opt-in):** il film è video generato per davvero,
  incatenato clip-dopo-clip e proiettato su canvas legato allo scroll. **Motore di
  riferimento: `bytedance/seedance-2.0/image-to-video` su fal.ai** —
  verificato: espone `image_url` (fotogramma iniziale) E `end_image_url` (finale), cioè il
  pin a entrambi gli estremi che la catena richiede. Il tier `fast` costa meno ma è **solo
  per le bozze**: nella verifica del 2026-08-04 la sua fedeltà al pin di partenza ha
  prodotto una giuntura sotto soglia (0,795 < 0,88) — le clip definitive si generano sul
  modello pieno. Alternative valide se l'utente le ha già: Higgsfield (`seedance_2_0` via
  CLI) o Kie.ai (Seedance/Veo via `kie-chain.py`). Un motore che sa fissare solo il
  fotogramma iniziale NON basta per questa corsia. Serve l'account dell'utente + crediti.
  Questo è il look distintivo.

Tutti ottengono un risultato bellissimo: la Corsia A è sempre disponibile; la B si sblocca
quando c'è un motore video.

---

## LA REGOLA D'ORO — il design lo fa il miglior modello disponibile, e non si delega mai

**Esegui questa skill sul modello più forte a cui hai accesso, al massimo livello di
ragionamento disponibile**, e tieni su quel modello ogni decisione di gusto: concept,
direzione artistica, palette, tipografia, layout, motion design, copy, la build stessa
(tutto l'HTML/CSS/JS) e la revisione finale del design.

Se stai girando su un tier veloce o economico, fermati e cambia prima di iniziare.
L'output di questa skill viene giudicato come un sito premium, e nessun processo salva un
design fatto da un modello scelto per la velocità.

Delega solo due cose, e mai il design:

- **Lavoro meccanico** → puro codice senza alcun modello (ffmpeg, punteggi SSIM,
  estrazione frame, verifiche, deploy).
- **Bozze delimitate** → sub-agent freschi (il prompt video di un capitolo, una sezione
  post-film, l'avversario dello STEP 1). Lo stesso modello va benissimo: ciò che rende
  utile un sub-agent è il contesto fresco, non pesi diversi.

**Ogni brand ha la sua pagina.** Non ri-vestire un sito costruito prima nella stessa
sessione — stessa struttura, stessi beat, nuova palette: è il modo più rapido per produrre
due siti mediocri invece di uno buono, ed è invisibile a ogni gate perché entrambe le copie
passano identiche. Il motore è infrastruttura condivisa e va bene così; la pagina no.

---

## STEP 0 — L'intervista

Fai queste domande subito (raggruppale; se il harness ha una UI a domande strutturate,
usala). **Ogni domanda creativa ha la via "decidi tu"** — se l'utente delega, la direzione
artistica la fai tu e vai avanti. Mai bloccarsi su una scelta di design che sai fare bene.

1. **Cosa stiamo costruendo, e la vibe in una riga?**
   Nome del brand/prodotto, cos'è, e la sensazione. (Es. *"VOLTA — team di corse
   elettriche. Aggressivo, elettrico, veloce."*)
2. **Asset di brand esistenti, o creo io il mondo?**
   Logo / colori / font / foto reali — oppure libertà creativa totale.
3. **Il viaggio — l'unica ripresa continua, da cima a fondo.**
   Dove parte la camera e dove finisce — la *trasformazione*. (Es. *"campo al chiaro di
   luna → dentro un fiore → una goccia d'oro → la bottiglia."*) Oppure: "disegna tu l'arco
   dal mio brand." **È il cuore di tutta la build.**
4. **Video vero, o puro motion?** → sceglie Corsia B o A. Se incerto o zero-setup,
   default **Corsia A (puro codice)**.
5. **(Solo Corsia B) "Con che motore video generiamo?"** Il riferimento è **fal.ai**:
   modello pieno `bytedance/seedance-2.0/image-to-video` per le clip definitive, tier
   `fast` per le bozze. Prima di tutto **verifica se la chiave c'è** (`echo $FAL_KEY`, o
   un file `.env` del progetto). Alternativa dell'utente (Higgsfield, Kie…): va bene, ma
   prima leggi `references/playbook.md` §2a — un motore che non onora il pin di partenza
   non si può incatenare pulito e ti riduce a una singola ripresa ≤15s. Dillo chiaramente
   prima della scelta. Poi: quanti capitoli (clip)? — La scelta bozza/qualità alta si fa
   allo STEP 1 insieme ai concept (default: direttamente in alta).

   **⚠️ Se la chiave NON c'è: non bloccarti MAI e non dare errori secchi.** Fai due cose,
   in quest'ordine:
   - **Offri subito la Corsia A** (gratis, zero account): la persona ottiene comunque un
     sito bellissimo oggi stesso.
   - **Guidala tu, passo passo, a collegare fal** se vuole il film vero:
     1. vai su **fal.ai** e crea un account (c'è un piano con crediti iniziali);
     2. dashboard → **Keys** → crea una API key e copiala;
     3. mettila nell'ambiente: `export FAL_KEY="..."` nel profilo della shell
        (`~/.zshrc` o `~/.zshenv`), oppure in un file `.env` del progetto;
     4. riapri la sessione e riverifica con `echo $FAL_KEY`.
     Accompagna la persona comando per comando, come un onboarding: la chiave è SUA e
     resta solo sul suo computer. Mai chiedere di incollare la chiave in chat se si può
     evitare; mai salvarla dentro la skill o nel progetto condiviso.
6. **Cosa viene dopo il film?** Le sezioni sotto la ripresa (collezione / listino /
   prenotazione / manifesto…), la call-to-action primaria, contatti + social.
7. **Dove va online?** Solo locale, o pubblicazione sul *loro* Vercel.

---

## STEP 1 — Proponi i concept (prima di costruire qualsiasi cosa)

Dall'intervista, sviluppa **2-3 concept creativi con un nome** e proponili. Regole:

- Apri con il concept **raccomandato**, marcato esplicitamente "(Consigliato)".
- Ogni concept ha una *passeggiata concreta di ciò che si vede*, non una tesi in una riga —
  narra lo scroll: cosa vede il visitatore in cima, cosa succede scendendo, cosa mostra
  ogni capitolo, come il film si risolve nel contenuto.
- Dai un nome a ogni concept (il titolo è metà della vendita), dichiara la corsia e il
  numero di capitoli.
- **(Corsia B) Insieme ai concept, chiedi la qualità**: *"Vuoi generare il film
  direttamente in qualità alta (1080p, consigliato: è quello che finisce online), oppure
  prima una bozza economica a bassa risoluzione per validare il viaggio?"* — **default:
  direttamente in alta.** La bozza è un'opzione per chi vuole spendere il minimo per
  vedere l'idea, non un passaggio obbligato. Sui costi niente promesse di preventivi
  precisi (il listino del provider è in "unità" poco leggibili): di' l'ordine di
  grandezza onesto — *"siamo su pochi euro per l'intero film in alta qualità, centesimi
  per una bozza"* — e a fine lavoro indica il saldo/dashboard fal per il consuntivo.
- **Sparring avversariale sui concept — OBBLIGATORIO, mai saltato.** Prima di presentarli,
  i concept vengono attaccati da qualcosa che non li ha scritti. **Default: un sub-agent
  fresco** (tool Task/Agent) — lo stesso modello va benissimo. Una seconda CLI frontier
  (`codex`, `gemini`) è un di più, non un requisito; se la usi, mettila in background con
  timeout e dopo UN tentativo lento o fallito uccidila e ripiega sul sub-agent. Mai andare
  in loop su questo step. Ciò che rende vera la critica è il contesto fresco: l'avversario
  riceve i concept e il brand, mai il tuo ragionamento, mai quale preferisci, mai il fatto
  che li hai scritti tu. Chiedigli di (a) attaccare ogni concept — il viaggio è leggibile?
  memorabile? fattibile in N capitoli? la trasformazione trasforma davvero, o sono quattro
  scene slegate in fila? — e (b) proporre un angolo jolly che non hai considerato. Integra
  ciò che sopravvive (cita lo sparring in una riga).
  **È critica di strategia, non di design: l'avversario non scrive mai copy, codice o
  decisioni di design; tu arbitri e tu firmi.**
  *Un modello che revisiona il proprio lavoro appena scritto nello stesso contesto non è
  una revisione: tende a difendere ciò che ha appena sostenuto.*
- Lascia scegliere o mescolare; se dicono "scegli tu", prendi il raccomandato e vai.

Solo dopo la scelta del concept si costruisce.

---

## STEP 2 — Direzione artistica del mondo (tu, da solo)

Decidi e fissa: palette (hex esatti), una **coppia tipografica** display+testo con vero
carattere (mai font di sistema — cerca display espressivi), un lockup del logo (SVG
inline), la sensazione del motion, i nomi dei capitoli. Font distinti e mondo distinto per
ogni brand. I loghi reali di tool terzi si prendono come SVG inline veri (mai un disegno a
mano di un logo reale).

---

## CORSIA A — Puro codice (default)

Scrivi una singola pagina HTML autonoma, da zero, per questo brand. Carica GSAP,
ScrollTrigger e Lenis da CDN (vendorizzali in locale per la produzione). Componi il film
con il vocabolario di `references/engine.md` §Puro-codice — scene fissate, timeline legate
allo scroll, hero con rivelazione carattere-per-carattere, corse orizzontali con parallasse
via containerAnimation, velocity-skew, contatori, marquee — disposti per raccontare il
viaggio di *questo* brand (la passeggiata dello Step 1 è il tuo storyboard). Poi le sezioni
di contenuto post-film + footer (SVG social veri), verifica e (a scelta) deploy.

Legge di ordinamento critica: **crea gli ScrollTrigger degli effetti ambientali/di sfondo
DOPO le scene fissate** — l'ordine di creazione è l'ordine di refresh; violarlo sposta
silenziosamente tutto ciò che viene dopo uno spacer di pin.

---

## CORSIA B — Riprese cinematografiche (qualsiasi motore image-to-video)

### Quale modello video — non negoziabile

**Riferimento: `bytedance/seedance-2.0/image-to-video` su fal.ai** (o il Seedance più
nuovo esposto quando leggi). Campi verificati: `image_url` (inizio, obbligatorio),
`end_image_url` (fine), `duration` "4"…"15" (usa **5**), `resolution` 480p→4k,
`aspect_ratio` (9:16 per il film mobile), `generate_audio` **sempre false**.
Il tier `fast` serve SOLO per validare la catena in bozza: per le clip definitive usa il
modello pieno (fedeltà del pin superiore, verificato sul campo). Mai scendere in silenzio
a un modello più debole perché una chiamata ha dato errore — riprova, o fermati e di' che
il motore è giù. Un film fatto zitto su un modello più debole è il fallimento più difficile
da vedere e più caro da rifare: non sembra rotto, sembra economico.

Su Higgsfield il riferimento è `seedance_2_0` (CLI, `--start-image`/`--end-image`); su Kie
c'è `kie-chain.py`. Tutto ciò che segue vale identico per qualunque motore.

---

Leggi prima `references/playbook.md` — è la legge di questa corsia. Il contratto di catena
è sempre lo stesso: genera → attendi → scarica → estrai l'ultimo frame → gate SSIM sulla
giuntura; cambia solo il come si chiama il motore. In breve:

1. **Storyboard** del concept scelto in N capitoli, una sola direzione di camera continua
   per tutta la discesa.

   **Default: 5 clip × 5 secondi = un film da 25 secondi, e confermalo con l'utente prima
   di generare qualsiasi cosa.** A 24fps sono ~600 frame: spedibili senza ridurre il motion
   a una slideshow. Dichiara numero di clip, secondi, durata totale e costo corrente, e
   fatti dire sì. Se vogliono un viaggio più lungo: **più clip**, non più secondi per clip.

   **Budget sulla distanza, non sulla durata.** Ciò che rompe un film è quanta strada
   chiedi a UNA clip, non quanto dura il film:

   > **Una clip = una direzione di camera, una location, uno stato di luce.**
   > Se una delle tre deve cambiare, è un'altra clip.

   **E tutto il film ha UN vettore.** Nominalo in una frase prima di scrivere una clip
   (*"la camera va solo più dentro"*, *"la camera scende soltanto"*), poi ogni clip deve
   continuare quel vettore. Scrivi le transizioni, non solo le inquadrature: il prompt di
   ogni clip dice **come continua la precedente** (*"proseguendo la stessa spinta in
   avanti, ora oltrepassando…"*), mai solo cosa contiene. La giuntura è il prodotto.

   Una sola inversione è ammessa se l'inversione È la storia — dichiarata nel vettore.
   Audit gratuito prima di spendere un credito:

   ```bash
   python3 scripts/vector-check.py <storyboard.json>   # deve dare PASS
   ```

2. **Genera il film.** Su fal, per ogni clip — alla **qualità scelta dalla persona allo
   STEP 1** (default: modello pieno a 1080p; il tier `fast`/480p solo se ha chiesto la
   bozza economica):
   `image_url` = **l'ultimo frame REALE estratto (ffmpeg) della clip precedente** (mai il
   keyframe) · `end_image_url` = il keyframe successivo · catena **sequenziale** (la clip N
   deve finire prima che parta la N+1: mai in parallelo). I keyframe stessi sono una
   catena: il keyframe N+1 si genera con il precedente (o con l'ultimo frame reale) come
   riferimento, così palette, luce e scala si ereditano invece di reinventarsi. I frame
   estratti sono file locali senza URL: vanno caricati sul CDN fal (REST
   `storage/upload/initiate` + PUT) ridotti a JPEG ~1080px.
   Preventivo con `mcp__fal__get_pricing` + conferma PRIMA di generare.

3. **Gate di continuità sull'INTERO film prima di costruire qualsiasi cosa** —
   `zsh scripts/continuity-gate.sh <cartella-frame> 8` deve dare PASS. Le cuciture
   combaciano *per costruzione*; ciò che sfugge è il **centro** di ogni clip (il modello
   può "tagliare" invece di viaggiare se gli chiedi troppa strada). La causa è quasi sempre
   la granularità dello storyboard, non il motore: più clip, ognuna che si muove meno.

4. **Gate su ogni giuntura** — misurato, mai a occhio (soglie in `playbook.md` §3:
   ≥0,88 pass · 0,80-0,88 guardala in movimento · sotto = strutturale). Si ripara
   rigenerando con il linguaggio di continuazione esatta del playbook. Le dissolvenze
   sopra una giuntura cattiva sono vietate.

5. **Assembla** con `scripts/assemble.sh` (toglie i frame doppi di giuntura, codifica
   `-fps_mode vfr`, campiona il colore della cucitura). **Estrai alla cadenza NATIVA del
   film** — un film da 25s a 24fps spedisce ~601 JPEG; dimezzare i frame dimezza lo scrub.
   Scambia risoluzione per frame, mai il contrario.

5b. **Rifila la testa del film** e aggiorna `FRAME_COUNT` al conteggio rifilato
   (`references/finishing.md` §1): i film generati spesso aprono su un'inquadratura che
   non si è ancora mossa, e si legge come un jump-cut dentro il tuo stesso film.

6. **Costruisci la pagina da zero** attorno al girato: il motore di scrub su canvas di
   `references/engine.md` (finestra scorrevole di ImageBitmap — il cuore anti-scatto,
   playhead smorzato, header adattivo, capitoli/altimetro, beat sovrapposti, cucitura
   film→contenuto, contratto dev `?jump`/`__ready`). Scrivila per questo brand.

Se il provider segnala un errore lato server, verifica lo stato di fatturazione prima di
ritentare.

---

## IL MODELLO DI DELEGA (come i token restano bassi)

Tu sei l'orchestratore e il designer. Spendi token frontier solo dove vive il gusto.

| Lavoro | Chi lo fa | Costo |
|---|---|---|
| Concept, direzione artistica, palette, tipografia, layout, motion, copy, build, revisione design | **Tu (Claude)** — mai delegato, sul modello più forte | frontier, ne vale la pena |
| Sparring sui concept — attaccare la proposta, un angolo jolly | Sub-agent fresco (o seconda CLI se c'è) — solo testo di strategia, mai design | una chiamata economica |
| Bozza del prompt video di ogni capitolo; una sezione post-film | Sub-agent Claude, in parallelo | economico |
| Estrazione frame, gate SSIM, assemblaggio, jank test, screenshot, deploy | **Puro shell — nessun modello** (`scripts/*`, ffmpeg, puppeteer, vercel) | ~gratis |

---

## DISCIPLINA DEI COSTI (Corsia B)

1. **Audio OFF** — sempre. (Su altri motori l'audio può ~3× il conto in silenzio.)
2. **La qualità la sceglie la persona allo STEP 1** (default: direttamente alta, 1080p).
   La bozza a 480p è un'opzione su richiesta, mai un obbligo.
3. **Onestà sui costi, senza teatrini**: il listino del provider è in "unità" poco
   leggibili, quindi niente preventivi al centesimo e niente "prima te lo faccio in
   ridotta così vedi i prezzi". Prima di generare di' cosa stai per lanciare (N clip ×
   durata × qualità) e l'ordine di grandezza (*pochi euro l'intero film in alta,
   centesimi in bozza*); a fine lavoro rimanda al dashboard fal per il consuntivo reale.
4. **Riusa il girato.** Un film può alimentare più direzioni — il girato è il costo, i
   re-styling sono gratis.
5. **Se una clip va rifatta** (giuntura bocciata, direzione sbagliata), rigenera SOLO
   quella clip: la catena è resumabile per costruzione, mai rifare tutto il film.

---

## VERIFICA (entrambe le corsie)

**Setup una-tantum su una macchina nuova** (prima della prima verifica, non dopo che
fallisce): `verify.js` e `shot.js` richiedono `puppeteer-core` + un Chrome di sistema:

```bash
cd scripts && npm install     # nella cartella scripts di QUESTA skill
```

Implementa il contratto dev in ogni build: `?jump=<scrollY>` atterra già scrollato con
tutto lo stato forzato a regime, e `window.__ready = true` scatta solo quando la pagina è
davvero pronta — **con `?jump` questo significa a film interamente caricato e frame di
destinazione disegnato** (lezione verificata: altrimenti gli screenshot fotografano un
frame di ripiego). Poi `scripts/verify.js` scatta a qualsiasi posizione di scroll e misura
il **jank** (delta rAF per frame — giudica p95/max, *mai* la media; target max < 50ms).
Screenshot su ogni beat e ogni giuntura. Mai chiedere all'utente di guardare a occhio ciò
che puoi provare.

**Mai lanciare un server di anteprima in foreground** — non esce mai e uccide il turno.
Sempre `nohup … &`, poi curl sulla porta, e `pkill` a fine lavoro.

**Poi `node scripts/copy-gate.js sito/index.html` — deve uscire 0 prima di spedire.**
Boccia la pagina se il copy racconta il proprio meccanismo al visitatore ("mentre scorri la
ripresa si stringe…"), se è sopravvissuto testo segnaposto, o se un `<svg>` disegnato a
mano sostituisce un logo reale. Una pagina che didascalizza il proprio trucco ha descritto
il brief invece di eseguirlo. Sistema il copy; mai zittire il gate.

**Il harness è un indizio, non la verità — guarda sempre anche i pixel.** Un punteggio
sorprendente (bello o brutto) è un'affermazione sul harness finché uno screenshot non gli
dà ragione. E **giudica la trasformazione, non i beat**: gli screenshot a 0% e 100% devono
essere inizio e fine dello *stesso viaggio*. Se puoi riordinare due capitoli senza che la
pagina sembri rotta, non è una ripresa continua: è una pila di sezioni, e la build ha
fallito la sua premessa.

---

## DEPLOY (opt-in, sul Vercel dell'utente)

Prima una copia **snella** — `index.html` + librerie vendorizzate (`cp -RL`) + solo i
`frames/`/`assets/` di runtime. Mai caricare gli intermedi di build (clip grezze, keyframe
— spesso 100MB+). Poi `vercel deploy --prod --yes` dalla cartella snella. Avvisa che i
nuovi progetti Vercel spesso stanno dietro la Deployment Protection (un muro di login):
renderli pubblici è una scelta del loro account (Project → Settings → Deployment
Protection) — indicagli la strada, non cambiare tu le loro impostazioni di sicurezza.

---

## GUARDRAIL

- **Questa skill non contiene alcun dato personale** — niente chiavi API, niente account,
  niente percorsi personali. Ogni utente porta il proprio motore video + Vercel. Mai
  cuocere credenziali dentro.
- Design + build restano su Claude. Il lavoro meccanico va al codice; il design mai.
- Conferma i crediti prima di spendere; mostra la ricevuta dopo.
- Una ripresa continua; un mondo per brand; niente cuciture visibili; niente dissolvenze
  a mascherare.
- Rispetta `prefers-reduced-motion` in ogni build.
- **I concept vengono sempre attaccati da qualcosa che non li ha scritti** (Step 1).
- File di riferimento: `references/playbook.md` (legge del girato), `references/engine.md`
  (ricette di build), `references/finishing.md` (la rifinitura che decide se sembra
  costoso), `scripts/*`.

## TRAPPOLE OPERATIVE

- **Mai un server di anteprima in foreground** (turno morto, build persa).
- **Mai due scrittori sullo stesso file.**
- **Una build autonoma lunga incontrerà la compattazione del contesto.** Le istruzioni in
  chat evaporano; un `BRIEF.md` scritto nella cartella del progetto sopravvive. Metti nel
  file i percorsi dei frame, `FRAME_COUNT`, il colore della cucitura e i divieti.
- **Le checklist stantie sopravvivono alle correzioni**: correggi la checklist, non solo la
  conversazione.
- **Scarica dai CDN con uno User-Agent da browser** e **salva su disco i job id appena
  emessi** — un download fallito dopo un render pagato altrimenti costa il render due volte.
