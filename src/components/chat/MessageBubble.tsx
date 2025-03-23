import React, { useState, useEffect } from "react";
import { User, Edit3 } from "lucide-react";
import { Message } from "@/types";
import { formatMessageContent } from "@/utils/formatters";
import { formatTimestamp } from "@/lib/mockData";
import { useChatStore } from "@/store/chatStore";
import useWebSocket from "@/hooks/use-webSocket";

interface MessageBubbleProps {
  message: Message;
  showTimestamp?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showTimestamp = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { setEditingMessage, isTtsEnabled } = useChatStore();
  const isUser = message.sender === "user";
  const { isConnected } = useWebSocket();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (message.sender === "ai" && isTtsEnabled) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  }, [message, isTtsEnabled]);

  const renderTicks = () => {
    if (isUser) {
      return isConnected ? "✔✔" : "✔";
    }
    return null;
  };

  return (
    <div
      className={`flex items-start mb-4 ${isUser ? "justify-end" : ""} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } transition-all duration-300 ease-in-out`}
    >
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          <User size={14} className="text-muted-foreground" />
        </div>
      )}

      <div
        className={`message-bubble ${isUser ? "mr-2" : "ml-2"} ${
          isUser ? "message-bubble-user" : "message-bubble-ai"
        } p-3 max-w-[80%] shadow-sm relative`}
      >
        <div className="pr-6">
          <div
            className="text-sm text-balance break-words"
            dangerouslySetInnerHTML={{
              __html: formatMessageContent(message.content),
            }}
          />
        </div>
        {showTimestamp && (
          <div
            className={`flex items-center mt-1 text-xs space-x-1 ${
              isUser ? "justify-end" : ""
            }`}
          >
            <span
              className={`${
                isUser
                  ? "text-primary-foreground/70 text-right"
                  : "text-muted-foreground"
              } block w-full pr-2`}
            >
              {formatTimestamp(message.timestamp)}
            </span>
            {isUser && <span>{renderTicks()}</span>}
          </div>
        )}
        {isUser && (
          <button
            className="absolute top-2 right-2 text-primary-foreground hover:text-primary transition-colors"
            onClick={() => setEditingMessage(message)}
            title="Edit Message"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          <User size={14} className="text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
