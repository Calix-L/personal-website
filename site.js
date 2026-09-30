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
