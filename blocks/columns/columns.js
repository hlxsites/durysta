export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });

  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (!cell.previousElementSibling && !cell.nextElementSibling) cell.classList.add('columns-single');
    if (!cell.previousElementSibling && cell.nextElementSibling) cell.classList.add('columns-left');
    if (!cell.nextElementSibling && cell.previousElementSibling) cell.classList.add('columns-right');
    if (cell.previousElementSibling && cell.nextElementSibling) cell.classList.add('columns-middle');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('enter');
      }
    });
  });

  block.querySelectorAll('img').forEach((media) => {
    observer.observe(media);
  });
}
