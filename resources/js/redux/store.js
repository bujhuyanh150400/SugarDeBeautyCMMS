import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import AppReducer from "@/redux/reducers/AppSlice.js";
import ToastReducer from "@/redux/reducers/ToastSlice";

const persistConfig = {
    key: 'Sugar_de_beauty_CMMS',
    version: 1,
    storage,
    whitelist: ['app'],
}

const rootReducer = combineReducers({
    app: AppReducer,
    toast: ToastReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store)
