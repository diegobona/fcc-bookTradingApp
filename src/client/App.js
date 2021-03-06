import React, { Component, Fragment } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router'
import { Query } from 'react-apollo'

import './styles/index.css'

import Header from './components/Header'
import Login, { Signup } from './components/Login'
import User from './components/User'
import HomeBook, { AddBook, MyBook } from './components/AddBook'
import MyRequest from './components/MyRequest'

import client, {
  LOCAL_USER,
  GET_BOOKS,
} from './apolloClient'

class App extends Component {
  constructor(props) {
    super(props)
    client.query({ query: GET_BOOKS })
  }
  render() {
    return (
      <Query
        query={LOCAL_USER}
      >
        {({ data }) => {
          const localUser = data && data.localUser
          const loggedIn = !!localUser

          // handle redirection when loggedin vs non-loggedin
          const { pathname } = this.props.location // eslint-disable-line
          if (!loggedIn && !/^\/(login|signup)/i.test(pathname)) this.preRoute = pathname
          this.preRoute = this.preRoute || '/'

          return (
            <Fragment>
              <Header loggedIn={loggedIn} />
              <div className="mx-auto">
                <Switch>
                  <Route path="/" exact render={() => <HomeBook user={localUser} />} />
                  <Route path="/login" render={() => loggedIn ? <Redirect to={this.preRoute} /> : <Login />} />
                  <Route path="/signup" render={() => loggedIn ? <Redirect to={this.preRoute} /> : <Signup />} />
                  <Route path="/user" render={() => !loggedIn ? <Redirect to="/login" /> : <User user={localUser} />} />
                  <Route path="/addBook" render={() => !loggedIn ? <Redirect to="/login" /> : <AddBook user={localUser} />} />
                  <Route path="/myBook" render={() => !loggedIn ? <Redirect to="/login" /> : <MyBook user={localUser} />} />
                  <Route path="/myRequest" render={() => !loggedIn ? <Redirect to="/login" /> : <MyRequest user={localUser} />} />
                </Switch>
              </div>
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export default withRouter(App)
