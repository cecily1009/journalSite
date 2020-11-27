import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

export const Landing = ({ isAuthenticated }) => {
   const guestLinks = (
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
  );
  const authLinks = (
    <div className='buttons'>
      <div className='buttons'>
            <Link to='/profile/me'>
              {' '}
              <Button basic inverted color='blue'>
                My Profile
              </Button>
            </Link>
            &nbsp;&nbsp;&nbsp;
            <Link to='/journals/mine'>
              {' '}
              <Button basic inverted color='teal'>
                My Journals
              </Button>
            </Link>
          </div>
    </div>
  );
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'> Personal Journals Site</h1>
          <p className='lead'>Keeping a diary makes you feel happier..!</p>
          {<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>}
        </div>
      </div>
    </section>
  );
};
Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
