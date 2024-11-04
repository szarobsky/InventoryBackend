import React, { useContext } from 'react';
import { PrimeReactContext } from 'primereact/api';
import {Button} from 'primereact/button';

//ThemeSwitcher component
const ThemeSwitcher = () => {
    const primeReactContext = useContext(PrimeReactContext);
    if (!primeReactContext) {
        console.error("PrimeReactContext is not available");
        return null; // Handle the error gracefully
    }
    const { changeTheme } = primeReactContext;

    //Function to handle theme change
    const handleThemeChange = () => {
        // Change theme to the selected one
        console.log("Changing theme");
        let curTheme = document.getElementById('theme-link').getAttribute('href');
        let button = document.getElementById('theme');
        console.log("Current theme is", curTheme);
        if (curTheme === '/themes/lara-light-blue/theme.css') {
            changeTheme(
                curTheme, // current theme
                '/themes/lara-dark-blue/theme.css', // new theme
                'theme-link' // ID of the link element
            );
            button.innerText = "Light Mode";
        }
        else if  (curTheme === '/themes/lara-dark-blue/theme.css') {
            changeTheme(
                curTheme, // current theme
                '/themes/lara-light-blue/theme.css', // new theme
                'theme-link' // ID of the link element
            );
            button.innerText = "Dark Mode";
        }
        
    };

    //Render the component
    return (
        <div>
            <Button id="theme" onClick={() => handleThemeChange()} style={{marginRight:'10px', fontWeight:'bold'}}>
                Dark Mode
            </Button>
        </div>
    );
};

//Export ThemeSwitcher component
export default ThemeSwitcher;
