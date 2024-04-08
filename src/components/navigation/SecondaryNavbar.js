// SecondaryNavbar.js
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./SecondaryNavbar.css";

const SecondaryNavbar = () => {
  const truckDetails = useSelector((state) => state.truck.truckInfo);

  if (!truckDetails) {
    return null; // Don't display if no truck is selected
  }

  // Destructure the details you need from the truckDetails
  const { stockNumber, year, make, model } = truckDetails;

  return (
    <div className="secondary-navbar">
      {/* Display the truck details before the links */}
      <div className="truck-info">
        {stockNumber} - {year} {make} {model}
      </div>
      <div className="nav-links">
        <Link to={`/truck/${truckDetails.id}/info`}>Detailed Info</Link>
        <Link to={`/truck/${truckDetails.id}/expenses`}>Expenses</Link>
        <Link to={`/truck/${truckDetails.id}/commissions`}>Commissions</Link>
      </div>
    </div>
  );
};

export default SecondaryNavbar;
