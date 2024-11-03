import React, { useState, useRef, useEffect } from 'react';
import 'primereact/resources/primereact.min.css';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Landing.css'; // Custom CSS file
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { signOut, onAuthStateChanged } from 'firebase/auth'; // Import signOut function
import { auth } from '../firebaseConfig.js';
import MiniLogo from '../assets/MiniLogo.png'
import { Toast } from 'primereact/toast';
import ThemeSwitcher from '../SwitchTheme'; // Import ThemeSwitcher

const Home = () => {
    const [disableButton, setDisableButtons] = useState(false)
    const [visibleAddItem, setVisibleAddItem] = useState(false); // State for Add Item dialog
    const [visibleUpdateItem, setVisibleUpdateItem] = useState(false); // State for Update Item dialog
    const [selectedItem, setSelectedItem] = useState(null); // Store the selected item for update
    const [items, setItems] = useState([]); // State to store items fetched from the server
    const [newItemName, setNewItemName] = useState(''); // State for new item name
    const [newItemDate, setNewItemDate] = useState(''); // State for new item date
    const navigate = useNavigate(); // Initialize useNavigate hook
    const toast = useRef(null);
    const location = useLocation();
    const { firebase_uid } = location.state || {};

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/'); // Redirect to Landing page if not logged in
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        setDisableButtons(true);
    }, [navigate]);

    useEffect(() => {
        const fetchItems = async () => {
            if (firebase_uid) {
                const user = {'firebase_uid': firebase_uid}
                // Make an Axios GET request to fetch items for the user
                try {
                    const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/user/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user),
                    });
        
                    
                    let data = await response.text(); // Use text to capture the full response
                    try {
                        const jsonData = JSON.parse(data);
                        data = jsonData // Attempt to parse as JSON
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        console.log('Response data:', data); // Log the raw response for debugging
                    }
                    setItems(data.items); // Update the state with the fetched items
                    console.log("items:", data.items);
                    setDisableButtons(false);
                } catch (error) {
                    console.error("Error fetching items:", error);
                }
            };
        }
        fetchItems();
    }, [firebase_uid]);

    const getTodayAt1159PM = () => {
        const now = new Date();
        now.setHours(23, 59, 0, 0); // Set time to 11:59 PM
        const offset = now.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(now.getTime() - offset);
        return adjustedDate.toISOString().slice(0, 16);; // Format to 'YYYY-MM-DDTHH:MM'
    };

    const convertToISODateTime = (str) => {
        return str.substring(0, 10) + "T" + str.substring(11)
    };

    const convertDateTimeString = (str) => {
        return str.substring(0, 10) + " " + str.substring(11)
    };

    const addItem = async () => {
        try {
            let stringDate = convertDateTimeString(newItemDate);
            const newItem = {
                'firebase_uid': firebase_uid,
                "item": {
                    "name": newItemName,
                    "date":  stringDate
                }
            };
            const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/item/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItem),
            });
            let data = await response.text(); // Use text to capture the full response
            try {
                const jsonData = JSON.parse(data);
                data = jsonData // Attempt to parse as JSON
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log('Response data:', data); // Log the raw response for debugging
            }

            console.log("Add result:", data);
            setItems(data.items); // Update the state with the new item
            setDisableButtons(false);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item added successfully', life: 3000 });
            setVisibleAddItem(false); // Close the dialog
        } catch (error) {
            setDisableButtons(false);
            console.error("Error adding item:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add item', life: 3000 });
        }
    };

    const handleAddClick = () => {
        setNewItemName(''); // Clear the input field
        setNewItemDate(getTodayAt1159PM()); // Set the date to today at 11:59 PM
        setDisableButtons(true);
        setVisibleAddItem(true); // Open the dialog
    };

    // Open update dialog and set selected item
    const handleUpdateClick = async (item) => {
        setVisibleUpdateItem(true); // Open update dialog
        setDisableButtons(true);
        item.date = convertToISODateTime(item.date);
        setSelectedItem(item); // Store the item to be updated
        setNewItemName(item.name); // Set the name to the selected item
        setNewItemDate(item.date); // Set the date to the selected item
    };

    const handleUpdateSubmit = async () => {
        setVisibleUpdateItem(false)
        let stringDate = convertDateTimeString(newItemDate);
        let oldStringDate = convertDateTimeString(selectedItem.date);
        const updateItem = {
            'firebase_uid': firebase_uid,
            "old_item": {
                "name": selectedItem.name,
                "date":  oldStringDate
            },
            "item": {
                "name": newItemName,
                "date":  stringDate
            },
        };
        const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/item/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateItem),
        });
        let data = await response.text(); // Use text to capture the full response
        try {
            const jsonData = JSON.parse(data);
            data = jsonData // Attempt to parse as JSON
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Response data:', data); // Log the raw response for debugging
        }

        console.log("Update result:", data);
        setItems(data.items); // Update the state with the new item
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item updated successfully', life: 3000 });
        setDisableButtons(false);
        setVisibleUpdateItem(false); // Open update dialog
    };

    const showSecondary = async (item) => {
        setDisableButtons(true)
        setSelectedItem(item); // Store the item to be updated
        let stringDate = convertDateTimeString(item.date);
        const updateItem = {
            'firebase_uid': firebase_uid,
            "item": {
                "name": item.name,
                "date":  stringDate
            },
        };
        const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/item/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateItem),
        });
        let data = await response.text(); // Use text to capture the full response
        try {
            const jsonData = JSON.parse(data);
            data = jsonData // Attempt to parse as JSON
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Response data:', data); // Log the raw response for debugging
        }

        console.log("Delete result:", data);
        setItems(data.items); // Update the state with the new item
        toast.current.show({ severity: 'info', summary: 'Item Deleted', detail: 'The item has been successfully deleted.', life: 3000 });
        setDisableButtons(false)
    };

    const actionBodyTemplate = (rowData) => {
        console.log("rowData in actionBodyTemplate:", rowData); // Debugging statement

        if (!rowData) {
            console.error("rowData is null or undefined");
            return null;
        }
        return (
            <>
                <Button label="Update" disabled={disableButton} onClick={() => handleUpdateClick(rowData)} style={{ marginRight: '5px' }} />
                <Button label="Delete" disabled={disableButton} onClick={() => showSecondary(rowData)} />
            </>
        );
    };

    const startContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <img src={MiniLogo} alt="Logo" className="landing-mini-logo" />
        </div>
    );

    // Logout function
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user from Firebase
            navigate('/'); // Redirect to the landing page
        } catch (error) {
            console.error("Error signing out:", error); // Handle errors
        }
    };

    const endContent = (
        <React.Fragment>
            <div className="flex align-items-center gap-2">
                <Button label="Logout" onClick={handleLogout} />
                <ThemeSwitcher />
            </div>
        </React.Fragment>
    );

    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisibleAddItem(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={addItem} />
        </div>
    );

    const updateFooterContent = (
        <div>
            <Button label="Update" icon="pi pi-check" onClick={handleUpdateSubmit} />
        </div>
    );

    return (
        <div>
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <h1 style={{ textAlign: 'center' }}>PantryPal</h1>
            <div className='landing-center'>
                <div className="datatable-container">
                    <DataTable value={items} >
                        <Column field="name" header="Item"></Column>
                        <Column field="date" header="Date" sortable></Column>
                        <Column body={actionBodyTemplate} header="Actions" />                    
                    </DataTable>
                    <Button label="Add Item" disabled={disableButton} className="add-item-button" onClick={handleAddClick} />
                </div>
            </div>

            {/* Dialog for Add Item */}
            <Dialog header="Add Item" visible={visibleAddItem} style={{ width: '50vw'}} onHide={() => {setVisibleAddItem(false); setDisableButtons(false);}} footer={footerContent} draggable={false} resizable={false}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="itemName">Item Name</label>
                        <input id="itemName" type="text" className="p-inputtext p-component" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="itemDate">Date</label>
                        <input id="itemDate" type="datetime-local" className="p-inputtext p-component" value={newItemDate} onChange={(e) => setNewItemDate(e.target.value)} />
                    </div>
                </div>
            </Dialog>
            {/* Dialog for Update Item */}
            <Dialog header="Update Item" visible={visibleUpdateItem} style={{ width: '50vw'}} onHide={() => {setVisibleUpdateItem(false); setDisableButtons(false);}} footer={updateFooterContent} draggable={false} resizable={false}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="updateItemName">Item Name</label>
                            <input
                                id="updateItemName"
                                type="text"
                                className="p-inputtext p-component"
                                defaultValue={selectedItem ? selectedItem.item : ''}
                                value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="updateItemDate">Date</label>
                            <input
                                id="updateItemDate"
                                type="datetime-local"
                                className="p-inputtext p-component"
                                defaultValue={selectedItem ? selectedItem.date : ''}
                                value={newItemDate} onChange={(e) => setNewItemDate(e.target.value)}
                            />
                        </div>
                    </div>
                </Dialog>
            <Toast ref={toast} />
        </div>
    );
};

export default Home;