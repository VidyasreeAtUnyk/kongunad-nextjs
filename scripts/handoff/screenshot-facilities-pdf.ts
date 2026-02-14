#!/usr/bin/env npx tsx
/**
 * Script to screenshot facility pages and combine into a single PDF
 *
 * Usage:
 *   npx tsx scripts/handoff/screenshot-facilities-pdf.ts
 *   BASE_URL=http://localhost:3000 npx tsx scripts/handoff/screenshot-facilities-pdf.ts
 */

import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = process.env.BASE_URL || 'https://kongunad-nextjs.vercel.app'

const PAGES = [
  // { url: `${BASE_URL}/facilities/endoscopy-services`, name: 'Endoscopy Services' },
  // { url: `${BASE_URL}/facilities/inpatient-services`, name: 'Inpatient Services' },
   // Facilities - Main
   { url: `${BASE_URL}/facilities`, name: 'Facilities - Main' },
  
   // Facilities - Categories
   { url: `${BASE_URL}/facilities/out-patient-services`, name: 'Facilities - Out Patient Services' },
   { url: `${BASE_URL}/facilities/inpatient-services`, name: 'Facilities - Inpatient Services' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments`, name: 'Facilities - Supportive Medical Departments' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities`, name: 'Facilities - Other Diagnostic Facilities' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services`, name: 'Facilities - Radiology Imaging Services' },
   { url: `${BASE_URL}/facilities/laboratory-services`, name: 'Facilities - Laboratory Services' },
   { url: `${BASE_URL}/facilities/endoscopy-services`, name: 'Facilities - Endoscopy Services' },
   { url: `${BASE_URL}/facilities/non-medical-supportive-departments`, name: 'Facilities - Non Medical Supportive Departments' },
   
   // Facilities - Detail Pages (Out Patient Services)
   { url: `${BASE_URL}/facilities/out-patient-services/main-opd`, name: 'Facility - Main OPD' },
   { url: `${BASE_URL}/facilities/out-patient-services/emergency-opd-casualty`, name: 'Facility - Emergency OPD (Casualty)' },
   { url: `${BASE_URL}/facilities/out-patient-services/cardiac-opd`, name: 'Facility - Cardiac OPD' },
   { url: `${BASE_URL}/facilities/out-patient-services/surgeons-opd-surgical`, name: 'Facility - Surgeons OPD (Surgical)' },
   { url: `${BASE_URL}/facilities/out-patient-services/physicians-opd-medical`, name: 'Facility - Physicians OPD (Medical)' },
   { url: `${BASE_URL}/facilities/out-patient-services/pediatric-opd`, name: 'Facility - Pediatric OPD' },
   { url: `${BASE_URL}/facilities/out-patient-services/orthopaedic-opd`, name: 'Facility - Orthopaedic OPD' },
   { url: `${BASE_URL}/facilities/out-patient-services/obstetrics-gynaecology-opd`, name: 'Facility - Obstetrics Gynaecology OPD' },
   { url: `${BASE_URL}/facilities/out-patient-services/speciality-opd`, name: 'Facility - Speciality OPD' },
   
   // Facilities - Detail Pages (Inpatient Services)
   { url: `${BASE_URL}/facilities/inpatient-services/intensive-care-services`, name: 'Facility - Intensive Care Services' },
   { url: `${BASE_URL}/facilities/inpatient-services/room-services`, name: 'Facility - Room Services' },
   { url: `${BASE_URL}/facilities/inpatient-services/emergency-services`, name: 'Facility - Emergency Services' },
   { url: `${BASE_URL}/facilities/inpatient-services/operation-theatre-services`, name: 'Facility - Operation Theatre Services' },
   { url: `${BASE_URL}/facilities/inpatient-services/dialysis-services`, name: 'Facility - Dialysis Services' },
   
   // Facilities - Detail Pages (Supportive Medical Departments)
   { url: `${BASE_URL}/facilities/supportive-medical-departments/pharmacy`, name: 'Facility - Pharmacy' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments/dietary-department`, name: 'Facility - Dietary Department' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments/mrd`, name: 'Facility - MRD' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments/medical-insurances-department`, name: 'Facility - Medical Insurances Department' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments/blood-bank`, name: 'Facility - Blood Bank' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments/biomedical-engineer`, name: 'Facility - Biomedical Engineer' },
   { url: `${BASE_URL}/facilities/supportive-medical-departments/ambulance`, name: 'Facility - Ambulance' },
   
   // Facilities - Detail Pages (Other Diagnostic Facilities)
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/uroflow-studies`, name: 'Facility - Uroflow Studies' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/tmt`, name: 'Facility - TMT' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/holder-monitor`, name: 'Facility - Holder Monitor' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/ppg`, name: 'Facility - PPG' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/ecg`, name: 'Facility - ECG' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/eeg`, name: 'Facility - EEG' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/emg`, name: 'Facility - EMG' },
   { url: `${BASE_URL}/facilities/other-diagnostic-facilities/spirometry`, name: 'Facility - Spirometry' },
   
   // Facilities - Detail Pages (Radiology & Imaging Services)
   { url: `${BASE_URL}/facilities/radiology-imaging-services/digital-x-rays`, name: 'Facility - Digital X-Rays' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/mobile-x-ray-unit`, name: 'Facility - Mobile X-Ray Unit' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/c-arm`, name: 'Facility - C-Arm' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/ultrasound-scan`, name: 'Facility - Ultrasound Scan' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/echo-transesophageal-echo`, name: 'Facility - ECHO Transesophageal ECHO' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/cath-lab`, name: 'Facility - Cath Lab' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/ct`, name: 'Facility - CT' },
   { url: `${BASE_URL}/facilities/radiology-imaging-services/mri`, name: 'Facility - MRI' },
   
   // Facilities - Detail Pages (Laboratory Services)
   { url: `${BASE_URL}/facilities/laboratory-services/haematology`, name: 'Facility - Haematology' },
   { url: `${BASE_URL}/facilities/laboratory-services/biochemistry`, name: 'Facility - Biochemistry' },
   { url: `${BASE_URL}/facilities/laboratory-services/microbiology`, name: 'Facility - Microbiology' },
   { url: `${BASE_URL}/facilities/laboratory-services/histopathology`, name: 'Facility - Histopathology' },
   
   // Facilities - Detail Pages (Endoscopy Services)
   { url: `${BASE_URL}/facilities/endoscopy-services/upper-gi-scopy`, name: 'Facility - Upper GI Scopy' },
   { url: `${BASE_URL}/facilities/endoscopy-services/colonoscopy`, name: 'Facility - Colonoscopy' },
   { url: `${BASE_URL}/facilities/endoscopy-services/bronchoscopy`, name: 'Facility - Bronchoscopy' },
   { url: `${BASE_URL}/facilities/endoscopy-services/ercp`, name: 'Facility - ERCP' },
   
   // Facilities - Detail Pages (Non Medical Supportive Departments)
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

const OUTPUT_DIR = path.join(process.cwd(), 'handoff-pdfs')
const OUTPUT_PDF = path.join(OUTPUT_DIR, 'facilities-preview.pdf')

async function main() {
  console.log('Screenshot + PDF generation')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Pages: ${PAGES.map((p) => p.url).join(', ')}`)
  console.log('')

  // Ensure output dir exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1080 },
    deviceScaleFactor: 1,
  })

  const screenshots: Buffer[] = []

  try {
    for (const pageConfig of PAGES) {
      console.log(`Capturing: ${pageConfig.name} (${pageConfig.url})`)

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

      // Hide any error toasts / overlays that might appear
      await page.evaluate(() => {
        // Hide Next.js error overlay
        const nextError = document.querySelector('nextjs-portal') as HTMLElement
        if (nextError) nextError.style.display = 'none'
        // Hide any toast notifications
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
        // Scroll to very bottom to catch the last images
        window.scrollTo(0, scrollHeight)
        await new Promise((r) => setTimeout(r, 500))
      })

      // Wait for all images to fully load (with longer timeout)
      await page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[]
        await Promise.all(
          images.map((img) => {
            if (img.complete && img.naturalHeight > 0) return Promise.resolve()
            return new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true })
              img.addEventListener('error', resolve, { once: true })
              setTimeout(resolve, 10000) // 10s per image max
            })
          })
        )
      })

      // Wait for skeletons to disappear
      await page.waitForTimeout(1000)

      // Scroll to top for consistent capture
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(500)

      // Take full-page screenshot (preserves desktop viewport width)
      const screenshot = await page.screenshot({ fullPage: true, type: 'png' })
      screenshots.push(Buffer.from(screenshot))
      await page.close()

      console.log(`  ✓ Captured ${pageConfig.name}`)
    }

    // Build PDF from screenshots - each screenshot becomes a page
    console.log('\nBuilding PDF from screenshots...')
    const pdfDoc = await PDFDocument.create()

    // A4 dimensions in points (1 point = 1/72 inch)
    const A4_WIDTH = 595.28
    const MARGIN = 20

    for (const screenshotBuffer of screenshots) {
      const pngImage = await pdfDoc.embedPng(screenshotBuffer)
      const imgWidth = pngImage.width
      const imgHeight = pngImage.height

      // Scale image to fit A4 width (minus margins)
      const usableWidth = A4_WIDTH - MARGIN * 2
      const scale = usableWidth / imgWidth
      const scaledHeight = imgHeight * scale

      // Split into multiple A4 pages if the screenshot is tall
      const A4_HEIGHT = 841.89
      const usableHeight = A4_HEIGHT - MARGIN * 2
      let yOffset = 0

      while (yOffset < scaledHeight) {
        const sliceHeight = Math.min(usableHeight, scaledHeight - yOffset)
        const pageH = sliceHeight + MARGIN * 2
        const page = pdfDoc.addPage([A4_WIDTH, pageH])

        // PDF y=0 is at the bottom of the page.
        // We draw the full image and shift it so the correct slice is visible.
        // The visible area on this page is from yOffset to yOffset+sliceHeight (top-down).
        // In PDF coords the top of the page is at pageH, so the image top should be at:
        //   MARGIN + sliceHeight (top margin position) which maps to yOffset in image coords.
        // Image y position = MARGIN + sliceHeight - scaledHeight + yOffset
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
    fs.writeFileSync(OUTPUT_PDF, pdfBytes)

    console.log(`✓ PDF saved: ${OUTPUT_PDF}`)
  } finally {
    await context.close()
    await browser.close()
  }
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
