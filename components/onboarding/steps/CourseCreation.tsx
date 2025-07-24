'use client';

import React from 'react';
import { useLoading } from '@/lib/hooks/useLoading';
import { loadingSteps } from '@/lib/utils/onboardingData';
import { Progress } from '@/components/ui/progress';

interface CourseCreationProps {
  onComplete: () => void;
}

export const CourseCreation: React.FC<CourseCreationProps> = ({ onComplete }) => {
  const { progress, currentStep } = useLoading(onComplete);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-6">
          <div className="w-full h-full border-4 border-teal-500 border-opacity-30 border-t-white rounded-full animate-spin"></div>
        </div>
        <h1 className="text-white text-lg font-medium leading-tight">
          Tworzymy kurs idealny<br />dla Ciebie
        </h1>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-6">
        <Progress value={progress} size="md" />
        <div className="text-white text-sm text-center mt-3 opacity-90">
          {Math.round(progress)}% ukończone
        </div>
      </div>

      {/* Status text */}
      <p className="text-white text-center opacity-90 text-sm">
        {loadingSteps[currentStep] || 'Inicjalizacja...'}
      </p>
    </div>
  );
};
