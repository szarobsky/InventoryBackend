import React, { useContext } from 'react';
import { PrimeReactContext } from 'primereact/api';
import {Button} from 'primereact/button';
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
            <Button onClick={() => handleThemeChange('/themes/lara-light-blue/theme.css')} style={{marginRight:'10px', fontWeight:'bold'}}>
                Light Theme
            </Button>
            <Button onClick={() => handleThemeChange('/themes/lara-dark-blue/theme.css')} style={{ fontWeight:'bold'}}>
                Dark Theme
            </Button>
        </div>
    );
};

export default ThemeSwitcher;
