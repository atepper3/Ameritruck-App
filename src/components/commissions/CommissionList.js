import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchCommissions,
  deleteCommission,
  setCurrentCommission,
  showCommissionModal,
  hideCommissionModal,
  addCommission,
  updateCommission,
  calculateCommissions,
} from "../../store/slices/commissionSlice";
import { fetchTruckDetails } from "../../store/slices/truckSlice";
import { Button, Table, Card } from "react-bootstrap";
import CommissionForm from "./CommissionForm"; // Ensure this is the correct path
import { fetchExpenses } from "../../store/slices/expenseSlice";

const CommissionList = () => {
  const { id: truckId } = useParams();
  const dispatch = useDispatch();
  const commissions = useSelector((state) => state.commission.commissions);
  const {
    totalBuyerCommissions,
    totalSellerCommissions,
    totalCommissions,
    netProfit = 0,
  } = useSelector((state) => state.commission.calculations || {});

  const totalExpenses = useSelector((state) => state.expense.totalExpenses);
  const truckInfo = useSelector((state) => state.truck.truckInfo);
  const showModal = useSelector((state) => state.commission.showModal);
  const currentCommission = useSelector(
    (state) => state.commission.currentCommission
  );

  useEffect(() => {
    dispatch(fetchCommissions(truckId));
    dispatch(fetchTruckDetails(truckId));
    dispatch(fetchExpenses(truckId));
  }, [dispatch, truckId]);

  useEffect(() => {
    if (truckInfo && totalExpenses != null) {
      const { purchasePrice, soldPrice } = truckInfo;
      dispatch(
        calculateCommissions({
          totalExpenses,
          purchasePrice,
          soldPrice,
        })
      );
    }
  }, [dispatch, truckInfo, totalExpenses]);

  const handleAddCommission = () => {
    dispatch(setCurrentCommission(null));
    dispatch(showCommissionModal());
  };

  const handleEditCommission = (commission) => {
    dispatch(setCurrentCommission(commission));
    dispatch(showCommissionModal());
  };

  const handleDeleteCommission = (commissionId) => {
    dispatch(deleteCommission({ truckId, commissionId }));
  };

  const handleCommissionSubmit = (commissionData) => {
    if (commissionData.id) {
      // Update existing commission
      dispatch(
        updateCommission({
          truckId,
          commissionId: commissionData.id,
          commissionData,
        })
      );
    } else {
      // Add new commission
      dispatch(
        addCommission({
          truckId,
          commissionData,
        })
      );
    }
    dispatch(hideCommissionModal());
  };

  const handleClose = () => {
    dispatch(hideCommissionModal());
  };

  return (
    <div>
      <Button variant="primary" onClick={handleAddCommission}>
        Add Commission
      </Button>
      {showModal && (
        <CommissionForm
          show={showModal}
          handleClose={handleClose}
          commissionData={currentCommission}
          truckId={truckId}
          onSubmit={handleCommissionSubmit}
        />
      )}

      {/* Buyer's Commissions Table */}
      <Card className="shadow mb-4">
        <Card.Header className="bg-transparent">Buyer Commissions</Card.Header>
        <Card.Body>
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commissions
                .filter((c) => c.category === "Buyer")
                .map((commission) => (
                  <tr key={commission.id}>
                    <td>{commission.name}</td>
                    <td>{commission.type}</td>
                    <td>
                      {typeof commission.amount === "number"
                        ? `$${commission.amount.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => handleEditCommission(commission)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteCommission(commission.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Seller's Commissions Table */}
      <Card className="shadow mb-4">
        <Card.Header className="bg-transparent">Seller Commissions</Card.Header>
        <Card.Body>
          <Table hover variant="dark">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commissions
                .filter((c) => c.category === "Seller")
                .map((commission) => (
                  <tr key={commission.id}>
                    <td>{commission.name}</td>
                    <td>{commission.type}</td>
                    <td>
                      {typeof commission.amount === "number"
                        ? `$${commission.amount.toFixed(2)}`
                        : "N/A"}
                    </td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => handleEditCommission(commission)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteCommission(commission.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Summary Table */}
      <Card className="shadow mb-4">
        <Card.Header className="bg-transparent">Summary</Card.Header>
        <Card.Body>
          <Table hover variant="dark">
            <tbody>
              <tr>
                <td>Total Buyer's Commissions</td>
                <td>${totalBuyerCommissions.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total Seller's Commissions</td>
                <td>${totalSellerCommissions.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Total Commissions</td>
                <td>${totalCommissions.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Net Profit</td>
                <td>${netProfit.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommissionList;
