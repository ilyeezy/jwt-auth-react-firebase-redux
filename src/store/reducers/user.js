import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { db, storage } from "../../firebase";
import { ref, remove, set } from "firebase/database";
import {
  uploadBytes,
  ref as refStorage,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { $api } from "../../api";

const initialState = {
  userID: localStorage.getItem("userID"),
  loading: false,
  userInfo: {},
  loadingPhoto: false,
  defaultImg:
    "https://firebasestorage.googleapis.com/v0/b/authorization-18f1a.appspot.com/o/default.jpg?alt=media&token=8322aff5-5fcd-4e6f-8fc7-f6b425fe28dd",
};
export const getUserById = createAsyncThunk(
  "user/getById",
  async function (arg, { rejectWithValue }) {
    try {
      const response = await $api.get(
        `https://authorization-18f1a-default-rtdb.europe-west1.firebasedatabase.app/users.json`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const addPhoto = createAsyncThunk(
  "user/addPhoto",
  async function (file) {
    try {
      const storageRef = refStorage(storage, file.name);
      uploadBytes(storageRef, file);
      const delay = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      };
      let imgUrl = await delay(1000);
      imgUrl = await getDownloadURL(storageRef, file.name);
      return imgUrl;
    } catch (error) {
      console.log(error);
    }
  },
);
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removePhoto: (state) => {
      remove(ref(db, "users/" + state.userID + "/imgUrl"), state.userInfo);
    },
    saveChanges: (state) => {
      set(ref(db, "users/" + state.userID), state.userInfo);
    },
    handleInput: (state, action) => {
      state.userInfo[action.payload.key] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.loading = false;

      state.userInfo = action.payload[state.userID];
    });
    builder.addCase(getUserById.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(addPhoto.pending, (state) => {
      state.loadingPhoto = true;
    });
    builder.addCase(addPhoto.fulfilled, (state, action) => {
      state.loadingPhoto = false;

      state.userInfo = { ...state.userInfo, imgUrl: action.payload };
    });
    builder.addCase(addPhoto.rejected, (state) => {
      state.loadingPhoto = false;
    });
  },
});
export const { removePhoto, saveChanges, handleInput } = userSlice.actions;
export default userSlice;
