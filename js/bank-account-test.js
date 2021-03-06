var shared_account = new Account(100);

shared_account.check_balance('Alice');

shared_account.start_transaction('Alice');
shared_account.withdraw(10, 'Alice');
shared_account.withdraw(10, 'Alice');
shared_account.withdraw(100, 'Bob');
shared_account.withdraw(10, 'Alice');
shared_account.deposit(100, 'Alice');
shared_account.commit_transaction('Alice');
shared_account.start_transaction('Bob');
shared_account.withdraw(1000, 'Bob');
shared_account.cancel_transaction('Bob');
shared_account.start_transaction('Alice');
shared_account.withdraw(100000, 'Alice');
shared_account.commit_transaction('Alice');

shared_account.check_balance('Bob');

