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
  { path: '/facilities/out-patient-services/emergency-opd', name: 'Facility - Emergency OPD' },
  { path: '/facilities/out-patient-services/cardiac-opd', name: 'Facility - Cardiac OPD' },
  { path: '/facilities/out-patient-services/surgeons-opd', name: 'Facility - Surgeons OPD' },
  { path: '/facilities/out-patient-services/physicians-opd', name: 'Facility - Physicians OPD' },
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
  { path: '/facilities/laboratory-services/histopathology', name: 'Facility - Histopathology' },
  
  // Facilities - Detail Pages (Endoscopy Services)
  { path: '/facilities/endoscopy-services/upper-gi-scopy', name: 'Facility - Upper GI Scopy' },
  { path: '/facilities/endoscopy-services/colonoscopy', name: 'Facility - Colonoscopy' },
  { path: '/facilities/endoscopy-services/bronchoscopy', name: 'Facility - Bronchoscopy' },
  { path: '/facilities/endoscopy-services/ercp', name: 'Facility - ERCP' },
  
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
  { path: '/specialities/surgical-specialties/anaesthiology', name: 'Speciality - Anaesthiology' },
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
  { path: '/specialities/surgical-specialties/obstetrics-gynacology-surgeries', name: 'Speciality - Obstetrics Gynacology Surgeries' },
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
  // Note: Add specific research program detail pages if needed (e.g., /medical-studies-research/[slug])
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
    
    // Wait a bit for any animations or lazy loading
    await page.waitForTimeout(2000)
    
    // Scroll to bottom to trigger lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(1000)
    
    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo(0, 0)
    })
    await page.waitForTimeout(500)
    
    // Generate PDF
    const pdfPath = outputPath.replace('.png', '.pdf')
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    })
    
    console.log(`✓ PDF saved: ${pdfPath}`)
    
    // Also save screenshot
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

async function main() {
  console.log('Starting handoff PDF generation...')
  console.log(`Base URL: ${BASE_URL}`)
  
  const outputDir = path.join(process.cwd(), 'handoff-pdfs')
  await ensureDirectoryExists(outputDir)
  
  // Create subdirectories for each viewport
  const desktopDir = path.join(outputDir, 'desktop')
  const tabletDir = path.join(outputDir, 'tablet')
  const mobileDir = path.join(outputDir, 'mobile')
  
  await ensureDirectoryExists(desktopDir)
  await ensureDirectoryExists(tabletDir)
  await ensureDirectoryExists(mobileDir)
  
  const browser = await chromium.launch({ headless: true })
  
  try {
    for (const page of PAGES) {
      const sanitizedName = page.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      
      // Desktop
      await capturePage(
        browser,
        `${BASE_URL}${page.path}`,
        VIEWPORTS.desktop,
        path.join(desktopDir, `${sanitizedName}.png`),
        `${page.name} (Desktop)`
      )
      
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

