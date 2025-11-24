import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'default';
}

export const RetroButton: React.FC<RetroButtonProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const baseStyle = "uppercase font-bold text-lg px-6 py-2 border-2 transition-all active:translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-black";
  
  let variantStyle = "";
  switch(variant) {
    case 'primary':
      variantStyle = "bg-green-600 border-green-400 text-black hover:bg-green-500 shadow-[4px_4px_0px_0px_rgba(0,255,0,0.3)]";
      break;
    case 'danger':
      variantStyle = "bg-red-900 border-red-500 text-red-100 hover:bg-red-800 shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)]";
      break;
    default:
      variantStyle = "bg-gray-900 border-green-700 text-green-500 hover:bg-green-900 hover:text-green-300 shadow-[4px_4px_0px_0px_rgba(0,100,0,0.5)]";
  }

  return (
    <button 
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
