import { actions } from "./user.actions";
import { types as routes } from "./routes.actions";

const initialState = {
  id: null,
  data: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case routes.USER:
      return {
        ...initialState,
        id: action.payload.id,
      };
    case routes.ADD_USER:
      return {
        ...initialState,
      };
    case actions.loadUser.REQUEST:
    case actions.loadUser.SUCCESS:
    case actions.loadUser.FAILURE:
      return {
        ...state,
        loading: action.type === actions.loadUser.REQUEST,
        data:
          action.type === actions.loadUser.SUCCESS
            ? action.payload.response.data
            : null,
      };
    case actions.clearUserData.type:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default reducer;
