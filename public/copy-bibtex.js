// The website and the standalone HTML preview use the same copy behavior.
(() => {
  const timers = new WeakMap();
  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('button[data-copy-bibtex]');
    if (!button) return;
    const code = button.parentElement.querySelector('pre code');
    if (!code) return;

    let copied = false;
    try {
      await navigator.clipboard.writeText(code.textContent);
      copied = true;
    } catch {
      // Standalone files and restricted browsers may only allow selection-based copying.
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        copied = document.execCommand('copy');
      } catch {
        // Leave the entry selected for the browser's Copy command.
      }
      if (copied) selection.removeAllRanges();
    }

    clearTimeout(timers.get(button));
    button.textContent = copied ? 'Copied!' : 'Text selected — copy manually';
    timers.set(button, setTimeout(() => { button.textContent = 'Copy BibTeX'; }, 3000));
  });
  document.documentElement.classList.add('bibtex-copy-ready');
})();
