import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex gap-3 ${message.role === 'assistant' ? 'bg-gray-50' : ''} p-4 rounded-lg`}>
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
        {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className="flex-1">
        <ReactMarkdown className="prose max-w-none">
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};