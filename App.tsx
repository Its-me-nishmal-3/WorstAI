import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Sparkles, AlertCircle } from 'lucide-react';
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
  <div className="flex flex-col h-screen w-full bg-gradient-to-br from-slate-950 via-[#0a0f1e] to-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30 relative">
    
    {/* Main Container */}
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto md:px-0 relative z-10">
      
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 md:py-5 border-b border-slate-800/30 sticky top-0 z-20 bg-slate-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="relative p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 shadow-xl flex items-center justify-center">
              <Sparkles size={20} className="text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Worst AI
              <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-400 font-medium tracking-wider border border-slate-700/50">
                LITE
              </span>
            </h1>
            <p className="text-slate-500 text-xs font-medium tracking-wide">
              Powered by Confidence & Ignorance
            </p>
          </div>
        </div>

        <button 
          onClick={clearChat}
          className="p-2.5 text-slate-400 hover:text-red-400 transition-all duration-200 
                     rounded-xl hover:bg-slate-800/50 active:scale-95 border border-transparent hover:border-red-900/30"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth space-y-4 md:px-8">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.ERROR && (
           <div className="flex items-center gap-3 ml-2 text-slate-500 text-sm animate-pulse px-4 py-2 opacity-80">
            <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-medium tracking-wide text-xs uppercase">Generating nonsense...</span>
          </div>
        )}

        <div ref={messagesEndRef} className="h-2" />
      </main>

      {/* Chat Input & Footer */}
      <footer className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput 
            onSend={handleSend}
            disabled={loadingState !== LoadingState.IDLE} 
          />
          <div className="mt-6 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
              <AlertCircle size={10} />
              <span>Do not trust this AI</span>
            </div>
            <p className="text-center text-emerald-500/40 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-emerald-400 transition-colors">
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