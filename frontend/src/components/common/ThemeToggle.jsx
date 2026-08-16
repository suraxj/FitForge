import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="theme-switch-container flex items-center space-x-2">
      {showLabel && (
        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {isLight ? 'Light' : 'Dark'}
        </span>
      )}
      <button
        onClick={toggleTheme}
        type="button"
        className="theme-switch-btn focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        aria-label="Toggle Theme"
      >
        <div className="theme-switch-thumb">
          {isLight ? (
            <Sun className="w-3.5 h-3.5 text-white" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-white" />
          )}
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;
