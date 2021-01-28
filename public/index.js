"use strict"; // See "Why Strict Mode?" at https://www.w3schools.com/js/js_strict.asp
// ################### ADD EVENT LISTENERS ####################
//Example found on:    https://jsfiddle.net/drewnoakes/eqemx218/
var input = document.querySelector('#myInputBox');
var base32output = document.querySelector('#base32vs');
//var truncTimeStamp = document.querySelector('#truncatedOutput');

input.addEventListener('input', function()
{
    //messages.textContent += 'input changed to: ' + input.value + '\n'; //original line
    var convertedToBase = convertToBase(input.value,32);
    var shortenedTimeStmp = shortenTimestamp(input.value);
    //var timeStmpToPilotSpk = toPilotSpk(convertedToBase);
    base32output.textContent = convertedToBase;
    $('#truncatedOutput').html('<code>'+shortenedTimeStmp+'</code>');
    $('#pilotSpeak1').html('<pre>'+ toPilotSpk(convertedToBase) + '</pre>');
    $('#pilotSpeak2').html('<pre>'+ toPilotSpk(shortenedTimeStmp) + '</pre>');

});
// ################### END EVENT LISTENERS ####################


function convertToBase(originalNumber,targetBaseSystem) {
  var convertedNumber = ""; //targetBaseSystem = 32;
  var extraNumeralTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var monthTable = "123456789OND";
  var dayTable = "123456789ABCDEFGHIJKLMNOPQRSTUV";
  //extraNumeralTable = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
  while (originalNumber > 0) {
    /* The javaScript "remainder" method fails due to the shorcomings
    / of floating point numbers. Therefore, a function needs to be created instead.*/
    //loopRemainder= originalNumber % targetBaseSystem; // The "%" is the "modulus" operator (returns the remainder of dividing first num by second num)
    var returnedModulo = modulo(originalNumber,targetBaseSystem); // call to custom modulo function
    // modulo from loop: "+ loopRemainder);
    //rightDigit = returnedModulo;
    if (returnedModulo> 9) {
      var rightDigit = extraNumeralTable[returnedModulo - 10];
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

/* https://stackoverflow.com/questions/929910/modulo-in-javascript-large-number/929931#929931
   post by "PH.Wiget" (https://stackoverflow.com/users/4978035/ph-wiget)
   This seems to work. However, you need to pass the numbers as strings. */
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

function shortenTimestamp(rawNmbr){

  /* See "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice"
     The slice() method RETURNS a shallow copy of A PORTION OF AN ARRAY into a new array object SELECTED FROM START TO END
     (end not included) where start and end represent the index of items in that array. The original array will not be modified.
     • arr.slice(fromIndex,toIndex) // returns what falls between these indices (includes 1st index, excludes 2nd index). If both are negative, it extracts from the end instead of the beginning.
     • arr.slice(i)
       • If positive, this removes i elements from the beginning of the index and returns the rest.
       • If negative, this returns i elements from the end and discards the rest.*/
  //var milSec = rawNmbr.slice(rawNmbr.length-3); // returns the last 3 of the array

  var milSec = rawNmbr.slice(-3); //There will never be more than 999 ms, and in base32, this can be represented with only two places. Pad to two if there's only 1.
  milSec = milSec.padStart(3, '0'); // See "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart"

  var theScnds = rawNmbr.slice(-5,-3); // max seconds > 32 & < 100, so conversion doesn't save any space.

  var theMinutes = rawNmbr.slice(-7,-5); // max minutes > 32 & < 100, so conversion doesn't save any space.

  var theHrs = rawNmbr.slice(-9,-7); //max hours < 32 & > 9, so conversion DOES save space. DO NOT PAD.

  var theDays = rawNmbr.slice(-11,-9); // max days per month < 32 & > 9, so conversion DOES save space. DO NOT PAD.

  var theMonth = rawNmbr.slice(-13,-11); // max month < 32 & > 9, so conversion DOES save space. DO NOT PAD.

  // Year is long, so perhaps restrict to 3 digits and just assume the 1st digit will be a "2" for the life the the business?
  var theYear = rawNmbr.slice(-16,-13); //4 digits can be reduced to 3, so only pad 3

  var allTogether = [convertToBase(theYear,32).padStart(2,'0') + convertToBase(theMonth,32) + convertToBase(theDays,32), // year assumed to start with "2"
                     convertToBase(theHrs,32),
                     convertToBase(theMinutes+theScnds,32).padStart(3,'0'),
                     convertToBase(milSec,32)];
  var abbrvAsGroup = [theYear, theMinutes, theScnds, milSec];
  var abbrvSeparately = [theMonth, theDays, theHrs];
  var shortenedTimestamp = [allTogether.join('.')]; //Puts them all together in the right order.

  // console.log(shortenedTimestamp.join('.').split('.'));
  return shortenedTimestamp.join('.'); // joins all the elements of the array together with periods as a separator.
};

// Sourced from: "https://bocoup.com/blog/long-division-in-javascript" (this needs cleaned and modernized)
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

// See "https://jsfiddle.net/Xotic750/H6W7B/"
const pilotSpkChart = {
    a: 'alpha',
    b: 'bravo',
    c: 'charlie',
    d: 'delta',
    e: 'echo',
    f: 'foxtrot',
    g: 'golf',
    h: 'hotel',
    i: 'india',
    j: 'juliet',
    k: 'kilo',
    l: 'lima',
    m: 'mike',
    n: 'november',
    o: 'oscar',
    p: 'papa',
    q: 'quebec',
    r: 'romeo',
    s: 'siera',
    t: 'tango',
    u: 'uniform',
    v: 'victor',
    w: 'wiskey',
    x: 'xray',
    y: 'yankee',
    z: 'zulu',
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
};
function toPilotSpk(text) {
    return text.split('').map(function (character) {
        var lower = character.toLowerCase(),
            word;

        if (pilotSpkChart.hasOwnProperty(lower)) {
            word = pilotSpkChart[lower];
            if (character === lower) {
                return word;
            }
            return word.toUpperCase();
        }
        return character;
    }).join('\n');
};




/*
##############################################################################
######################## QR CODE MONSTER BELOW HERE ##########################
##############################################################################
*/
//https://codepen.io/hchiam/pen/abvdPOe?editors=1010
