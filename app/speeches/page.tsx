'use client';

import { useState } from 'react';
import { SpeechForm } from '@/components/speech-form';

interface FormData {
  name: string;
  sex: 'male' | 'female' | '';
  speechType: string;
  groomName: string;
  brideName: string;
  relationship: string;
  stories: string;
  tone: string;
  length: string;
}

export default function Home() {
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSpeech = async (formData: FormData) => {
    setIsLoading(true);
    setError('');
    setGeneratedSpeech('');

    try {
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate speech');
      }

      setGeneratedSpeech(data.speech);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Wedding Speech Generator
            </h1>
            <p className="text-xl text-gray-600">
              Create your perfect wedding speech in just a few steps
            </p>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <SpeechForm 
              onGenerateSpeech={generateSpeech}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Generated Speech Display */}
          {generatedSpeech && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Generated Speech
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {generatedSpeech}
                </div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(generatedSpeech)}
                className="mt-4 w-full bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
