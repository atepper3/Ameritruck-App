import {
  SET_TRUCK_DETAILS,
  SET_EXPENSES,
  ADD_EXPENSE,
  DELETE_EXPENSE,
  SET_COMMISSIONS,
  ADD_COMMISSION,
  DELETE_COMMISSION,
  SET_TRUCK_LIST
} from '../actions/actionTypes';

const initialState = {
  truckInfo: null,
  truckList: [],
  expenses: [],
  commissions: []
};

const truckReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRUCK_DETAILS:
      return {
        ...state,
        truckInfo: action.payload
      };
    case SET_TRUCK_LIST:
      return {
        ...state,
        truckList: action.payload
      };
    case SET_EXPENSES:
      return {
        ...state,
        expenses: action.payload
      };
    case ADD_EXPENSE:
      return {
        ...state,
        expenses: [...state.expenses, action.payload]
      };
    case DELETE_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    case SET_COMMISSIONS:
      return {
        ...state,
        commissions: action.payload
      };
    case ADD_COMMISSION:
      return {
        ...state,
        commissions: [...state.commissions, action.payload]
      };
    case DELETE_COMMISSION:
      return {
        ...state,
        commissions: state.commissions.filter(commission => commission.id !== action.payload)
      };
    default:
      return state;
  }
};

export default truckReducer;
