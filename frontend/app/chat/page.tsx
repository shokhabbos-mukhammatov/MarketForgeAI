'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Start chat mode if not already started
    if (!chatStarted) {
      setChatStarted(true);
    }

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "Hello! I'm Claude, your AI assistant. I'm here to help you with any questions or tasks you might have. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Maximum height in pixels (about 5 lines)
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, []);

  // Greeting Interface (shown when chat hasn't started)
  if (!chatStarted) {
    return (
      <div className="h-screen flex flex-col relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-indigo-900/20" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-40">
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* Claude AI Logo */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="glass rounded-3xl p-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/20 shadow-2xl">
                  <div className="relative">
                    <Bot size={64} className="text-white mx-auto" />
                    <div className="absolute -top-2 -right-2">
                      <Sparkles size={24} className="text-purple-400 animate-pulse" />
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 blur-xl -z-10 animate-pulse" />
              </div>
            </div>

            {/* Greeting Text */}
            <div className="mb-12 space-y-4">
              <h1 className="text-5xl font-light text-gradient mb-4">
                Hello, I'm Claude
              </h1>
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                Your intelligent AI assistant
              </p>
              <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
                I can help you with writing, analysis, math, coding, creative projects, and much more. What would you like to explore together?
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              {[
                "Help me write an email",
                "Explain quantum physics",
                "Create a workout plan",
                "Debug my code"
              ].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(prompt);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="glass rounded-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200 border border-white/10"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Single Input Field - Fixed at bottom */}
        <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-6 z-20">
          <div className="glass rounded-xl p-3 border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-base font-light resize-none overflow-hidden min-h-[24px] leading-6"
                  rows={1}
                  autoFocus
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  inputText.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Chat Interface (shown after user starts chatting)
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-4 border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-gradient">Claude AI</h1>
                <p className="text-gray-400 text-sm">Your intelligent assistant</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 glass rounded-2xl p-6 border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-4 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`p-3 rounded-full ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30' 
                      : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30'
                  }`}>
                    {message.sender === 'user' ? (
                      <User size={20} className="text-blue-300" />
                    ) : (
                      <Bot size={20} className="text-purple-300" />
                    )}
                  </div>
                  <div className={`max-w-2xl ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`glass rounded-2xl p-4 border ${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/20' 
                        : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/20'
                    } backdrop-blur-sm shadow-lg`}>
                      <p className="text-white leading-relaxed">{message.text}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Single Input Field - Fixed above navigation */}
      <div className="flex-shrink-0 p-6 pt-4 pb-28">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-3 border border-white/20 bg-white/15 backdrop-blur-xl shadow-2xl">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Continue the conversation..."
                  className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-base resize-none overflow-hidden min-h-[24px] leading-6"
                  rows={1}
                  autoFocus
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  inputText.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}