
import { combineReducers } from '@reduxjs/toolkit'
import { tokenReducer } from './auth.reducer'
import { statReducer } from './stats.redux'

export const rootReducers = combineReducers({
	tokens: tokenReducer,
	stats: statReducer
})
