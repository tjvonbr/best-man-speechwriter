'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
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
  const pathname = usePathname();

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
        <Link href="/">
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
            <Link key={speech.id} href={`/speeches/${speech.id}`}>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  pathname === `/speeches/${speech.id}` 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {speech.speechType}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {speech.groomName} & {speech.brideName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(speech.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
} 