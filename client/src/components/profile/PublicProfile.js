import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { getProfile } from '../../actions/profile';
import { getUserPublicJournals } from '../../actions/journal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Spinner } from 'react-bootstrap';
import { Button, Grid, Image, Header, Icon } from 'semantic-ui-react';
const PublicProfile = ({
  getProfile,
  profile: { profile, loading },
  getUserPublicJournals,
  journal: { journals },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfile(match.params.id);
    getUserPublicJournals(match.params.id);
  }, [getProfile, match.params.id, getUserPublicJournals]);
  let sum = 0;

  journals.forEach((journal) => (sum += journal.likes.length));

  return (
    <Fragment>
      {profile === null || loading ? (
        <Container>
          <hr />

          <Link to='/journals'>
            <Button inverted color='blue' animated>
              <Button.Content visible>Back To Public Jounals</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow left' />
              </Button.Content>
            </Button>
          </Link>
          <hr />
          <h1 className='no_profile_page'>
            This user has not set up profile yet &nbsp;&nbsp;&nbsp;
            <Spinner animation='grow' variant='primary' size='sm' />
            &nbsp;&nbsp;
            <Spinner animation='grow' variant='secondary' size='sm' />
            &nbsp;&nbsp;
            <Spinner animation='grow' variant='success' size='sm' />
            &nbsp;&nbsp;
            <Spinner animation='grow' variant='danger' size='sm' />
            &nbsp;&nbsp;
            <Spinner animation='grow' variant='warning' size='sm' />
            &nbsp;&nbsp;
            <Spinner animation='grow' variant='info' size='sm' />
          </h1>
        </Container>
      ) : (
        <Fragment>
          <hr />
          <Link to='/journals'>
            <Button inverted color='blue' animated>
              <Button.Content visible>Back To Public Jounals</Button.Content>
              <Button.Content hidden>
                <Icon name='arrow left' />
              </Button.Content>
            </Button>
          </Link>
          <div className='login well well-lg'>
            <Header as='h2' color='blue' textAlign='center'>
              <Header.Content>
                {profile.owner.username}'s Profile
              </Header.Content>
            </Header>
            <Header as='h3' textAlign='center'>
              <Header.Content>{profile.status}</Header.Content>
            </Header>
          </div>
          <hr />
          <Grid container textAlign='justified' columns='equal' divided>
            {/* user's public journal List */}
            <Grid.Column width={4}>
              <ListGroup>
                <ListGroup.Item variant='primary'>Journal List:</ListGroup.Item>
                {journals.length > 0 ? (
                  journals.map((journal) => (
                    <Link
                      key={journal._id}
                      to={`/journals/journal/${journal._id}`}
                    >
                      <ListGroup.Item action variant='light' key={journal._id}>
                        {journal.title}
                      </ListGroup.Item>
                    </Link>
                  ))
                ) : (
                  <ListGroup.Item>No Journals Found</ListGroup.Item>
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
                  <Grid.Column width={13}>
                    <Grid centered doubling columns={2}>
                      <Grid.Column>
                        <Header as='h3'>
                          <Icon name='user' />
                          <Header.Content>
                            <span>Username: </span>
                            {profile.owner.username}
                          </Header.Content>
                        </Header>

                        <Header as='h3'>
                          <Icon name='book' />
                          <Header.Content>
                            <span>Total journals: </span>
                            {profile.journals.length}
                          </Header.Content>
                        </Header>
                        <Header as='h3'>
                          <Icon name='heart' color='red' />
                          <Header.Content>
                            <span>Total likes: </span>
                            {sum}
                          </Header.Content>
                        </Header>
                      </Grid.Column>
                    </Grid>
                    <Grid>
                      <br />
                      <Header as='h2'>
                        <Header.Content>About me:</Header.Content>
                      </Header>
                    </Grid>
                    <Grid>
                      <br />
                      <p>{profile.bio}</p>
                    </Grid>

                    {auth.isAuthenticated &&
                      auth.user._id === profile.owner._id && (
                        <Grid>
                          <Button inverted color='blue' className='m-2'>
                            <Link to='/edit-profile'>Edit Profile</Link>
                          </Button>
                        </Grid>
                      )}
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <p className='lead'>picture: </p>
                    <Image src={profile.owner.avatar} />
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
      )}
    </Fragment>
  );
};

PublicProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getProfile: PropTypes.func.isRequired,
  getUserPublicJournals: PropTypes.func.isRequired,
  //   getJournals: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  journal: state.journal,
});
export default connect(mapStateToProps, {
  getProfile,
  getUserPublicJournals,
  //   getJournals,
})(PublicProfile);
