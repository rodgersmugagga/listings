import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      // Normalize user object for all login types
      const normalizedUser = {
        ...action.payload,
        user: {
          ...action.payload.user,
          _id: action.payload.user._id || action.payload.user.id,
          username: action.payload.user.username || action.payload.user.name,
        },
      };
      state.currentUser = normalizedUser;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },

    updateUserAvatar: (state, action) => {
      if (state.currentUser?.user) {
        state.currentUser.user.avatar = action.payload;
        
      }
    },

  },
});

export const { signInStart, signInSuccess, signInFailure, signOut, updateUserAvatar} = userSlice.actions;
export default userSlice.reducer;
