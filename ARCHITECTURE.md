# Jaystarbliss Studios - Digital Ecosystem Architecture

## Phase 1: Audit Findings
- **Current State:** A collection of ~20 static HTML pages with vanilla JavaScript routing (`spa-navigation.js`). The styling is vanilla CSS.
- **Critical Asset:** The protected "Orb/Logo" hero section relies on a `canvas` and complex vanilla JS in `MAGIC-PARTICLES.html` and `index.html`. This must be carefully preserved and optimized.
- **Limitation:** The static HTML architecture is fundamentally incapable of supporting a scalable, data-driven Content Management System (CMS) or the requested Role-Based Admin Dashboard without heavy, unmaintainable manual DOM manipulation.
- **Routing:** Current Netlify configuration (`netlify.toml`, `_redirects`) successfully maps legacy routes to the static files.

## Phase 2: Proposed Architecture

### 1. Technology Stack
To achieve the requested **Scalability, Maintainability, and CMS capabilities**, the application must transition to a modern component-based framework:
- **Frontend Framework:** React (via Vite) + TypeScript. This allows for building the complex Admin Dashboard and reusable CMS components (Hero, Grids, Portfolios).
- **Styling:** Tailwind CSS (as per agent directives) to ensure rapid, consistent, and maintainable styling while adhering to the brand's exact color palette (`#1E293B`, `#B91C1C`, `#F8FAFC`).
- **Backend & Database:** Firebase (Firestore + Auth). Firestore will act as the NoSQL database for the CMS.
- **Hosting:** The existing Netlify configuration will be updated to serve the React SPA build (`dist`).

### 2. Information Architecture & Routing (React Router)
**Public Routes:**
- `/` (Home)
- `/learn` (Educational Programs)
- `/learn/:slug` (Program Details)
- `/services` (Tech & Creative Services)
- `/services/:slug` (Service Details)
- `/portfolio` (Projects & Case Studies)
- `/portfolio/:slug` (Project Details)
- `/about` (Company Story)
- `/resources` (Blog & Tutorials)
- `/contact` (Project Intake & General Inquiry)

**Admin Routes (Protected):**
- `/admin` (Dashboard Overview)
- `/admin/pages` (CMS Page Builder)
- `/admin/programs` (Manage Education)
- `/admin/services` (Manage Services)
- `/admin/portfolio` (Manage Projects)
- `/admin/blog` (Manage Posts)
- `/admin/inquiries` (Manage Leads)
- `/admin/settings` (Global Settings)

### 3. Content Model (CMS schema via Firestore)
Data models have been defined in `firebase-blueprint.json` and include:
- **Users**: (Super Admin, Content Admin, Education Admin, etc.)
- **Pages & Sections**: Data-driven page rendering. Pages contain ordered arrays of Sections.
- **Programs**: Educational courses with curriculum, pricing, and instructors.
- **Services**: Web Dev, Design, etc.
- **Portfolio**: Case studies and student projects.
- **Blog**: Articles and tutorials.
- **Inquiries**: Form submissions (Contact, Project Requests).

### 4. Component System (Data-Driven Sections)
The CMS will not be a free-form "drag-and-drop" builder. It will use predefined, validated React components mapped to Section types:
- `<HeroSection />` (Including the protected Orb canvas)
- `<FeatureGrid />`
- `<CourseGrid />`
- `<ServiceGrid />`
- `<PortfolioGrid />`
- `<TestimonialSlider />`
- `<CallToAction />`

### 5. Migration Strategy (Phases 3-14)
1. **Bootstrap React:** Initialize Vite + React + TS in the workspace.
2. **Port Critical Assets:** Port the existing "Orb/Logo" hero canvas logic into an isolated, optimized React component (`<ProtectedHero />`).
3. **Build the Design System:** Setup Tailwind with the specific typography and spacing rules outlined in the Master Prompt.
4. **Develop the Admin Panel:** Build the data-entry views for Programs, Services, and Pages interacting directly with Firestore.
5. **Develop the Public UI:** Map the Firestore collections to the public React routes.
