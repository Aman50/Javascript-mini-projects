'use strict';

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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



const displayMovements = function(account, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort ? account.movements.slice().sort((a, b) => a- b): account.movements;

  movements.forEach((movement, index) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const element = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index} ${type}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${movement}€</div>
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

  labelBalance.textContent = `${account.balance}€`;
};

const displaySummary = function(account) {
  const income = account.movements.filter((movement, index, array) => {
    return movement > 0;
  }).reduce((sum, movement, index, array) => {
    return sum + movement;
  }, 0);

  labelSumIn.textContent = `${income}€`;

  const out = Math.abs(account.movements.filter((movement, index, array) => {
    return movement < 0
  }).reduce((sum, movement, index, array) => {
    return sum + movement;
  }, 0));

  labelSumOut.textContent = `${out}€`;

  const interest = account.movements.filter((movement, index, array) => {
    return movement > 0;
  }).map((deposit, index, array) => {
    return (deposit * account.interestRate) / 100;
  }).filter((interest, index, array) => {
    return interest >= 1;
  }).reduce((sum, interest, index, array) => {
    return sum + interest;
  }, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function(currentAccount) {
  displayMovements(currentAccount, sortFlag);
  displayBalance(currentAccount);
  displaySummary(currentAccount);
}

const login = function() {
  currentAccount = accounts.find((account, index, array) => {
    return account.username === inputLoginUsername.value.toLowerCase();
  });


  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100;

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
  console.log(e);
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

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(movement => movement >= amount * 0.1)) {
    currentAccount.movements.push(amount);

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
