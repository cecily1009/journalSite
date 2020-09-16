import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getJournals } from '../../actions/journal';
import PropTypes from 'prop-types';
import { Container, Spinner, Jumbotron } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';
import { JournalItem } from './JournalItem';
export const UserJournals = ({
  getJournals,
  journal: { journals, loading },
}) => {
  useEffect(() => {
    getJournals();
  }, [getJournals]);
  return (
    <Fragment>
      {loading ? (
        <Spinner animation='border' variant='secondary' />
      ) : (
        <Fragment>
          <Jumbotron fluid className='login'>
            <h1>Manage Your Journals</h1>
            <div className='line'></div>

            <h5>See What You Kept So Far...</h5>
            <Link to='/create-journal'>
              <Button primary>Write New Journal</Button>
            </Link>
          </Jumbotron>
          <hr />
          <Container>
            {journals.length > 0 ? (
              journals.map((journal) => (
                <JournalItem key={journal._id} journal={journal} />
              ))
            ) : (
              <h4>
                You haven't written any,
                <a href='/create-journal'>start now?</a>
              </h4>
            )}
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

UserJournals.propTypes = {
  getJournals: PropTypes.func.isRequired,
  journal: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  journal: state.journal,
});

export default connect(mapStateToProps, { getJournals })(UserJournals);
