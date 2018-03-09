import { createStore, combineReducers } from 'redux';
import io from 'socket.io-client';

const socketUrl = 'http://localhost:9010';
const socket = io(socketUrl);

const actionTypes = {
  user: {
    login: 'user_login'
  },

  chatUsers: {
    load: 'chatUsers_load',
    add: 'chatUsers_add',
    remove: 'chatUsers_remove'
  },

  msgs: {
    add: 'msgs_add'
  }
};

const actions = {
  msgs: {
    send (msg) {
      socket.emit('msg', msg);
    },

    addMessage (msg) {
      dispatch({ type: actionTypes.msgs.add, msg });
    }
  },

  user: {
    tryLogin (username) {
      socket.emit('try-login', username);
    },

    login (username) {
      dispatch({ type: actionTypes.user.login, username });
    }
  },

  chatUsers: {
    load (users) {
      dispatch({ type: actionTypes.chatUsers.load, users });
    },

    add (username) {
      dispatch({ type: actionTypes.chatUsers.add, username });
    },

    remove (username) {
      dispatch({ type: actionTypes.chatUsers.remove, username });
    }
  }
};

function addItemToState (state, item) {
  const newState = [ ...state ];
  newState.push(item);
  return newState;
}

function addUserToState (state, username) {
  return addItemToState(state, username);
}
function addMsgToState (state, msg)  {
  return addItemToState(state, msg);
}

function removeUserInState (state, username) {
  const newState = [ ...state ];
  newState.splice(newState.indexOf(username), 1);
  return newState;
}

const reducers = {
  user: function (state = null, action) {
    switch (action.type) {
      case actionTypes.user.login: return action.username;
      default: return state;
    }
  },

  chatUsers: function (state = [ ], action) {
    switch (action.type) {
      case actionTypes.user.load: return action.users;

      case actionTypes.user.add:
        return addUserToState(state, action.username);

      case actionTypes.user.remove:
        return removeUserInState(state, action.username);

      default: return state;
    }
  },

  msgs: function (state = [ ], action) {
    switch (action.type) {
      case actionTypes.msgs.add: return addMsgToState(state, action.msg);
      default: return state;
    }
  },
};

socket.on('login-success', actions.user.login);

socket.on('all-users', actions.chatUsers.load);
socket.on('add-user', actions.chatUsers.add);
socket.on('user-disconnect', actions.chatUsers.remove);

socket.on('msg', actions.msgs.addMessage);

const store = createStore(combineReducers(reducers));
const dispatch = store.dispatch;

export { actions, store };
