import {useState, useEffect} from 'react'
import './App.css';
import * as mathjs from "mathjs";

export const MAX_DISPLAY_LENGTH = 15;

function App() {
  const [input, setInput] = useState('0');
  const [resetExpression, setResetExpression] = useState(false);

  useEffect(() => {
    if (hasReachedMaximumLength(input)) {
      setInput('MAX');
      setResetExpression(true);
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
    setInput((state) => {
      return state === '0' || resetExpression ? value : state.concat(value);
    });
    setResetExpression(false);
  };

  const handleOperatorClick = (e) => {
    const value = e.target.value;
    setInput((state) => {
      return state !== 0 && isNumber(state[state.length - 1])
        ? state.concat(value)
        : isOperator(state[state.length - 1]) && isOperator(state[state.length - 2])
        ? state.substr(0, state.length - 2).concat(value)
        : state.substr(0, state.length - 1).concat(value);
    });
    setResetExpression(false);
  };

  const isNegativeSign = (value) => {
    return '-' === value;
  };

  const handleNegativeSign = () => {
    setInput((state) => {
      return state === '0'
        ? '-'
        : isNumber(state[state.length - 1])
        ? state.concat('-')
        : isOperator(state[state.length - 1]) && isNumber(state[state.length - 2])
        ? state.concat('-')
        : state;
    });
    setResetExpression(false);
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
      setInput((state) => {
        return state.concat('.');
      });
      setResetExpression(false);
    }
  };

  const handleEqualsClick = () => {
    const parser = mathjs.parser();
    setInput((state) => {
      return isNumber(state[state.length - 1])
        ? parser.evaluate(state).toString().substr(0, MAX_DISPLAY_LENGTH)
        : '0';
    });
    setResetExpression(true);
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
        <button id="subtract" value="-" className="key" onClick={handleNegativeSign}>
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
