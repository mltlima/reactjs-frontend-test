import { createAsyncAction } from "../utils/actionCreators";

export const actions = {
  loadUser: createAsyncAction("@user/LOAD"),
  saveUser: createAsyncAction("@user/SAVE"),
  clearUserData: createAsyncAction("@user/CLEAR_DATA"),
};
