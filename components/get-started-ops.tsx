'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SpeechForm } from "./speech-form";
import { Session } from "next-auth";

interface ApiFormData {
  name: string;
  sex: 'male' | 'female' | '';
  email: string;
  speechType: string;
  groomName: string;
  brideName: string;
  relationship: string;
  stories: string;
  tone: string;
  length: string;
}

export default function GetStartedOps({ session }: { session: Session | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const generateSpeech = async (formData: ApiFormData) => {
    setIsLoading(true);
    setError('');

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

      // Redirect to the speeches page using the ID
      router.push(`/speeches/${data.speechId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
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
              session={session}
              onGenerateSpeech={generateSpeech}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}