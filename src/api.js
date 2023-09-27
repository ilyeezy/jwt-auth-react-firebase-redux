import axios from "axios";

import Cookies from "js-cookie";

import { apiKey } from "./utils/consts";

const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
export const $api = axios.create();

$api.interceptors.request.use((config) => {
  let params = new URLSearchParams();
  params.append("auth", Cookies.get("_AT"));
  config.params = params;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status == 401 &&
      error.config &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
          {
            grant_type: "refresh_token",
            refresh_token: Cookies.get("_RT"),
            withCredentials: true,
          },
        );

        Cookies.set("_AT", response.data["id_token"], {
          expires: oneHour,
          secure: true,
          withCredentials: true,
        });
        console.clear();
        return axios.request(originalRequest);
      } catch (error) {
        console.clear();
        return error;
      }
    }
  },
);
