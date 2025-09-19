import { useEffect, useState } from 'react';

export function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('dark-mode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode: any) => !prevMode);
    };

    useEffect(() => {
        localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    return { isDarkMode, toggleDarkMode };
};
