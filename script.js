// ============================================
// EDITING ZONE - script.js
// 3D floating background - mouse + scroll inertia
// ============================================
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let els = [], 
      tx = 0, ty = 0, cx = 0, cy = 0,
      sy = 0, lsY = window.scrollY, lag = 0,
      rx = 0, ry = 0, crx = 0, cry = 0;

  function collect(){
    els = Array.from(document.querySelectorAll('.ez-bg > *'));
  }
  collect();

  const root = document.getElementById('root');
  if(root){
    new MutationObserver(collect).observe(root, {childList:true, subtree:true});
  }

  // Mouse -> target (parallax + 3D tilt)
  window.addEventListener('pointermove', e=>{
    const nx = (e.clientX / window.innerWidth - 0.5);
    const ny = (e.clientY / window.innerHeight - 0.5);
    tx = nx * 36;
    ty = ny * 26;
    ry = nx * 8;   // rotateY
    rx = -ny * 6;  // rotateX
  }, {passive:true});

  // Scroll -> inertia
  function tick(){
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    crx += (rx - crx) * 0.05;
    cry += (ry - cry) * 0.05;

    const dy = window.scrollY - lsY;
    lsY = window.scrollY;
    lag += (dy * 0.2 - lag) * 0.12;
    sy += (lag - sy) * 0.1;

    const t = Date.now() * 0.0006;

    els.forEach((el, i)=>{
      const depth = 0.7 + (i % 5) * 0.35;
      const baseRot = getComputedStyle(el).getPropertyValue('--rot') || '0deg';
      const fy = Math.sin(t + i * 0.9) * 10;   // float Y
      const fx = Math.cos(t * 0.8 + i * 1.2) * 6; // float X

      // True 3D: translate3d + translateZ depth + rotateX/Y
      el.style.transform = `translate3d(${cx*depth+fx}px, ${cy*depth+sy*depth*0.5+fy}px, ${depth*30}px) rotateX(${crx*depth}deg) rotateY(${cry*depth}deg) rotate(${baseRot})`;
      el.style.transformStyle = 'preserve-3d';
    });

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
