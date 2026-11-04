import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the site name', () => {
  render(<App />);
  expect(screen.getByText('记忆芯')).toBeInTheDocument();
});
