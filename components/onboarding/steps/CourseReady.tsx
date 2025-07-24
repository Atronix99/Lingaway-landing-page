"use client";

import React from "react";
import { UserData } from "@/lib/types/onboarding";

interface CourseReadyProps {
  onStartLearning: () => void;
  userData: UserData;
}

export const CourseReady: React.FC<CourseReadyProps> = ({
  onStartLearning,
  userData,
}) => {
  console.log(userData);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Ikona */}
      <div className="w-20 h-20 bg-white shadow-lg rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl">🎉</span>
      </div>

      {/* Tytuł */}
      <h1 className="text-white text-xl font-medium text-center mb-8 leading-tight">
        Twój kurs jest gotowy!
      </h1>

      {/* Podsumowanie */}
      <div className="w-full max-w-xs mb-12 space-y-4">
        <div className="text-white text-center text-sm opacity-90">
          📚 {userData.nativeLanguage} → {userData.learningLanguage}
        </div>
        <div className="text-white text-center text-sm opacity-90">
          ⏱️ {userData.studyTime} dziennie
        </div>
        <div className="text-white text-center text-sm opacity-90">
          🎯 {userData.categories?.length || 0} kategorii wybranych
        </div>
      </div>

      {/* Przycisk */}
      <button
        onClick={onStartLearning}
        className="w-full max-w-xs bg-white text-teal-500 rounded-xl py-4 text-center font-medium shadow-sm hover:shadow-md transition-all"
      >
        🚀 Rozpocznij naukę
      </button>
    </div>
  );
};
