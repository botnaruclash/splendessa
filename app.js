const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Nav scroll state */
const nav = document.querySelector('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30), { passive: true });

/* Scroll reveals with sibling stagger */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const sibs = [...e.target.parentElement.querySelectorAll(':scope > .reveal')];
      e.target.style.transitionDelay = (Math.max(sibs.indexOf(e.target), 0) * 90) + 'ms';
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Magnetic buttons */
if (!reduceMotion) {
  document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * .18}px, ${(e.clientY - r.top - r.height/2) * .3}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
  });
}

/* Parallax orbs */
if (!reduceMotion) {
  const orb1 = document.querySelectorAll('.orb-1');
  const orb2 = document.querySelectorAll('.orb-2');
  if (orb1.length || orb2.length) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        orb1.forEach(o => o.style.transform = `translateY(${y*0.12}px)`);
        orb2.forEach(o => o.style.transform = `translateY(${-y*0.08}px)`);
        ticking = false;
      });
    }, { passive: true });
  }
}

/* Marquee seamless loop */
const track = document.querySelector('.marquee-track');
if (track) track.innerHTML += track.innerHTML;

/* FAQ accordion */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!open) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

/* Counters (home hero) */
function runCounters(){
  document.querySelectorAll('.count').forEach(el => {
    const target = +el.dataset.target, dur = 2200, start = performance.now();
    (function tick(now){
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  });
}
if (document.querySelector('.count')) setTimeout(runCounters, 1500);
