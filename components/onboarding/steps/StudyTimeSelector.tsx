'use client';

import React, { useState } from 'react';
import { OnboardingStepProps } from '@/lib/types/onboarding';
import { studyTimes } from '@/lib/utils/onboardingData';
import { Progress } from "@/components/ui/progress";

export const StudyTimeSelector: React.FC<OnboardingStepProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  currentStep,
  totalSteps
}) => {
  // Ustawiamy wybraną wartość lokalnie, start domyślnie z userData jeśli jest
  const [selectedTime, setSelectedTime] = useState<string>(userData.studyTime || '');

  // Procent postępu
  const progressValue = (currentStep / totalSteps) * 100;

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onUpdateUserData({ studyTime: time }); // zapisz wybraną opcję
  };

  // idziemy dalej tylko po kliknięciu na przycisk
  const handleContinue = () => {
    if (selectedTime) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header z postępem i tytułem */}
      <div className="text-center mb-8">
        <Progress value={progressValue} className="mb-4" size="md" />
        <h1 className="text-white text-lg font-medium leading-tight">
          Ile czasu dziennie chcesz<br />poświęcić na naukę?
        </h1>
      </div>

      {/* Lista opcji czasu */}
      <div className="flex-1 space-y-3 mb-8 overflow-y-auto no-scrollbar max-h-100">
        {studyTimes.map((time) => (
          <button
            key={time}
            type="button"
            className={`w-full bg-white rounded-xl p-4 text-left flex items-center text-gray-800 font-medium shadow-sm hover:shadow-md transition-all border-2 ${
              selectedTime === time
                ? 'border-teal-500 ring-2 ring-teal-400'
                : 'border-transparent'
            }`}
            onClick={() => handleTimeSelect(time)}
          >
            <span className="text-xl mr-3">⏰</span>
            {time}
          </button>
        ))}
      </div>

      {/* Przycisk „Kontynuuj” */}
      <button
        className="w-full bg-white text-teal-500 rounded-xl py-4 text-center font-medium shadow-sm hover:shadow-md transition-all mb-6 disabled:opacity-60"
        onClick={handleContinue}
        disabled={!selectedTime}
      >
        Kontynuuj
      </button>
    </div>
  );
};
