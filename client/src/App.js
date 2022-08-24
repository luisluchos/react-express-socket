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
      from: "Me",
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
    <div className="h-screen bg-zinc-800 text-red-700 p-10 grid justify-items-center">
      <h1 className="text-2xl font-bold text-blue-800 ">Chat react socket-io</h1>
  
        <div className="grid justify-items-center bg-zinc-600 p-10 w-2/5 ">
          <form onSubmit={handlesubmit} className="mt-10">
            <input
              type="text"
              name="message"
              onChange={handleChange}
              value={formValues.message}
              className=" text-black p-2"
            />
            <button type="submit" value="Submit" className="bg-zinc-700 p-2 text-white">
              Send
            </button>
          </form>
          <ul className="h-80 overflow-y-auto px-4 scrollbar">
            {messages.map((message, key) => (
              <li
                key={key}
                className={`table rounded-lg my-4 p-2 ${
                  message.from === "Me"
                    ? "bg-gradient-to-r from-white to-zinc-500 ml-auto"
                    : "bg-gradient-to-r from-blue-400 to-pink-500"
                }`}
              >
                <p>
                  {message.from}: <span className="text-black">{message.body}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

export default App;
