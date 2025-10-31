import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ModalType = 'doctor' | 'package' | null

interface ModalState {
  isOpen: boolean
  modalType: ModalType
  itemId: string | null
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
  itemId: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: ModalType; id: string }>) => {
      state.isOpen = true
      state.modalType = action.payload.type
      state.itemId = action.payload.id
    },
    closeModal: (state) => {
      state.isOpen = false
      state.modalType = null
      state.itemId = null
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
