#!/usr/bin/env npx tsx
/**
 * Script to screenshot facility and specialty pages and combine into PDFs
 *
 * Usage:
 *   npx tsx scripts/handoff/screenshot-facilities-pdf.ts              # Generate both
 *   npx tsx scripts/handoff/screenshot-facilities-pdf.ts facilities   # Facilities only
 *   npx tsx scripts/handoff/screenshot-facilities-pdf.ts specialities # Specialities only
 */

import { chromium, BrowserContext } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.BASE_URL || 'https://kongunad-nextjs.vercel.app'
const OUTPUT_DIR = path.join(process.cwd(), 'handoff-pdfs')

interface PageConfig {
  url: string
  name: string
}

// ─── Facility Pages ─────────────────────────────────────────────────────────

function getFacilityPages(): PageConfig[] {
  return [
    // Main
    { url: `${BASE_URL}/facilities`, name: 'Facilities - Main' },

    // Categories
    { url: `${BASE_URL}/facilities/out-patient-services`, name: 'Facilities - Out Patient Services' },
    { url: `${BASE_URL}/facilities/inpatient-services`, name: 'Facilities - Inpatient Services' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments`, name: 'Facilities - Supportive Medical Departments' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities`, name: 'Facilities - Other Diagnostic Facilities' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services`, name: 'Facilities - Radiology Imaging Services' },
    { url: `${BASE_URL}/facilities/laboratory-services`, name: 'Facilities - Laboratory Services' },
    { url: `${BASE_URL}/facilities/endoscopy-services`, name: 'Facilities - Endoscopy Services' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments`, name: 'Facilities - Non Medical Supportive Departments' },

    // Out Patient Services
    { url: `${BASE_URL}/facilities/out-patient-services/main-opd`, name: 'Facility - Main OPD' },
    { url: `${BASE_URL}/facilities/out-patient-services/emergency-opd-casualty`, name: 'Facility - Emergency OPD (Casualty)' },
    { url: `${BASE_URL}/facilities/out-patient-services/cardiac-opd`, name: 'Facility - Cardiac OPD' },
    { url: `${BASE_URL}/facilities/out-patient-services/surgeons-opd-surgical`, name: 'Facility - Surgeons OPD (Surgical)' },
    { url: `${BASE_URL}/facilities/out-patient-services/physicians-opd-medical`, name: 'Facility - Physicians OPD (Medical)' },
    { url: `${BASE_URL}/facilities/out-patient-services/pediatric-opd`, name: 'Facility - Pediatric OPD' },
    { url: `${BASE_URL}/facilities/out-patient-services/orthopaedic-opd`, name: 'Facility - Orthopaedic OPD' },
    { url: `${BASE_URL}/facilities/out-patient-services/obstetrics-gynaecology-opd`, name: 'Facility - Obstetrics Gynaecology OPD' },
    { url: `${BASE_URL}/facilities/out-patient-services/speciality-opd`, name: 'Facility - Speciality OPD' },

    // Inpatient Services
    { url: `${BASE_URL}/facilities/inpatient-services/intensive-care-services`, name: 'Facility - Intensive Care Services' },
    { url: `${BASE_URL}/facilities/inpatient-services/room-services`, name: 'Facility - Room Services' },
    { url: `${BASE_URL}/facilities/inpatient-services/emergency-services`, name: 'Facility - Emergency Services' },
    { url: `${BASE_URL}/facilities/inpatient-services/operation-theatre-services`, name: 'Facility - Operation Theatre Services' },
    { url: `${BASE_URL}/facilities/inpatient-services/dialysis-services`, name: 'Facility - Dialysis Services' },

    // Supportive Medical Departments
    { url: `${BASE_URL}/facilities/supportive-medical-departments/pharmacy`, name: 'Facility - Pharmacy' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments/dietary-department`, name: 'Facility - Dietary Department' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments/mrd`, name: 'Facility - MRD' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments/medical-insurances-department`, name: 'Facility - Medical Insurances Department' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments/blood-bank`, name: 'Facility - Blood Bank' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments/biomedical-engineer`, name: 'Facility - Biomedical Engineer' },
    { url: `${BASE_URL}/facilities/supportive-medical-departments/ambulance`, name: 'Facility - Ambulance' },

    // Other Diagnostic Facilities
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/uroflow-studies`, name: 'Facility - Uroflow Studies' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/tmt`, name: 'Facility - TMT' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/holder-monitor`, name: 'Facility - Holder Monitor' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/ppg`, name: 'Facility - PPG' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/ecg`, name: 'Facility - ECG' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/eeg`, name: 'Facility - EEG' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/emg`, name: 'Facility - EMG' },
    { url: `${BASE_URL}/facilities/other-diagnostic-facilities/spirometry`, name: 'Facility - Spirometry' },

    // Radiology & Imaging Services
    { url: `${BASE_URL}/facilities/radiology-imaging-services/digital-x-rays`, name: 'Facility - Digital X-Rays' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/mobile-x-ray-unit`, name: 'Facility - Mobile X-Ray Unit' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/c-arm`, name: 'Facility - C-Arm' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/ultrasound-scan`, name: 'Facility - Ultrasound Scan' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/echo-transesophageal-echo`, name: 'Facility - ECHO Transesophageal ECHO' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/cath-lab`, name: 'Facility - Cath Lab' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/ct`, name: 'Facility - CT' },
    { url: `${BASE_URL}/facilities/radiology-imaging-services/mri`, name: 'Facility - MRI' },

    // Laboratory Services
    { url: `${BASE_URL}/facilities/laboratory-services/haematology`, name: 'Facility - Haematology' },
    { url: `${BASE_URL}/facilities/laboratory-services/biochemistry`, name: 'Facility - Biochemistry' },
    { url: `${BASE_URL}/facilities/laboratory-services/microbiology`, name: 'Facility - Microbiology' },
    { url: `${BASE_URL}/facilities/laboratory-services/histopathology`, name: 'Facility - Histopathology' },

    // Endoscopy Services
    { url: `${BASE_URL}/facilities/endoscopy-services/upper-gi-scopy`, name: 'Facility - Upper GI Scopy' },
    { url: `${BASE_URL}/facilities/endoscopy-services/colonoscopy`, name: 'Facility - Colonoscopy' },
    { url: `${BASE_URL}/facilities/endoscopy-services/bronchoscopy`, name: 'Facility - Bronchoscopy' },
    { url: `${BASE_URL}/facilities/endoscopy-services/ercp`, name: 'Facility - ERCP' },

    // Non Medical Supportive Departments
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/administrative-director`, name: 'Facility - Administrative Director' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/ceo-chief-excecutive-officer`, name: 'Facility - CEO Chief Executive Officer' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/pro-public-relation-officer`, name: 'Facility - PRO Public Relation Officer' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/hrd-human-resources-department`, name: 'Facility - HRD Human Resources Department' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/reception-front-office`, name: 'Facility - Reception Front Office' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/admission-department`, name: 'Facility - Admission Department' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/office`, name: 'Facility - Office' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/biomedical-waste-management`, name: 'Facility - Biomedical Waste Management' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/maintenance-department`, name: 'Facility - Maintenance Department' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/security`, name: 'Facility - Security' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/house-keeping`, name: 'Facility - House Keeping' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/canteen`, name: 'Facility - Canteen' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/coffee-bar-fruit-stall`, name: 'Facility - Coffee Bar Fruit Stall' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/fire-safety-department`, name: 'Facility - Fire Safety Department' },
    { url: `${BASE_URL}/facilities/non-medical-supportive-departments/lift-service`, name: 'Facility - Lift Service' },
  ]
}

// ─── Speciality Pages ───────────────────────────────────────────────────────

function getSpecialityPages(): PageConfig[] {
  return [
    // Main
    { url: `${BASE_URL}/specialities`, name: 'Specialities - Main' },

    // Categories
    { url: `${BASE_URL}/specialities/medical-specialties`, name: 'Specialities - Medical Specialties' },
    { url: `${BASE_URL}/specialities/surgical-specialties`, name: 'Specialities - Surgical Specialties' },

    // Medical Specialties
    { url: `${BASE_URL}/specialities/medical-specialties/emergency-medicine`, name: 'Specialty - Emergency Medicine' },
    { url: `${BASE_URL}/specialities/medical-specialties/critical-care-medicine`, name: 'Specialty - Critical Care Medicine' },
    { url: `${BASE_URL}/specialities/medical-specialties/general-medicine`, name: 'Specialty - General Medicine' },
    { url: `${BASE_URL}/specialities/medical-specialties/oncology`, name: 'Specialty - Medical Oncology' },
    { url: `${BASE_URL}/specialities/medical-specialties/pediatrics`, name: 'Specialty - Pediatrics' },
    { url: `${BASE_URL}/specialities/medical-specialties/cardiology`, name: 'Specialty - Cardiology' },
    { url: `${BASE_URL}/specialities/medical-specialties/medical-gastro-enterology`, name: 'Specialty - Medical Gastro Enterology' },
    { url: `${BASE_URL}/specialities/medical-specialties/nephrology`, name: 'Specialty - Nephrology' },
    { url: `${BASE_URL}/specialities/medical-specialties/radiology`, name: 'Specialty - Radiology' },
    { url: `${BASE_URL}/specialities/medical-specialties/dermatology`, name: 'Specialty - Dermatology' },
    { url: `${BASE_URL}/specialities/medical-specialties/rheumatology`, name: 'Specialty - Rheumatology' },
    { url: `${BASE_URL}/specialities/medical-specialties/neurology`, name: 'Specialty - Neurology' },
    { url: `${BASE_URL}/specialities/medical-specialties/psychology`, name: 'Specialty - Psychology' },
    { url: `${BASE_URL}/specialities/medical-specialties/haematology`, name: 'Specialty - Haematology' },
    { url: `${BASE_URL}/specialities/medical-specialties/pathology`, name: 'Specialty - Pathology' },
    { url: `${BASE_URL}/specialities/medical-specialties/diabetology`, name: 'Specialty - Diabetology' },

    // Surgical Specialties
    { url: `${BASE_URL}/specialities/surgical-specialties/general-laparoscopy-surgery`, name: 'Specialty - General & Laparoscopy Surgery' },
    { url: `${BASE_URL}/specialities/surgical-specialties/orthopedic-surgeries`, name: 'Specialty - Orthopedic Surgeries' },
    { url: `${BASE_URL}/specialities/surgical-specialties/cardio-thoracic-surgery`, name: 'Specialty - Cardio Thoracic Surgery' },
    { url: `${BASE_URL}/specialities/surgical-specialties/interventional-cardiology`, name: 'Specialty - Interventional Cardiology' },
    { url: `${BASE_URL}/specialities/surgical-specialties/neuro-surgery`, name: 'Specialty - Neuro Surgery' },
    { url: `${BASE_URL}/specialities/surgical-specialties/cancer-surgeries`, name: 'Specialty - Cancer Surgeries' },
    { url: `${BASE_URL}/specialities/surgical-specialties/surgical-gastro-enterology`, name: 'Specialty - Surgical Gastro Enterology' },
    { url: `${BASE_URL}/specialities/surgical-specialties/obstetrics-gynaecology-surgeries`, name: 'Specialty - Obstetrics & Gynaecology Surgeries' },
    { url: `${BASE_URL}/specialities/surgical-specialties/ent-surgery`, name: 'Specialty - ENT Surgery' },
    { url: `${BASE_URL}/specialities/surgical-specialties/eye-surgery`, name: 'Specialty - Eye Surgery' },
    { url: `${BASE_URL}/specialities/surgical-specialties/plastic-surgeries`, name: 'Specialty - Plastic Surgeries' },
    { url: `${BASE_URL}/specialities/surgical-specialties/pediatric-surgeries`, name: 'Specialty - Pediatric Surgeries' },
    { url: `${BASE_URL}/specialities/surgical-specialties/genito-urinary-surgery`, name: 'Specialty - Genito Urinary Surgery' },
    { url: `${BASE_URL}/specialities/surgical-specialties/vascular-surgeries`, name: 'Specialty - Vascular Surgeries' },
    { url: `${BASE_URL}/specialities/surgical-specialties/anesthesiology`, name: 'Specialty - Anesthesiology' },
    { url: `${BASE_URL}/specialities/surgical-specialties/dental-facio-maxillary-surgery`, name: 'Specialty - Dental & Facio Maxillary Surgery' },
  ]
}

// ─── Screenshot & PDF Generation ────────────────────────────────────────────

async function captureScreenshots(context: BrowserContext, pages: PageConfig[]): Promise<Buffer[]> {
  const screenshots: Buffer[] = []

  for (const pageConfig of pages) {
    console.log(`  Capturing: ${pageConfig.name}`)

    const page = await context.newPage()

    await page.goto(pageConfig.url, {
      waitUntil: 'networkidle',
      timeout: 60000,
    })

    // Wait for initial content to render
    await page.waitForTimeout(2000)

    // Close campaign poster if open
    try {
      const closeBtn = page.locator('button[aria-label="Close campaign poster"]')
      if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeBtn.click()
        await page.waitForTimeout(500)
      }
    } catch {
      // ignore
    }

    // Hide any error toasts / overlays
    await page.evaluate(() => {
      const nextError = document.querySelector('nextjs-portal') as HTMLElement
      if (nextError) nextError.style.display = 'none'
      document.querySelectorAll('[role="alert"], [class*="toast"], [class*="Toastify"], [class*="snackbar"], [class*="Snackbar"]').forEach((el) => {
        ;(el as HTMLElement).style.display = 'none'
      })
    })

    // Scroll through the entire page to trigger lazy-loaded images
    await page.evaluate(async () => {
      const scrollHeight = document.body.scrollHeight
      const viewportHeight = window.innerHeight
      for (let y = 0; y < scrollHeight; y += viewportHeight / 2) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 300))
      }
      window.scrollTo(0, scrollHeight)
      await new Promise((r) => setTimeout(r, 500))
    })

    // Wait for all images to fully load
    await page.evaluate(async () => {
      const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalHeight > 0) return Promise.resolve()
          return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true })
            setTimeout(resolve, 10000)
          })
        })
      )
    })

    // Wait for skeletons to disappear and content to fully render
    await page.waitForTimeout(5000)

    // Scroll to top for consistent capture
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)

    const screenshot = await page.screenshot({ fullPage: true, type: 'png' })
    screenshots.push(Buffer.from(screenshot))
    await page.close()

    console.log(`    ✓ Done`)
  }

  return screenshots
}

async function buildPdf(screenshots: Buffer[], outputPath: string): Promise<void> {
  const pdfDoc = await PDFDocument.create()

  const A4_WIDTH = 595.28
  const A4_HEIGHT = 841.89
  const MARGIN = 20

  for (const screenshotBuffer of screenshots) {
    const pngImage = await pdfDoc.embedPng(screenshotBuffer)
    const imgWidth = pngImage.width
    const imgHeight = pngImage.height

    const usableWidth = A4_WIDTH - MARGIN * 2
    const scale = usableWidth / imgWidth
    const scaledHeight = imgHeight * scale
    const usableHeight = A4_HEIGHT - MARGIN * 2
    let yOffset = 0

    while (yOffset < scaledHeight) {
      const sliceHeight = Math.min(usableHeight, scaledHeight - yOffset)
      const pageH = sliceHeight + MARGIN * 2
      const page = pdfDoc.addPage([A4_WIDTH, pageH])

      const imageY = MARGIN + sliceHeight - scaledHeight + yOffset

      page.drawImage(pngImage, {
        x: MARGIN,
        y: imageY,
        width: usableWidth,
        height: scaledHeight,
      })

      yOffset += usableHeight
    }
  }

  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(outputPath, pdfBytes)
  console.log(`  ✓ PDF saved: ${outputPath}`)
}

async function generatePdf(label: string, pages: PageConfig[], outputFile: string, context: BrowserContext): Promise<void> {
  console.log(`\n━━━ ${label} (${pages.length} pages) ━━━`)
  const screenshots = await captureScreenshots(context, pages)

  console.log(`\n  Building PDF...`)
  await buildPdf(screenshots, outputFile)
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const arg = process.argv[2]?.toLowerCase()
  const runFacilities = !arg || arg === 'facilities'
  const runSpecialities = !arg || arg === 'specialities'

  console.log('Screenshot + PDF generation')
  console.log(`Base URL: ${BASE_URL}`)
  if (arg) console.log(`Mode: ${arg}`)

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1080 },
    deviceScaleFactor: 1,
  })

  try {
    if (runFacilities) {
      await generatePdf(
        'Facilities',
        getFacilityPages(),
        path.join(OUTPUT_DIR, 'facilities-preview.pdf'),
        context
      )
    }

    if (runSpecialities) {
      await generatePdf(
        'Specialities',
        getSpecialityPages(),
        path.join(OUTPUT_DIR, 'specialities-preview.pdf'),
        context
      )
    }

    console.log('\n✓ All done!')
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
