export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // faq
  if (block.classList.contains('faq')) {
    const headerHeight = document.getElementsByTagName('header')[0].offsetHeight;
    const marginTop = 10;
    [...block.children].forEach((row) => {
      row.setAttribute('faq-expanded', 'false');
      const faqHeader = row.firstElementChild;
      faqHeader.classList.add('faq-header');
      const faqBody = row.getElementsByTagName('div')[1];
      faqBody.classList.add('faq-body');

      const faqButton = document.createElement('div');
      faqButton.classList.add('faq-button');
      faqHeader.appendChild(faqButton);

      faqHeader.addEventListener('click', () => {
        const currentExpended = faqHeader.parentElement.getAttribute('faq-expanded');
        faqHeader.parentElement.setAttribute('faq-expanded', currentExpended === 'true' ? 'false' : 'true');
        if (currentExpended === 'false') {
          faqBody.style.maxHeight = `${faqBody.scrollHeight}px`;
        } else {
          faqBody.style.maxHeight = '';
        }
        window.scrollTo({
          top: faqHeader.getBoundingClientRect().y + window.scrollY - headerHeight - marginTop,
          left: 0,
          behavior: 'smooth',
        });
      });
    });
  }
}
