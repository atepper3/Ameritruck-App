// src/store/actions/truckActions.js
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { SET_TRUCK_DETAILS, SET_TRUCK_LIST} from './actionTypes';

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