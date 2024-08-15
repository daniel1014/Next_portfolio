'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send } from 'lucide-react';

// Chat with CV Page
const ChatPage = () => {
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([]);
    const [input, setInput] = useState('');
  
    const handleSend = () => {
      if (input.trim() === '') return;
  
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
  
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = generateAIResponse(input);
        setMessages(msgs => [...msgs, { text: aiResponse, sender: 'ai' }]);
      }, 1000);
    };
  
    const generateAIResponse = (question: string): string => {
      // This is a simple simulation. In a real application, you would integrate with an actual LLM API.
      const responses: { [key: string]: string } = {
        'experience': `Daniel has experience as a Graduate Cost and Carbon Intelligence Consultant at AECOM in London, UK, and as a Corporate HSSE Officer at Shell in Hong Kong, China.`,
        'skills': `Daniel's key skills include Python, Machine Learning, SQL, Azure, and PowerBI.`,
        'education': `Daniel has a Master's degree in Computing and Information Systems from Queen Mary University of London.`,
        'projects': `One of Daniel's notable projects is a News Scraping Web App with LLM, developed for a real-world company.`,
        'default': `I'm an AI assistant trained on Daniel's CV. You can ask me about his experience, skills, education, or projects.`
      };
  
      const lowercaseQuestion = question.toLowerCase();
      for (const [key, value] of Object.entries(responses)) {
        if (lowercaseQuestion.includes(key)) {
          return value;
        }
      }
      return responses.default;
    };
  
    return (
      <div className="bg-gradient-dark min-h-screen flex flex-col text-gray-300">
        <nav className="bg-gray-800 shadow-lg p-4">
          <div className="container mx-auto">
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold transition duration-300">← Back to Portfolio</Link>
          </div>
        </nav>
        <div className="flex-grow container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-10 text-blue-400">Chat with Daniel's CV</h1>
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
            <div className="h-96 overflow-y-auto mb-6 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
                    {message.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask about Daniel's experience, skills, etc.`}
                className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:border-blue-400 text-gray-300"
              />
              <button onClick={handleSend} className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition duration-300">
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default ChatPage;