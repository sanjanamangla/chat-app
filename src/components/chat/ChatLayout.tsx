import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import Header from "@/components/layout/Header";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatInput from "@/components/chat/ChatInput";
import { Menu, Plus, Search, Trash } from "lucide-react";

const ChatLayout: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    createConversation,
    switchConversation,
    deleteConversation,
    isTyping,
  } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId
  );
  const messages = activeConversation?.messages ?? [];
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  useEffect(() => {
    if (!activeConversationId && conversations.length === 0) {
      createConversation();
    }
  }, [activeConversationId, conversations, createConversation]);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      {isSidebarVisible && (
        <aside className="w-64 bg-background p-4 border-r border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 w-full">
              <Search size={14} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-3/4 p-1 rounded border border-border bg-white dark:bg-background focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              />
              <button
                className="p-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={createConversation}
                title="New Conversation"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          <ul className="space-y-1">
            {filteredConversations.map((conv) => (
              <li
                key={conv.id}
                className={`p-1 rounded cursor-pointer ${
                  conv.id === activeConversationId
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
                onClick={() => switchConversation(conv.id)}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-medium truncate ${
                      conv.id === activeConversationId
                        ? "text-white"
                        : "text-gray-800 dark:text-gray-300"
                    }`}
                    style={{ padding: "0.1rem 0.4rem" }}
                  >
                    {conv.name}
                  </span>
                  <button
                    className="p-1.5 rounded-full text-red-500 hover:text-red-700 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    title="Delete Conversation"
                  >
                    <Trash
                      size={18}
                      className="fill-red-500 hover:fill-red-700"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      )}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto bg-background relative">
          <button
            className="absolute top-4 left-4 p-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-10"
            onClick={() => setIsSidebarVisible((prev) => !prev)}
            title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          >
            <Menu size={14} />
          </button>
          <div className="container max-w-4xl mx-auto p-4 pb-16">
            <div className="space-y-2">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatLayout;
