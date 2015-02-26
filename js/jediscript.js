function array_test(x) {
    if (Array.isArray === undefined) {
        return x instanceof Array;
    } else {
        return Array.isArray(x);
    }
}

function pair(x, xs) {
    return [x, xs];
}

function is_pair(x) {
    return array_test(x) && x.length === 2;
}

function head(xs) {
    if (is_pair(xs)) {
        return xs[0];
    } else {
        throw new Error("head(xs) expects a pair as "
            + "argument xs, but encountered "+xs);
    }
}

function tail(xs) {
    if (is_pair(xs)) {
        return xs[1];
    } else {
        throw new Error("tail(xs) expects a pair as "
            + "argument xs, but encountered "+xs);
    }

}

function is_empty_list(xs) {
    if (array_test(xs)) {
        if (xs.length === 0) {
            return true;
        } else if (xs.length === 2) {
            return false;
        } else {
            throw new Error("is_empty_list(xs) expects empty list " +
                "or pair as argument xs, but encountered "+xs);
        }
    } else {
        return false;
    }
}

function is_list(xs) {
    for ( ; ; xs = tail(xs)) {
		if (is_empty_list(xs)) {
			return true;
		} else if (!is_pair(xs)) {
            return false;
        }
    }
}

function list() {
    var the_list = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        the_list = pair(arguments[i], the_list);
    }
    return the_list;
}

function length(xs) {
    for (var i = 0; !is_empty_list(xs); ++i) {
		xs = tail(xs);
    }
    return i;
}

function map(f, xs) {
    return (is_empty_list(xs))
        ? []
        : pair(f(head(xs)), map(f, tail(xs)));
}

function build_list(n, fun) {
    function build(i, fun, already_built) {
        if (i < 0) {
            return already_built;
        } else {
            return build(i - 1, fun, pair(fun(i),
                        already_built));
        }
    }
    return build(n - 1, fun, []);
}

function for_each(fun, xs) {
    if (!is_list(xs)) {
        throw new Error("for_each expects a list as argument xs, but " +
            "encountered " + xs);
    }
    for ( ; !is_empty_list(xs); xs = tail(xs)) {
        fun(head(xs));
    }
    return true;
}

function list_to_string(l) {
    if (array_test(l) && l.length === 0) {
        return "[]";
    } else {
        if (!is_pair(l)){
            return l.toString();
        }else{
            return "["+list_to_string(head(l))+","+list_to_string(tail(l))+"]";
        }
    }
}

function reverse(xs) {
    if (!is_list(xs)) {
        throw new Error("reverse(xs) expects a list as argument xs, but " +
            "encountered " + xs);
    }
    var result = [];
    for ( ; !is_empty_list(xs); xs = tail(xs)) {
        result = pair(head(xs), result);
    }
    return result;
}

function append(xs, ys) {
    if (is_empty_list(xs)) {
        return ys;
    } else {
        return pair(head(xs), append(tail(xs), ys));
    }
}

function member(v, xs){
    for ( ; !is_empty_list(xs); xs = tail(xs)) {
        if (head(xs) === v) {
            return xs;
        }
    }
    return [];
}

function remove(v, xs){
    if (is_empty_list(xs)) {
        return [];
    } else {
        if (v === head(xs)) {
            return tail(xs);
        } else {
            return pair(head(xs), remove(v, tail(xs)));
        }
    }
}

function remove_all(v, xs) {
    if (is_empty_list(xs)) {
        return [];
    } else {
        if (v === head(xs)) {
            return remove_all(v, tail(xs));
        } else {
            return pair(head(xs), remove_all(v, tail(xs)))
        }
    }
}

function equal(item1, item2){
    if (is_pair(item1) && is_pair(item2)) {
        return equal(head(item1), head(item2)) &&
            equal(tail(item1), tail(item2));
    } else if (array_test(item1) && item1.length === 0 &&
           array_test(item2) && item2.length === 0) {
        return true;
    } else {
        return item1 === item2;
    }
}

function filter(pred, xs){
    if (is_empty_list(xs)) {
        return xs;
    } else {
        if (pred(head(xs))) {
            return pair(head(xs), filter(pred, tail(xs)));
        } else {
            return filter(pred, tail(xs));
        }
    }
}

function enum_list(start, end) {
    if (start > end) {
        return [];
    } else {
        return pair(start, enum_list(start + 1, end));
    }
}

function list_ref(xs, n) {
    if (n < 0) {
        throw new Error("list_ref(xs, n) expects a positive integer as " +
            "argument n, but encountered " + n);
    }

    for ( ; n > 0; --n) {
        xs = tail(xs);
    }
    return head(xs);
}

function accumulate(op,initial,sequence) {
    if (is_empty_list(sequence)) {
        return initial;
    } else {
        return op(head(sequence),
                  accumulate(op,initial,tail(sequence)));
    }
}

function set_head(xs,x) {
    if (is_pair(xs)) {
        xs[0] = x;
        return undefined;
    } else {
        throw new Error("set_head(xs,x) expects a pair as "
            + "argument xs, but encountered "+xs);
    }
}

function set_tail(xs,x) {
    if (is_pair(xs)) {
        xs[1] = x;
        return undefined;
    } else {
        throw new Error("set_tail(xs,x) expects a pair as "
            + "argument xs, but encountered "+xs);
    }
}

function is_null(xs) {
	return xs === null;
}

function is_number(xs) {
	return typeof xs === "number";
}

function is_string(xs) {
	return typeof xs === "string";
}

function is_boolean(xs) {
	return typeof xs === "boolean";
}

function is_function(xs) {
	return typeof xs === "function";
}

function is_NaN(x) {
	return is_number(x) && isNaN(x);
}

function is_array(a){
	return a instanceof Array;
}

function runtime() {
	var d = new Date();
	return d.getTime();
}

function error(message, line) {
	throw new SyntaxError(message, null,
		line === undefined ? undefined : line + 1);
}

function newline(){
	display("\n");
}

function display(str){
	var to_show = str;
	if (is_array(str) && is_empty_list(str)) {
		to_show = '[]';
	} else if (is_pair(str)) {
		to_show = '';
		var stringize = function(item) {
			if (is_empty_list(item)) {
				return '[]';
			} else if (is_pair(item)) {
				return '[' + stringize(head(item)) + ', ' + stringize(tail(item)) + ']';
			} else {
				return item.toString();
			}
		}

		to_show = stringize(str);
	}
	console.log(to_show);
	return str;
}

function random(k){
	return Math.floor(Math.random()*k);
}

function timed(f) {
	var self = this;
	var timerType = window.performance ? performance : Date;
	return function() {
		var start = timerType.now();
		var result = f.apply(self, arguments);
		var diff = (timerType.now() - start);
		console.log('Duration: ' + Math.round(diff) + 'ms');
		return result;
	};
}

function stream_tail(xs) {
    if (is_pair(xs)) {
        var tail = xs[1];
	if (typeof tail === "function") {
	    return tail();
	} else
            throw new Error("stream_tail(xs) expects a function as "
			    + "the tail of the argument pair xs, "
			    + "but encountered "+tail);
    } else {
        throw new Error("stream_tail(xs) expects a pair as "
			+ "argument xs, but encountered "+xs);
    }

}

function is_stream(xs) {
    return (array_test(xs) && xs.length === 0)
	|| (is_pair(xs) && typeof tail(xs) === "function" &&
            is_stream(stream_tail(xs)));
}

function list_to_stream(xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	return pair(head(xs),function() { return list_to_stream(tail(xs)); });
    }
}

function stream_to_list(xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	return pair(head(xs), stream_to_list(stream_tail(xs)));
    }
}

function stream() {
    var the_list = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        the_list = pair(arguments[i], the_list);
    }
    return list_to_stream(the_list);
}

function stream_length(xs) {
    if (is_empty_list(xs)) {
	return 0;
    } else {
	return 1 + stream_length(stream_tail(xs));
    }
}

function stream_map(f, s) {
    if (is_empty_list(s)) {
	return [];
    } else {
	return pair(f(head(s)),
                    function() {
			return stream_map(f, stream_tail(s));
                    });
    }
}

function build_stream(n, fun){
    function build(i) {
	if (i >= n) {
	    return [];
	} else {
	    return pair(fun(i),function() { return build(i + 1); });
	}
    }
    return build(0);
}

function stream_for_each(fun,xs) {
    if (is_empty_list(xs)) {
	return true;
    } else {
        fun(head(xs));
	return stream_for_each(fun,stream_tail(xs));
    }
}

function stream_reverse(xs) {
    function rev(original, reversed) {
	if (is_empty_list(original)) {
	    return reversed;
	} else {
	    return rev(stream_tail(original),
		       pair(head(original), function() {return reversed;}));
	}
    }
    return rev(xs,[]);
}

function stream_to_vector(lst){
    var vector = [];
    while(!is_empty_list(lst)){
        vector.push(head(lst));
        lst = stream_tail(lst);
    }
    return vector;
}

function stream_append(xs, ys) {
    if (is_empty_list(xs)) {
	return ys;
    } else {
	return pair(head(xs),
		    function() { return stream_append(stream_tail(xs), ys); });
    }
}

function stream_member(x, s) {
    if (is_empty_list(s)) {
        return [];
    } else if (head(s) === x) {
        return s;
    } else {
        return stream_member(x, stream_tail(s));
    }
}

function stream_remove(v, xs){
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return stream_tail(xs);
	} else {
	    return pair(head(xs),
			function() { return stream_remove(v, stream_tail(xs)); });
	}
    }
}

function stream_remove_all(v, xs) {
    if (is_empty_list(xs)) {
	return [];
    } else {
	if (v === head(xs)) {
	    return stream_remove_all(v, stream_tail(xs));
	} else {
	    return pair(head(xs),
			function() { return stream_remove_all(v, stream_tail(xs)); });
	}
    }
}

function stream_filter(p, s) {
    if (is_empty_list(s)) {
	return [];
    } else if (p(head(s))) {
	return pair(head(s),
                    function() {
			return stream_filter(p,
					     stream_tail(s));
                    });
    } else {
	return stream_filter(p,
                             stream_tail(s));
    }
}

function enum_stream(start, end) {
    if (start > end) {
	return [];
    } else {
	return pair(start,
		    function() { return enum_stream(start + 1, end); });
    }
}

function integers_from(n) {
    return pair(n,
                function() {
                    return integers_from(n + 1);
                });
}

function eval_stream(s, n) {
    if (n === 0) {
        return [];
    } else {
        return pair(head(s),
                    eval_stream(stream_tail(s),
                                n - 1));
   }
}

function stream_ref(s, n) {
    if (n === 0) {
	return head(s);
    } else {
	return stream_ref(stream_tail(s), n - 1);
    }
}
