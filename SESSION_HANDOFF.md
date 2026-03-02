# Aanya Portfolio - Session Handoff

## Project Overview
Portfolio website for **Aanya Harshavat**, a high school sophomore and published author of "Annie and Froggy Make a Friend" - a children's book about dealing with anxiety when starting school in a new place.

**Live Site:** https://aanyaharshavat.com (Vercel)
**Repo:** https://github.com/PriyanshuHarshavat/aanya-portfolio

## Tech Stack
- Next.js 16.1.6 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Vercel (hosting - Hobby plan)

## How to Run Locally
```bash
cd /home/pharshavat/projects/aanya-portfolio
npm run dev
```
Then open http://localhost:3000

## Key Files

### Content (Edit content here)
- `lib/content.ts` - All site content (achievements, book info, courses, etc.)

### Components
- `app/components/Achievements.tsx` - 6-card grid with clickable modals
- `app/components/AcademicJourneyModal.tsx` - Course timeline (AP/Honors/Core)
- `app/components/ResearchExperienceModal.tsx` - Northwestern research
- `app/components/CommunityServiceModal.tsx` - Volunteer history
- `app/components/ActivitiesModal.tsx` - Sports/Arts & Clubs/Leadership
- `app/components/Book.tsx` - Book section with flipbook reader
- `app/components/Hero.tsx` - Landing section
- `app/components/About.tsx` - About section
- `app/components/Contact.tsx` - Contact section

### Styles
- `app/globals.css` - Global styles, bento grid, utilities

## Current Structure

### Achievements (6 cards, 3x2 grid)
1. **Published Author** - Links to #book section
2. **Academic Excellence** - Modal with course timeline (Freshman/Sophomore)
3. **Research Experience** - Modal with Northwestern Psychology research
4. **Leadership & Community** - Modal with volunteer orgs (tutoring, food pantry, FMSC)
5. **Sports & Arts** - Modal with Basketball (AAU) + Indian Classical Dance
6. **Clubs & Leadership** - Modal with Student Council, FBLA (3rd district), clubs

### Dev vs Production
- `ViewportToggle` component only shows in development
- `/admin` page shows 404 in production
- Upload APIs only work locally (Vercel has read-only filesystem)

## Recent Changes (This Session)
- Added interactive achievement modals
- Restructured to 6-card symmetric grid
- Fixed modal background scroll lock
- Updated email to aanyaharshavat@gmail.com
- Removed LinkedIn
- Fixed image haziness (using plain `<img>` tags)
- Added "View My Book" link on Published Author card

## Content Details

### Academic Journey (in content.ts)
- GPA: 4.0
- Freshman (2024-2025): Honors English/Geometry/Biology, AP Human Geography, Spanish II, Art
- Sophomore (2025-2026): Honors English/Algebra II/Chemistry, AP World History, AP CS Principles, Spanish III

### Research (Northwestern)
- Department: Psychology
- Project: AI-Assisted Analysis of Adolescent Anxiety Patterns
- Duration: Summer 2025, 6 weeks

### Community Service
- 150+ hours, 3 years active
- Tutoring underserved students (2023-present)
- Feed My Starving Children
- Local Food Pantry
- Library Reading Program

### Sports & Arts
- Basketball: School team since Grade 4, currently AAU
- Indian Classical Dance: Since age 5 (10+ years)

### Clubs
- Student Council: Executive Member
- FBLA: 3rd Place District (Business Plan)

## Before Pushing to Git
ALWAYS run local build first:
```bash
npm run build
```
Only push if build succeeds.

## Common Issues
- **Duplicate interface names**: Watch out for `Activity` vs `ActivityItem` in content.ts
- **Image haziness**: Use plain `<img>` tags instead of Next.js `<Image>` for sharp images
- **Modal scroll**: All modals should have `useEffect` to lock body scroll

## Pending/Future Ideas
- Add more school clubs when user provides details
- Potentially add testimonials section
- Book purchase link when available
