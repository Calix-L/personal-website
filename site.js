const figureDialog = document.querySelector('.figure-dialog');
const expandedFigure = figureDialog.querySelector('.figure-expanded');
const figureCaption = figureDialog.querySelector('.figure-caption');
document.querySelectorAll('.teaser-wrap').forEach((button) => {
  const figure = button.querySelector('img');
  button.setAttribute('aria-label', 'Enlarge: ' + figure.alt);
  button.addEventListener('click', () => {
    expandedFigure.src = figure.src;
    expandedFigure.alt = figure.alt;
    figureCaption.textContent = figure.alt;
    figureDialog.showModal();
  });
});
figureDialog.querySelector('.figure-close').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', (event) => {
  if (event.target === figureDialog) {
    const bounds = figureDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) figureDialog.close();
  }
});

// Public, unauthenticated metadata only; verified HTML counts remain as a fallback.
document.querySelectorAll('[data-repo]').forEach(async (card) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch('https://api.github.com/repos/' + card.dataset.repo, {
      signal: controller.signal,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) return;
    const repo = await response.json();
    if (!Number.isSafeInteger(repo.stargazers_count) || !Number.isSafeInteger(repo.forks_count)) return;
    card.querySelector('[data-stars]').textContent = repo.stargazers_count.toLocaleString('en-US');
    card.querySelector('[data-forks]').textContent = repo.forks_count.toLocaleString('en-US');
    card.querySelector('[data-stat-note]').textContent = 'GitHub statistics updated ' + new Date().toISOString().slice(0, 10) + '.';
  } catch {
    // Offline, timeout, or rate limit: retain the dated snapshot, without hiding content.
  } finally {
    clearTimeout(timeout);
  }
});
