'use client';

import React, { useState } from 'react';
import { OnboardingStepProps } from '@/lib/types/onboarding';
import { levels } from '@/lib/utils/onboardingData';
import { Progress } from "@/components/ui/progress";

export const LevelSelector: React.FC<OnboardingStepProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  currentStep,
  totalSteps
}) => {
  // Zapamiętujemy wybrany poziom, domyślnie taki jak w userData (jeśli istnieje)
  const [selectedLevel, setSelectedLevel] = useState<string>(userData.level || '');

  // Procent progresu (identycznie jak w innych krokach)
  const progressValue = (currentStep / totalSteps) * 100;

  // Ręczne wybieranie poziomu
  const handleLevelSelect = (levelKey: string) => {
    setSelectedLevel(levelKey);
    onUpdateUserData({ level: levelKey });
  };

  // "Kontynuuj" przechodzi dalej
  const handleContinue = () => {
    if (selectedLevel) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Progress bar i nagłówek */}
      <div className="text-center mb-8">
        <Progress value={progressValue} className="mb-4" size="md" />
        <h1 className="text-white text-lg font-medium leading-tight">
          Jaki jest Twój poziom<br />{userData.learningLanguage}?
        </h1>
      </div>

      {/* Lista poziomów */}
      <div className="flex-1 space-y-3 mb-8 overflow-y-auto no-scrollbar max-h-120">
        {levels.map((level) => (
          <button
            key={level.key}
            type="button"
            className={`w-full bg-white rounded-xl p-4 text-left flex items-center text-gray-800 font-medium shadow-sm hover:shadow-md transition-all border-2 ${
              selectedLevel === level.key
                ? 'border-teal-500 ring-2 ring-teal-400'
                : 'border-transparent'
            }`}
            onClick={() => handleLevelSelect(level.key)}
          >
            <span className="text-xl mr-3">📚</span>
            {level.label}
          </button>
        ))}
      </div>

      {/* Przycisk Kontynuuj */}
      <button
        className="w-full bg-white text-teal-500 rounded-xl py-4 text-center font-medium shadow-sm hover:shadow-md transition-all mb-6 disabled:opacity-60"
        onClick={handleContinue}
        disabled={!selectedLevel}
      >
        Kontynuuj
      </button>
    </div>
  );
};
