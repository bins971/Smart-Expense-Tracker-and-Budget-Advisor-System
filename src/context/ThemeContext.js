import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

const themes = {
    dark: {
        // Backgrounds
        bgPrimary: '#0f172a',
        bgSecondary: '#1e293b',
        bgTertiary: '#334155',

        // Cards & Surfaces
        cardBg: 'rgba(15, 23, 42, 0.7)',
        cardBgHover: 'rgba(15, 23, 42, 0.85)',
        glassBg: 'rgba(15, 23, 42, 0.95)',

        // Text
        textPrimary: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.8)',
        textTertiary: 'rgba(255, 255, 255, 0.6)',
        textMuted: 'rgba(255, 255, 255, 0.4)',

        // Borders
        borderPrimary: 'rgba(255, 255, 255, 0.15)',
        borderSecondary: 'rgba(255, 255, 255, 0.1)',
        borderTertiary: 'rgba(255, 255, 255, 0.05)',

        // Accents
        accentPrimary: '#818cf8',
        accentSecondary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',

        // Shadows
        shadowSm: '0 10px 30px 0 rgba(0, 0, 0, 0.4)',
        shadowMd: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        shadowLg: '0 40px 80px -20px rgba(0, 0, 0, 0.8)',
    },
    light: {
        // Backgrounds
        bgPrimary: '#f8fafc',
        bgSecondary: '#e2e8f0',
        bgTertiary: '#cbd5e1',

        // Cards & Surfaces
        cardBg: 'rgba(255, 255, 255, 0.9)',
        cardBgHover: 'rgba(255, 255, 255, 0.95)',
        glassBg: 'rgba(255, 255, 255, 0.98)',

        // Text
        textPrimary: '#0f172a',
        textSecondary: 'rgba(15, 23, 42, 0.8)',
        textTertiary: 'rgba(15, 23, 42, 0.6)',
        textMuted: 'rgba(15, 23, 42, 0.4)',

        // Borders
        borderPrimary: 'rgba(15, 23, 42, 0.15)',
        borderSecondary: 'rgba(15, 23, 42, 0.1)',
        borderTertiary: 'rgba(15, 23, 42, 0.05)',

        // Accents
        accentPrimary: '#6366f1',
        accentSecondary: '#4f46e5',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#2563eb',

        // Shadows
        shadowSm: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        shadowMd: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
        shadowLg: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to dark
    });

    const theme = isDark ? themes.dark : themes.light;

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
