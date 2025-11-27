import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Sparkles } from 'lucide-react';
import { ChatBubble } from './components/ChatBubble';
import { ChatInput } from './components/ChatInput';
import { streamResponse } from './services/geminiService';
import { Message, LoadingState } from './types';
import { INITIAL_GREETING } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: INITIAL_GREETING }
  ]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingState]);

  const handleSend = async (text: string) => {
    const userMsgId = uuidv4();
    const newUserMsg: Message = { id: userMsgId, role: 'user', text };
    
    setMessages(prev => [...prev, newUserMsg]);
    setLoadingState(LoadingState.THINKING);

    const botMsgId = uuidv4();
    setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

    try {
      setLoadingState(LoadingState.STREAMING);
      
      const history = messages.concat(newUserMsg);
      
      await streamResponse(history, text, (chunkText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: chunkText } : msg
        ));
      });

    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, text: "Error: My stupidity circuits are overloaded. Try again.", isError: true } 
          : msg
      ));
    } finally {
      setLoadingState(LoadingState.IDLE);
    }
  };

  const clearChat = () => {
    if (window.confirm("Delete everything? That's the smartest thing you've done all day.")) {
      setMessages([{ id: uuidv4(), role: 'model', text: INITIAL_GREETING }]);
    }
  };

 return (
  <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30">
    
    {/* Decorative Background Elements */}
    <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
    <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

    {/* Main Container */}
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto md:px-6 relative z-10">
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:pt-6 md:pb-4 border-b border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-900/50">
            <Sparkles size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">
              Worst AI
            </h1>
            <p className="text-slate-400 text-xs font-medium tracking-wide mt-1">
              Guaranteed Wrong Answers
            </p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="p-2.5 text-slate-400 hover:text-red-400 transition-colors duration-200 
                     rounded-xl hover:bg-slate-800/50 active:scale-95"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth space-y-2">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.ERROR && (
           <div className="flex items-center gap-3 ml-2 text-slate-500 text-sm animate-pulse px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-emerald-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-1 font-medium tracking-wide">Inventing failure...</span>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Chat Input & Footer */}
      <footer className="p-4 pt-2 md:pb-6">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput 
            onSend={handleSend}
            disabled={loadingState !== LoadingState.IDLE} 
          />
          <div className="mt-4 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
            <p className="text-center text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
              Do not use for homework, surgery, or real life.
            </p>
            <p className="text-center text-emerald-500/50 text-[10px] uppercase tracking-widest font-bold">
              Credits to ciphernichu
            </p>
          </div>
        </div>
      </footer>
    </div>
  </div>
);
};

export default App;