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
  const [isRewriting, setIsRewriting] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position) {
      setDragPosition(position);
    }
  }, [position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
        setMessage('');
        setResponse('');
        setIsRewriting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-draggable="true"]')) {
      setIsDragging(true);
      const rect = dialogRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragPosition) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep dialog within viewport bounds
        const maxX = window.innerWidth - 400; // dialog width
        const maxY = window.innerHeight - 300; // approximate dialog height
        
        setDragPosition({
          x: Math.max(20, Math.min(newX, maxX)),
          y: Math.max(20, Math.min(newY, maxY)),
        });
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragPosition, dragOffset]);

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
    setIsRewriting(false);
    setResponse('');
    
    try {
      const action = determineAction(message);
      
      if (action === 'rewrite') {
        setIsRewriting(true);
        await onRewrite(message, selectedText);
        setResponse(`✅ Text rewritten successfully!`);
        setIsRewriting(false);
        
        // Close dialog after a short delay to show success
        setTimeout(() => {
          onClose();
          setMessage('');
          setResponse('');
        }, 1500);
      } else {
        const responseText = await onSendMessage(message, selectedText);
        setResponse(responseText);
      }
    } catch (error) {
      console.error('Error processing request:', error);
      setResponse('Sorry, there was an error processing your request.');
      setIsRewriting(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!dragPosition) return null;

  return (
    <div
      ref={dialogRef}
      className={`fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-xs ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: dragPosition.x,
        top: dragPosition.y,
        userSelect: isDragging ? 'none' : 'auto',
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="w-full">
        <CardHeader 
          className="cursor-grab active:cursor-grabbing bg-gray-50 border-b border-gray-200"
          data-draggable="true"
        >
          <CardTitle className="text-lg flex items-center justify-between">
            <span>
              {isRewriting ? 'Rewriting...' : 'Chat with Document'}
            </span>
            <div className="text-xs text-gray-500">Drag to move</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedText && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Selected text:</div>
              <div className="text-sm text-gray-700 font-medium">
                &ldquo;{selectedText.length > 100 ? selectedText.substring(0, 100) + '...' : selectedText}&rdquo;
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Textarea
              placeholder="Ask a question or provide rewrite instructions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isRewriting}
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !message.trim() || isRewriting}
              className="w-full"
            >
              {isLoading ? 'Processing...' : isRewriting ? 'Rewriting...' : 'Submit'}
            </Button>
          </div>

          {response && (
            <div className={`border rounded-lg p-3 ${
              isRewriting 
                ? 'bg-green-50 border-green-200 text-green-900' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className="text-sm">{response}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 