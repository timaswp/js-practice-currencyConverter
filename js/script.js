"use strict";

document.addEventListener("DOMContentLoaded", () => {

  const currencyOne = document.querySelector("#currency-one"),
        amountOne = document.querySelector("#amount-one"),
        currencyTwo = document.querySelector("#currency-two"),
        amountTwo = document.querySelector("#amount-two"),
        rateEl = document.querySelector("#rate"),
        swap = document.querySelector("#swap");

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
      });
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
      });
  }

  currencyOne.addEventListener("change", () => calculate(currencyOne.value, currencyTwo.value, 1));
  currencyTwo.addEventListener("change", () => calculate(currencyTwo.value, currencyOne.value, 2));

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
  });

  calculate(currencyOne.value, currencyTwo.value, 1);

});