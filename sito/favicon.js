/**
 * Favicon animata: le stesse orbite del marchio, che girano nella scheda.
 *
 * Un SVG con animazione dichiarativa NON si muove nella scheda di Chrome —
 * il browser lo rasterizza una volta e amen. L'unico modo che funziona
 * ovunque e' ridisegnare il simbolo su un canvas e sostituire l'icona a ogni
 * frame, che e' quello che fa questo file. Portato dal prodotto (komplatry1),
 * con la stessa geometria e gli stessi periodi.
 *
 * Due cortesie obbligatorie, perche' e' pur sempre un disegno a ripetizione:
 * si ferma quando la scheda non e' visibile, e non parte affatto se l'utente
 * ha chiesto meno animazioni a sistema — in quel caso resta il simbolo
 * statico dichiarato nell'HTML.
 */
(function(){
  "use strict";

  var SIZE = 64;
  var INK = '#0C1626', RING = '#2C4265', CORE = '#0FA9A0';

  /* Geometria in coordinate 0-100, identica al marchio in pagina.
     period in secondi per giro; negativo = senso opposto. */
  var BODIES = [
    { radius:42, size:7.5, color:'#F5A623', period: 26, phase: 0 },
    { radius:28, size:6.5, color:'#E8590C', period:-17, phase: Math.PI },
    { radius:15, size:5.5, color:'#5B8DEF', period: 11, phase:-Math.PI/2 }
  ];

  var mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;

  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  var ctx = canvas.getContext('2d');
  /* roundRect manca sui browser piu' vecchi: senza, meglio l'icona statica
     che un rettangolo squadrato che non somiglia al marchio. */
  if (!ctx || typeof ctx.roundRect !== 'function') return;

  function iconLink(){
    var el = document.querySelector('link[rel="icon"]');
    if (el) return el;
    el = document.createElement('link');
    el.rel = 'icon';
    document.head.appendChild(el);
    return el;
  }

  function draw(t){
    var s = SIZE / 100, i, b, a;
    ctx.clearRect(0, 0, SIZE, SIZE);

    /* fondo: senza, l'icona sparisce sulle schede chiare */
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.roundRect(0, 0, SIZE, SIZE, 14 * s);
    ctx.fill();

    ctx.strokeStyle = RING;
    ctx.lineWidth = 2.6 * s;
    for (i = 0; i < BODIES.length; i++){
      ctx.beginPath();
      ctx.arc(SIZE/2, SIZE/2, BODIES[i].radius * s, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.fillStyle = CORE;
    ctx.beginPath();
    ctx.arc(SIZE/2, SIZE/2, 7 * s, 0, Math.PI*2);
    ctx.fill();

    for (i = 0; i < BODIES.length; i++){
      b = BODIES[i];
      a = b.phase + (t / b.period) * Math.PI * 2;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(SIZE/2 + Math.cos(a)*b.radius*s,
              SIZE/2 + Math.sin(a)*b.radius*s,
              b.size * s, 0, Math.PI*2);
      ctx.fill();
    }
  }

  var link = iconLink(), t0 = performance.now(), last = 0;

  function tick(now){
    requestAnimationFrame(tick);
    /* ~12 fps: la scheda del browser non merita di piu', e il costo resta
       trascurabile anche con la pagina aperta tutto il giorno. */
    if (now - last < 83) return;
    last = now;
    if (document.hidden) return;
    draw((now - t0) / 1000);
    link.type = 'image/png';
    link.href = canvas.toDataURL('image/png');
  }
  requestAnimationFrame(tick);

  /* tornando sulla scheda l'icona riparte dal frame giusto da sola:
     il tempo continua a scorrere anche mentre non si disegna */
  document.addEventListener('visibilitychange', function(){
    if (!document.hidden) last = 0;
  });
})();
