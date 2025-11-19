/**
 * Form configurations for FormBuilderV2 (React Hook Form + Zod)
 */

import { FormFieldConfig } from '@/components/ui/FormBuilderV2'
import {
  makeAppointmentSchema,
  bookHealthCheckupSchema,
  researchSchema,
  jobVacancySchema,
} from './formSchemas'
import { DEPARTMENTS, TIME_SLOTS, GENDER_OPTIONS, DESIGNATIONS } from '@/types/forms'

/**
 * Make Appointment Form Configuration
 */
export const makeAppointmentConfig = {
  schema: makeAppointmentSchema,
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date' as const,
      required: false,
      maxDate: new Date().toISOString().split('T')[0], // No future dates
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select' as const,
      required: true,
      options: DEPARTMENTS,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'preferredDate',
      label: 'Preferred Appointment Date',
      type: 'date' as const,
      required: true,
      minDate: new Date().toISOString().split('T')[0], // No past dates
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'preferredTime',
      label: 'Preferred Time',
      type: 'select' as const,
      required: true,
      options: TIME_SLOTS,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select' as const,
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'medicalCondition',
      label: 'Current Medical Condition / Symptoms',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Describe your symptoms or medical condition',
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha' as const,
      required: true,
      gridProps: { xs: 12 },
    },
  ] as FormFieldConfig[],
}

/**
 * Book Health Checkup Form Configuration
 */
export const bookHealthCheckupConfig = {
  schema: bookHealthCheckupSchema,
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'city',
      label: 'City',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your city',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'preferredDate',
      label: 'Preferred Appointment Date',
      type: 'date' as const,
      required: true,
      minDate: new Date().toISOString().split('T')[0], // No past dates
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select' as const,
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'packageType',
      label: 'Type of Health Checkup',
      type: 'text' as const,
      required: true,
      placeholder: 'Select health checkup type',
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha' as const,
      required: true,
      gridProps: { xs: 12 },
    },
  ] as FormFieldConfig[],
}

/**
 * Research Form Configuration
 */
export const researchConfig = {
  schema: researchSchema,
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number' as const,
      required: true,
      placeholder: 'Enter your age',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select' as const,
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'qualification',
      label: 'Qualification',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your qualification',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'district',
      label: 'District',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your district',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'state',
      label: 'State',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your state',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'pgNeetStatus',
      label: 'PG - NEET Status',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your PG-NEET status',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'query',
      label: 'Query',
      type: 'textarea' as const,
      required: false,
      placeholder: 'Enter your query or additional information',
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha' as const,
      required: true,
      gridProps: { xs: 12 },
    },
  ] as FormFieldConfig[],
}

/**
 * Job Vacancy Form Configuration
 */
export const jobVacancyConfig = {
  schema: jobVacancySchema,
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text' as const,
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email' as const,
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel' as const,
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select' as const,
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'select' as const,
      required: true,
      options: DESIGNATIONS,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'experience',
      label: 'Experience (years)',
      type: 'number' as const,
      required: false,
      placeholder: 'Enter years of experience',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'currentSalary',
      label: 'Current Salary (INR)',
      type: 'number' as const,
      required: false,
      placeholder: 'Enter your current salary',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'expectedSalary',
      label: 'Expected Salary (INR)',
      type: 'number' as const,
      required: false,
      placeholder: 'Enter your expected salary',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'resume',
      label: 'Upload Resume',
      type: 'file' as const,
      required: true,
      gridProps: { xs: 12 },
      helperText: 'Accepted formats: PDF, DOC, DOCX',
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha' as const,
      required: true,
      gridProps: { xs: 12 },
    },
  ] as FormFieldConfig[],
}

