import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { gemini } from '../lib/api';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Pill,
  HeartPulse,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I am your MediLens Clinical AI Assistant. I can help explain medication dosages, analyze potential prescription interactions, and answer general health inquiries. How can I assist your health regimen today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef(null);

  const promptSuggestions = [
    'Are there interactions between Aspirin & Lisinopril?',
    'What should I do if I missed a morning dose?',
    'Explain the common side effects of Metformin',
    'Food restrictions when taking Atorvastatin'
  ];

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (customPrompt) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: textToSend.trim(),
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      let aiResponseContent = await gemini.chat(updatedMessages);

      // Clean redundant markdown formatting for clean reading
      aiResponseContent = aiResponseContent
        .replace(/^[#]{1,6}\s*/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm having a brief issue reaching the clinical knowledge base. Please check your network or try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('AI assistant connection interrupted');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        content: 'Conversation cleared. How can I help you with your prescriptions or health routine?',
        timestamp: new Date()
      }
    ]);
    toast.info('Chat history reset');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Clinical AI Health Assistant
            </h1>
            <Badge variant="secondary" className="gap-1 font-semibold text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              Gemini Powered
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Evidence-informed consultation on medications, adherence, and physiological markers.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetChat}
          className="rounded-xl text-xs font-semibold gap-1.5 h-8 self-start sm:self-auto border-border/60"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Chat
        </Button>
      </div>

      {/* Main Chat Card */}
      <Card className="border-border/70 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" ref={scrollAreaRef}>
          {messages.map((message) => {
            const isUser = message.type === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[78%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 shadow-2xs ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-tr from-secondary to-accent text-white'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble Container */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-tr-xs shadow-xs font-medium'
                        : 'bg-muted/70 text-foreground border border-border/60 rounded-tl-xs shadow-2xs backdrop-blur-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <p
                    className={`text-[10px] text-muted-foreground/70 px-1 tabular-numbers ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing wave indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-secondary to-accent text-white shrink-0 shadow-2xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-xs bg-muted/60 border border-border/50 flex items-center space-x-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
              </div>
            </div>
          )}

          <div ref={lastMessageRef} />
        </CardContent>

        {/* Suggestion Pills */}
        <div className="px-4 py-2 border-t border-border/40 bg-muted/10 overflow-x-auto flex gap-2 no-scrollbar">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-xl border border-border/60 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap transition-[background-color,transform] duration-120 active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-border/60 bg-card/60 backdrop-blur-md">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about medications, dosages, food interactions, or symptoms..."
              disabled={isTyping}
              className="h-11 rounded-xl text-xs sm:text-sm pl-4"
            />
            <Button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="h-11 px-5 rounded-xl gap-1.5 font-semibold shrink-0 shadow-xs"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3 text-secondary" />
            AI advice is informational. Consult your licensed healthcare provider for acute medical emergencies.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
