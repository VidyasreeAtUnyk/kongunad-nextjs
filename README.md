# Kongunad Hospital - Next.js Website

A modern, performant hospital website built with Next.js 14, Material-UI, and Contentful CMS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Material-UI
- **Content Management**: Contentful CMS integration for easy content updates
- **Performance Optimized**: Image optimization, ISR, Edge Functions
- **Responsive Design**: Mobile-first approach with MUI components
- **Testing**: Comprehensive testing with Jest, React Testing Library, and Playwright
- **SEO Optimized**: Metadata API, structured data, sitemap generation
- **Accessibility**: WCAG 2.1 AA compliant with MUI components

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Emotion (CSS-in-JS)
- **CMS**: Contentful
- **Testing**: Jest, React Testing Library, Playwright
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Contentful account and space

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to the project directory
cd kongunad-nextjs

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Kongunad Hospital

# Google reCAPTCHA (for forms)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here

# Development
NODE_ENV=development
```

### 3. Contentful Setup

1. Create a Contentful account and space
2. Create the following content types:
   - **Doctor**: doctorName, department, speciality, experience, degrees, photo, bio, availability
   - **Facility**: name, description, category, icon, images, services
   - **HealthPackage**: title, description, price, discount, testList, category, icon, notes
   - **BuildingImage**: title, order, image
   - **Navigation**: primaryMenu, secondaryMenu, mobileMenu

3. Add your Contentful credentials to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## 🏗️ Project Structure

```
kongunad-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # MUI components
│   │   ├── layout/           # Layout components
│   │   └── content/          # Content-specific components
│   ├── lib/                  # Utilities and configurations
│   │   ├── contentful.ts     # Contentful client
│   │   ├── mui-theme.ts     # MUI theme
│   │   └── utils.ts         # Helper functions
│   ├── types/                # TypeScript type definitions
│   └── styles/              # Global styles and themes
├── tests/                    # Test files
│   ├── components/          # Component tests
│   └── e2e/                 # E2E tests
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🎨 Customization

### Theme Customization

Edit `src/lib/mui-theme.ts` to customize colors, typography, and component styles:

```typescript
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Hospital blue
    },
    secondary: {
      main: '#dc004e', // Medical red
    },
  },
  // ... other theme options
})
```

### Content Types

Modify `src/types/contentful.ts` to match your Contentful content model.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 📊 Performance

The project includes several performance optimizations:

- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic route-based code splitting
- **ISR**: Incremental Static Regeneration for dynamic content
- **Edge Functions**: Global edge computing with Vercel
- **Bundle Analysis**: Regular optimization reviews

## 🔍 SEO Features

- **Metadata API**: Dynamic meta tags for each page
- **Structured Data**: JSON-LD for healthcare information
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine directives

## ♿ Accessibility

- **WCAG 2.1 AA**: Compliant with accessibility standards
- **MUI Components**: Built-in accessibility features
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@kongunadhospital.com or create an issue in the repository.

## 🔄 Migration from Gatsby

This project is a complete rewrite of the original Gatsby-based Kongunad Hospital website with the following improvements:

- **Better Performance**: Next.js optimizations and modern React patterns
- **Improved Developer Experience**: TypeScript, better tooling, comprehensive testing
- **Enhanced Content Management**: Full Contentful integration with structured content types
- **Modern UI**: Material-UI components with consistent design system
- **Better SEO**: Enhanced metadata and structured data
- **Scalability**: Modern architecture ready for future growth

## 📈 Roadmap

- [ ] Multi-language support
- [ ] Patient portal integration
- [ ] Online appointment booking
- [ ] Telemedicine features
- [ ] Mobile app development
- [ ] Advanced analytics integration