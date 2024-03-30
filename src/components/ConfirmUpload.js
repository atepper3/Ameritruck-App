import React from 'react';

const ConfirmUpload = ({ trucks, onConfirm }) => {
    return (
        <div>
            <h3>Review Trucks Before Uploading</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Fleet Number</th>
                        <th>Customer</th>
                        <th>Sale Date</th>
                        <th>Year</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>VIN Serial</th>
                        <th>Location</th>
                        <th>Sold Price</th>
                    </tr>
                </thead>
                <tbody>
                    {trucks.map((truck, index) => (
                        <tr key={index}>
                            <td>{truck.truckinfo.fleetNumber}</td>
                            <td>{truck.truckinfo.customer}</td>
                            <td>{truck.truckinfo.saleDate}</td>
                            <td>{truck.truckinfo.year}</td>
                            <td>{truck.truckinfo.make}</td>
                            <td>{truck.truckinfo.model}</td>
                            <td>{truck.truckinfo.vinSerial}</td>
                            <td>{truck.truckinfo.location}</td>
                            <td>{truck.truckinfo.soldPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={onConfirm} className="btn btn-success">Confirm and Upload</button>
        </div>
    );
};

export default ConfirmUpload;
