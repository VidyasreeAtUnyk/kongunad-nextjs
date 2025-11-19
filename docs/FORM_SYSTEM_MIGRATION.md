# Form System Migration Guide

## Overview

The form system has been upgraded from a custom validation approach to **React Hook Form (RHF) + Zod** for better type safety, performance, and developer experience.

## What Changed

### Before (FormBuilder v1)
- Custom validation logic
- Manual state management
- More verbose error handling
- Less type safety

### After (FormBuilderV2)
- **React Hook Form**: Uncontrolled components, better performance
- **Zod**: Type-safe schema validation
- **Auto-generated types**: `z.infer<Schema>` for form data types
- Better error handling and validation feedback

## File Structure

### New Files
```
src/
├── components/
│   ├── ui/
│   │   ├── FormBuilderV2.tsx          # New RHF-based form builder
│   │   └── GoogleReCaptcha.tsx        # reCAPTCHA component
│   └── forms/
│       ├── MakeAppointmentFormV2.tsx  # Using RHF
│       └── BookHealthCheckupFormV2.tsx
├── lib/
│   ├── formSchemas.ts                 # Zod schemas
│   └── formConfigsV2.ts               # Field configurations
```

### Updated Files
- `src/app/book-appointment/page.tsx` - Now uses FormBuilderV2
- `src/app/book-a-health-checkup/page.tsx` - Now uses FormBuilderV2

## Key Improvements

### 1. Type Safety
```typescript
// Auto-inferred types from Zod schemas
import { MakeAppointmentFormData } from '@/lib/formSchemas'

const handleSubmit = (data: MakeAppointmentFormData) => {
  // data is fully typed!
  console.log(data.firstName) // ✅ TypeScript knows this exists
}
```

### 2. Validation
```typescript
// Zod schemas provide comprehensive validation
export const makeAppointmentSchema = z.object({
  firstName: z.string().min(1).min(2, 'Must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+91)?[6-9]\d{9}$/, 'Invalid phone number'),
  // ... more fields
})
```

### 3. Performance
- React Hook Form uses uncontrolled components
- Minimizes re-renders
- Better for complex forms

### 4. Developer Experience
```typescript
// Cleaner component usage
<FormBuilderV2
  schema={makeAppointmentConfig.schema}
  fields={makeAppointmentConfig.fields}
  title="Make an Appointment"
  onSubmit={handleSubmit}
/>
```

## Migration Steps

### For Existing Forms

1. **Update imports**:
```typescript
// Before
import { MakeAppointmentForm } from '@/components/forms/MakeAppointmentForm'

// After
import { MakeAppointmentFormV2 as MakeAppointmentForm } from '@/components/forms/MakeAppointmentFormV2'
```

2. **Use new configuration**:
```typescript
import { makeAppointmentConfig } from '@/lib/formConfigsV2'
```

3. **Update types**:
```typescript
import { MakeAppointmentFormData } from '@/lib/formSchemas'

const handleSubmit = async (data: MakeAppointmentFormData) => {
  // Fully typed data
}
```

## Field Type Updates

Based on latest requirements:

| Field | Old Type | New Type |
|-------|----------|----------|
| District | Select | Text |
| State | Select | Text |
| PG-NEET Status | Select | Text |
| Designation | Text | Select |
| Notes | Textarea | Removed |
| Security Code | Math Captcha | Google reCAPTCHA |

## Adding a New Form

### Step 1: Create Zod Schema
```typescript
// src/lib/formSchemas.ts
export const myNewFormSchema = z.object({
  firstName: nameSchema,
  email: emailSchema,
  // ... more fields
})

export type MyNewFormData = z.infer<typeof myNewFormSchema>
```

### Step 2: Create Field Configuration
```typescript
// src/lib/formConfigsV2.ts
export const myNewFormConfig = {
  schema: myNewFormSchema,
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      required: true,
      gridProps: { xs: 12 },
    },
    // ... more fields
  ] as FormFieldConfig[],
}
```

### Step 3: Create Component
```typescript
// src/components/forms/MyNewFormV2.tsx
export const MyNewFormV2 = ({ onSubmit, ...props }) => (
  <FormBuilderV2
    schema={myNewFormConfig.schema}
    fields={myNewFormConfig.fields}
    title="My New Form"
    onSubmit={onSubmit}
    {...props}
  />
)
```

### Step 4: Use in Page
```typescript
// src/app/my-page/page.tsx
import { MyNewFormV2 as MyNewForm } from '@/components/forms/MyNewFormV2'
import type { MyNewFormData } from '@/lib/formSchemas'

export default function MyPage() {
  const handleSubmit = async (data: MyNewFormData) => {
    // Handle submission
  }

  return <MyNewForm onSubmit={handleSubmit} />
}
```

## Environment Variables

Add to `.env.local`:
```bash
# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

For development, the form uses Google's test key by default.

## Troubleshooting

### Type Errors
If you see type errors with `readonly` arrays:
```typescript
// Use 'as unknown as' to convert readonly to mutable
z.enum(DEPARTMENTS as unknown as [string, ...string[]])
```

### Validation Not Working
Ensure your Zod schema matches your field configuration:
- Field names must match exactly
- Field types must be compatible

### reCAPTCHA Not Loading
Check browser console for errors. Ensure:
- Script loads correctly
- Site key is set
- Network allows Google domains

## Benefits Summary

✅ **Type Safety**: Auto-inferred types from schemas  
✅ **Performance**: Uncontrolled components, fewer re-renders  
✅ **Validation**: Comprehensive Zod schemas  
✅ **DX**: Better developer experience  
✅ **Scalability**: Easy to add new forms  
✅ **Security**: Google reCAPTCHA integration  

## Future Enhancements

- Multi-step forms support
- Conditional field visibility
- File upload progress indicators
- Draft saving
- Rich text fields
- Date range pickers

