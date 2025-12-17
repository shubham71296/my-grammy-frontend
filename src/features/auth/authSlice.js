import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  token: localStorage.getItem("token") || "",
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data;
        localStorage.setItem("token", action.payload.data);
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
      })
  },
});


export const signUp = createAsyncThunk(
  "user/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/signup", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Sign Up failed");
    }
  }
);

export const signIn = createAsyncThunk(
  "user/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/signin", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Sign In failed");
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/user/getcurrentuser", {
        headers: {
          Authorization: `Bearer ${token}`, // pass token here
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "failed to retrieve profile");
    }
  }
);

export const { logout } = userSlice.actions;
export default userSlice.reducer;
