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
