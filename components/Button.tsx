import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'normal' | 'small';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'normal', className, ...props }) => {
  const baseClasses = "rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: 'bg-violet-500 text-white hover:bg-violet-600 focus:ring-violet-500',
    secondary: 'bg-gray-800 text-gray-300 hover:bg-gray-700 focus:ring-violet-500 border border-gray-700',
  };

  const sizeClasses = {
      normal: "px-5 py-3",
      small: "px-3 py-1 text-xs"
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;