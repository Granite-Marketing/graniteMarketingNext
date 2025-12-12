# Granite Marketing - Next.js Website

A modern marketing website built with Next.js 16, Tailwind CSS, GSAP animations, and Sanity CMS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Animations**: GSAP + Lenis smooth scroll
- **CMS**: Sanity
- **Language**: TypeScript
- **Fonts**: Chakra Petch, Inter, Share Tech Mono

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment example file:

```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── about-us/          # About page
│   ├── blog/              # Blog listing and posts
│   ├── case-studies/      # Case studies
│   ├── contact-us/        # Contact page
│   ├── privacy/           # Privacy policy
│   └── cookies/           # Cookie policy
├── components/
│   ├── layout/            # Header, Footer
│   ├── sections/          # Page sections (Hero, Stats, etc.)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── animations/        # GSAP configuration and hooks
│   └── sanity/            # Sanity client and schemas
├── public/
│   ├── fonts/             # Custom web fonts
│   └── images/            # Static images
├── scripts/               # Migration and utility scripts
└── styles/                # Global styles
```

## Sanity CMS Setup

1. Create a new Sanity project at [sanity.io](https://www.sanity.io/)

2. Install the Sanity CLI:

```bash
npm install -g @sanity/cli
```

3. Initialize Sanity in a separate folder:

```bash
sanity init
```

4. Copy the schemas from `lib/sanity/schemas/` to your Sanity studio

5. Add your Sanity project credentials to `.env.local`

## Content Migration

To migrate content from Webflow CSV exports:

1. Export your Webflow collections as CSV
2. Place them in a `data/` folder
3. Run the migration script:

```bash
npx ts-node scripts/migrate-content.ts
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

### Pages
- Homepage with hero, stats, timeline, testimonials, FAQ, and contact form
- About Us page
- Blog with CMS integration
- Case Studies with CMS integration
- Contact page
- Privacy Policy
- Cookie Policy
- 404 page

### Animations
- Smooth scrolling with Lenis
- Scroll-triggered animations with GSAP
- Hero text reveal animations
- Stats countup animation
- Timeline section animations
- Testimonial slider

### Components
- Responsive header with mobile navigation
- Footer with sitemap links
- Button component with variants
- Card components (standard, gradient, testimonial)
- FAQ accordion
- Contact form with validation
- Rich text renderer for Sanity content

## Customization

### Design Tokens

The design system uses CSS custom properties defined in `app/globals.css`:

- Colors: Brand colors, neutrals, semantic colors
- Typography: Font families, sizes, weights
- Spacing: Consistent spacing scale
- Container widths: Small, medium, large

### Tailwind Theme

The Tailwind configuration extends the default theme with custom colors, fonts, and utilities in `app/globals.css` using the `@theme` directive.

## Deployment

The site is ready to deploy to Vercel:

1. Push to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

## License

Private - Granite Marketing

