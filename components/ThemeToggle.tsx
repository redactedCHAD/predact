import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="relative inline-flex h-10 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-slate-200 dark:bg-slate-800 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-start focus-visible:ring-offset-2 shadow-inner"
      aria-label="Toggle Dark Mode"
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`${
          isDark ? 'translate-x-7 bg-slate-950' : 'translate-x-0 bg-white'
        } pointer-events-none relative inline-block h-9 w-9 -mt-0.5 transform rounded-full shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center`}
      >
        {isDark ? (
            <MoonIcon className="h-5 w-5 text-brand-accent" />
        ) : (
            <SunIcon className="h-6 w-6 text-brand-warning" />
        )}
      </span>
    </button>
  );
};