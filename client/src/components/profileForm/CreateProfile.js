import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { createProfile } from '../../actions/profile';
export const CreateProfile = ({ createProfile, history, auth: { user } }) => {
  const [formData, setFormData] = useState({
    bio: '',
    status: '',
    allPrivate: '',
  });
  const { bio, status, allPrivate } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history);
  };

  return (
    <Fragment>
      <hr />
      <Link to='/journals/mine'>
        <Button basic color='blue' animated>
          <Button.Content visible>Back To Jounals</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow left' />
          </Button.Content>
        </Button>
      </Link>
      <div className='login well well-lg'>
        <div className='line'></div>
        <h2>Complete you profile</h2>
        <div className='line'></div>
      </div>
      <Form onSubmit={(e) => onSubmit(e)}>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Username:
          </Form.Label>
          <Form.Label column sm={9}>
            {user.username}
          </Form.Label>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Status:
          </Form.Label>
          <Col sm={9}>
            <input
              type='text'
              className='formControl'
              name='status'
              value={status}
              placeholder='Personal status'
              onChange={(e) => onChange(e)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Bio:
          </Form.Label>
          <Col sm={9} className='green-border-focus'>
            <Form.Control
              as='textarea'
              className='formControl'
              name='bio'
              placeholder='About yourself...'
              value={bio}
              row='5'
              onChange={(e) => onChange(e)}
            ></Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={3}>
            Set journals all private?
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              as='select'
              name='allPrivate'
              value={allPrivate}
              onChange={(e) => onChange(e)}
            >
              <option>true</option>
              <option>false</option>
            </Form.Control>
          </Col>
        </Form.Group>
        <Row>
          <Col md={{ span: 4, offset: 5 }}>
            <Button.Group>
              <Link to='/journals/mine'>
                <Button>Cancel</Button>
              </Link>
              <Button.Or />
              <Button type='submit' inverted color='blue'>
                Save
              </Button>
            </Button.Group>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { createProfile })(CreateProfile);
