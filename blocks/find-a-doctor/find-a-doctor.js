import {
    form,
    label,
    input,
    div,
    ul,
    li,
    button
} from '../../scripts/dom-helpers.js';

const formatError = 'please enter a valid 5-digit zip code.';

function submit(zipCode, radius, callback) {
    console.log(`${zipCode} ${radius}`);

    // fake call
    setTimeout(callback, 5000);
}

export default function decorate(block) {
    const cols = [...block.firstElementChild.children];
    block.classList.add(`columns-${cols.length}-cols`);

    // setup image columns
    [...block.children].forEach((row) => {
      row.classList.add('columns-row');
      [...row.children].forEach((col) => {
        col.classList.add('columns-col');
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

    // setup form
    if(!(block.children.length > 0 && block.children[0].children.length > 0 && block.children[0].children[0].children.length > 2)) {
        return;
    }
    const formWrapper = block.children[0].children[0].children[2];
    formWrapper.innerHTML = "";
    const formComponent = form();

    // Zip Input
    const zipCodeLabel = label();
    zipCodeLabel.innerHTML = "ZIP Code";
    const zipCodeInput = input({id: 'zipCode', class: 'form-element', maxlength: '5', autocomplete: 'off'});
    zipCodeInput.addEventListener("input", () => {
        zipCodeInput.value = zipCodeInput.value.replace(/[^0-9]/g, '');
    });

    const zipCodeContainer = div({class: 'zip-code-wrapper'}, zipCodeLabel, zipCodeInput);


    // Radius Select
    const radiusLabel = label();
    radiusLabel.innerHTML = "Mileage Radius";
    const radiusSelectedOption = div({id: 'radius', class: 'form-element selected-radius'});
    const radiusOptionsWrapper = ul({class: 'radius-options', expanded: 'false'});
    radiusSelectedOption.addEventListener('click', () => {
        const expanded = radiusOptionsWrapper.getAttribute('expanded') === 'true';
        radiusOptionsWrapper.setAttribute( 'expanded', expanded ? 'false' : 'true');
    });
    ['25', '50', '75'].forEach((miles) => {
        const option = li({ value: `${miles}`, class: 'form-element' });
        option.innerHTML = `${miles} mi`;
        option.addEventListener('click', () => {
            radiusSelectedOption.innerHTML = `${miles} mi`;
            radiusSelectedOption.setAttribute('value', miles);
            radiusOptionsWrapper.setAttribute('expanded', 'false')
        });
        radiusOptionsWrapper.append(option);
    });
    radiusSelectedOption.innerHTML = radiusOptionsWrapper.children[0].innerHTML;
    radiusSelectedOption.setAttribute('value', radiusOptionsWrapper.children[0].getAttribute('value'));
    const radiusSelect = div({class: 'radius-select'}, radiusSelectedOption, radiusOptionsWrapper);
    radiusSelect.append(radiusOptionsWrapper);
    const radiusContainer = div({ class: 'select-radius-wrapper' }, radiusLabel, radiusSelect);

    // Preloader
    const preloaderComponent = div({class: 'preloader'});

    // Error Message
    const errorMessage = div({class: 'error-message'});
    errorMessage.innerHTML = formatError;

    // Submit Button
    const submitButton = button({ class: 'submit-button' });
    submitButton.innerHTML = "search";
        submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        errorMessage.setAttribute('visible', 'false');

        const zip = zipCodeInput.value;
        const radius = radiusSelectedOption.getAttribute('value');

        if(!/^([0-9]{5})$/.test(zip)) {
            errorMessage.setAttribute('visible', 'true');
            return;
        }

        preloaderComponent.setAttribute('loading', 'true')
        submit(zip, radius, () => {
            preloaderComponent.setAttribute('loading', 'false');
        });
    });

    formComponent.append(zipCodeContainer);
    formComponent.append(radiusContainer);
    formComponent.append(errorMessage);
    formComponent.append(submitButton);
    formWrapper.append(formComponent);
    formWrapper.append(preloaderComponent);
}
