import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { User, ChevronLeft, Volume2, VolumeX } from 'lucide-react'; 
import { aiUser } from '@/lib/mockData';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header: React.FC = () => {
  const { isTyping, isTtsEnabled, toggleTts } = useChatStore();

  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button className="rounded-full p-2 hover:bg-muted transition-colors">
          <ChevronLeft size={20} className="text-muted-foreground" />
        </button>
        <div className="flex items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <User size={20} className="text-muted-foreground" />
            </div>
            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${isTyping ? 'bg-amber-400' : 'bg-emerald-500'}`}></span>
          </div>
          <div className="ml-3">
            <h2 className="font-medium text-sm">{aiUser.name}</h2>
            <p className="text-xs text-muted-foreground">{isTyping ? 'Typing...' : 'Online'}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button className="p-2 rounded-full hover:bg-muted transition-colors" onClick={toggleTts} title={isTtsEnabled ? 'Disable TTS' : 'Enable TTS'}>
          {isTtsEnabled ? <Volume2 size={20} className="text-muted-foreground" /> : <VolumeX size={20} className="text-muted-foreground" />}
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
