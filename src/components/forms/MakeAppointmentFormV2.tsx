/**
 * Make Appointment Form Component V2 - Using React Hook Form + Zod
 */

'use client'

import React from 'react'
import { Paper, Typography } from '@mui/material'
import { FormBuilderV2 } from '@/components/ui/FormBuilderV2'
import { makeAppointmentConfig } from '@/lib/formConfigsV2'

interface MakeAppointmentFormV2Props {
  onSubmit: (data: any) => Promise<void> | void
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
  initialValues?: any
}

export const MakeAppointmentFormV2: React.FC<MakeAppointmentFormV2Props> = ({
  onSubmit,
  onSubmitSuccess,
  onSubmitError,
  initialValues,
}) => {
  return (
    <Paper elevation={0} sx={{ p: 4 }}>
      <FormBuilderV2
        schema={makeAppointmentConfig.schema}
        fields={makeAppointmentConfig.fields}
        title="Make an Appointment"
        description="Fill in the details below to book your appointment with us."
        submitLabel="Book Appointment"
        onSubmit={onSubmit}
        onSubmitSuccess={onSubmitSuccess}
        onSubmitError={onSubmitError}
        initialValues={initialValues}
      />
    </Paper>
  )
}

