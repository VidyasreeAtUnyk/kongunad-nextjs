import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Offer } from '@/components/content/Offer'
import { ModalContainer } from '@/components/modals/ModalContainer'
import { getOffers } from '@/lib/contentful'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kongunad Hospital - 35 Years of Healthcare Excellence',
  description: 'Kongunad Hospital is a modern tertiary care center offering comprehensive medical and surgical services in Coimbatore. NABH accredited with 35+ years of service.',
  keywords: 'hospital, healthcare, medical, surgical, Coimbatore, NABH, Kongunad',
  authors: [{ name: 'Kongunad Hospital' }],
  openGraph: {
    title: 'Kongunad Hospital - Healthcare Excellence',
    description: '35 years of confidence to Coimbatore in Healthcare',
    type: 'website',
    locale: 'en_IN',
  },
  robots: {
    index: true,
    follow: true,
  },
}

async function getOfferLists() {
  try {
    const items = await getOffers()
    // Normalize to Offer component shape
    const lists = (items || [])
      .filter((i: any) => i?.fields?.active !== false)
      .map((i: any) => ({
        title: i.fields.title as string,
        flash: i.fields.flash as string | undefined,
      }))
    return lists.length > 0 ? lists : [
      { title: 'Save Up to 30% on Comprehensive Health Packages!' },
      { title: 'Health Check-Up Packages: ', flash: 'Now at 20% Discount!' },
    ]
  } catch (e) {
    return [
      { title: 'Save Up to 30% on Comprehensive Health Packages!' },
      { title: 'Health Check-Up Packages: ', flash: 'Now at 20% Discount!' },
    ]
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const offers = await getOfferLists()
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider>
            <Navigation />
            <Offer lists={offers} />
            {children}
            <Footer />
            <ModalContainer />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}