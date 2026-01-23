import React from 'react';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}
export function Logo({
  size = 'md',
  showText = true,
  className = ''
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };
  return <div className={`flex flex-col items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <img src="/logoDziadPedofil(1).png" alt="LanGuess Logo" className="w-full h-full object-contain" />
      </div>

      {showText && <div className={`mt-4 bg-white border-4 border-[#4F6F2F] rounded-full px-8 py-2 ${textSizeClasses[size]} font-bold text-[#2d3e1b]`}>
          LanGuess
        </div>}
    </div>;
}