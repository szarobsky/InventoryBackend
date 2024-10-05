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
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const Home = () => {

    const [visibleLogin, setVisibleLogin] = useState(false);
    const [user, setUser] = useState(null); // To store logged-in user info
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [products, setProducts] = useState([]);

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

    return (
        <div className="landing-container">
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <div className='landing-center'>
                <h1>Inventory</h1>
                <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="item" header="Item"></Column>
                    <Column field="date" header="Date"></Column>
                    <Column field="actions" header="Actions"></Column>
                </DataTable>
                <Button label="Add Item" />
            </div>
        </div>
    );
}
export default Home;