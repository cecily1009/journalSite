import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getMyProfile, createProfile } from '../../actions/profile';
import { getJournals } from '../../actions/journal';
import { Form, Row, Col, ListGroup } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
export const EditProfile = ({
  getMyProfile,
  createProfile,
  profile: { profile, loading },
  getJournals,
  journal: { journals },
  history,
  auth: { user },
}) => {
  const [formData, setFormData] = useState({
    bio: '',
    status: '',
    allPrivate: '',
  });
  useEffect(() => {
    getMyProfile();
    getJournals();
    setFormData({
      bio: loading || !profile.bio ? '' : profile.bio,
      status: loading || !profile.status ? '' : profile.status,

      allPrivate: loading || !profile.allPrivate ? '' : profile.allPrivate,
    });
  }, [loading, getMyProfile, getJournals]);
  const { bio, status, allPrivate } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    createProfile(formData, history, true);
  };
  if (createProfile.edit) {
    return <Redirect to='/journals/mine' />;
  }
  return (
    <Fragment>
      <hr />
      <Link to='/journals/mine'>
        <Button inverted color='blue' animated>
          <Button.Content visible>Back To Jounals</Button.Content>
          <Button.Content hidden>
            <Icon name='arrow left' />
          </Button.Content>
        </Button>
      </Link>
      <div className='login well well-lg'>
        <Header as='h2' color='blue' textAlign='center'>
          <Header.Content>Edit Your Profile</Header.Content>
        </Header>
      </div>
      <hr />
      <Grid container textAlign='justified' columns='equal' divided>
        {/* curr user's journal List */}
        <Grid.Column width={4}>
          <ListGroup>
            <ListGroup.Item variant='primary'>Journal List:</ListGroup.Item>
            {journals.length > 0 ? (
              journals.map((journal) => (
                <Link key={journal._id} to={`/journals/journal/${journal._id}`}>
                  <ListGroup.Item action variant='light' key={journal._id}>
                    {journal.title}
                  </ListGroup.Item>
                </Link>
              ))
            ) : (
              <ListGroup>
                <ListGroup.Item variant='primary'>Journal List:</ListGroup.Item>
                <ListGroup.Item>No Journals Found</ListGroup.Item>
                <Button inverted color='blue' className='m-2'>
                  <Link to='/create-profile'>Create Profile</Link>
                </Button>
              </ListGroup>
            )}
          </ListGroup>
        </Grid.Column>

        {/* User's profile details */}
        <Grid.Column width={12}>
          <Grid celled='internally'>
            <Grid.Row>
              <Grid.Column>
                <Header as='h2' icon='user secret' content='Details:' />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form stacked='true' onSubmit={(e) => onSubmit(e)}>
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
                        <Button
                          inverted
                          color='blue'
                          type='submit'
                          value='EditProfile'
                        >
                          Save
                        </Button>
                      </Button.Group>
                    </Col>
                  </Row>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>
      <Button
        className='back-to-top'
        floated='right'
        basic
        color='blue'
        as='a'
        icon='arrow circle up'
        href='#top'
        content='Top'
      />
    </Fragment>
  );
};
EditProfile.propTypes = {
  getMyProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  journal: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
  journal: state.journal,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  createProfile,
  getJournals,
  getMyProfile,
})(EditProfile);
