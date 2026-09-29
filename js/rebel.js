(() => {
  const typewriter = document.querySelector('[data-typewriter]');
  if (typewriter) {
    const snippets = [
      ['Python', 'print("Hello, World!")'],
      ['JavaScript', 'console.log("Hello, World!");'],
      ['C', 'printf("Hello, World!\\n");'],
      ['Java', 'System.out.println("Hello!");'],
      ['SQL', 'SELECT * FROM life;'],
      ['Python', 'import this']
    ];
    const language = document.querySelector('[data-code-language]');
    const toggle = document.querySelector('.typing-toggle');
    const terminal = document.querySelector('.hero-terminal');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0, length = 0, deleting = false, paused = false, timer;
    const paint = () => {
      language.textContent = snippets[index][0];
      typewriter.textContent = snippets[index][1].slice(0, length);
    };
    const tick = () => {
      if (paused || reduced.matches || document.hidden) return;
      const line = snippets[index][1];
      length += deleting ? -1 : 1;
      paint();
      let delay = deleting ? 42 : 95;
      if (!deleting && length === line.length) { deleting = true; delay = 2100; }
      else if (deleting && length === 0) {
        deleting = false; index = (index + 1) % snippets.length; delay = 450;
      }
      timer = setTimeout(tick, delay);
    };
    const sync = () => {
      clearTimeout(timer);
      terminal.classList.toggle('typing-paused', paused || reduced.matches || document.hidden);
      toggle.hidden = reduced.matches;
      if (reduced.matches) {
        length = snippets[index][1].length; deleting = true; paint();
      } else if (!paused && !document.hidden) timer = setTimeout(tick, 500);
    };
    toggle.addEventListener('click', () => {
      paused = !paused;
      toggle.textContent = paused ? '继续动画 ▶' : '暂停动画 Ⅱ';
      toggle.setAttribute('aria-label', paused ? '继续代码动画' : '暂停代码动画');
      sync();
    });
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    paint(); sync();
  }
  const dialog = document.querySelector('#search-dialog');
  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  let posts;
  const render = () => {
    results.replaceChildren();
    if (!posts) return;
    const query = input.value.trim().toLocaleLowerCase();
    const matches = posts.filter(p => (p.title + ' ' + p.text).toLocaleLowerCase().includes(query));
    status.textContent = query ? `找到 ${matches.length} 篇笔记` : '所有笔记';
    matches.slice(0,30).forEach(p => {
      const link = document.createElement('a'); link.href = p.url;
      const title = document.createElement('strong'); title.textContent = p.title;
      const excerpt = document.createElement('p'); excerpt.textContent = p.text.slice(0,110);
      link.append(title,excerpt); results.append(link);
    });
  };
  document.querySelector('.search-open').addEventListener('click', async () => {
    dialog.showModal(); input.focus();
    if (!posts) {
      status.textContent = '正在加载笔记…';
      try { const response = await fetch(input.dataset.source); if(!response.ok) throw new Error(); posts = await response.json(); }
      catch { status.textContent = '加载失败，请关闭后重试。'; return; }
    }
    render();
  });
  input.addEventListener('input',render);
  dialog.addEventListener('click',e => {if(e.target === dialog) {const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();}});
  const top = document.querySelector('.top-button');
  window.addEventListener('scroll',()=>{top.hidden = window.scrollY < 500;},{passive:true});
  top.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
  document.querySelectorAll('.prose figure.highlight').forEach(block => {
    const button=document.createElement('button'); button.className='copy-code';button.textContent='复制';button.type='button';
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(block.querySelector('.code').innerText);button.textContent='已复制';}catch{button.textContent='请手动选择复制';}setTimeout(()=>button.textContent='复制',1800);});
    block.append(button);
  });
})();
