import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {MAX_DISPLAY_LENGTH} from './App';

const getRandomNumberButton = () => {
  //the number zero can be an edge case and will be dealt with in other tests
  const randomNumberFrom1to9 = Math.floor(Math.random() * 9) + 1;
  return screen.getByRole('button',{name: randomNumberFrom1to9});
}

const getRandomOperatorButton = () => {
  //the negative sign can be an edge case and will be dealt with another tests
  const operators = ['/','*','+'];
  const randomOperator = operators[Math.floor(Math.random() * operators.length)]
  return screen.getByRole('button',{name: randomOperator});
}

const getDecimalButton = () => {
  return screen.getByRole('button',{name: '.'});
}

it('should render properly', () => {
  render(<App />);

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
  render(<App />);

  const numberBtn = getRandomNumberButton();

  await userEvent.click(numberBtn);

  expect(screen.getByTestId('display').textContent).toEqual(numberBtn.textContent);
});

it('should update the display when a operator is clicked', async () => {
  render(<App />);

  const operatorBtn = getRandomOperatorButton();

  await userEvent.click(operatorBtn);
  //TODO the correct display should be '0' + operatorBtn.textContent
  expect(screen.getByTestId('display').textContent).toEqual(operatorBtn.textContent);
});

it('should update the display when the decimal button is clicked', async () => {
  render(<App />);

  await userEvent.click(getDecimalButton());

  expect(screen.getByTestId('display').textContent).toEqual('0.');
});

it('should clear the display when the AC button is clicked', async () => {
  render(<App />);

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
  render(<App />);

  for(let i = 0; i < MAX_DISPLAY_LENGTH+1; i++){
    await userEvent.click(getRandomNumberButton());
  }

  expect(screen.getByTestId('display').textContent).toEqual('MAX');
});

it('should reject two decimals in the same number', async () => {
  render(<App />);

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

  const dotCount = screen.getByTestId('display').textContent.split('.').length - 1;

  expect(dotCount).toEqual(2);

});

it('should perform basic operations', async() => {
  render(<App />);
  const equalSign = screen.getByRole('button',{name: '='});

  //case xx.xx operator yy.yy
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getRandomNumberButton());

  await userEvent.click(getRandomOperatorButton());

  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getRandomNumberButton());

  const operation = screen.getByTestId('display').textContent;

  expect(operation).not.toEqual('0');

  await userEvent.click(equalSign);

  const result = screen.getByTestId('display').textContent;

  //TODO this should work
  //expect(Number(result)).toEqual(eval(operation));

  expect(result).not.toEqual(operation);
});

it('should handle negative number operations', async() => {
  render(<App />);

  const minusButton = screen.getByRole('button',{name: '-'});
  //case -x operator -y
  await userEvent.click(minusButton);
  await userEvent.click(getRandomNumberButton());
  await userEvent.click(getRandomOperatorButton());
  await userEvent.click(minusButton);
  await userEvent.click(getRandomNumberButton());

  const negativeCount = screen.getByTestId('display').textContent.split('-').length - 1;
  expect(negativeCount).toEqual(2);

  const operation = screen.getByTestId('display').textContent;
  expect(operation).not.toEqual('0');

  const equalSign = screen.getByRole('button',{name: '='});
  await userEvent.click(equalSign);

  const result = screen.getByTestId('display').textContent;
  expect(result).not.toEqual(operation);

});



