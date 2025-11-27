# Job Vacancies Content Model for Contentful

## 📋 **Content Type: Job Vacancy**

**Content Type ID**: `jobVacancy`

### **Fields:**

| Field ID | Field Name | Field Type | Required | Validation |
|----------|------------|------------|----------|------------|
| `title` | Job Title | Short text | ✅ Yes | - |
| `slug` | URL Slug | Short text | ✅ Yes | Unique, URL-friendly (e.g., "staff-nurse") |
| `designation` | Designation | Short text | ✅ Yes | Must match form dropdown options (e.g., "Staff Nurse", "Doctor") |
| `department` | Department | Short text | ❌ No | e.g., "Nursing", "Administration" |
| `description` | Full Description | Long text | ✅ Yes | Complete job description |
| `shortDescription` | Short Description | Short text | ❌ No | Brief description for cards (2-3 lines) |
| `requirements` | Requirements | Short text, List | ❌ No | Array of requirement items |
| `responsibilities` | Responsibilities | Short text, List | ❌ No | Array of responsibility items |
| `qualifications` | Qualifications | Short text, List | ❌ No | Required qualifications |
| `experience` | Experience Required | Short text | ❌ No | e.g., "2-5 years", "Fresher" |
| `location` | Location | Short text | ❌ No | e.g., "Coimbatore" |
| `employmentType` | Employment Type | Short text | ❌ No | e.g., "Full-time", "Part-time", "Contract" |
| `salaryRange` | Salary Range | Short text | ❌ No | e.g., "₹20,000 - ₹40,000" |
| `order` | Display Order | Number | ❌ No | For sorting jobs (lower = first) |
| `active` | Active Status | Boolean | ❌ No | Whether position is currently open (default: true) |
| `postedDate` | Posted Date | Date | ❌ No | Date when job was posted |
| `closingDate` | Closing Date | Date | ❌ No | Application deadline |

### **Designation Options:**

The `designation` field must match one of these predefined options (used in the application form):

- `Doctor`
- `Staff Nurse`
- `Lab Technician`
- `Pharmacist`
- `Medical Officer`
- `Admin Staff`
- `Receptionist`
- `Security Guard`
- `Housekeeping Staff`
- `Maintenance Staff`
- `Other`

**Note**: If you need to add a new designation, update the `DESIGNATIONS` array in `src/types/forms.ts` and redeploy the application.

### **Sample Entries:**

#### **Staff Nurse**
```json
{
  "title": "Staff Nurse",
  "slug": "staff-nurse",
  "designation": "Staff Nurse",
  "department": "Nursing",
  "description": "We are looking for a dedicated and compassionate Staff Nurse to join our nursing team. The ideal candidate will provide high-quality patient care, assist doctors during procedures, and maintain accurate medical records. This position requires excellent communication skills, attention to detail, and the ability to work in a fast-paced environment.",
  "shortDescription": "Join our nursing team as a Staff Nurse. Provide compassionate patient care in a modern healthcare facility.",
  "requirements": [
    "B.Sc Nursing or GNM from a recognized institution",
    "Valid nursing registration certificate",
    "Minimum 1-2 years of experience in hospital setting",
    "Good communication and interpersonal skills",
    "Ability to work in shifts"
  ],
  "responsibilities": [
    "Provide direct patient care and monitor patient conditions",
    "Administer medications and treatments as prescribed",
    "Assist doctors during examinations and procedures",
    "Maintain accurate patient records and documentation",
    "Ensure infection control protocols are followed",
    "Educate patients and families about health conditions"
  ],
  "qualifications": [
    "B.Sc Nursing or GNM",
    "Valid registration with State Nursing Council",
    "BLS/ACLS certification preferred"
  ],
  "experience": "1-2 years",
  "location": "Coimbatore",
  "employmentType": "Full-time",
  "salaryRange": "₹25,000 - ₹35,000",
  "order": 1,
  "active": true,
  "postedDate": "2025-01-15",
  "closingDate": "2025-02-15"
}
```

#### **Lab Technician**
```json
{
  "title": "Lab Technician",
  "slug": "lab-technician",
  "designation": "Lab Technician",
  "department": "Laboratory",
  "description": "We are seeking an experienced Lab Technician to join our diagnostic laboratory team. The candidate will be responsible for performing various laboratory tests, maintaining equipment, and ensuring quality control standards. This role requires precision, attention to detail, and knowledge of laboratory procedures.",
  "shortDescription": "Experienced Lab Technician needed for our diagnostic laboratory. Perform tests and maintain quality standards.",
  "requirements": [
    "DMLT or B.Sc in Medical Laboratory Technology",
    "Minimum 2-3 years of experience in clinical laboratory",
    "Knowledge of laboratory equipment and procedures",
    "Attention to detail and accuracy",
    "Ability to work under pressure"
  ],
  "responsibilities": [
    "Perform routine and specialized laboratory tests",
    "Maintain and calibrate laboratory equipment",
    "Ensure quality control and accuracy of test results",
    "Prepare and analyze samples",
    "Maintain laboratory records and documentation",
    "Follow safety protocols and infection control measures"
  ],
  "qualifications": [
    "DMLT or B.Sc MLT",
    "Valid registration certificate",
    "Experience with automated analyzers preferred"
  ],
  "experience": "2-3 years",
  "location": "Coimbatore",
  "employmentType": "Full-time",
  "salaryRange": "₹20,000 - ₹30,000",
  "order": 2,
  "active": true,
  "postedDate": "2025-01-15",
  "closingDate": "2025-02-15"
}
```

#### **Receptionist**
```json
{
  "title": "Receptionist",
  "slug": "receptionist",
  "designation": "Receptionist",
  "department": "Administration",
  "description": "We are looking for a friendly and professional Receptionist to manage our front desk operations. The ideal candidate will greet patients, handle appointments, manage phone calls, and provide excellent customer service. This position requires strong communication skills and a welcoming demeanor.",
  "shortDescription": "Join our front desk team as a Receptionist. Provide excellent customer service and manage front office operations.",
  "requirements": [
    "High school diploma or equivalent",
    "Minimum 1 year of experience in reception or customer service",
    "Excellent communication skills in English and Tamil",
    "Proficiency in computer applications (MS Office)",
    "Pleasant personality and professional appearance"
  ],
  "responsibilities": [
    "Greet and assist patients and visitors",
    "Handle phone calls and inquiries",
    "Schedule and manage appointments",
    "Maintain patient records and files",
    "Process payments and billing",
    "Coordinate with different departments"
  ],
  "qualifications": [
    "High school diploma or equivalent",
    "Basic computer skills",
    "Good command of English and Tamil"
  ],
  "experience": "1 year",
  "location": "Coimbatore",
  "employmentType": "Full-time",
  "salaryRange": "₹15,000 - ₹22,000",
  "order": 3,
  "active": true,
  "postedDate": "2025-01-15",
  "closingDate": "2025-02-15"
}
```

## 🎯 **How to Set Up in Contentful:**

### **1. Create Content Type:**
1. Go to **Content model** in Contentful
2. Click **"Add content type"**
3. Set **Content type name**: "Job Vacancy"
4. Set **Content type ID**: "jobVacancy"

### **2. Add Fields:**

#### **Title Field:**
- **Field name**: "Job Title"
- **Field ID**: "title"
- **Field type**: Short text
- **Required**: Yes

#### **Slug Field:**
- **Field name**: "URL Slug"
- **Field ID**: "slug"
- **Field type**: Short text
- **Required**: Yes
- **Help text**: "URL-friendly identifier (e.g., 'staff-nurse')"
- **Validation**: Unique

#### **Designation Field:**
- **Field name**: "Designation"
- **Field ID**: "designation"
- **Field type**: Short text
- **Required**: Yes
- **Help text**: "Must match form dropdown options: Doctor, Staff Nurse, Lab Technician, Pharmacist, Medical Officer, Admin Staff, Receptionist, Security Guard, Housekeeping Staff, Maintenance Staff, Other"

#### **Department Field:**
- **Field name**: "Department"
- **Field ID**: "department"
- **Field type**: Short text
- **Required**: No
- **Help text**: "e.g., 'Nursing', 'Administration', 'Laboratory'"

#### **Description Field:**
- **Field name**: "Full Description"
- **Field ID**: "description"
- **Field type**: Long text
- **Required**: Yes

#### **Short Description Field:**
- **Field name**: "Short Description"
- **Field ID**: "shortDescription"
- **Field type**: Short text
- **Required**: No
- **Help text**: "Brief description for cards (2-3 lines)"

#### **Requirements Field:**
- **Field name**: "Requirements"
- **Field ID**: "requirements"
- **Field type**: Short text, List
- **Required**: No

#### **Responsibilities Field:**
- **Field name**: "Responsibilities"
- **Field ID**: "responsibilities"
- **Field type**: Short text, List
- **Required**: No

#### **Qualifications Field:**
- **Field name**: "Qualifications"
- **Field ID**: "qualifications"
- **Field type**: Short text, List
- **Required**: No

#### **Experience Field:**
- **Field name**: "Experience Required"
- **Field ID**: "experience"
- **Field type**: Short text
- **Required**: No
- **Help text**: "e.g., '2-5 years', 'Fresher', '5+ years'"

#### **Location Field:**
- **Field name**: "Location"
- **Field ID**: "location"
- **Field type**: Short text
- **Required**: No
- **Help text**: "e.g., 'Coimbatore'"

#### **Employment Type Field:**
- **Field name**: "Employment Type"
- **Field ID**: "employmentType"
- **Field type**: Short text
- **Required**: No
- **Help text**: "e.g., 'Full-time', 'Part-time', 'Contract'"

#### **Salary Range Field:**
- **Field name**: "Salary Range"
- **Field ID**: "salaryRange"
- **Field type**: Short text
- **Required**: No
- **Help text**: "e.g., '₹20,000 - ₹40,000' or 'As per industry standards'"

#### **Order Field:**
- **Field name**: "Display Order"
- **Field ID**: "order"
- **Field type**: Number
- **Required**: No
- **Help text**: "Lower numbers appear first"

#### **Active Field:**
- **Field name**: "Active Status"
- **Field ID**: "active"
- **Field type**: Boolean
- **Required**: No
- **Default value**: true
- **Help text**: "Whether position is currently accepting applications"

#### **Posted Date Field:**
- **Field name**: "Posted Date"
- **Field ID**: "postedDate"
- **Field type**: Date
- **Required**: No
- **Help text**: "Date when job was posted"

#### **Closing Date Field:**
- **Field name**: "Closing Date"
- **Field ID**: "closingDate"
- **Field type**: Date
- **Required**: No
- **Help text**: "Application deadline"

## 📝 **Notes:**

1. **Slug Format**: Use lowercase, hyphenated format (e.g., `staff-nurse`, `lab-technician`)
2. **Designation Matching**: The `designation` field must exactly match one of the predefined options in the form dropdown. This ensures the form can be pre-populated correctly when users click "Apply" on a job card.
3. **Ordering**: Jobs are sorted by the `order` field (ascending), then by creation date (newest first)
4. **Active Status**: Jobs with `active: false` will not appear on the current openings page
5. **Short Description**: If not provided, the first 150 characters of the full description will be used for the card display
6. **Date Fields**: Use ISO date format (YYYY-MM-DD) for posted and closing dates
7. **Salary Range**: Can be a range (e.g., "₹20,000 - ₹40,000") or text like "As per industry standards" or "Negotiable"

## 🔗 **URL Structure:**

- Main page: `/job-vacancies`
- Current openings: `/job-vacancies/current-openings`
- Application form: `/job-vacancies/apply?designation={designation}&job={slug}`

**Example URLs:**
- `/job-vacancies/apply?designation=Staff Nurse&job=staff-nurse`
- `/job-vacancies/apply?designation=Lab Technician&job=lab-technician`

## 🎨 **Best Practices:**

1. **Consistent Designation Names**: Always use the exact designation names from the predefined list to ensure form pre-population works correctly
2. **Clear Descriptions**: Write clear, concise job descriptions that highlight key responsibilities and requirements
3. **Complete Information**: Fill in as many fields as possible to provide comprehensive information to applicants
4. **Regular Updates**: Keep job postings up-to-date and set `active: false` for closed positions
5. **Order Management**: Use the `order` field to prioritize important or urgent positions
6. **Date Management**: Set appropriate closing dates and update them as needed

## 🔄 **Workflow:**

1. **Create Job Entry**: Add a new job vacancy entry in Contentful
2. **Fill Required Fields**: Complete title, slug, designation, and description
3. **Add Details**: Fill in optional fields like experience, location, salary range
4. **Set Active Status**: Ensure `active` is set to `true` for the job to appear on the website
5. **Set Order**: Assign an order number if you want to control the display sequence
6. **Publish**: Publish the entry to make it live on the website

## ⚠️ **Important Reminders:**

- **Designation must match exactly** with the form dropdown options
- **Slug must be unique** and URL-friendly
- **Active jobs only** appear on the current openings page
- **Form pre-population** works via query parameters: `?designation={designation}&job={slug}`

