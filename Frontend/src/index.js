import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PrimeReactProvider } from 'primereact/api'; // Import the provider

//Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));
document.title="PantryPal";

//Wrap the App component with the PrimeReactProvider
root.render(
    <React.StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>
);
