import { put, call } from "redux-saga/effects";
import { routeWatcher } from "./routes.saga";
import asyncFlow from "./asyncHandler";
import { types as routes } from "../reducers/routes.actions";
import { actions } from "../reducers/home.actions";
import { request } from "../utils/api";
import { calculateAge } from "../utils/ageCalculator";

function* homeRouteWatcher() {
  yield routeWatcher(routes.HOME, function* () {
    yield put(actions.loadUsers.request());
  });
}

const loadUsers = asyncFlow({
  actionGenerator: actions.loadUsers,
  api: () => {
    return request({
      url: `/usuarios`,
      method: "get",
    });
  },
  preSuccess: function* ({ response }) {
    response.data = yield response.data.map((user) => ({
      ...user,
      idade: calculateAge(user.dataNascimento),
    }));

    response.data = yield response.data.sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));
  },
  postSuccess: ({ response }) => {
    console.log({ users: response.data });
  },
});

const deleteUser = asyncFlow({
  actionGenerator: actions.deleteUser,
  api: (payload) => {
    return request({
      url: `/usuarios/${payload.id}`,
      method: "delete",
    });
  },
  postSuccess: function* (result) {
    console.log("Delete successful");
    yield call(() => window.location.reload());
  },
  postFailure: function (error) {
    console.error("Delete failed:", error);
  }
});

export const sagas = [homeRouteWatcher(), loadUsers.watcher(), deleteUser.watcher()];