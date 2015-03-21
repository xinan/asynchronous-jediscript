var balance = 0;
var mutex = false;
var current_user = null;
var jobQueue = [];

onmessage = function(e) {
  var user = e.data.user;
  if (mutex) {
    if (current_user === user) {
      if (e.data.op === 'commit') {
        commit();
      } else if (e.data.op === 'cancel') {
        cancel();
      } else {
        jobQueue.push(e.data);
      }
    } else {
      postMessage('Sorry, another transaction is ongoing. Please try again later.');
    }
  } else {
    if (e.data.op === 'start_transaction') {
      start(e.data.user);
    } else if (e.data.op === 'check_balance' || e.data.op === '__init') {
      dispatch(e.data);
    } else {
      postMessage('Please start a transaction first.');
    }
  }
}

function dispatch(m) {
  var op = m.op;
  var amount = m.amount;
  switch(op) {
    case '__init':
      return __init(amount);
    case 'withdraw':
      return withdraw(amount);
    case 'deposit':
      return deposit(amount);
    case 'check_balance':
      return check_balance();
    default:
      postMessage('Unsupported action! - ' + op);
      return false;
  }
}

function __init(amount) {
  balance = amount;
  postMessage('Account created.');
  return true;
}

function withdraw(amount) {
  if (balance < amount) {
    postMessage('Insufficient fund!');
    return false;
  } else {
    balance -= amount;
    postMessage('Success! New balance: ' + balance);
    return true;
  }
}

function deposit(amount) {
    balance += amount;
    postMessage('Success! New balance: ' + balance);
    return true;
}

function check_balance() {
  postMessage('Current balance: ' + balance);
  return true;
}

function start(usr) {
  mutex = true;
  current_user = usr;
  postMessage('Hello, ' + current_user + '!');
  postMessage('Transaction started. Current balance: ' + balance);
}

function commit() {
  var action;
  var old_balance = balance;
  mutex = false;
  current_user = null;
  while (action = jobQueue.shift()) {
    if (!dispatch(action)) {
      postMessage('Transaction failed. Rolling back...');
      balance = old_balance;
      jobQueue = [];
      postMessage('Successfully rolled back. Current balance: ' + balance);
      return false;
    }
  }
  postMessage('Transaction committed. Current balance: ' + balance);
  return true;
}

function cancel() {
  jobQueue = [];
  mutex = false;
  current_user = null;
  postMessage('Transaction cancelled.');
  return true;
}
