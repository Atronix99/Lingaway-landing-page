import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  padding = 'md'
}) => {
  const variants = {
    default: 'bg-white shadow-lg',
    glass: 'bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20',
    solid: 'bg-white'
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div className={`rounded-2xl ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};
