# 🚀 Kongunad Hospital - Next.js Setup Guide

## 📋 **Complete Setup Instructions**

### 1. **Navigate to the Project**
```bash
cd /Users/udayaprakash/Desktop/Desktop/Unyk/Workspace/kongunad-nextjs
```

### 2. **Install Dependencies** (if not already done)
```bash
npm install
```

### 3. **Create Environment File**
Create a `.env.local` file in the root directory:

```bash
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Kongunad Hospital

# Development
NODE_ENV=development
```

### 4. **Start Development Server**
```bash
npm run dev
```

The website will be available at: `http://localhost:3000`

---

## 🎯 **What You'll See**

The website includes:
- ✅ **Modern Hero Section** with search functionality
- ✅ **About Section** with hospital information
- ✅ **Doctors Section** (placeholder cards)
- ✅ **Facilities Section** (placeholder cards)
- ✅ **Health Packages Section** (placeholder cards)
- ✅ **Quick Actions** for booking appointments
- ✅ **Responsive Design** that works on all devices
- ✅ **Material-UI Components** with hospital theme

---

## 🔧 **Current Status**

### ✅ **What's Working:**
- Next.js 14 with App Router
- Material-UI theme and components
- TypeScript configuration
- Responsive design
- Component structure
- Testing framework setup

### ⚠️ **What Needs Setup:**
- Contentful CMS integration (currently using demo data)
- Real content migration from your current Gatsby site
- Environment variables configuration

---

## 📊 **Next Steps to Complete Migration**

### **Phase 1: Contentful Setup**
1. **Create Contentful Account**
   - Go to [contentful.com](https://contentful.com)
   - Create a new space
   - Get your Space ID and Access Token

2. **Create Content Types**
   ```
   Doctor:
   - doctorName (Short text)
   - department (Short text)
   - speciality (Short text)
   - experience (Number)
   - degrees (Short text, list)
   - photo (Media)
   - bio (Long text)
   - availability (Short text)

   Facility:
   - name (Short text)
   - description (Long text)
   - category (Short text)
   - icon (Media)
   - images (Media, list)
   - services (Short text, list)

   HealthPackage:
   - title (Short text)
   - description (Long text)
   - price (Number)
   - discount (Number)
   - testList (Short text, list)
   - category (Short text)
   - icon (Media)
   - notes (Short text, list)

   BuildingImage:
   - title (Short text)
   - order (Number)
   - image (Media)

   Navigation:
   - primaryMenu (JSON)
   - secondaryMenu (JSON)
   - mobileMenu (JSON)
   ```

### **Phase 2: Content Migration**
1. **Migrate Doctor Data**
   - Copy data from `kongunad-new/src/content/doctors.js`
   - Create entries in Contentful Doctor content type

2. **Migrate Health Packages**
   - Copy data from `kongunad-new/src/content/health-checkup-packages.js`
   - Create entries in Contentful HealthPackage content type

3. **Migrate Navigation**
   - Copy data from `kongunad-new/src/content/nav.js`
   - Create entry in Contentful Navigation content type

### **Phase 3: Testing & Deployment**
1. **Run Tests**
   ```bash
   npm test
   npm run test:e2e
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository to Vercel
   - Add environment variables
   - Deploy automatically

---

## 🛠️ **Available Commands**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:e2e     # Run E2E tests

# Code Quality
npm run lint         # Run ESLint
```

---

## 📁 **Project Structure**

```
kongunad-nextjs/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── content/       # Content components
│   │   ├── layout/        # Layout components
│   │   └── ui/           # UI components
│   ├── lib/              # Utilities
│   │   ├── contentful.ts # Contentful client
│   │   └── mui-theme.ts  # MUI theme
│   └── types/            # TypeScript types
├── tests/                # Test files
├── public/              # Static assets
└── docs/               # Documentation
```

---

## 🎨 **Customization**

### **Theme Colors**
Edit `src/lib/mui-theme.ts`:
```typescript
palette: {
  primary: {
    main: '#1976d2', // Hospital blue
  },
  secondary: {
    main: '#dc004e', // Medical red
  },
}
```

### **Adding New Pages**
Create new files in `src/app/`:
```
src/app/
├── doctors/
│   └── page.tsx
├── facilities/
│   └── page.tsx
└── health-packages/
    └── page.tsx
```

---

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Environment Variables Not Loading**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Contentful Connection Issues**
   - Check Space ID and Access Token
   - Ensure content types are created correctly

3. **Build Errors**
   - Run `npm run lint` to check for issues
   - Ensure all TypeScript types are correct

---

## 📞 **Support**

If you encounter any issues:
1. Check the console for error messages
2. Review the README.md file
3. Check the implementation guide
4. Ensure all dependencies are installed

---

## 🎉 **Success Indicators**

You'll know the setup is complete when:
- ✅ Development server runs without errors
- ✅ Website loads at `http://localhost:3000`
- ✅ All sections display correctly
- ✅ Contentful data loads (when configured)
- ✅ Tests pass successfully
- ✅ Build completes without errors

---

**Happy coding! 🚀**




