function parallelCounter(n) {
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

function parallelAdder(lsts) {
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
        display(total);
      }
    });
  }, lsts);
  return true;
}

function parallelExecute(fun1, arg1, fun2, arg2) {
  var worker = function(arg, callback) {
    callback(fun(arg));
  };

  var task1 = new Blob([fun1.toString().replace(/function.*?(?=\()/, 'function fun')], {type: 'application/javascript'});
  var task2 = new Blob([fun2.toString().replace(/function.*?(?=\()/, 'function fun')], {type: 'application/javascript'});
  var url1 = window.URL.createObjectURL(task1);
  var url2 = window.URL.createObjectURL(task2);

  var pool = new ThreadPool();
  var importScripts1 = [window.location.origin + '/js/jediscript.js', url1];
  var importScripts2 = [window.location.origin + '/js/jediscript.js', url2];

  pool.run(importScripts1, worker, arg1).done(display);
  pool.run(importScripts2, worker, arg2).done(display);
  return true;
}
