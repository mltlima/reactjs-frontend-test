import { createSyncAction } from "../utils/actionCreators";

export const types = {
  HOME: "@@routes/home",
  USER: "@@routes/user",
  ADD_USER: 'ADD_USER',
};

export const actions = {
  redirectTo: (route, params = {}) => createSyncAction(route, params),
};
