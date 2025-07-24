import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'white' | 'primary';
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'white'
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colors = {
    white: 'border-white',
    primary: 'border-teal-500'
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-opacity-30 ${colors[color]} ${sizes[size]} ${className}`}
      style={{
        borderTopColor: color === 'white' ? '#ffffff' : '#14b8a6'
      }}
    />
  );
};
