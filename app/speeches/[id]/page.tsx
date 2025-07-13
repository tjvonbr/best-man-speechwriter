'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SpeechSidebar } from '@/components/speech-sidebar';
import { CopyButton } from '@/components/copy-button';
import { ChatDialog } from '@/components/chat-dialog';
import { ChatPane } from '@/components/chat-pane';

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

interface SpeechPageProps {
  params: Promise<{ id: string }>;
}

export default function SpeechPage({ params }: SpeechPageProps) {
  const [speech, setSpeech] = useState<Speech | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [dialogPosition, setDialogPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentSpeechText, setCurrentSpeechText] = useState('');
  const [highlightedText, setHighlightedText] = useState<string | null>(null);

  const id = use(params).id;

  useEffect(() => {
    const fetchSpeech = async () => {
      try {
        const response = await fetch(`/api/speeches/${id}`);
        if (!response.ok) {
          notFound();
        }
        const data = await response.json();
        setSpeech(data.speech);
        setCurrentSpeechText(data.speech.speech);
      } catch (error) {
        console.error('Error fetching speech:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeech();
  }, [id]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      setSelectedText(selectedText);
      
      // Get the position of the selection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setDialogPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + window.scrollY + 10,
      });
    }
  };

  const replaceTextInSpeech = (originalText: string, newText: string) => {
    if (!speech) return;
    
    const updatedSpeechText = currentSpeechText.replace(originalText, newText);
    setCurrentSpeechText(updatedSpeechText);
    
    // Update the speech object as well
    setSpeech(prev => prev ? { ...prev, speech: updatedSpeechText } : null);
    
    // Highlight the new text briefly
    setHighlightedText(newText);
    setTimeout(() => setHighlightedText(null), 3000);
  };

  const handleSendMessage = async (message: string, selectedText: string): Promise<string> => {
    if (!speech) return 'Error: Speech not found';

    const speechContext = `
Speech Type: ${speech.speechType}
Groom: ${speech.groomName}
Bride: ${speech.brideName}
Relationship: ${speech.relationship}
Tone: ${speech.tone}
Length: ${speech.length}
Full Speech: ${currentSpeechText}
    `.trim();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          selectedText,
          speechContext,
          mode: 'chat',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  const handleRewrite = async (instructions: string, selectedText: string): Promise<string> => {
    if (!speech) return 'Error: Speech not found';

    const speechContext = `
Speech Type: ${speech.speechType}
Groom: ${speech.groomName}
Bride: ${speech.brideName}
Relationship: ${speech.relationship}
Tone: ${speech.tone}
Length: ${speech.length}
Full Speech: ${currentSpeechText}
    `.trim();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: instructions,
          selectedText,
          speechContext,
          mode: 'rewrite',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rewrite text');
      }

      // Replace the selected text with the rewritten version
      replaceTextInSpeech(selectedText, data.response);
      
      return data.response;
    } catch (error) {
      console.error('Error rewriting text:', error);
      return 'Sorry, there was an error rewriting the text.';
    }
  };

  const closeDialog = () => {
    setDialogPosition(null);
    setSelectedText('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!speech) {
    notFound();
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar - Fixed */}
      <SpeechSidebar userId={speech.userId} />
      
      {/* Main Content - Scrollable */}
      <div className={`flex-1 flex flex-col transition-all duration-300`}>
        {/* Header - Fixed */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 pb-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {speech.speechType}
              </h1>
              <p className="text-lg text-gray-600">
                By {speech.user.firstName} {speech.user.lastName} • {speech.groomName} & {speech.brideName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {speech.relationship} • {speech.tone} • {speech.length}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-8">
          <div className="max-w-4xl mx-auto">
            {/* Speech Content */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-800 leading-relaxed select-text cursor-text"
                  onMouseUp={handleTextSelection}
                  onTouchEnd={handleTextSelection}
                  dangerouslySetInnerHTML={{
                    __html: highlightedText 
                      ? currentSpeechText.replace(
                          highlightedText,
                          `<span class="bg-yellow-200 px-1 rounded transition-all duration-300">${highlightedText}</span>`
                        )
                      : currentSpeechText
                  }}
                />
              </div>
            </div>

            {/* Speech Details */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Speech Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Speaker:</span> {speech.user.firstName} {speech.user.lastName}
                </div>
                <div>
                  <span className="font-medium">Speech Type:</span> {speech.speechType}
                </div>
                <div>
                  <span className="font-medium">Groom:</span> {speech.groomName}
                </div>
                <div>
                  <span className="font-medium">Bride:</span> {speech.brideName}
                </div>
                <div>
                  <span className="font-medium">Relationship:</span> {speech.relationship}
                </div>
                <div>
                  <span className="font-medium">Tone:</span> {speech.tone}
                </div>
                <div>
                  <span className="font-medium">Length:</span> {speech.length}
                </div>
                <div>
                  <span className="font-medium">Created:</span> {new Date(speech.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center pb-8">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Create Another Speech
              </Link>
              <CopyButton
                text={currentSpeechText}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Pane */}
      <ChatPane
        onSendMessage={handleSendMessage}
        onRewrite={handleRewrite}
      />

      {/* Chat Dialog (for quick selections) */}
      <ChatDialog
        selectedText={selectedText}
        position={dialogPosition}
        onClose={closeDialog}
        onSendMessage={handleSendMessage}
        onRewrite={handleRewrite}
      />
    </div>
  );
} 