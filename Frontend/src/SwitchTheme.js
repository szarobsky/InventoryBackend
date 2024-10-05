import React, { useState } from 'react';
import PrimeReact from "primereact/api"; // Correct import for PrimeReact
import { Button } from 'primereact/button';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('lara-dark-blue'); // Default theme
    const themeLinkId = 'theme-link'; // The id of the link element

    const changeTheme = () => {
        const linkElement = document.getElementById(themeLinkId);
        if (linkElement) {
            // Log the current href and theme
            console.log("Current theme link href:", linkElement.getAttribute('href'));
            console.log("Changing theme from", theme); // Log the current theme

            const newTheme = theme === "lara-light-blue" ? "lara-dark-blue" : "lara-light-blue";
            PrimeReact.changeTheme(theme, newTheme, themeLinkId); // Use the current theme as the first argument
            
            // Log the new theme
            console.log("New theme:", newTheme);
            setTheme(newTheme); // Update the state with the new theme
        } else {
            console.error("Theme link element not found");
        }
    };

    return (
        <div>
            <Button
                style={{ width: "25%" }}
                onClick={changeTheme}
                label='Switch Theme'
            />
        </div>
    );
};

export default ThemeSwitcher;
