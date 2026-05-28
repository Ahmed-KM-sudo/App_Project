import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:scale-110 transition-all duration-300 shadow-sm"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
