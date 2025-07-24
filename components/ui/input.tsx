import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2 text-white">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full h-12 px-4 bg-white bg-opacity-20 border border-white border-opacity-30 
            rounded-2xl text-white placeholder-white placeholder-opacity-70 
            focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 
            focus:border-transparent transition-all
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 ring-red-300' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-200">{error}</p>
      )}
    </div>
  );
};
