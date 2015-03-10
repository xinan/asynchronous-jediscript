var balance = 0;
var mutex = false;
var current_user = null;
var jobQueue = [];

onmessage = function(e) {
  var user = e.data.user;
  if (mutex) {
    if (current_user === user) {
      if (e.data.op === 'commit') {
        var action;
        while (action = jobQueue.shift()) {
          dispatch(action);
        }
        mutex = false;
        current_user = null;
        postMessage('Transaction committed.');
      } else if (e.data.op === 'cancel') {
        jobQueue = [];
        mutex = false;
        current_user = null;
        postMessage('Transaction cancelled.');
      } else {
        jobQueue.push(e.data);
      }
    } else {
      postMessage('Sorry, another transaction is ongoing. Please try again later.');
    }
  } else {
    if (e.data.op === 'start_transaction') {
      mutex = true;
      current_user = e.data.user;
      postMessage('Transaction started.');
    } else {
      dispatch(e.data);
    }
  }
}

function dispatch(m) {
  var op = m.op;
  var amount = m.amount;
  switch(op) {
    case 'init':
      init(amount);
      break;
    case 'withdraw':
      withdraw(amount);
      break;
    case 'deposit':
      deposit(amount);
      break;
    case 'check_balance':
      check_balance();
      break;
    default:
      postMessage('Unsupported action! - ' + op);
      break;
  }
}

function init(amount) {
  balance = amount;
}

function withdraw(amount) {
  if (balance < amount) {
    postMessage('Insufficient fund!');
  } else {
    balance -= amount;
    postMessage('Success! New balance: ' + balance);
  }
}

function deposit(amount) {
    balance += amount;
    postMessage('Success! New balance: ' + balance);
}

function check_balance() {
  postMessage('Current balance: ' + balance);
}
