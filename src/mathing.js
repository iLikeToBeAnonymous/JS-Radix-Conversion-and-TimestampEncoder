

function genId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // function genDateTime(){
  //   var now = new Date()
  //   return now.toISOString();
  // };
  const genDateTime = () => new Date().toISOString();
  
  const StrToInt = (someString) => {
    let objDictionary = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9
    };
  
    someString = String(someString); //Make sure that the passed value is a string!
    let MyInt = 0;
  
    for (let indx = 0; indx < someString.length; indx++) {
      //With JS strings, someString.length = char count
      let MyExponent = someString.length - indx - 1;
      let IntPart = someString[indx];
      IntPart = objDictionary[IntPart];
      MyInt += IntPart * 10 ** MyExponent;
    }
    return MyInt;
  }; // END StrToInt
  
  function divisionRedo(numerator, denominator) {
  
    if (typeof denominator === "string") {
      denominator = parseInt(denominator,10);
    }
  
    const numeratorStr = String(numerator); //It should already be a string, but force-convert to be safe
  
    const numeratorArray = Array.from(numeratorStr);
    
    let numeratorPart = 0;
    let quotient = '';
    let quotientPart = 0; //The quotientPart is the active part of the quotient being "mathed"
    let remainderPart = 0;
  
    numeratorArray.forEach((digit) => {
      // Because the denominator will always be a value <= 64, the numeratorPart can always be safely divided.
      // As such, when pulling numbers off the numeratorArray, you must convert them to an int before performing
      // further operations.
      numeratorPart += digit; //Is of type "String" at this point...
      numeratorPart = parseInt(numeratorPart,10);
  
      //If the partial numerator is greater than the denominator, sector division can take place
      if (numeratorPart > denominator) {
        quotientPart = Math.floor(numeratorPart / denominator); //The number on top of the long division sign
        remainderPart = numeratorPart - (quotientPart * denominator);
        quotient += quotientPart;
        numeratorPart = remainderPart;
      } else { // i.e., if numerator is < denominator...
        quotient += "0";
        // console.log('quotient: ' + quotient);
        remainderPart = numeratorPart; //The modulo of a division operation wherein numerator < denominator is that numerator.
      }
    });
    // console.log(quotient + ", " + remainderPart);
    // returnValues[0] = StrToInt(quotient); //Just to get rid of the leading zeros...
    // returnValues[1] = String(remainderPart);
    let returnValues = [parseInt(quotient,10), String(remainderPart)]
  
    return returnValues;
  }; // END FUNCTION "divisionRedo"
  
  function isNumeric(input) {
    return !isNaN(parseFloat(input)) && isFinite(input);
  }
  
  function convertToBase(originalNumber, targetBaseSystem) {
      let //convertedNumber,
          returnedModulo,
          rightDigit,
          divisionResults;
      let convertedNumber = ""; // Initialize an empty string.
  
      /* ########################################
       *  SETTING OF THE EXTRANUMERAL TABLE 
       * ######################################## */
      let extraNumeralTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      // let testIndex = 0;
      // console.log(`Char at index ${testIndex}: ${extraNumeralTable[testIndex]}`);
      if (isNumeric(targetBaseSystem)) {
          extraNumeralTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      } else if (targetBaseSystem.toLowerCase() == "month") {
          //specialized base12 uses 'O' for October, 'N' for November, 'D' for December.
          extraNumeralTable = "0123456789OND";
          targetBaseSystem = "12";
      } else if (targetBaseSystem.toLowerCase() == "day") {
          //specialized base31 to represent days of the month. Preserves numerals while ommitting common mis-readable letters.
          extraNumeralTable = "0123456789ACDEFGHJKLMNPQRSTUVWXY";
          targetBaseSystem = "31"; //"0123456789ABCDEFGHIJKLMNOPQRSTUV"
      } else if (targetBaseSystem.toLowerCase() == "hour") {
          //specialized base24, removing commonly mis-readable letters
          extraNumeralTable = "0123456789CDHJKLMNPRTWXYZ"; //extraNumeralTable = CharArray("0123456789ABCDEFGHIJKLMNO")
          targetBaseSystem = "24";
      } else alert("!!! INVALID TARGET BASE PASSED TO convertToBase() !!!");
      /* ########################################
       *  END SETTING OF THE EXTRANUMERAL TABLE 
       * ######################################## */
  
      // BEGIN ACTUAL BASE CONVERSION
      //Without this, passing a 0 value doesn't return anything.
      if (originalNumber == "0") {convertedNumber = "0";} else {
          while (StrToInt(originalNumber) > 0) {
              // console.log(`originalNumber is of type: ${typeof originalNumber}`)
              // DO LONG DIVISION AND STORE THE RESULTING OBJECT FOR EACH LOOP
              divisionResults = divisionRedo(originalNumber, targetBaseSystem);
              returnedModulo = divisionResults[1]; 
              console.log(`${originalNumber}/${targetBaseSystem} = ${divisionResults[0]} with remainder of ${returnedModulo}`);
              if (returnedModulo > 9) {
                  rightDigit = extraNumeralTable[StrToInt(returnedModulo)];
                  // rightDigit = extraNumeralTable[1*returnedModulo];
              } else {
                  rightDigit = returnedModulo.toString();
              }
              // console.log('rightDigit:  ' + rightDigit);
              originalNumber = divisionResults[0]; //This is a string
              convertedNumber = rightDigit + convertedNumber;
          }
      }
      return convertedNumber;
  }
  
  function testBaseConversion() {
    let dividend = $("#baseTen").val();
    let divisor = $("#targetRadix").val();
    console.log('Converted Base: ' + convertToBase(dividend, divisor)); 
  }
  
  function testDivisionRedo() {
    console.clear();
    const dividend = $("#numeratorInput").val();
    const divisor = $("#denominatorInput").val();
    let result = divisionRedo(dividend, divisor);
    console.log(`Return type of DevisionRedo() is: ${typeof result}`);
    console.log(`"Object.keys(result)" returns:\n\t${Object.keys(result)}`);
    console.log(`"Object.values(result)" returns:\n\t${Object.values(result)}`);
    $('#quotientOutput').val(result[0]);
    $('#remainderOutput').val(result[1]);
  };
  