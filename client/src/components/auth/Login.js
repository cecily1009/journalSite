import React, { Fragment, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';
export const Login = ({ login, isAuthenticated, history }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { username, password } = formData;
  const onSubmit = (e) => {
    e.preventDefault();
    login(username, password, history);
  };
  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/' />;
  }
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Fragment>
      <div className='login'>
        <h1 className='large'>Sign In</h1>
        <p className='lead'>
          <i className='fas fa-user'> </i> Dont't have an Account?
          <Link to='/register'> Create one</Link>
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
              required
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
              required
            />
          </Form.Group>

          <Button variant='outline-primary' value='Login' type='submit'>
            Login
          </Button>
        </Form>
      </div>
    </Fragment>
  );
};
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);
