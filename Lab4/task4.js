function roundMe(...numbers) {
    if (numbers.length == 0) {
        return 0;
    }
    if (numbers.length == 1) {
        return Math.round(numbers[0]);
    }
    return numbers.map(function(number) {
        return Math.round(number);
    });
}
console.log(roundMe());
console.log(roundMe(4.7));
console.log(roundMe(4.7, 4.4));