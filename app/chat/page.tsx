'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatResponse {
  response: string;
  suggestedQuestions: string[];
  context: {
    entities: string[];
    hasRelevantInfo: boolean;
    error?: string;
  };
}

// Chat with CV Page
const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string; content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat and get suggested questions
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const response = await fetch('/api/chat', { method: 'GET' });
      const data = await response.json();
      
      if (data.suggestedQuestions) {
        setSuggestedQuestions(data.suggestedQuestions);
      }
      
      // Add welcome message
      setMessages([{
        text: `Hello! I'm Daniel's AI assistant. I can help you learn about his professional background, skills, projects, and experience. Feel free to ask me anything about his portfolio!`,
        sender: 'ai',
        timestamp: new Date()
      }]);
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setSuggestedQuestions([
        "What are Daniel's main technical skills?",
        "Tell me about Daniel's work experience",
        "What projects has Daniel worked on?"
      ]);
      setIsInitialized(true);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: conversationHistory.slice(-10) // Keep last 10 messages for context
        }),
      });

      const data: ChatResponse = await response.json();
      
      const aiMessage: Message = {
        text: data.response,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (data.suggestedQuestions) {
        setSuggestedQuestions(data.suggestedQuestions);
      }

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: textToSend },
        { role: 'assistant', content: data.response }
      ]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gradient-dark min-h-screen flex flex-col text-gray-300">
      <nav className="bg-gray-800 shadow-lg p-4">
        <div className="container mx-auto">
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold transition duration-300">
            ← Back to Portfolio
          </Link>
        </div>
      </nav>
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400 mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Chat with Daniel's AI Assistant
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ask me anything about Daniel's professional background, skills, projects, and experience. 
            I'm powered by a knowledge graph and can provide detailed insights about his portfolio.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {!isInitialized ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300'
                        }`}>
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-gray-300 p-3 rounded-lg max-w-xs lg:max-w-md">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && (
              <div className="border-t border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Suggested Questions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(question)}
                      disabled={isLoading}
                      className="text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Ask about Daniel's experience, skills, projects..."
                  disabled={isLoading}
                  className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-400 text-gray-300 disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  export default ChatPage;