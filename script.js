"use strict";


const countryInput = document.getElementById("country-input");
const searchBtn = document.getElementById("search-btn");
const loadingSpinner = document.getElementById("loading-spinner");
const countryInfo = document.getElementById("country-info");
const borderingCountries = document.getElementById("bordering-countries");
const errorMessage = document.getElementById("error-message");


function showSpinner() {
  loadingSpinner.classList.remove("hidden");
}

function hideSpinner() {
  loadingSpinner.classList.add("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = "";
}

function clearResults() {
  countryInfo.innerHTML = "";
  borderingCountries.innerHTML = "";
}

hideSpinner();


searchBtn.addEventListener("click", () => {
  const name = countryInput.value.trim();
  if (name !== "") {
  searchCountry(name);
    }
});

countryInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const name = countryInput.value.trim();
    if (name !== "") {
      searchCountry(name);
    }
  }
});

async function searchCountry(countryName) {
  showSpinner();
  clearError();
  clearResults();

  try {
    
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

    if (!response.ok) {
      throw new Error("Country not found. Please try again.");
    }

    const data = await response.json();
    const country = data[0];

  
    countryInfo.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
    `;

   
    if (country.borders) {
      for (let borderCode of country.borders) {
        const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
        const borderData = await borderResponse.json();
        const borderCountry = borderData[0];

        const button = document.createElement("button");
        button.textContent = borderCountry.name.common;

        button.addEventListener("click", () => {
          searchCountry(borderCountry.name.common);
        });

        borderingCountries.appendChild(button);
      }
    }

  } catch (error) {
    showError(error.message);
  } finally {
    hideSpinner();
  }
}