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
    const value = e.target.value;
    setInput((input) => {
      return input === '0' || shouldResetDisplay ? value : input.concat(value);
    });
    setShouldResetDisplay(false);
  };

  const handleOperatorClick = (e) => {
    const operator = e.target.value;
    setInput((currentInput) => {
      return currentInput !== 0 && isNumber(currentInput[currentInput.length - 1])
        ? currentInput.concat(operator)
        : isOperator(currentInput[currentInput.length - 1]) && isOperator(currentInput[currentInput.length - 2])
        ? currentInput.substr(0, currentInput.length - 2).concat(operator)
        : currentInput.substr(0, currentInput.length - 1).concat(operator);
    });
    setShouldResetDisplay(false);
  };

  const handleMinusSign = () => {
    setInput((input) => {
      return input === '0'
        ? '-'
        : isNumber(input[input.length - 1])
        ? input.concat('-')
        : isOperator(input[input.length - 1]) && isNumber(input[input.length - 2])
        ? input.concat('-')
        : input;
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
    const lastNumber = input.split(/\+|-|\*|\//).pop();
    if (lastNumber && lastNumber.indexOf('.') === -1) {
      setInput((input) => {
        return input.concat('.');
      });
      setShouldResetDisplay(false);
    }
  };

  const handleEqualsClick = () => {
    const parser = mathjs.parser();
    setInput((input) => {
      return isNumber(input[input.length - 1])
        ? parser.evaluate(input).toString().substr(0, MAX_DISPLAY_LENGTH)
        : '0';
    });
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
