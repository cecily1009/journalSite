import React, { Fragment, useState, useEffect } from 'react';
import { updateJournal } from '../../actions/journal';
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
    
    setFormData({
      title: loading || !journal.title ? '' : journal.title,
      content: loading || !journal.content ? '' : journal.content,
      image: loading || !journal.image ? '' : journal.image,
      setPrivate: loading || !journal.setPrivate ? '' : journal.setPrivate,
    });
  }, [loading, journal._id, journal.content, journal.title, journal.image, journal.setPrivate]);

  const { title, image, content, setPrivate } = formData;

  
  const uploadpic = async (e) => {
    const image_data = new FormData();
    image_data.append('file', e.target.files[0]);
    image_data.append('upload_preset', 'journalGarden');
    
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/journalsite/image/upload',
      {
        method: 'post',
        body: image_data,
      }
    );
    const file = await res.json();
   
    // cloudinary allows to transform image by simply modifing url.
    let index = file.secure_url.indexOf('upload') +6;
    // set all journal images to be {width:500px; height:500px} 
    let secure_url = file.secure_url.slice(0,index)+ '/ar_1.5,c_crop/c_fit,h_500,w_500'+ file.secure_url.slice(index);
    setFormData({ ...formData, image: secure_url });
    
  };
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    updateJournal(journal._id, formData, history);
  };
  return (
    <Fragment>
      <hr />
      <Link to='/journals/mine'>
        <Button basic color='blue' animated>
          <Button.Content visible>Back To My Jounals</Button.Content>
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
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Upload Image
          </Form.Label>
          <Col sm={10}>
            <Form.File name='image' onChange={uploadpic}></Form.File>

              <img
                className='journal-image'
                src={image}
                alt=''
                
              ></img>
             
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
};
const mapStateToProps = (state) => ({
  journal: state.journal,
});

export default connect(mapStateToProps, { updateJournal })(
  EditJournal
);
