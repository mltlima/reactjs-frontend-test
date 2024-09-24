import { actions } from "./home.actions";

const initialState = {
  data: [],
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.loadUsers.REQUEST:
    case actions.loadUsers.SUCCESS:
    case actions.loadUsers.FAILURE:
      return {
        ...state,
        loading: action.type === actions.loadUsers.REQUEST,
        data:
          action.type === actions.loadUsers.SUCCESS
            ? action.payload.response.data
            : [],
      };
      case actions.deleteUser.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case actions.deleteUser.SUCCESS:
      return {
        ...state,
        loading: false,
        data: state.data.filter((user) => user.id !== action.payload.id),
      };
    case actions.deleteUser.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};

export default reducer;
