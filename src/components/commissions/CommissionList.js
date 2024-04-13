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
  }, [dispatch, truckId]);

  useEffect(() => {
    if (truckInfo && totalExpenses != null) {
      const { purchasePrice, salePrice } = truckInfo;
      dispatch(
        calculateCommissions({
          totalExpenses,
          purchasePrice,
          salePrice,
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
    if (!currentCommission) {
      dispatch(addCommission({ truckId, commissionData }));
    } else {
      dispatch(
        updateCommission({
          truckId,
          commissionId: currentCommission.id,
          commissionData,
        })
      );
    }
    dispatch(hideCommissionModal());
  };

  const handleClose = () => {
    dispatch(hideCommissionModal());
  };

  const commissionCategories = [
    { title: "Buyer Commissions", role: "Buyer" },
    { title: "Seller Commissions", role: "Seller" },
  ];

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

      {commissionCategories.map(({ title, role }) => (
        <Card key={title} className="shadow mb-4">
          <Card.Header className="bg-transparent">{title}</Card.Header>
          <Card.Body>
            <Table hover variant="dark">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {commissions
                  .filter((c) => c.role === role)
                  .map((commission) => (
                    <tr key={commission.id}>
                      <td>{commission.type}</td>
                      <td>{commission.name}</td>
                      <td>${commission.amount.toFixed(2)}</td>
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
      ))}

      {/* Totals and Net Profit Card */}
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
