// ################### ADD EVENT LISTENERS ####################
//Example found on:    https://jsfiddle.net/drewnoakes/eqemx218/
var input = document.querySelector('#myInputBox');
var base32output = document.querySelector('#base32vs');
var truncTimeStamp = document.querySelector('#truncatedOutput');

input.addEventListener('input', function()
{
    //messages.textContent += 'input changed to: ' + input.value + '\n'; //original line
    base32output.textContent = convertToBase(input.value,32);
    $('#truncatedOutput').html('<code>'+'placeholder'+'</code>');
});
// ################### END EVENT LISTENERS ####################

function convertToBase(originalNumber,targetBaseSystem) {
  var convertedNumber = ""; //targetBaseSystem = 32;
  var extraNumeralTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var monthTable = "123456789OND";
  var dayTable = "123456789ABCDEFGHIJKLMNOPQRSTUV"
  //extraNumeralTable = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
  while (originalNumber > 0) {
    /* The javaScript "remainder" method fails due to the shorcomings
    / of floating point numbers. Therefore, a function needs to be created instead.*/
    //loopRemainder= originalNumber % targetBaseSystem; // The "%" is the "modulus" operator (returns the remainder of dividing first num by second num)
    returnedModulo = modulo(originalNumber,targetBaseSystem); // call to custom modulo function
    // modulo from loop: "+ loopRemainder);
    //rightDigit = returnedModulo;
    if (returnedModulo> 9) {
      rightDigit = extraNumeralTable[returnedModulo - 10];
    }else{rightDigit = returnedModulo;};
    console.log("rightDigit: " + rightDigit);
    console.log("originalNumber before flooring: " + longDivision(originalNumber,targetBaseSystem));
    //originalNumber = Math.floor(originalNumber / targetBaseSystem); //this is still introducing error.
    originalNumber = BigInt((longDivision(originalNumber,targetBaseSystem)).match(/\d{1,}/g)[0]); /*extract the substring left of the decimal
    See 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match'
    */
    console.log("originalNumber: " + BigInt(originalNumber)); // BigInt trims the leading zeroes, but isn't necessary for this to work
    //convertedNumber = String(rightDigit) + convertedNumber;
    convertedNumber = String(rightDigit).concat(convertedNumber); //
  }
  return convertedNumber;
};

// https://stackoverflow.com/questions/929910/modulo-in-javascript-large-number/929931#929931
// post by "PH.Wiget" (https://stackoverflow.com/users/4978035/ph-wiget)
// This seems to work. However, you need to pass the numbers as strings.
function modulo(divident, divisor){ // when passing, make sure the divident is either already a string or is a BigInt.
  divident = typeof(divident) != 'string' ? String(divident) : divident; //per MDN: "String() converts anything to a string, safer than toString()"
  divisor = typeof(divisor) != 'string' ? String(divisor) : divisor;
  //return Array.from(divident).map(c => parseInt(c)).reduce((remainder, value) => (remainder * 10 + value) % divisor,0); // original (working) vs.
  /* To break the previous function down with an explanation:
      • The Array.from() static method creates a new, shallow-copied Array instance from an array-like or iterable object.
      • The map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
        • See "https://developer.mozilla.org/en-us/docs/Web/JavaScript/Reference/Global_Objects/Array/map"
      • The parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems).
        • See "https://developer.mozilla.org/en-us/docs/Web/JavaScript/Reference/Global_Objects/parseInt"
        • The radix must be an integer between 2 and 36. It does not default to 10 (the radix for the decimal numbers).
        • To convert a number to its string literal in a particular radix, use thatNumber.toString(radix).
          • This means you could convert a decimal (stored in a variable) to base32 by using `myDecimal.toString(32)`
          • Warning: parseInt converts a BigInt to a Number and loses precision in the process.
      • The Array.prototype.reduce() method executes a reducer function (that you provide) on each element of the array, resulting in single output value.
        • See "https://developer.mozilla.org/en-us/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce"
        • To understand this better, consider the following two uses of reduce:
          1.)
  */
  var shallowCopyArray = Array.from(divident); //creates a new, shallow-copied Array instance from an array-like or iterable object.
  /*Next, use the Array.prototype.map() method to iterate through the shallow copy array and perform a function on each value.
    The var "eachIndex" is the contents at each index in the shallowCopyArray.
    The contents at each index is parsed into an int.*/
  var anArrayOfInts = shallowCopyArray.map(eachIndex => parseInt(eachIndex,10)); // The "10" is just to make sure it parses to base 10
  console.log(anArrayOfInts.toString()); // equivalent value to divident/divisor rounded down to an int.
  //The var "remainder" gets used as the accumulator in the reduce method below
  var myAccumulator = anArrayOfInts.reduce((remainder, value) => (remainder * 10 + value) % divisor,0); // Mod is calculated on no more than two digits at a time this way
  console.log("Accumulator Value: " + myAccumulator);
  return  myAccumulator;
};

function realDivision(){};

// https://bocoup.com/blog/long-division-in-javascript
function longDivision(n,d){
    var num = n + "",
        numLength = num.length,
        remainder = 0,
        answer = '',
        i = 0;

    while( i < numLength + 3){
        var digit = i < numLength ? parseInt(num[i]) : 0;

        if (i == numLength){
            answer = answer + ".";
        }

        answer = answer + Math.floor((digit + (remainder * 10))/d);
        remainder = (digit + (remainder * 10))%d;
        i++;
    }
    return answer;
};
