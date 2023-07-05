import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateLinkedPictures } from '../../scripts/scripts.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 992px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]',
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute(
    'aria-label',
    expanded ? 'Open navigation' : 'Close navigation',
  );
  if (navSections) {
    toggleAllNavSections(
      navSections,
      expanded || isDesktop.matches ? 'false' : 'true',
    );
    // enable nav dropdown keyboard accessibility
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('role', 'button');
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('role');
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // fetch nav content
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const nav = document.createElement('nav');
    nav.id = 'nav';
    nav.innerHTML = html;

    const classes = ['brand', 'sections', 'tools'];
    classes.forEach((c, i) => {
      const section = nav.children[i];
      if (section) section.classList.add(`nav-${c}`);
    });

    const navSections = nav.querySelector('.nav-sections');
    if (navSections) {
      navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
        if (navSection.querySelector('ul')) {
          navSection.classList.add('nav-drop');
        }
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              'aria-expanded',
              expanded ? 'false' : 'true',
            );
          }
        });
      });
    }

    // hamburger for mobile
    const hamburger = document.createElement('div');
    hamburger.classList.add('nav-hamburger');
    hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;
    hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
    nav.prepend(hamburger);
    nav.setAttribute('aria-expanded', 'false');
    // prevent mobile nav behavior on window resize
    toggleMenu(nav, navSections, isDesktop.matches);
    isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

    decorateIcons(nav);
    decorateLinkedPictures(nav);
    const navWrapper = document.createElement('div');
    navWrapper.className = 'nav-wrapper';
    navWrapper.append(nav);
    block.append(navWrapper);

    document.addEventListener('scroll', () => {
      const navSection = document.querySelector('.nav-sections');
      navSection.setAttribute(
        'fixed-header',
        window.scrollY > 100 ? 'true' : 'false',
      );
    });

    // Recalculates active nav section after the window is scrolled
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.dataset.navIntersectRatio = entry.intersectionRatio;
          entry.target.dataset.navIntersectHeight = Math.round(
            entry.intersectionRect.height,
          );
        });

        // Active section:
        // - any section that covers more than 50% of window.screen.height
        // - otherwise: highest height visible of any sections that have > 50% ratio visible
        // - otherwise: highest ratio visible
        let activeHalfScreen;
        let activeLargestHeight;
        let activeHighestRatio;

        document.querySelectorAll('.nav-detector').forEach((section) => {
          if (section.dataset.navIntersectHeight * 2 > window.screen.height) {
            activeHalfScreen = section;
          }
          if (section.dataset.navIntersectRatio > 0.49) {
            if (
              activeLargestHeight === undefined
              || section.dataset.navIntersectHeight
              > activeLargestHeight.dataset.navIntersectHeight
            ) {
              activeLargestHeight = section;
            }
          }
          if (
            activeHighestRatio === undefined
            || section.dataset.navIntersectRatio
            > activeHighestRatio.dataset.navIntersectRatio
          ) {
            activeHighestRatio = section;
          }
        });

        let activeSection = activeHalfScreen;
        activeSection = activeSection === undefined ? activeLargestHeight : activeSection;
        activeSection = activeSection === undefined ? activeHighestRatio : activeSection;

        // Find nav button corresponding to the current section and set it as current-nav
        let activeHeaders = '';
        if (activeSection !== undefined) {
          activeHeaders = activeSection.dataset.headers.split(',');
        }
        document
          .querySelectorAll('nav > .nav-sections > ul > li')
          .forEach((navItem) => {
            if (activeHeaders.includes(navItem.querySelectorAll('a')[0].hash)) {
              navItem.classList.add('current-nav');
            } else {
              navItem.classList.remove('current-nav');
            }
          });
      },
      { threshold: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] },
    );

    // Find sections containing each h1 header, store the headier id, and add it to nav detection
    document.querySelectorAll('h1').forEach((header) => {
      let highestParent = header;
      let levels = 20;
      while (
        highestParent
        && levels > 0
        && !highestParent.classList.contains('section')
      ) {
        highestParent = highestParent.parentElement;
        levels -= 1;
      }
      if (!highestParent) {
        highestParent = header;
      }
      if (highestParent.dataset.headers === undefined) {
        highestParent.dataset.headers = `#${header.id}`;
      } else {
        highestParent.dataset.headers += `,#${header.id}`;
      }
      highestParent.classList.add('nav-detector');
      observer.observe(highestParent);
    });

    // Roll forward nav detection to following sections that don't have any h1 headers.
    let lastSection;
    document.querySelectorAll('.section').forEach((section) => {
      if (
        lastSection !== undefined
        && !section.classList.contains('nav-detector')
      ) {
        section.dataset.headers = lastSection.dataset.headers;
        section.classList.add('nav-detector');
        observer.observe(section);
      }
      lastSection = section;
    });
  }
}
