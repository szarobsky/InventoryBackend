import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import 'primereact/resources/primereact.min.css';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './Landing.css'; // Custom CSS file
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import MiniLogo from '../assets/MiniLogo.png'
import { Toast } from 'primereact/toast';
import ThemeSwitcher from '../SwitchTheme';

//Home page component
const Home = () => {
    const [disableButton, setDisableButtons] = useState(false)
    const [visibleAddItem, setVisibleAddItem] = useState(false);
    const [visibleUpdateItem, setVisibleUpdateItem] = useState(false);
    const [visibleRecipe, setVisibleRecipe] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [items, setItems] = useState([]); 
    const [newItemName, setNewItemName] = useState(''); 
    const [newItemDate, setNewItemDate] = useState('');
    const [searchString, setSearchString] = useState('');
    const [recipe,  setRecipe] = useState('');
    const navigate = useNavigate();
    const toast = useRef(null);
    const location = useLocation();
    const { firebase_uid, csrfToken } = location.state || {};

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Check if this cookie string begins with the name we want
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    //Redirect to landing page if not logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    //Disable buttons on page load
    useEffect(() => {
        setDisableButtons(true);
    }, [navigate]);

    //Fetch items for user
    useEffect(() => {
        const fetchItems = async () => {
            if (firebase_uid) {
                const user = {'firebase_uid': firebase_uid}
                let csrf = getCookie('csrftoken')
                if (csrf === null) {
                    csrf = csrfToken;
                }
                console.log("CSRF Token:", csrf);
                try {
                    const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/user/', {
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrf,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(user),
                        credentials: 'include'  
                    });
                    let data = await response.text();

                    //Attempt to parse as JSON
                    try {
                        const jsonData = JSON.parse(data);
                        data = jsonData;
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        console.log('Response data:', data);
                    }

                    //Update items state with fetched items
                    setItems(data.items);
                    console.log("items:", data.items);
                    setDisableButtons(false);
                } catch (error) {
                    setDisableButtons(false);
                    console.error("Error fetching items:", error);
                    toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to fetch items: ${error.message}`, life: 3000 });
                }
            };
        }
        fetchItems();
    }, [firebase_uid,  csrfToken]);


    //Get today's date at 11:59 PM
    const getTodayAt1159PM = () => {
        const now = new Date();
        now.setHours(23, 59, 0, 0); // Set time to 11:59 PM
        const offset = now.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(now.getTime() - offset);
        return adjustedDate.toISOString().slice(0, 16);; // Format to 'YYYY-MM-DDTHH:MM'
    };

    //Convert date time string to ISO format
    const convertToISODateTime = (str) => {
        return str.substring(0, 10) + "T" + str.substring(11)
    };

    //Convert ISO date time string to date time string
    const convertDateTimeString = (str) => {
        return str.substring(0, 10) + " " + str.substring(11)
    };

    //Add item to the database
    const addItem = async () => {
        setVisibleAddItem(false);
        try {
            let stringDate = convertDateTimeString(newItemDate);
            const newItem = {
                'firebase_uid': firebase_uid,
                "item": {
                    "name": newItemName,
                    "date":  stringDate
                }
            };
            let csrf = getCookie('csrftoken')
            if (csrf === null) {
                csrf = csrfToken;
            }
            console.log("CSRF Token:", csrf);
            const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/item/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem),
                credentials: 'include'
            });
            let data = await response.text();

            //Attempt to parse as JSON
            try {
                const jsonData = JSON.parse(data);
                data = jsonData;
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log('Response data:', data); 
                toast.current.show({ severity: 'error', summary: 'Error', detail: ['Failed to add item: ', error], life: 3000 });
                setDisableButtons(false);
                return
            }
            console.log("Add result:", data);

            //Update items state with new item
            setItems(data.items);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item added successfully', life: 3000 });
            setDisableButtons(false);
        } catch (error) {
            console.error("Error adding item:", error);
            setDisableButtons(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to add item: ${error.message}`, life: 3000 });
        }
    };

    //Open add item dialog and set date to today at 11:59 PM
    const handleAddClick = () => {
        setNewItemName(''); // Clear the input field
        setNewItemDate(getTodayAt1159PM()); // Set the date to today at 11:59 PM
        setDisableButtons(true);
        setVisibleAddItem(true); // Open the dialog
    };

    //Open update dialog and set selected item
    const handleUpdateClick = async (item) => {
        setVisibleUpdateItem(true);
        setDisableButtons(true);
        item.date = convertToISODateTime(item.date);
        setSelectedItem(item);
        setNewItemName(item.name);
        setNewItemDate(item.date); 
    };

    //Generate a recipe based on the items in the database
    const generateRecipe = async () => {
        try {
            const user = {'firebase_uid': firebase_uid};
            let csrf = getCookie('csrftoken');
            if (csrf === null) {
                csrf = csrfToken;
            }
            console.log("CSRF Token:", csrf);
            const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/recipe/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
                credentials: 'include'  
            });
            let data = await response.text();

            //Attempt to parse as JSON
            try {
                const jsonData = JSON.parse(data);
                data = jsonData;
            } catch (error) {
                console.error('Error parsing JSON:', error);
                console.log('Response data:', data);
            }
            console.log(data);
            setRecipe(marked(data, { sanitize: true }));
            setVisibleRecipe(true);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to fetch recipe: ${error.message}`, life: 3000 });
        }
    };

    //Update item in the database
    const updateItem = async () => {
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
        let csrf = getCookie('csrftoken')
        if (csrf === null) {
            csrf = csrfToken;
        }
        console.log("CSRF Token:", csrf);
        const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/item/', {
            method: 'PUT',
            headers: {
                'X-CSRFToken': csrf,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateItem),
            credentials: 'include'
        });
        let data = await response.text();

        //Attempt to parse as JSON
        try {
            const jsonData = JSON.parse(data);
            data = jsonData;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Response data:', data);
            setDisableButtons(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to update item: ${error.message}`, life: 3000 });
            return;
        }
        console.log("Update result:", data);

        //Update items state with updated item
        setItems(data.items);
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Item updated successfully', life: 3000 });
        setDisableButtons(false);
    };

    //Delete item from the database
    const deleteItem = async (item) => {
        setDisableButtons(true)
        setSelectedItem(item);
        let stringDate = convertDateTimeString(item.date);
        const updateItem = {
            'firebase_uid': firebase_uid,
            "item": {
                "name": item.name,
                "date":  stringDate
            },
        };
        let csrf = getCookie('csrftoken')
        if (csrf === null) {
            csrf = csrfToken;
        }
        const response = await fetch('https://inventorykh2024-backend-fta8gwhqhwgqfchv.eastus-01.azurewebsites.net/item/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify(updateItem),
            credentials: 'include'
        });
        let data = await response.text();

        //Attempt to parse as JSON
        try {
            const jsonData = JSON.parse(data);
            data = jsonData;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Response data:', data);
            setDisableButtons(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to delete item: ${error.message}`, life: 3000 });
            return;
        }
        console.log("Delete result:", data);

        //Update items state with updated items
        setItems(data.items);
        toast.current.show({ severity: 'info', summary: 'Item Deleted', detail: 'The item has been successfully deleted.', life: 3000 });
        setDisableButtons(false)
    };

    //Action body template for the DataTable
    const actionBodyTemplate = (rowData) => {
        console.log("rowData in actionBodyTemplate:", rowData);
        if (!rowData) {
            console.error("rowData is null or undefined");
            return null;
        }
        return (
            <>
                <Button label="Update" disabled={disableButton} onClick={() => handleUpdateClick(rowData)} style={{ marginRight: '5px' }} />
                <Button label="Delete" disabled={disableButton} onClick={() => deleteItem(rowData)} />
            </>
        );
    };

    //Start content for the toolbar
    const startContent = (
        <div className="flex flex-wrap align-items-center gap-3">
            <img src={MiniLogo} alt="Logo" className="landing-mini-logo" />
        </div>
    );

    //Logout function
    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out the user from Firebase
            navigate('/'); // Redirect to the landing page
        } catch (error) {
            console.error("Error signing out:", error); // Handle errors
        }
    };

    //End content for the toolbar
    const endContent = (
        <React.Fragment>
            <div className="flex align-items-center gap-2">
                <Button label="Logout" onClick={handleLogout} />
                <ThemeSwitcher />
            </div>
        </React.Fragment>
    );

    //Footer content for the Add Item dialog
    const footerContent = (
        <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setVisibleAddItem(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={addItem} />
        </div>
    );

    //Footer content for the Update Item dialog
    const updateFooterContent = (
        <div>
            <Button label="Update" icon="pi pi-check" onClick={updateItem} />
        </div>
    );

    //Render the Home component
    return (
        <div>
            <Toolbar start={startContent} end={endContent} className="toolbar" />
            <h1 style={{ textAlign: 'center' }}>PantryPal</h1>
            <div className='landing-center'>
                <div className="datatable-container">
                    <input
                        type="text"
                        placeholder="Search item name"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <DataTable value={items.filter(item => item.name.toLowerCase().includes(searchString.toLowerCase()))} emptyMessage="No items">
                        <Column field="name" header="Item"></Column>
                        <Column field="date" header="Date" sortable></Column>
                        <Column body={actionBodyTemplate} header="Actions" />                 
                    </DataTable>
                    <div class="button-container">
                        <Button label="Add Item" disabled={disableButton} className="add-item-button" onClick={handleAddClick} />
                        <Button label="Generate Recipe" disabled={disableButton} className="add-item-button" onClick={generateRecipe}/>
                    </div>
                </div>
            </div>
            <Dialog header="Add Item" visible={visibleAddItem} style={{ width: '70vw'}} onHide={() => {setVisibleAddItem(false); setDisableButtons(false);}} footer={footerContent} draggable={false} resizable={false}>
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
            <Dialog header="Update Item" visible={visibleUpdateItem} style={{ width: '70vw'}} onHide={() => {setVisibleUpdateItem(false); setDisableButtons(false);}} footer={updateFooterContent} draggable={false} resizable={false}>
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
            <Dialog header="Recipe" visible={visibleRecipe} style={{ width: '70vw'}} onHide={() => {setVisibleRecipe(false);}} draggable={false} resizable={false}>
                <div className="p-fluid">
                    <div className="p-field">
                        <div dangerouslySetInnerHTML={{ __html: recipe }} />
                    </div>
                </div>
            </Dialog>
            <Toast ref={toast} />
        </div>
    );
};

//Export the Home component
export default Home;