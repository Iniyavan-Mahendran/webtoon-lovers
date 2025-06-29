import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import webtoonReducer from './slices/webtoonSlice'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme']
}

const rootReducer = combineReducers({
  webtoons: webtoonReducer,
  auth: authReducer,
  theme: themeReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch