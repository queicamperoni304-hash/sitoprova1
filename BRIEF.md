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

## Secondo movimento: IL SISTEMA (sistema solare, reso dal vivo)

Sezione `#solar`, fra IL COSTO e COME FUNZIONA. Canvas 2D disegnato a ogni
frame, DPR fino a 2, nessun asset: zero byte di payload.

### Il racconto
Cinque domini in orbita attorno a Kompla (il sole e' il marchio):
QUESTIONARI (R 1.00) · FORNITORI (0.80) · DPA (0.62, con anelli) ·
NDA (0.46) · AI ACT E NIS2 (0.32).
- 0.00-0.09  i documenti in arrivo volano da fuori campo e prendono posto
- 0.09-0.20  il sistema intero, etichette dei domini
- tre tuffi: pianeta 0 -> 2 -> 4, ognuno con RITORNO in orbita
- 0.80-1.00  la camera si chiude su Kompla

L'utente ha chiesto esplicitamente l'andata-e-ritorno fra un pianeta e l'altro.
Il vettore unico della skill e' comunque rispettato: i tuffi vanno dal raggio
piu' esterno al piu' interno e ogni ritorno si ferma piu' vicino al centro del
precedente (sc 0.52 -> 0.60 -> 0.70 -> 2.30). L'andirivieni e' il ritmo; la
traiettoria complessiva non torna mai indietro.

### Dettagli tecnici che contano
- interpolazione della scala ESPONENZIALE, non lineare: lineare si legge come
  uno strappo iniziale e una frenata finale
- orbite ellittiche (FLAT 0.42): vista tre quarti, non un quadrante piatto
- pianeti illuminati dal centro del sistema, con terminatore e bande
- etichette sempre dal lato OPPOSTO al sole, altrimenti cadono sul marchio
- campo stellare a scala FISSA con parallasse: non esplode durante i tuffi
- la scheda del rilievo ha uno scrim proprio: il sole le passa dietro

### Jank misurato (stesso container senza GPU)
mediana 16,7ms · p95 16,7ms · max 16,8ms — ZERO frame persi, su due corse.
E' la parte piu' fluida del sito, piu' del film in DOM (p95 33-50ms).

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
