import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiKey } from "../../utils/consts";
import axios from "axios";
import { errorNotify, successNotify } from "../../utils/notify";
import Cookies from "js-cookie";

const initialState = {
  userInfo: {},
  loading: false,
};

export const auTh = createAsyncThunk(
  "auth",
  async function (arg, { rejectWithValue, getState }) {
    try {
      const stringUrl = arg.type === "signUp" ? "signUp" : "signInWithPassword";
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`,
        {
          ...arg.user,

          returnSecureToken: true,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(auTh.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(auTh.fulfilled, (state, action) => {
      successNotify("Вход выполнен успешно");
      state.loading = false;
      const oneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
      Cookies.set("_AT", `${action.payload.idToken}`, {
        expires: oneHour,
        secure: true,
      });
      Cookies.set("_RT", `${action.payload.refreshToken}`, {
        expires: 30,
        secure: true,
      });

      state.userInfo = action.payload;
    });
    builder.addCase(auTh.rejected, (state, action) => {
      state.loading = false;

      const errorMessage = action.payload.error.message;

      console.clear();
      switch (errorMessage) {
        case "EMAIL_EXISTS":
          errorNotify("Такой Email уже зарегестрирован");
          break;
        case "OPERATION_NOT_ALLOWED":
          errorNotify("Для этого проекта отключен вход с паролем.");
          break;
        case "MISSING_PASSWORD":
          errorNotify("Введите пароль");
          break;
        case "INVALID_EMAIL":
          errorNotify("Введите Email");
          break;
        case "WEAK_PASSWORD : Password should be at least 6 characters":
          errorNotify("Пароль должен быть не меньше 6 символов");
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          errorNotify(
            "Mы заблокировали все запросы с этого устройства из-за необычной активности. Попробуйте позже.",
          );
          break;
        case "EMAIL_NOT_FOUND":
          errorNotify("Такого Email  не существует");
          break;
        default:
          errorNotify("Произошла ошибка");
          break;
      }
    });
  },
});

export default authSlice;
