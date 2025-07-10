'use client';

interface ProgressStepsProps {
  currentStep: number;
  colorScheme: 'male' | 'female' | 'default';
}

const colorSchemes = {
  male: {
    active: 'bg-blue-600',
    inactive: 'bg-gray-200',
  },
  female: {
    active: 'bg-pink-600',
    inactive: 'bg-gray-200',
  },
  default: {
    active: 'bg-gray-600',
    inactive: 'bg-gray-200',
  },
};

export function ProgressSteps({ currentStep, colorScheme }: ProgressStepsProps) {
  const colors = colorSchemes[colorScheme];
  const totalSteps = 3;
  
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colors.active}`}
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
} 