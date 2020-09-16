import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getPublicJournals } from '../../actions/journal';
import PropTypes from 'prop-types';
import { Container, Spinner, Jumbotron } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';
import { JournalItem } from './JournalItem';
export const PublicJournals = ({
  getPublicJournals,
  journal: { journals, loading },
}) => {
  useEffect(() => {
    getPublicJournals();
  }, [getPublicJournals]);
  return (
    <Fragment>
      {loading ? (
        <Spinner animation='border' variant='secondary' />
      ) : (
        <Fragment>
          <Jumbotron fluid className='login'>
            <h1>Public Journals</h1>
            <div className='line'></div>

            <h5>Read what others have written</h5>
          </Jumbotron>
          <hr />
          <Container fluid>
            {journals.length > 0 ? (
              journals.map((journal) => (
                <JournalItem key={journal._id} journal={journal} />
              ))
            ) : (
              <h4>No public journals found...</h4>
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

PublicJournals.propTypes = {
  getPublicJournals: PropTypes.func.isRequired,
  journal: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  journal: state.journal,
});

export default connect(mapStateToProps, { getPublicJournals })(PublicJournals);
