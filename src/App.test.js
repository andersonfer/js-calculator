import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {MAX_DISPLAY_LENGTH} from './App';

const getRandomNumber = () => {
  //the number zero can be an edge case and will be dealt with in other tests
  const randomNumberFrom1to9 = Math.floor(Math.random() * 9) + 1;
  return screen.getByRole('button',{name: randomNumberFrom1to9});
}

const getRandomOperator = () => {
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

  const numberBtn = getRandomNumber();

  await userEvent.click(numberBtn);

  expect(screen.getByTestId('display').textContent).toEqual(numberBtn.textContent);
});

it('should update the display when a operator is clicked', async () => {
  render(<App />);

  const operatorBtn = getRandomOperator();
  const expectedDisplay = '0' + operatorBtn.textContent;

  await userEvent.click(operatorBtn);
  expect(screen.getByTestId('display').textContent).toEqual(expectedDisplay);
});

it('should update the display when the decimal button is clicked', async () => {
  render(<App />);

  await userEvent.click(getDecimalButton());

  expect(screen.getByTestId('display').textContent).toEqual('0.');
});

it('should clear the display when the AC button is clicked', async () => {
  render(<App />);

  const clearBtn = screen.getByRole('button',{name: 'AC'});

  await userEvent.click(getRandomNumber());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

  await userEvent.click(getRandomOperator());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

  await userEvent.click(getDecimalButton());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

});

it('should display an error message when the max length is reached', async () => {
  render(<App />);

  for(let i = 0; i < MAX_DISPLAY_LENGTH+1; i++){
    await userEvent.click(getRandomNumber());
  }

  expect(screen.getByTestId('display').textContent).toEqual('MAX');
});

it('should reject two decimals in the same number', async () => {
  render(<App />);

  await userEvent.click(getRandomNumber());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumber());
  await userEvent.click(getDecimalButton());

  await userEvent.click(getRandomOperator());

  await userEvent.click(getRandomNumber());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumber());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumber());

  const dotCount = screen.getByTestId('display').textContent.split('.').length - 1;

  expect(dotCount).toEqual(2);

});

it('should perform basic operations', async() => {
  render(<App />);

  //case xx.xx operator yy.yy
  await userEvent.click(getRandomNumber());
  await userEvent.click(getRandomNumber());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumber());
  await userEvent.click(getRandomNumber());

  await userEvent.click(getRandomOperator());

  await userEvent.click(getRandomNumber());
  await userEvent.click(getRandomNumber());
  await userEvent.click(getDecimalButton());
  await userEvent.click(getRandomNumber());
  await userEvent.click(getRandomNumber());

  const operation = screen.getByTestId('display').textContent;
  expect(operation).not.toEqual('0');

  const equalSign = screen.getByRole('button',{name: '='});
  await userEvent.click(equalSign);

  const result = screen.getByTestId('display').textContent;
  expect(result).not.toEqual(operation);

  //TODO this should work
  //expect(Number(result)).toEqual(eval(operation));
});

it('should handle negative number operations', async() => {
  render(<App />);

  const minusButton = screen.getByRole('button',{name: '-'});
  //case -x operator -y
  await userEvent.click(minusButton);
  await userEvent.click(getRandomNumber());
  await userEvent.click(getRandomOperator());
  await userEvent.click(minusButton);
  await userEvent.click(getRandomNumber());

  const negativeCount = screen.getByTestId('display').textContent.split('-').length - 1;
  expect(negativeCount).toEqual(2);

  const operation = screen.getByTestId('display').textContent;
  expect(operation).not.toEqual('0');

  const equalSign = screen.getByRole('button',{name: '='});
  await userEvent.click(equalSign);

  const result = screen.getByTestId('display').textContent;
  expect(result).not.toEqual(operation);

});



