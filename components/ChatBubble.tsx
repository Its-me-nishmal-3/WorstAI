import React from 'react';
import { Message } from '../types';
import { Bot, User, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`flex w-full mb-6 ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      <div
        className={`flex max-w-[85%] md:max-w-[75%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-end gap-3`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg
            ${isUser 
              ? "bg-emerald-500 text-white" 
              : isError 
                ? "bg-red-500 text-white" 
                : "bg-slate-700 text-emerald-400"
            }`}
        >
          {isUser ? (
            <User size={16} />
          ) : isError ? (
            <AlertTriangle size={16} />
          ) : (
            <Bot size={16} />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`relative px-5 py-3 text-[15px] leading-relaxed shadow-md
            ${isUser 
              ? "bg-emerald-600 text-white rounded-2xl rounded-br-sm" 
              : isError
                ? "bg-red-900/50 text-red-100 border border-red-800/50 rounded-2xl rounded-bl-sm"
                : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-2xl rounded-bl-sm backdrop-blur-sm"
            }`}
        >
          {isError ? (
            <span className="font-semibold text-sm">SYSTEM FAILURE: {message.text}</span>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};