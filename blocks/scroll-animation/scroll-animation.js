import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

class ScrollAnimation {
  constructor(block) {
    this.block = block;
    this.itemsCount = block.children.length;
  }

  trackScroll() {
    const slides = this.block.querySelectorAll('[data-index]');
    let lastSlideIndex = -1;
    this.block.dataset.currentIndex = 0;
  
    const scrollHandler = () => {
      const rect = this.block.getBoundingClientRect();
      const slideIndex = Math.ceil(
        Math.max(0, Math.min(this.itemsCount, 
          this.itemsCount * -1 * rect.top / rect.height
        ))
      );
      if(lastSlideIndex !== slideIndex) {
        this.block.dataset.currentIndex = slideIndex;
        slides.forEach((slide) => {
          const index = Number(slide.dataset.index);
          if (index < slideIndex) slide.dataset.status = 'behind';
          if (index === slideIndex) slide.dataset.status = 'active';
          if (index > slideIndex) slide.dataset.status = 'hidden';
        });
        lastSlideIndex = slideIndex;
      }
    }
  
    document.addEventListener("scroll", scrollHandler);
    window.requestAnimationFrame(scrollHandler)
  }
  
  addClickHandlers() {
    this.block.addEventListener('click', (event) => {
      const target = event.target.closest('.scroll-animation-heading');
      if (!target) return;
      const index = Number(target.closest('[data-index]').dataset.index);
      if (Number.isNaN(index)) return;
      const rect = this.block.getBoundingClientRect();
      const offset = rect.top + (index - 1 ) * (rect.height / this.itemsCount) + document.documentElement.scrollTop + 1;
      window.scrollTo({ top: offset, behavior: 'instant' });
    });
  }

  render() {
    const container = document.createElement('div');
    container.className = 'scroll-animation-window';
    this.block.style.setProperty('--scroll-animation-items', this.itemsCount);
  
    [...this.block.children].forEach((row, rowIndex) => {
      [...row.children].forEach((cell, colIndex) => {
        cell.dataset.index = rowIndex;
        if (colIndex === 0) cell.className = 'scroll-animation-image';
        if (colIndex === 1) cell.className = 'scroll-animation-body';
        if (colIndex === 1) [...cell.children].forEach((element) => {
          if (element.matches('h1,h2,h3,h4,h5,h6'))  {
            element.className = 'scroll-animation-heading';
          } else {
            element.className = 'scroll-animation-text';
          }
        });
        container.append(cell);
      });
    });
  
    const scrollIcon = document.createElement('div');
    scrollIcon.className = 'scroll-animation-scroll-icon';
    container.append(scrollIcon);
  
    container.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
    this.block.textContent = '';
  
    this.block.append(container);
    this.trackScroll();
    this.addClickHandlers();
  
  }
}

export default function decorate(block) {
  const scrollAnimation = new ScrollAnimation(block);
  scrollAnimation.render();
}