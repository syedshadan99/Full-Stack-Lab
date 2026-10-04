let prime = 17;
let next = prime + 1;

while (true) {
  let isPrime = true;
  for (let i = 2; i < next; i++) {
    if (next % i === 0) {
      isPrime = false;
      break;
    }
  }
  if (isPrime) {
    console.log("The prime number after " + prime + " is " + next);
    break;
  }
  next++;
}