import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
}

refs.input.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(evt) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

    const name = evt.target.value.trim();

    if (name === '') {
        fetchCountries(name)
        .then(name => {
            if (name.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            }

            if (name.length > 2 && name.length < 10) {
                const list = renderCountryList(name);
                refs.countryList.innerHTML = list;
                return;
            }

            if (name.length === 1) {
                const info = renderCountryInfo(name);
                refs.countryInfo.innerHTML = info;
                return
            }
        })
        .catch(error => Notiflix.Notify.failure('Oops, there is no country with that name'))
    }
}


function renderCountryList(countries) {
    const markupList = countries.map(country => {
        return `<li>
            <img src="${country.flags.svg}"></img>
            <p>${country.name.official}</p>
        </li>`
    }).join('');

    return markupList;
}

function renderCountryInfo(countries) {
    const murkupInfo = countries.map(country => {
        return `<img src="${country.flags.svg}"></img>
            <h2>${country.name.official}</h2>
            <ul>
                <li><span>Capital:</span> ${country.capital}</li>
                <li><span>Population:</span> ${country.population}</li>
                <li><span>Languages:</span> ${Object.values(country.languages).join(', ')}</li>
            </ul>`
    }).join('');

    return murkupInfo;
}
