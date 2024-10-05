import React, { useState } from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Landing.css'; // Custom CSS file
import Logo from '../assets/Logo.png';
import { Image } from 'primereact/image';
import MiniLogo from '../assets/MiniLogo.png';
import { auth, provider } from '../firebaseConfig'; // Firebase configuration
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const [visibleGoal, setVisibleGoal] = useState(false);
    const [visibleAbout, setVisibleAbout] = useState(false);
    const [visibleLogin, setVisibleLogin] = useState(false);
    const [user, setUser] = useState(null); // To store logged-in user info
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider); // Pass 'auth' and 'provider' here
            setUser(result.user);
            setVisibleLogin(false); // Close the dialog after successful login
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

        // Handle navigation to home page
        const handleNavigateHome = () => {
            navigate('/home');
        };

    const startContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <img src={MiniLogo} alt="Logo" className="landing-mini-logo" />
        </div>
    );

    const endContent = (
        <React.Fragment>
            <div className="flex align-items-center gap-2">
                <Button label="Home" onClick={handleNavigateHome} />
                <Button label="Login" onClick={() => setVisibleLogin(true)} />
            </div>
        </React.Fragment>
    );

    const footerContent = (
        <div>
            <Button label="Close" icon="pi pi-times" onClick={() => { setVisibleGoal(false); setVisibleAbout(false); }} />
        </div>
    );

    return (
        <div className="landing-container">
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <div className='landing-center'>
                <Image src={Logo} alt="Logo" className="landing-logo" />
                <div>
                    <Button className='landing-button' onClick={() => setVisibleGoal(true)}>Our Goal</Button>
                    <Button className='landing-button' onClick={() => setVisibleAbout(true)}>About us</Button>
                </div>
            </div>

            {/* Dialog for Our Goal */}
            <Dialog header="Our Goal" visible={visibleGoal} position={'left'} style={{ width: '50vw' }} onHide={() => setVisibleGoal(false)} footer={footerContent} draggable={false} resizable={false}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                </p>
            </Dialog>

            {/* Dialog for About Us */}
            <Dialog header="About Us" visible={visibleAbout} position={'right'} style={{ width: '50vw' }} onHide={() => setVisibleAbout(false)} footer={footerContent} draggable={false} resizable={false}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </Dialog>

            {/* Dialog for Login */}
            <Dialog header="Login" visible={visibleLogin} style={{ width: '30vw' }} onHide={() => setVisibleLogin(false)} draggable={false} resizable={false}>
                <div className="text-center">
                    <h3>Sign in with Google</h3>
                    <Button label="Login with Google" icon="pi pi-google" className="p-button-rounded p-button-danger" onClick={handleGoogleLogin} />
                </div>
            </Dialog>
        </div>
    );
};

export default Landing;