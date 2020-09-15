import React, { Fragment, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
export const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
  });

  const { username, email, password, password2 } = formData;
  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passowrd do not match', 'danger');
    } else {
      register({ username, email, password });
    }
  };
  if (isAuthenticated) {
    return <Redirect to='/login' />;
  }
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className='register'>
        <h1 className='large'>Sign up </h1>
        <p className='lead'>
          <i className='fas fa-user'> </i> Already have account?
          <Link to='/login'> Login here</Link>
        </p>
        <Form onSubmit={(e) => onSubmit(e)}>
          <Form.Group controlId='formGridUsername'>
            <Form.Label>Username</Form.Label>
            <input
              className='formControl'
              name='username'
              value={username}
              placeholder='Enter username'
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group controlId='formGridEmail'>
            <Form.Label>Email</Form.Label>
            <input
              className='formControl'
              name='email'
              value={email}
              type='email'
              placeholder='Enter email'
              onChange={(e) => onChange(e)}
            />
          </Form.Group>

          <Form.Group controlId='formGridPassword'>
            <Form.Label>Password</Form.Label>
            <input
              className='formControl'
              name='password'
              value={password}
              type='password'
              placeholder='Password'
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Form.Group controlId='formGridPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <input
              className='formControl'
              name='password2'
              value={password2}
              type='password'
              placeholder='Confirm your Password'
              onChange={(e) => onChange(e)}
            />
          </Form.Group>
          <Button variant='outline-primary' type='submit' value='Register'>
            Sign Up
          </Button>
        </Form>
      </div>
    </Fragment>
  );
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, register })(Register);
