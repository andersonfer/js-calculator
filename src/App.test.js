import { render, screen } from '@testing-library/react';
import App from './App';

const NUMBER_BUTTONS = [];

beforeAll(() =>{
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
});

it('should render properly', () => {
  expect(screen.getByTestId('display')).toHaveTextContent('0');

  screen.getByRole('button',{name: 'AC'});

  screen.getByRole('button',{name: '/'});
  screen.getByRole('button',{name: '*'});
  screen.getByRole('button',{name: '-'});
  screen.getByRole('button',{name: '+'});
  screen.getByRole('button',{name: '='});
  screen.getByRole('button',{name: '.'});

});
