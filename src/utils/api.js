import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 120000,
  withCredentials: false,
});

export const request = async ({
  url,
  method,
  headers = undefined,
  queryParams = {},
  body,
  ...other
}) => {
  Object.keys(queryParams).forEach(
    (key) =>
      queryParams.hasOwnProperty(key) &&
      !queryParams[key] &&
      queryParams[key] !== false &&
      delete queryParams[key]
  );

  return instance.request({
    url,
    method,
    headers,
    ...other,
    params: queryParams,
    data: body,
  });
};

export default instance;

export const handleApiErrors = (response) => response;