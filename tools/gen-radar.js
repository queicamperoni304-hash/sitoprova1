#!/usr/bin/env node
/* Genera i frame del film radar. Puro lavoro meccanico: nessun modello, nessun costo.
   uso: node tools/gen-radar.js [nFrame]  */
const fs=require('node:fs'), path=require('node:path');
const puppeteer=require(path.join(__dirname,'..','.claude/skills/sito-film/scripts/node_modules/puppeteer-core'));
const N=+process.argv[2]||144;
const PASS=[{dir:'d',W:1440,H:810},{dir:'m',W:640,H:1138}];
(async()=>{
  const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH,args:['--no-sandbox']});
  const p=await b.newPage();
  await p.goto('file://'+path.join(__dirname,'radar-gen.html'),{waitUntil:'load'});
  for(const {dir,W,H} of PASS){
    const out=path.join(__dirname,'..','sito','radar',dir);
    fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
    let bytes=0;
    for(let i=0;i<N;i++){
      const url=await p.evaluate((W,H,t)=>window.renderTo(W,H,t),W,H,i/(N-1));
      const buf=Buffer.from(url.split(',')[1],'base64');
      fs.writeFileSync(path.join(out,'r_'+String(i).padStart(4,'0')+'.jpg'),buf);
      bytes+=buf.length;
    }
    console.log(`${dir} ${W}x${H} · ${N} frame · ${(bytes/1048576).toFixed(1)} MB · medio ${Math.round(bytes/N/1024)} KB`);
  }
  // la copertura reale per frame: il sito la legge invece di inventarsela
  const cov=await p.evaluate(n=>window.coverageSeries(n), N);
  fs.writeFileSync(path.join(__dirname,'..','sito','radar','cov.json'), JSON.stringify(cov));
  console.log('cov.json · '+cov.length+' valori · finale '+cov[cov.length-1]);
  if(0){
  }
  await b.close();
})();
