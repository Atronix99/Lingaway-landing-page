import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'selected' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-all';
  
  const variants = {
    default: 'bg-white bg-opacity-20 text-white border border-white border-opacity-30',
    selected: 'bg-white text-teal-500 border border-white',
    outline: 'bg-transparent text-white border border-white border-opacity-50 hover:bg-white hover:bg-opacity-10'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};
