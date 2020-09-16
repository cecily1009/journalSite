import React, { Fragment, useState, useEffect } from 'react';
import { updateJournal, getJournal } from '../../actions/journal';
import { Form, Row, Col } from 'react-bootstrap';
import { Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const EditJournal = ({
  journal: { journal, loading },
  updateJournal,
  history,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    content: '',
    setPrivate: '',
  });
  useEffect(() => {
    getJournal(journal._id);
    setFormData({
      title: loading || !journal.title ? '' : journal.title,
      content: loading || !journal.content ? '' : journal.content,
      image: loading || !journal.image ? '' : journal.image,
      setPrivate: loading || !journal.setPrivate ? '' : journal.setPrivate,
    });
  }, [loading, getJournal]);

  const { title, image, content, setPrivate } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    updateJournal(journal._id, formData, history);
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
        <h2>Edit Journal: {journal.title}</h2>
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
              placeholder='title'
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
              placeholder='image'
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
              placeholder='content'
              value={content}
              row='5'
              onChange={(e) => onChange(e)}
            ></Form.Control>
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
              <Link to={`/journals/journal/${journal._id}`}>
                <Button>Cancel</Button>
              </Link>
              <Button.Or />
              <Button inverted color='blue' value='EditJournal' type='submit'>
                Save
              </Button>
            </Button.Group>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

EditJournal.propTypes = {
  updateJournal: PropTypes.func.isRequired,
  getJournal: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  journal: state.journal,
});

export default connect(mapStateToProps, { updateJournal, getJournal })(
  EditJournal
);
