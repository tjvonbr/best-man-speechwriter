'use client';

import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Button
      onClick={handleCopy}
      className={className}
    >
      Copy Speech
    </Button>
  );
} 