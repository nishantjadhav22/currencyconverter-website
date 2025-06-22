const API_KEY = '991d5b7d27c2873ab5969f28';
const BASE = 'https://v6.exchangerate-api.com/v6';

const amountEl = document.getElementById('amount');
const fromEl = document.getElementById('from');
const toEl = document.getElementById('to');
const swapBtn = document.getElementById('swap');
const convertBtn = document.getElementById('convert');
const resultEl = document.getElementById('result');

let currencies = {};

async function init() {
  try {
    const res = await fetch(`${BASE}/${API_KEY}/codes`);
    const data = await res.json();

    if (data.result !== 'success') {
      throw new Error(data['error-type'] || 'Failed to fetch codes');
    }

    data.supported_codes
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([code, name]) => {
        currencies[code] = name;
        fromEl.add(new Option(`${code} ${name}`, code));
        toEl.add(new Option(`${code} ${name}`, code));
      });

    fromEl.value = 'USD';
    toEl.value = 'INR';
  } catch (err) {
    console.error(err);
    resultEl.textContent = 'Error loading currency list.';
  }
}

async function convert() {
  const amount = parseFloat(amountEl.value);
  if (!amount || amount <= 0) {
    resultEl.textContent = 'Enter a valid amount.';
    return;
  }

  const from = fromEl.value;
  const to = toEl.value;
  const url = `${BASE}/${API_KEY}/pair/${from}/${to}/${amount}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.result === 'success' && data.conversion_result != null) {
      const converted = parseFloat(data.conversion_result).toFixed(2);
      resultEl.textContent = `${amount} ${from} = ${converted} ${to}`;
    } else {
      console.error('Conversion error:', data);
      resultEl.textContent = 'Conversion error.';
    }
  } catch (err) {
    console.error(err);
    resultEl.textContent = 'Network or API error.';
  }
}


function swap() {
  [fromEl.value, toEl.value] = [toEl.value, fromEl.value];
  convert();
}


swapBtn.addEventListener('click', swap);
convertBtn.addEventListener('click', convert);

init().then(convert);
