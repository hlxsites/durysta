import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

function trackScroll(block, itemsCount) {
  const element = document.querySelector('.scroll-animation'); 
  let lastSlideIndex = 0;
  block.dataset.currentIndex = 0;

  document.addEventListener("scroll", (event) => {
    const rect = element.getBoundingClientRect();
    const slideIndex = Math.ceil(
      Math.max(0, Math.min(itemsCount - 1, 
        itemsCount * -1 * rect.top / rect.height
      ))
    );

    if(lastSlideIndex !== slideIndex) {
      block.dataset.currentIndex = slideIndex;
      lastSlideIndex = slideIndex;
    }
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
}
