const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
    for (let currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currcode;
        newOption.value = currcode;

        if (select.name === "from" && currcode === "USD") {
            newOption.selected = true;
        } 
        else if (select.name === "to" && currcode === "INR") {
            newOption.selected = true;
        }

        select.appendChild(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

const updateFlag = (element) => {
    let currcode = element.value;
    let countrycode = countryList[currcode];

    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countrycode}/flat/64.png`;
};

const updateExchangeRate = async () => {
    let amountInput = document.querySelector(".amount input");
    let amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        amount = 1;
        amountInput.value = "1";
    }

    const apiURL = `https://api.frankfurter.app/latest?from=${fromCurr.value}&to=${toCurr.value}`;

    try {
        let response = await fetch(apiURL);
        let data = await response.json();

        let rate = data.rates[toCurr.value];

        if (!rate) {
            msg.innerText = "Exchange rate not available.";
            return;
        }

        let finalAmount = amount * rate;

        msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } 
    catch (error) {
        msg.innerText = "Error fetching exchange rate.";
        console.error("API Error:", error);
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});