"use client"
// src/components/ChatBot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Camera, Shield, Eye, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your Security Surveillance System assistant. I can help you understand our behavior detection, weapon detection, face recognition, and video processing capabilities. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Sidebar */}
      <div className={`fixed right-0 bottom-0 h-[700px] w-96 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'hidden'
      } shadow-2xl`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <div>
                  <h1 className="text-lg font-bold">Rakshak-AI</h1>
                  <p className="text-xs text-gray-400">AI-powered security support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* System Features Banner */}
            <div className="mt-3 grid grid-cols-2 gap-1">
              <div className="flex items-center space-x-1 bg-blue-600 px-2 py-1 rounded text-xs">
                <Eye className="w-3 h-3" />
                <span>Behavior</span>
              </div>
              <div className="flex items-center space-x-1 bg-red-600 px-2 py-1 rounded text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Weapons</span>
              </div>
              <div className="flex items-center space-x-1 bg-purple-600 px-2 py-1 rounded text-xs">
                <User className="w-3 h-3" />
                <span>Faces</span>
              </div>
              <div className="flex items-center space-x-1 bg-green-600 px-2 py-1 rounded text-xs">
                <Camera className="w-3 h-3" />
                <span>Video</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm leading-relaxed">
                        {formatMessage(message.content)}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about security features..."
                className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-2 grid grid-cols-2 gap-1">
              <button
                onClick={() => setInputValue('How does behavior detection work?')}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded border border-gray-600 truncate"
                disabled={isLoading}
              >
                Behavior
              </button>
              <button
                onClick={() => setInputValue('Explain weapon detection features')}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded border border-gray-600 truncate"
                disabled={isLoading}
              >
                Weapons
              </button>
              <button
                onClick={() => setInputValue('How does face recognition work?')}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded border border-gray-600 truncate"
                disabled={isLoading}
              >
                Faces
              </button>
              <button
                onClick={() => setInputValue('What video formats are supported?')}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded border border-gray-600 truncate"
                disabled={isLoading}
              >
                Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatBot;