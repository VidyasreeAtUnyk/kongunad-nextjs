import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './modalSlice'
import bottomSheetReducer from './bottomSheetSlice'

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    bottomSheet: bottomSheetReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
