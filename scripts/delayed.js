// eslint-disable-next-line import/no-cycle
import { sampleRUM, fetchPlaceholders, loadScript } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here
const placeholders = await fetchPlaceholders();
const isProd = window.location.hostname.endsWith(placeholders.hostname);

// Adobe launch script start
loadScript(
  `${isProd ? 'https://assets.adobedtm.com/ba387603a282/12150779357f/launch-da3cd118acca.min.js' : 'https://assets.adobedtm.com/ba387603a282/12150779357f/launch-8b841cf5fdbd-development.min.js'}`,{
    async: '',
    type: 'text/javascript',
    charset: 'UTF-8',
  },);

// OneTrust Cookies Consent Notice start
const otId = placeholders.onetrustid;
if (otId) {
  loadScript('https://cdn.cookielaw.org/scripttemplates/otSDKStub.js', {
    type: 'text/javascript',
    charset: 'UTF-8',
    'data-domain-script': `${otId}${isProd ? '' : '-test'}`,
  });
}

const cookiepolicyLink = document.querySelector('a[href="https://durysta.com/cookies-policy.html"]');
if (cookiepolicyLink) {
  cookiepolicyLink.classList.add('ot-sdk-show-settings', 'nopopup');
  cookiepolicyLink.addEventListener('click', (e) => {
    e.preventDefault();
    // eslint-disable-next-line no-undef, no-unused-expressions
    OneTrust.showCookieSettingsHandler;
  });
}
