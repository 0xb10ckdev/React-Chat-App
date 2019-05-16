import React from 'react';
import { setUserListener,
         usersUpdateListener,
         setRoomListener,
         updateRoomsListener,
         serverMessageListener,
         clientMessageEmitter } from '../socketEvents';
import LoginModal from './LoginModal';
import Sidebar from './Sidebar';
import Message from './Message';
import MyMessage from './MyMessage';
import Send from 'react-icons/lib/md/send';

class ChatApp extends React.Component {

  constructor() {
    super();

    this.state = {
      user: null,
      users: [],
      room: null,
      rooms: [],
      messages: [],
      loginModalOpen: true
    };

    setUserListener((user) => {
      this.setState({ user: user });
    });

    usersUpdateListener((users) => {
      this.setState({ users: users });
    });

    setRoomListener((room) => {
      this.setState({ room: room });
    });

    updateRoomsListener((rooms) => {
      this.setState({ rooms: rooms });
    });

    serverMessageListener((message) => {
      if (this.state.messages.length && message.sender === this.state.messages[this.state.messages.length - 1].sender) {
        message.consecutive = true;
      };
      this.setState((prevState) => ({ messages: prevState.messages.concat(message) }));
    });
  }

  closeLoginModal = () => {
    this.setState({ loginModalOpen: false });
  }

  sendMessage = (e) => {
    e.preventDefault();

    const text = e.target.elements.text.value;
    e.target.elements.text.value = '';
    
    clientMessageEmitter(text);
  }

  render() {    
    return (
      <div className="chat-app">
        <LoginModal isOpen={this.state.loginModalOpen} onRequestClose={this.closeLoginModal} />
        <Sidebar 
          user={this.state.user}
          users={this.state.users} 
          rooms={this.state.rooms} 
        />
        <div className="chat-content">
          <div className="topbar">
            <p>{this.state.room}</p>
          </div>
          <div className="messages">
            {this.state.messages.map((message) => {
              if (message.sender === this.state.user.nickname) {
                return <MyMessage message={message} />
              } else {
                return <Message message={message} />
              }
            })}
          </div>
          <div className="chat-input">
            <form onSubmit={(e) => this.sendMessage(e)}>
              <input type="text" name="text" placeholder="Write message..." spellCheck="false" autoFocus/>
              <button><Send color="#8F5DB7" size="24px" /></button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatApp;