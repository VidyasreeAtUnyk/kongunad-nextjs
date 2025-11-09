/**
 * Pre-configured form configurations for different form types
 */

import {
  FormConfig,
  DEPARTMENTS,
  TIME_SLOTS,
  GENDER_OPTIONS,
  DESIGNATIONS,
} from '@/types/forms'

/**
 * Make an appointment form configuration
 */
export const makeAppointmentFormConfig: FormConfig = {
  id: 'make-appointment',
  title: 'Make an Appointment',
  description: 'Fill in the details below to book your appointment with us.',
  submitLabel: 'Book Appointment',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: false,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: DEPARTMENTS,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'preferredDate',
      label: 'Preferred Appointment Date',
      type: 'date',
      required: true,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'preferredTime',
      label: 'Preferred Time',
      type: 'select',
      required: true,
      options: TIME_SLOTS,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'medicalCondition',
      label: 'Current Medical Condition / Symptoms',
      type: 'textarea',
      required: false,
      placeholder: 'Describe your symptoms or medical condition',
      rows: 4,
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha',
      required: true,
      gridProps: { xs: 12 },
    },
  ],
  onSubmit: async () => {
    // Will be handled by the consuming component
    throw new Error('onSubmit must be implemented')
  },
}

/**
 * Book a health checkup form configuration
 */
export const bookHealthCheckupFormConfig: FormConfig = {
  id: 'book-health-checkup',
  title: 'Book a Health Checkup',
  description: 'Complete the form below to book your health checkup package.',
  submitLabel: 'Book Checkup',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
      placeholder: 'Enter your city',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'preferredDate',
      label: 'Preferred Appointment Date',
      type: 'date',
      required: true,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'packageType',
      label: 'Type of Health Checkup',
      type: 'text', // Can be overridden with select and populated from Contentful
      required: true,
      placeholder: 'Select health checkup type',
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha',
      required: true,
      gridProps: { xs: 12 },
    },
  ],
  onSubmit: async () => {
    throw new Error('onSubmit must be implemented')
  },
}

/**
 * Research form configuration
 * Note: Can be used in multiple pages
 */
export const researchFormConfig: FormConfig = {
  id: 'research',
  title: 'Research Form',
  description: 'Please provide your details for research purposes.',
  submitLabel: 'Submit',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      required: true,
      placeholder: 'Enter your age',
      min: 1,
      max: 120,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'qualification',
      label: 'Qualification',
      type: 'text',
      required: false,
      placeholder: 'Enter your qualification',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'district',
      label: 'District',
      type: 'text',
      required: false,
      placeholder: 'Enter your district',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      required: false,
      placeholder: 'Enter your state',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'pgNeetStatus',
      label: 'PG - NEET Status',
      type: 'text',
      required: true,
      placeholder: 'Enter your PG-NEET status',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'query',
      label: 'Query',
      type: 'textarea',
      required: false,
      placeholder: 'Enter your query or additional information',
      rows: 4,
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha',
      required: true,
      gridProps: { xs: 12 },
    },
  ],
  onSubmit: async () => {
    throw new Error('onSubmit must be implemented')
  },
}

/**
 * Job vacancy form configuration
 */
export const jobVacancyFormConfig: FormConfig = {
  id: 'job-vacancy',
  title: 'Job Application Form',
  description: 'Fill in the details below to apply for the position.',
  submitLabel: 'Submit Application',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter your first name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: false,
      placeholder: 'Enter your last name',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'your.email@example.com',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: '9876543210',
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: GENDER_OPTIONS.map(opt => opt.label),
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'select',
      required: true,
      options: DESIGNATIONS,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'experience',
      label: 'Experience (years)',
      type: 'number',
      required: false,
      placeholder: 'Enter years of experience',
      min: 0,
      max: 50,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'currentSalary',
      label: 'Current Salary (INR)',
      type: 'number',
      required: false,
      placeholder: 'Enter your current salary',
      min: 0,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'expectedSalary',
      label: 'Expected Salary (INR)',
      type: 'number',
      required: false,
      placeholder: 'Enter your expected salary',
      min: 0,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'resume',
      label: 'Upload Resume',
      type: 'file',
      required: true,
      accept: '.pdf,.doc,.docx',
      helperText: 'Accepted formats: PDF, DOC, DOCX',
      gridProps: { xs: 12 },
    },
    {
      name: 'securityCode',
      label: 'Security Code',
      type: 'captcha',
      required: true,
      gridProps: { xs: 12 },
    },
  ],
  onSubmit: async () => {
    throw new Error('onSubmit must be implemented')
  },
}

