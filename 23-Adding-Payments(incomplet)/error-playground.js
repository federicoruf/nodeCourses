const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }
  throw new Error('Invalid arguments');
};

try {
  console.log(sum(1));
} catch (error) {
  console.log('Error occurred!');
  //this code prints the stack of the error
  console.log(error);
}

//thanks to the try catch, I can continue exceciting this other line
//in other case the code will finish
console.log('It still works');
