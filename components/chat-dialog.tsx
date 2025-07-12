'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ChatDialogProps {
  selectedText: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSendMessage: (message: string, selectedText: string) => Promise<string>;
  onRewrite: (instructions: string, selectedText: string) => Promise<string>;
}

export function ChatDialog({ selectedText, position, onClose, onSendMessage, onRewrite }: ChatDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
        setMessage('');
        setResponse('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const determineAction = (userInput: string): 'chat' | 'rewrite' => {
    const rewriteKeywords = [
      'rewrite', 'rephrase', 'change', 'modify', 'edit', 'improve', 
      'make it', 'update', 'revise', 'reword', 'restructure', 'fix',
      'make this', 'turn this into', 'convert', 'transform'
    ];
    
    const lowerInput = userInput.toLowerCase();
    return rewriteKeywords.some(keyword => lowerInput.includes(keyword)) ? 'rewrite' : 'chat';
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const action = determineAction(message);
      const responseText = action === 'chat' 
        ? await onSendMessage(message, selectedText)
        : await onRewrite(message, selectedText);
      setResponse(responseText);
    } catch (error) {
      console.error('Error processing request:', error);
      setResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!position) return null;

  // Calculate if dialog should appear above or below the selection
  const dialogHeight = 300; // Approximate height of the dialog
  const dialogWidth = 400; // Approximate width of the dialog
  const margin = 20; // Minimum margin from viewport edges
  
  const shouldRenderAbove = position.y + dialogHeight > window.innerHeight - margin;
  
  const dialogStyle = {
    left: Math.max(
      margin,
      Math.min(position.x - dialogWidth / 2, window.innerWidth - dialogWidth - margin)
    ),
    top: shouldRenderAbove 
      ? Math.max(margin, position.y - dialogHeight - 10) // Above the selection
      : Math.min(position.y, window.innerHeight - dialogHeight - margin), // Below the selection
  };

  return (
    <div
      ref={dialogRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-xs"
      style={dialogStyle}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Chat with Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Ask a question or provide rewrite instructions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !message.trim()}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
          </div>

          {response && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-900">{response}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 