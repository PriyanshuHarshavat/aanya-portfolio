/**
 * Data Access Layer
 *
 * This module handles all data fetching from Supabase database.
 * Each function fetches from the database and falls back to static content
 * if Supabase is not configured or if the query fails.
 *
 * Pattern:
 * 1. Check if Supabase is configured
 * 2. Try to fetch from database
 * 3. Fall back to static content on error
 *
 * @module lib/data
 */

import { supabase, isSupabaseConfigured } from './supabase'
import {
  siteContent as staticSiteContent,
  heroContent as staticHeroContent,
  aboutContent as staticAboutContent,
  achievements as staticAchievements,
  bookContent as staticBookContent,
  bookGallery as staticBookGallery,
  bookVideo as staticBookVideo,
  testimonials as staticTestimonials,
  youtubeVideos as staticYoutubeVideos,
  youtubeSection as staticYoutubeSection,
  type SiteContent,
  type Achievement,
  type Book,
  type BookGalleryImage,
  type Testimonial,
  type YouTubeVideo,
  type AcademicYear,
  type ResearchExperience,
  type CommunityServiceCategory,
  type ActivityCategory,
} from './content'

// ============================================
// CONSTANTS
// ============================================

/** Default icon for categories without a specified icon */
const DEFAULT_ICON = 'Heart'

/** Default color for categories without a specified color */
const DEFAULT_COLOR = 'blue'

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Converts an array of key-value rows into an object map
 * @param rows - Array of objects with key and value properties
 * @returns Object with keys mapped to their values
 */
function toContentMap(rows: { key: string; value: string | null }[]): Record<string, string> {
  return Object.fromEntries(rows.map((row) => [row.key, row.value || '']))
}

// ============================================
// SITE CONTENT (Key-Value Store)
// ============================================

/**
 * Fetches basic site information (name, tagline, contact info)
 *
 * @returns Site metadata including name, tagline, email, and social links
 *
 * @example
 * const site = await getSiteContent()
 * console.log(site.name) // "Aanya Harshavat"
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return staticSiteContent

  try {
    const { data, error } = await supabase.from('site_content').select('key, value')

    if (error || !data?.length) return staticSiteContent

    const contentMap = toContentMap(data)

    return {
      name: contentMap.name || staticSiteContent.name,
      tagline: contentMap.tagline || staticSiteContent.tagline,
      email: contentMap.email || staticSiteContent.email,
      linkedin: contentMap.linkedin || staticSiteContent.linkedin,
      github: contentMap.github || staticSiteContent.github,
    }
  } catch {
    return staticSiteContent
  }
}

/**
 * Fetches hero section content (headline, subheadline, CTA, image)
 *
 * @returns Hero section data for the landing page
 */
export async function getHeroContent() {
  if (!isSupabaseConfigured) return staticHeroContent

  try {
    const { data, error } = await supabase.from('site_content').select('key, value')

    if (error || !data?.length) return staticHeroContent

    const contentMap = toContentMap(data)

    return {
      headline: contentMap.hero_headline || staticHeroContent.headline,
      headlineAccent: contentMap.hero_headline_accent || staticHeroContent.headlineAccent,
      subheadline: contentMap.hero_subheadline || staticHeroContent.subheadline,
      cta: contentMap.hero_cta || staticHeroContent.cta,
      badge: contentMap.hero_badge || staticHeroContent.badge,
      image: contentMap.hero_image || staticHeroContent.image,
      imageAlt: contentMap.hero_image_alt || '',
    }
  } catch {
    return staticHeroContent
  }
}

/**
 * Fetches about section content (bio, image, highlights)
 *
 * @returns About section data including bio paragraphs and achievement highlights
 */
export async function getAboutContent() {
  if (!isSupabaseConfigured) return staticAboutContent

  try {
    const { data: contentData, error: contentError } = await supabase
      .from('site_content')
      .select('key, value')

    const { data: highlightsData, error: highlightsError } = await supabase
      .from('highlights')
      .select('*')
      .order('sort_order')

    if (contentError && highlightsError) return staticAboutContent

    const contentMap = contentData ? toContentMap(contentData) : {}

    const highlights = highlightsData?.length
      ? highlightsData.map((h: { label: string; value: string }) => ({
          label: h.label,
          value: h.value,
        }))
      : staticAboutContent.highlights

    // Split bio text into paragraphs (separated by double newlines)
    const bioText = contentMap.about_bio || ''
    const bio = bioText ? bioText.split('\n\n').filter(Boolean) : staticAboutContent.bio

    return {
      title: contentMap.about_title || staticAboutContent.title,
      bio,
      image: contentMap.about_image || staticAboutContent.image,
      imageAlt: contentMap.about_image_alt || '',
      highlights,
    }
  } catch {
    return staticAboutContent
  }
}

// ============================================
// ACADEMIC JOURNEY
// ============================================

/** Database row structure for courses */
interface CourseRow {
  year: string
  semester: string
  name: string
  type: string
  subject: string
}

/**
 * Fetches academic journey data (GPA, courses by year/semester)
 *
 * @returns Academic data including GPA and courses grouped by year
 */
export async function getAcademicJourney(): Promise<{
  gpa: string
  currentYear: string
  years: AcademicYear[]
}> {
  const defaultJourney = staticAchievements[1]?.academicJourney

  if (!isSupabaseConfigured || !defaultJourney) {
    return defaultJourney || { gpa: '', currentYear: '', years: [] }
  }

  try {
    const { data: contentData } = await supabase.from('site_content').select('key, value')

    const { data: coursesData, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order')

    if (error || !coursesData?.length) return defaultJourney

    const contentMap = contentData ? toContentMap(contentData) : {}

    // Group courses by academic year and semester for timeline display
    const yearsMap = new Map<string, AcademicYear>()

    for (const course of coursesData as CourseRow[]) {
      // Use year-semester as unique key to group courses together
      const key = `${course.year}-${course.semester}`

      if (!yearsMap.has(key)) {
        yearsMap.set(key, {
          year: course.year,
          semester: course.semester,
          courses: [],
        })
      }

      // Safe to use non-null assertion - we just created the entry above if it didn't exist
      yearsMap.get(key)!.courses.push({
        name: course.name,
        type: course.type as 'AP' | 'Honors' | 'Core',
        subject: course.subject,
      })
    }

    return {
      gpa: contentMap.academic_gpa || defaultJourney.gpa,
      currentYear: contentMap.academic_current_year || defaultJourney.currentYear,
      years: Array.from(yearsMap.values()),
    }
  } catch {
    return defaultJourney
  }
}

// ============================================
// RESEARCH EXPERIENCES
// ============================================

/** Database row structure for research experiences */
interface ResearchRow {
  id: number
  institution: string
  department: string
  project_title: string
  duration: string | null
  period: string | null
  description: string | null
  outcomes: string[]
  skills: string[]
}

/**
 * Fetches research experiences from database
 *
 * @returns Array of research experience objects
 */
export async function getResearchExperiences(): Promise<ResearchExperience[]> {
  const defaultExperiences = staticAchievements[2]?.researchExperiences || []

  if (!isSupabaseConfigured) return defaultExperiences

  try {
    const { data, error } = await supabase
      .from('research_experiences')
      .select('*')
      .order('sort_order')

    if (error || !data?.length) return defaultExperiences

    return (data as ResearchRow[]).map((r) => ({
      id: r.id.toString(),
      institution: r.institution,
      department: r.department,
      projectTitle: r.project_title,
      duration: r.duration || '',
      period: r.period || '',
      description: r.description || '',
      outcomes: r.outcomes || [],
      skills: r.skills || [],
    }))
  } catch {
    return defaultExperiences
  }
}

// ============================================
// COMMUNITY SERVICE
// ============================================

/** Database row structure for community service entries */
interface CommunityRow {
  id: number
  category: string
  category_icon: string | null
  category_color: string | null
  organization: string
  role: string | null
  period: string | null
  description: string | null
  icon: string | null
}

/**
 * Fetches community service data grouped by category
 *
 * @returns Community service stats and organizations grouped by category
 */
export async function getCommunityService(): Promise<{
  totalHours: string
  yearsActive: string
  categories: CommunityServiceCategory[]
}> {
  const defaultService = staticAchievements[3]?.communityService

  if (!isSupabaseConfigured || !defaultService) {
    return defaultService || { totalHours: '', yearsActive: '', categories: [] }
  }

  try {
    const { data: contentData } = await supabase.from('site_content').select('key, value')

    const { data, error } = await supabase
      .from('community_service')
      .select('*')
      .order('sort_order')

    if (error || !data?.length) return defaultService

    const contentMap = contentData ? toContentMap(contentData) : {}

    // Group service entries by category for organized display
    const categoriesMap = new Map<string, CommunityServiceCategory>()

    for (const item of data as CommunityRow[]) {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          id: item.category.toLowerCase().replace(/\s+/g, '-'),
          name: item.category,
          icon: item.category_icon || DEFAULT_ICON,
          color: item.category_color || DEFAULT_COLOR,
          organizations: [],
        })
      }

      categoriesMap.get(item.category)!.organizations.push({
        id: item.id.toString(),
        name: item.organization,
        role: item.role || '',
        period: item.period || '',
        description: item.description || '',
        icon: item.icon || DEFAULT_ICON,
      })
    }

    return {
      totalHours: contentMap.community_total_hours || defaultService.totalHours,
      yearsActive: contentMap.community_years_active || defaultService.yearsActive,
      categories: Array.from(categoriesMap.values()),
    }
  } catch {
    return defaultService
  }
}

// ============================================
// ACTIVITIES (Sports, Arts, Clubs)
// ============================================

/** Database row structure for activities */
interface ActivityDbRow {
  id: number
  section: string
  category: string
  category_icon: string | null
  category_color: string | null
  name: string
  description: string | null
  period: string | null
  highlight: string | null
}

/**
 * Fetches activities by section (sports/arts or clubs/leadership)
 *
 * @param section - Which section to fetch: 'sports_arts' or 'clubs_leadership'
 * @returns Activities grouped by category
 */
export async function getActivities(
  section: 'sports_arts' | 'clubs_leadership'
): Promise<{ categories: ActivityCategory[] }> {
  const defaultActivities =
    section === 'sports_arts'
      ? staticAchievements[4]?.sportsAndArts
      : staticAchievements[5]?.clubsAndLeadership

  if (!isSupabaseConfigured || !defaultActivities) {
    return defaultActivities || { categories: [] }
  }

  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('section', section)
      .order('sort_order')

    if (error || !data?.length) return defaultActivities

    // Group activities by category for organized display
    const categoriesMap = new Map<string, ActivityCategory>()

    for (const item of data as ActivityDbRow[]) {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          id: item.category.toLowerCase().replace(/\s+/g, '-'),
          name: item.category,
          icon: item.category_icon || 'Trophy',
          color: item.category_color || DEFAULT_COLOR,
          activities: [],
        })
      }

      categoriesMap.get(item.category)!.activities.push({
        id: item.id.toString(),
        name: item.name,
        description: item.description || '',
        period: item.period || '',
        highlight: item.highlight || undefined,
      })
    }

    return { categories: Array.from(categoriesMap.values()) }
  } catch {
    return defaultActivities
  }
}

// ============================================
// ACHIEVEMENTS (Composite)
// ============================================

/**
 * Fetches all achievements data by combining multiple data sources
 *
 * This function aggregates data from academic, research, community service,
 * and activities tables into a single achievements array.
 *
 * @returns Complete achievements array with all sections populated
 */
export async function getAchievements(): Promise<Achievement[]> {
  if (!isSupabaseConfigured) return staticAchievements

  try {
    // Fetch all achievement data in parallel for performance
    const [academicJourney, researchExperiences, communityService, sportsAndArts, clubsAndLeadership] =
      await Promise.all([
        getAcademicJourney(),
        getResearchExperiences(),
        getCommunityService(),
        getActivities('sports_arts'),
        getActivities('clubs_leadership'),
      ])

    // Merge database data with static achievements (keeping icons, colors, etc.)
    return staticAchievements.map((achievement) => {
      switch (achievement.id) {
        case '2':
          return { ...achievement, academicJourney }
        case '3':
          return { ...achievement, researchExperiences }
        case '4':
          return { ...achievement, communityService }
        case '5':
          return { ...achievement, sportsAndArts }
        case '6':
          return { ...achievement, clubsAndLeadership }
        default:
          return achievement
      }
    })
  } catch {
    return staticAchievements
  }
}

// ============================================
// GALLERY IMAGES
// ============================================

/** Database row structure for gallery images */
interface GalleryRow {
  id: number
  src: string
  alt: string | null
  caption: string | null
}

/**
 * Fetches book gallery images
 *
 * @returns Array of gallery images with src, alt text, and optional captions
 */
export async function getGalleryImages(): Promise<BookGalleryImage[]> {
  if (!isSupabaseConfigured) return staticBookGallery

  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', 'book')
      .order('sort_order')

    if (error || !data?.length) return staticBookGallery

    return (data as GalleryRow[]).map((img) => ({
      src: img.src,
      alt: img.alt || '',
      caption: img.caption || undefined,
    }))
  } catch {
    return staticBookGallery
  }
}

// ============================================
// BOOK CONTENT
// ============================================

/** Book video configuration */
export interface BookVideo {
  src: string
  poster: string
  title: string
}

/**
 * Fetches book details (title, description, synopsis, cover image, purchase link)
 *
 * @returns Book content object with all book metadata
 *
 * @example
 * const book = await getBookContent()
 * console.log(book.title) // "Annie and Froggy Make a Friend"
 */
export async function getBookContent(): Promise<Book> {
  if (!isSupabaseConfigured) return staticBookContent

  try {
    const { data, error } = await supabase.from('site_content').select('key, value')

    if (error || !data?.length) return staticBookContent

    const contentMap = toContentMap(data)

    return {
      title: contentMap.book_title || staticBookContent.title,
      description: contentMap.book_description || staticBookContent.description,
      coverImage: contentMap.book_cover_image || staticBookContent.coverImage,
      purchaseLink: contentMap.book_purchase_link || staticBookContent.purchaseLink,
      readOnlineLink: staticBookContent.readOnlineLink, // Always use static for internal link
      synopsis: contentMap.book_synopsis || staticBookContent.synopsis,
    }
  } catch {
    return staticBookContent
  }
}

/**
 * Fetches book video configuration (video URL, thumbnail, title)
 *
 * @returns Book video object with src, poster, and title
 */
export async function getBookVideo(): Promise<BookVideo> {
  if (!isSupabaseConfigured) return staticBookVideo

  try {
    const { data, error } = await supabase.from('site_content').select('key, value')

    if (error || !data?.length) return staticBookVideo

    const contentMap = toContentMap(data)

    return {
      src: contentMap.book_video_src || staticBookVideo.src,
      poster: contentMap.book_video_poster || staticBookVideo.poster,
      title: contentMap.book_video_title || staticBookVideo.title,
    }
  } catch {
    return staticBookVideo
  }
}

// ============================================
// TESTIMONIALS
// ============================================

/** Database row structure for testimonials */
interface TestimonialRow {
  id: number
  quote: string
  author: string
  role: string | null
}

/**
 * Fetches testimonials/quotes from teachers and mentors
 *
 * @returns Array of testimonial objects
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return staticTestimonials

  try {
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order')

    if (error || !data?.length) return staticTestimonials

    return (data as TestimonialRow[]).map((t) => ({
      id: t.id.toString(),
      quote: t.quote,
      author: t.author,
      role: t.role || '',
    }))
  } catch {
    return staticTestimonials
  }
}

// ============================================
// YOUTUBE VIDEOS
// ============================================

/** Database row structure for YouTube videos */
interface VideoRow {
  id: number
  video_id: string
  title: string
  description: string | null
}

/**
 * Fetches YouTube video list for KalmKids section
 *
 * @returns Array of video objects with YouTube video IDs
 */
export async function getYoutubeVideos(): Promise<YouTubeVideo[]> {
  if (!isSupabaseConfigured) return staticYoutubeVideos

  try {
    const { data, error } = await supabase.from('youtube_videos').select('*').order('sort_order')

    if (error || !data?.length) return staticYoutubeVideos

    return (data as VideoRow[]).map((v) => ({
      id: v.id.toString(),
      videoId: v.video_id,
      title: v.title,
      description: v.description || undefined,
    }))
  } catch {
    return staticYoutubeVideos
  }
}

/**
 * Fetches YouTube section metadata (title, subtitle, channel URL)
 *
 * @returns YouTube section configuration
 */
export async function getYoutubeSection() {
  if (!isSupabaseConfigured) return staticYoutubeSection

  try {
    const { data, error } = await supabase.from('site_content').select('key, value')

    if (error || !data?.length) return staticYoutubeSection

    const contentMap = toContentMap(data)

    return {
      title: contentMap.youtube_title || staticYoutubeSection.title,
      subtitle: contentMap.youtube_subtitle || staticYoutubeSection.subtitle,
      channelUrl: contentMap.youtube_channel_url || staticYoutubeSection.channelUrl,
    }
  } catch {
    return staticYoutubeSection
  }
}

// ============================================
// SEO SETTINGS
// ============================================

/**
 * SEO configuration for the site
 * Includes meta tags, Open Graph data, and structured data settings
 */
export interface SeoSettings {
  /** Page title shown in browser tab and search results */
  metaTitle: string
  /** Description shown in search results */
  metaDescription: string
  /** Comma-separated keywords for SEO */
  metaKeywords: string
  /** Open Graph image URL for social sharing */
  ogImage: string
  /** Favicon URL */
  favicon: string
  /** Book page title */
  bookTitle: string
  /** Book page description */
  bookDescription: string
  /** Book page social share image */
  bookImage: string
  /** Site URL for canonical links and structured data */
  siteUrl: string
  /** Person description for JSON-LD schema */
  personDescription: string
}

/** Default SEO settings used when database is not available */
const defaultSeoSettings: SeoSettings = {
  metaTitle: 'Aanya Harshavat | Author, Scholar, Changemaker',
  metaDescription:
    'High school sophomore and published author passionate about making an impact through writing, leadership, and innovation.',
  metaKeywords:
    'Aanya Harshavat, student portfolio, published author, high school, leadership, young author, student leader',
  ogImage: '/og-image.png',
  favicon: '/favicon.ico',
  bookTitle: 'Annie and Froggy Make a Friend | Aanya Harshavat',
  bookDescription:
    'Read "Annie and Froggy Make a Friend" - a children\'s book by Aanya Harshavat about friendship, kindness, and making new friends.',
  bookImage: '/og-image.png',
  siteUrl: 'https://aanyaharshavat.com',
  personDescription:
    'High school sophomore and published author passionate about making an impact through writing, leadership, and innovation.',
}

/**
 * Fetches SEO settings from database
 *
 * Used by layout.tsx for meta tags and JsonLd component for structured data.
 *
 * @returns SEO configuration object
 */
export async function getSeoSettings(): Promise<SeoSettings> {
  if (!isSupabaseConfigured) return defaultSeoSettings

  try {
    const { data, error } = await supabase.from('seo_settings').select('key, value')

    if (error || !data?.length) return defaultSeoSettings

    const contentMap = toContentMap(data)

    return {
      metaTitle: contentMap.meta_title || defaultSeoSettings.metaTitle,
      metaDescription: contentMap.meta_description || defaultSeoSettings.metaDescription,
      metaKeywords: contentMap.meta_keywords || defaultSeoSettings.metaKeywords,
      ogImage: contentMap.og_image || defaultSeoSettings.ogImage,
      favicon: contentMap.favicon || defaultSeoSettings.favicon,
      bookTitle: contentMap.book_title || defaultSeoSettings.bookTitle,
      bookDescription: contentMap.book_description || defaultSeoSettings.bookDescription,
      bookImage: contentMap.book_image || defaultSeoSettings.bookImage,
      siteUrl: contentMap.site_url || defaultSeoSettings.siteUrl,
      personDescription: contentMap.person_description || defaultSeoSettings.personDescription,
    }
  } catch {
    return defaultSeoSettings
  }
}
