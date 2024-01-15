import { render, screen } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  //  Initialize the component
  let app: any;

  beforeEach(() => {
    app = render(<App />);
  });

  //  App loads
  it('should render App component correctly', () => {
    const element = screen.getByRole('main');
    expect(element).toBeInTheDocument();
  });
});
