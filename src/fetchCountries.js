const RESOURCE_URL = 'https://restcountries.com/v3.1';

export function fetchCountries(name) {
    return fetch(`${RESOURCE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
    .then(response => {
        if (response.ok) {
            return response.json()
        }
        throw new Error(response.statusText)
    }) 
};
