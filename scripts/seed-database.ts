/**
 * Database Seed Script
 *
 * This script migrates existing content from lib/content.ts to Supabase.
 * Run with: npx tsx scripts/seed-database.ts
 *
 * Prerequisites:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * 3. Run the table creation SQL in Supabase SQL Editor (see below)
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please create .env.local with:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Import content (using require to avoid ESM issues with tsx)
const content = require('../lib/content')

async function seedSiteContent() {
  console.log('Seeding site_content...')

  const items = [
    { key: 'name', value: content.siteContent.name },
    { key: 'tagline', value: content.siteContent.tagline },
    { key: 'email', value: content.siteContent.email },
    { key: 'linkedin', value: content.siteContent.linkedin || '' },
    { key: 'github', value: content.siteContent.github || '' },
    { key: 'hero_headline', value: content.heroContent.headline },
    { key: 'hero_headline_accent', value: content.heroContent.headlineAccent },
    { key: 'hero_subheadline', value: content.heroContent.subheadline },
    { key: 'hero_badge', value: content.heroContent.badge },
    { key: 'hero_cta', value: content.heroContent.cta },
    { key: 'hero_image', value: content.heroContent.image },
    { key: 'about_title', value: content.aboutContent.title },
    { key: 'about_bio', value: content.aboutContent.bio.join('\n\n') },
    { key: 'about_image', value: content.aboutContent.image },
    { key: 'youtube_title', value: content.youtubeSection.title },
    { key: 'youtube_subtitle', value: content.youtubeSection.subtitle },
    { key: 'youtube_channel_url', value: content.youtubeSection.channelUrl },
  ]

  // Add academic info from achievements
  const academicAchievement = content.achievements.find((a: { academicJourney?: object }) => a.academicJourney)
  if (academicAchievement?.academicJourney) {
    items.push(
      { key: 'academic_gpa', value: academicAchievement.academicJourney.gpa },
      { key: 'academic_current_year', value: academicAchievement.academicJourney.currentYear }
    )
  }

  // Add community service stats
  const communityAchievement = content.achievements.find((a: { communityService?: object }) => a.communityService)
  if (communityAchievement?.communityService) {
    items.push(
      { key: 'community_total_hours', value: communityAchievement.communityService.totalHours },
      { key: 'community_years_active', value: communityAchievement.communityService.yearsActive }
    )
  }

  const { error } = await supabase.from('site_content').upsert(items, { onConflict: 'key' })
  if (error) console.error('Error seeding site_content:', error)
  else console.log(`  ✓ Seeded ${items.length} content items`)
}

async function seedHighlights() {
  console.log('Seeding highlights...')

  const items = content.aboutContent.highlights.map((h: { label: string; value: string }, i: number) => ({
    label: h.label,
    value: h.value,
    sort_order: i,
  }))

  const { error } = await supabase.from('highlights').upsert(items)
  if (error) console.error('Error seeding highlights:', error)
  else console.log(`  ✓ Seeded ${items.length} highlights`)
}

async function seedCourses() {
  console.log('Seeding courses...')

  const academicAchievement = content.achievements.find((a: { academicJourney?: object }) => a.academicJourney)
  if (!academicAchievement?.academicJourney) {
    console.log('  No academic journey found')
    return
  }

  const items: Array<{
    year: string
    semester: string
    name: string
    type: string
    subject: string
    sort_order: number
  }> = []
  let sortOrder = 0

  for (const year of academicAchievement.academicJourney.years) {
    for (const course of year.courses) {
      items.push({
        year: year.year,
        semester: year.semester,
        name: course.name,
        type: course.type,
        subject: course.subject,
        sort_order: sortOrder++,
      })
    }
  }

  const { error } = await supabase.from('courses').upsert(items)
  if (error) console.error('Error seeding courses:', error)
  else console.log(`  ✓ Seeded ${items.length} courses`)
}

async function seedResearchExperiences() {
  console.log('Seeding research_experiences...')

  const achievement = content.achievements.find((a: { researchExperiences?: object }) => a.researchExperiences)
  if (!achievement?.researchExperiences) {
    console.log('  No research experiences found')
    return
  }

  const items = achievement.researchExperiences.map((r: {
    institution: string
    department: string
    projectTitle: string
    duration: string
    period: string
    description: string
    outcomes: string[]
    skills: string[]
  }, i: number) => ({
    institution: r.institution,
    department: r.department,
    project_title: r.projectTitle,
    duration: r.duration,
    period: r.period,
    description: r.description,
    outcomes: r.outcomes,
    skills: r.skills,
    sort_order: i,
  }))

  const { error } = await supabase.from('research_experiences').upsert(items)
  if (error) console.error('Error seeding research_experiences:', error)
  else console.log(`  ✓ Seeded ${items.length} research experiences`)
}

async function seedCommunityService() {
  console.log('Seeding community_service...')

  const achievement = content.achievements.find((a: { communityService?: object }) => a.communityService)
  if (!achievement?.communityService) {
    console.log('  No community service found')
    return
  }

  const items: Array<{
    category: string
    category_icon: string
    category_color: string
    organization: string
    role: string
    period: string
    description: string
    icon: string
    sort_order: number
  }> = []
  let sortOrder = 0

  for (const category of achievement.communityService.categories) {
    for (const org of category.organizations) {
      items.push({
        category: category.name,
        category_icon: category.icon,
        category_color: category.color,
        organization: org.name,
        role: org.role,
        period: org.period,
        description: org.description,
        icon: org.icon,
        sort_order: sortOrder++,
      })
    }
  }

  const { error } = await supabase.from('community_service').upsert(items)
  if (error) console.error('Error seeding community_service:', error)
  else console.log(`  ✓ Seeded ${items.length} community service items`)
}

async function seedActivities() {
  console.log('Seeding activities...')

  const items: Array<{
    section: string
    category: string
    category_icon: string
    category_color: string
    name: string
    description: string
    period: string
    highlight: string | null
    sort_order: number
  }> = []
  let sortOrder = 0

  // Sports & Arts
  const sportsAchievement = content.achievements.find((a: { sportsAndArts?: object }) => a.sportsAndArts)
  if (sportsAchievement?.sportsAndArts) {
    for (const category of sportsAchievement.sportsAndArts.categories) {
      for (const activity of category.activities) {
        items.push({
          section: 'sports_arts',
          category: category.name,
          category_icon: category.icon,
          category_color: category.color,
          name: activity.name,
          description: activity.description,
          period: activity.period,
          highlight: activity.highlight || null,
          sort_order: sortOrder++,
        })
      }
    }
  }

  // Clubs & Leadership
  const clubsAchievement = content.achievements.find((a: { clubsAndLeadership?: object }) => a.clubsAndLeadership)
  if (clubsAchievement?.clubsAndLeadership) {
    for (const category of clubsAchievement.clubsAndLeadership.categories) {
      for (const activity of category.activities) {
        items.push({
          section: 'clubs_leadership',
          category: category.name,
          category_icon: category.icon,
          category_color: category.color,
          name: activity.name,
          description: activity.description,
          period: activity.period,
          highlight: activity.highlight || null,
          sort_order: sortOrder++,
        })
      }
    }
  }

  const { error } = await supabase.from('activities').upsert(items)
  if (error) console.error('Error seeding activities:', error)
  else console.log(`  ✓ Seeded ${items.length} activities`)
}

async function seedGalleryImages() {
  console.log('Seeding gallery_images...')

  const items = content.bookGallery.map((img: { src: string; alt: string; caption?: string }, i: number) => ({
    src: img.src,
    alt: img.alt,
    caption: img.caption || null,
    category: 'book',
    sort_order: i,
  }))

  const { error } = await supabase.from('gallery_images').upsert(items)
  if (error) console.error('Error seeding gallery_images:', error)
  else console.log(`  ✓ Seeded ${items.length} gallery images`)
}

async function seedTestimonials() {
  console.log('Seeding testimonials...')

  const items = content.testimonials.map((t: { quote: string; author: string; role: string }, i: number) => ({
    quote: t.quote,
    author: t.author,
    role: t.role,
    sort_order: i,
  }))

  const { error } = await supabase.from('testimonials').upsert(items)
  if (error) console.error('Error seeding testimonials:', error)
  else console.log(`  ✓ Seeded ${items.length} testimonials`)
}

async function seedYoutubeVideos() {
  console.log('Seeding youtube_videos...')

  const items = content.youtubeVideos.map((v: { videoId: string; title: string; description?: string }, i: number) => ({
    video_id: v.videoId,
    title: v.title,
    description: v.description || null,
    sort_order: i,
  }))

  const { error } = await supabase.from('youtube_videos').upsert(items)
  if (error) console.error('Error seeding youtube_videos:', error)
  else console.log(`  ✓ Seeded ${items.length} youtube videos`)
}

async function main() {
  console.log('\n🚀 Starting database seed...\n')

  await seedSiteContent()
  await seedHighlights()
  await seedCourses()
  await seedResearchExperiences()
  await seedCommunityService()
  await seedActivities()
  await seedGalleryImages()
  await seedTestimonials()
  await seedYoutubeVideos()

  console.log('\n✅ Database seed complete!\n')
}

main().catch(console.error)
