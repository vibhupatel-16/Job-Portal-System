import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLogin: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLogin = !!action.payload;
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
    },
  },
});

export const { setUser, setIsLogin, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
