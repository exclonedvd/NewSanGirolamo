
// Build scroll-snap sliders from photos.json
fetch('photos.json').then(r=>r.json()).then(PHOTOS=>{
  document.querySelectorAll('.snap-slider').forEach(sl=>{
    const key = sl.getAttribute('data-src');
    const list = PHOTOS[key] || [];
    const rail = document.createElement('div'); rail.className='rail'; rail.setAttribute('role','region'); rail.setAttribute('aria-label', key || 'Galleria');
    list.forEach((src,i)=>{
      const d = document.createElement('div'); d.className='slide';
      d.innerHTML = `<img loading="lazy" src="${src}" alt="${key||'Foto'} ${i+1}">`;
      rail.appendChild(d);
    });
    sl.appendChild(rail);
    const prev = document.createElement('button'); prev.className='ctrl prev'; prev.innerHTML='‹';
    const next = document.createElement('button'); next.className='ctrl next'; next.innerHTML='›';
    sl.append(prev,next);
    const scrollByPage = (dir)=>{ sl.querySelector('.rail').scrollBy({left: dir*sl.clientWidth*0.9, behavior:'smooth'}); };
    prev.addEventListener('click', ()=>scrollByPage(-1));
    next.addEventListener('click', ()=>scrollByPage(1));
  });
});
