"use client";

import React, { useState } from "react";
import { OnboardingStepProps } from "@/lib/types/onboarding";
import { categories } from "@/lib/utils/onboardingData";
import { Progress } from "@/components/ui/progress";

export const CategorySelector: React.FC<OnboardingStepProps> = ({
  userData,
  onUpdateUserData,
  onNext,
  currentStep,
  totalSteps,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Progres zgodnie z pozostałymi krokami
  const progressValue = (currentStep / totalSteps) * 100;

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (category: string) => {
    const newCategories = userData.categories?.includes(category)
      ? userData.categories.filter((c) => c !== category)
      : [...(userData.categories || []), category];
    onUpdateUserData({ categories: newCategories });
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Progress bar i nagłówek */}
      <div className="text-center mb-8">
        <Progress value={progressValue} className="mb-4" size="md" />
        <h1 className="text-white text-lg font-medium leading-tight">
          Jakie kategorie Cię interesują?
        </h1>
      </div>

      {/* Chipsy kategorii */}
      <div className="flex-1 mb-8 max-h-120 overflow-y-auto no-scrollbar">
        <div className="flex flex-wrap gap-3 ">
          {filteredCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={`
                px-5 py-3 rounded-xl font-medium shadow-sm transition-all border-2 flex items-center text-center
                ${
                  userData.categories?.includes(category)
                    ? "bg-white text-teal-500 border-teal-500 ring-2 ring-teal-400"
                    : "bg-white bg-opacity-90 text-gray-800 hover:bg-white border-transparent"
                }
              `}
              style={{ minWidth: "110px" }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Przycisk Kontynuuj */}
      <button
        onClick={onNext}
        disabled={!userData.categories || userData.categories.length === 0}
        className="w-full bg-white text-teal-500 rounded-xl py-4 text-center font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-60 mb-6"
      >
        Kontynuuj
        {userData.categories?.length
          ? ` (${userData.categories.length} wybrane)`
          : ""}
      </button>
    </div>
  );
};
