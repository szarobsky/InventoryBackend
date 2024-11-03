import React, { useState } from 'react';
import 'primereact/resources/primereact.min.css';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Landing.css'; // Custom CSS file
import Logo from '../assets/Logo.png';
import MiniLogo from '../assets/MiniLogo.png';
import { auth, provider } from '../firebaseConfig'; // Firebase configuration
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../SwitchTheme'; // Adjust the path accordingly

//Landing page component
const Landing = () => {
    const [visibleGoal, setVisibleGoal] = useState(false);
    const [visibleAbout, setVisibleAbout] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate hook

    //Function to handle Google login
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            let user = result.user;
            const firebase_uid = user.uid; 
            console.log("Firebase UID:", firebase_uid);
            const getUser = async () => {
                if (firebase_uid) {
                    try {
                        const newUser = {'firebase_uid': firebase_uid, 'items': []};
                        const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/user/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(newUser),
                        });
                        let data = await response.text();

                        // Attempt to parse the response as JSON
                        try {
                            const jsonData = JSON.parse(data); 
                            data = jsonData;
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                            console.log('Response data:', data);
                        }
                    } catch (error) {
                        console.error("Error fetching items:", error);
                    }
                };
            }
            getUser();
            
            //Redirect to home page
            navigate('/home', { state: {firebase_uid }});
        } catch (error) {
        console.error("Error signing in with Google:", error);
        }
    };

    //Start content for the toolbar
    const startContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <img src={MiniLogo} alt="Logo" className="landing-mini-logo" />
        </div>
    );

    //End content for the toolbar
    const endContent = (
        <React.Fragment>
            <div className="flex align-items-center gap-2">
                <Button label="Login" onClick={handleGoogleLogin} />
                <ThemeSwitcher />
            </div>
        </React.Fragment>
    );

    //Render the landing page
    return (
        <div className="landing-container">
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <div className='landing-center'>
                <img src={Logo} alt="Logo" className="landing-logo"/>
                <div>
                    <Button className='landing-button' onClick={() => setVisibleGoal(true)}>Our Goal</Button>
                    <Button className='landing-button' onClick={() => setVisibleAbout(true)}>About us</Button>
                </div>
            </div>
            <Dialog header="Our Goal" visible={visibleGoal} position={'left'} style={{ width: '50vw' }} onHide={() => setVisibleGoal(false)} draggable={false} resizable={false}>
                <p className="m-0">
                    PantryPal aims to provide a simple and easy to use inventory management system for people keep track of their soon-to-expire foods and ingredients.
                </p>
            </Dialog>
            <Dialog header="About Us" visible={visibleAbout} position={'right'} style={{ width: '50vw' }} onHide={() => setVisibleAbout(false)} draggable={false} resizable={false}>
                <p className="m-0">
                    This project was made by students of the University of Central Florida for the Knight Hacks VII hackathon in 2024.
                </p>
                <p>
                    This was our first hackathon for the 3 of us and we learned a lot about it, especially about React, Django, and MongoDB.
                </p>
                <p>
                    This project is now being continued on by Sean Zarobsky as a side project.
                </p>
            </Dialog>
        </div>
    );
};

//Export the Landing component
export default Landing;