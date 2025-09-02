
const itinerari=[
  {t:"Passeggiata al Lago Inferiore",m:"walk",d:"1 h",desc:"Anello pianeggiante con scorci sui laghi e skyline.",map:"https://www.google.com/maps?q=Lago+Inferiore+Mantova"},
  {t:"Centro storico essenziale",m:"walk",d:"2 h",desc:"Piazza Sordello, Duomo, Broletto e Piazza delle Erbe.",map:"https://www.google.com/maps?q=Centro+storico+Mantova"},
  {t:"Palazzo Ducale e Castello",m:"walk",d:"2 h",desc:"La reggia dei Gonzaga con la Camera degli Sposi.",map:"https://www.google.com/maps?q=Palazzo+Ducale+Mantova"},
  {t:"Palazzo Te e Casa del Mantegna",m:"walk",d:"2 h",desc:"Capolavori di Giulio Romano.",map:"https://www.google.com/maps?q=Palazzo+Te+Mantova"},
  {t:"Quartiere dei canali",m:"walk",d:"1.5 h",desc:"Tra Rio, ponticelli e vedute d’acqua.",map:"https://www.google.com/maps?q=Rio+Mantova"},
  {t:"Borgo delle Grazie",m:"walk",d:"1.5 h",desc:"Santuario e tradizione del Mincio.",map:"https://www.google.com/maps?q=Grazie+di+Curtatone"},
  {t:"Tramonto sul ponte di San Giorgio",m:"walk",d:"45 min",desc:"Luce dorata e riflessi sulla città.",map:"https://www.google.com/maps?q=Ponte+di+San+Giorgio+Mantova"},
  {t:"Ciclabile Mantova–Peschiera (tratto sud)",m:"bike",d:"3–4 h",desc:"Argini, canali e oasi fino a Pozzolo.",map:"https://www.google.com/maps?q=Ciclabile+Mantova+Peschiera"},
  {t:"Anello dei laghi",m:"bike",d:"1.5–2 h",desc:"Percorso facile attorno ai laghi.",map:"https://www.google.com/maps?q=Anello+dei+laghi+Mantova"},
  {t:"Bosco della Fontana",m:"bike",d:"2 h",desc:"Foresta planiziale e sentieri ombreggiati.",map:"https://www.google.com/maps?q=Bosco+della+Fontana"},
  {t:"Da Mantova a Grazie",m:"bike",d:"2–3 h",desc:"Lungo il Mincio fino al borgo.",map:"https://www.google.com/maps?q=Grazie+di+Curtatone"},
  {t:"Anello delle corti rurali",m:"bike",d:"2 h",desc:"Strade bianche tra cascine storiche.",map:"https://www.google.com/maps?q=corti+rurali+mantova"}
];
const wrap = document.querySelector('#itins');
if(wrap){
  itinerari.forEach(x=>{
    const ico = x.m==='walk' ? '🚶' : '🚲';
    wrap.insertAdjacentHTML('beforeend', `<article class="card">
      <h3>${ico} ${x.t}</h3>
      <p><strong>Durata:</strong> ${x.d}</p>
      <p>${x.desc}</p>
      <a class="btn ghost" target="_blank" rel="noopener" href="${x.map}">Apri in mappa</a>
    </article>`);
  });
}
