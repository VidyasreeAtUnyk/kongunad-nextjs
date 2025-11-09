/**
 * Form configuration types for a reusable, scalable form system
 */

// Field types supported by the form builder
export type FieldType = 
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'file'
  | 'captcha'

// Gender options
export type Gender = 'male' | 'female' | 'other'

// Form field configuration
export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  helperText?: string
  options?: readonly string[] // For select fields
  defaultValue?: string | number | null
  min?: number // For number fields
  max?: number // For number fields
  minLength?: number
  maxLength?: number
  pattern?: RegExp // For validation
  validationMessage?: string
  multiline?: boolean // For textarea
  rows?: number // For textarea
  accept?: string // For file inputs
  disabled?: boolean
  gridProps?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
  }
}

// Form configuration
export interface FormConfig {
  id: string
  title: string
  description?: string
  fields: FormField[]
  submitLabel?: string
  onSubmit: (data: Record<string, any>) => Promise<void> | void
}

// Form state
export interface FormState {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isDirty: boolean
}

// Props for the FormBuilder component
export interface FormBuilderProps {
  config: FormConfig
  initialValues?: Record<string, any>
  onSubmitSuccess?: () => void
  onSubmitError?: (error: Error) => void
}

// Department options
export const DEPARTMENTS = [
  'Pediatrics',
  'Gynaecology',
  'Cardiology',
  'Orthopedics',
  'General Medicine',
  'Dermatology',
  'Neurology',
  'Urology',
  'ENT',
  'Ophthalmology',
  'Psychiatry',
  'Emergency Medicine',
  'Oncology',
  'Radiology',
  'Pathology',
] as const

// Time slots
export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM',
] as const

// Gender options array
export const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

// PG NEET status options
export const PG_NEET_STATUS = [
  'Yes',
  'No',
  'Not Applicable',
] as const

// Indian states
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const

// Tamil Nadu districts
export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
] as const

// Job Designations for Hospital
export const DESIGNATIONS = [
  'Doctor',
  'Staff Nurse',
  'Lab Technician',
  'Pharmacist',
  'Medical Officer',
  'Admin Staff',
  'Receptionist',
  'Security Guard',
  'Housekeeping Staff',
  'Maintenance Staff',
  'Other',
] as const

