// src/store/actions/truckActions.js
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  SET_TRUCK_DETAILS,
  // Import other action types as needed
} from './actionTypes';

export const fetchTruckDetails = (id) => async dispatch => {
    const truckRef = doc(db, 'trucks', id);
    const docSnap = await getDoc(truckRef);

    if (docSnap.exists()) {
        dispatch({
            type: SET_TRUCK_DETAILS,
            payload: docSnap.data().truckinfo,
        });
    } else {
        console.log("No such document!");
    }
};

export const updateTruckDetails = (id, truckDetails) => async dispatch => {
    await updateDoc(doc(db, 'trucks', id), { truckinfo: truckDetails });
    dispatch(fetchTruckDetails(id));
};
