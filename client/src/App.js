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
  const [messages, setMessages] = useState([{ body: "", from: "" }]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  console.log(messages);

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    socket.emit("message", formValues?.message);
    const newMessage = {
      body: formValues?.message,
      from: "me",
    };
    setMessages([newMessage, ...messages]);
    setFormValues({ ...formValues, message: "" });
  };

  useEffect(() => {
    const reciveMessage = (data) => setMessages([data, ...messages]);
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, [messages]);

  return (
    <div className="App">
      <form onSubmit={handlesubmit}>
        <input type="text" name="message" onChange={handleChange} value={formValues.message} />
        <button type="submit" value="Submit">
          Send
        </button>
      </form>

      {messages.map((message, key) => (
        <div key={key}>
          <div>
            {message.from}: {message.body}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
