import { createSlice } from '@reduxjs/toolkit';
//import serialsAPI from '../api/serialsAPI';
import axios from 'axios';
import { API_FAVORITES } from '../constants/api';

const initialState = {
  favourites: [],
  loading: false,
  hasErrors: false,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setFavourites: (state, { payload }) => {
      state.favourites = payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setLoadingComplete: (state) => {
      state.loading = false;
    },
    setFavouritesFailure: (state) => {
      state.hasErrors = true;
    },
  },
});

// Selectors
export const selectFavourites = (state) => state.favourites;

// Actions
export const { setFavourites, setLoading, setLoadingComplete, setFavouritesFailure } =
  favouritesSlice.actions;
export default favouritesSlice.reducer;

// Thunks
export const getFavourites = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(API_FAVORITES,
      {
        headers: { Authorization: `Bearer ${token}` }
      });
    dispatch(setFavourites(data));
  } catch (err) {
    dispatch(setFavouritesFailure());
  } finally {
    dispatch(setLoadingComplete());
  }
};
