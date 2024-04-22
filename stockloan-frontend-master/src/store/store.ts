import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import allianceReducer from '@/store/slice/alliance';
import betterReducer from '@/store/slice/better';
import stockReducer from '@/store/slice/stock';

const persistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['stockReducer'],
};
const allianceConfig = {
  key: 'alliance',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};
const stockConfig = {
  key: 'stock',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};
const rootReducer = combineReducers({
  betterReducer: betterReducer,
  stockReducer: persistReducer(stockConfig, stockReducer),
  allianceReducer: persistReducer(allianceConfig, allianceReducer),
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  }),
});

const persistor = persistStore(store);

export type RootReducerType = ReturnType<typeof rootReducer>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { persistor, store };
