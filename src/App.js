import React from 'react'
import logo from './logo.svg';
import './App.css';
import * as mathjs from "mathjs";

const MAX_DISPLAY_LENGTH = 15;
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
    if (!this.hasReachedMaximumLength(this.state.input)){
      return this.isEqualSign(key)?
             this.evaluateExpression():
             this.isNegativeSign(key)?
             this.updateNegativeSign(key):
             this.isOperator(key)?
             this.updateOperator(key):
             this.isDecimal(key)?
             this.updateDecimal(key):
             this.updateNumber(key);
    } else {
      this.setState({
        input:'MAX',
        resetExpression:true
      }
      );
    }
  };

  hasReachedMaximumLength = (input) => {
    return input.length >= MAX_DISPLAY_LENGTH;
  }

  isEqualSign = (key) => {return '=' == key};

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

  isNegativeSign = (key) => {return '-' == key};

  updateNegativeSign(key){
    this.setState((state) => ({
      input:
        state.input == 0?
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
    const lastNumber = this.state.input.split(/\+|\-|\*|\//).pop();
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
        state.input == '0' || state.resetExpression ? key:
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

class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="display">{this.props.input}</div>
    );
  }
}

class NumPad extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="numpad">
        <div id="clear" className="key double-width" onClick={this.clear}>
          AC
        </div>
        <div id="divide" className="key" onClick={this.update}>
          /
        </div>
        <div id="multiply" className="key" onClick={this.update}>
          *
        </div>
        <div id="seven" className="key" onClick={this.update}>
          7
        </div>
        <div id="eight" className="key" onClick={this.update}>
          8
        </div>
        <div id="nine" className="key" onClick={this.update}>
          9
        </div>
        <div id="subtract" className="key" onClick={this.update}>
          -
        </div>
        <div id="four" className="key" onClick={this.update}>
          4
        </div>
        <div id="five" className="key" onClick={this.update}>
          5
        </div>
        <div id="six" className="key" onClick={this.update}>
          6
        </div>
        <div id="add" className="key" onClick={this.update}>
          +
        </div>
        <div id="double-row">
          <div id="first-column">
            <div id="one" className="key" onClick={this.update}>
              1
            </div>
            <div id="two" className="key" onClick={this.update}>
              2
            </div>
            <div id="three" className="key" onClick={this.update}>
              3
            </div>

            <div id="zero" className="key double-width" onClick={this.update}>
              0
            </div>
            <div id="decimal" className="key" onClick={this.update}>
              .
            </div>
          </div>
          <div id="second-column">
            <div id="equals" className="key" onClick={this.update}>
              =
            </div>
          </div>
        </div>
      </div>
    );
  }

  clear = (e) => {
    this.props.onClear();
  }

  update = (e) => {
    this.props.onClick(e.target.innerHTML);
  }
}

export default App;
