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
    const [visibleAddItem, setVisibleAddItem] = useState(false); // State for Add Item dialog
    const [visibleUpdateItem, setVisibleUpdateItem] = useState(false); // State for Update Item dialog
    const [selectedItem, setSelectedItem] = useState(null); // Store the selected item for update
    const [user, setUser] = useState(null); // To store logged-in user info
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [products, setProducts] = useState([]);

    // Fake data
    const fakeData = [
        { id: 1, item: 'Item 1', date: '2023-01-01' },
        { id: 2, item: 'Item 2', date: '2023-01-02' },
        { id: 3, item: 'Item 3', date: '2023-01-03' },
        { id: 4, item: 'Item 4', date: '2023-01-04' },
        { id: 5, item: 'Item 5', date: '2023-01-05' },
    ];

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
            <Button label="Submit" icon="pi pi-check" onClick={() => setVisibleAddItem(false)} />
        </div>
    );

    // Footer for Update dialog with the label "Update"
    const updateFooterContent = (
        <div>
            <Button label="Update" icon="pi pi-check" onClick={() => setVisibleUpdateItem(false)} />
        </div>
    );

    // Open update dialog and set selected item
    const handleUpdateClick = (item) => {
        setSelectedItem(item); // Store the item to be updated
        setVisibleUpdateItem(true); // Open update dialog
    };

    const actionBodyTemplate = (rowData) => {
        return <Button label="Update" onClick={() => handleUpdateClick(rowData)} />;
    };

    return (
        <div className="landing-container">
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <h1 style={{ textAlign: 'center' }}>Inventory</h1>
            <div className='landing-center'>
                <div className="datatable-container">
                    <DataTable value={fakeData} tableStyle={{ minWidth: '50rem' }}>
                        <Column field="item" header="Item"></Column>
                        <Column field="date" header="Date"></Column>
                        <Column field="actions" header="Actions" body={actionBodyTemplate}></Column>
                    </DataTable>
                    <Button label="Add Item" className="add-item-button" onClick={() => setVisibleAddItem(true)} />
                </div>
            </div>

            {/* Dialog for Add Item */}
            <Dialog header="Add Item" visible={visibleAddItem} style={{ width: '30vw' }} onHide={() => setVisibleAddItem(false)} footer={footerContent} draggable={false} resizable={false}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="itemName">Item Name</label>
                        <input id="itemName" type="text" className="p-inputtext p-component" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="itemDate">Date</label>
                        <input id="itemDate" type="date" className="p-inputtext p-component" />
                    </div>
                </div>
            </Dialog>

            {/* Dialog for Update Item */}
            <Dialog header="Update Item" visible={visibleUpdateItem} style={{ width: '30vw' }} onHide={() => setVisibleUpdateItem(false)} footer={updateFooterContent} draggable={false} resizable={false}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="updateItemName">Item Name</label>
                        <input
                            id="updateItemName"
                            type="text"
                            className="p-inputtext p-component"
                            defaultValue={selectedItem ? selectedItem.item : ''}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="updateItemDate">Date</label>
                        <input
                            id="updateItemDate"
                            type="date"
                            className="p-inputtext p-component"
                            defaultValue={selectedItem ? selectedItem.date : ''}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Home;
