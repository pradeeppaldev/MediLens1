import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide if already on the AI chat page
  if (location.pathname === '/ai/chat' || location.pathname === '/ai-chat') {
    return null;
  }

  const handleClick = () => {
    navigate('/ai/chat');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <Button
        onClick={handleClick}
        aria-label="Open AI Health Assistant"
        className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary via-indigo-600 to-secondary text-white shadow-xl shadow-primary/30 transition-[transform,box-shadow] duration-200 ease-emil-out hover:scale-105 active:scale-95 p-0 flex items-center justify-center border border-white/20"
      >
        <MessageSquare className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white ring-2 ring-background">
          <Sparkles className="h-2.5 w-2.5" />
        </span>
      </Button>
    </div>
  );
};

export default FloatingChatButton;
