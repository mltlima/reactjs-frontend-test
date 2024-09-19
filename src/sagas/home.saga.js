import { put } from "redux-saga/effects";
import { routeWatcher } from "./routes.saga";
import asyncFlow from "./asyncHandler";
import { types as routes } from "../reducers/routes.actions";
import { actions } from "../reducers/home.actions";
import { request } from "../utils/api";
import usersMock from "./users.mock";
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
      isMock: true,
      mockResult: usersMock,
    });
  },
  preSuccess: function* ({ response }) {
    response.data = response.data.map((user) => ({
      ...user,
      idade: calculateAge(user.dataNascimento),
    }));

    // Ordenar os usuários pela data de nascimento (mais velhos primeiro)
    response.data.sort((a, b) => new Date(a.dataNascimento) - new Date(b.dataNascimento));
  },
  postSuccess: function* ({ response }) {
    console.log({ users: response.data });
  },
});

export const sagas = [homeRouteWatcher(), loadUsers.watcher()];