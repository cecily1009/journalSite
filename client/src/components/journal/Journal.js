import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  getJournal,
  deleteJournal,
  addLike,
  removeLike,
} from '../../actions/journal';
import { connect } from 'react-redux';
import { Spinner, Container, Card } from 'react-bootstrap';
import { Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
const Journal = ({
  getJournal,
  deleteJournal,
  addLike,
  removeLike,
  journal: { journal, loading },
  auth,
  match,
  history,
}) => {
  useEffect(() => {
    getJournal(match.params.id);
  }, [getJournal, match.params.id]);
  return (
    <Fragment>
      {journal === null || loading ? (
        <Spinner animation='border' />
      ) : (
        <Fragment>
          <hr />
          <a href='/journals'>
            <Button basic color='blue' animated>
              <Button.Content visible>Back To Public Jounals</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow left' />
              </Button.Content>
            </Button>
          </a>
          <div className='login well well-lg'>
            <div className='line'></div>
            <h2>Title: {journal.title}</h2>
            <div className='line'></div>
          </div>

          <Container fluid>
            <Card border='info'>
              <Card.Img className='imgs' variant='top' src={journal.image} />
              <Card.Body as='div'>
                <Link to={`/profile/user/${journal.author._id}`}>
                  <Card.Title className='journal_author'>
                    -- by {journal.author.username}
                  </Card.Title>
                </Link>
                <Card.Subtitle className='mb-2 text-muted'>
                  posted on{' '}
                  <Moment format='YYYY/MM/DD'>{journal.created}</Moment>
                </Card.Subtitle>
                <Card.Text>{journal.content}</Card.Text>
                {auth.isAuthenticated && (
                  <Fragment>
                    <Button
                      inverted
                      color='blue'
                      floated='right'
                      content='Unlike'
                      icon='thumbs down'
                      onClick={(e) => removeLike(match.params.id, history)}
                    />
                    <Button
                      inverted
                      floated='right'
                      color='red'
                      content='Like'
                      icon='thumbs up'
                      onClick={(e) => addLike(match.params.id, history)}
                    ></Button>

                    {auth.isAuthenticated &&
                      auth.user._id === journal.author._id && (
                        <div className='btn-group'>
                          <Button inverted color='green' floated='left'>
                            <Link to='/edit-journal'>Edit Journal</Link>
                          </Button>
                          <Button
                            inverted
                            color='red'
                            floated='left'
                            onClick={(e) =>
                              deleteJournal(match.params.id, history)
                            }
                          >
                            Delete Journal
                          </Button>
                        </div>
                      )}
                  </Fragment>
                )}
              </Card.Body>
            </Card>

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
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
};

Journal.propTypes = {
  journal: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getJournal: PropTypes.func.isRequired,
  deleteJournal: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  journal: state.journal,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getJournal,
  deleteJournal,
  addLike,
  removeLike,
})(Journal);
