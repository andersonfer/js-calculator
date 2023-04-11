import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {MAX_DISPLAY_LENGTH} from './App';


beforeEach(() =>{
  render(<App />);
});

const getRandomNumberButton = () => {
  const randomNumber = Math.floor(Math.random() * 10);
  return screen.getByRole('button',{name: randomNumber.toString()});
}

const getRandomOperatorButton = () => {
  const operators = ['/','*','-','+'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)]
  return screen.getByRole('button',{name: randomOperator});
}

const getDecimalButton = () => {
  return screen.getByRole('button',{name: '.'});
}

it('should render properly', () => {
  expect(screen.getByTestId('display')).toHaveTextContent('0');

  screen.getByRole('button',{name: 'AC'});

  screen.getByRole('button',{name: '0'});
  screen.getByRole('button',{name: '1'});
  screen.getByRole('button',{name: '2'});
  screen.getByRole('button',{name: '3'});
  screen.getByRole('button',{name: '4'});
  screen.getByRole('button',{name: '5'});
  screen.getByRole('button',{name: '6'});
  screen.getByRole('button',{name: '7'});
  screen.getByRole('button',{name: '8'});
  screen.getByRole('button',{name: '9'});

  screen.getByRole('button',{name: '/'});
  screen.getByRole('button',{name: '*'});
  screen.getByRole('button',{name: '-'});
  screen.getByRole('button',{name: '+'});
  screen.getByRole('button',{name: '.'});

  screen.getByRole('button',{name: '='});

});

it('should update the display when a number is clicked', async () => {
  const numberBtn = getRandomNumberButton();

  await userEvent.click(numberBtn);

  expect(screen.getByTestId('display').textContent).toEqual(numberBtn.textContent);
});

it('should update the display when a operator is clicked', async () => {
  const operatorBtn = getRandomOperatorButton();

  await userEvent.click(operatorBtn);
  //TODO the correct display should be '0' + operatorBtn.textContent
  expect(screen.getByTestId('display').textContent).toEqual(operatorBtn.textContent);
});

it('should update the display when the decimal button is clicked', async () => {
  await userEvent.click(getDecimalButton());

  expect(screen.getByTestId('display').textContent).toEqual('0.');
});

it('should clear the display when the AC button is clicked', async () => {
  const clearBtn = screen.getByRole('button',{name: 'AC'});

  await userEvent.click(getRandomNumberButton());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

  await userEvent.click(getRandomOperatorButton());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

  await userEvent.click(getDecimalButton());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

});

it('should display an error message when the max length is reached', async () => {

  for(let i = 0; i < MAX_DISPLAY_LENGTH+1; i++){
    await userEvent.click(getRandomNumberButton());
  }

  expect(screen.getByTestId('display').textContent).toEqual('MAX');
});

it('should reject two decimals in the same number', async () => {

  const dotCount = (str) => {
    let count = 0;
    for(let c of str){
      if(c === '.'){
        count++;
      }
    }
    return count;
  }

  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getDecimalButton());

  await userEvent.click(getRandomOperatorButton());

  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumberButton());

 expect(dotCount(screen.getByTestId('display').textContent)).toEqual(2);

});

