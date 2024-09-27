import { put, select } from "redux-saga/effects";
import { routeWatcher } from "./routes.saga";
import asyncFlow from "./asyncHandler";
import {
  types as routes,
  actions as routeActions,
} from "../reducers/routes.actions";
import { actions } from "../reducers/user.actions";
import { request } from "../utils/api";
import { calculateAge } from "../utils/ageCalculator";

function* userRouteWatcher() {
  yield routeWatcher(routes.USER, function* () {
    yield put(actions.loadUser.request());
  });
}

const loadUser = asyncFlow({
  actionGenerator: actions.loadUser,
  transform: function* () {
    const id = yield select((state) => state.user.id);
    return { id };
  },
  api: (values) => {
    return request({
      url: `/usuarios/${values.id}`,
      method: "get",
    });
  },
  preSuccess: function* ({ response }) {
    const user = response.data;
    if (user) {
      response.data = {
        ...user,
        idade: calculateAge(user.dataNascimento),
      };
    }
  },
  postSuccess: function* ({ response }) {
    console.log({ user: response.data });
  },
});

const saveUser = asyncFlow({
  actionGenerator: actions.saveUser,
  transform: function* (payload) {
    const id = yield select((state) => state.user.id);
    return { id, ...payload };
  },
  api: ({ id, ...values }) => {
    const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    if (cleanedValues.dataNascimento) {
      if (cleanedValues.dataNascimento instanceof Date) {
        cleanedValues.dataNascimento = cleanedValues.dataNascimento.toISOString().split('T')[0];
      } else if (typeof cleanedValues.dataNascimento === 'string' && cleanedValues.dataNascimento.trim() !== '') {
        cleanedValues.dataNascimento = new Date(cleanedValues.dataNascimento).toISOString().split('T')[0];
      } else {
        delete cleanedValues.dataNascimento;
      }
    }

    return request({
      url: `/usuarios/${id}`,
      method: "put",
      body: cleanedValues,
    });
  },
  postSuccess: function* () {
    yield put(routeActions.redirectTo(routes.HOME));
  },
});

export const sagas = [
  userRouteWatcher(),
  loadUser.watcher(),
  saveUser.watcher(),
];