import {useState} from 'react'
import './App.css';
import * as mathjs from "mathjs";

export const MAX_DISPLAY_LENGTH = 15;

function App() {
  const [input, setInput] = useState('0');
  const [resetExpression, setResetExpression] = useState(false);

  const updateDisplay = (key) => {
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
      <Display input={input} />
      <NumPad onClick={updateDisplay} onClear={clearDisplay} />
    </div>
  );
}

function Display({input}){
  return (
    <div id="display" data-testid="display">{input}</div>
  );
}

function NumPad({onClick, onClear}){
  function clear(){
    onClear();
  }

  function update(e){
    onClick(e.target.innerHTML);
  }
  return (
    <div id="numpad">
      <button id="clear" className="key double-width" onClick={clear}>
        AC
      </button>
      <button id="divide" className="key" onClick={update}>
        /
      </button>
      <button id="multiply" className="key" onClick={update}>
        *
      </button>
      <button id="seven" className="key" onClick={update}>
        7
      </button>
      <button id="eight" className="key" onClick={update}>
        8
      </button>
      <button id="nine" className="key" onClick={update}>
        9
      </button>
      <button id="subtract" className="key" onClick={update}>
        -
      </button>
      <button id="four" className="key" onClick={update}>
        4
      </button>
      <button id="five" className="key" onClick={update}>
        5
      </button>
      <button id="six" className="key" onClick={update}>
        6
      </button>
      <button id="add" className="key" onClick={update}>
        +
      </button>
      <div id="double-row">
        <div id="first-column">
          <button id="one" className="key" onClick={update}>
            1
          </button>
          <button id="two" className="key" onClick={update}>
            2
          </button>
          <button id="three" className="key" onClick={update}>
            3
          </button>

          <button id="zero" className="key double-width" onClick={update}>
            0
          </button>
          <button id="decimal" className="key" onClick={update}>
            .
          </button>
        </div>
        <div id="second-column">
          <button id="equals" className="key" onClick={update}>
            =
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
