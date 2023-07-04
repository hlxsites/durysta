import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function trackScroll(block, itemsCount) {
  const slides = block.querySelectorAll('[data-index]');
  let lastSlideIndex = -1;
  block.dataset.currentIndex = 0;

  const scrollHandler = () => {
    const rect = block.getBoundingClientRect();
    const slideIndex = Math.ceil(
      Math.max(0, Math.min(itemsCount - 1, 
        itemsCount * -1 * rect.top / rect.height
      ))
    );
    if(lastSlideIndex !== slideIndex) {
      block.dataset.currentIndex = slideIndex;
      slides.forEach((slide) => slide.dataset.active = (slide.dataset.index === `${slideIndex}`));
      lastSlideIndex = slideIndex;
    }
  }

  document.addEventListener("scroll", scrollHandler);
  window.requestAnimationFrame(scrollHandler)
}

function addClickHandlers(block, itemsCount) {
  block.addEventListener('click', (event) => {
    const target = event.target.closest('.scroll-animation-heading');
    if (!target) return;
    const index = Number(target.closest('[data-index]').dataset.index);
    if (isNaN(index)) return;
    const rect = block.getBoundingClientRect();
    const offset = rect.top + (index - 1 ) * (rect.height / itemsCount) + document.documentElement.scrollTop + 1;
    window.scrollTo({ top: offset, behavior: 'instant' });
  });
}

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'scroll-animation-window';
  const itemsCount = block.children.length;
  block.style.setProperty('--scroll-animation-items', itemsCount);

  [...block.children].forEach((row, rowIndex) => {
    [...row.children].forEach((cell, colIndex) => {
      cell.dataset.index = rowIndex;
      if (colIndex === 0) cell.className = 'scroll-animation-image';
      if (colIndex === 1) cell.className = 'scroll-animation-body';
      if (colIndex === 1) [...cell.children].forEach((element, elIndex) => {
        if (elIndex === 0) element.className = 'scroll-animation-heading';
        if (elIndex > 0) element.className = 'scroll-animation-text';
      });
      container.append(cell);
    });
  });

  const scrollIcon = document.createElement('div');
  scrollIcon.className = 'scroll-animation-scroll-icon';
  container.append(scrollIcon);

  container.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';

  block.append(container);
  trackScroll(block, itemsCount);
  addClickHandlers(block, itemsCount);
}
