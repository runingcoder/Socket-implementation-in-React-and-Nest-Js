import { useState, useEffect } from 'react';
import './App.css';
import { io } from "socket.io-client";

function App() {
  const socket = io("http://localhost:3000");

  const [messageValue, setMessageValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState('');
  const [typingDisplay, setTyping] = useState('');

  useEffect(() => {
    // socket.emit('eventname', payload, response)
    socket.emit('findAllMessages', {}, (response) => {
      setMessages(response);
    });
    // get's new message for updating the value of messages state in the client.
    socket.on('message', (message) => {
      console.log(messages)

    setMessages((messages) => [...messages, message]);
      console.log(message)
      console.log(`The messages are :${messages}`)
    });
    // sus
    socket.on('typing', {}, ({ name, typingDisplay }) => {
      if (typingDisplay) {
        setTyping(`${name} is typing`);
      } else {
        setTyping('');
      }
    });
  }, []);
  // eslint-disable-next-line
  let timeout;
  const emitTyping = () => {
    socket.emit('typing', { typingDisplay: true });
    timeout = setTimeout(() => {
    socket.emit('typing', { typingDisplay: false });}, 2000)
   
  }
  // sus

  const JoinAction = () => {
    socket.emit('join', { name: name }, () => {
      setJoined(true);
    });
  }

  const sendMessage = () => {
    socket.emit('createMessage', { text: messageValue }, () => {
      setMessageValue('');
         });
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
              <h1>Typing statusss;;</h1>           
                <h2>{typingDisplay}</h2>
                <input
                  type="text"
                  placeholder="Type a message..."
                  onInput={emitTyping}
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
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
