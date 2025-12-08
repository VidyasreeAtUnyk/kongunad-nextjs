/**
 * Script to fetch logo from Contentful and generate favicon files
 */

import { createClient } from 'contentful'
import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import sharp from 'sharp'

// Load environment variables
config({ path: path.join(process.cwd(), '.env.local') })
config({ path: path.join(process.cwd(), '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ASSET_ID = '2M2rzbrcuVQX2p2NI3nZYu'

async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        return downloadFile(response.headers.location!, filepath).then(resolve).catch(reject)
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}) // Delete the file on error
      reject(err)
    })
  })
}

async function main() {
  try {
    console.log('Fetching logo from Contentful...')
    
    const client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.CONTENTFUL_SPACE_ID || '',
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN || '',
    })

    if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID && !process.env.CONTENTFUL_SPACE_ID) {
      throw new Error('CONTENTFUL_SPACE_ID is not set in environment variables')
    }

    if (!process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN && !process.env.CONTENTFUL_ACCESS_TOKEN) {
      throw new Error('CONTENTFUL_ACCESS_TOKEN is not set in environment variables')
    }

    // Get the asset
    const asset = await client.getAsset(ASSET_ID)
    
    if (!asset.fields?.file?.url) {
      throw new Error('Asset does not have a file URL')
    }

    const fileUrl = `https:${asset.fields.file.url}`
    const contentType = asset.fields.file.contentType || 'image/png'
    const fileName = asset.fields.file.fileName || 'logo.png'
    
    console.log(`Asset found: ${fileName} (${contentType})`)
    console.log(`URL: ${fileUrl}`)

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '..', 'public')
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true })
    }

    // Download the original logo (save as SVG first)
    const logoSvgPath = path.join(publicDir, 'logo-original.svg')
    console.log(`Downloading logo to ${logoSvgPath}...`)
    await downloadFile(fileUrl, logoSvgPath)
    console.log('✓ Logo downloaded')

    // Convert SVG to PNG with different sizes using sharp
    const icon32Path = path.join(publicDir, 'icon.png')
    const icon16Path = path.join(publicDir, 'icon-16.png')
    const appleIconPath = path.join(publicDir, 'apple-icon.png')
    const faviconPath = path.join(publicDir, 'favicon.png')
    
    console.log('Converting to PNG formats...')
    
    // Create 32x32 icon
    await sharp(logoSvgPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(icon32Path)
    console.log('✓ Created icon.png (32x32)')
    
    // Create 16x16 icon (for favicon)
    await sharp(logoSvgPath)
      .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(icon16Path)
    console.log('✓ Created icon-16.png (16x16)')
    
    // Create 180x180 Apple touch icon
    await sharp(logoSvgPath)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(appleIconPath)
    console.log('✓ Created apple-icon.png (180x180)')
    
    // Create a larger PNG for favicon.ico generation (192x192)
    await sharp(logoSvgPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toFile(faviconPath)
    console.log('✓ Created favicon.png (192x192)')

    // Copy favicon.png to src/app/favicon.ico location (Next.js will handle it)
    // Note: For a proper .ico file, you'd need a converter, but Next.js can use PNG
    const appFaviconPath = path.join(__dirname, '..', 'src', 'app', 'favicon.ico')
    // We'll keep the existing favicon.ico or create a new one
    // For now, Next.js will use the icon.png from public
    
    console.log('\n✓ Favicon setup complete!')
    console.log('\nFiles created:')
    console.log(`- ${logoSvgPath} (original)`)
    console.log(`- ${icon32Path} (32x32)`)
    console.log(`- ${icon16Path} (16x16)`)
    console.log(`- ${appleIconPath} (180x180)`)
    console.log(`- ${faviconPath} (192x192)`)
    console.log('\nNote: The favicon.ico in src/app/ will be used by Next.js.')
    console.log('If you want a proper .ico file, you can convert favicon.png using an online tool.')
    
  } catch (error) {
    console.error('Error setting up favicon:', error)
    process.exit(1)
  }
}

main()

