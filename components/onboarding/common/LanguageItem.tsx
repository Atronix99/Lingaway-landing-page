import React from 'react';
import { LanguageItemProps } from '@/lib/types/onboarding';

export const LanguageItem: React.FC<LanguageItemProps> = ({
  language,
  isSelected,
  onClick
}) => {
  return (
    <button
      className={`
        w-full text-left p-4 rounded-2xl transition-all transform active:scale-95
        ${isSelected 
          ? 'bg-white text-teal-500 shadow-lg' 
          : 'bg-white bg-opacity-20 text-black hover:bg-opacity-30'
        }
      `}
      onClick={() => onClick(language)}
      aria-pressed={isSelected}
    >
      <span className="font-medium">🌐 {language}</span>
    </button>
  );
};
