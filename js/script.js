const formEl = document.querySelector("form");
const containerDiv = document.querySelector("#containerDiv");

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.querySelector("#search").value;
  const radioNameEl = document.querySelector("#name");
  const radioLangEl = document.querySelector("#language");

  if (radioNameEl.checked && input !== "") {
    getCountry(fetchCountryByName, input);
  } else if (radioLangEl.checked && input !== "") {
    getCountry(fetchCountryByLanguage, input);
  } else {
    displayEmptyInputMessage();
  }
  // fetchCountry(type, text).then(displayCountries);
  formEl.reset();
});

async function fetchCountryByName(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,subregion,capital,population,flags`;

  const response = await fetch(url);
  const data = await response.json();

  if (response.status >= 200 && response.status < 300) {
    return data;
  } else if (response.status === 404) {
    throw 404;
  } else {
    throw Error("Unexpected error when fetching countries by name");
  }
}

async function fetchCountryByLanguage(language) {
  const url = `https://restcountries.com/v3.1/lang/${language}?fields=name,subregion,capital,population,flags`;

  const response = await fetch(url);
  const data = await response.json();

  if (response.status >= 200 && response.status < 300) {
    return data;
  } else if (response.status === 404) {
    throw 404;
  } else {
    throw Error("Unexpected error when fetching countries by language");
  }
}

// callback function för async fetch
// input för inputet användaren har matat in
function getCountry(callback, input) {
  callback(input)
    .then((arr) => {
      displayCountry(arr);
    })
    .catch((error) => {
      displayError(error, input);
    });
}

// Skickar array som parameter för att loopa igenom alla country objekt
// Största anledningen är för att visa flera länder i DOM:en och rensa senaste sökning
function displayCountry(countryArr) {
  containerDiv.innerHTML = "";

  // Jämför elementen
  // Om det returneras ett positivt värde - första elementet får högre index
  // Om det returneras ett negativt värde - första elementet får mindre index
  countryArr.sort((firstCountryObj, secondCountryObj) => {
    return secondCountryObj.population - firstCountryObj.population;
  });

  // Bubble sort algorithm - smidigare att använda sort metoden

  // for (let i = 0; i < countryArr.length; i++) {
  //   console.log(countryArr);
  //   for (let j = 0; j < countryArr.length - 1; j += 1) {
  //     if (countryArr[j + 1].population > countryArr[j].population) {
  //       let temp = countryArr[j].population;
  //       countryArr[j].population = countryArr[j + 1].population;
  //       countryArr[j + 1].population = temp;
  //     }
  //   }
  // }

  for (const country in countryArr) {
    const countryCard = document.createElement("div");
    countryCard.classList.add("countryCard");

    const nameEl = document.createElement("h2");
    const ulEl = document.createElement("ul");
    const subRegionEl = document.createElement("li");
    const capitalEl = document.createElement("li");
    const populationEl = document.createElement("li");
    const imgEl = document.createElement("img");

    nameEl.innerText = countryArr[country].name.official;
    subRegionEl.innerText = `Subregion: ${countryArr[country].subregion}`;

    if (countryArr[country].capital[0] === undefined) {
      capitalEl.innerText = `Capital: None`;
    } else {
      capitalEl.innerText = `Capital: ${countryArr[country].capital[0]}`;
    }

    populationEl.innerText = `Population: ${countryArr[country].population}`;
    imgEl.src = countryArr[country].flags.png;

    ulEl.append(subRegionEl, capitalEl, populationEl);
    countryCard.append(nameEl, ulEl, imgEl);
    containerDiv.append(countryCard);
  }
}

function displayEmptyInputMessage() {
  const h2El = document.createElement("h2");
  containerDiv.innerHTML = "";

  h2El.innerHTML =
    "You forgot to type in the input field and check either name or language :(";
  containerDiv.append(h2El);
}

function displayError(error, input) {
  console.log(error);
  const h2El = document.createElement("h2");
  containerDiv.innerHTML = "";

  if (error === 404) {
    h2El.innerText = `${input} could not be found, please try another country or language!`;
  } else {
    h2El.innerText = `Unexpected error, try again later`;
  }

  containerDiv.append(h2El);
}
