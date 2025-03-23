import { useEffect, useState } from 'react';
import { User } from 'lucide-react';

const TypingIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return isVisible ? (
    <div className="flex items-start mb-4 animate-fade-in">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
        <User size={14} className="text-muted-foreground" />
      </div>
      <div className="ml-2 message-bubble-ai p-3 max-w-[80%] shadow-sm">
        <div className="flex space-x-1 h-4 items-center">
          <div className="w-2 h-2 rounded-full bg-current animate-dot-bounce-1"></div>
          <div className="w-2 h-2 rounded-full bg-current animate-dot-bounce-2"></div>
          <div className="w-2 h-2 rounded-full bg-current animate-dot-bounce-3"></div>
        </div>
      </div>
    </div>
  ) : null;
};

export default TypingIndicator;
