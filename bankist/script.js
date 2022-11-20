'use strict';

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2022-11-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

let timerInterval;

const transformDate = function(date, locale) {
  const givenDate = new Date(date);
  const diffMilliSeconds = new Date() - givenDate;
  const diffDays = Math.round(diffMilliSeconds / (1000 * 60 * 60 * 24));


  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;

  return new Intl.DateTimeFormat(locale).format(givenDate);
};

const transformNumberAsCurrency = function(number, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  }).format(number);
};



const displayMovements = function(account, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort ? account.movements.slice().sort((a, b) => a- b): account.movements;

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const movementDate = transformDate(account.movementsDates[index], account.locale);
    const movementValue = transformNumberAsCurrency(movement, account.locale, account.currency);

    const element = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index} ${type}</div>
      <div class="movements__date">${movementDate}</div>
      <div class="movements__value">${movementValue}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', element);
  });
};

const addUserName = function(accounts) {
  accounts.forEach((account, index, array) => {
    account.username = account.owner
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('')
  });
};

const displayBalance = function(account) {
  account.balance = account.movements.reduce((acc, value, index, arr) => {
    return acc + value;
  }, 0);

  const balance = transformNumberAsCurrency(account.balance, account.locale, account.currency);

  labelBalance.textContent = balance;
};

const displaySummary = function(account) {
  const income = account.movements.filter((movement, index, array) => {
    return movement > 0;
  }).reduce((sum, movement, index, array) => {
    return sum + movement;
  }, 0);

  const incomeCurrency = transformNumberAsCurrency(income, account.locale, account.currency);

  labelSumIn.textContent = incomeCurrency;

  const out = Math.abs(account.movements.filter((movement, index, array) => {
    return movement < 0
  }).reduce((sum, movement, index, array) => {
    return sum + movement;
  }, 0));

  const outCurrency = transformNumberAsCurrency(out, account.locale, account.currency);

  labelSumOut.textContent = outCurrency;

  const interest = account.movements.filter((movement, index, array) => {
    return movement > 0;
  }).map((deposit, index, array) => {
    return (deposit * account.interestRate) / 100;
  }).filter((interest, index, array) => {
    return interest >= 1;
  }).reduce((sum, interest, index, array) => {
    return sum + interest;
  }, 0);

  const interestCurrency = transformNumberAsCurrency(interest, account.locale, account.currency);

  labelSumInterest.textContent = interestCurrency;
};

const updateUI = function(currentAccount) {
  displayMovements(currentAccount, sortFlag);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
};

const startTimer = function() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  let time = 10;

  const tick = function() {

    let mins = String(Math.trunc(time / 60)).padStart(2, 0);
    let seconds = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${mins}:${seconds}`;

    if (time === 0) {
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      clearInterval(timerInterval);
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const login = function() {
  currentAccount = accounts.find((account, index, array) => {
    return account.username === inputLoginUsername.value.toLowerCase();
  });


  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100;

    timerInterval = startTimer();

    const currentDate = new Intl.DateTimeFormat(currentAccount.locale, {
      'day': 'numeric',
      'month': 'numeric',
      'year' :'numeric',
      'hour': 'numeric',
      'minute': 'numeric'
    }).format(new Date());

    labelDate.textContent = currentDate;

    updateUI(currentAccount);

    inputLoginPin.value = '';
    inputLoginUsername.value = '';
  } else {
    containerApp.style.opacity = 0;
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
  }
}

btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  login();
});


btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const transferAmount = +inputTransferAmount.value;

  const receiver = accounts.find((account, index, array) => {
    return account.username === inputTransferTo.value.toLowerCase();
  });

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    transferAmount > 0
    && transferAmount <= currentAccount.balance
    && receiver
    && receiver.username !== currentAccount.username) {
      currentAccount.movements.push(-transferAmount);
      receiver.movements.push(transferAmount);

      currentAccount.movementsDates.push(new Date().toISOString());
      receiver.movementsDates.push(new Date().toISOString());

      timerInterval = startTimer();
      updateUI(currentAccount);
    }
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value.toLowerCase() === currentAccount.username
      && +inputClosePin.value === currentAccount.pin) {
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);

        accounts.splice(index, 1);

        containerApp.style.opacity = 0;
      }

  inputClosePin.value = inputCloseUsername.value = '';
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Math.ceil(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(movement => movement >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    timerInterval = startTimer();
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnSort.addEventListener('click', function(e) {
  sortFlag = !sortFlag;

  displayMovements(currentAccount, sortFlag);
});


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
let currentAccount;
let sortFlag = false;
addUserName(accounts);

