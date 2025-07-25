'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Send, Sparkles, MessageCircle, Loader2, Bug } from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatResponse {
  response: string;
  suggestedQuestions: string[];
  context: {
    sources: string[];
    sectionsUsed: string[];
    hasRelevantInfo: boolean;
    totalTokens: number;
    error?: string;
  };
  debugInfo?: {
    query: string;
    rawSearchResults: Array<{
      id: string;
      score: number;
      text: string;
      fullText: string;
      metadata: any;
    }>;
    contextUsed: string;
    searchResultsCount: number;
    timestamp: string;
    fallbackUsed?: boolean;
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
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

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

    // Create placeholder AI message for streaming
    const streamingMessage: Message = {
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true
    };
    
    setMessages(prev => [...prev, streamingMessage]);

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

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let receivedMetadata = false;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'metadata' && !receivedMetadata) {
                  // Handle initial metadata
                  if (data.suggestedQuestions) {
                    setSuggestedQuestions(data.suggestedQuestions);
                  }
                  if (data.debugInfo) {
                    setDebugInfo(data.debugInfo);
                    console.log('Vector Search Debug Info:', data.debugInfo);
                  }
                  receivedMetadata = true;
                } else if (data.type === 'chunk') {
                  // Handle streaming content
                  fullResponse = data.fullResponse;
                  
                  // Update the streaming message
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.sender === 'ai' && lastMessage.isStreaming) {
                      lastMessage.text = fullResponse;
                    }
                    return newMessages;
                  });
                } else if (data.type === 'complete') {
                  // Mark streaming as complete
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.sender === 'ai' && lastMessage.isStreaming) {
                      lastMessage.text = data.fullResponse;
                      lastMessage.isStreaming = false;
                    }
                    return newMessages;
                  });
                  
                  // Update conversation history
                  setConversationHistory(prev => [
                    ...prev,
                    { role: 'user', content: textToSend },
                    { role: 'assistant', content: data.fullResponse }
                  ]);
                } else if (data.type === 'error') {
                  // Handle streaming error
                  console.error('Streaming error:', data.error);
                  
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.sender === 'ai' && lastMessage.isStreaming) {
                      lastMessage.text = data.fallbackResponse || 'Sorry, I encountered an error. Please try again later.';
                      lastMessage.isStreaming = false;
                    }
                    return newMessages;
                  });
                }
              } catch (parseError) {
                console.error('Error parsing stream data:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove streaming message and add error message
      setMessages(prev => {
        const newMessages = prev.slice(0, -1); // Remove streaming message
        return [...newMessages, {
          text: 'Sorry, I encountered an error. Please try again later.',
          sender: 'ai',
          timestamp: new Date(),
          isStreaming: false
        }];
      });
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="w-8 h-8" />
            Chat with Daniel&apos;s AI Assistant
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ask me anything about Daniel&apos;s professional background, skills, projects, and experience. 
            I&apos;m powered by a knowledge graph and can provide detailed insights about his portfolio.
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
                          {message.sender === 'user' ? (
                            <p className="whitespace-pre-wrap">{message.text}</p>
                          ) : (
                            <div className="relative">
                              <MarkdownRenderer content={message.text} />
                              {message.isStreaming && (
                                <div className="inline-flex items-center ml-1">
                                  <div className="w-2 h-4 bg-blue-400 animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 ${
                          message.sender === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          {formatTimestamp(message.timestamp)}
                          {message.isStreaming && (
                            <span className="ml-2 text-blue-400">Typing...</span>
                          )}
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

          {/* Debug Panel */}
          <div className="mt-8 max-w-4xl mx-auto">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="mb-4 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              {showDebug ? 'Hide' : 'Show'} Vector Search Debug Info
            </button>

            {showDebug && debugInfo && (
              <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                <h3 className="text-xl font-bold text-blue-400 mb-4">Vector Search Debug Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Query:</h4>
                    <p className="text-gray-400 bg-gray-900 p-2 rounded">{debugInfo.query}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Search Results ({debugInfo.searchResultsCount}):</h4>
                    {debugInfo.rawSearchResults?.length > 0 ? (
                      <div className="space-y-3">
                        {debugInfo.rawSearchResults.map((result: any, index: number) => (
                          <div key={index} className="bg-gray-900 p-3 rounded border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs text-blue-400 font-mono">{result.id}</span>
                              <span className="text-xs text-yellow-400">Score: {result.score.toFixed(4)}</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{result.text}</p>
                            <details className="text-xs text-gray-500">
                              <summary className="cursor-pointer hover:text-gray-400">Show full text and metadata</summary>
                              <div className="mt-2 p-2 bg-gray-800 rounded">
                                <p className="mb-2"><strong>Full Text:</strong></p>
                                <p className="mb-3 text-gray-400">{result.fullText}</p>
                                <p><strong>Metadata:</strong></p>
                                <pre className="text-xs text-gray-400 overflow-x-auto">
                                  {JSON.stringify(result.metadata, null, 2)}
                                </pre>
                              </div>
                            </details>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No search results found</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Context Used for LLM:</h4>
                    <pre className="text-gray-400 bg-gray-900 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {debugInfo.contextUsed || 'No context available'}
                    </pre>
                  </div>

                  {debugInfo.fallbackUsed && (
                    <div className="bg-red-900 border border-red-600 p-3 rounded">
                      <h4 className="text-sm font-semibold text-red-300 mb-2">⚠️ Fallback Response Used</h4>
                      <p className="text-red-200 text-sm">
                        Vector search failed. Error: {debugInfo.error}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Timestamp: {debugInfo.timestamp}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  };

  export default ChatPage;