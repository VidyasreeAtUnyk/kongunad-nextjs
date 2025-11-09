# Forms System Documentation

## Overview

A robust, scalable, and reusable form system built for Kongunad Hospital. The system uses a configuration-driven approach that makes adding or modifying forms easy.

## Architecture

The form system consists of three main layers:

### 1. Type Definitions (`src/types/forms.ts`)
- Defines all TypeScript interfaces and types
- Contains form field configurations
- Includes option arrays (departments, states, genders, etc.)

### 2. Form Builder (`src/components/ui/FormBuilder.tsx`)
- Core reusable component that renders any form based on configuration
- Handles validation, state management, and submission
- Supports multiple field types: text, email, tel, number, date, select, textarea, file, captcha

### 3. Form Configurations (`src/lib/formConfigs.ts`)
- Pre-configured form definitions for common form types
- Includes: Make Appointment, Book Health Checkup, Research, Job Vacancy

### 4. Form Wrapper Components (`src/components/forms/`)
- Convenient wrapper components for each form type
- MakeAppointmentForm, BookHealthCheckupForm, ResearchForm, JobVacancyForm

## Supported Field Types

### Text Fields
- `text`: Standard text input
- `email`: Email with validation
- `tel`: Phone number with Indian phone validation
- `number`: Numeric input with min/max support
- `date`: Date picker
- `textarea`: Multi-line text input
- `file`: File upload
- `select`: Dropdown select
- `captcha`: Security code verification

## Form Configurations

### Make Appointment Form
**Fields:**
- First Name (required)
- Last Name (optional)
- Email (required)
- Phone (required)
- Date of Birth (optional)
- Department (required) - Select from predefined departments
- Preferred Appointment Date (required)
- Preferred Time (required) - Time slots
- Gender (required)
- Current Medical Condition / Symptoms (optional)
- Security Code (required) - CAPTCHA

### Book Health Checkup Form
**Fields:**
- First Name (required)
- Last Name (optional)
- Email (required)
- Phone (required)
- City (required)
- Preferred Appointment Date (required)
- Gender (required)
- Type of Health Checkup (required) - Can be pre-populated
- Notes (optional)
- Security Code (required) - CAPTCHA

**Special Feature:** Can pre-populate package type when navigating from health package cards

### Research Form
**Fields:**
- First Name (required)
- Last Name (optional)
- Age (required)
- Gender (required)
- Qualification (optional)
- Phone (required)
- District (optional) - Tamil Nadu districts
- State (optional) - Indian states
- Email (required)
- PG - NEET Status (required)
- Query (optional)
- Security Code (required) - CAPTCHA

**Special Feature:** Can be used on multiple pages with custom title/description

### Job Vacancy Form
**Fields:**
- First Name (required)
- Last Name (optional)
- Email (required)
- Phone (required)
- Gender (required)
- Designation (required)
- Experience - years (optional)
- Current Salary (optional)
- Expected Salary (optional)
- Resume (required) - File upload
- Security Code (required) - CAPTCHA

## Usage Examples

### Basic Form Usage

```tsx
import { MakeAppointmentForm } from '@/components/forms/MakeAppointmentForm'

function MyPage() {
  const handleSubmit = async (data: Record<string, any>) => {
    // Process form data
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  return (
    <MakeAppointmentForm 
      onSubmit={handleSubmit}
      onSubmitSuccess={() => console.log('Success!')}
    />
  )
}
```

### Advanced Form Configuration

```tsx
import { FormBuilder } from '@/components/ui/FormBuilder'
import { FormField, FormConfig } from '@/types/forms'

const customFormConfig: FormConfig = {
  id: 'custom-form',
  title: 'Custom Form',
  description: 'A custom form example',
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      gridProps: { xs: 12, sm: 6 },
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validationMessage: 'Please enter a valid email',
      gridProps: { xs: 12, sm: 6 },
    },
  ],
  onSubmit: async (data) => {
    console.log('Submitted:', data)
  },
}

function CustomFormPage() {
  return <FormBuilder config={customFormConfig} />
}
```

### Pre-populated Values

```tsx
<BookHealthCheckupForm 
  onSubmit={handleSubmit}
  initialValues={{ packageType: 'Basic Health Checkup' }}
  selectedPackageName="Basic Health Checkup"
/>
```

## Adding a New Form Type

### Step 1: Create Form Configuration

```tsx
// src/lib/formConfigs.ts
export const myNewFormConfig: FormConfig = {
  id: 'my-new-form',
  title: 'My New Form',
  description: 'Form description',
  fields: [
    {
      name: 'field1',
      label: 'Field Label',
      type: 'text',
      required: true,
      gridProps: { xs: 12 },
    },
    // Add more fields...
  ],
  onSubmit: async () => {
    throw new Error('onSubmit must be implemented')
  },
}
```

### Step 2: Create Wrapper Component (Optional)

```tsx
// src/components/forms/MyNewForm.tsx
'use client'

import { FormBuilder } from '@/components/ui/FormBuilder'
import { myNewFormConfig } from '@/lib/formConfigs'

export const MyNewForm = ({ onSubmit, ...props }) => {
  const config = {
    ...myNewFormConfig,
    onSubmit,
  }
  
  return <FormBuilder config={config} {...props} />
}
```

### Step 3: Use in Page

```tsx
// src/app/my-page/page.tsx
import { MyNewForm } from '@/components/forms/MyNewForm'

export default function MyPage() {
  const handleSubmit = async (data) => {
    // Handle submission
  }

  return <MyNewForm onSubmit={handleSubmit} />
}
```

## Validation

The form system includes built-in validation:

- **Required fields**: Validates presence of required fields
- **Email**: Regex-based email validation
- **Phone**: Indian phone number validation (+91 optional, starts with 6-9, 10 digits)
- **Min/Max length**: Text length validation
- **Min/Max values**: Number range validation
- **Pattern**: Custom regex validation
- **CAPTCHA**: Simple math-based captcha (can be extended to use services like reCAPTCHA)

## Customization

### Adding Custom Validation

```tsx
{
  name: 'customField',
  label: 'Custom Field',
  type: 'text',
  required: true,
  pattern: /^[A-Z]{2}\d{4}$/,
  validationMessage: 'Format: 2 uppercase letters followed by 4 digits',
}
```

### Adding New Option Arrays

```tsx
// In src/types/forms.ts
export const MY_NEW_OPTIONS = [
  'Option 1',
  'Option 2',
  'Option 3',
] as const
```

### Styling Overrides

The form system uses Material-UI's theming. You can customize styles globally through the MUI theme configuration in `src/lib/mui-theme.ts`.

## API Integration

All forms require an `onSubmit` handler that returns a Promise:

```tsx
const handleSubmit = async (data: Record<string, any>) => {
  try {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Submission failed')
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    throw error
  }
}
```

## Google reCAPTCHA Setup

The forms use **Google reCAPTCHA v2** for security verification. Currently, a test key is used by default.

### Getting Your reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to add a new site
3. Choose **reCAPTCHA v2** → "I'm not a robot" Checkbox
4. Add your domain (e.g., `kongunadhospital.com` or `localhost` for development)
5. Accept terms and submit
6. You'll receive a **Site Key** and **Secret Key**

### Configuration

Add your reCAPTCHA Site Key to `.env.local`:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Note:** The test key `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` is used by default if no environment variable is set, which will show a "for testing purposes only" banner.

### More Information

For detailed setup instructions, see [FORM_VALIDATION.md](./FORM_VALIDATION.md#google-recaptcha-integration).

## Future Enhancements

Potential improvements for the system:

1. **Multi-step Forms**: Support for wizard-style multi-step forms
2. **Conditional Fields**: Show/hide fields based on other field values
3. **File Upload Progress**: Show upload progress for file fields
4. **Autosave**: Draft saving capabilities
5. **Rich Text Fields**: Support for rich text editing
6. **Date Range Picker**: Support for date range selection
7. **Time Zone Support**: Better date/time handling with timezones

## Testing

Form components can be tested using Jest and React Testing Library. Example test:

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MakeAppointmentForm } from '@/components/forms/MakeAppointmentForm'

test('submits form with valid data', async () => {
  const handleSubmit = jest.fn()
  
  render(<MakeAppointmentForm onSubmit={handleSubmit} />)
  
  fireEvent.change(screen.getByLabelText(/first name/i), {
    target: { value: 'John' },
  })
  // Fill other required fields...
  
  fireEvent.click(screen.getByRole('button', { name: /book appointment/i }))
  
  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalled()
  })
})
```

## Contributing

When adding new forms or features:

1. Follow the existing configuration pattern
2. Add appropriate TypeScript types
3. Update this documentation
4. Add tests for new functionality
5. Ensure accessibility standards are maintained
