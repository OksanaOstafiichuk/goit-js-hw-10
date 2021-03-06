import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(evt) {
  const name = evt.target.value.trim();

  if (name === '') {
    clearData();
    return;
  }

  fetchCountries(name)
    .then(showCountries)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearData() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function showCountries(countries) {
  if (countries.length === 1) {
    renderCountryInfo(countries);
  } else if (countries.length >= 2 && countries.length <= 10) {
    renderCountryList(countries);
  } else {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    clearData();
  }
}

function renderCountryList(countries) {
  refs.countryInfo.innerHTML = '';

  const markupList = countries
    .map(country => {
      return `<li>
            <img src="${country.flags.svg}"></img>
            <p>${country.name.official}</p>
        </li>`;
    })
    .join('');

  refs.countryList.innerHTML = markupList;
}

function renderCountryInfo(countries) {
  refs.countryList.innerHTML = '';

  const murkupInfo = countries
    .map(country => {
      return `<img src="${country.flags.svg}"></img>
            <h2>${country.name.official}</h2>
            <ul>
                <li><span>Capital:</span> ${country.capital}</li>
                <li><span>Population:</span> ${country.population}</li>
                <li><span>Languages:</span> ${Object.values(country.languages).join(', ')}</li>
            </ul>`;
    })
    .join('');

  refs.countryInfo.innerHTML = murkupInfo;
}
