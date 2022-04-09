'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-04-07T06:31:17.178Z',
    '2022-04-08T07:42:02.383Z',
    '2022-04-04T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-04-07T06:31:17.178Z',
    '2022-04-08T07:42:02.383Z',
    '2022-04-04T09:15:04.904Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2022-04-07T06:31:17.178Z',
    '2022-04-08T07:42:02.383Z',
    '2022-04-04T09:15:04.904Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2022-04-07T06:31:17.178Z',
    '2022-04-08T07:42:02.383Z',
    '2022-04-04T09:15:04.904Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const formLogin = document.querySelector('.login');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnLogout = document.querySelector('.logout__btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///// GLOBAL ACTIONS

// Create usernames on each object in the account
accounts.forEach(function (account) {
  const user = account.owner.split(' ');
  const [firstName] = user;
  const userName = firstName.toLowerCase();
  account.userName = userName;
});

let activeAccount, uiTimer, appClock;
let sorted = false;

/////EVENT HANDLERS

/////////////////////////////////////////////////////////////////// Login Event
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  //findUser
  const user = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);

  const account = accounts.find(
    account => account.userName === user && account.pin === pin
  );

  if (account !== undefined) {
    //set active account on global scope
    activeAccount = account;
    //display the user interface
    displayUI(account);
  } else {
    alert(
      `Sorry, that username and pin combination cannot be found.\nPlease try again.`
    );
  }

  inputLoginUsername.value = inputLoginPin.value = '';
  //getPinNumber
});
/////////////////////////////////////////////////////////////////// Logout Event
btnLogout.addEventListener('click', resetUI);

//////////////////////////////////////////////////////////////////////// Sort Event

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(activeAccount, !sorted);
  sorted = !sorted;

  //   }
});

//////////////////////////////////////////////////////////////////////// Transfer Money Event
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferTo = inputTransferTo.value;
  const transferAmount = Number(inputTransferAmount.value);

  const transferAccount = accounts.find(
    account => transferTo === account.userName
  );
  if (
    transferAccount !== undefined &&
    activeAccount.totalBalance >= transferAmount &&
    activeAccount.userName !== transferTo
  ) {
    activeAccount.movements.push(-transferAmount);
    activeAccount.movementsDates.push(new Date().toISOString());
    transferAccount.movements.push(transferAmount);
    transferAccount.movementsDates.push(new Date().toISOString());
    inputTransferTo.value = inputTransferAmount.value = '';
    displayUI(activeAccount);
  } else if (activeAccount.userName === transferTo) {
    alert(`Sorry, you can not make deposits to yourself. Please try again.`);
    inputTransferTo.value = inputTransferAmount.value = '';
  } else if (activeAccount.totalBalance <= transferAmount) {
    const balance = formatCurrency(
      activeAccount.totalBalance,
      activeAccount.currency,
      activeAccount.locale
    );
    alert(
      `Sorry, your current balance is too low to transfer this amount of funds.\n
      Your current balance is ${balance}, which is the most you'd be allowed to transfer.\n
      Please transfer a smaller amount.`
    );
    inputTransferTo.value = inputTransferAmount.value = '';
  } else {
    alert(
      `Sorry, that account either does not exist or\nyou do not have permissions to transfer to that account`
    );
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

//////////////////////////////////////////////////////////////////////// Request Loan Event
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount >= 500) {
    activeAccount.movements.push(Math.trunc(loanAmount));
    activeAccount.movementsDates.push(new Date().toISOString());
    inputLoanAmount.value = '';
    alert(
      'Your loan has been approved!\nYou can now see it in your account ledgar.'
    );
    displayUI(activeAccount);
  } else {
    alert('Only loan requests of 500 or more are accepted! Try again');
    inputLoanAmount.value = '';
  }
});

//////////////////////////////////////////////////////////////////////// Close Account Event
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmName = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);
  if (
    confirmName === activeAccount.userName &&
    confirmPin === activeAccount.pin
  ) {
    const index = accounts.findIndex(
      account => account.userName === confirmName
    );
    accounts.splice(index, 1);
    alert(
      `Your account for username ${activeAccount.userName} has been closed!\nYour account will now log out.`
    );
  }
  inputCloseUsername.value = inputClosePin.value = '';
  resetUI();
});

//// FUNCTIONS

//////////////////////////////////////////////////////////////// Helper Functions
const formatCurrency = function (value, currency, locale) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'narrowSymbol',
  }).format(value);
};

const getDaysPassed = function (movementDate, locale) {
  const today = new Date();
  const millisecondsPassed = today - new Date(movementDate);
  const daysPassed = Math.trunc(millisecondsPassed / 1000 / 60 / 60 / 24);
  if (daysPassed === 0) {
    return `Today`;
  }
  if (daysPassed === 1) {
    return `Yesterday`;
  }
  if (daysPassed <= 7) {
    return `${daysPassed} days ago`;
  }
  if (daysPassed > 7) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'short',
    }).format(new Date(movementDate));
  }
};

function resetUI() {
  if (uiTimer) {
    clearInterval(uiTimer);
  }
  if (appClock) {
    clearInterval(appClock);
  }
  //display login button
  formLogin.style.visibility = 'visible';
  btnLogout.style.visibility = 'hidden';
  containerApp.style.opacity = 0;
  labelWelcome.textContent = `Log in to get started`;
}

//////////////////////////////////////////////////////////// Operational Functions
const displayUI = function (account) {
  //display logout button
  formLogin.style.visibility = 'hidden';
  btnLogout.style.visibility = 'visible';
  if (appClock) {
    clearInterval(appClock);
  }

  //show app container
  containerApp.style.opacity = 100;
  //display welcome label with owner's first name
  labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}!`;
  //display the current date and time
  appClock = setInterval(function () {
    const dateTime = new Intl.DateTimeFormat(account.locale, {
      dateStyle: 'short',
      timeStyle: 'medium',
    }).format(new Date());
    labelDate.textContent = dateTime;
  }, 1000);

  //display account movements (deposits and withdrawals)
  displayBalance(account);
  //display summaries (total in, out, and interest)
  displayMovements(account);
  //display total balance
  displaySummaries(account);
  //start logoutTime
  startTimer();
};
////////////////////////////////////////////////////////////////////// Display Balance
const displayBalance = function (account) {
  const totalBalance = account.movements.reduce((prev, curr) => prev + curr, 0);
  const formattedBalance = formatCurrency(
    totalBalance,
    account.currency,
    account.locale
  );
  activeAccount.totalBalance = totalBalance;
  labelBalance.textContent = formattedBalance;
};
////////////////////////////////////////////////////////////////////// Display Movements

const displayMovements = function (account, sorted = false) {
  containerMovements.innerHTML = '';

  const movements = sorted
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movements.forEach(function (movement, i) {
    const type = movement > 0 ? `deposit` : `withdrawal`;
    const formattedMovement = formatCurrency(
      movement,
      account.currency,
      account.locale
    );

    const daysPassed = getDaysPassed(account.movementsDates[i], account.locale);

    containerMovements.insertAdjacentHTML(
      'afterbegin',
      `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${type}</div>
          <div class="movements__date">${daysPassed}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>`
    );
  });
};

////////////////////////////////////////////////////////////////////// Display Account Summary

const displaySummaries = function (account) {
  //total deposits
  const totalSumIn = account.movements.reduce(function (prev, curr) {
    if (curr > 0) {
      prev += curr;
    }
    return prev;
  }, 0);
  const formattedSumIn = formatCurrency(
    totalSumIn,
    account.currency,
    account.locale
  );
  labelSumIn.textContent = formattedSumIn;
  //total withdrawals
  const totalSumOut = account.movements.reduce(function (prev, curr) {
    if (curr < 0) {
      prev += curr;
    }
    return prev;
  }, 0);
  const formattedSumOut = formatCurrency(
    totalSumOut,
    account.currency,
    account.locale
  );
  labelSumOut.textContent = formattedSumOut;
  //total interest
  const totalSumInterest = (totalSumIn * account.interestRate) / 100;
  const formattedSumInterest = formatCurrency(
    totalSumInterest,
    account.currency,
    account.locale
  );
  labelSumInterest.textContent = formattedSumInterest;
};

////////////////////////////////////////////////////////////////////// Loggout Timer

const startTimer = function () {
  clearInterval(uiTimer);
  let timer = 300;
  uiTimer = setInterval(function () {
    timer = timer - 1;
    if (timer === 0) {
      clearInterval(uiTimer);
      resetUI();
    }

    const minutes = `${Math.trunc(timer / 60)}`.padStart(2, '0');
    const seconds = `${Math.trunc(timer % 60)}`.padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;
  }, 1000);
};
