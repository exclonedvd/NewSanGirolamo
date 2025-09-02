
(function(){
  const R=document.getElementById('ristoranti');
  const A=document.getElementById('attivita');
  const eatIndex=document.getElementById('eatIndex');
  const seeIndex=document.getElementById('seeIndex');

  const fetchData = () => fetch('data/mantova.json').catch(()=>fetch('data-mantova.json'));

  const slug = s => (s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

  fetchData().then(r=>r.json()).then(d=>{
    // --- RISTORANTI (categorie ordinate) ---
    const catsEat = d.ristoranti || d.categorie_ristoranti || {};
    const preferredOrder = ['La tradizione','La Carne','La pizza','Il Pesce','Agriturismi con ristoro','Agriturismo','Pizza','Il pesce'];
    const eatKeys = Object.keys(catsEat).sort((a,b)=>{
      const ia = preferredOrder.indexOf(a); const ib = preferredOrder.indexOf(b);
      if(ia>-1 && ib>-1) return ia-ib;
      if(ia>-1) return -1; if(ib>-1) return 1;
      return a.localeCompare(b);
    });
    // index chips (eat)
    if(eatIndex){
      eatIndex.innerHTML = '';
      eatKeys.forEach(cat=>{
        const s = slug('eat '+cat);
        const a = document.createElement('a');
        a.className='chip'; a.href = '#'+s; a.textContent = cat;
        eatIndex.appendChild(a);
      });
    }
    // render (eat)
    if(R){
      R.innerHTML='';
      eatKeys.forEach(cat=>{
        const id = slug('eat '+cat);
        const h = document.createElement('h2'); h.textContent = cat; h.className='catTitle'; h.id=id;
        R.appendChild(h);
        const grid = document.createElement('section'); grid.className='cards';
        (catsEat[cat]||[]).slice().sort((a,b)=> (a.nome||'').localeCompare(b.nome||'')).forEach(x=>{
          grid.insertAdjacentHTML('beforeend', card(x, true));
        });
        R.appendChild(grid);
      });
    }

    // --- ATTIVITA (categorie ordinate alfabeticamente) ---
    const catsSee = d.cultura || d.categorie_attivita || {};
    const seeKeys = Object.keys(catsSee).sort((a,b)=> a.localeCompare(b));
    if(seeIndex){
      seeIndex.innerHTML='';
      seeKeys.forEach(cat=>{
        const s = slug('see '+cat);
        const a = document.createElement('a');
        a.className='chip'; a.href = '#'+s; a.textContent = cat;
        seeIndex.appendChild(a);
      });
    }
    if(A){
      A.innerHTML='';
      seeKeys.forEach(cat=>{
        const id = slug('see '+cat);
        const h = document.createElement('h2'); h.textContent = cat; h.className='catTitle'; h.id=id;
        A.appendChild(h);
        const grid = document.createElement('section'); grid.className='cards';
        (catsSee[cat]||[]).slice().sort((a,b)=> (a.nome||'').localeCompare(b.nome||'')).forEach(x=>{
          grid.insertAdjacentHTML('beforeend', card(x, false));
        });
        A.appendChild(grid);
      });
    }
  });

  function card(x, showTel){
    const telClean = (x.tel||'').replace(/\s+/g,'');
    const hasTel = showTel && !!telClean;
    const addr = x.indirizzo||'';
    const mapsQ = x.maps||addr||x.nome||'Mantova';
    const maps = 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(mapsQ);
    return `<article class="card">
      <h3>${x.nome||''}</h3>
      <p class="muted">${addr}</p>
      <div class="row">
        <a class="btn ghost" target="_blank" rel="noopener" href="${maps}">Karte öffnen</a>
        ${hasTel?`<a class="btn" href="tel:${telClean}">Anruf</a>`:''}
      </div>
    </article>`;
  }
})();
