(function () {
  const brandEl = document.getElementById('brand');
  const taglineEl = document.getElementById('tagline');
  const styleEl = document.getElementById('style');
  const iconEl = document.getElementById('icon');
  const layoutEl = document.getElementById('layout');
  const countEl = document.getElementById('count');
  const variantsEl = document.getElementById('variants');
  const btnGen = document.getElementById('generate');
  const btnRand = document.getElementById('randomize');

  // Minimal icon set (simple primitives)
  const ICONS = {
    spark: `<path d="M12 2l2.2 4.4L19 7l-4 3.8.9 5.2L12 13.8 6.1 16l.9-5.2L3 7l4.8-.6L10 2z" fill="currentColor"/>`,
    wave: `<path d="M2 12c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    hex:  `<path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" fill="currentColor"/>`,
    bolt: `<path d="M11 2L3 13h6l-1 9 8-12h-6l1-8z" fill="currentColor"/>`,
    circle:`<circle cx="12" cy="12" r="8" fill="currentColor"/>`,
    chip:  `<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/><g stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></g>`
  };

  const PALETTES = [
    {bg:'#0b1020', fg:'#9b8cff', accent:'#7dd3fc'},
    {bg:'#0b1020', fg:'#e5e7eb', accent:'#a78bfa'},
    {bg:'#0b1020', fg:'#c7d2fe', accent:'#34d399'},
    {bg:'#0b1020', fg:'#ffffff', accent:'#ff77e9'},
    {bg:'#0b1020', fg:'#e5e7eb', accent:'#22d3ee'},
  ];

  let currentPalettes = [...PALETTES];

  function fontByStyle(style){
    switch(style){
      case 'futuristic': return `'Orbitron', sans-serif`;
      case 'lux': return `'Playfair Display', serif`;
      default: return `'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
    }
  }

  function shade(hex, amt){
    const c = hex.replace('#','');
    let r = parseInt(c.substr(0,2),16),
        g = parseInt(c.substr(2,2),16),
        b = parseInt(c.substr(4,2),16);
    r = Math.max(0, Math.min(255, r + amt));
    g = Math.max(0, Math.min(255, g + amt));
    b = Math.max(0, Math.min(255, b + amt));
    return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  }

  function makeSVG({brand, tagline, style, icon, layout, palette}) {
    const font = fontByStyle(style);
    const bg = palette.bg;
    const iconColor = palette.accent;
    const textColor = palette.fg;
    let iconBlock = `<svg width="96" height="96" viewBox="0 0 24 24" fill="none" style="color:${iconColor}">${ICONS[icon]}</svg>`;
    let title = `<text x="0" y="0" font-family="${font}" font-weight="800" font-size="64" fill="${textColor}">${brand}</text>`;
    let sub = tagline ? `<text x="0" y="0" font-family="${font}" font-weight="600" font-size="18" fill="${textColor}" opacity="0.72">${tagline}</text>` : '';

    let content = '';
    if (layout === 'icon-top') {
      content = `\n        <g transform="translate(402,52)">${iconBlock}</g>\n        <g transform="translate(450,180)">\n          <g transform="translate(-200,0)">${title}</g>\n          ${tagline ? `<g transform="translate(-200,34)">${sub}</g>` : ''}\n        </g>`;
    } else if (layout === 'badge') {
      content = `\n        <g transform="translate(40,40)">\n          <rect x="0" y="0" width="820" height="220" rx="24" fill="rgba(255,255,255,0.06)" stroke="${iconColor}" stroke-opacity="0.35"/>\n        </g>\n        <g transform="translate(96,118)">${iconBlock}</g>\n        <g transform="translate(220,180)">\n          <g>${title}</g>\n          ${tagline ? `<g transform="translate(0,34)">${sub}</g>` : ''}\n        </g>`;
    } else {
      // icon-left
      content = `\n        <g transform="translate(80,112)">${iconBlock}</g>\n        <g transform="translate(210,180)">\n          <g>${title}</g>\n          ${tagline ? `<g transform="translate(0,34)">${sub}</g>` : ''}\n        </g>`;
    }

    const gradId = `grad${Math.floor(Math.random()*1000000)}`;
    return `\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300">\n  <defs>\n    <linearGradient id="${gradId}" x1="0" x2="1" y1="0" y2="1">\n      <stop offset="0%" stop-color="${bg}"/>\n      <stop offset="100%" stop-color="${shade(bg,14)}"/>\n    </linearGradient>\n  </defs>\n  <rect width="900" height="300" fill="url(#${gradId})"/>\n  <g>${content}</g>\n</svg>`.trim();
  }

  function renderVariant(svg, mount){
    mount.innerHTML = '';
    const frame = document.createElement('div');
    frame.className = 'logo-frame';
    frame.innerHTML = svg;

    const meta = document.createElement('div');
    meta.className = 'meta';
    const left = document.createElement('div');
    left.className = 'row';
    left.innerHTML = `<span class="pill">SVG</span><span class="pill">PNG</span>`;
    const right = document.createElement('div');
    right.className = 'row';

    const btnSVG = document.createElement('button');
    btnSVG.className = 'btn';
    btnSVG.textContent = 'Download SVG';
    btnSVG.onclick = () => downloadSVG(svg);

    const btnPNG = document.createElement('button');
    btnPNG.className = 'btn-secondary';
    btnPNG.textContent = 'Download PNG';
    btnPNG.onclick = () => svgToPngAndDownload(svg, 1800, 600);

    right.appendChild(btnSVG);
    right.appendChild(btnPNG);
    meta.appendChild(left);
    meta.appendChild(right);

    const card = document.createElement('div');
    card.className = 'card';
    card.appendChild(frame);
    card.appendChild(meta);
    mount.appendChild(card);
  }

  function downloadSVG(svg) {
    const blob = new Blob([svg], {type:'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const name = (brandEl.value.trim() || 'logo');
    a.href = url; a.download = `${slug(name)}.svg`; a.click();
    URL.revokeObjectURL(url);
  }

  function svgToPngAndDownload(svgString, w, h) {
    const img = new Image();
    const svg = new Blob([svgString], {type:'image/svg+xml'});
    const url = URL.createObjectURL(svg);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b1020'; 
      ctx.fillRect(0,0,w,h);
      ctx.drawImage(img,0,0,w,h);
      canvas.toBlob((blob)=>{
        const link = document.createElement('a');
        link.download = `${slug(brandEl.value || 'logo')}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }

  function slug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

  function randomizePalettes() {
    currentPalettes = PALETTES.map(p => ({
      bg: shade(p.bg, Math.floor(Math.random()*10)-5),
      fg: p.fg,
      accent: p.accent
    }));
  }

  function generate() {
    variantsEl.innerHTML = '';
    const brand = (brandEl.value || 'Echo Tools').trim();
    const tagline = (taglineEl.value || '').trim();
    const style = styleEl.value;
    const icon = iconEl.value;
    const layout = layoutEl.value;
    const total = parseInt(countEl.value, 10) || 12;

    for (let i = 0; i < total; i++){
      const palette = currentPalettes[i % currentPalettes.length];
      const pickLayout = (i % 3 === 0) ? 'icon-top' : (i % 3 === 1 ? 'badge' : layout);
      const svg = makeSVG({ brand, tagline, style, icon, layout: pickLayout, palette });
      const mount = document.createElement('div');
      variantsEl.appendChild(mount);
      renderVariant(svg, mount);
    }
  }

  btnGen.addEventListener('click', generate);
  btnRand.addEventListener('click', ()=>{
    randomizePalettes();
    generate();
  });

  generate();
})();
