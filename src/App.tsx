import React, { useState } from 'react';
import { Message } from './types';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { processMessage } from './services/chatService';
import { Bot } from 'lucide-react';

function App() {
  const [chatState, setChatState] = useState<{
    messages: Message[];
    isLoading: boolean;
  }>({
    messages: [{
      role: 'assistant',
      content: "Hello! I'm your health and fitness information assistant. I can help you with general wellness information, BMI calculations, and fitness-related questions. Remember, I'm not a substitute for professional medical advice. How can I help you today?"
    }],
    isLoading: false
  });

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      const response = await processMessage([...chatState.messages, userMessage]);
      const assistantMessage: Message = { role: 'assistant', content: response };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 p-4 flex items-center gap-2">
            <Bot className="text-white" size={24} />
            <h1 className="text-xl font-bold text-white">Health & Fitness Assistant</h1>
          </div>
          
          {/* Chat Messages */}
          <div className="h-[600px] overflow-y-auto p-4 space-y-4">
            {chatState.messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {chatState.isLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                Thinking...
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <ChatInput onSend={handleSendMessage} disabled={chatState.isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;