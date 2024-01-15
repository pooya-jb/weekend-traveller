import { render, screen } from '@testing-library/react';
import App from '../App';

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

//  TASKS
//  Mock API data

//  TESTS TO BE MADE
//  1.  Shows logo
//  2.  Allows currency selection
//  3.  Allows airport selection
//  4.  Allows airport search
//  5.  Allows date selection
//  6.  Allows one way selection
//  7.  Allows Return trip
//  8.  Allows weeks-to-show selection
//  9.  Shows results:
//        X number of weeks
//        Travel date and return date
//        Destination
//        Price in correct format
