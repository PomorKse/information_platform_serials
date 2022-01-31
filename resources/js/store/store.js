import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import serialsReducer from './serials.slice';
import serialReducer from './serial.slice';
import authReducer from './auth.slice';
import watchlistReducer from './watchlist.slice';
import filtersReducer from './filters.slice';
import favouritesReducer from './favourites.slice';
import searchSerialsReducer from './search.slice';

const rootReducer = combineReducers({
  serials: serialsReducer,
  serial: serialReducer,
  auth: authReducer,
  watchlist: watchlistReducer,
  filters: filtersReducer,
  favourites: favouritesReducer,
  searchSerials: searchSerialsReducer,
});

// persist config obj
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'watchlist'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
