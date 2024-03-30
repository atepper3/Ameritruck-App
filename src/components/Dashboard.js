// src/components/Dashboard.js
import React, { useState } from 'react';
import TruckList from './TruckList';
import ExcelUpload from './ExcelUpload';
import ConfirmUpload from './ConfirmUpload'; // Make sure to import ConfirmUpload
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Dashboard = () => {
  const [trucksToConfirm, setTrucksToConfirm] = useState([]);

  const handleFileLoaded = (data) => {
    // Parsing logic as before, but instead of uploading directly to Firebase:
    setTrucksToConfirm(data); // Assuming 'data' is already in the correct format
  };

  const handleConfirmUpload = async () => {
    // Upload logic as before, iterating over trucksToConfirm
    for (const truckData of trucksToConfirm) {
      try {
        await addDoc(collection(db, "trucks"), truckData);
        // Log success or handle UI feedback
      } catch (error) {
        console.error("Error adding truck: ", error);
        // Handle errors appropriately
      }
    }

    alert(`${trucksToConfirm.length} trucks have been added to the database.`);
    setTrucksToConfirm([]); // Reset after upload
  };

  return (
    <div>
      <h1 className="text-center mb-4">Truck Inventory Dashboard</h1>
      <div className="mb-3">
        <ExcelUpload onFileLoaded={handleFileLoaded} />
      </div>
      {trucksToConfirm.length > 0 && (
        <ConfirmUpload trucks={trucksToConfirm} onConfirm={handleConfirmUpload} />
      )}
      <TruckList />
    </div>
  );
};

export default Dashboard;
