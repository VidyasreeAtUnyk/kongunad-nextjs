'use client'

import React from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { closeModal } from '@/store/modalSlice'
import { DoctorDetailModal } from './DoctorDetailModal'
import { PackageDetailModal } from './PackageDetailModal'

export const ModalContainer: React.FC = () => {
  const { isOpen, modalType, itemId } = useAppSelector((state) => state.modal)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(closeModal())
  }

  if (!isOpen || !itemId || !modalType) {
    return null
  }

  return (
    <>
      {modalType === 'doctor' && (
        <DoctorDetailModal
          doctorId={itemId}
          open={isOpen}
          onClose={handleClose}
        />
      )}
      {modalType === 'package' && (
        <PackageDetailModal
          packageId={itemId}
          open={isOpen}
          onClose={handleClose}
        />
      )}
    </>
  )
}

