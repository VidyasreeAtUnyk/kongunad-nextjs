# Form Validation System

## Overview

Forms use **React Hook Form (RHF)** + **Zod** for validation, offering declarative schemas and type-safe, error-free submissions.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  FormBuilderV2                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React Hook Form (useForm)                            │   │
│  │  - Manages form state                                │   │
│  │  - Handles submission                                │   │
│  │  - Tracks validation state                           │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ zodResolver (from @hookform/resolvers)               │   │
│  │  - Connects Zod schema to RHF                        │   │
│  │  - Validates on submit                               │   │
│  │  - Returns error messages                            │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Zod Schema (formSchemas.ts)                          │   │
│  │  - Defines validation rules                          │   │
│  │  - Provides error messages                           │   │
│  │  - Auto-generates TypeScript types                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Validation Flow

### 1. Schema Definition (Zod)
```typescript
// src/lib/formSchemas.ts
const emailSchema = z.string().email('Invalid email address')
const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number')

export const makeAppointmentSchema = z.object({
  firstName: z.string().min(1, 'This field is required').min(2, 'Must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  // ... more fields
})
```

### 2. Form Initialization
```typescript
// src/components/ui/FormBuilderV2.tsx
const {
  control,
  handleSubmit,
  formState: { errors, isSubmitting },
  setError,
  reset,
} = useForm({
  resolver: zodResolver(schema as any), // ← Zod validates here
  defaultValues: buildDefaultValues(),
})
```

### 3. Validation Triggers
- On submit (required)
- On blur (default)
- Invalid → shows error
- Valid → submits

### 4. Error Display
```typescript
// Errors are displayed in real-time
const errorMessage = getErrorMessage(field.name)

<TextField
  error={!!errorMessage}  // ← Red border if error
  helperText={errorMessage || field.helperText}  // ← Shows message
/>
```

## Validation Rules by Field Type

### Text Fields
```typescript
firstName: z.string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters')
```

### Email
```typescript
email: z.string().email('Invalid email address')
```

### Phone (Indian)
```typescript
phone: z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number')
```

### Number Fields
```typescript
age: z.coerce.number()
  .min(1, 'Age must be at least 1')
  .max(120, 'Invalid age')
```

### Date Fields
```typescript
preferredDate: z.string().min(1, 'Preferred date is required')
```

### Select Fields (Enum)
```typescript
department: z.enum(DEPARTMENTS as unknown as [string, ...string[]], {
  errorMap: () => ({ message: 'Please select a department' }),
})
```

### File Upload
```typescript
resume: z.instanceof(File, { message: 'Please upload your resume' })
```

### reCAPTCHA
```typescript
securityCode: z.string().min(1, 'Please complete the security verification')
```

## Common Validation Patterns

### Required Field
```typescript
firstName: z.string().min(1, 'This field is required')
```

### Optional Field
```typescript
lastName: z.string().optional()
```

### Range Validation
```typescript
experience: z.coerce.number()
  .min(0, 'Experience cannot be negative')
  .max(50, 'Invalid years of experience')
  .optional()
```

### Custom Pattern
```typescript
phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number')
```

## Error Handling

### Field-Level Errors
- Shown under each field
- Uses Zod message
- Red border

### Form-Level Errors
- Shown at top
- For submission failures

```typescript
{errors.root && (
  <Alert severity="error">
    {(errors.root as any)?.message}
  </Alert>
)}
```

## Type Safety

Types are generated from Zod schemas:

```typescript
// Auto-generated types
export type MakeAppointmentFormData = z.infer<typeof makeAppointmentSchema>

// Usage
const handleSubmit = async (data: MakeAppointmentFormData) => {
  // data is fully typed! ✅
  console.log(data.firstName)  // TypeScript knows this is a string
  console.log(data.department)  // TypeScript knows valid departments
}
```

## Adding Custom Validation

### Example: Valid Date
```typescript
const isValidDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}

preferredDate: z.string()
  .min(1, 'Preferred date is required')
  .refine((date) => isValidDate(date), {
    message: 'Please select a valid date'
  })
```

### Example: Conditional Validation
```typescript
const schema = z.object({
  hasInsurance: z.boolean(),
  insuranceNumber: z.string().optional(),
}).refine(
  (data) => !data.hasInsurance || data.insuranceNumber?.length > 0,
  {
    message: 'Insurance number is required if you have insurance',
    path: ['insuranceNumber']
  }
)
```

### Example: Compare Fields
```typescript
const schema = z.object({
  password: z.string(),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})
```

## Best Practices

### 1. Keep Schemas Centralized
All Zod schemas live in `src/lib/formSchemas.ts`

### 2. Reuse Common Validations
```typescript
// Define once
const emailSchema = z.string().email('Invalid email address')

// Use everywhere
email: emailSchema
```

### 3. Provide Clear Messages
```typescript
// ❌ Bad
firstName: z.string().min(1)

// ✅ Good
firstName: z.string().min(1, 'First name is required')
```

### 4. Use Type Coercion When Needed
```typescript
// For number inputs
age: z.coerce.number().min(1)
experience: z.coerce.number().min(0)
```

## Advantages of RHF + Zod

### vs. Custom Validation
- Less code
- Built-in rules
- Better DX
- Type safety

### vs. Formik + Yup
- Better performance (fewer renders)
- Better TS support
- Simpler APIs
- Smaller bundle

## Validation Performance

- No re-renders on change
- Updates on blur
- Debounced submit validation
- Minimal impact on large forms

## Testing

Validation can be tested:

```typescript
import { makeAppointmentSchema } from '@/lib/formSchemas'

test('validates email correctly', () => {
  const result = makeAppointmentSchema.safeParse({
    firstName: 'John',
    email: 'invalid-email',
    phone: '9876543210',
    // ... other required fields
  })
  
  expect(result.success).toBe(false)
  expect(result.error?.issues[0].message).toBe('Invalid email address')
})
```

