import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type BottomSheetType = 'healthCheckup' | 'research'

interface BottomSheetState {
  isOpen: boolean
  type: BottomSheetType | null
  packageName: string | null
  courseName: string | null
}

const initialState: BottomSheetState = {
  isOpen: false,
  type: null,
  packageName: null,
  courseName: null,
}

const bottomSheetSlice = createSlice({
  name: 'bottomSheet',
  initialState,
  reducers: {
    openBottomSheet: (
      state,
      action: PayloadAction<{ type?: BottomSheetType; packageName?: string; courseName?: string }>
    ) => {
      state.isOpen = true
      state.type = action.payload.type || 'healthCheckup'
      state.packageName = action.payload.packageName || null
      state.courseName = action.payload.courseName || null
    },
    closeBottomSheet: (state) => {
      state.isOpen = false
      state.type = null
      state.packageName = null
      state.courseName = null
    },
  },
})

export const { openBottomSheet, closeBottomSheet } = bottomSheetSlice.actions
export default bottomSheetSlice.reducer

