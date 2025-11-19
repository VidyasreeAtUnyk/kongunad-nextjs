'use client'

import React from 'react'
import {
  Box,
  IconButton,
  SwipeableDrawer,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  maxHeight?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  title,
  maxHeight = '90vh',
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      sx={{
        '& .MuiDrawer-paper': {
          maxHeight,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 0,
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      disableSwipeToOpen={true}
      transitionDuration={{ enter: 300, exit: 200 }}
      ModalProps={{
        sx: {
          zIndex: 1300,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header with drag handle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Drag handle */}
          <Box
            sx={{
              width: 40,
              height: 4,
              backgroundColor: 'grey.300',
              borderRadius: 2,
              mx: 'auto',
              position: 'absolute',
              left: '50%',
              top: 12,
              transform: 'translateX(-50%)',
            }}
          />
          
          {title && (
            <Box sx={{ ml: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {title}
              </Typography>
            </Box>
          )}
          
          <IconButton
            onClick={onClose}
            sx={{
              ml: 'auto',
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </SwipeableDrawer>
  )
}

