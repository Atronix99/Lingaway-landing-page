import React from "react";

interface ProgressProps {
  value: number; // Postęp (np. 40)
  max?: number; // Maksymalnie (domyślnie 100)
  showLabel?: boolean; // Pokazywać napis %?
  className?: string; // Dodatkowe klasy
  size?: "sm" | "md" | "lg";
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  showLabel = false,
  className = "",
  size = "md",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizes = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-1 text-sm text-white opacity-80">
          Postęp: {Math.round(percentage)}%
        </div>
      )}
      <div
        className={`bg-white/30 rounded-full overflow-hidden ${sizes[size]}`}
        // bg-white/30 = półprzezroczyste jasne tło jak na screenie
      >
        <div
          className="bg-white h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
