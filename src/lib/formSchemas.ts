/**
 * Zod validation schemas for all form types
 */

import { z } from 'zod'
import { DEPARTMENTS, TIME_SLOTS, GENDER_OPTIONS, DESIGNATIONS } from '@/types/forms'

// Common validations
const emailSchema = z.string().email('Invalid email address')
const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits').regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number')
const nameSchema = z.string().min(1, 'This field is required').min(2, 'Must be at least 2 characters')
const optionalNameSchema = z.string().optional()

// Date validation helpers
const notFutureDateSchema = z.string().refine((date) => {
  if (!date) return true // Allow empty optional dates
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(23, 59, 59, 999) // End of today
  return selectedDate <= today
}, {
  message: 'Date cannot be in the future'
})

const notPastDateSchema = z.string().min(1, 'Preferred date is required').refine((date) => {
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Start of today
  return selectedDate >= today
}, {
  message: 'Appointment date cannot be in the past'
})

/**
 * Make Appointment Form Schema
 */
export const makeAppointmentSchema = z.object({
  firstName: nameSchema,
  lastName: optionalNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: notFutureDateSchema.optional(),
  department: z.enum(DEPARTMENTS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a department' }),
  } as any),
  preferredDate: notPastDateSchema,
  preferredTime: z.enum(TIME_SLOTS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a time slot' }),
  } as any),
  gender: z.enum(GENDER_OPTIONS.map(opt => opt.label) as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select your gender' }),
  } as any),
  medicalCondition: z.string().optional(),
  securityCode: z.string().min(1, 'Please complete the security verification'),
})

/**
 * Book Health Checkup Form Schema
 */
export const bookHealthCheckupSchema = z.object({
  firstName: nameSchema,
  lastName: optionalNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  city: nameSchema,
  preferredDate: notPastDateSchema,
  gender: z.enum(GENDER_OPTIONS.map(opt => opt.label) as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select your gender' }),
  } as any),
  packageType: nameSchema,
  securityCode: z.string().min(1, 'Please complete the security verification'),
})

/**
 * Research Form Schema
 */
export const researchSchema = z.object({
  firstName: nameSchema,
  lastName: optionalNameSchema,
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Invalid age'),
  gender: z.enum(GENDER_OPTIONS.map(opt => opt.label) as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select your gender' }),
  } as any),
  qualification: z.string().optional(),
  phone: phoneSchema,
  district: z.string().optional(),
  state: z.string().optional(),
  email: emailSchema,
  pgNeetStatus: nameSchema,
  query: z.string().optional(),
  securityCode: z.string().min(1, 'Please complete the security verification'),
})

/**
 * Job Vacancy Form Schema
 */
export const jobVacancySchema = z.object({
  firstName: nameSchema,
  lastName: optionalNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  gender: z.enum(GENDER_OPTIONS.map(opt => opt.label) as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select your gender' }),
  } as any),
  designation: z.enum(DESIGNATIONS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a designation' }),
  } as any),
  experience: z.coerce.number().min(0, 'Experience cannot be negative').max(50, 'Invalid years of experience').optional(),
  currentSalary: z.coerce.number().min(0, 'Salary cannot be negative').optional(),
  expectedSalary: z.coerce.number().min(0, 'Salary cannot be negative').optional(),
  resume: z.instanceof(File, { message: 'Please upload your resume' }),
  securityCode: z.string().min(1, 'Please complete the security verification'),
})

// Export types for convenience
export type MakeAppointmentFormData = z.infer<typeof makeAppointmentSchema>
export type BookHealthCheckupFormData = z.infer<typeof bookHealthCheckupSchema>
export type ResearchFormData = z.infer<typeof researchSchema>
export type JobVacancyFormData = z.infer<typeof jobVacancySchema>

