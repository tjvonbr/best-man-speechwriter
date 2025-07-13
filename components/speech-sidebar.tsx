'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Speech {
  id: string;
  speechType: string;
  groomName: string;
  brideName: string;
  createdAt: string;
}

interface SpeechSidebarProps {
  userId: string;
}

export function SpeechSidebar({ userId }: SpeechSidebarProps) {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpeeches = async () => {
      try {
        const response = await fetch(`/api/speeches?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSpeeches(data.speeches);
        }
      } catch (error) {
        console.error('Error fetching speeches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchSpeeches();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Speeches</h2>
        <Link href="/get-started">
          <Button className="w-full" variant="outline">
            Create New Speech
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {speeches.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No speeches yet</p>
            <p className="text-xs mt-1">Create your first speech to get started!</p>
          </div>
        ) : (
          speeches.map((speech) => (
            <Link key={speech.id} href={`/speeches/${speech.id}`} className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              <span className="truncate">{speech.speechType} | {speech.groomName} x {speech.brideName}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 