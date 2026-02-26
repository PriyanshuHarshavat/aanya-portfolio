// Aanya Harshavat - Portfolio Content
// All content centralized here for easy updates

export interface SiteContent {
  name: string;
  tagline: string;
  email: string;
  linkedin?: string;
  github?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'accent' | 'highlight';
  size?: 'large' | 'medium' | 'small';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

export interface Activity {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  years: string;
}

export interface Book {
  title: string;
  description: string;
  coverImage: string;
  purchaseLink?: string;
  readOnlineLink?: string;
  synopsis: string;
  testimonials?: { quote: string; author: string }[];
}

export interface BookGalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description?: string;
}

// ============================================
// SITE CONTENT
// ============================================

export const siteContent: SiteContent = {
  name: "Aanya Harshavat",
  tagline: "Author | Scholar | Changemaker",
  email: "contact@aanyaharshavat.com",
  linkedin: "https://linkedin.com/in/aanya-harshavat",
  github: "",
};

export const heroContent = {
  headline: "Building Tomorrow,",
  headlineAccent: "Today.",
  subheadline: "High school sophomore and published author inspiring young readers through storytelling and community engagement.",
  cta: "Get in Touch",
  badge: "Published Author",
  image: "/uploads/headshot.jpg",
};

export const aboutContent = {
  title: "About Me",
  bio: [
    "I'm Aanya Harshavat, a high school sophomore with a passion for storytelling, leadership, and making a positive impact in my community.",
    "At 15, I published my first children's book, \"Annie and Froggy Make a Friend,\" which I've had the privilege of reading to elementary school students across the district.",
    "I believe that young people have the power to inspire others and create meaningful change—and I'm committed to being part of that change through writing, education, and community service.",
  ],
  image: "/uploads/WhatsApp Image 2026-02-25 at 4.43.35 PM.jpeg",
  highlights: [
    { label: "Published Author", value: "Age 15" },
    { label: "School Visits", value: "5+" },
    { label: "Students Reached", value: "500+" },
    { label: "Community Hours", value: "100+" },
  ],
};

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Published Author",
    description: "Wrote and published \"Annie and Froggy Make a Friend,\" a children's book promoting friendship and inclusion.",
    icon: "BookOpen",
    color: "primary",
    size: "large",
  },
  {
    id: "2",
    title: "School Speaker",
    description: "Presented book readings and author talks at multiple elementary schools, engaging hundreds of young students.",
    icon: "Users",
    color: "accent",
    size: "medium",
  },
  {
    id: "3",
    title: "Library Partner",
    description: "Partnered with local libraries to donate books and promote literacy in the community.",
    icon: "Library",
    color: "highlight",
    size: "medium",
  },
  {
    id: "4",
    title: "Academic Excellence",
    description: "Maintaining strong academics while balancing extracurriculars and community service.",
    icon: "Award",
    color: "primary",
    size: "small",
  },
  {
    id: "5",
    title: "Youth Leadership",
    description: "Demonstrating that young people can make an impact through creativity and initiative.",
    icon: "Star",
    color: "accent",
    size: "small",
  },
  {
    id: "6",
    title: "Community Impact",
    description: "Dedicated to inspiring the next generation of readers and writers.",
    icon: "Heart",
    color: "highlight",
    size: "small",
  },
];

export const bookContent: Book = {
  title: "Annie and Froggy Make a Friend",
  description: "A heartwarming children's book about friendship, inclusion, and the magic of making new friends.",
  coverImage: "/uploads/PXL_20260212_222131269.MP~3.jpg",
  purchaseLink: "",
  readOnlineLink: "/book",
  synopsis: "\"Annie and Froggy Make a Friend\" is a delightful story that teaches young readers about the importance of kindness, inclusion, and the joy of making new friends. Through colorful illustrations and an engaging narrative, children learn that friendship can be found in the most unexpected places.",
  testimonials: [
    {
      quote: "A wonderful book that my students absolutely loved! The message about friendship really resonated with them.",
      author: "Elementary School Teacher",
    },
  ],
};

export const bookGallery: BookGalleryImage[] = [
  {
    src: "/uploads/PXL_20260212_220259319.jpg",
    alt: "Aanya presenting her book at school assembly",
    caption: "Reading to students at a school assembly",
  },
  {
    src: "/uploads/PXL_20260212_220805226.jpg",
    alt: "Students raising hands during book presentation",
    caption: "Engaging young readers with Q&A",
  },
  {
    src: "/uploads/PXL_20260122_010542412~2.jpg",
    alt: "Aanya at the library with her book",
    caption: "Partnering with local libraries",
  },
  {
    src: "/uploads/PXL_20260212_222131269.MP~3.jpg",
    alt: "Aanya with teacher holding the book",
    caption: "With educators who support young authors",
  },
];

export const bookVideo = {
  src: "/uploads/book-presentation.mp4",
  poster: "/uploads/PXL_20260212_220259319.jpg",
  title: "Watch Aanya Read to Students",
};

export const activities: Activity[] = [
  {
    id: "1",
    name: "Author & Speaker",
    role: "Published Author",
    description: "Writing children's books and presenting at schools to inspire young readers.",
    icon: "BookOpen",
    years: "2025 - Present",
  },
  {
    id: "2",
    name: "Community Literacy",
    role: "Volunteer",
    description: "Partnering with libraries and schools to promote reading and donate books.",
    icon: "Heart",
    years: "2025 - Present",
  },
  {
    id: "3",
    name: "Student Leadership",
    role: "Active Member",
    description: "Participating in school clubs and leadership activities.",
    icon: "Users",
    years: "2024 - Present",
  },
  {
    id: "4",
    name: "Academic Pursuits",
    role: "Student",
    description: "Committed to academic excellence while pursuing creative endeavors.",
    icon: "Award",
    years: "2023 - Present",
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Annie and Froggy Make a Friend",
    description: "A children's book promoting friendship and inclusion.",
    image: "/uploads/PXL_20260212_222131269.MP~3.jpg",
    tags: ["Writing", "Publishing", "Children's Literature"],
    link: "",
  },
  {
    id: "2",
    title: "School Reading Program",
    description: "Author visits to elementary schools reaching 500+ students.",
    image: "/uploads/PXL_20260212_220805226.jpg",
    tags: ["Community", "Education", "Leadership"],
    link: "",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "Aanya's presentation was wonderful! The students were captivated by her story and loved asking her questions about being an author.",
    author: "Elementary School Teacher",
    role: "Hawks Elementary",
  },
  {
    id: "2",
    quote: "It's inspiring to see such a young person making a positive impact in our community through literacy.",
    author: "Library Staff",
    role: "Local Library",
  },
];

export const skills = [
  { name: "Creative Writing", level: 95 },
  { name: "Public Speaking", level: 90 },
  { name: "Leadership", level: 88 },
  { name: "Community Engagement", level: 92 },
  { name: "Communication", level: 90 },
];

export const youtubeVideos: YouTubeVideo[] = [
  {
    id: "1",
    videoId: "FQJQHE83YqQ",
    title: "KalmKids Video",
    description: "Watch and learn with KalmKids",
  },
  {
    id: "2",
    videoId: "9A0hhLQ6XaU",
    title: "KalmKids Video",
    description: "Watch and learn with KalmKids",
  },
  {
    id: "3",
    videoId: "GaWWfVJnIbk",
    title: "KalmKids Video",
    description: "Watch and learn with KalmKids",
  },
  {
    id: "4",
    videoId: "DViriSZbK9E",
    title: "KalmKids Video",
    description: "Watch and learn with KalmKids",
  },
];

export const youtubeSection = {
  title: "KalmKids",
  subtitle: "Watch & Learn",
  channelUrl: "https://www.youtube.com/@kalmkids9494",
};

export const footerContent = {
  quickLinks: [
    { label: "About", href: "#about" },
    { label: "Achievements", href: "#achievements" },
    { label: "My Book", href: "#book" },
    { label: "Videos", href: "#videos" },
    { label: "Activities", href: "#activities" },
    { label: "Contact", href: "#contact" },
  ],
  copyright: `© ${new Date().getFullYear()} Aanya Harshavat. All rights reserved.`,
};
