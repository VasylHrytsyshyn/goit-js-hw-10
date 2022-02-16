import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList : document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onCountryNameInput, DEBOUNCE_DELAY));

function onCountryNameInput(e) {
    e.preventDefault();
    const inputName = e.target.value.trim();
    cleaningMarkup();
    if (inputName) {
        fetchCountries(inputName)
            .then(renderCountries)
            .catch((e) => { Notify.failure("Oops, there is no country with that name")})
        
    };
};

function renderCountries(countries) {
    if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    } else if (countries.length > 1 && countries.length < 11) {
        createAllCountriesMurkup(countries)
    } else {
        createOneCountryMurkup(countries);
    }
}

function createAllCountriesMurkup(country) {
    cleaningMarkup();
    const markup = country.map(country => {
        return `<li class = "item-list">
            <img class="flag-img" src='${country.flags.svg}' alt='${country.name.official} flag'/>
            <h2>${country.name.official}</h2>
        </li>`;
    }).join(', ')

    refs.countryList.innerHTML = `${ markup }`;
}

function createOneCountryMurkup(country) {
    cleaningMarkup();

    const markup = country.map(country => {
        return `<div>
            <img src='${country.flags.svg}' alt='${country.name.official} flag'/>
            <h2>${country.name.official}</h2>
        </div>        
        <p><b>Capital:</b> ${country.capital}</p>
        <p><b>Population:</b> ${country.population}</p>
        <p><b>Languages:</b> ${Object.values(country.languages)}</p>`
    }).join("");
    refs.countryInfo.innerHTML = markup;   
};

function cleaningMarkup() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}

