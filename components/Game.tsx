import { useState, useEffect, PropsWithChildren } from "react";
import { supabase } from "lib/supabase";
import { Session } from "@supabase/auth-helpers-react";
import EndGame from "@/components/EndGame";
import { Chat } from "@/components/Chat/Chat";
import { Message as NewMessage, Role } from "@/types";
import Instructions from "./Instructions";
import { attemptsAllowed } from "@/utils/attempts";

const useNewChat = true;

type Message = {
  text: string;
  sender: "user" | "server";
};

const Game = ({ session }: { session: Session }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [userSecret, setUserSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [level, setLevel] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleFormSubmit();
  };
  const handleFormSubmit = async (nextText?: string) => {
    // Send input text to server for processing
    setLoading(true);
    await fetch("/api/reverse-text", {
      method: "POST",
      body: JSON.stringify({ text: nextText || inputText }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }
        return res.json();
      })
      .then((res) => handleResponse(res, nextText))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };
  const handleSend = ({ content }: NewMessage) => {
    setInputText(content);
    handleFormSubmit(content);
  };
  const handleResponse = (response: any, nextText?: string) => {
    const reversedText = response.output;
    // Add user message to chat box
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: nextText || inputText, sender: "user" },
    ]);

    // Add server message to chat box
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: reversedText, sender: "server" },
    ]);

    if (response.success) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "you got me! proceeding to the next stage...",
          sender: "server",
        },
      ]);
      setUserSecret(response.secret);
    }

    updateScoreUI();
    // Clear input field
    setInputText("");
  };

  const updateScoreUI = async () => {
    const { data, error } = await supabase
      .from("games")
      .select("level, attempts")
      .eq("user_id", session.user.id);
    if (error) {
      console.log(error);
    } else {
      if (data.length != 0) {
        setLevel(data[0].level);
        setAttempts(data[0].attempts);
      }
    }
  };

  useEffect(() => {
    // Update the document title using the browser API
    updateScoreUI();
  });
  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.altKey) {
      event.preventDefault();
      handleFormSubmit();
    }
  };
  return (
    <div className="bg-white flex flex-col flex-1 rounded-lg w-full pt-5 pb-2">
      <div className="flex flex-row justify-between pb-2">
        <div>
          <span className="font-sans text-xl pr-2">Level:</span>
          <span className="font-sans text-xl">{level}/3</span>
        </div>
        <div>
          <span className="font-sans text-xl pr-2">Attempts:</span>
          <span className="font-sans text-xl">
            {attempts}/{attemptsAllowed}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-l pr-2 font-bold">
          {userSecret
            ? `The secret code the model is hiding from you is '${userSecret}'`
            : `Try prompting the model`}
        </h3>
        <Instructions />
      </div>
      {attempts > attemptsAllowed || level > 3 ? (
        <EndGame
          Won={level > 3 && attempts <= attemptsAllowed}
          Attempts={attempts}
          Level={level}
        />
      ) : useNewChat ? (
        <Chat
          messages={mapOldMessagesToNew(messages)}
          loading={loading}
          onSend={handleSend}
        />
      ) : (
        <ChatBox
          messages={messages}
          handleSubmit={handleSubmit}
          inputText={inputText}
          loading={loading}
          handleTextareaKeyDown={handleTextareaKeyDown}
          setInputText={setInputText}
        />
      )}
    </div>
  );
};

export default Game;

function mapOldMessagesToNew(messages: Message[]): NewMessage[] {
  return messages.map((message) => ({
    role: mapRoleToNew(message.sender),
    content: message.text,
  }));
}

function mapRoleToNew(role: "user" | "server"): Role {
  return role === "user" ? "user" : "assistant";
}

const ChatBox = ({
  messages,
  handleSubmit,
  inputText,
  loading,
  handleTextareaKeyDown,
  setInputText,
}: PropsWithChildren<{
  messages: any;
  handleSubmit: any;
  inputText: any;
  loading: boolean;
  handleTextareaKeyDown: any;
  setInputText: any;
}>) => {
  return (
    <div className="h-full flex flex-col border">
      <div className="flex-grow h-full max-h-screen overflow-y-auto p-5">
        <ul className="space-y-2">
          {messages.map((message: any, index: number) => (
            <li
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xl px-4 py-2 rounded shadow ${
                  message.sender === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="block">{message.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="flex h-24">
        <div className="flex flex-row h-24 w-full border rounded-lg focus:outline-none focus:border-blue-500">
          <textarea
            value={inputText}
            className={`block w-full p-2 text-gray-700 resize-none h-24 overflow-y-auto ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
            placeholder="Type your message here..."
            rows={1}
            onKeyDown={handleTextareaKeyDown}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className={`bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 ${
              loading ? "cursor-wait" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16 8 8 0 000 16zM2.05 15.458A9.966 9.966 0 004 20h4a7.96 7.96 0 01-2.97-2.97l-2.98-2.573zM20 12a8 8 0 01-8 8v-4a4 4 0 004.783-3.783L20 12z"
                ></path>
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
