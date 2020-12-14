import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NavbarMenu from './components/layout/NavbarMenu';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
//Journals
import PublicJournals from './components/journals/PublicJournals';
import UserJournals from './components/journals/UserJournals';
import Journal from './components/journal/Journal';
import CreateJournal from './components/journalForm/CreateJournal';
import EditJournal from './components/journalForm/EditJournal';
import PrivateRoute from './components/routing/PrivateRoute';
//Profiles
import PublicProfile from './components/profile/PublicProfile';
import Profile_Me from './components/profile/Profile_Me';
import CreateProfile from './components/profileForm/CreateProfile';
import EditProfile from './components/profileForm/EditProfile';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }, []);

  return (
    //Provider takes store as parameter, when reducer updated states in the store, 
    //provider will pass it down to any connected components who needed to update.
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavbarMenu />
          <Route exact path='/' component={Landing} />
          <Container>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login}></Route>
              <Route exact path='/register' component={Register}></Route>
              <Route exact path='/journals' component={PublicJournals}></Route>
              <Route
                exact
                path='/journals/journal/:id'
                component={Journal}
              ></Route>
              <Route exact path='/profile/user/:id' component={PublicProfile} />
              <PrivateRoute
                exact
                path='/journals/mine'
                component={UserJournals}
              />
              <PrivateRoute
                exact
                path='/create-journal'
                component={CreateJournal}
              />
              <PrivateRoute
                exact
                path='/edit-journal'
                component={EditJournal}
              />
              <PrivateRoute exact path='/profile/me' component={Profile_Me} />
              <PrivateRoute
                exact
                path='/create-profile'
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path='/edit-profile'
                component={EditProfile}
              />
            </Switch>
          </Container>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
