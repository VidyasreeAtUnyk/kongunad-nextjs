// Contentful Type Definitions
export interface Doctor {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    doctorName: string
    department: string
    speciality: string
    experience: number
    degrees: string[]
    photo: {
      fields: {
        file: {
          url: string
          details: {
            size: number
            image: {
              width: number
              height: number
            }
          }
        }
        title: string
      }
    }
    bio?: string
    availability?: string
  }
}

export interface HealthPackage {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    description: string
    price: number
    discount?: number
    strikePrice?: number
    testList: (string | TestGroup)[]
    category: string
    icon?: {
      fields: {
        file: {
          url: string
        }
        title: string
      }
    }
    notes?: string[]
    special?: string[]
  }
}

export interface TestGroup {
  title: string
  tests: string[]
}

export interface Facility {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    name: string
    description: string
    category: string
    icon: {
      fields: {
        file: {
          url: string
        }
        title: string
      }
    }
    images: Array<{
      fields: {
        file: {
          url: string
        }
        title: string
      }
    }>
    services?: string[] // Optional - not used in Contentful
  }
}

export interface BuildingImage {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    order: number
    image: {
      fields: {
        file: {
          url: string
          details: {
            size: number
            image: {
              width: number
              height: number
            }
          }
        }
        title: string
      }
    }
  }
}

// Offers marquee item used in top banner
export interface OfferMarquee {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    flash?: string
    order?: number
    active?: boolean
  }
}

// About content used in homepage and about-us page
export interface AboutContent {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string
    description: string
    highlights: string[]
  }
}

export interface Navigation {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    name: string
    type: 'primary' | 'secondary' | 'mobile'
    position: 'left' | 'right' | 'mobile'
    items: NavigationItem[]
  }
}

export interface NavigationItem {
  title: string
  linkTo?: string
  to?: string
  hasDropdown?: boolean
  isLogo?: boolean
  iconAlt?: string
  iconName?: string
  icon?: ContentfulAsset
  dropdown?: NavigationDropdownItem[]
  sec?: NavigationSubItem[]
}

export interface NavigationDropdownItem {
  title: string
  to: string
  iconAlt?: string
  icon?: {
    sys: {
      type: "Link"
      linkType: "Asset"
      id: string
    }
  }
  sec?: NavigationSubItem[]
}

export interface NavigationSubItem {
  title: string
  to: string
}

// Utility Types
export type ContentfulEntry<T> = {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: T
}

export type ContentfulAsset = {
  fields: {
    file: {
      url: string
      details?: {
        size: number
        image?: {
          width: number
          height: number
        }
      }
    }
    title: string
  }
}

// Leadership singleton to select MD/Medical Director and optional overrides
export interface Leadership {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    managingDirector?: string
    medicalDirector?: string
    mdBio?: any
    mdPhoto?: ContentfulAsset
    mdBackgroundPhoto?: ContentfulAsset
    medicalDirectorBio?: any
    medicalDirectorPhoto?: ContentfulAsset
  }
}

// Research Program (DNB programs)
export interface ResearchProgram {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string // e.g., "DNB - General Surgery"
    slug: string // e.g., "dnb-general-surgery"
    description: string
    shortDescription?: string // Brief description for cards
    duration?: string // e.g., "3 years"
    requirements?: string[] // List of requirements
    curriculum?: string[] // List of curriculum items
    icon?: ContentfulAsset // Program icon
    contactPerson?: string // e.g., "Dr. Karthikeyan Ms."
    contactPhone?: string
    contactEmail?: string
    order?: number // For sorting
    active?: boolean // Whether program is currently accepting applications
  }
}

// Job Vacancy
export interface JobVacancy {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
  }
  fields: {
    title: string // e.g., "Staff Nurse"
    slug: string // e.g., "staff-nurse"
    designation: string // e.g., "Staff Nurse" (for form dropdown)
    department?: string // e.g., "Nursing"
    description: string // Full job description
    shortDescription?: string // Brief description for cards
    requirements?: string[] // List of requirements
    responsibilities?: string[] // List of responsibilities
    qualifications?: string[] // Required qualifications
    experience?: string // e.g., "2-5 years"
    location?: string // e.g., "Coimbatore"
    employmentType?: string // e.g., "Full-time", "Part-time"
    salaryRange?: string // e.g., "₹20,000 - ₹40,000"
    active: boolean // Whether position is currently open
    order?: number // For sorting
    postedDate?: string // Date posted
    closingDate?: string // Application deadline
  }
}




