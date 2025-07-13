'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Speech {
  id: string;
  speechType: string;
  groomName: string;
  brideName: string;
  relationship: string;
  tone: string;
  length: string;
  speech: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
  userId: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPaneProps {
  onSendMessage: (message: string, selectedText: string) => Promise<string>;
  onRewrite: (instructions: string, selectedText: string) => Promise<string>;
}

export function ChatPane({ 
  onSendMessage, 
  onRewrite
}: ChatPaneProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const action = determineAction(userMessage);
      
      if (action === 'rewrite' && selectedText) {
        const response = await onRewrite(userMessage, selectedText);
        addMessage('assistant', `✅ Text rewritten successfully!\n\n**Original:**\n${selectedText}\n\n**Rewritten:**\n${response}`);
        setSelectedText('');
      } else {
        const response = await onSendMessage(userMessage, selectedText);
        addMessage('assistant', response);
        setSelectedText('');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage('assistant', 'Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const determineAction = (userInput: string): 'chat' | 'rewrite' => {
    const rewriteKeywords = [
      'rewrite', 'rephrase', 'change', 'modify', 'edit', 'improve', 
      'make it', 'update', 'revise', 'reword', 'restructure', 'fix',
      'make this', 'turn this into', 'convert', 'transform'
    ];
    
    const lowerInput = userInput.toLowerCase();
    return rewriteKeywords.some(keyword => lowerInput.includes(keyword)) ? 'rewrite' : 'chat';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="relative w-96 bg-white border-l border-gray-200 flex flex-col h-screen px-4 py-2 top-0">
      <div className="text-lg flex items-center justify-between">
        <span className="font-bold">Chat</span>
      </div>
        
        <div className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <div className="text-lg font-medium mb-2">Welcome to your speech chat!</div>
                <div className="text-sm">
                  Ask questions about your speech, request rewrites, or get suggestions for improvements.
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(message.content)
                    }}
                  />
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Selected Text Display */}
          {selectedText && (
            <div className="border-t border-gray-200 p-3 bg-yellow-50">
              <div className="text-xs text-gray-500 mb-1">Selected text:</div>
              <div className="text-sm text-gray-700 font-medium">
                &ldquo;{selectedText.length > 100 ? selectedText.substring(0, 100) + '...' : selectedText}&rdquo;
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="w-full border-t border-gray-200 mt-auto">
            <div className="space-y-2">
              <Textarea
                placeholder="Ask a question or provide rewrite instructions..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={3}
                className="resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !inputMessage.trim()}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
} 