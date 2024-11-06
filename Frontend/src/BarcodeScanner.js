import React, { useRef } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

//BarcodeScanner component to scan the barcode of a product
const BarcodeScanner = ({ visible, onHide, onScan }) => {
    const toast = useRef(null);

    //Function to handle the scan result
    const handleScan = async (err, result) => {
        if (err) {
            console.error('Scanning error:', err);
            return;
        }

        //Fetch product data from Open Food Facts API
        if (result) {
            try {
                const response = await fetch(`https://world.openfoodfacts.org/api/v3/product/${result.text}.json`);
                const data = await response.json();

                //Check if product data is valid
                if (data.product && data.product.product_name_en) {
                    onScan(data.product.product_name_en);
                    onHide();
                } else {
                    console.log('No valid product found:', data);
                    toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No valid product found. Please scan again.', life: 3000 });
                }
            } catch (error) {
                console.error('API fetch error:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch product data. Please try again.', life: 3000 });
            }
        }
    };

    return (
        <Dialog header="Barcode Scanner" visible={visible} onHide={onHide} style={{ width: '80vw' }} draggable={false} resizable={false}>
            <Toast ref={toast} />
            <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={handleScan}
            />
        </Dialog>
    );
};

export default BarcodeScanner;