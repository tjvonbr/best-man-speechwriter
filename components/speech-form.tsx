'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProgressSteps } from '@/components/progress-steps';
import { Session } from 'next-auth';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  sex: 'male' | 'female' | '';
  speechType: string;
  groomName: string;
  brideName: string;
  relationship: string;
  stories: string;
  tone: string;
  length: string;
}

interface SpeechFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGenerateSpeech: (data: any) => void;
  isLoading: boolean;
  error: string;
  session: Session | null;
}

const colorSchemes = {
  male: {
    primary: 'from-blue-600 to-indigo-600',
    hover: 'from-blue-700 to-indigo-700',
    accent: 'bg-blue-50 border-blue-200',
    text: 'text-blue-900',
    button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
  },
  female: {
    primary: 'from-pink-600 to-purple-600',
    hover: 'from-pink-700 to-purple-700',
    accent: 'bg-pink-50 border-pink-200',
    text: 'text-pink-900',
    button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
  },
  default: {
    primary: 'from-gray-600 to-gray-700',
    hover: 'from-gray-700 to-gray-800',
    accent: 'bg-gray-50 border-gray-200',
    text: 'text-gray-900',
    button: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800',
  },
};

export function SpeechForm({ onGenerateSpeech, isLoading, error, session }: SpeechFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    sex: '',
    speechType: 'Best Man',
    groomName: '',
    brideName: '',
    relationship: '',
    stories: '',
    tone: 'Heartfelt and Humorous',
    length: 'Medium (3-4 minutes)',
  });

  const colors = formData.sex ? colorSchemes[formData.sex] : colorSchemes.default;

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      if (name === 'sex') {
        if (value === 'male') {
          newData.speechType = 'Best Man';
        } else if (value === 'female') {
          newData.speechType = 'Bridesmaid';
        }
      }
      
      return newData;
    });
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.sex)) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!formData.groomName || !formData.brideName || !formData.relationship) {
      return;
    }

    // Combine first and last name for the API
    const formDataWithName = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
    };
    onGenerateSpeech(formDataWithName);
  };

  const renderStep1 = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
        <CardDescription>
          Let&apos;s start by getting to know you better
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={session?.user?.name || formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2 w-full">
          <Label htmlFor="sex">Sex</Label>
          <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={nextStep}
          disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.sex}
          className={`w-full text-white font-semibold py-3 ${colors.button}`}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Speech Details</CardTitle>
        <CardDescription>
          Tell us about the couple and your relationship
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="speechType">Speech Type</Label>
          <Select value={formData.speechType} onValueChange={(value) => handleInputChange('speechType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Best Man">Best Man Speech</SelectItem>
              <SelectItem value="Bridesmaid">Bridesmaid Speech</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="groomName">Groom&apos;s Name</Label>
            <Input
              id="groomName"
              value={formData.groomName}
              onChange={(e) => handleInputChange('groomName', e.target.value)}
              placeholder="e.g., John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brideName">Bride&apos;s Name</Label>
            <Input
              id="brideName"
              value={formData.brideName}
              onChange={(e) => handleInputChange('brideName', e.target.value)}
              placeholder="e.g., Sarah"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="relationship">Your Relationship to the Couple</Label>
          <Input
            id="relationship"
            value={formData.relationship}
            onChange={(e) => handleInputChange('relationship', e.target.value)}
            placeholder={
              formData.sex === 'male' 
                ? "e.g., Brother of the groom, college roommate, best friend"
                : formData.sex === 'female'
                ? "e.g., Sister of the bride, college roommate, best friend"
                : "e.g., Brother of the groom, college roommate"
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stories">Personal Stories & Anecdotes</Label>
          <Textarea
            id="stories"
            value={formData.stories}
            onChange={(e) => handleInputChange('stories', e.target.value)}
            placeholder="Share some memorable stories, funny moments, or touching memories about the couple..."
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={prevStep} variant="outline" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={nextStep}
            disabled={!formData.groomName || !formData.brideName || !formData.relationship}
            className={`flex-1 text-white font-semibold ${colors.button}`}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Speech Style</CardTitle>
        <CardDescription>
          Choose the tone and length for your speech
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Speech Tone</Label>
          <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Heartfelt and Humorous">Heartfelt and Humorous</SelectItem>
              <SelectItem value="Sentimental and Emotional">Sentimental and Emotional</SelectItem>
              <SelectItem value="Funny and Lighthearted">Funny and Lighthearted</SelectItem>
              <SelectItem value="Formal and Elegant">Formal and Elegant</SelectItem>
              <SelectItem value="Casual and Personal">Casual and Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="length">Speech Length</Label>
          <Select value={formData.length} onValueChange={(value) => handleInputChange('length', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Short (2-3 minutes)">Short (2-3 minutes)</SelectItem>
              <SelectItem value="Medium (3-4 minutes)">Medium (3-4 minutes)</SelectItem>
              <SelectItem value="Long (4-5 minutes)">Long (4-5 minutes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button onClick={prevStep} variant="outline" className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 text-white font-semibold ${colors.button}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </div>
            ) : (
              'Generate Speech'
            )}
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      <ProgressSteps currentStep={currentStep} colorScheme={formData.sex || 'default'} />
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
} 