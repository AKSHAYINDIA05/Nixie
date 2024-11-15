import { useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Head from "next/head";

export default function Home() {
  const [messages, setMessages] = useState([{ role: "system", content: "You are Nixie!! An AI created by the organization #codEasy" }]);
  const [userMessage, setUserMessage] = useState("");

  const API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY; // Use the public prefix for client-side access.

  async function sendRequest() {
    if (!API_KEY) {
      alert("API key is missing. Please check your environment configuration.");
      return;
    }

    // Update the message history
    const newMessage = { role: "user", content: userMessage };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setUserMessage("");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: newMessages,
      }),
    });

    const responseJson = await response.json();
    console.log(responseJson);
    const newBotMessage = responseJson.choices[0].message;
    const newMessages2 = [...newMessages, newBotMessage];
    setMessages(newMessages2);
  }

  return (
    <>
      <Head>
        <title>#Nixie - Your friendly AI</title>
      </Head>
      <div className="flex flex-col h-screen">
        <nav className="shadow p-4 flex flex-row justify-between">
          <div className="text-xl font-bold">#Nixie</div>
        </nav>
        <div className="flex-1 overflow-y-scroll">
          <div className="w-full max-w-screen-md mx-auto p-8">
            {messages.filter((message) => message.role !== "system").map((message, index) => (
              <div key={index} className="m-4">
                <div className="font-bold">{message.role === "user" ? "You" : "Nixie"}</div>
                <div className="text-lg prose">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-screen-md mx-auto flex p-8">
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="rounded-md border text-lg p-4 flex-1"
            rows={1}
          />
          <button
            onClick={sendRequest}
            className="border rounded-md text-lg hover:bg-black hover:text-white p-4 ml-4"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
