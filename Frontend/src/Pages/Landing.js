import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { Toolbar } from 'primereact/toolbar';
import {Button} from 'primereact/button';
import './Landing.css'; // Custom CSS file
import Logo from '../assets/Logo.png';
import {Image} from 'primereact/image';
import MiniLogo from '../assets/MiniLogo.png';

const Landing = () => {

    const startContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <img src={MiniLogo} alt="Logo" className="landing-mini-logo" />
        </div>
    );

    const endContent = (
        <React.Fragment>
            <div className="flex align-items-center gap-2">
                <Button label="Login" />
            </div>
        </React.Fragment>
    );
    return (
        <div className="landing-container">
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <div className='landing-center'>
                <Image src={Logo} alt="Logo" className="landing-logo" />
                <h1 className="landing-title">Welcome to the Landing Page</h1>
                <div>
                    <Button className='landing-button'>Our Goal</Button>
                    <Button className='landing-button'>About us</Button>
                </div>
            </div>
        </div>
    );
    }
export default Landing;