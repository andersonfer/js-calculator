import {useState} from 'react'
import './App.css';
import * as mathjs from "mathjs";

export const MAX_DISPLAY_LENGTH = 15;

function App() {
  const [input, setInput] = useState('0');
  const [resetExpression, setResetExpression] = useState(false);

  const updateDisplay = (e) => {
    const key = e.target.value;
    if (hasReachedMaximumLength(input)) {
      setInput('MAX');
      setResetExpression(true);
    } else {
      isEqualSign(key)
        ? evaluateExpression()
        : isNegativeSign(key)
        ? updateNegativeSign(key)
        : isOperator(key)
        ? updateOperator(key)
        : isDecimal(key)
        ? updateDecimal(key)
        : updateNumber(key);
    }
  };

  const hasReachedMaximumLength = (input) => {
    return input.length >= MAX_DISPLAY_LENGTH;
  };

  const isEqualSign = (key) => {
    return '=' === key;
  };

  const evaluateExpression = () => {
    const parser = mathjs.parser();
    setInput((state) => {
      return isNumber(state[state.length - 1])
        ? parser.evaluate(state).toString().substr(0, MAX_DISPLAY_LENGTH)
        : '0';
    });
    setResetExpression(true);
  };

  const isNegativeSign = (key) => {
    return '-' === key;
  };

  const updateNegativeSign = (key) => {
    setInput((state) => {
      return state === 0
        ? key
        : isNumber(state[state.length - 1])
        ? state.concat(key)
        : isOperator(state[state.length - 1]) && isNumber(state[state.length - 2])
        ? state.concat(key)
        : state;
    });
    setResetExpression(false);
  };

  const isOperator = (key) => {
    return ['+', '*', '-', '/'].includes(key);
  };

  const updateOperator = (key) => {
    setInput((state) => {
      return state != 0 && isNumber(state[state.length - 1])
        ? state.concat(key)
        : isOperator(state[state.length - 1]) && isOperator(state[state.length - 2])
        ? state.substr(0, state.length - 2).concat(key)
        : state.substr(0, state.length - 1).concat(key);
    });
    setResetExpression(false);
  };

  const isDecimal = (key) => {
    return key === '.';
  };

  const updateDecimal = (key) => {
    const lastNumber = input.split(/\+|-|\*|\//).pop();
    if (lastNumber && lastNumber.indexOf(key) === -1) {
      setInput((state) => {
        return state.concat(key);
      });
      setResetExpression(false);
    }
  };

  const isNumber = (key) => {
    return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(key);
  };

  const updateNumber = (key) => {
    setInput((state) => {
      return state === '0' || resetExpression ? key : state.concat(key);
    });
    setResetExpression(false);
  };

  const clearDisplay = () => {
    setInput('0');
  };

  return (
    <div id="calculator">
      <div id="display" data-testid="display">{input}</div>
      <div id="numpad">
        <button id="clear" className="key double-width" onClick={clearDisplay}>
          AC
        </button>
        <button id="divide" value="/" className="key" onClick={updateDisplay}>
          {'/'}
        </button>
        <button id="multiply" value="*" className="key" onClick={updateDisplay}>
          *
        </button>
        <button id="seven" value="7" className="key" onClick={updateDisplay}>
          7
        </button>
        <button id="eight" value="8" className="key" onClick={updateDisplay}>
          8
        </button>
        <button id="nine" value="9" className="key" onClick={updateDisplay}>
          9
        </button>
        <button id="subtract" value="-" className="key" onClick={updateDisplay}>
          -
        </button>
        <button id="four" value="4"  className="key" onClick={updateDisplay}>
          4
        </button>
        <button id="five" value="5" className="key" onClick={updateDisplay}>
          5
        </button>
        <button id="six" value="6" className="key" onClick={updateDisplay}>
          6
        </button>
        <button id="add" value="+" className="key" onClick={updateDisplay}>
          +
        </button>
        <div id="double-row">
          <div id="first-column">
            <button id="one" value="1" className="key" onClick={updateDisplay}>
              1
            </button>
            <button id="two" value="2" className="key" onClick={updateDisplay}>
              2
            </button>
            <button id="three" value="3" className="key" onClick={updateDisplay}>
              3
            </button>
            <button id="zero" value="0" className="key double-width" onClick={updateDisplay}>
              0
            </button>
            <button id="decimal" value="." className="key" onClick={updateDisplay}>
              .
            </button>
          </div>
          <div id="second-column">
            <button id="equals" value="=" className="key" onClick={updateDisplay}>
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
