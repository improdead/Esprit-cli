import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-mono transition-all duration-200 active:translate-y-[1px]";
  
  const variants = {
    primary: "bg-[#222] text-white border border-[#222] hover:bg-black shadow-sm",
    outline: "bg-transparent text-[#222] border border-[#ccc] hover:border-[#999] hover:bg-white/50",
    text: "bg-transparent text-[#222] hover:text-black underline decoration-1 underline-offset-4"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;