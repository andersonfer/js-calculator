import {useState, useEffect} from 'react'
import './App.css';
import * as mathjs from "mathjs";

export const MAX_DISPLAY_LENGTH = 15;

function App() {
  const [input, setInput] = useState('0');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  useEffect(() => {
    if (hasReachedMaximumLength(input)) {
      setInput('MAX_LENGTH_REACHED');
      setShouldResetDisplay(true);
    }
  },[input]);

  const hasReachedMaximumLength = (input) => {
    return input.length > MAX_DISPLAY_LENGTH;
  };

  const handleClearClick = () => {
    setInput('0');
  };

  const handleNumberClick = (e) => {
    const clickedNumber = e.target.value;

    setInput((currentInput) => {
      const isFirstInput = currentInput === '0';
      const shouldReplaceInput = isFirstInput || shouldResetDisplay;

      return (
        shouldReplaceInput ?
        clickedNumber :
        currentInput + clickedNumber
      );
    });

    setShouldResetDisplay(false);
  };

  const handleOperatorClick = (e) => {
    const selectedOperator = e.target.value;

    setInput((currentInput) => {
      return (
        endsWithNumber(currentInput)?
        currentInput.concat(selectedOperator):
        endsWithTwoOperators(currentInput)?
        replaceLastTwoOperators(currentInput,selectedOperator):
        replaceLastChar(currentInput,selectedOperator)
      );
    });
    setShouldResetDisplay(false);
  };

  const endsWithNumber = (str) => {
    return str !== 0 && isNumber(str[str.length - 1])
  }

  const endsWithTwoOperators = (str) => {
    return (
      isOperator(str[str.length - 1]) &&
      isOperator(str[str.length - 2])
    );
  }

  const replaceLastTwoOperators = (str, newOperator) => {
    return str.substr(0, str.length - 2).concat(newOperator);
  }

  const replaceLastChar = (str, newOperator) => {
    return str.substr(0, str.length - 1).concat(newOperator);
  }

  const handleMinusSign = () => {
    setInput((currentInput) => {

      // If the current input is 0
      // replace it with a minus sign
      if(currentInput === '0') {
        return '-';
      }

      // If the last character is a number
      // concatenate a minus sign to the input
      if(isNumber(currentInput.slice(-1))) {
        return currentInput.concat('-');
      }

      // If the last character is an operator
      // and the second-to-last is a number,
      // concatenate a minus sign to the input.
      if(isOperator(currentInput.slice(-1)) &&
          isNumber(currentInput.slice(-2,-1))){
        return currentInput.concat('-');
      }

      // Otherwise, return the current input
      return currentInput;
    });

    setShouldResetDisplay(false);
  };

  const isNumber = (value) => {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value);
  };

  const isOperator = (value) => {
    return ['+', '*', '-', '/'].includes(value);
  };

  const handleDecimalClick = () => {
    // The last number is the one that comes after the last operator
    // If there's no operator it works too
    const lastNumberInDisplay = input.split(/\+|-|\*|\//).pop();

    // Check if a decimal point is already present in the last number
    const isDecimalAlreadyPresent =
            lastNumberInDisplay && lastNumberInDisplay.indexOf('.') !== -1;

    // If the last number does not already contain a decimal
    // add one to the input
    if (!isDecimalAlreadyPresent) {
      setInput((currentInput) => {
        return currentInput.concat('.');
      });


      setShouldResetDisplay(false);

    }
  };

  const handleEqualsClick = () => {
    const parser = mathjs.parser();
    const lastChar = input[input.length - 1];
    const isLastCharNumber = isNumber(lastChar);

    if(isLastCharNumber) {
      const result =
              parser.evaluate(input).toString().substr(0, MAX_DISPLAY_LENGTH)
      setInput(result);
    } else {
      setInput('0');
    }

    setShouldResetDisplay(true);
  };

  return (
    <div id="calculator">
      <div id="display" data-testid="display">{input}</div>
      <div id="numpad">
        <button id="clear" className="key double-width" onClick={handleClearClick}>
          AC
        </button>
        <button id="divide" value="/" className="key" onClick={handleOperatorClick}>
          {'/'}
        </button>
        <button id="multiply" value="*" className="key" onClick={handleOperatorClick}>
          *
        </button>
        <button id="seven" value="7" className="key" onClick={handleNumberClick}>
          7
        </button>
        <button id="eight" value="8" className="key" onClick={handleNumberClick}>
          8
        </button>
        <button id="nine" value="9" className="key" onClick={handleNumberClick}>
          9
        </button>
        <button id="subtract" value="-" className="key" onClick={handleMinusSign}>
          -
        </button>
        <button id="four" value="4"  className="key" onClick={handleNumberClick}>
          4
        </button>
        <button id="five" value="5" className="key" onClick={handleNumberClick}>
          5
        </button>
        <button id="six" value="6" className="key" onClick={handleNumberClick}>
          6
        </button>
        <button id="add" value="+" className="key" onClick={handleOperatorClick}>
          +
        </button>
        <div id="double-row">
          <div id="first-column">
            <button id="one" value="1" className="key" onClick={handleNumberClick}>
              1
            </button>
            <button id="two" value="2" className="key" onClick={handleNumberClick}>
              2
            </button>
            <button id="three" value="3" className="key" onClick={handleNumberClick}>
              3
            </button>
            <button id="zero" value="0" className="key double-width" onClick={handleNumberClick}>
              0
            </button>
            <button id="decimal" value="." className="key" onClick={handleDecimalClick}>
              .
            </button>
          </div>
          <div id="second-column">
            <button id="equals" value="=" className="key" onClick={handleEqualsClick}>
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
