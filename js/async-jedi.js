function parallel_counter(n) {
  var counterWorker = function(x, callback) {
    callback(x);
  };

  var pool = new ThreadPool();

  for (var i = 1; i <= n; i++) {
    pool.run(counterWorker, i).done(function(x) {
      display(x);
    });
  }
}

function parallel_adder(lsts, callback) {
  var adderWorker = function(lst, callback) {
    var sum = accumulate(function(x, y) {
      return x + y;
    }, 0, lst);
    callback(sum);
  };

  var pool = new ThreadPool();
  var importScripts = [window.location.origin + '/js/jediscript.js'];

  var total = 0;
  var numOfWorkersDone = 0;

  for_each(function(lst) {
    pool.run(importScripts, adderWorker, lst).done(function(x) {
      total += x;
      numOfWorkersDone++;
      if (numOfWorkersDone === length(lsts)) {
        callback(total);
      }
    });
  }, lsts);
  return true;
}

function parallel_execute(fun, arg, callback) {
  var worker = function(arg, callback) {
    callback(fun(arg));
  };

  var task = new Blob([fun.toString().replace(/function.*?(?=\()/, 'function fun')], {type: 'application/javascript'});
  var url = window.URL.createObjectURL(task);

  var pool = new ThreadPool();
  var importScripts = [window.location.origin + '/js/jediscript.js', url];

  pool.run(importScripts, worker, arg).done(callback);
  return true;
}
