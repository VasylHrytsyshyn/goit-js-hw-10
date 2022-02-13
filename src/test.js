import '../css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryListTemplate from '../templates/country-list.hbs';
import countryInfoTemplate from '../templates/country-info.hbs'

const DEBOUNCE_DELAY = 300;
const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('ul');
const countryInfoRef = document.querySelector('div');
let dataInput = '';

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    dataInput = event.target.value.trim();
    countryListRef.innerHTML = '';
    countryInfoRef.innerHTML = '';
    if (dataInput !== '') {
        fetchCountries(dataInput)
        .then(renderResponse)
        .catch(onErrorMessage);
    }
}

function renderResponse(countries) {
            if (countries.length > 10) {
                tooManyMatches();
            } else if (countries.length > 1 && countries.length <= 10) {
                createCountryList(countries);
            } else {
                createCountryInfo(countries);
        }}


function createCountryList(countries) {
    countries.map(country => {
        countryListRef.insertAdjacentHTML('beforeend', countryListTemplate(country))
    })
}

function createCountryInfo(countries) {
    let { name, flags, capital, population, languages } = countries[0];
    languages = languages.map(language => language.name).join(', ');
    countryInfoRef.insertAdjacentHTML('beforeend', countryInfoTemplate({ name, flags, capital, population, languages }))
}

// function tooManyMatches() {
//     Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
// }

// function onErrorMessage() {
//     Notiflix.Notify.failure("Oops, there is no country with that name")
// }

//=========================================================================
import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries'

const DEBOUNCE_DELAY = 300;  //делать HTTP-запрос спустя 300мс после того, как пользователь перестал вводить текст (используй пакет lodash.debounce.)
// ------------------------------------------------------------------------

const inputRef = document.querySelector('input#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput() {
    const textInput = inputRef.value.trim();  //trim() удаляет пробельные символы с начала и конца строки

    countriesList.innerHTML = '';
    countryInfo.innerHTML = '';
    
    fetchCountries(textInput)
        .then(checkDataLength)
        .catch(error => console.log(error));
}

// ---------------------------------------------------------------
function checkDataLength(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length <= 10) {
    renderCountries(countries);
  } else if (countries.length === 1) {
    renderCountryInfo(countries);
  } else if (countries.status === 404) {
       Notify.failure('Oops, there is no country with that name.');
        return;
  }
    console.log('Найденые страны:', countries.length)
}



// функция - перечень стран
function renderCountries(country) {
    countriesList.innerHTML = '';

    const markup = country.map(country => {
            return `<div class="renderCountryInfo-wrapper">
            <img class="flag-img" src='${country.flag}' alt='${country.name} flag' width='50'/>
            <h2>${country.name}</h2>
        </div>`;
    })
        .join('');
    countryInfo.innerHTML = markup;    
};

//функ,рендерит (разметка) - 1страна +характеристики
function renderCountryInfo(country) {
    countriesList.innerHTML = '';

    const markup = country.map(country => {
    return `<div class="renderCountryInfo-wrapper">
            <img class="flag-img" src='${country.flag}' alt='${country.name} flag' width='50'/>
            <h2>${country.name}</h2>
        </div>
        
        <p class="render-text"><b>Capital:</b> ${country.capital}</p>
        <p class="render-text"><b>Population:</b> ${country.population}</p>
        <p class="render-text"><b>Languages:</b> ${country.languages.map(item => `${item.name}`)}</p>`
    })
        .join("");
    countryInfo.innerHTML = markup;    
};