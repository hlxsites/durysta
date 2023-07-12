import {
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

import {
  div,
  domEl,
} from './dom-helpers.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds a section divider
 * @param {Element} main The container element
 */
function buildSectionDivider(main) {
  const sectionDividers = main.querySelectorAll('code');

  sectionDividers.forEach((el) => {
    const alt = el.innerText.trim();
    const lower = alt.toLowerCase();
    if (lower === 'divider') {
      el.innerText = '';
      el.classList.add('section-divider');
    }
  });
}

/**
 * Builds a media-dependent picture
 * @param {Element} main The container element
 */
function buildMediaDependentPicture(main) {
  const mediaTags = main.querySelectorAll('code');

  mediaTags.forEach((el) => {
    const alt = el.innerText.trim();
    const lower = alt.toLowerCase();
    const mediaTypes = ['mobile', 'tablet', 'laptop', 'desktop', 'hd', 'tablet-plus', 'laptop-plus', 'desktop-plus', 'tablet-minus', 'laptop-minus', 'desktop-minus'];
    if (mediaTypes.includes(lower)) {
      el.previousElementSibling.classList.add(`media-${lower}`);
      el.innerText = '';
      el.remove();
    }
  });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildSectionDivider(main);
    buildMediaDependentPicture(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function linkPicture(picture) {
  const checkAndAppendLink = (anchor) => {
    if (anchor && anchor.textContent.trim().startsWith('https://')) {
      anchor.innerHTML = '';
      anchor.className = '';
      anchor.appendChild(picture);
    }
  };

  // Handle case where link is directly after image, or with a <br> between.
  let nextSib = picture.nextElementSibling;
  if (nextSib?.tagName === 'BR') {
    const br = nextSib;
    nextSib = nextSib.nextElementSibling;
    br.remove();
  }

  if (nextSib?.tagName === 'A') {
    checkAndAppendLink(nextSib);
    return;
  }

  // Handle case where link is in a separate paragraph
  const parent = picture.parentElement;
  const parentSibling = parent.nextElementSibling;
  if (parent.tagName === 'P' && parentSibling?.tagName === 'P') {
    const maybeA = parentSibling.children?.[0];
    if (parentSibling.children?.length === 1 && maybeA?.tagName === 'A') {
      checkAndAppendLink(maybeA);
      if (parent.children.length === 0) {
        parent.remove();
      }
    }
  }
}

export function decorateLinkedPictures(block) {
  block.querySelectorAll('picture').forEach((picture) => {
    linkPicture(picture);
  });
}

export function createVideoModal(main, src) {
  const videoContainer = div({ class: 'video-container fade-in' });
  const videoModal = div({ class: 'video-modal fade-in' });
  const videoWrap = div({ class: 'video-wrap' });
  const close = div({ class: 'video-close' });
  const videoIframe = domEl('iframe', { class: 'video-iframe' });

  videoIframe.setAttribute('src', src);
  videoWrap.append(videoIframe);
  videoModal.append(close, videoWrap);
  videoContainer.append(videoModal);
  main.append(videoContainer);

  const closeButton = main.querySelector('.video-close');
  const videoContainerDiv = main.querySelector('.video-container');
  if (closeButton) {
    const fadeOut = () => {
      videoModal.classList.add('fade-out');
      videoContainer.classList.add('fade-out');
      videoModal.onanimationend = () => {
        if (videoModal.classList.contains('fade-out')) {
          videoContainerDiv.remove();
        }
      };
    };
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      fadeOut();
    });

    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 27 || event.key === 'Escape') {
        fadeOut();
      }
    });
  }
}

export function decorateVideo(main) {
  main.querySelectorAll('a').forEach((link) => {
    // look for picture that have a link after wards
    const href = link.getAttribute('href');
    if (href.includes('vimeo')) {
      const pictures = link.closest('p').nextElementSibling.querySelectorAll('picture');
      if (pictures.length > 0) {
        const videoPlaceHolder = pictures[0];
        videoPlaceHolder.addEventListener('click', () => {
          createVideoModal(main, href);
        });
        link.remove();
      }
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateLinkedPictures(main);
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateVideo(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/icons/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
