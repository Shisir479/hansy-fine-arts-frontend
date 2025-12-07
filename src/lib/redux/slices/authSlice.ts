import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/types/User";
import { RootState } from "../store";

type TAuthState = {
  user: User | null;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user || action.payload;
      state.token = token || null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// Exporting actions
export const { setUser, logoutUser } = authSlice.actions;

// Export Selector
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentUser = (state: RootState) => state.auth.user;

// Exporting default reducers
export default authSlice.reducer;
