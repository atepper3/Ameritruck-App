import {
  SET_TRUCK_DETAILS,
  SET_EXPENSES,
  ADD_EXPENSE,
  DELETE_EXPENSE,
  UPDATE_EXPENSE,
  SET_COMMISSIONS,
  ADD_COMMISSION,
  DELETE_COMMISSION,
  UPDATE_COMMISSION,
  SET_TRUCK_LIST,
  SHOW_EXPENSE_MODAL,
  HIDE_EXPENSE_MODAL,
  SET_CURRENT_EXPENSE,
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
    case UPDATE_EXPENSE: {
      const updatedExpenses = state.expenses.map(expense =>
        expense.id === action.payload.expenseId ? { ...expense, ...action.payload.expenseData } : expense
      );

      return {
        ...state,
        expenses: updatedExpenses,
      };
    }
    case SHOW_EXPENSE_MODAL:
    return {
      ...state,
      isExpenseModalOpen: true,
    };
    case HIDE_EXPENSE_MODAL:
      return {
        ...state,
        isExpenseModalOpen: false,
      };
    case SET_CURRENT_EXPENSE:
      return {
        ...state,
        currentExpense: action.payload,
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
        // Assuming the payload is the commissionId to delete
        return {
          ...state,
          commissions: state.commissions.filter(commission => commission.id !== action.payload),
        };
      case UPDATE_COMMISSION:
        // Assuming the payload includes { id, ...commissionData }
        return {
          ...state,
          commissions: state.commissions.map(commission =>
            commission.id === action.payload.id ? { ...commission, ...action.payload.commissionData } : commission
          ),
        };
      default:
        return state;
    }
  };
  
  export default truckReducer;