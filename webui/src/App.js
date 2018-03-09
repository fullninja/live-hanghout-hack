import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';

import logo from './logo.svg';
import './App.css';

import { actions, store } from './redux';

class FormAddMsg extends Component {
  constructor (props) {
    super(props);

    this.state = { msg: '' };
  }

  render () {
    return (
      <form onSubmit={ this.handleSubmit.bind(this) }>
        <input
          onChange={ this.handleChangeInput.bind(this) }
          value={ this.state.msg } />

        <button type='submit'>enviar</button>
      </form>
    );
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({ msg: '' });
  }

  handleChangeInput (ev) {
    this.setState({ msg: ev.target.value });
  }
}

class FormLogin extends Component {
  constructor (props) {
    super(props);

    this.state = { loginName: '' };
  }

  render () {
    return (
      <form onSubmit={ this.handleSubmit.bind(this) }>
        <input
          onChange={ this.handleChangeInput.bind(this) }
          value={ this.state.loginName } />

        <button type='submit'>entrar</button>
      </form>
    );
  }

  handleSubmit (ev) {
    ev.preventDefault();
    this.props.onSubmit(this.state);
  }

  handleChangeInput (ev) {
    this.setState({ loginName: ev.target.value });
  }
}

class ChatRoom extends Component {
  render () {
    return (
      <div
        style={ { width: '100%', display: 'flex', flexdirection: 'row' } }
        className='chat-room-wrapper'>

        <div
          style={ { flex: 1 } }
          className='chat-window'>
          { this.props.msgs.map(this.renderMsg.bind(this)) }

          <br />
          <FormAddMsg onSubmit={ this.handleSubmit.bind(this) } />
        </div>

        <div
          style={ { width: '250px', borderLeft: '1px solid #F0F0F0' } }
          className='chat-users'>
          { this.props.chatUsers.map(this.renderUser.bind(this)) }
        </div>

      </div>
    );
  }

  handleSubmit (values) {
    actions.msgs.send(values.msg);
  }

  renderMsg (msg, index) {
    if (msg.system) {
      return (
        <p key={ index }>
          [{ msg.date }] { msg.msg }
        </p>
      );
    }

    return (
      <p key={ index }>
        [{ msg.date }] { msg.userName }: { msg.msg }
      </p>
    );
  }

  renderUser (userName, index) {
    return (
      <p key={ index }>
        { userName }
      </p>
    );
  }
}

const ChatRoomContainer = connect((s) => {
  return { msgs: s.msgs, chatUsers: s.chatUsers };
})(ChatRoom);

class AppContent extends Component {
  render() {
    return (
      <div>
        { !this.props.user &&
          <FormLogin onSubmit={ this.handleSubmit.bind(this) } /> }

        { this.props.user &&
          <ChatRoomContainer /> }
      </div>
    );
  }

  handleSubmit (values) {
    actions.user.tryLogin(values.loginName);
  }
}

const AppContainer = connect((s) => {
  return { user: s.user };
})(AppContent);

class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>

          <AppContainer />
        </div>
      </Provider>
    );
  }
}

export default App;
