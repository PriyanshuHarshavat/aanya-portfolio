# Aanya Harshavat Portfolio - Project Decisions & Specifications

## Student Information

### Profile
- **Name:** Aanya Harshavat
- **Grade:** Sophomore (High School)
- **Tagline:** Author | Scholar | Changemaker

### Key Highlights
- Published Author (has written a book)
- Academic Excellence
- Leadership roles
- Community involvement

---

## Design Decisions

### Brand Colors (Modern & Professional)
- **Primary:** #6366f1 (Indigo)
- **Accent:** #f472b6 (Pink)
- **Mint:** #34d399 (Emerald)
- **Slate:** #0f172a (Dark text)
- **Background Light:** #fafafa
- **Background Dark:** #030712

### Typography
- **Display Font:** Plus Jakarta Sans (headings)
- **Body Font:** Inter (text)

### Design Style
- Modern, professional, sophisticated
- Mobile-first responsive
- Dark mode support
- Bento-style grid layouts
- Glassmorphism effects
- Subtle animations (floating blobs, staggered entrances, hover effects)

---

## Content Structure

### Sections
1. **Hero** - Name, photo, tagline, "Published Author" badge, CTAs
2. **About** - Bio, highlights (GPA, leadership, etc.)
3. **Achievements** - Bento grid with accomplishments
4. **Book** - Book showcase with cover, description, purchase links
5. **Activities** - Clubs, organizations, volunteer work
6. **Skills** - Skill bars for key strengths
7. **Testimonials** - Quotes from teachers/mentors
8. **Contact** - Email CTA, social links
9. **Footer** - Quick links, copyright

### Placeholders to Replace
- `/uploads/headshot.jpg` - Main photo
- `/uploads/about-photo.jpg` - About section photo
- `/uploads/book-cover.jpg` - Book cover image
- `/uploads/project-1.jpg` - Project image
- `/uploads/project-2.jpg` - Project image

---

## Technical Decisions

### Stack
- **Framework:** Next.js 16 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** shadcn/ui
- **Icons:** Lucide React

### Project Structure
```
/app
  /components    # All React components
  /admin         # Admin panel for uploads
  /api/upload    # API route for file uploads
  globals.css    # Global styles, animations
  page.tsx       # Main page composition
  layout.tsx     # Root layout with metadata
/lib
  content.ts     # Centralized content (CMS-ready structure)
/public
  /uploads       # Images uploaded via admin
/components
  /ui            # shadcn/ui components
```

### Development
- **Port:** 3005 (configured in package.json)
- **Location:** Linux filesystem (`~/projects/aanya-portfolio`)
- **Dev server:** `npm run dev` (runs on localhost:3005)

### Content Management
- Currently: Hardcoded in `lib/content.ts`
- Future: Ready for Sanity CMS integration
- TypeScript interfaces defined for all content types

---

## Components Created

| Component | Purpose |
|-----------|---------|
| Header.tsx | Navigation with dark mode toggle |
| Hero.tsx | Main hero with photo, badge, CTAs |
| About.tsx | Bio section with highlights grid |
| Achievements.tsx | Bento grid of accomplishments |
| Book.tsx | Book showcase section |
| Activities.tsx | Extracurriculars/clubs |
| Skills.tsx | Skill progress bars |
| Testimonials.tsx | Quote carousel |
| Contact.tsx | Contact CTA section |
| Footer.tsx | Footer with links |

---

## Admin Panel

- **URL:** `/admin`
- **Purpose:** Upload images without code changes
- **Features:**
  - Drag & drop upload zones
  - Preview before upload
  - Status indicators
  - Saves to `/public/uploads/`

### Upload Slots
1. Headshot → `headshot.jpg`
2. About Photo → `about-photo.jpg`
3. Book Cover → `book-cover.jpg`
4. Project 1 → `project-1.jpg`
5. Project 2 → `project-2.jpg`

---

## Animations & Effects

### CSS Animations
- `animate-float` - 6s floating effect
- `animate-float-slow` - 8s floating effect
- `animate-pulse-glow` - Pulsing shadow effect
- `animate-shimmer` - Shimmer overlay
- `animate-gradient` - Moving gradient background
- `animate-spin-slow` - Slow rotation (for decorations)

### Component Effects
- **Hero:** Floating background blobs, pulsing glow on photo
- **Bento cards:** Staggered spring entrance, hover scale
- **Activities:** Numbered cards, hover arrows
- **Skills:** Animated progress bars
- **Contact:** Floating social icons

---

## Files Changed/Created

### Components
- `app/components/Header.tsx`
- `app/components/Hero.tsx`
- `app/components/About.tsx`
- `app/components/Achievements.tsx`
- `app/components/Book.tsx`
- `app/components/Activities.tsx`
- `app/components/Skills.tsx`
- `app/components/Testimonials.tsx`
- `app/components/Contact.tsx`
- `app/components/Footer.tsx`

### Admin
- `app/admin/page.tsx`
- `app/api/upload/route.ts`

### Content
- `lib/content.ts`

### Styles
- `app/globals.css`

### Config
- `app/layout.tsx` (metadata, fonts)
- `package.json` (port 3005)

---

## Next Steps

1. **Upload images** via `/admin`
2. **Update content** in `lib/content.ts`:
   - Book title and description
   - Activities and roles
   - Achievements details
   - Testimonials from teachers
3. **Remove admin link** after uploads complete (optional)
4. **Add analytics** (Google Analytics, Vercel Analytics)
5. **Deploy** to Vercel

---

## Deployment

Recommended: Vercel (free tier works great)
- Connect GitHub repo
- Auto-deploys on push
- Custom domain support
