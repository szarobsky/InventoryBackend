import React, { useContext } from 'react';
import { PrimeReactContext } from 'primereact/api';

const ThemeSwitcher = () => {
    const primeReactContext = useContext(PrimeReactContext);
    
    if (!primeReactContext) {
        console.error("PrimeReactContext is not available");
        return null; // Handle the error gracefully
    }

    const { changeTheme } = primeReactContext;

    const handleThemeChange = (newTheme) => {
        // Change theme to the selected one
        console.log("Changing theme to", newTheme);
        changeTheme(
            document.getElementById('theme-link').getAttribute('href'), // current theme
            newTheme, // new theme
            'theme-link' // ID of the link element
        );
    };

    return (
        <div>
            <button onClick={() => handleThemeChange('/themes/lara-light-blue/theme.css')}>
                Light Theme
            </button>
            <button onClick={() => handleThemeChange('/themes/lara-dark-blue/theme.css')}>
                Dark Theme
            </button>
        </div>
    );
};

export default ThemeSwitcher;
