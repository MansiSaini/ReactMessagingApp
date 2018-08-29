import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalMessages: [],
      currentConvo: [],
      searchValue: '',
      userInput: '',
      userName: '',
      disabled: true
    }
    this.searchChats = this.searchChats.bind(this);
  }
    
  componentDidMount() {
    axios.get('https://sec.meetkaruna.com/api/v1/conversations?user_id=MansiSaini')
      .then(res => {
        this.setState({
          totalMessages: res.data.data
        });
      });
  }

  render() {
    const messagesMap = this.state.totalMessages.map((item, key) => {
      return (
          <div key={key} className="messagesContainer" onClick={() => this.getCurrentConversation(item.uuid, item.name)}>
            <div className="avatarIcon"/>
            <div className="userInfo">
              <div className="userName">{item.name}</div>
              <div className="textPreview">{item.last_message.body ? item.last_message.body : item.last_message}</div>
            </div>
            {item.unread ? <div className="unreadMessagesBubble">{item.unread}</div> : ''}
          </div>
      );
    });

    return (
      <div className="App">
        <div className="leftContainer">
          <div className="utilsDiv">
            <input className="searchBar" placeholder="Search" 
                    value={this.state.searchValue}
                    onChange={e => this.setState({searchValue: e.target.value})} 
                    onKeyPress = {this.searchChats}/>
            <div className="deleteBtn">
              <i className="fa fa-trash-o fa-2x" aria-hidden="true"/>
            </div>
            <div className="createNewBtn"
                  onClick={() => this.composeMessage()}>
              <i className="fa fa-pencil-square-o fa-2x" aria-hidden="true"/>
            </div>
          </div>
          {messagesMap}
        </div>
        <div className="rightContainer">
          <div className="currentChatDiv">
            <div className="currentUserDiv">
              <div className="currentUser">
              {!this.state.isNewMessage ? this.state.userName : 
                <input className='newMessage' placeholder='Enter Name Here'
                        value={this.state.userName}   
                        onChange={e => this.setState({userName: e.target.value})}/>}
              </div>
              <div className="lastActive">
                {this.state.userName ? 'Last Active: a minute ago' : ''}
              </div>
            </div>
            <div className="settingsIcon">
              <i className="fa fa-cogs fa-lg" aria-hidden="true"/>
            </div>
          </div>
          <div className="chatDiv">
            {this.displayConversation(this.state.currentConvo)}
          </div>
           <div style={this.state.disabled ? {pointerEvents: 'none'} : {pointerEvents: ''}} className="inputBarContainer">
              <input className="inputBox" value={this.state.userInput}
                    onChange={e => this.setState({userInput: e.target.value})}
                    placeholder={this.state.placeholder}/>
              <div className="sendBtn" onClick={() => this.addInput()}>Send</div>
           </div>
        </div>
      </div>
    );
  }

  getCurrentConversation(uuid, name) {
    axios.get('https://sec.meetkaruna.com/api/v1/conversations/' + uuid + '?user_id=MansiSaini')
      .then(res => {
        this.setState({
          currentConvo: res.data.data.messages
        });
    });
    this.setState({
      disabled:false,
      userName: name
    });
  }

  displayConversation(conversations) {
    if(conversations.length) {
      const display = conversations.map((item, key) => {
        return (
          <div key={key} className="speech-bubble-container">
              <div className={this.getDirection(item.direction)}>
              {item.body}
              <span className="timestamp">{this.formatDate(item.created_at)}</span>
              </div>
          </div>
        );
      });
      return (
        <div>
          {display}
        </div>
      );
    } else {
        if(!this.state.isNewMessage) {
          return (
            <div className="noConvos">Select a conversaton to get started!</div>
          );
        }
      }
  }

  formatDate(date) {
    if(date === 'now') {
      return 'now'
    } else {
      let stamp = date.split('');
      let d = stamp[12] + stamp[13] + stamp[14] + stamp[15];
      return d;
    }
  }

  composeMessage() {
    this.setState({
      isNewMessage: true,
      placeholder: 'Start typing message here',
      disabled: false
    });
  }

  searchChats(e) {
   if(e.key === 'Enter') {
    let convos = this.state.totalMessages;
    let value = this.state.searchValue;
    convos.forEach(function(m) {
      if(m.name === value) {
        this.setState({
          totalMessages: [m]
        });
      }
    }.bind(this));
   }
  }

  addInput() {
      let val = this.state.userInput
      let obj = {
        body: val,
        created_at: 'now',
        direction: 'outgoing',
        uuid: ''
      };
      this.setState({ 
        currentConvo: [...this.state.currentConvo, obj]
      });
  }
  
  getDirection(direction) {
    return direction === 'incoming' ? 'speech-bubble-left' : 'speech-bubble-right';
  }
}

export default App;
