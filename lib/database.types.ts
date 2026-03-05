// Database types for Supabase tables

export interface SiteContentRow {
  id: number
  key: string
  value: string | null
  updated_at: string
}

export interface HighlightRow {
  id: number
  label: string
  value: string
  sort_order: number
}

export interface CourseRow {
  id: number
  year: string
  semester: string
  name: string
  type: string
  subject: string
  sort_order: number
}

export interface ResearchExperienceRow {
  id: number
  institution: string
  department: string
  project_title: string
  duration: string | null
  period: string | null
  description: string | null
  outcomes: string[]
  skills: string[]
  sort_order: number
}

export interface CommunityServiceRow {
  id: number
  category: string
  organization: string
  role: string | null
  period: string | null
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number
}

export interface ActivityRow {
  id: number
  section: 'sports_arts' | 'clubs_leadership'
  category: string
  category_icon: string | null
  category_color: string | null
  name: string
  description: string | null
  period: string | null
  highlight: string | null
  sort_order: number
}

export interface GalleryImageRow {
  id: number
  src: string
  alt: string | null
  caption: string | null
  category: string
  sort_order: number
}

export interface TestimonialRow {
  id: number
  quote: string
  author: string
  role: string | null
  sort_order: number
}

export interface YouTubeVideoRow {
  id: number
  video_id: string
  title: string
  description: string | null
  upload_date: string | null
  sort_order: number
}

// Content keys for site_content table
export type ContentKey =
  | 'name'
  | 'tagline'
  | 'email'
  | 'linkedin'
  | 'github'
  | 'hero_headline'
  | 'hero_headline_accent'
  | 'hero_subheadline'
  | 'hero_badge'
  | 'hero_image'
  | 'hero_cta'
  | 'about_title'
  | 'about_bio'
  | 'about_image'
  | 'about_quote'
  | 'youtube_title'
  | 'youtube_subtitle'
  | 'youtube_channel_url'
  | 'community_total_hours'
  | 'community_years_active'
  | 'academic_gpa'
  | 'academic_current_year'
