import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { addJournal } from '../../actions/journal';
import { connect } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const CreateJournal = ({ addJournal, history }) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    content: '',
    setPrivate: '',
  });

  const { title, image, content, setPrivate } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    addJournal(formData, history);
  };
  return (
    <Fragment>
      <hr />
      <Link to='/journals'>
        <Button basic color='blue' animated>
          <Button.Content visible>Back To Public Jounals</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow left' />
          </Button.Content>
        </Button>
      </Link>
      <div className='login well well-lg'>
        <div className='line'></div>
        <h2>Write a New Journal</h2>
        <div className='line'></div>
      </div>

      <Form onSubmit={(e) => onSubmit(e)}>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Title
          </Form.Label>
          <Col sm={10}>
            <input
              className='formControl'
              name='title'
              value={title}
              placeholder='Enter title for journal'
              onChange={(e) => onChange(e)}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Image Link
          </Form.Label>
          <Col sm={10}>
            <input
              className='formControl'
              name='image'
              value={image}
              placeholder='Enter image link for journal'
              onChange={(e) => onChange(e)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Content
          </Form.Label>
          <Col sm={10} className='green-border-focus'>
            <Form.Control
              as='textarea'
              className='formControl'
              name='content'
              value={content}
              row='10'
              onChange={(e) => onChange(e)}
            >
              Start your journal here.......
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Private?
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as='select'
              name='setPrivate'
              value={setPrivate}
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
              <Button inverted color='blue' value='CreateJournal' type='submit'>
                Submit
              </Button>
            </Button.Group>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

CreateJournal.propTypes = {
  addJournal: PropTypes.func.isRequired,
};

export default connect(null, { addJournal })(CreateJournal);
