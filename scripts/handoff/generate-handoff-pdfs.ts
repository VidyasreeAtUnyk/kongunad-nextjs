import { chromium, Browser, Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

// Base URL - defaults to deployed version, can be overridden with BASE_URL env var
// For local development: BASE_URL=http://localhost:3000 npm run handoff:generate
const BASE_URL = process.env.BASE_URL || 'https://kongunad-nextjs.vercel.app'

// Viewport sizes
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
}

// All pages to capture
const PAGES = [
  // Main pages
  { path: '/', name: 'Home' },
  { path: '/about-us', name: 'About Us' },
  { path: '/find-a-doctor', name: 'Find a Doctor' },
  { path: '/book-appointment', name: 'Book Appointment' },
  { path: '/book-a-health-checkup', name: 'Book Health Checkup' },
  { path: '/contact-us', name: 'Contact Us' },
  { path: '/cashless-treatment', name: 'Cashless Treatment' },
  
  // Facilities - Main
  { path: '/facilities', name: 'Facilities - Main' },
  
  // Facilities - Categories
  { path: '/facilities/out-patient-services', name: 'Facilities - Out Patient Services' },
  { path: '/facilities/inpatient-services', name: 'Facilities - Inpatient Services' },
  { path: '/facilities/supportive-medical-departments', name: 'Facilities - Supportive Medical Departments' },
  { path: '/facilities/other-diagnostic-facilities', name: 'Facilities - Other Diagnostic Facilities' },
  { path: '/facilities/radiology-imaging-services', name: 'Facilities - Radiology Imaging Services' },
  { path: '/facilities/laboratory-services', name: 'Facilities - Laboratory Services' },
  { path: '/facilities/endoscopy-services', name: 'Facilities - Endoscopy Services' },
  { path: '/facilities/non-medical-supportive-departments', name: 'Facilities - Non Medical Supportive Departments' },
  
  // Facilities - Detail Pages (Out Patient Services)
  { path: '/facilities/out-patient-services/main-opd', name: 'Facility - Main OPD' },
  { path: '/facilities/out-patient-services/emergency-opd-casualty', name: 'Facility - Emergency OPD (Casualty)' },
  { path: '/facilities/out-patient-services/cardiac-opd', name: 'Facility - Cardiac OPD' },
  { path: '/facilities/out-patient-services/surgeons-opd-surgical', name: 'Facility - Surgeons OPD (Surgical)' },
  { path: '/facilities/out-patient-services/physicians-opd-medical', name: 'Facility - Physicians OPD (Medical)' },
  { path: '/facilities/out-patient-services/pediatric-opd', name: 'Facility - Pediatric OPD' },
  { path: '/facilities/out-patient-services/orthopaedic-opd', name: 'Facility - Orthopaedic OPD' },
  { path: '/facilities/out-patient-services/obstetrics-gynaecology-opd', name: 'Facility - Obstetrics Gynaecology OPD' },
  { path: '/facilities/out-patient-services/speciality-opd', name: 'Facility - Speciality OPD' },
  
  // Facilities - Detail Pages (Inpatient Services)
  { path: '/facilities/inpatient-services/intensive-care-services', name: 'Facility - Intensive Care Services' },
  { path: '/facilities/inpatient-services/room-services', name: 'Facility - Room Services' },
  { path: '/facilities/inpatient-services/emergency-services', name: 'Facility - Emergency Services' },
  { path: '/facilities/inpatient-services/operation-theatre-services', name: 'Facility - Operation Theatre Services' },
  { path: '/facilities/inpatient-services/dialysis-services', name: 'Facility - Dialysis Services' },
  
  // Facilities - Detail Pages (Supportive Medical Departments)
  { path: '/facilities/supportive-medical-departments/pharmacy', name: 'Facility - Pharmacy' },
  { path: '/facilities/supportive-medical-departments/dietary-department', name: 'Facility - Dietary Department' },
  { path: '/facilities/supportive-medical-departments/mrd', name: 'Facility - MRD' },
  { path: '/facilities/supportive-medical-departments/medical-insurances-department', name: 'Facility - Medical Insurances Department' },
  { path: '/facilities/supportive-medical-departments/blood-bank', name: 'Facility - Blood Bank' },
  { path: '/facilities/supportive-medical-departments/biomedical-engineer', name: 'Facility - Biomedical Engineer' },
  { path: '/facilities/supportive-medical-departments/ambulance', name: 'Facility - Ambulance' },
  
  // Facilities - Detail Pages (Other Diagnostic Facilities)
  { path: '/facilities/other-diagnostic-facilities/uroflow-studies', name: 'Facility - Uroflow Studies' },
  { path: '/facilities/other-diagnostic-facilities/tmt', name: 'Facility - TMT' },
  { path: '/facilities/other-diagnostic-facilities/holder-monitor', name: 'Facility - Holder Monitor' },
  { path: '/facilities/other-diagnostic-facilities/ppg', name: 'Facility - PPG' },
  { path: '/facilities/other-diagnostic-facilities/ecg', name: 'Facility - ECG' },
  { path: '/facilities/other-diagnostic-facilities/eeg', name: 'Facility - EEG' },
  { path: '/facilities/other-diagnostic-facilities/emg', name: 'Facility - EMG' },
  { path: '/facilities/other-diagnostic-facilities/spirometry', name: 'Facility - Spirometry' },
  
  // Facilities - Detail Pages (Radiology & Imaging Services)
  { path: '/facilities/radiology-imaging-services/digital-x-rays', name: 'Facility - Digital X-Rays' },
  { path: '/facilities/radiology-imaging-services/mobile-x-ray-unit', name: 'Facility - Mobile X-Ray Unit' },
  { path: '/facilities/radiology-imaging-services/c-arm', name: 'Facility - C-Arm' },
  { path: '/facilities/radiology-imaging-services/ultrasound-scan', name: 'Facility - Ultrasound Scan' },
  { path: '/facilities/radiology-imaging-services/echo-transesophageal-echo', name: 'Facility - ECHO Transesophageal ECHO' },
  { path: '/facilities/radiology-imaging-services/cath-lab', name: 'Facility - Cath Lab' },
  { path: '/facilities/radiology-imaging-services/ct', name: 'Facility - CT' },
  { path: '/facilities/radiology-imaging-services/mri', name: 'Facility - MRI' },
  
  // Facilities - Detail Pages (Laboratory Services)
  { path: '/facilities/laboratory-services/haematology', name: 'Facility - Haematology' },
  { path: '/facilities/laboratory-services/biochemistry', name: 'Facility - Biochemistry' },
  { path: '/facilities/laboratory-services/microbiology', name: 'Facility - Microbiology' },
  { path: '/facilities/laboratory-services/histopathlogy', name: 'Facility - Histopathology' },
  
  // Facilities - Detail Pages (Endoscopy Services)
  { path: '/facilities/endoscopy-services/upper-gi-scopy', name: 'Facility - Upper GI Scopy' },
  { path: '/facilities/endoscopy-services/colonoscopy', name: 'Facility - Colonoscopy' },
  { path: '/facilities/endoscopy-services/bronchoscopy', name: 'Facility - Bronchoscopy' },
  { path: '/facilities/endoscopy-services/ercp', name: 'Facility - ERCP' },
  
  // Facilities - Detail Pages (Non Medical Supportive Departments)
  { path: '/facilities/non-medical-supportive-departments/administrative-director', name: 'Facility - Administrative Director' },
  { path: '/facilities/non-medical-supportive-departments/ceo-chief-excecutive-officer', name: 'Facility - CEO Chief Executive Officer' },
  { path: '/facilities/non-medical-supportive-departments/pro-public-relation-officer', name: 'Facility - PRO Public Relation Officer' },
  { path: '/facilities/non-medical-supportive-departments/hrd-human-resources-department', name: 'Facility - HRD Human Resources Department' },
  { path: '/facilities/non-medical-supportive-departments/reception-front-office', name: 'Facility - Reception Front Office' },
  { path: '/facilities/non-medical-supportive-departments/admission-department', name: 'Facility - Admission Department' },
  { path: '/facilities/non-medical-supportive-departments/office', name: 'Facility - Office' },
  { path: '/facilities/non-medical-supportive-departments/biomedical-waste-management', name: 'Facility - Biomedical Waste Management' },
  { path: '/facilities/non-medical-supportive-departments/maintenance-department', name: 'Facility - Maintenance Department' },
  { path: '/facilities/non-medical-supportive-departments/security', name: 'Facility - Security' },
  { path: '/facilities/non-medical-supportive-departments/house-keeping', name: 'Facility - House Keeping' },
  { path: '/facilities/non-medical-supportive-departments/canteen', name: 'Facility - Canteen' },
  { path: '/facilities/non-medical-supportive-departments/coffee-bar-fruit-stall', name: 'Facility - Coffee Bar Fruit Stall' },
  { path: '/facilities/non-medical-supportive-departments/fire-safety-department', name: 'Facility - Fire Safety Department' },
  { path: '/facilities/non-medical-supportive-departments/lift-service', name: 'Facility - Lift Service' },
  
  // Specialities - Main
  { path: '/specialities', name: 'Specialities - Main' },
  
  // Specialities - Types
  { path: '/specialities/medical-specialties', name: 'Specialities - Medical Specialties' },
  { path: '/specialities/surgical-specialties', name: 'Specialities - Surgical Specialties' },
  
  // Specialities - Detail Pages (Medical Specialties)
  { path: '/specialities/medical-specialties/general-medicine', name: 'Speciality - General Medicine' },
  { path: '/specialities/medical-specialties/critical-care-medicine', name: 'Speciality - Critical Care Medicine' },
  { path: '/specialities/medical-specialties/emergency-medicine', name: 'Speciality - Emergency Medicine' },
  { path: '/specialities/medical-specialties/neurology', name: 'Speciality - Neurology' },
  { path: '/specialities/medical-specialties/dental', name: 'Speciality - Dental' },
  { path: '/specialities/medical-specialties/cardiology', name: 'Speciality - Cardiology' },
  { path: '/specialities/medical-specialties/nephrology', name: 'Speciality - Nephrology' },
  { path: '/specialities/medical-specialties/hepatology', name: 'Speciality - Hepatology' },
  { path: '/specialities/medical-specialties/medical-gastro-enterology', name: 'Speciality - Medical Gastro Enterology' },
  { path: '/specialities/medical-specialties/respiratory-medicine', name: 'Speciality - Respiratory Medicine' },
  { path: '/specialities/medical-specialties/rheumatology', name: 'Speciality - Rheumatology' },
  { path: '/specialities/medical-specialties/oncology', name: 'Speciality - Oncology' },
  { path: '/specialities/medical-specialties/pediatrics', name: 'Speciality - Pediatrics' },
  { path: '/specialities/medical-specialties/dermatology', name: 'Speciality - Dermatology' },
  { path: '/specialities/medical-specialties/psychology', name: 'Speciality - Psychology' },
  { path: '/specialities/medical-specialties/diabetology', name: 'Speciality - Diabetology' },
  { path: '/specialities/medical-specialties/radiology', name: 'Speciality - Radiology' },
  { path: '/specialities/medical-specialties/hematology', name: 'Speciality - Hematology' },
  { path: '/specialities/medical-specialties/pathology', name: 'Speciality - Pathology' },
  
  // Specialities - Detail Pages (Surgical Specialties)
  { path: '/specialities/surgical-specialties/plastic-surgeries', name: 'Speciality - Plastic Surgeries' },
  { path: '/specialities/surgical-specialties/general-laparoscopy-surgery', name: 'Speciality - General Laparoscopy Surgery' },
  { path: '/specialities/surgical-specialties/anesthesiology', name: 'Speciality - Anesthesiology' },
  { path: '/specialities/surgical-specialties/neuro-surgery', name: 'Speciality - Neuro Surgery' },
  { path: '/specialities/surgical-specialties/eye-surgery', name: 'Speciality - Eye Surgery' },
  { path: '/specialities/surgical-specialties/ent-surgery', name: 'Speciality - ENT Surgery' },
  { path: '/specialities/surgical-specialties/dental-facio-maxillary-surgery', name: 'Speciality - Dental Facio Maxillary Surgery' },
  { path: '/specialities/surgical-specialties/endocrine-surgeries', name: 'Speciality - Endocrine Surgeries' },
  { path: '/specialities/surgical-specialties/cardio-thoracic-surgery', name: 'Speciality - Cardio Thoracic Surgery' },
  { path: '/specialities/surgical-specialties/interventional-cardiology', name: 'Speciality - Interventional Cardiology' },
  { path: '/specialities/surgical-specialties/surgical-gastro-enterology', name: 'Speciality - Surgical Gastro Enterology' },
  { path: '/specialities/surgical-specialties/hepato-biliary-surgeries', name: 'Speciality - Hepato Biliary Surgeries' },
  { path: '/specialities/surgical-specialties/genito-urinary-surgery', name: 'Speciality - Genito Urinary Surgery' },
  { path: '/specialities/surgical-specialties/orthopedic-surgeries', name: 'Speciality - Orthopedic Surgeries' },
  { path: '/specialities/surgical-specialties/spine-surgeries', name: 'Speciality - Spine Surgeries' },
  { path: '/specialities/surgical-specialties/obstetrics-gynaecology-surgeries', name: 'Speciality - Obstetrics Gynaecology Surgeries' },
  { path: '/specialities/surgical-specialties/pediatric-surgeries', name: 'Speciality - Pediatric Surgeries' },
  { path: '/specialities/surgical-specialties/vascular-surgeries', name: 'Speciality - Vascular Surgeries' },
  { path: '/specialities/surgical-specialties/cancer-surgeries', name: 'Speciality - Cancer Surgeries' },
  { path: '/specialities/surgical-specialties/transplant-surgeries', name: 'Speciality - Transplant Surgeries' },
  { path: '/specialities/surgical-specialties/bariatric-surgery', name: 'Speciality - Bariatric Surgery' },
  
  // Job Vacancies
  { path: '/job-vacancies', name: 'Job Vacancies - Main' },
  { path: '/job-vacancies/current-openings', name: 'Job Vacancies - Current Openings' },
  { path: '/job-vacancies/staff-nurse', name: 'Job Vacancies - Staff Nurse' },
  { path: '/job-vacancies/apply', name: 'Job Vacancies - Application Form' },
  
  // Medical Studies & Research
  { path: '/medical-studies-research', name: 'Medical Studies - Main' },
  { path: '/medical-studies-research/dnb-general-surgery', name: 'Research - DNB General Surgery' },
  { path: '/medical-studies-research/dnb-general-medicine', name: 'Research - DNB General Medicine' },
  // Note: Add specific research program detail pages if needed (e.g., /medical-studies-research/[slug])
]

// Custom pages to capture (if specified, only these will be captured)
const CUSTOM_PAGES = [
  { path: '/medical-studies-research/dnb-general-surgery', name: 'Research - DNB General Surgery' },
  { path: '/medical-studies-research/dnb-general-medicine', name: 'Research - DNB General Medicine' },
]

// Note: Some pages above may return 404 if the content doesn't exist in Contentful yet.
// The script will continue processing other pages even if some fail.

async function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

async function capturePage(
  browser: Browser,
  url: string,
  viewport: { width: number; height: number },
  outputPath: string,
  pageName: string
) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  })
  
  const page = await context.newPage()
  
  try {
    console.log(`Capturing ${pageName} at ${viewport.width}x${viewport.height}...`)
    
    // Navigate to page
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    
    // Wait for all images to load (including lazy-loaded ones)
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true }) // Continue even if image fails
            // Timeout after 5 seconds
            setTimeout(resolve, 5000)
          })
        })
      )
    })
    
    // Wait for fonts to load
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    
    // Wait a bit for any remaining lazy loading or animations
    await page.waitForTimeout(1000)
    
    // Close campaign poster modal if it's open
    try {
      // Wait a bit for modal to potentially appear (it shows after 500ms delay)
      await page.waitForTimeout(1500)
      
      // Check if dialog is visible
      const dialog = page.locator('[role="dialog"]').first()
      const isDialogVisible = await dialog.isVisible({ timeout: 500 }).catch(() => false)
      
      if (isDialogVisible) {
        // Try to find and click the close button
        const closeButton = dialog.locator('button[aria-label="Close campaign poster"]').first()
        const isButtonVisible = await closeButton.isVisible({ timeout: 500 }).catch(() => false)
        
        if (isButtonVisible) {
          await closeButton.click()
          await page.waitForTimeout(500) // Wait for modal to close
          console.log(`  Closed campaign poster modal`)
        } else {
          // Fallback: press Escape key
          await page.keyboard.press('Escape')
          await page.waitForTimeout(500)
          console.log(`  Closed campaign poster modal (via Escape key)`)
        }
      }
    } catch (error) {
      // Modal might not be present, which is fine
      // Continue with capture
    }
    
    // Scroll slowly to trigger scroll animations (like timeline)
    // This ensures IntersectionObserver-based animations are triggered
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
    const viewportHeight = viewport.height
    const scrollIncrement = viewportHeight * 0.6 // Scroll in 60% viewport increments
    const scrollSteps = Math.ceil(scrollHeight / scrollIncrement)
    
    // Scroll down incrementally to trigger all IntersectionObserver animations
    for (let i = 0; i <= scrollSteps; i++) {
      const scrollPosition = Math.min(i * scrollIncrement, scrollHeight)
      await page.evaluate((pos) => {
        window.scrollTo(0, pos)
      }, scrollPosition)
      await page.waitForTimeout(400) // Wait for IntersectionObserver to trigger and animations to start
      
      // Wait for any lazy-loaded images that come into view during scroll
      await page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll('img[loading="lazy"]')) as HTMLImageElement[]
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve()
            return new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true })
              img.addEventListener('error', resolve, { once: true })
              setTimeout(resolve, 2000) // Timeout after 2 seconds
            })
          })
        )
      })
    }
    
    // Wait for all animations to complete (timeline uses 0.6s transitions)
    await page.waitForTimeout(1000)
    
    // Final check: ensure all images are loaded before capturing
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
            setTimeout(resolve, 3000) // Timeout after 3 seconds
          })
        })
      )
    })
    
    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(500)
    
    // Generate screenshot only (PDFs will be added later)
    await page.screenshot({
      path: outputPath,
      fullPage: true,
    })
    
    console.log(`✓ Screenshot saved: ${outputPath}`)
  } catch (error: any) {
    const errorMessage = error?.message || String(error)
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      console.warn(`⚠ Page not found (404): ${pageName} - ${url}`)
    } else {
      console.error(`✗ Error capturing ${pageName}:`, errorMessage)
    }
  } finally {
    await context.close()
  }
}

async function captureDoctorModal(
  browser: Browser,
  doctorId: string,
  doctorName: string,
  viewport: { width: number; height: number },
  outputPath: string
) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
  })
  
  const page = await context.newPage()
  
  try {
    console.log(`Capturing doctor modal: ${doctorName} at ${viewport.width}x${viewport.height}...`)
    
    // Navigate to find-a-doctor page
    await page.goto(`${BASE_URL}/find-a-doctor`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000) // Wait for React to hydrate
    
    // Close campaign poster modal if it's open
    try {
      await page.waitForTimeout(1500)
      const dialog = page.locator('[role="dialog"]').first()
      const isDialogVisible = await dialog.isVisible({ timeout: 500 }).catch(() => false)
      
      if (isDialogVisible) {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
      }
    } catch (error) {
      // Continue
    }
    
    // Step 1: Find the doctor card by doctor name
    console.log(`  Finding doctor card for: ${doctorName}`)
    const cardFound = await page.evaluate((name) => {
      // Find all doctor cards
      const cards = Array.from(document.querySelectorAll('[class*="MuiCard-root"]'))
      
      for (const card of cards) {
        const cardText = card.textContent || ''
        // Check if this card contains the doctor's name
        if (cardText.includes(name)) {
          return true
        }
      }
      return false
    }, doctorName)
    
    if (!cardFound) {
      console.log(`  ⚠ Could not find card for ${doctorName}, scrolling to load more...`)
      // Scroll to load more cards
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      await page.waitForTimeout(2000)
      await page.evaluate(() => {
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(1000)
    }
    
    // Step 2: Find the View Profile button for this doctor
    console.log(`  Finding View Profile button for: ${doctorName}`)
    const buttonClicked = await page.evaluate((name) => {
      // Find all buttons
      const buttons = Array.from(document.querySelectorAll('button, [role="button"]'))
      
      for (const button of buttons) {
        const buttonText = button.textContent?.toLowerCase() || ''
        // Check if this is a View Profile button
        if (buttonText.includes('view profile') || buttonText.includes('profile')) {
          // Check if this button is within a card that contains the doctor's name
          let parent = button.parentElement
          let foundInCard = false
          
          // Traverse up to find the card
          while (parent && parent !== document.body) {
            if (parent.classList.toString().includes('MuiCard')) {
              const cardText = parent.textContent || ''
              if (cardText.includes(name)) {
                foundInCard = true
                break
              }
            }
            parent = parent.parentElement
          }
          
          if (foundInCard) {
            // Scroll button into view and click
            button.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setTimeout(() => {
              (button as HTMLElement).click()
            }, 500)
            return true
          }
        }
      }
      return false
    }, doctorName)
    
    if (!buttonClicked) {
      // Fallback: Try clicking buttons and checking if modal matches
      console.log(`  ⚠ Button not found by name, trying fallback method...`)
      const buttons = await page.locator('button, [role="button"]').all()
      
      for (const button of buttons.slice(0, 100)) {
        try {
          const buttonText = await button.textContent()
          if (buttonText && (buttonText.toLowerCase().includes('view profile') || buttonText.toLowerCase().includes('profile'))) {
            // Check if this button's parent card contains the doctor name
            const parentCard = await button.evaluateHandle((btn) => {
              let parent = btn.parentElement
              while (parent && parent !== document.body) {
                if (parent.classList.toString().includes('MuiCard')) {
                  return parent
                }
                parent = parent.parentElement
              }
              return null
            })
            
            if (parentCard) {
              const cardText = await parentCard.asElement()?.textContent()
              if (cardText && cardText.includes(doctorName)) {
                await button.scrollIntoViewIfNeeded()
                await button.click({ timeout: 2000 })
                break
              }
            }
          }
        } catch (e) {
          // Continue
        }
      }
    }
    
    // Step 3: Wait for modal to appear
    console.log(`  Waiting for modal to appear...`)
    await page.waitForSelector('[role="dialog"]', { timeout: 10000 }).catch(() => {
      console.log(`  ⚠ Modal did not appear`)
    })
    
    // Step 4: Wait for modal content to load (check for loading skeleton to disappear)
    console.log(`  Waiting for modal content to load...`)
    try {
      await page.waitForFunction(
        () => {
          const dialog = document.querySelector('[role="dialog"]')
          if (!dialog) return false
          // Check if loading skeleton is gone
          const hasSkeleton = dialog.querySelector('[class*="MuiSkeleton"]')
          // Check if doctor name is present in modal
          const modalText = dialog.textContent || ''
          const hasContent = modalText.length > 50
          return !hasSkeleton && hasContent
        },
        { timeout: 15000 }
      )
    } catch (error) {
      console.log(`  ⚠ Modal content loading timeout, proceeding anyway...`)
    }
    
    // Wait for images in modal to load
    await page.evaluate(async () => {
      const dialog = document.querySelector('[role="dialog"]')
      if (!dialog) return
      
      const images = Array.from(dialog.querySelectorAll('img')) as HTMLImageElement[]
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
            setTimeout(resolve, 3000)
          })
        })
      )
    })
    
    await page.waitForTimeout(1000)
    
    // Step 5: Scroll the fields column to ensure all content is visible before screenshot
    // The modal has a scrollable fields column on the right (on tablet/desktop)
    console.log(`  Scrolling fields column to show all content...`)
    await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]')
      if (!dialog) return
      
      // Find the scrollable fields container (has overflowY: auto)
      const scrollableContainer = dialog.querySelector('[style*="overflow-y"], [style*="overflowY"]') as HTMLElement
      if (scrollableContainer && scrollableContainer.scrollHeight > scrollableContainer.clientHeight) {
        // Scroll to bottom to show all fields
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight
        // Wait a bit, then scroll back to top for consistent screenshot
        setTimeout(() => {
          scrollableContainer.scrollTop = 0
        }, 500)
      }
    })
    
    await page.waitForTimeout(1000)
    
    // Step 6: Screenshot the modal
    console.log(`  Taking screenshot of modal...`)
    const dialog = page.locator('[role="dialog"]').first()
    const isVisible = await dialog.isVisible({ timeout: 2000 }).catch(() => false)
    
    if (isVisible) {
      const isMobile = viewport.width <= 768
      
      if (isMobile) {
        // For mobile, get the actual scrollable height of the modal content
        const modalInfo = await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]') as HTMLElement
          if (!dialog) return null
          
          // Scroll to top first
          dialog.scrollTop = 0
          
          // Get the actual scrollable height - check both dialog and its content containers
          let totalScrollHeight = dialog.scrollHeight
          
          // Check all children for scrollable content
          const allElements = Array.from(dialog.querySelectorAll('*')) as HTMLElement[]
          for (const el of allElements) {
            const style = window.getComputedStyle(el)
            if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
              if (el.scrollHeight > totalScrollHeight) {
                totalScrollHeight = el.scrollHeight
              }
            }
          }
          
          const rect = dialog.getBoundingClientRect()
          return {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            visibleHeight: rect.height,
            scrollHeight: totalScrollHeight,
          }
        })
        
        await page.waitForTimeout(500)
        
        if (modalInfo) {
          // Use the scrollHeight to capture full content
          const captureHeight = Math.min(modalInfo.scrollHeight, viewport.height * 5) // Allow up to 5x viewport
          
          await page.screenshot({
            path: outputPath,
            clip: {
              x: Math.max(0, modalInfo.x),
              y: Math.max(0, modalInfo.y),
              width: Math.min(modalInfo.width, viewport.width),
              height: captureHeight,
            },
          })
          console.log(`✓ Doctor modal screenshot saved (mobile, scrollHeight: ${Math.round(modalInfo.scrollHeight)}px, captured: ${Math.round(captureHeight)}px): ${outputPath}`)
        } else {
          // Fallback: use dialog screenshot
          await dialog.screenshot({ path: outputPath })
          console.log(`✓ Doctor modal screenshot saved: ${outputPath}`)
        }
      } else {
        // For tablet/desktop, scroll fields column to show content
        await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"]')
          if (!dialog) return
          
          const scrollableContainer = dialog.querySelector('[style*="overflow-y"], [style*="overflowY"]') as HTMLElement
          if (scrollableContainer && scrollableContainer.scrollHeight > scrollableContainer.clientHeight) {
            // Scroll to top to show first fields
            scrollableContainer.scrollTop = 0
          }
        })
        
        await page.waitForTimeout(500)
        
        await dialog.screenshot({
          path: outputPath,
        })
        console.log(`✓ Doctor modal screenshot saved: ${outputPath}`)
      }
    } else {
      console.log(`  ⚠ Modal not visible, saving full page screenshot`)
      await page.screenshot({
        path: outputPath,
        fullPage: true,
      })
    }
    
    // Step 6: Close modal
    console.log(`  Closing modal...`)
    try {
      const closeButton = page.locator('[role="dialog"] button[aria-label*="close" i]').first()
      const closeButtonVisible = await closeButton.isVisible({ timeout: 1000 }).catch(() => false)
      
      if (closeButtonVisible) {
        await closeButton.click({ timeout: 1000 })
      } else {
        // Try Escape key
        await page.keyboard.press('Escape')
      }
      await page.waitForTimeout(1000) // Wait for modal to close
    } catch (error) {
      // Modal might already be closed
      await page.keyboard.press('Escape')
      await page.waitForTimeout(500)
    }
    
  } catch (error: any) {
    const errorMessage = error?.message || String(error)
    console.error(`✗ Error capturing doctor modal ${doctorName}:`, errorMessage)
  } finally {
    await context.close()
  }
}

async function captureAllDoctorModals(testMode: boolean = false) {
  const outputDir = path.join(process.cwd(), 'handoff-pdfs')
  await ensureDirectoryExists(outputDir)
  
  const desktopDir = path.join(outputDir, 'desktop')
  const tabletDir = path.join(outputDir, 'tablet')
  const mobileDir = path.join(outputDir, 'mobile')
  
  await ensureDirectoryExists(desktopDir)
  await ensureDirectoryExists(tabletDir)
  await ensureDirectoryExists(mobileDir)
  
  const browser = await chromium.launch({ headless: true })
  const captureDesktopOnly = process.env.DESKTOP_ONLY === 'true'
  
  try {
    // Create a context for navigating pages
    const context = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    
    console.log('=== Starting Doctor Modal Capture ===')
    console.log(`Base URL: ${BASE_URL}`)
    console.log(`Desktop only: ${captureDesktopOnly}`)
    console.log(`Test mode: ${testMode}`)
    
    // Navigate to find-a-doctor page
    console.log('\n[STEP 1] Navigating to find-a-doctor page...')
    await page.goto(`${BASE_URL}/find-a-doctor`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    console.log('✓ Page loaded')
    
    // Close campaign poster if present
    console.log('\n[STEP 2] Closing campaign poster if present...')
    try {
      const dialog = page.locator('[role="dialog"]').first()
      const isDialogVisible = await dialog.isVisible({ timeout: 1000 }).catch(() => false)
      if (isDialogVisible) {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
        console.log('✓ Campaign poster closed')
      } else {
        console.log('  No campaign poster found')
      }
    } catch (error) {
      console.log('  No campaign poster to close')
    }
    
    // Wait for doctor cards to load
    console.log('\n[STEP 3] Waiting for doctor cards to load...')
    await page.waitForSelector('[class*="MuiCard"]', { timeout: 15000 })
    console.log('✓ Doctor cards loaded')
    
    // Get total number of pages
    const totalPages = await page.evaluate(() => {
      const pagination = document.querySelector('[class*="MuiPagination"]')
      if (!pagination) return 1
      
      const buttons = Array.from(pagination.querySelectorAll('button'))
      let maxPage = 1
      for (const button of buttons) {
        const text = button.textContent?.trim() || ''
        const num = parseInt(text)
        if (!isNaN(num) && num > maxPage) {
          maxPage = num
        }
      }
      return maxPage
    })
    
    console.log(`\n[INFO] Total pages detected: ${totalPages}`)
    const pagesToProcess = testMode ? 1 : Math.min(totalPages, 5)
    console.log(`[INFO] Will process pages: 1 to ${pagesToProcess}`)
    
    let totalCaptured = 0
    
    // Process each page
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`PAGE ${pageNum} of ${pagesToProcess}`)
      console.log('='.repeat(60))
      
      // Navigate to page if not page 1
      if (pageNum > 1) {
        console.log(`\n[PAGE ${pageNum}] Step 1: Navigating to page ${pageNum}...`)
        
        // Get current page first
        let currentPage = await page.evaluate(() => {
          const pagination = document.querySelector('[class*="MuiPagination"]')
          if (!pagination) return 1
          const activeButton = pagination.querySelector('button[aria-current="true"], button[class*="Mui-selected"]')
          if (activeButton) {
            const text = activeButton.textContent?.trim() || ''
            return parseInt(text) || 1
          }
          return 1
        })
        
        console.log(`  Current page: ${currentPage}, Target page: ${pageNum}`)
        
        // Navigate incrementally using "next" button until we reach target page
        while (currentPage < pageNum) {
          console.log(`  Navigating from page ${currentPage} to page ${currentPage + 1}...`)
          
          // Scroll to pagination
          await page.evaluate(() => {
            const pagination = document.querySelector('[class*="MuiPagination"]')
            if (pagination) {
              pagination.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          })
          await page.waitForTimeout(500)
          
          // Try to click page number button first (if visible)
          const targetPageForThisStep = currentPage + 1
          let clicked = await page.evaluate((targetPage: number) => {
            const pagination = document.querySelector('[class*="MuiPagination"]')
            if (!pagination) return false
            
            const buttons = Array.from(pagination.querySelectorAll('button'))
            for (const button of buttons) {
              const text = button.textContent?.trim() || ''
              const ariaLabel = button.getAttribute('aria-label') || ''
              const isDisabled = button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true'
              
              if (isDisabled || text === '‹' || text === '›' || text === '«' || text === '»' || text === 'First' || text === 'Last' || text === '') {
                continue
              }
              
              if (text === String(targetPage) || 
                  ariaLabel.includes(`page ${targetPage}`) ||
                  ariaLabel.includes(`Go to page ${targetPage}`)) {
                (button as HTMLElement).click()
                return true
              }
            }
            return false
          }, targetPageForThisStep)
          
          // If direct page click didn't work, use next button
          if (!clicked) {
            console.log(`  Page ${targetPageForThisStep} button not visible, using next button...`)
            const nextButton = page.locator('button[aria-label*="next" i], button[aria-label*="Go to next page" i]').first()
            const nextExists = await nextButton.isVisible({ timeout: 2000 }).catch(() => false)
            
            if (nextExists) {
              const isDisabled = await nextButton.getAttribute('disabled').then(v => v !== null).catch(() => false)
              if (!isDisabled) {
                await nextButton.click()
                clicked = true
                console.log(`  ✓ Clicked next button`)
              } else {
                console.log(`  ✗ Next button is disabled`)
                break
              }
            } else {
              console.log(`  ✗ Next button not found`)
              break
            }
          } else {
            console.log(`  ✓ Clicked page ${targetPageForThisStep} button`)
          }
          
          if (!clicked) {
            console.log(`  ✗ Could not navigate to page ${targetPageForThisStep}`)
            break
          }
          
          // Wait for page to change
          await page.waitForTimeout(2000)
          
          // Verify we moved to the next page
          let verified = false
          let verifyAttempts = 0
          const maxVerifyAttempts = 10
          
          while (!verified && verifyAttempts < maxVerifyAttempts) {
            await page.waitForTimeout(1000)
            
            const newPage = await page.evaluate(() => {
              const pagination = document.querySelector('[class*="MuiPagination"]')
              if (!pagination) return null
              const activeButton = pagination.querySelector('button[aria-current="true"], button[class*="Mui-selected"]')
              if (activeButton) {
                const text = activeButton.textContent?.trim() || ''
                return parseInt(text) || null
              }
              return null
            })
            
            if (newPage === targetPageForThisStep) {
              verified = true
              currentPage = newPage
              console.log(`  ✓ Verified: Now on page ${currentPage}`)
            } else {
              verifyAttempts++
              console.log(`  Verify attempt ${verifyAttempts}: Current page ${newPage}, expected ${targetPageForThisStep}. Waiting...`)
            }
          }
          
          if (!verified) {
            console.log(`  ✗ Could not verify navigation to page ${targetPageForThisStep}`)
            break
          }
        }
        
        // Final verification that we're on the target page
        if (currentPage !== pageNum) {
          console.log(`  ✗ Failed to reach page ${pageNum}. Current page: ${currentPage}. Skipping...`)
          continue
        }
        
        console.log(`  ✓ Successfully navigated to page ${pageNum}`)
      }
      
      // Wait for content to load
      console.log(`\n[PAGE ${pageNum}] Step 3: Waiting for content to load...`)
      await page.waitForTimeout(2000)
      console.log('  ✓ Content loaded')
      
      // Get all View Profile buttons on current page
      console.log(`\n[PAGE ${pageNum}] Step 4: Identifying doctor profile buttons...`)
      const profileButtons = await page.locator('button, [role="button"]').all()
      const viewProfileButtons: typeof profileButtons = []
      
      for (const button of profileButtons) {
        const text = await button.textContent().catch(() => '')
        if (text && (text.toLowerCase().includes('view profile') || text.toLowerCase().includes('profile'))) {
          viewProfileButtons.push(button)
        }
      }
      
      console.log(`  ✓ Found ${viewProfileButtons.length} "View Profile" buttons`)
      
      if (viewProfileButtons.length === 0) {
        console.log(`  ⚠ No profile buttons found on page ${pageNum}, skipping...`)
        continue
      }
      
      // Process each doctor on this page
      for (let i = 0; i < viewProfileButtons.length; i++) {
        const buttonIndex = i + 1
        console.log(`\n[PAGE ${pageNum}] Doctor ${buttonIndex}/${viewProfileButtons.length}:`)
        
        try {
          // Step 5: Click the profile button
          console.log(`  Step 5: Clicking profile button...`)
          await viewProfileButtons[i].scrollIntoViewIfNeeded()
          await page.waitForTimeout(300)
          await viewProfileButtons[i].click()
          console.log(`  ✓ Button clicked`)
          
          // Step 6: Wait for modal to load
          console.log(`  Step 6: Waiting for modal to load...`)
          await page.waitForSelector('[role="dialog"]', { timeout: 10000 })
          
          // Wait for modal content to load (check for loading skeleton to disappear)
          await page.waitForFunction(
            () => {
              const dialog = document.querySelector('[role="dialog"]')
              if (!dialog) return false
              const hasSkeleton = dialog.querySelector('[class*="MuiSkeleton"]')
              const hasContent = dialog.textContent && dialog.textContent.length > 50
              return !hasSkeleton && hasContent
            },
            { timeout: 15000 }
          ).catch(() => {
            console.log(`  ⚠ Modal content loading timeout, proceeding anyway...`)
          })
          
          // Wait for images
          await page.evaluate(async () => {
            const dialog = document.querySelector('[role="dialog"]')
            if (!dialog) return
            const images = Array.from(dialog.querySelectorAll('img')) as HTMLImageElement[]
            await Promise.all(
              images.map((img) => {
                if (img.complete) return Promise.resolve()
                return new Promise((resolve) => {
                  img.addEventListener('load', resolve, { once: true })
                  img.addEventListener('error', resolve, { once: true })
                  setTimeout(resolve, 3000)
                })
              })
            )
          })
          
          await page.waitForTimeout(500)
          console.log(`  ✓ Modal loaded`)
          
          // Get doctor name for filename
          const doctorName = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"]')
            if (!dialog) return 'Unknown'
            const nameElement = dialog.querySelector('h3, h2, [class*="Typography"]') || dialog
            return nameElement.textContent?.split('\n')[0]?.trim() || 'Unknown'
          })
          
          console.log(`  Doctor name: ${doctorName}`)
          
          // Step 7: Capture screenshot
          console.log(`  Step 7: Capturing screenshot...`)
          const sanitizedName = doctorName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
          
          // Generate unique filename if file already exists
          let filename = `doctor___${sanitizedName}.png`
          let filePath = path.join(desktopDir, filename)
          let counter = 1
          
          while (fs.existsSync(filePath)) {
            filename = `doctor___${sanitizedName}_${counter}.png`
            filePath = path.join(desktopDir, filename)
            counter++
          }
          
          if (counter > 1) {
            console.log(`  ⚠ File already exists, saving as: ${filename}`)
          }
          
          // Desktop
          const dialog = page.locator('[role="dialog"]').first()
          await dialog.screenshot({
            path: filePath,
          })
          console.log(`  ✓ Desktop screenshot saved: ${filename}`)
          totalCaptured++
          
          if (!captureDesktopOnly) {
            // Tablet and Mobile would go here
            console.log(`  (Skipping tablet/mobile for now)`)
          }
          
          // Step 8: Close modal
          console.log(`  Step 8: Closing modal...`)
          try {
            const closeButton = page.locator('[role="dialog"] button[aria-label*="close" i]').first()
            const closeButtonVisible = await closeButton.isVisible({ timeout: 1000 }).catch(() => false)
            
            if (closeButtonVisible) {
              await closeButton.click()
            } else {
              await page.keyboard.press('Escape')
            }
            await page.waitForTimeout(1000)
            console.log(`  ✓ Modal closed`)
          } catch (error) {
            await page.keyboard.press('Escape')
            await page.waitForTimeout(500)
            console.log(`  ✓ Modal closed (via Escape)`)
          }
          
          // Step 9: Move to next doctor (already in loop)
          console.log(`  ✓ Doctor ${buttonIndex} completed`)
          
        } catch (error: any) {
          console.log(`  ✗ Error capturing doctor ${buttonIndex}: ${error?.message || String(error)}`)
          // Try to close modal if it's open
          try {
            await page.keyboard.press('Escape')
            await page.waitForTimeout(500)
          } catch (e) {
            // Ignore
          }
          // Continue to next doctor
        }
      }
      
      console.log(`\n[PAGE ${pageNum}] ✓ Completed: Captured ${viewProfileButtons.length} doctors`)
      console.log(`[INFO] Total captured so far: ${totalCaptured}`)
    }
    
    await context.close()
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✓ ALL DOCTOR MODALS CAPTURED SUCCESSFULLY!`)
    console.log(`Total doctors captured: ${totalCaptured}`)
    console.log(`Output directory: ${outputDir}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n✗ Error during doctor modal capture:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

async function captureAllPackageModals(testMode: boolean = false) {
  const outputDir = path.join(process.cwd(), 'handoff-pdfs')
  await ensureDirectoryExists(outputDir)
  
  const desktopDir = path.join(outputDir, 'desktop')
  await ensureDirectoryExists(desktopDir)
  
  const browser = await chromium.launch({ headless: true })
  const captureDesktopOnly = process.env.DESKTOP_ONLY === 'true'
  
  try {
    const context = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    
    console.log('=== Starting Package Modal Capture ===')
    console.log(`Base URL: ${BASE_URL}`)
    console.log(`Desktop only: ${captureDesktopOnly}`)
    console.log(`Test mode: ${testMode}`)
    
    // Navigate to book-a-health-checkup page
    console.log('\n[STEP 1] Navigating to book-a-health-checkup page...')
    await page.goto(`${BASE_URL}/book-a-health-checkup`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    console.log('✓ Page loaded')
    
    // Close campaign poster if present
    console.log('\n[STEP 2] Closing campaign poster if present...')
    try {
      const dialog = page.locator('[role="dialog"]').first()
      const isDialogVisible = await dialog.isVisible({ timeout: 1000 }).catch(() => false)
      if (isDialogVisible) {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
        console.log('✓ Campaign poster closed')
      } else {
        console.log('  No campaign poster found')
      }
    } catch (error) {
      console.log('  No campaign poster to close')
    }
    
    // Wait for package cards to load
    console.log('\n[STEP 3] Waiting for package cards to load...')
    await page.waitForSelector('[class*="MuiCard"]', { timeout: 15000 })
    console.log('✓ Package cards loaded')
    
    // Get total number of pages (should be 2)
    const totalPages = await page.evaluate(() => {
      const pagination = document.querySelector('[class*="MuiPagination"]')
      if (!pagination) return 1
      
      const buttons = Array.from(pagination.querySelectorAll('button'))
      let maxPage = 1
      for (const button of buttons) {
        const text = button.textContent?.trim() || ''
        const num = parseInt(text)
        if (!isNaN(num) && num > maxPage) {
          maxPage = num
        }
      }
      return maxPage
    })
    
    console.log(`\n[INFO] Total pages detected: ${totalPages}`)
    const pagesToProcess = testMode ? 1 : Math.min(totalPages, 2)
    console.log(`[INFO] Will process pages: 1 to ${pagesToProcess}`)
    
    let totalCaptured = 0
    
    // Process each page
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      console.log(`\n${'='.repeat(60)}`)
      console.log(`PAGE ${pageNum} of ${pagesToProcess}`)
      console.log('='.repeat(60))
      
      // Navigate to page if not page 1
      if (pageNum > 1) {
        console.log(`\n[PAGE ${pageNum}] Step 1: Navigating to page ${pageNum}...`)
        
        let currentPage = await page.evaluate(() => {
          const pagination = document.querySelector('[class*="MuiPagination"]')
          if (!pagination) return 1
          const activeButton = pagination.querySelector('button[aria-current="true"], button[class*="Mui-selected"]')
          if (activeButton) {
            const text = activeButton.textContent?.trim() || ''
            return parseInt(text) || 1
          }
          return 1
        })
        
        console.log(`  Current page: ${currentPage}, Target page: ${pageNum}`)
        
        // Navigate incrementally
        while (currentPage < pageNum) {
          console.log(`  Navigating from page ${currentPage} to page ${currentPage + 1}...`)
          
          await page.evaluate(() => {
            const pagination = document.querySelector('[class*="MuiPagination"]')
            if (pagination) {
              pagination.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          })
          await page.waitForTimeout(500)
          
          const targetPageForThisStep = currentPage + 1
          let clicked = await page.evaluate((targetPage: number) => {
            const pagination = document.querySelector('[class*="MuiPagination"]')
            if (!pagination) return false
            
            const buttons = Array.from(pagination.querySelectorAll('button'))
            for (const button of buttons) {
              const text = button.textContent?.trim() || ''
              const ariaLabel = button.getAttribute('aria-label') || ''
              const isDisabled = button.hasAttribute('disabled') || button.getAttribute('aria-disabled') === 'true'
              
              if (isDisabled || text === '‹' || text === '›' || text === '«' || text === '»' || text === 'First' || text === 'Last' || text === '') {
                continue
              }
              
              if (text === String(targetPage) || 
                  ariaLabel.includes(`page ${targetPage}`) ||
                  ariaLabel.includes(`Go to page ${targetPage}`)) {
                (button as HTMLElement).click()
                return true
              }
            }
            return false
          }, targetPageForThisStep)
          
          if (!clicked) {
            console.log(`  Page ${targetPageForThisStep} button not visible, using next button...`)
            const nextButton = page.locator('button[aria-label*="next" i], button[aria-label*="Go to next page" i]').first()
            const nextExists = await nextButton.isVisible({ timeout: 2000 }).catch(() => false)
            
            if (nextExists) {
              const isDisabled = await nextButton.getAttribute('disabled').then(v => v !== null).catch(() => false)
              if (!isDisabled) {
                await nextButton.click()
                clicked = true
                console.log(`  ✓ Clicked next button`)
              } else {
                console.log(`  ✗ Next button is disabled`)
                break
              }
            } else {
              console.log(`  ✗ Next button not found`)
              break
            }
          } else {
            console.log(`  ✓ Clicked page ${targetPageForThisStep} button`)
          }
          
          if (!clicked) {
            console.log(`  ✗ Could not navigate to page ${targetPageForThisStep}`)
            break
          }
          
          await page.waitForTimeout(2000)
          
          let verified = false
          let verifyAttempts = 0
          const maxVerifyAttempts = 10
          
          while (!verified && verifyAttempts < maxVerifyAttempts) {
            await page.waitForTimeout(1000)
            
            const newPage = await page.evaluate(() => {
              const pagination = document.querySelector('[class*="MuiPagination"]')
              if (!pagination) return null
              const activeButton = pagination.querySelector('button[aria-current="true"], button[class*="Mui-selected"]')
              if (activeButton) {
                const text = activeButton.textContent?.trim() || ''
                return parseInt(text) || null
              }
              return null
            })
            
            if (newPage === targetPageForThisStep) {
              verified = true
              currentPage = newPage
              console.log(`  ✓ Verified: Now on page ${currentPage}`)
            } else {
              verifyAttempts++
              console.log(`  Verify attempt ${verifyAttempts}: Current page ${newPage}, expected ${targetPageForThisStep}. Waiting...`)
            }
          }
          
          if (!verified) {
            console.log(`  ✗ Could not verify navigation to page ${targetPageForThisStep}`)
            break
          }
        }
        
        if (currentPage !== pageNum) {
          console.log(`  ✗ Failed to reach page ${pageNum}. Current page: ${currentPage}. Skipping...`)
          continue
        }
        
        console.log(`  ✓ Successfully navigated to page ${pageNum}`)
      }
      
      // Wait for content to load
      console.log(`\n[PAGE ${pageNum}] Step 2: Waiting for content to load...`)
      await page.waitForTimeout(2000)
      console.log('  ✓ Content loaded')
      
      // Get all "Know More" buttons on current page
      console.log(`\n[PAGE ${pageNum}] Step 3: Identifying package "Know More" buttons...`)
      const allButtons = await page.locator('button, [role="button"]').all()
      const knowMoreButtons: typeof allButtons = []
      
      for (const button of allButtons) {
        const text = await button.textContent().catch(() => '')
        if (text && text.toLowerCase().includes('know more')) {
          knowMoreButtons.push(button)
        }
      }
      
      console.log(`  ✓ Found ${knowMoreButtons.length} "Know More" buttons`)
      
      if (knowMoreButtons.length === 0) {
        console.log(`  ⚠ No "Know More" buttons found on page ${pageNum}, skipping...`)
        continue
      }
      
      // Process each package on this page
      for (let i = 0; i < knowMoreButtons.length; i++) {
        const buttonIndex = i + 1
        console.log(`\n[PAGE ${pageNum}] Package ${buttonIndex}/${knowMoreButtons.length}:`)
        
        try {
          // Step 4: Click the "Know More" button
          console.log(`  Step 4: Clicking "Know More" button...`)
          await knowMoreButtons[i].scrollIntoViewIfNeeded()
          await page.waitForTimeout(300)
          await knowMoreButtons[i].click()
          console.log(`  ✓ Button clicked`)
          
          // Step 5: Wait for modal to load
          console.log(`  Step 5: Waiting for modal to load...`)
          await page.waitForSelector('[role="dialog"]', { timeout: 10000 })
          
          // Wait for modal content to load
          await page.waitForFunction(
            () => {
              const dialog = document.querySelector('[role="dialog"]')
              if (!dialog) return false
              const hasSkeleton = dialog.querySelector('[class*="MuiSkeleton"]')
              const hasContent = dialog.textContent && dialog.textContent.length > 50
              return !hasSkeleton && hasContent
            },
            { timeout: 15000 }
          ).catch(() => {
            console.log(`  ⚠ Modal content loading timeout, proceeding anyway...`)
          })
          
          // Wait for images
          await page.evaluate(async () => {
            const dialog = document.querySelector('[role="dialog"]')
            if (!dialog) return
            const images = Array.from(dialog.querySelectorAll('img')) as HTMLImageElement[]
            await Promise.all(
              images.map((img) => {
                if (img.complete) return Promise.resolve()
                return new Promise((resolve) => {
                  img.addEventListener('load', resolve, { once: true })
                  img.addEventListener('error', resolve, { once: true })
                  setTimeout(resolve, 3000)
                })
              })
            )
          })
          
          await page.waitForTimeout(500)
          console.log(`  ✓ Modal loaded`)
          
          // Get package name for filename
          const packageName = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"]')
            if (!dialog) return 'Unknown'
            const nameElement = dialog.querySelector('h3, h2, h1, [class*="Typography"]') || dialog
            return nameElement.textContent?.split('\n')[0]?.trim() || 'Unknown'
          })
          
          console.log(`  Package name: ${packageName}`)
          
          // Step 6: Capture screenshot with full scrollable content
          console.log(`  Step 6: Capturing full modal screenshot...`)
          const sanitizedName = packageName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
          
          // Get the full scrollable height of the modal and scroll to top
          const modalInfo = await page.evaluate(() => {
            const dialog = document.querySelector('[role="dialog"]')
            if (!dialog) return null
            
            // Find the scrollable container (usually the Paper or Box inside Dialog)
            const scrollableContainer = dialog.querySelector('[class*="MuiPaper-root"], [class*="MuiDialog-paper"]') || dialog
            const scrollHeight = scrollableContainer.scrollHeight || dialog.scrollHeight
            const clientHeight = scrollableContainer.clientHeight || dialog.clientHeight
            const boundingBox = dialog.getBoundingClientRect()
            
            // Scroll to top to ensure we capture from the beginning
            scrollableContainer.scrollTop = 0
            
            return {
              scrollHeight,
              clientHeight,
              width: boundingBox.width,
              height: boundingBox.height,
              x: boundingBox.x,
              y: boundingBox.y,
            }
          })
          
          await page.waitForTimeout(300) // Wait for scroll to complete
          
          if (modalInfo && modalInfo.scrollHeight > modalInfo.clientHeight) {
            console.log(`  Modal is scrollable: ${modalInfo.width}x${modalInfo.scrollHeight}px (visible: ${modalInfo.clientHeight}px)`)
            
            // Capture the full modal including scrollable content using page.screenshot with clip
            await page.screenshot({
              path: path.join(desktopDir, `package___${sanitizedName}.png`),
              clip: {
                x: modalInfo.x,
                y: modalInfo.y,
                width: modalInfo.width,
                height: Math.min(modalInfo.scrollHeight, 10000), // Cap at 10000px for safety
              },
            })
            console.log(`  ✓ Desktop screenshot saved (full scrollable content): package___${sanitizedName}.png`)
          } else {
            // Fallback: regular screenshot of dialog (not scrollable or dimensions not available)
            const dialog = page.locator('[role="dialog"]').first()
            await dialog.screenshot({
              path: path.join(desktopDir, `package___${sanitizedName}.png`),
            })
            console.log(`  ✓ Desktop screenshot saved (non-scrollable): package___${sanitizedName}.png`)
          }
          
          totalCaptured++
          
          // Step 7: Close modal
          console.log(`  Step 7: Closing modal...`)
          try {
            const closeButton = page.locator('[role="dialog"] button[aria-label*="close" i]').first()
            const closeButtonVisible = await closeButton.isVisible({ timeout: 1000 }).catch(() => false)
            
            if (closeButtonVisible) {
              await closeButton.click()
            } else {
              await page.keyboard.press('Escape')
            }
            await page.waitForTimeout(1000)
            console.log(`  ✓ Modal closed`)
          } catch (error) {
            await page.keyboard.press('Escape')
            await page.waitForTimeout(500)
            console.log(`  ✓ Modal closed (via Escape)`)
          }
          
          console.log(`  ✓ Package ${buttonIndex} completed`)
          
          if (testMode && totalCaptured >= 1) {
            console.log(`TEST MODE: Captured 1 package. Stopping.`)
            break
          }
        } catch (error: any) {
          console.log(`  ✗ Error capturing package ${buttonIndex}: ${error?.message || String(error)}`)
          // Try to close modal if it's open
          try {
            await page.keyboard.press('Escape')
            await page.waitForTimeout(500)
          } catch (e) {
            // Ignore
          }
          // Continue to next package
        }
      }
      
      if (testMode && totalCaptured >= 1) break
      
      console.log(`\n[PAGE ${pageNum}] ✓ Completed: Captured ${knowMoreButtons.length} packages`)
      console.log(`[INFO] Total captured so far: ${totalCaptured}`)
    }
    
    await context.close()
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✓ ALL PACKAGE MODALS CAPTURED SUCCESSFULLY!`)
    console.log(`Total packages captured: ${totalCaptured}`)
    console.log(`Output directory: ${outputDir}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n✗ Error during package modal capture:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

async function captureBookingForm() {
  const outputDir = path.join(process.cwd(), 'handoff-pdfs')
  await ensureDirectoryExists(outputDir)
  
  const desktopDir = path.join(outputDir, 'desktop')
  await ensureDirectoryExists(desktopDir)
  
  const browser = await chromium.launch({ headless: true })
  
  try {
    const context = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    
    console.log('=== Starting Booking Form Capture ===')
    console.log(`Base URL: ${BASE_URL}`)
    
    // Navigate to book-a-health-checkup page
    console.log('\n[STEP 1] Navigating to book-a-health-checkup page...')
    await page.goto(`${BASE_URL}/book-a-health-checkup`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    console.log('✓ Page loaded')
    
    // Close campaign poster if present
    console.log('\n[STEP 2] Closing campaign poster if present...')
    try {
      const dialog = page.locator('[role="dialog"]').first()
      const isDialogVisible = await dialog.isVisible({ timeout: 1000 }).catch(() => false)
      if (isDialogVisible) {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
        console.log('✓ Campaign poster closed')
      } else {
        console.log('  No campaign poster found')
      }
    } catch (error) {
      console.log('  No campaign poster to close')
    }
    
    // Wait for package cards to load
    console.log('\n[STEP 3] Waiting for package cards to load...')
    await page.waitForSelector('[class*="MuiCard"]', { timeout: 15000 })
    console.log('✓ Package cards loaded')
    
    // Find the first "Book Now" button
    console.log('\n[STEP 4] Finding "Book Now" button...')
    const allButtons = await page.locator('button, [role="button"]').all()
    let bookNowButton = null
    
    for (const button of allButtons) {
      const text = await button.textContent().catch(() => '')
      if (text && text.toLowerCase().includes('book now')) {
        bookNowButton = button
        break
      }
    }
    
    if (!bookNowButton) {
      console.log('✗ Could not find "Book Now" button')
      await browser.close()
      return
    }
    
    console.log('✓ Found "Book Now" button')
    
    // Click the "Book Now" button
    console.log('\n[STEP 5] Clicking "Book Now" button...')
    await bookNowButton.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await bookNowButton.click()
    console.log('✓ Button clicked')
    
    // Wait for bottom sheet to open
    console.log('\n[STEP 6] Waiting for booking form bottom sheet to open...')
    await page.waitForTimeout(2000)
    
    // Look for the bottom sheet - it might be a drawer, modal, or custom component
    // Common selectors: [role="dialog"], [class*="MuiDrawer"], [class*="BottomSheet"]
    const bottomSheet = await page.locator('[role="dialog"], [class*="MuiDrawer"], [class*="BottomSheet"], [class*="MuiModal"]').first()
    const isBottomSheetVisible = await bottomSheet.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (!isBottomSheetVisible) {
      console.log('  ⚠ Bottom sheet not found with common selectors, trying alternative...')
      // Wait a bit more and try to find any visible form
      await page.waitForTimeout(2000)
      const form = await page.locator('form, [class*="Form"]').first()
      const isFormVisible = await form.isVisible({ timeout: 3000 }).catch(() => false)
      if (isFormVisible) {
        console.log('✓ Found form element')
      } else {
        console.log('✗ Could not find booking form')
        await browser.close()
        return
      }
    } else {
      console.log('✓ Bottom sheet opened')
    }
    
    // Wait for form content to load
    console.log('\n[STEP 7] Waiting for form content to load...')
    await page.waitForFunction(
      () => {
        // Check for form fields or skeleton to disappear
        const form = document.querySelector('form')
        if (!form) return false
        const hasSkeleton = form.querySelector('[class*="MuiSkeleton"]')
        const hasInputs = form.querySelectorAll('input, select, textarea').length > 0
        return !hasSkeleton && hasInputs
      },
      { timeout: 10000 }
    ).catch(() => {
      console.log('  ⚠ Form loading timeout, proceeding anyway...')
    })
    
    await page.waitForTimeout(1000)
    console.log('✓ Form content loaded')
    
    // Get the full scrollable height of the bottom sheet/form
    console.log('\n[STEP 8] Capturing booking form screenshot...')
    const formDimensions = await page.evaluate(() => {
      // Try to find the bottom sheet/drawer container
      const bottomSheet = document.querySelector('[role="dialog"], [class*="MuiDrawer"], [class*="BottomSheet"], [class*="MuiModal"]') as HTMLElement
      const form = document.querySelector('form') as HTMLElement
      
      const targetElement = bottomSheet || form || document.body
      const scrollHeight = targetElement.scrollHeight || document.documentElement.scrollHeight
      const boundingBox = targetElement.getBoundingClientRect()
      
      // Scroll to top
      targetElement.scrollTop = 0
      
      return {
        scrollHeight,
        width: boundingBox.width,
        height: boundingBox.height,
        x: boundingBox.x,
        y: boundingBox.y,
      }
    })
    
    await page.waitForTimeout(300)
    
    // Capture the form
    if (formDimensions && formDimensions.scrollHeight > 0) {
      console.log(`  Form dimensions: ${formDimensions.width}x${formDimensions.scrollHeight}px`)
      
      await page.screenshot({
        path: path.join(desktopDir, 'health_checkup_booking_form.png'),
        clip: {
          x: formDimensions.x,
          y: formDimensions.y,
          width: formDimensions.width,
          height: Math.min(formDimensions.scrollHeight, 10000), // Cap at 10000px
        },
      })
      console.log('✓ Booking form screenshot saved: health_checkup_booking_form.png')
    } else {
      // Fallback: capture the entire viewport
      await page.screenshot({
        path: path.join(desktopDir, 'health_checkup_booking_form.png'),
        fullPage: true,
      })
      console.log('✓ Booking form screenshot saved (full page): health_checkup_booking_form.png')
    }
    
    await context.close()
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✓ BOOKING FORM CAPTURED SUCCESSFULLY!`)
    console.log(`Output directory: ${outputDir}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n✗ Error during booking form capture:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

async function captureResearchForm() {
  const outputDir = path.join(process.cwd(), 'handoff-pdfs')
  await ensureDirectoryExists(outputDir)
  
  const desktopDir = path.join(outputDir, 'desktop')
  await ensureDirectoryExists(desktopDir)
  
  const browser = await chromium.launch({ headless: true })
  
  try {
    const context = await browser.newContext({
      viewport: VIEWPORTS.desktop,
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    
    console.log('=== Starting Research Application Form Capture ===')
    console.log(`Base URL: ${BASE_URL}`)
    
    // Navigate to medical-studies-research page
    console.log('\n[STEP 1] Navigating to medical-studies-research page...')
    await page.goto(`${BASE_URL}/medical-studies-research`, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)
    console.log('✓ Page loaded')
    
    // Close campaign poster if present
    console.log('\n[STEP 2] Closing campaign poster if present...')
    try {
      const dialog = page.locator('[role="dialog"]').first()
      const isDialogVisible = await dialog.isVisible({ timeout: 1000 }).catch(() => false)
      if (isDialogVisible) {
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
        console.log('✓ Campaign poster closed')
      } else {
        console.log('  No campaign poster found')
      }
    } catch (error) {
      console.log('  No campaign poster to close')
    }
    
    // Wait for program cards to load
    console.log('\n[STEP 3] Waiting for research program cards to load...')
    await page.waitForSelector('[class*="MuiCard"]', { timeout: 15000 })
    console.log('✓ Program cards loaded')
    
    // Find the first "Apply Now" button
    console.log('\n[STEP 4] Finding "Apply Now" button...')
    const allButtons = await page.locator('button, [role="button"]').all()
    let applyNowButton = null
    
    for (const button of allButtons) {
      const text = await button.textContent().catch(() => '')
      if (text && text.toLowerCase().includes('apply now')) {
        // Check if button is not disabled
        const isDisabled = await button.getAttribute('disabled').then(v => v !== null).catch(() => false)
        if (!isDisabled) {
          applyNowButton = button
          break
        }
      }
    }
    
    if (!applyNowButton) {
      console.log('✗ Could not find enabled "Apply Now" button')
      await browser.close()
      return
    }
    
    console.log('✓ Found "Apply Now" button')
    
    // Click the "Apply Now" button
    console.log('\n[STEP 5] Clicking "Apply Now" button...')
    await applyNowButton.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
    await applyNowButton.click()
    console.log('✓ Button clicked')
    
    // Wait for bottom sheet to open
    console.log('\n[STEP 6] Waiting for research application form bottom sheet to open...')
    await page.waitForTimeout(2000)
    
    // Look for the bottom sheet - it might be a drawer, modal, or custom component
    const bottomSheet = await page.locator('[role="dialog"], [class*="MuiDrawer"], [class*="BottomSheet"], [class*="MuiModal"]').first()
    const isBottomSheetVisible = await bottomSheet.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (!isBottomSheetVisible) {
      console.log('  ⚠ Bottom sheet not found with common selectors, trying alternative...')
      // Wait a bit more and try to find any visible form
      await page.waitForTimeout(2000)
      const form = await page.locator('form, [class*="Form"]').first()
      const isFormVisible = await form.isVisible({ timeout: 3000 }).catch(() => false)
      if (isFormVisible) {
        console.log('✓ Found form element')
      } else {
        console.log('✗ Could not find research application form')
        await browser.close()
        return
      }
    } else {
      console.log('✓ Bottom sheet opened')
    }
    
    // Wait for form content to load
    console.log('\n[STEP 7] Waiting for form content to load...')
    await page.waitForFunction(
      () => {
        // Check for form fields or skeleton to disappear
        const form = document.querySelector('form')
        if (!form) return false
        const hasSkeleton = form.querySelector('[class*="MuiSkeleton"]')
        const hasInputs = form.querySelectorAll('input, select, textarea').length > 0
        return !hasSkeleton && hasInputs
      },
      { timeout: 10000 }
    ).catch(() => {
      console.log('  ⚠ Form loading timeout, proceeding anyway...')
    })
    
    await page.waitForTimeout(1000)
    console.log('✓ Form content loaded')
    
    // Get the full scrollable height of the bottom sheet/form
    console.log('\n[STEP 8] Capturing research application form screenshot...')
    const formDimensions = await page.evaluate(() => {
      // Try to find the bottom sheet/drawer container
      const bottomSheet = document.querySelector('[role="dialog"], [class*="MuiDrawer"], [class*="BottomSheet"], [class*="MuiModal"]') as HTMLElement
      const form = document.querySelector('form') as HTMLElement
      
      const targetElement = bottomSheet || form || document.body
      const scrollHeight = targetElement.scrollHeight || document.documentElement.scrollHeight
      const boundingBox = targetElement.getBoundingClientRect()
      
      // Scroll to top
      targetElement.scrollTop = 0
      
      return {
        scrollHeight,
        width: boundingBox.width,
        height: boundingBox.height,
        x: boundingBox.x,
        y: boundingBox.y,
      }
    })
    
    await page.waitForTimeout(300)
    
    // Capture the form
    if (formDimensions && formDimensions.scrollHeight > 0) {
      console.log(`  Form dimensions: ${formDimensions.width}x${formDimensions.scrollHeight}px`)
      
      await page.screenshot({
        path: path.join(desktopDir, 'research_application_form.png'),
        clip: {
          x: formDimensions.x,
          y: formDimensions.y,
          width: formDimensions.width,
          height: Math.min(formDimensions.scrollHeight, 10000), // Cap at 10000px
        },
      })
      console.log('✓ Research application form screenshot saved: research_application_form.png')
    } else {
      // Fallback: capture the entire viewport
      await page.screenshot({
        path: path.join(desktopDir, 'research_application_form.png'),
        fullPage: true,
      })
      console.log('✓ Research application form screenshot saved (full page): research_application_form.png')
    }
    
    await context.close()
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✓ RESEARCH APPLICATION FORM CAPTURED SUCCESSFULLY!`)
    console.log(`Output directory: ${outputDir}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n✗ Error during research application form capture:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log('Starting handoff screenshot generation...')
  console.log(`Base URL: ${BASE_URL}`)
  
  // Check if we should capture research form
  const shouldCaptureResearchForm = process.env.CAPTURE_RESEARCH_FORM === 'true'
  // Check if we should capture booking form
  const shouldCaptureBookingForm = process.env.CAPTURE_BOOKING_FORM === 'true'
  // Check if we should capture doctor modals
  const captureDoctors = process.env.CAPTURE_DOCTORS === 'true'
  // Check if we should capture package modals
  const capturePackages = process.env.CAPTURE_PACKAGES === 'true'
  const testMode = process.env.TEST_MODE === 'true'
  
  if (shouldCaptureResearchForm) {
    console.log('⚠ Capturing research application form')
    await captureResearchForm()
    return
  }
  
  if (shouldCaptureBookingForm) {
    console.log('⚠ Capturing health checkup booking form')
    await captureBookingForm()
    return
  }
  
  if (capturePackages) {
    if (testMode) {
      console.log('⚠ TEST MODE: Capturing only the first package modal')
    } else {
      console.log('⚠ Capturing all package modals')
    }
    await captureAllPackageModals(testMode)
    return
  }
  
  if (captureDoctors) {
    if (testMode) {
      console.log('⚠ TEST MODE: Capturing only the first doctor modal')
    } else {
      console.log('⚠ Capturing all doctor modals')
    }
    await captureAllDoctorModals(testMode)
    return
  }
  
  // Use CUSTOM_PAGES if CUSTOM_ONLY env var is set, otherwise use all PAGES
  const useCustom = process.env.CUSTOM_ONLY === 'true'
  let pagesToCapture = useCustom ? CUSTOM_PAGES : PAGES
  
  // Filter for facilities and specialities only if FACILITIES_SPECIALITIES_ONLY is set
  const facilitiesSpecialitiesOnly = process.env.FACILITIES_SPECIALITIES_ONLY === 'true'
  if (facilitiesSpecialitiesOnly) {
    pagesToCapture = pagesToCapture.filter(page => 
      page.path.startsWith('/facilities') || page.path.startsWith('/specialities')
    )
    console.log(`⚠ Filtering to facilities and specialities only: ${pagesToCapture.length} pages`)
  }
  
  // Check if desktop only
  const desktopOnly = process.env.DESKTOP_ONLY === 'true' || facilitiesSpecialitiesOnly
  
  if (useCustom) {
    console.log(`⚠ Capturing only ${CUSTOM_PAGES.length} custom pages:`)
    CUSTOM_PAGES.forEach(p => console.log(`  - ${p.path}`))
  } else {
    console.log(`Capturing ${pagesToCapture.length} pages`)
  }
  
  if (desktopOnly) {
    console.log(`⚠ Desktop screenshots only`)
  }
  
  const outputDir = path.join(process.cwd(), 'handoff-pdfs')
  await ensureDirectoryExists(outputDir)
  
  // Create subdirectories for each viewport
  const desktopDir = path.join(outputDir, 'desktop')
  const tabletDir = path.join(outputDir, 'tablet')
  const mobileDir = path.join(outputDir, 'mobile')
  
  await ensureDirectoryExists(desktopDir)
  if (!desktopOnly) {
    await ensureDirectoryExists(tabletDir)
    await ensureDirectoryExists(mobileDir)
  }
  
  const browser = await chromium.launch({ headless: true })
  
  try {
    for (const page of pagesToCapture) {
      const sanitizedName = page.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      
      // Desktop
      await capturePage(
        browser,
        `${BASE_URL}${page.path}`,
        VIEWPORTS.desktop,
        path.join(desktopDir, `${sanitizedName}.png`),
        `${page.name} (Desktop)`
      )
      
      // Tablet and Mobile (skip if desktop only)
      if (!desktopOnly) {
        // Tablet
        await capturePage(
          browser,
          `${BASE_URL}${page.path}`,
          VIEWPORTS.tablet,
          path.join(tabletDir, `${sanitizedName}.png`),
          `${page.name} (Tablet)`
        )
        
        // Mobile
        await capturePage(
          browser,
          `${BASE_URL}${page.path}`,
          VIEWPORTS.mobile,
          path.join(mobileDir, `${sanitizedName}.png`),
          `${page.name} (Mobile)`
        )
      }
    }
    
    console.log('\n✓ All pages captured successfully!')
    console.log(`Output directory: ${outputDir}`)
  } catch (error) {
    console.error('Error during generation:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

main()

