import React, { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { LanguageItem } from "../common/LanguageItem";
import { OnboardingStepProps } from "@/lib/types/onboarding";

interface LanguageSelectorProps extends OnboardingStepProps {
  languages: string[];
  title: string;
  searchId: string;
  searchLabel: string;
  dataKey: "nativeLanguage" | "learningLanguage";
  isValidStep: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  title,
  searchId,
  searchLabel,
  dataKey,
  userData,
  onUpdateUserData,
  onNext,
  currentStep,
  totalSteps,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(userData[dataKey] || "");

  const filteredLanguages = useMemo(
    () =>
      languages.filter((language) =>
        language.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [languages, searchQuery]
  );

  // Procent postępu
  const progressValue = (currentStep / totalSteps) * 100;

  // TYLKO LOKALNIE wybierzemy język, bez zapisu do userData:
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  // W userData zapisujemy DOPIERO po kliknięciu "Kontynuuj"
  const handleContinue = () => {
    if (selectedLanguage) {
      onUpdateUserData({ [dataKey]: selectedLanguage });
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="text-center mb-8">
        <Progress value={progressValue} className="mb-4" size="md" />
        <h1 className="text-white text-lg font-medium leading-tight">
          {title}
        </h1>
      </div>
      <div className="mb-6">
        <input
          id={searchId}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchLabel}
          className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        />
      </div>
      <div className="flex-1 space-y-3 mb-8 overflow-y-auto no-scrollbar max-h-100">
        {filteredLanguages.map((language) => (
          <LanguageItem
            key={language}
            language={language}
            isSelected={selectedLanguage === language}
            onClick={handleLanguageSelect}
          />
        ))}
      </div>
      <button
        className="w-full bg-white text-teal-500 rounded-xl py-4 text-center font-medium shadow-sm hover:shadow-md transition-all mb-6 disabled:opacity-60"
        onClick={handleContinue}
        disabled={!selectedLanguage}
      >
        Kontynuuj
      </button>
    </div>
  );
};
