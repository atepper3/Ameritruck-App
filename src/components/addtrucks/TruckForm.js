import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { addTruck } from "../../store/actions/truckActions"; // Import your action creator
import { toast } from "react-toastify";

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
      {" "}
      {/* Reduced top margin */}
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card shadow mt-2">
            {" "}
            {/* Added a shadowed card for consistency */}
            <div className="card-header bg-transparent text-center">
              <h2 className="mb-0">Add New Truck</h2> {/* Centered title */}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Stock Number:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="stockNumber"
                      value={truckData.stockNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Fleet Number:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="fleetNumber"
                      value={truckData.fleetNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Status:</label>
                    <select
                      className="form-control"
                      name="status"
                      value={truckData.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Future">Future</option>
                      <option value="Pending">Pending</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Sale Type:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="saleType"
                      value={truckData.saleType}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Purchase Date:</label>
                    <input
                      className="form-control"
                      type="date"
                      name="purchaseDate"
                      value={truckData.purchaseDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Purchased From:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="purchasedFrom"
                      value={truckData.purchasedFrom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Purchase Price:</label>
                    <input
                      className="form-control"
                      type="number"
                      name="purchasePrice"
                      value={truckData.purchasePrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Buyer:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="buyer"
                      value={truckData.buyer}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Year:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="year"
                      value={truckData.year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Make:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="make"
                      value={truckData.make}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Model:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="model"
                      value={truckData.model}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">VIN/Serial:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="vinSerial"
                      value={truckData.vinSerial}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Classification:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="classification"
                      value={truckData.classification}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Location:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="location"
                      value={truckData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Truck Here?</label>
                    <select
                      className="form-control"
                      name="truckHere"
                      value={truckData.truckHere}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Title In:</label>
                    <select
                      className="form-control"
                      name="titleIn"
                      value={truckData.titleIn}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Title Note:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="titleNote"
                      value={truckData.titleNote}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Close Type:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="closeType"
                      value={truckData.closeType}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Customer:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="customer"
                      value={truckData.customer}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Sale Date:</label>
                    <input
                      className="form-control"
                      type="date"
                      name="saleDate"
                      value={truckData.saleDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Sold Price:</label>
                    <input
                      className="form-control"
                      type="number"
                      name="soldPrice"
                      value={truckData.soldPrice}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Salesman:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="salesman"
                      value={truckData.salesman}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Funded Date:</label>
                    <input
                      className="form-control"
                      type="date"
                      name="fundedDate"
                      value={truckData.fundedDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Funding Type:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="fundingType"
                      value={truckData.fundingType}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Referral Source:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="referralSource"
                      value={truckData.referralSource}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Title Out:</label>
                    <select
                      className="form-control"
                      name="titleOut"
                      value={truckData.titleOut}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="col-md-3 mb-3">
                    <label className="form-label">Title Out Note:</label>
                    <input
                      className="form-control"
                      type="text"
                      name="titleOutNote"
                      value={truckData.titleOutNote}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Comments:</label>
                    <textarea
                      className="form-control"
                      name="comments"
                      rows="1"
                      value={truckData.comments}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

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
