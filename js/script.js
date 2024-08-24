"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const currencyOne = document.querySelector("#currency-one"),
        amountOne = document.querySelector("#amount-one"),
        currencyTwo = document.querySelector("#currency-two"),
        amountTwo = document.querySelector("#amount-two"),
        rateEl = document.querySelector("#rate"),
        swap = document.querySelector("#swap"),
        currencyBlockParents = document.querySelectorAll('.currency'),
        calcContainer = document.querySelector('.calc-container');

  function createNewOption(parent, key) {
    const currencyOneOption = document.createElement('option');
    currencyOneOption.setAttribute('value', `${key}`);
    currencyOneOption.textContent = `${key}`;
    parent.append(currencyOneOption);
  }

  function addCurrencies() {
    fetch(`https://v6.exchangerate-api.com/v6/5928de987f1e7064b0ce717e/latest/USD`)
      .then(res => res.json())
      .then(data => {
        const currencyOneOptions = data.conversion_rates;
        for (let key in currencyOneOptions) {

          if (key != 'USD') {
            createNewOption(currencyOne, key);
          }

          if (key != 'AZN') {
            createNewOption(currencyTwo, key);
          }
        }
      })
      .catch(errorMessage);
  }

  addCurrencies();

  function calculate(currencyOneVal, currencyTwoVal, i) {
    fetch(`https://v6.exchangerate-api.com/v6/5928de987f1e7064b0ce717e/latest/${currencyOneVal}`)
      .then(res => res.json())
      .then(data => {
        const rate = data.conversion_rates[currencyTwoVal];
        
        if (i == 1) {
          amountTwo.value = (amountOne.value * rate).toFixed(2);
          rateEl.innerText = `1 ${currencyOneVal} = ${rate.toFixed(4)} ${currencyTwoVal}`;
        } else {
          amountOne.value = (amountTwo.value * rate).toFixed(2);
        }
      })
      .catch(errorMessage);
  }

  function errorMessage() {
    const errorText = document.createElement('div');
    errorText.textContent = "Something went wrong...";
    errorText.classList.add('error');
    calcContainer.append(errorText);
    setTimeout(() => {
        errorText.remove();
    }, 1500);
    console.log('ощибка');
  }

  currencyOne.addEventListener("change", () => {
    calculate(currencyOne.value, currencyTwo.value, 1);
    addFlag(currencyOne, currencyBlockParents[0]);
  });
  currencyTwo.addEventListener("change", () => {
    calculate(currencyOne.value, currencyTwo.value, 1);
    addFlag(currencyTwo, currencyBlockParents[1]);
  });

  amountOne.addEventListener("input", () => calculate(currencyOne.value, currencyTwo.value, 1));
  amountTwo.addEventListener("input", () => calculate(currencyTwo.value, currencyOne.value, 2));

  swap.addEventListener("click", () => {
    const tempCurrency = currencyOne.value,
          tempAmount = amountOne.value;

    currencyOne.value = currencyTwo.value;
    currencyTwo.value = tempCurrency;

    amountOne.value = amountTwo.value;
    amountTwo.value = tempAmount;

    calculate(currencyOne.value, currencyTwo.value, 1);
    addFlag(currencyOne, currencyBlockParents[0]);
    addFlag(currencyTwo, currencyBlockParents[1]);
  });

  calculate(currencyOne.value, currencyTwo.value, 1);

  function addFlag(currency, imgParent) {
    const oldFlags = imgParent.querySelectorAll('img');
    oldFlags.forEach((elem) => {
        elem.remove();
    });

    const flag = document.createElement('img');
    flag.setAttribute('alt', 'flag');

    if (currency.value.slice(0, 1) === 'X') {
      flag.src = `icons/flags/xx.svg`;
    } else {
      flag.src = `icons/flags/${currency.value.toLowerCase()}.svg`;
    }

    currency.after(flag);
  }

  addFlag(currencyOne, currencyBlockParents[0]);
  addFlag(currencyTwo, currencyBlockParents[1]);
});