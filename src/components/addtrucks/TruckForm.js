import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { addTruck } from "../../store/slices/truckSlice"; // Import your action creator
import { toast } from "react-toastify";
import { truckFormFields } from "./truckFormFields";

const TruckForm = () => {
  const initialState = {
    stockNumber: "",
    fleetNumber: "",
    status: "",
    saleType: "",
    purchaseDate: "",
    purchasedFrom: "",
    purchasePrice: "",
    buyer: "",
    year: "",
    make: "",
    model: "",
    vinSerial: "",
    classification: "",
    location: "",
    truckHere: "",
    titleIn: "",
    titleNote: "",
    closeType: "",
    customer: "",
    saleDate: "",
    soldPrice: "",
    salesman: "",
    fundedDate: "",
    fundingType: "",
    referralSource: "",
    titleOut: "",
    titleOutNote: "",
    comments: "",
  };

  const [truckData, setTruckData] = useState(initialState);
  const dispatch = useDispatch(); // Initialize useDispatch

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTruckData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <select
          className="form-control"
          name={field.name}
          value={truckData[field.name]}
          onChange={handleChange}
          required={field.required}
        >
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    } else {
      // Assumes text, number, date, etc.
      return (
        <input
          className="form-control"
          type={field.type}
          name={field.name}
          value={truckData[field.name]}
          onChange={handleChange}
          required={field.required}
        />
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addTruck(truckData)); // Dispatch the addTruck action with truckData structured for a subfield

    // Reset form fields after successful addition
    setTruckData(initialState);

    // UI feedback using react-toastify
    toast.success("Truck added successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Form component below...
  return (
    <div className="container mt-1">
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card shadow mt-2">
            <div className="card-header bg-transparent text-center">
              <h2 className="mb-0">Add New Truck</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {truckFormFields.map((row, rowIndex) => (
                  <div className="row" key={rowIndex}>
                    {row.map((field) => (
                      <div key={field.name} className={field.className}>
                        <label className="form-label">{field.label}:</label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                ))}
                <div className="row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-custom">
                      Add Truck
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckForm;
