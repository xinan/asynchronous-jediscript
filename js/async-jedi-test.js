parallel_counter(10);

var list1 = list(1, 2);
var list2 = list(3, 4);
var list3 = list(5, 6);

var lsts = list(list1, list2, list3);

parallel_adder(lsts, display);

function square(x) {
  return x * x;
}

function cube(x) {
  return x * x * x;
}

parallel_execute(square, 3, display);
parallel_execute(cube, 4, display);
