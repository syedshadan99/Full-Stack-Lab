function abs(...numbers) {
    if (numbers.length == 0) {
        return 0;
    }
    if (numbers.length == 1) {
        return Math.abs(numbers[0]);
    }
    return numbers.map(function(number) {
        return Math.abs(number);
    });
}
function ceil(...numbers) {
    if (numbers.length == 0) {
        return 0;
    }
    if (numbers.length == 1) {
        return Math.ceil(numbers[0]);
    }
    return numbers.map(function(number) {
        return Math.ceil(number);
    });
}
function floor(...numbers) {
    if (numbers.length == 0) {
        return 0;
    }
    if (numbers.length == 1) {
        return Math.floor(numbers[0]);
    }
    return numbers.map(function(number) {
        return Math.floor(number);
    });
}
console.log(abs(-5));
console.log(abs(-5, 4, -3));

console.log(ceil(4.2));
console.log(ceil(4.2, 5.7));

console.log(floor(4.8));
console.log(floor(4.8, 5.7));