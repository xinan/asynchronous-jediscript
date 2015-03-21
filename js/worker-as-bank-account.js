var Account = function(balance) {
  this.account = new Worker("js/bank-account-worker.js");
  this.account.postMessage({
    op: "__init",
    amount: balance
  });

  this.account.onmessage = function(e) {
    console.log(e.data);
  }
};

Account.prototype.withdraw = function(amt, usr) {
  this.account.postMessage({
    op: "withdraw",
    amount: amt,
    user: usr
  });
};

Account.prototype.deposit = function(amt, usr) {
  this.account.postMessage({
    op: "deposit",
    amount: amt,
    user: usr
  });
};

Account.prototype.check_balance = function(usr) {
  this.account.postMessage({
    op: "check_balance",
    user: usr
  });
};

Account.prototype.start_transaction = function(usr) {
  this.account.postMessage({
    op: "start_transaction",
    user: usr
  });
};

Account.prototype.commit_transaction = function(usr) {
  this.account.postMessage({
    op: "commit",
    user: usr
  });
};

Account.prototype.cancel_transaction = function(usr) {
  this.account.postMessage({
    op: "cancel",
    user: usr
  });
};
