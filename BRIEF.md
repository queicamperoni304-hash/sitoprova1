# BRIEF — sito-film KOMPLA

Sopravvive alla compattazione del contesto. Se la sessione riparte, la verità è questa.

## Brand
KOMPLA — Continuous Business Risk Intelligence. Pre-seed 2026, Milano.
Founder & CEO: Vincenzo Pio Patermo — vincenzopiopatermo@gmail.com
Legge in continuo i documenti che un'azienda RICEVE (DPA, NDA, questionari di sicurezza,
contratti fornitore), segnala il rischio citando articolo di legge + regola + confidenza,
propone il redline pronto, registra tutto in audit trail. Triage, non parere legale:
la decisione resta umana.
Payoff: "Move fast, stay covered."

## Cosa si vende (e cosa NON si vende)
SI: il deal enterprise fermo da tre settimane, le ~700 ore/anno (~70.000 EUR) liberate.
NO: multe astratte, paura, sanzioni ipotetiche. Il deck lo vieta esplicitamente (pag. 15).

## Concept scelto — «NOVANTASEI ORE» (Corsia A, puro codice)
UN SOLO VETTORE: l'inquadratura si allarga e basta. Ingrandimento monotòno decrescente.
Mai invertire. Nessun capitolo e' riordinabile.

Capitoli (5), ognuno un livello che passa il testimone al successivo tenendo lo stesso
centro ottico:
  L0/L1 LA RIGA       - grana della carta -> 12 parole leggibili -> tratto ambra
  L2    LA REGOLA     - il paragrafo § 9 + citazione GDPR Art. 33 / DPA-CHK-09 / conf. 96%
  L3    LA CORREZIONE - redline 96 -> 48 dentro la riga, risk score 68 -> 50, hash sigilla
  L4    IL VOLUME     - non un documento: 211 rinnovi/anno, diventano punti di luce
  L5    LA FIRMA      - il contratto enterprise riparte e si firma (NON il logo)

Il finale e' il deal firmato. Lo sparring avversariale ha bocciato il finale sul logo
("titoli di coda") e la mancanza del deal: corretto, non reintrodurre.

## Palette (dal deck, hex esatti)
--ink #080F1A  --navy #111E33  --navy2 #16273F  --navy3 #1E2F49  --line #2C4265
--dim #64738C  --text #B4C0D4  --bright #EAF0F8
--amber #F5A623  --teal #1CBFB4  --red #F2662D
--paper #F3EFE6  --paper-ink #1B1710   <- la carta e' l'unica sorgente di luce del film

## Tipografia
display Instrument Serif · testo Instrument Sans · documento Spectral · dati IBM Plex Mono
(Nel deck i font sono Liberation Sans = placeholder. Nessuna tipografia da ereditare.)

## Divieti
- Mai raccontare il meccanismo nel copy (niente "mentre scorri", niente camera, niente
  didascalie dell'inquadratura). `node .claude/skills/sito-film/scripts/copy-gate.js` deve uscire 0.
- Niente materiale confidenziale da investitore sul sito pubblico: round 300-500k,
  scenari ARR, equity del CTO, pagina rischi, TAM/SAM/SOM, decision gate.
- Niente dissolvenze a mascherare una giuntura. Un mondo per brand.
- prefers-reduced-motion rispettato.
- Testo del documento in inglese (i DPA lo sono davvero); UI e copy in italiano.

## Tecnica
Sticky stage + progresso da getBoundingClientRect, playhead smorzato (lerp .14).
Livelli che si scambiano il testimone: ognuno e' a scala naturale nel suo capitolo,
quindi il testo e' sempre nitido quando conta. GSAP/ScrollTrigger per le sezioni sotto.
Legge di ordinamento: prima le scene fissate, DOPO gli effetti ambientali.
Contratto dev: ?jump=<scrollY> + window.__ready.

## File
sito/index.html  (autonomo, singolo file)
Verifica:  node .claude/skills/sito-film/scripts/copy-gate.js sito/index.html
           node .claude/skills/sito-film/scripts/shot.js <url> out.png 1440 900 0.35
Branch: claude/intelligent-faraday-mpvxxt

---

## Stato al 2026-09-11 (fine prima sessione)

### Corsia B: BLOCCATA DALL'AMBIENTE, non dalla chiave
La egress policy di questo ambiente remoto nega il CONNECT verso fal:
    queue.fal.run:443 — connect_rejected (organization policy)
    fal.media:443     — connect_rejected (organization policy)
Il rifiuto avviene prima dell'autenticazione: nessuna chiave puo' funzionare da qui.
Per sbloccarla: cambiare la network policy dell'ambiente, oppure girare la skill in
locale sulla macchina dell'utente.

### Nota di merito sulla Corsia B (vale anche dopo lo sblocco)
«NOVANTASEI ORE» e' il concept SBAGLIATO per un film generato: il suo carico utile e'
tipografia legibile (le dodici parole, GDPR Art. 33, il redline 96 -> 48, il risk score).
I modelli image-to-video non rendono testo leggibile ne' lo modificano in modo controllato
tra due clip. La Corsia B richiede un concept atmosferico/fisico dove il testo non deve
mai essere leggibile, con la UI di prodotto sovrapposta in codice. E' una riscrittura.

### Scelte tecniche prese dopo la verifica
- Librerie VENDORIZZATE in sito/vendor/ (gsap, ScrollTrigger, lenis) — cdnjs e' bloccato
  da questo ambiente e comunque la skill prescrive il vendoring per la produzione.
- Font VENDORIZZATI in sito/fonts/ (@fontsource, 12 woff2 latin, 260KB) — Google Fonts
  falliva a intermittenza attraverso il proxy. La pagina ora non fa NESSUNA richiesta esterna.
- Favicon inline come data-URI SVG (la K ambra).
- IL VOLUME (cap. 4) e' disegnato su UN canvas, non 208 nodi DOM: ridisegnare 208 gradienti
  a ogni cambio di scala era l'unico punto della pagina sotto i 60fps.
  Effetto misurato: p95 da 50,0ms a 33,3ms su quel capitolo.
- L0 ridotto da 220vw a 132vw e maschera rimossa (stessa resa, un terzo dell'area).
- Blur quantizzato a passi interi: se cambia a ogni frame il browser ri-rasterizza sempre.
- will-change PERMANENTE sui livelli: toglierlo/rimetterlo per visibilita' peggiora
  (promozione/demozione del layer). Misurato, non supposto. Non ritentare.

### Jank misurato (headless, container SENZA GPU — indicativo, non la verita')
corsa intera 1440x900: mediana 16,7ms · p95 33,4ms · max 50-83ms (rumoroso tra le corse)
Prima delle ottimizzazioni: p95 50,0ms · max 83,3ms.
Il max resta sopra la soglia di 50ms della skill in rasterizzazione software.
DA RIVERIFICARE su hardware vero prima di dire che passa.

### Verifiche passate
- copy-gate: exit 0
- nessuna risorsa esterna, nessun 404, nessun errore di console
- desktop 1440x900: tutti e 5 i capitoli + tutte le sezioni
- mobile 390x844: tutti i capitoli, nessun overflow orizzontale

### Non fatto
- Deploy (mai richiesto)
- prefers-reduced-motion verificato solo per costruzione, non con uno screenshot dedicato

---

## RIMOSSO — il film radar scrubbato (era: secondo movimento)

Rimosso su richiesta: l'utente lo trovava di bassa qualita', e aveva ragione.
Erano frame JPEG pre-renderizzati a ~26 KB l'uno: artefatti di compressione,
bordi sottili impastati, nessun adattamento al DPR dello schermo. Cancellati
sito/radar/ (6,8 MB), tools/gen-radar.js e tools/radar-gen.html.
LEZIONE: per geometria vettoriale (anelli, orbite, tratti sottili) il rendering
dal vivo su canvas batte i frame pre-estratti su ogni fronte — qualita', peso,
adattabilita'. I frame pre-estratti restano giusti solo per girato VERO
(Corsia B), dove non c'e' modo di ridisegnare la scena nel browser.

---

## Secondo movimento: IL SISTEMA (radar a orbite, reso dal vivo)

Sezione `#solar`, fra IL COSTO e COME FUNZIONA. Canvas 2D disegnato a ogni
frame, DPR fino a 2, nessun asset.

NON SONO PIANETI. L'utente e' stato esplicito: un ibrido fra radar e orbite,
fatto di PUNTI che sono i rischi, divisione per divisione. Non reintrodurre
corpi con bande, terminatore e anelli: era la versione precedente ed e' stata
scartata. Il punto agganciato cresce 3,1x e basta — oltre comincia a leggersi
come un pianeta; e' il RETICOLO a dire "questo".

### Le cinque divisioni (una orbita ciascuna, dall'esterno all'interno)
CONTRATTI E DPA (R 1.00) · FORNITORI E VENDOR RISK (0.82) ·
QUESTIONARI DI SICUREZZA (0.64) · SITO, COOKIE E MARKETING (0.47) ·
AI ACT E NIS2 (0.31)
Ogni tuffo apre una scheda che spiega DOCUMENTI TIPICI e RISCHI TIPICI di
quella divisione, ogni rischio con la sua fonte normativa.

### Vincoli presi dall'utente — non violarli
- il punto centrale e' Kompla e NON porta il marchio dentro: solo un punto
  che pulsa con echi concentrici
- NESSUN punto tocca mai il centro. Garantito per costruzione: le orbite hanno
  raggio fisso (min R_MIN 0.31 contro R_CORE 0.018) e i documenti in arrivo
  interpolano in COORDINATE POLARI, quindi il raggio scende solo fino a quello
  della propria orbita. Non sostituire con un lerp cartesiano: una traiettoria
  rettilinea puo' passare dal centro.
- conta la dinamicita' e la bellezza del sistema che gira

### Dettagli che decidono se sembra costoso
- scala interpolata in modo ESPONENZIALE, non lineare
- etichette con ANGOLO PROPRIO per orbita (lab) + trattino di collegamento:
  ancorate tutte a destra si accavallavano in una riga illeggibile
- la camera durante un tuffo e' SPOSTATA per non mettere il punto sotto la
  scheda (a destra su schermo largo, in basso su schermo stretto)
- la spazzata si ritira quando la camera scende: da vicino laverebbe mezzo schermo
- tacche di portata sulle orbite: e' cio' che lo rende un radar

### L'OROLOGIO E' SEPARATO DALLO SCROLL — la correzione piu' importante
Prima orbite, spazzata, echi del centro e pulsazioni erano tutti funzione del
progresso di scroll. Smettere di scorrere CONGELAVA il sistema, e si leggeva
come un bug. Ora c'e' `sClock`, che avanza con il delta reale di rAF (con un
tetto di 50ms per frame, cosi' tornare sulla sezione dopo minuti non fa
scattare tutto in avanti). Lo scroll muove SOLO la camera.
NON RIAGGANCIARE la rotazione al progresso: e' la differenza fra un sistema
vivo e uno rotto.

### Ordine contro "AI slop"
Erano 35 punti sparsi ad angoli casuali, con dimensioni e colori casuali, piu'
12 raggi, 48 tacche per ogni orbita e 240 stelle. Quel tipo di rumore casuale
E' la texture del generato male. Ora:
- 21 punti, spaziati in modo ESATTO (k/n del giro) con una fase per orbita
- il colore vuole dire qualcosa: 1 rischio aperto per divisione (ambra),
  1 verificato (teal), il resto in coda (pallido). Niente colori a caso.
- due sole dimensioni, non una variabile casuale
- raggi radiali rimossi; tacche solo sull'orbita esterna, 24 invece di 48
- stelle da 240 a 110
- periodi orbitali lunghi e ordinati (132s fuori, 46s dentro): lentezza = lusso
NON reintrodurre jitter casuale "per renderlo naturale": e' il difetto che
l'utente ha chiamato per nome.

### RESISTENZA ALLO SCROLL VELOCE — due cose, e una era un difetto logico
Sintomo riferito: scorrendo veloce le schede delle singole divisioni non si
facevano in tempo a leggere.

1) LA CAUSA VERA: le schede usavano `beatAlpha`, che sale, tocca il picco e
   comincia SUBITO a sfumare. Non c'era mai un tratto a opacita' piena: la
   scheda era leggibile per ~100px di scroll. Ora hanno `cardAlpha` con un
   PLATEAU (in -> full -> hold -> out) lungo quanto la sosta della camera.
   Misurato: da ~100px a ~750-825px per scheda. NON rimettere beatAlpha sulle
   schede: e' pensato per i beat del film, che hanno un'altra dinamica.

2) SOSTA DELLA CAMERA: nei segmenti di tuffo l'interpolazione e' compressa
   (uRaw / 0.55), quindi la camera arriva al 55% del segmento e poi STA FERMA.
   Se continuasse a muoversi fino all'ultimo istante, l'immagine non si
   fermerebbe mai e non ci sarebbe un momento di lettura.

3) Sezione allungata del 30% (820vh -> 1066vh; mobile 700 -> 910vh), cioe' il
   +30% di resistenza chiesto. Da sola non bastava: senza il plateau il
   problema restava.

Misura utile da rifare dopo ogni modifica al tempismo: px di scroll con
opacita' della scheda > 0.9, campionando ogni 25px con 130ms di assestamento
(sotto quella soglia si misura lo smorzamento, non la scheda).

### Le scie
Un arco corto (0.16 rad) che segue esattamente l'orbita, con lineCap round.
Si RITIRA durante l'aggancio (trailA = A * (1 - focus*0.88)): a reticolo aperto
una coda spessa fatta di archi separati si legge come un blocco squadrato.

### Jank misurato
scorrendo · mediana 16,7ms · p95 16,7ms · max 16,8ms
da fermo  · mediana 16,7ms · p95 16,8ms · max 16,8ms
Zero frame persi in entrambi gli stati. "Da fermo" ora e' un caso reale da
misurare, perche' il sistema continua a girare.

---

## Il capitolo IL VOLUME del film (cap. 4)

Era una parete di riquadri PIENI colorati: leggeva come una griglia di campioni
colore, non come documenti. Ora e' disegnata A FILO DI LINEA — riquadri con
contorno da 1px, due tratti interni a suggerire il testo, radi e quasi tutti
spenti, con sei soli riquadri ambra. Molto piu' minimale e il numero "211"
respira. Non tornare ai riquadri pieni.

---

## LA PROVA — demo reale, sezione `#prova`

Motore di regole deterministico che gira NEL BROWSER. Nessuna rete, nessun
backend: il testo dell'utente non lascia la pagina, e il copy lo dichiara.

12 regole vere con fonte normativa: finestra di notifica > 72h (Art. 33),
trasferimento extra-SEE senza garanzie (Art. 44-46), subresponsabile senza
autorizzazione (Art. 28(2)), legge applicabile extra-UE, durata indeterminata
dell'NDA, audit / cancellazione / riservatezza / Art. 32 / diritti
dell'interessato assenti, massimale di responsabilita' assente, nessuna
certificazione richiamata.

REGOLE DI ONESTA' — non violarle:
- l'estratto mostrato e' testo REALE del documento dell'utente, evidenziato
- il conteggio delle rilevazioni bloccate e' quello VERO, mai gonfiato
- se non trova nulla lo dice, e non finge che il documento sia a posto
- il copy dice "anteprima su 12 regole", mai "questa e' l'analisi di Kompla"
- VERIFICATO: 11 rilevazioni sul DPA di esempio, 0 su un DPA scritto bene
  (le regole discriminano davvero) e il payload XSS non viene eseguito

Il gate sblocca UNA rilevazione, le altre restano sfocate e rimandano
all'audit a pagamento.

---

## team.html — fuori dal funnel

Squadra, ruoli aperti e investitori vivono su una pagina separata, linkata da
nav, footer e da una riga sotto la CTA dell'audit. Il funnel finisce sull'audit.
- advisor legale: A BORDO (studio partner, work-for-equity con vesting)
- aperti: CTO co-founder, sales B2B, marketing
- due form: candidature e investitori

I FORM NON HANNO BACKEND: compongono un'email e aprono il client di posta.
E' scritto nel modulo stesso. Non fingere un invio che non avviene. Se in
futuro serve un vero invio, ci vuole un servizio esterno o un endpoint sul
server Node.

---

## base.css — sistema di design condiviso

Token, reset, header, sezioni, griglie, tile, piani, bottone, CTA, form e
footer stanno in `sito/base.css`, linkato da index.html e team.html.
Restano inline in index.html solo gli stili del film, del sistema solare e
della demo. MODIFICARE I COMPONENTI CONDIVISI SOLO IN base.css.
