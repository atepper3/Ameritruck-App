// src/store/actions/truckActions.js
import { db } from '../../firebase';
import { 
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
    addDoc,
    deleteDoc,
} from 'firebase/firestore';
import {
    SET_TRUCK_DETAILS,
    SET_TRUCK_LIST,
    SET_EXPENSES,
    ADD_EXPENSE,
    DELETE_EXPENSE,
    UPDATE_EXPENSE, 
    SHOW_EXPENSE_MODAL,
    HIDE_EXPENSE_MODAL,
    SET_CURRENT_EXPENSE,
    SET_COMMISSIONS,
    ADD_COMMISSION,
    DELETE_COMMISSION,
    UPDATE_COMMISSION,
} from './actionTypes';

export const fetchTruckDetails = (id) => async dispatch => {
    const truckRef = doc(db, 'trucks', id);
    const docSnap = await getDoc(truckRef);

    if (docSnap.exists()) {
        dispatch({
            type: SET_TRUCK_DETAILS,
            payload: {...docSnap.data().truckinfo, id },
        });
    } else {
        console.log("No such document!");
    }
};

export const updateTruckDetails = (id, truckDetails) => async dispatch => {
    await updateDoc(doc(db, 'trucks', id), { truckinfo: truckDetails });
    dispatch(fetchTruckDetails(id));
};

export const fetchTruckList = () => async dispatch => {
    const truckInfoQuery = query(collection(db, "trucks"), where("truckinfo", "!=", null));
    const querySnapshot = await getDocs(truckInfoQuery);
    const trucksArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data().truckinfo,
    }));

    dispatch({
        type: SET_TRUCK_LIST,
        payload: trucksArray,
    });
};

// New action to fetch expenses for a specific truck
export const fetchExpenses = (truckId) => async (dispatch) => {
    const expensesRef = collection(db, 'trucks', truckId, 'expenses');
    const querySnapshot = await getDocs(expensesRef);
    const expenses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  
    dispatch({
      type: SET_EXPENSES,
      payload: expenses,
    });
  };
  
  // New action to add an expense for a specific truck
export const addExpense = (truckId, expenseData) => async (dispatch) => {
    await addDoc(collection(db, 'trucks', truckId, 'expenses'), expenseData);
    dispatch(fetchExpenses(truckId)); // Refresh the expenses list
  };
  
  // New action to delete an expense from a specific truck
export const deleteExpense = (truckId, expenseId) => async (dispatch) => {
    await deleteDoc(doc(db, 'trucks', truckId, 'expenses', expenseId));
    dispatch(fetchExpenses(truckId)); // Refresh the expenses list
  };

// Assuming a normalized state shape and modular structure
export const updateExpense = (truckId, expenseId, expenseData) => async (dispatch) => {
    // Update logic here (e.g., calling Firestore)
    const expenseRef = doc(db, 'trucks', truckId, 'expenses', expenseId);
    await updateDoc(expenseRef, expenseData);

    // Dispatch an action to update the state
    dispatch({
        type: UPDATE_EXPENSE,
        payload: { truckId, expenseId, expenseData },
    });

    // Additional logic for accounting integration or further updates
};

export const showExpenseModal = () => ({
    type: SHOW_EXPENSE_MODAL,
  });
  
export const hideExpenseModal = () => ({
    type: HIDE_EXPENSE_MODAL,
  });
  
export const setCurrentExpense = (expense) => ({
    type: SET_CURRENT_EXPENSE,
    payload: expense,
  });

export const fetchCommissions = (truckId) => async (dispatch) => {
    const commissionsRef = collection(db, 'trucks', truckId, 'commissions');
    const querySnapshot = await getDocs(commissionsRef);
    const commissions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched commissions data: ", commissions)
    dispatch({
      type: SET_COMMISSIONS,
      payload: commissions,
    });
};

export const addCommission = (truckId, commissionData) => async (dispatch) => {
    await addDoc(collection(db, 'trucks', truckId, 'commissions'), commissionData);
    dispatch(fetchCommissions(truckId)); // Refresh the commissions list
};

export const deleteCommission = (truckId, commissionId) => async (dispatch) => {
    await deleteDoc(doc(db, 'trucks', truckId, 'commissions', commissionId));
    dispatch(fetchCommissions(truckId)); // Refresh the commissions list
};

export const updateCommission = (truckId, commissionId, commissionData) => async (dispatch) => {
    const commissionRef = doc(db, 'trucks', truckId, 'commissions', commissionId);
    await updateDoc(commissionRef, commissionData);
    dispatch(fetchCommissions(truckId)); // Refresh the commissions list
};