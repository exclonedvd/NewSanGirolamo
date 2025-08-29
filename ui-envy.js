
const UI = {
  toggleNav(){ document.querySelector('.nav ul').classList.toggle('open'); },
  deferred:null,
  promptInstall(){
    if(window.navigator.standalone){ alert('Su iPhone: Condividi → Aggiungi alla schermata Home'); return; }
    if(UI.deferred){ UI.deferred.prompt(); UI.deferred=null; } else { alert('Per iPhone: Condividi → Aggiungi alla schermata Home'); }
  },
  availability(form){
    const d = Object.fromEntries(new FormData(form).entries());
    const body = `Richiesta disponibilità%0A%0ANome: ${d.name}%0AEmail: ${d.email}%0ATelefono: ${d.phone||''}%0AOspiti: ${d.guests}%0ADal ${d.checkin} al ${d.checkout}%0ANote:%0A${(d.note||'').replace(/\n/g,'%0A')}`;
    location.href = `mailto:info@agriturismo-sangirolamo.it?subject=Richiesta%20disponibilit%C3%A0&body=${body}`;
    return false;
  }
};
addEventListener('beforeinstallprompt', e => { e.preventDefault(); UI.deferred = e; document.getElementById('installBtn').style.display='inline-flex'; });

// Active nav
const page = document.body.dataset.page;
document.querySelectorAll('.nav a').forEach(a=>{ if(a.dataset.active===page) a.setAttribute('aria-current','page'); });

// Weather (Open-Meteo)
(function(){
  const el = document.getElementById('weather'); if(!el) return;
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=45.156&longitude=10.792&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FRome&forecast_days=7';
  const ICON = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',80:'🌧️',81:'🌦️',82:'🌧️',95:'⛈️',96:'⛈️',99:'⛈️'};
  fetch(url).then(r=>r.json()).then(d=>{
    el.innerHTML='';
    d.daily.time.forEach((t,i)=>{
      const dt=new Date(t);
      const label=dt.toLocaleDateString('it-IT',{weekday:'short'});
      el.insertAdjacentHTML('beforeend', `<div class="day"><div class="ico">${ICON[d.daily.weathercode[i]]||'🌦️'}</div><div>${label}</div><div>${Math.round(d.daily.temperature_2m_min[i])}° / ${Math.round(d.daily.temperature_2m_max[i])}°</div></div>`);
    });
  }).catch(()=> el.innerHTML='<p>Impossibile caricare il meteo.</p>');
})();





// === PWA Install Button: robust (iOS + Android) ===
(function(){
  const btns = () => Array.from(document.querySelectorAll('[data-install-app], .install-app, #installApp'));
  let deferredPrompt = null;

  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }
  function isIOS(){
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function hideAll(){
    btns().forEach(b=> b.classList.add('hidden'));
  }
  function showAll(){
    btns().forEach(b=> b.classList.remove('hidden'));
  }

  function refreshInstallUI(){
    // Mark html for older iOS CSS hooks if needed
    if(isStandalone()){
      try{ document.documentElement.setAttribute('apple-standalone','yes'); }catch(e){}
      hideAll();
      return;
    }else{
      try{ document.documentElement.removeAttribute('apple-standalone'); }catch(e){}
    }

    if(isIOS()){
      // iOS in browser: show a helper action
      showAll();
      btns().forEach(b=>{
        b.onclick = (e)=>{
          e.preventDefault();
          alert('Su iPhone: tocca Condividi → Aggiungi a Home per installare.');
        };
      });
    } else {
      if(deferredPrompt){
        showAll();
        btns().forEach(b=>{
          b.onclick = async (e)=>{
            e.preventDefault();
            deferredPrompt.prompt();
            try{ await deferredPrompt.userChoice; }catch(e){}
            deferredPrompt = null;
            refreshInstallUI();
          };
        });
      } else {
        hideAll();
      }
    }
  }

  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    refreshInstallUI();
  });

  // Recalculate on mode changes, page show, hash changes, etc.
  try{
    const mq = window.matchMedia('(display-mode: standalone)');
    (mq.addEventListener||mq.addListener).call(mq,'change', refreshInstallUI);
  }catch(e){}
  ['pageshow','load','visibilitychange','hashchange','popstate'].forEach(ev=> window.addEventListener(ev, ()=> setTimeout(refreshInstallUI, 50)));
  document.addEventListener('DOMContentLoaded', refreshInstallUI);

  // One more delayed check to catch late hydration
  setTimeout(refreshInstallUI, 500);
  setTimeout(refreshInstallUI, 1500);
})();


// --- Install button visibility (iOS + Android) ---
(function(){
  function isStandalone(){
    try{
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
    }catch(e){ return false; }
  }
  function refreshInstallBtn(){
    var btn = document.getElementById('installBtn');
    if(!btn) return;
    if(isStandalone()){
      try{ document.documentElement.setAttribute('apple-standalone','yes'); }catch(e){}
      btn.style.display = 'none';
    }else{
      // Show only if a deferred prompt exists (Chrome/Android); on iOS we show but handled by UI.promptInstall()
      if(UI && UI.deferred){ btn.style.display='inline-flex'; } else { btn.style.display=''; }
    }
  }
  try{
    var mq = window.matchMedia('(display-mode: standalone)');
    (mq.addEventListener||mq.addListener).call(mq,'change', refreshInstallBtn);
  }catch(e){}
  window.addEventListener('pageshow', refreshInstallBtn);
  document.addEventListener('visibilitychange', function(){ setTimeout(refreshInstallBtn, 100); });
  document.addEventListener('DOMContentLoaded', refreshInstallBtn);
  setTimeout(refreshInstallBtn, 300);
  setTimeout(refreshInstallBtn, 1200);
})();
