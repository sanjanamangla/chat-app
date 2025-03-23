import { aiResponses } from '@/lib/mockData';
import { useState, useCallback } from 'react';

const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected] = useState(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sendMessage = useCallback((message: string) => {
    if (!isConnected) return;

    setMessages((prevMessages) => [...prevMessages, message]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      const aiMessage = aiResponses[message] ?? "I'm sorry, I don't understand the message.";
      setMessages((prevMessages) => [...prevMessages, `AI Response: ${aiMessage}`]);
    }, 2000);
  }, [isConnected]);

  return { messages, sendMessage, isTyping, isConnected };
};

export default useWebSocket;
