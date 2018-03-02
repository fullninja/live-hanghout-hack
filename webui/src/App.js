import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client';

const socketUrl = 'http://localhost:9010';
const socket = io(socketUrl);

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
          value={ this.state.loginName } />

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
  constructor (props) {
    super(props);

    this.state = { msgs: [ ] };

    socket.on('msg', (msg) => {
      const msgs = [ ...this.state.msgs ]

      msgs.push(msg)
      this.setState({ msgs });
    });
  }

  render () {
    return (
      <div
        style={ { width: '100%', display: 'flex', flexdirection: 'row' } }
        className='chat-room-wrapper'>

        <div
          style={ { flex: 1 } }
          className='chat-window'>
          { this.state.msgs.map(this.renderMsg.bind(this)) }

          <br />
          <FormAddMsg onSubmit={ this.handleSubmit.bind(this) } />
        </div>

        <div
          style={ { width: '250px', borderLeft: '1px solid #F0F0F0' } }
          className='chat-users'>
          { this.props.allUsers.map(this.renderUser.bind(this)) }
        </div>

      </div>
    );
  }

  handleSubmit (values) {
    socket.emit('msg', values.msg);
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

class App extends Component {
  constructor (props) {
    super(props);

    this.state = { loggedIn: false, allUsers: [ ], userName: '' };

    socket.on('all-users', (allUsers) => {
      this.setState({ allUsers });
    });

    socket.on('login-success', (userName) => {
      this.setState({ loggedIn: true, userName });
    });

    socket.on('add-user', (userName) => {
      const allUsers = [ ...this.state.allUsers ];

      allUsers.push(userName);
      this.setState({ allUsers });
    });

    socket.on('user-disconnect', (userName) => {
      const allUsers = [ ...this.state.allUsers ];
      allUsers.splice(allUsers.indexOf(userName), 1);

      this.setState({ allUsers });
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        { !this.state.loggedIn &&
          <FormLogin onSubmit={ this.handleSubmit.bind(this) } /> }

        { this.state.loggedIn &&
          <ChatRoom allUsers={ this.state.allUsers } /> }
      </div>
    );
  }

  handleSubmit (values) {
    socket.emit('try-login', values.loginName);
  }
}

export default App;
