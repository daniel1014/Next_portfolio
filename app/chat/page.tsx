'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Send, Sparkles, MessageCircle, Loader2, Bug, Bot, User } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ParticleBackground from '@/components/ParticleBackground';

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

// Reusable welcome text to avoid duplication
const WELCOME_TEXT = `Hello! I'm Daniel's AI assistant. I can help you learn about his professional background, skills, projects, and experience. Feel free to ask me anything about his portfolio!`;

const DEFAULT_SUGGESTED_QUESTIONS = [
  "What are Daniel's main technical skills?",
  "Tell me about Daniel's work experience",
  "What projects has Daniel worked on?",
];

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
  const hasShownWelcomeRef = useRef(false);

  const createWelcomeMessage = (): Message => ({
    text: WELCOME_TEXT,
    sender: 'ai',
    timestamp: new Date(),
  });

  const setWelcomeOnce = useCallback(() => {
    setMessages(prev => {
      if (prev.length === 0 && !hasShownWelcomeRef.current) {
        hasShownWelcomeRef.current = true;
        return [createWelcomeMessage()];
      }
      return prev;
    });
  }, []);

  // Initialize chat once on load and set suggested questions
  const initializeChat = useCallback(async () => {
    try {
      const response = await fetch('/api/chat', { method: 'GET' });
      const data = await response.json();
      
      if (data.suggestedQuestions) {
        setSuggestedQuestions(data.suggestedQuestions);
      }
      
      // Add welcome message if not already present
      setWelcomeOnce();
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setSuggestedQuestions(DEFAULT_SUGGESTED_QUESTIONS);
      // Ensure welcome message exists on failure
      setWelcomeOnce();
      setIsInitialized(true);
    }
  }, [setWelcomeOnce]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show welcome immediately (guarded against duplicates)
    setWelcomeOnce();
    // Initialize chat and get suggested questions
    initializeChat();

    // Safety fallback: ensure a welcome message shows even if GET hangs
    const safetyTimeout = setTimeout(() => {
      setSuggestedQuestions(prev => prev.length ? prev : DEFAULT_SUGGESTED_QUESTIONS);
      setIsInitialized(true);
    }, 4000);

    return () => clearTimeout(safetyTimeout);
  }, [initializeChat, setWelcomeOnce]);

  

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
    <div className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Background layers */}
      <ParticleBackground />

      {/* Glow effects */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500 rounded-full filter blur-[100px] opacity-20"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-20 border-b border-gray-800 backdrop-blur-sm bg-black/30">
        <div className="container mx-auto px-4 py-4 relative flex items-center justify-between">
          {/* Left: Brand with Arrow for Home Navigation */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text transition-colors hover:opacity-80"
            aria-label="Back to Home"
          >
            {/* Arrow icon for better home navigation clarity */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Daniel Wong
          </Link>
          {/* Right: Socials */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/daniel1014/Next_portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-700/30 text-gray-200 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/daniel-chuen-lik-wong/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-purple-600/20 hover:from-cyan-500/30 hover:to-purple-700/30 text-gray-200 transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-3 sm:px-4 pt-24 pb-3 sm:pb-6 flex flex-col min-h-0">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            <MessageCircle className="w-8 h-8" />
            Chat with Daniel&apos;s AI Assistant
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Ask me anything about Daniel&apos;s professional background, skills, projects, and experience. 
            I&apos;m powered by a knowledge graph and can provide detailed insights about his portfolio.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex-1 flex flex-col min-h-0 w-full">
          <div className="bg-gray-900/60 rounded-lg shadow-xl overflow-hidden border border-white/10 flex-1 flex flex-col min-h-0">
            {/* Chat Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
              {!isInitialized ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                </div>
              ) : (
                <>
                  {/* Fallback welcome bubble if no messages yet */}
                  {isInitialized && messages.length === 0 && (
                    <div className="flex items-start gap-3 justify-start">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-blue-300">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="max-w-[85%] sm:max-w-[75%]">
                        <div className="px-4 py-3 rounded-2xl border bg-white/5 text-gray-200 border-white/10 backdrop-blur">
                          <MarkdownRenderer content={WELCOME_TEXT} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-left">
                          {formatTimestamp(new Date())}
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'ai' && (
                        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-blue-300">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                      <div className={`max-w-[85%] sm:max-w-[75%] ${message.sender === 'user' ? 'order-2' : ''}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl border ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500/30 shadow-[0_8px_24px_rgba(59,130,246,0.25)]'
                              : 'bg-white/5 text-gray-200 border-white/10 backdrop-blur'
                          }`}
                        >
                          {message.sender === 'user' ? (
                            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                          ) : (
                            <div className="relative">
                              <MarkdownRenderer content={message.text} />
                              {message.isStreaming && (
                                <div className="inline-flex items-center ml-2 align-middle">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-xs text-gray-500 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                      {message.sender === 'user' && (
                        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 backdrop-blur px-3 py-2 rounded-2xl">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
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
                      className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-200 px-3 py-1 rounded-full transition-colors duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-700 p-3 sm:p-4 pb-[env(safe-area-inset-bottom)]">
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
                  className="p-3 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-blue-500/20"
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
          
          {/* AI safety disclaimer */}
          <div className="mt-6 sm:mt-8 max-w-4xl mx-auto mb-2">
            <div className="text-[11px] sm:text-xs text-gray-400/80 bg-black/20 border border-white/10 rounded-lg p-3 sm:p-4 backdrop-blur">
              <span className="text-gray-300">AI safety notice:</span> Responses are generated by an AI model and may be inaccurate or incomplete. Do not share sensitive information. Use your judgment and verify important details.
            </div>
          </div>

          {/* Debug Panel */}
          <div className="mt-6 sm:mt-8 max-w-4xl mx-auto text-xs">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="mb-4 bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              {showDebug ? 'Hide' : 'Show'} Vector Search Debug Info (for developers only)
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