import { useState, useRef } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Head from "next/head";
import { createParser } from "eventsource-parser";
import Navbar from "@/components/Navbar";

export default function Home() {
  // const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are Nixie!! An AI created by the organization #codEasy" },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const messageContainerRef = useRef(null);

  const API_URL = "https://api.openai.com/v1/chat/completions";

  const sendRequest = async () => {
    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setUserMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: updatedMessages,
          stream: true,
        }),
      });

      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);

          // Scroll to the bottom of the container
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
          }
        } else {
          return "";
        }
      });

      // eslint-disable-next-line
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    } catch (error) {
      console.error("error");
      window.alert("Error:" + error.message);
    }
  };

  return (
    <>
      <Head>
        <title>#Nixie - Your friendly AI</title>
      </Head>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-y-scroll" ref={messageContainerRef}>
          <div className="w-full max-w-screen-md mx-auto p-8">
            {messages
              .filter((message) => message.role !== "system")
              .map((message, index) => (
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
            className="rounded-md border text-lg p-4 flex-1 rows={1}"
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
