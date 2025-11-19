import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BottomSheetState {
  isOpen: boolean
  packageName: string | null
}

const initialState: BottomSheetState = {
  isOpen: false,
  packageName: null,
}

const bottomSheetSlice = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    openBottomSheet: (state, action: PayloadAction<{ packageName: string }>) => {
      state.isOpen = true
      state.packageName = action.payload.packageName
    },
    closeBottomSheet: (state) => {
      state.isOpen = false
      state.packageName = null
    },
  },
})

export const { openBottomSheet, closeBottomSheet } = bottomSheetSlice.actions
export default bottomSheetSlice.reducer

