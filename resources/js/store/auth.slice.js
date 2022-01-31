import { createSlice } from '@reduxjs/toolkit';
import AuthService from '../services/AuthService';
import authAxios from '../services/authAxios';

const user = AuthService.getCurrentUser();

const initialState = user
  ? {
    currentUser: user,
    isLoggedIn: true,
    errors: {},
  }
  : {
    currentUser: null,
    isLoggedIn: false,
    errors: {},
  };

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.currentUser = payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
    setErrors: (state, { payload }) => {
      state.errors = payload;
    },
    clearErrors: (state) => {
      state.errors = null;
    },
  },
});

export const selectAuth = (state) => state.auth;

export const { setUser, clearUser, setErrors, clearErrors } = userSlice.actions;
export default userSlice.reducer;

// Thunks
export const register =
  ({ name, email, password, password_confirmation }) =>
    async (dispatch) => {
      try {
        // const csrf = await authAxios.get('/sanctum/csrf-cookie');
        const { data } = await AuthService.register(
          name,
          email,
          password,
          password_confirmation
        );
        //  console.log('Register data', data);
        dispatch(setUser(data.user || data.username || data.id));
        return data;
      } catch (err) {
        dispatch(setErrors(err.response.data.errors));
      }
    };

export const login =
  ({ name, password }) =>
    async (dispatch) => {
      try {
        // const csrf = await authAxios.get('/sanctum/csrf-cookie');
        const { data } = await AuthService.login(name, password);
        //  console.log('Login data', data);
        dispatch(setUser(data.user || data.username || data.id));
        return data;
      } catch (err) {
        dispatch(setErrors(err.response.data.errors));
      }
    };

export const logout = () => async (dispatch) => {
  try {
    // const csrf = await authAxios.get('/sanctum/csrf-cookie');
    await AuthService.logout();
    dispatch(clearUser());
  } catch (err) {
    console.log(err);
  }
};
