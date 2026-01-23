import React from 'react';
import { cn } from '../utils/cn'; // We'll create this utility
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}
export function Button({
  children,
  className,
  variant = 'primary',
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-full transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-lg';
  const variants = {
    primary: 'bg-[#3A5220] text-white hover:bg-[#2d3e1b] border-2 border-[#3A5220]',
    secondary: 'bg-[#6B8E23] text-white hover:bg-[#5a781d]',
    outline: 'bg-white text-[#3A5220] border-4 border-[#3A5220] hover:bg-gray-50'
  };
  return <button className={cn(baseStyles, variants[variant], fullWidth ? 'w-full' : '', className)} {...props}>
      {children}
    </button>;
}