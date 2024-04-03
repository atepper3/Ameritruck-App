import React, { createContext, useContext, useState } from 'react';

const TruckContext = createContext();

export const useTruck = () => useContext(TruckContext);

export const TruckProvider = ({ children }) => {
  const [truckDetails, setTruckDetails] = useState(null);

  return (
    <TruckContext.Provider value={{ truckDetails, setTruckDetails }}>
      {children}
    </TruckContext.Provider>
  );
};
