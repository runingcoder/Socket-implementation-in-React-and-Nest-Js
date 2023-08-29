import { useState, useEffect } from 'react';
import './App.css';
import { io, Socket } from "socket.io-client";
import React from 'react';

function App() {
  const socket = io("http://localhost:3000", {
    withCredentials: true, // Allow sending cookies and credentials
  });
  interface Message {
    name: string;
    text: string;
  }

  const [joined, setJoined] = useState(localStorage.getItem("isLoggedIn") !== null);

const [currentClient, setCurrentClient] = useState(() =>
  localStorage.getItem("isLoggedIn")
    ? localStorage.getItem("isLoggedIn")
    : null);

  const [messageValue, setMessageValue] = useState('');
  const [messages, setMessages] = useState([] as Message[]);
  const [name, setName] = useState('');
  const [typingDisplay, setTyping] = useState('');
  useEffect(() => {
console.log(joined)

    // socket.emit('eventname', payload, response)
    socket.emit('findAllMessages', {}, (response) => {
      setMessages(response);
    });
    // get's new message for updating the value of messages state in the client.
    socket.on('message', (message) => {     
    setMessages((messages) => [...messages, message]);
      console.log(message)
    });
    // sus
    socket.on('typing', ({ name, isTypingStateFromServer }) => {
      if (isTypingStateFromServer) {
        setTyping(`${name} is typing`);
      } else {
        setTyping('');
      }
    });
  }, []);
  // eslint-disable-next-line
  let timeout;
  const emitTyping = (e) => {
    e.preventDefault();
    socket.emit('typing', { isTyping: true });
    timeout = setTimeout(() => {
      socket.emit('typing', { isTyping: false });}, 2000)
   
  }
  // sus

  const JoinAction = (e) => {
    e.preventDefault();
    socket.emit('join', { name: name }, (response) => {
      console.log(response)
      setCurrentClient(response)
      localStorage.setItem('isLoggedIn', response);
      setJoined(true);
      console.log(joined)
    });
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('createMessage', { name: currentClient, text: messageValue }, () => {
      
         });
         setMessageValue('');
  }

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="messages-container">
          {joined ? (
            <>
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <h1>[{message.name} : {message.text}]</h1>
                </div>
              ))}
              <div className="join-container">   
                <form onSubmit={sendMessage}>
                <input
                value={messageValue}
                  type="text"
                  placeholder="Type a message..."
                  onChange={(e) => setMessageValue(e.target.value)}  />
                <button >Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="join-container">
              <h1>Please join first!</h1>
              <input
                
                type="text"
                placeholder="Name..."
                onChange={(e) => setName(e.target.value)}
              />
              <button onClick={JoinAction}>Join</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
