import { render, screen } from '@testing-library/react';
import App from './App';

it('should render properly', () => {
  render(<App />);

  expect(screen.getByTestId('display')).toHaveTextContent('0');

  screen.getByRole('button',{name: 'AC'});

  screen.getByRole('button',{name: '/'});
  screen.getByRole('button',{name: '*'});
  screen.getByRole('button',{name: '-'});
  screen.getByRole('button',{name: '+'});
  screen.getByRole('button',{name: '='});
  screen.getByRole('button',{name: '.'});

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
});
