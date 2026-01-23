import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}
export function Input({
  label,
  className = '',
  ...props
}: InputProps) {
  return <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-[#3A5220] font-bold ml-4 text-sm">{label}</label>}
      <input className={`w-full px-6 py-3 rounded-full border-2 border-gray-300 focus:border-[#6B8E23] focus:outline-none text-gray-700 placeholder-gray-400 bg-white ${className}`} {...props} />
    </div>;
}