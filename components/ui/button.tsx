import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-2xl transition-all transform active:scale-95 focus:outline-none focus:ring-2';
  
  const variants = {
    primary: 'bg-white text-teal-500 hover:bg-gray-50 hover:shadow-lg',
    secondary: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-500',
    outline: 'bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-20'
  };

  const sizes = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-12 px-6',
    lg: 'h-14 px-8 text-lg'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Ładowanie...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
