import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const NUMBER_BUTTONS = [];
const OPERATOR_BUTTONS = [];

beforeEach(() =>{
  render(<App />);

  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '0'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '1'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '2'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '3'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '4'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '5'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '6'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '7'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '8'}));
  NUMBER_BUTTONS.push(screen.getByRole('button',{name: '9'}));

  OPERATOR_BUTTONS.push(screen.getByRole('button',{name: '/'}));
  OPERATOR_BUTTONS.push(screen.getByRole('button',{name: '*'}));
  OPERATOR_BUTTONS.push(screen.getByRole('button',{name: '-'}));
  OPERATOR_BUTTONS.push(screen.getByRole('button',{name: '+'}));

});

afterEach(() =>{
  //this empty the arrays
  NUMBER_BUTTONS.length = 0;
  OPERATOR_BUTTONS.length = 0;
})

const getRandomNumberButton = () => {
  return NUMBER_BUTTONS[Math.floor(Math.random() * NUMBER_BUTTONS.length)];
}

const getRandomOperatorButton = () => {
  return OPERATOR_BUTTONS[Math.floor(Math.random() * OPERATOR_BUTTONS.length)];
}

it('should render properly', () => {
  expect(screen.getByTestId('display')).toHaveTextContent('0');
  expect(NUMBER_BUTTONS).toHaveLength(10);
  expect(OPERATOR_BUTTONS).toHaveLength(4);

  screen.getByRole('button',{name: 'AC'});
  screen.getByRole('button',{name: '='});
  screen.getByRole('button',{name: '.'});

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
  const decimalBtn = screen.getByRole('button',{name: '.'});
  const expectedDisplay = '0.'

  await userEvent.click(decimalBtn);

  expect(screen.getByTestId('display').textContent).toEqual(expectedDisplay);
});

it('should clear the display when the AC button is clicked', async () => {
  const clearBtn = screen.getByRole('button',{name: 'AC'});

  await userEvent.click(getRandomNumberButton());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

  await userEvent.click(getRandomOperatorButton());
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

  const decimalBtn = screen.getByRole('button',{name: '.'});
  await userEvent.click(decimalBtn);
  await userEvent.click(clearBtn);

  expect(screen.getByTestId('display').textContent).toEqual('0');

});

