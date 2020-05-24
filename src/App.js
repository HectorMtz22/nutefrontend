import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateMat from './components/CreateMat';
import ListNotes from './components/ListNotes';
import CreateNote from './components/CreateNote';
import LoginUser from './components/LoginUser';
import User from './components/User';
import RegisterUser from './components/RegisterUser';
import PageNotFound from './components/PageNotFound';
import './css/style.css';

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props

    return (
      <Route 
        {...props} 
        render={props => (
          localStorage.getItem('auth') ?
            <Component {...props} /> :
            <Redirect to='/login' />
        )} 
      />
    )
  }
}

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
          <Switch>
          <Route path="/login" component={LoginUser} />
          <Route path="/register" component={RegisterUser} />
          <ProtectedRoute path="/" exact component={ListNotes} />
          <ProtectedRoute path="/edit/:id" component={CreateNote} />
          <ProtectedRoute path="/create" component={CreateNote} />
          <ProtectedRoute path="/mat" component={CreateMat} />
          <ProtectedRoute path="/user" component={User} />
          <Route component={PageNotFound} />
          </Switch>
        <Footer />
      </Router>
    </div>
  );
}



export default App;
