import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Smile, Mic, Send } from 'lucide-react'; 
import { debounce } from '@/utils/formatters';
import { useThemeStore } from '@/store/themeStore';
import EmojiPicker, { Theme as EmojiPickerTheme } from 'emoji-picker-react'; 

const MAX_CHARS = 500;

type SpeechRecognitionType = {
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
};

type SpeechRecognitionEvent = {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
};

declare global {
  interface Window {
    SpeechRecognition: typeof globalThis.SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof globalThis.SpeechRecognition | undefined;
  }
}

const ChatInput: React.FC = () => {
  const { addMessage, setTyping, editingMessage, updateMessageContent, clearEditingMessage } =
    useChatStore(); 
  const { theme } = useThemeStore();
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false); 
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null); 
  const emojiPickerRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; 
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
        }
        setMessage(transcript); 
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setMessage(''); 
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false); 
  };

 
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content);
      inputRef.current?.focus();
    }
  }, [editingMessage]);

 
  const charCount = message.length;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isAtLimit = charCount >= MAX_CHARS;
  
  
  const debouncedTypingIndicator = useRef(
    debounce((isTyping: boolean) => {
      setTyping(isTyping);
    }, 500)
  ).current;
  
  
  useEffect(() => {
    if (message.length === 0) {
      debouncedTypingIndicator(false);
    }
    return () => {
      debouncedTypingIndicator(false);
    };
  }, [message, debouncedTypingIndicator]);
  

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);
  
  
  const handleSendMessage = () => {
    if (!message.trim() || isAtLimit) return;
  
    if (editingMessage) {
      updateMessageContent(editingMessage.id, message.trim());
      clearEditingMessage();
    } else {
      addMessage({
        content: message.trim(),
        sender: 'user',
      });
    }
  
    setMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-3 border-t border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-end space-x-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={editingMessage ? 'Edit your message...' : 'Message...'}
            className="w-full border rounded-lg px-4 py-3 max-h-32 focus:outline-none focus:ring-1 focus:ring-primary resize-none bg-background"
            style={{ paddingRight: '3rem' }}
            maxLength={MAX_CHARS}
            rows={1}
          />
          
          <div 
            className={`absolute right-6 bottom-2 text-xs ${ 
              isNearLimit 
                ? isAtLimit 
                  ? 'text-red-500' 
                  : 'text-yellow-500' 
                : 'text-gray-500'
            }`}
          >
            {`${charCount}/${MAX_CHARS}`}
          </div>
        </div>
      </div>

      {isAtLimit && (
        <div className="text-xs text-red-500 whitespace-nowrap mt-2">
          Character limit exceeded. You cannot send the message.
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <button
            className={`p-1.5 rounded relative ${
              isListening ? 'bg-muted text-foreground' : 'text-muted-foreground'
            } hover:bg-muted hover:text-foreground transition-colors`}
            onClick={handleMicClick}
            title={isListening ? 'Stop Listening' : 'Start Listening'}
          >
            <Mic size={18} />
            {isListening && (
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-primary animate-pulse">
                Listening...
              </div>
            )}
          </button>
          <button
            className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => setShowEmojiPicker((prev) => !prev)} 
          >
            <Smile size={18} />
          </button>
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef} 
              className="absolute bottom-12 left-0 z-10"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={theme === 'dark' ? ('dark' as EmojiPickerTheme) : ('light' as EmojiPickerTheme)} 
              />
            </div>
          )}
        </div>
        <button
          className="p-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none"
          onClick={handleSendMessage}
          disabled={!message.trim() || isAtLimit}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
