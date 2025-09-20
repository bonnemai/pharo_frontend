import { useEffect, useState } from 'react';

export function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('dark-mode');
        return savedMode === 'true';
    });

    function toggleDarkMode() {
        setIsDarkMode((prevMode) => !prevMode);
    }

    function setDarkMode(value: boolean) {
        setIsDarkMode(value);
    }

    useEffect(() => {
        localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));
        document.body.classList.toggle('dark-mode', isDarkMode);
        document.body.classList.toggle('light-mode', !isDarkMode);
    }, [isDarkMode]);

    return { isDarkMode, toggleDarkMode, setDarkMode };
};
