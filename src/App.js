import React from 'react'
import './App.css';
import * as mathjs from "mathjs";

export const MAX_DISPLAY_LENGTH = 15;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '0',
      resetExpression:false
    };
  }

  render() {
    return (
      <div id="calculator">
        <Display input={this.state.input}  />
        <NumPad onClick={this.updateDisplay} onClear={this.clearDisplay}/>
      </div>
    );
  }

  updateDisplay = (key) => {
    if (this.hasReachedMaximumLength(this.state.input)){
      this.setState({
        input:'MAX',
        resetExpression:true
      }
      );
    } else {
      return this.isEqualSign(key)?
             this.evaluateExpression():
             this.isNegativeSign(key)?
             this.updateNegativeSign(key):
             this.isOperator(key)?
             this.updateOperator(key):
             this.isDecimal(key)?
             this.updateDecimal(key):
             this.updateNumber(key);
    }
  };

  hasReachedMaximumLength = (input) => {
    return input.length >= MAX_DISPLAY_LENGTH;
  }

  isEqualSign = (key) => {return '=' === key};

  evaluateExpression = () => {
    const parser = mathjs.parser();
    this.setState((state) => ({
      input:
        //if the last character is a number, evaluate the expression.
        //else reset the expression to zero.
        this.isNumber(state.input[state.input.length-1]) ?
        parser.evaluate(state.input).toString().substr(0,MAX_DISPLAY_LENGTH):
        '0',
      resetExpression:true
    }));
  }

  isNegativeSign = (key) => {return '-' === key};

  updateNegativeSign(key){
    this.setState((state) => ({
      input:
        state.input === 0?
        key:
        //if the last element is a number
        this.isNumber(state.input[state.input.length-1]) ?
        state.input.concat(key):
        //if the 2 last elements are an operator and a number
        this.isOperator(state.input[state.input.length-1]) && this.isNumber(state.input[state.input.length-2])?
        state.input.concat(key):
        state.input,
      resetExpression: false
    }));
  }

  isOperator = (key) => {return ['+','*','-','/'].includes(key)};

  updateOperator(key){
    this.setState((state) => ({
      input:
        state.input != 0 && this.isNumber(state.input[state.input.length-1]) ?
        state.input.concat(key):
        //in case of three consecutive operators, the operation that should be performed is the last one
        this.isOperator(state.input[state.input.length-1]) && this.isOperator(state.input[state.input.length-2])?
        state.input.substr(0,state.input.length-2).concat(key):
        state.input.substr(0,state.input.length-1).concat(key),
      resetExpression: false
    }));
  }

  isDecimal = (key) => {return key === '.'};

  updateDecimal(key){
    //get the lastNumber in the expression and check if it already has decimal
    //TODO this expression ignores the negative sign, should fix this
    const lastNumber = this.state.input.split(/\+|-|\*|\//).pop();
    if(lastNumber && lastNumber.indexOf(key) === -1){
      this.setState((state) => ({
      input: state.input.concat(key),
      resetExpression: false
    }));
    }
  }

  isNumber = (key) => {return ['0','1','2','3','4','5','6','7','8','9'].includes(key)};

  updateNumber(key){
    this.setState((state) => ({
      input:
        state.input === '0' || state.resetExpression ? key:
        state.input.concat(key),
      resetExpression:false
    }));
  }

  clearDisplay = () => {
    this.setState({
      input:'0'
    });
  }
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
