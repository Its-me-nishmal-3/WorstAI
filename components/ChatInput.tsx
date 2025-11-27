import React, { useState, useRef, useEffect } from 'react';
import { Send, ZapOff } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="w-full relative group">
      <div
        className="
          flex items-end gap-3 p-2 pl-4 pr-2 rounded-3xl
          bg-slate-900/80 backdrop-blur-xl border border-slate-700/50
          focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]
          transition-all duration-300 ease-out shadow-xl
        "
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled
              ? 'Generating nonsense...'
              : 'Ask me something stupid...'
          }
          className="
            w-full bg-transparent resize-none outline-none
            text-base text-slate-100 placeholder-slate-500
            py-3 min-h-[48px] max-h-[140px]
          "
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!input.trim() || disabled}
          className={`
            w-10 h-10 mb-1 rounded-full flex items-center justify-center transition-all duration-300
            ${
              !input.trim() || disabled
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 hover:rotate-12 shadow-lg shadow-emerald-500/20'
            }
          `}
        >
          {disabled ? (
            <ZapOff size={18} className="animate-pulse" />
          ) : (
            <Send size={18} className="ml-0.5" />
          )}
        </button>
      </div>
    </form>
  );
};