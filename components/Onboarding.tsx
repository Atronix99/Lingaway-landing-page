"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { LanguageSelector } from "./onboarding/steps/LanguageSelector";
import { StudyTimeSelector } from "./onboarding/steps/StudyTimeSelector";
import { LevelSelector } from "./onboarding/steps/LevelSelector";
import { CategorySelector } from "./onboarding/steps/CategorySelector";
import { CourseCreation } from "./onboarding/steps/CourseCreation";
import { CourseReady } from "./onboarding/steps/CourseReady";
import { sourceLanguages, targetLanguages } from "@/lib/utils/onboardingData";

const TOTAL_STEPS = 5;

const Onboarding: React.FC = () => {
  const router = useRouter();
  const {
    userData,
    currentStep,
    updateUserData,
    nextStep,
    prevStep,
    isStepValid,
  } = useOnboarding();

  const [showCreation, setShowCreation] = useState(false);
  const [showReady, setShowReady] = useState(false);

  const handleNext = () => {
    if (currentStep === TOTAL_STEPS) {
      setShowCreation(true);
    } else {
      nextStep();
    }
  };

  const handleCourseCreated = () => {
    setShowCreation(false);
    setShowReady(true);
  };

  const handleStartLearning = () => {
    localStorage.setItem("userOnboardingData", JSON.stringify(userData));
    router.push("/course-page");
  };

  const commonProps = {
    userData,
  onUpdateUserData: updateUserData,
  onNext: handleNext,
  onBack: prevStep,
  currentStep,
  totalSteps: TOTAL_STEPS,
  isValidStep: isStepValid(currentStep),   // <- DODAJ TO!
  };

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-md mx-auto px-5 py-8">
        {showCreation && <CourseCreation onComplete={handleCourseCreated} />}

        {showReady && (
          <CourseReady
            onStartLearning={handleStartLearning}
            userData={userData}
          />
        )}

        {!showCreation && !showReady && (
          <>
            {currentStep === 1 && (
              <LanguageSelector
                {...commonProps}
                languages={sourceLanguages}
                title="W jakim języku chciałbyś się uczyć?"
                searchId="native-language-search"
                searchLabel="Wyszukaj język rodzimy"
                dataKey="nativeLanguage"
              />
            )}

            {currentStep === 2 && (
              <LanguageSelector
                {...commonProps}
                languages={targetLanguages}
                title="Jakiego języka chciałbyś się uczyć?"
                searchId="learning-language-search"
                searchLabel="Wyszukaj język do nauki"
                dataKey="learningLanguage"
              />
            )}

            {currentStep === 3 && <StudyTimeSelector {...commonProps} />}

            {currentStep === 4 && <LevelSelector {...commonProps} />}

            {currentStep === 5 && <CategorySelector {...commonProps} />}
          </>
        )}
      </div>
    </main>
  );
};

export default Onboarding;
