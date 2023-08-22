import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function Home() {

  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([{ role: "system", content: "You are Nixie!! An AI created by the organization #codEasy" }]);
  const [userMessage, setUserMessage] = useState("");

  const API_URL = "https://api.openai.com/v1/chat/completions";


  async function sendRequest() {
    //update the message history

    const newMessage = {role:"user", content:userMessage}
    const newMessages = [
      ...messages,
      newMessage
    ]

    setMessages(newMessages);
    setUserMessage("");

    const response = await fetch(API_URL, {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer '+apiKey,
      },
      body:JSON.stringify({
        "model":"gpt-3.5-turbo",
        "messages":newMessages
      })
    })

    const responseJson = await response.json();
    console.log(responseJson);
    const newBotMessage = responseJson.choices[0].message;
    const newMessages2 = [...newMessages, newBotMessage];
    setMessages(newMessages2);

  }

  return (
    <div className="flex flex-col h-screen">
      <nav className="shadow p-4 flex flex-row justify-between">
        <div className="text-xl font-bold">#Nixie</div>
        <div>
          <input type="password" placeholder="Enter your API key" className="border rounded p-2" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </div>
      </nav>
      <div className="flex-1 overflow-y-scroll">
  <div className="w-full max-w-screen-md mx-auto p-8">
    {messages.filter((message)=>message.role!=="system").map((message, index) => (
      <div key={index} className="m-4">
        <div className="font-bold">{message.role === "user" ? "You":"Nixie"}</div>
        <div className="text-lg prose">
          <ReactMarkdown>
            {message.content}
            </ReactMarkdown>
            </div>
      </div>
    ))}
  </div>
</div>

      <div className="w-full max-w-screen-md mx-auto flex p-8">
        <textarea value={userMessage} onChange={(e)=>setUserMessage(e.target.value)}  className="rounded-md border text-lg p-4 flex-1 rows={1}"/>
        <button onClick={sendRequest} className="border rounded-md text-lg hover:bg-black hover:text-white p-4 ml-4">Send</button>
      </div>
    </div>
  )
}
