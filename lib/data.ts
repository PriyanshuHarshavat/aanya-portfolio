import { supabase, isSupabaseConfigured } from './supabase'
import {
  siteContent as staticSiteContent,
  heroContent as staticHeroContent,
  aboutContent as staticAboutContent,
  achievements as staticAchievements,
  bookGallery as staticBookGallery,
  testimonials as staticTestimonials,
  youtubeVideos as staticYoutubeVideos,
  youtubeSection as staticYoutubeSection,
  type SiteContent,
  type Achievement,
  type BookGalleryImage,
  type Testimonial,
  type YouTubeVideo,
  type AcademicYear,
  type ResearchExperience,
  type CommunityServiceCategory,
  type ActivityCategory,
} from './content'

// ============================================
// SITE CONTENT (Key-Value Store)
// ============================================

export async function getSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return staticSiteContent

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value')

    if (error || !data?.length) return staticSiteContent

    const contentMap = Object.fromEntries(
      data.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
    )

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

export async function getHeroContent() {
  if (!isSupabaseConfigured) return staticHeroContent

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value')

    if (error || !data?.length) return staticHeroContent

    const contentMap = Object.fromEntries(
      data.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
    )

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

    const contentMap = contentData
      ? Object.fromEntries(
          contentData.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
        )
      : {}

    const highlights = highlightsData?.length
      ? highlightsData.map((h: { label: string; value: string }) => ({ label: h.label, value: h.value }))
      : staticAboutContent.highlights

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

interface CourseRow {
  year: string
  semester: string
  name: string
  type: string
  subject: string
}

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
    const { data: contentData } = await supabase
      .from('site_content')
      .select('key, value')

    const { data: coursesData, error } = await supabase
      .from('courses')
      .select('*')
      .order('sort_order')

    if (error || !coursesData?.length) return defaultJourney

    const contentMap = contentData
      ? Object.fromEntries(
          contentData.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
        )
      : {}

    // Group courses by year/semester
    const yearsMap = new Map<string, AcademicYear>()

    for (const course of coursesData as CourseRow[]) {
      const key = `${course.year}-${course.semester}`
      if (!yearsMap.has(key)) {
        yearsMap.set(key, {
          year: course.year,
          semester: course.semester,
          courses: [],
        })
      }
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
    const { data: contentData } = await supabase
      .from('site_content')
      .select('key, value')

    const { data, error } = await supabase
      .from('community_service')
      .select('*')
      .order('sort_order')

    if (error || !data?.length) return defaultService

    const contentMap = contentData
      ? Object.fromEntries(
          contentData.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
        )
      : {}

    // Group by category
    const categoriesMap = new Map<string, CommunityServiceCategory>()

    for (const item of data as CommunityRow[]) {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          id: item.category.toLowerCase().replace(/\s+/g, '-'),
          name: item.category,
          icon: item.category_icon || 'Heart',
          color: item.category_color || 'blue',
          organizations: [],
        })
      }
      categoriesMap.get(item.category)!.organizations.push({
        id: item.id.toString(),
        name: item.organization,
        role: item.role || '',
        period: item.period || '',
        description: item.description || '',
        icon: item.icon || 'Heart',
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

    // Group by category
    const categoriesMap = new Map<string, ActivityCategory>()

    for (const item of data as ActivityDbRow[]) {
      if (!categoriesMap.has(item.category)) {
        categoriesMap.set(item.category, {
          id: item.category.toLowerCase().replace(/\s+/g, '-'),
          name: item.category,
          icon: item.category_icon || 'Trophy',
          color: item.category_color || 'blue',
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

export async function getAchievements(): Promise<Achievement[]> {
  if (!isSupabaseConfigured) return staticAchievements

  try {
    const [academicJourney, researchExperiences, communityService, sportsAndArts, clubsAndLeadership] =
      await Promise.all([
        getAcademicJourney(),
        getResearchExperiences(),
        getCommunityService(),
        getActivities('sports_arts'),
        getActivities('clubs_leadership'),
      ])

    // Merge with static achievements (keeping icons, colors, etc.)
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

interface GalleryRow {
  id: number
  src: string
  alt: string | null
  caption: string | null
}

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
// TESTIMONIALS
// ============================================

interface TestimonialRow {
  id: number
  quote: string
  author: string
  role: string | null
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return staticTestimonials

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order')

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

interface VideoRow {
  id: number
  video_id: string
  title: string
  description: string | null
}

export async function getYoutubeVideos(): Promise<YouTubeVideo[]> {
  if (!isSupabaseConfigured) return staticYoutubeVideos

  try {
    const { data, error } = await supabase
      .from('youtube_videos')
      .select('*')
      .order('sort_order')

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

export async function getYoutubeSection() {
  if (!isSupabaseConfigured) return staticYoutubeSection

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('key, value')

    if (error || !data?.length) return staticYoutubeSection

    const contentMap = Object.fromEntries(
      data.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
    )

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

export interface SeoSettings {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  ogImage: string
  favicon: string
  // Book page
  bookTitle: string
  bookDescription: string
  bookImage: string
  // Site info for JsonLd
  siteUrl: string
  personDescription: string
}

const defaultSeoSettings: SeoSettings = {
  metaTitle: 'Aanya Harshavat | Author, Scholar, Changemaker',
  metaDescription: 'High school sophomore and published author passionate about making an impact through writing, leadership, and innovation.',
  metaKeywords: 'Aanya Harshavat, student portfolio, published author, high school, leadership, young author, student leader',
  ogImage: '/og-image.png',
  favicon: '/favicon.ico',
  bookTitle: 'Annie and Froggy Make a Friend | Aanya Harshavat',
  bookDescription: 'Read "Annie and Froggy Make a Friend" - a children\'s book by Aanya Harshavat about friendship, kindness, and making new friends.',
  bookImage: '/og-image.png',
  siteUrl: 'https://aanyaharshavat.com',
  personDescription: 'High school sophomore and published author passionate about making an impact through writing, leadership, and innovation.',
}

export async function getSeoSettings(): Promise<SeoSettings> {
  if (!isSupabaseConfigured) return defaultSeoSettings

  try {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('key, value')

    if (error || !data?.length) return defaultSeoSettings

    const contentMap = Object.fromEntries(
      data.map((row: { key: string; value: string | null }) => [row.key, row.value || ''])
    )

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
