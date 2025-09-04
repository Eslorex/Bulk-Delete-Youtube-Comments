(() => {
  const seen = new WeakSet();
  let running = true;

  function findDeleteButtons() {
    const nodes = Array.from(document.querySelectorAll('button, [role="button"]'));
    return nodes.filter(b => {
      if (seen.has(b)) return false;
      const label = (b.getAttribute('aria-label') || '') + ' ' + (b.textContent || '');
      return /sil|delete/i.test(label);
    });
  }

  function clickConfirmIfPresent() {
    const nodes = Array.from(document.querySelectorAll('button, [role="button"]'));
    const confirm = nodes.find(b => /sil|delete|remove|kaldır/i.test(b.textContent || ''));
    if (confirm) confirm.click();
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function processOne(btn) {
    seen.add(btn);
    btn.click();
    await wait(2900);
    clickConfirmIfPresent();
    await wait(2900);
  }

  async function mainLoop() {
    while (running) {
      const batch = findDeleteButtons();
      for (const btn of batch) {
        await processOne(btn);
      }
      await wait(2600);
    }
  }

  mainLoop();

  window.stopDeleting = () => { running = false; };
})();
