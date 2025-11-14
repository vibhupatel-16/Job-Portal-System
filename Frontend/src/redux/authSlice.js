import { createSlice } from '@reduxjs/toolkit';

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: userFromStorage,
  isLogin: !!userFromStorage,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
      localStorage.removeItem("user"); // ✅ remove from storage on logout
    },
  },
});

export const { setUser, setIsLogin, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
