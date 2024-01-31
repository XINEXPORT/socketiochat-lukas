import './App.css'
import io from 'socket.io-client'
import { useState,useEffect } from 'react'

const socket = io.connect('http://localhost:8000')

function App() {
  const [input,setInput] = useState("")
  const [messages,setMessages] = useState([])
  
  const sendMessage = () => {
    let messageArray = [...messages,{message: input, id: socket.id}]
    socket.emit("sendMessage",messageArray)
    setMessages(messageArray)
    setInput("")
  }

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages(data)
    })
  },[socket]) 

  return (
    <div>
      <div id="message-box">
        {messages.map(({message,id}) => {
          let className = id === socket.id ? 'message me' : 'message other'
          return (
            <div className='message-wrapper'>
              <p className={className}>{message}</p>
            </div>
          )
          })}
      </div>
      <input type="text" value={input} placeholder='Message....' onChange={(e) => setInput(e.target.value)}/>
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}

export default App