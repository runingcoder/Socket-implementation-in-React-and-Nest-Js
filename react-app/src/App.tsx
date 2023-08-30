import { useState, useEffect } from 'react';
import './App.css';
import { io, Socket } from "socket.io-client";
import React from 'react';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  interface Message {
    name: string;
    text: string;
  }

  const [joined, setJoined] = useState(localStorage.getItem("isLoggedIn") !== null);
  const [currentClient, setCurrentClient] = useState(() =>
    localStorage.getItem("isLoggedIn")
      ? localStorage.getItem("isLoggedIn")
      : null);
  const [click, setClick] = useState(false)
  const [messageValue, setMessageValue] = useState('');
  const [messages, setMessages] = useState([] as Message[]);
  const [joinName, setName] = useState('');
  const [typingDisplay, setTyping] = useState('');

  const toggleClick = () => {

    console.log("The typig dispolay from onClick is ", typingDisplay)
    setClick(!click);
  }


  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      withCredentials: true, // Allow sending cookies and credentials
    });
    setSocket(newSocket);


    // socket.emit('eventname', payload, response)
    newSocket.emit('findAllMessages', {}, (response) => {
      setMessages(response);
    });
    // get's new message for updating the value of messages state in the client.
    newSocket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
      console.log(message)
    });
  // this is not working, why isn't the isTypingStateFromServer being achiieved here from the server?
  // so, it's alwys showing false and displaying the else condition.
    newSocket.on('type', ({ name, isTypingStateFromServer }) => {
      if (isTypingStateFromServer === true) { 
        setTyping(`${name} is typing`);
       }
      else {
         setTyping('Its so silent here')
         }
    });
    return () => {
      // Clean up the WebSocket connection when component unmounts
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log("Current typing display: ", typingDisplay);
  }, [typingDisplay]);
  // eslint-disable-next-line
  let timeout;
  const emitTyping = () => {
    clearTimeout(timeout);
    socket?.emit('typing', { isTyping: true });
    timeout = setTimeout(() => {
      socket?.emit('typing', { isTyping: false });
    }, 2000)
  }
  // sus

  const JoinAction = (e) => {
    e.preventDefault();
    socket?.emit('join', { name: joinName }, (response) => {
      console.log(response)
      setCurrentClient(response)
      localStorage.setItem('isLoggedIn', response);
      setJoined(true);
    });
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket?.emit('createMessage', { text: messageValue }, () => {

    });
    setMessageValue('');
  }

  return (
    <div className="chat">
      <div className="chat-container">
        <div className="messages-container">
          <button onClick={toggleClick}>Click me!!</button>



          {joined ? (
            <>
              {messages.map((message, index) => (
                <div key={index} className="message">
                  <h1>[{message.name} : {message.text}]</h1>
                </div>
              ))}
              <div className="join-container">
                <h1>Typing statusss;;</h1>
                <h2>{typingDisplay}</h2>

                <form onSubmit={sendMessage}>
                  <input
                    value={messageValue}
                    type="text"
                    onInput={emitTyping}
                    placeholder="Type a message..."
                    onChange={(e) => setMessageValue(e.target.value)} />
                  <button >Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="join-container">
              <h1>Please join first!</h1>
              <input
                required
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
