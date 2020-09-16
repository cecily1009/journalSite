import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'> Personal Journals Site</h1>
          <p className='lead'>Keeping a diary makes you feel happier..!</p>
          <div className='buttons'>
            <Link to='/register'>
              {' '}
              <Button basic inverted color='blue'>
                Sign Up
              </Button>
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to='/login'>
              <Button basic inverted color='teal'>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Landing;
