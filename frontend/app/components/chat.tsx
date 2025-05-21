import { useState, useRef, useEffect, ChangeEvent } from "react";
import { ChatMessage } from "../types";

interface ChatSectionProps {
  messages: ChatMessage[];
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatSection = ({
  messages,
  inputMessage,
  onInputChange,
  onSendMessage,
  isLoading = false,
}: ChatSectionProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoadingState) {
      setIsLoadingState(true);
      onSendMessage(inputMessage);
      setIsLoadingState(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md h-full flex flex-col bg-white">
      <h2 className="text-xl font-semibold mb-4">AI Fitness Coach</h2>

      <div className="flex-grow overflow-y-auto mb-4 p-4 bg-gray-50 rounded min-h-[400px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 max-w-[70%] rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <p className="break-words">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoadingState && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
        <textarea
          value={inputMessage}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoadingState}
          className="flex-grow p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-[100px]"
          rows={1}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoadingState}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingState ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            "Send"
          )}
        </button>
      </form>
    </div>
  );
};