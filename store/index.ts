// import { createStore, applyMiddleware } from 'redux'
import { applyMiddleware, createStore, Store } from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { rootReducers } from './reducers'
import thunkMiddleware from 'redux-thunk'
import { createWrapper, Context, } from "next-redux-wrapper"

const createNoopStorage = () => {
	return {
		getItem(_key: any) {
			return Promise.resolve(null);
		},
		setItem(_key: any, value: any) {
			return Promise.resolve(value);
		},
		removeItem(_key: any) {
			return Promise.resolve();
		},
	};
};

const storage =
	typeof window !== 'undefined'
		? createWebStorage('local')
		: createNoopStorage();

const bindMiddleware = (middleware: any) => {
	if (process.env.NODE_ENV !== 'production') {
		return composeWithDevTools(applyMiddleware(...middleware));
	}
	return applyMiddleware(...middleware);
};

export const makeStore = ({ isServer }: any) => {
	if (isServer) {
		//If it's on server side, create a store
		return createStore(rootReducers, bindMiddleware([thunkMiddleware]));
	} else {

		const persistConfig = {
			key: 'authType',
			storage: storage,
			whitelist: []
		}
		const persistedReducer = persistReducer(persistConfig, rootReducers);

		const store = createStore(
			persistedReducer,
			bindMiddleware([thunkMiddleware])
		);

		(store as any).__persistor = persistStore(store);

		return store;
	}
};
export const wrapper = createWrapper(makeStore);
