const formEl = document.querySelector("form");
const containerDiv = document.querySelector("#containerDiv");

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = document.querySelector("#search").value;
  const radioNameEl = document.querySelector("#name");
  const radioLangEl = document.querySelector("#language");
  const radioArr = [];

  if(radioNameEl.checked){
    radioArr.push(radioNameEl.value)
  } else if(radioLangEl.checked) {
    radioArr.push(radioLangEl.value)
  }

  fetchCountry(radioArr[0], input)
  .then(displayCountries)
  .catch(error =>{
    displayErrorMessage(error, input)
  })

  formEl.reset();
});

async function fetchCountry(property, input){
  
  const url = `https://restcountries.com/v3.1/${property}/${input}?fields=name,subregion,capital,population,flags`;

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

function displayCountries(countryArr) {
  containerDiv.innerHTML = "";

  // Jämför elementen
  // Om det returneras ett positivt värde - första elementet får högre index
  // Om det returneras ett negativt värde - första elementet får mindre index
  countryArr.sort((firstCountryObj, secondCountryObj) => {
    return secondCountryObj.population - firstCountryObj.population;
  });

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

function displayErrorMessage(error, input) {
  console.log(error);
  const h2El = document.createElement("h2");
  containerDiv.innerHTML = "";

  if (error === 404) {
    h2El.innerText = `${input} could not be found, please try another country or language!`;
  } 
  else {
    h2El.innerText = `Unexpected error, try again later`;
  }

  containerDiv.append(h2El);
}