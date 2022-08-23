import "./App.css";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

//initialize socket
const socket = io("http://localhost:4000");

function App() {
  const [formValues, setFormValues] = useState({
    message: "",
    start: new Date(),
    end: new Date(),
  });
  const [messages, setMessages] = useState([{ body: "text", from: "user1" }]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    socket.emit("message", formValues?.message);
    setFormValues({ ...formValues, message: "" });
  };

  useEffect(() => {
    const reciveMessage = (message) => setMessages({ message });
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, []);

  return (
    <div className="App">
      <form onSubmit={handlesubmit}>
        <input type="text" name="message" onChange={handleChange} value={formValues.message} />
        <button type="submit" value="Submit">
          Send
        </button>
      </form>

      {messages.map((message) => (
        <>
          <div>{message.body}</div>
          <div>{message.from}</div>
        </>
      ))}
    </div>
  );
}

export default App;
