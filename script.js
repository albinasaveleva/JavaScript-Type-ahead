const url = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json', //https://api.hh.ru/areas русские города
    cities = [],
    searchInput = document.querySelector('.search'),
    suggestions = document.querySelector('.suggestions');

const findMatches = (word, citiesList = cities) => {
    return citiesList.filter(item => {
        const regexp = new RegExp(word, 'gi');
        return item.city.match(regexp) || item.state.match(regexp);
    })
} 
const numberWithSpace = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function displayMatches() {
    let fragment = new DocumentFragment();
    findMatches(this.value).forEach(item => {
        let regexp = new RegExp(this.value, 'gi');
        let cityName = item.city.replace(regexp, `<span class="hl">${this.value}</span>`);
        let stateName = item.state.replace(regexp, `<span class="hl">${this.value}</span>`);
        let li = document.createElement('li');
        li.innerHTML = `
            <span class="name">${cityName}, ${stateName}</span>
            <span class="population">${numberWithSpace(item.population)}</span>
        `;
        fragment.append(li);
    });
    suggestions.innerHTML = '';
    suggestions.append(fragment);
}
fetch(url)
    .then(promise => {
        if (promise.ok) {
            return promise.json()
        } else {
            throw new Error('Что-то пошло не так...');
        }
    })
    .then(result => cities.push(...result))
    .then( () => { 
        searchInput.addEventListener('change', displayMatches);
        searchInput.addEventListener('input', displayMatches);
    })
    .catch(error => console.error(error));