// Aanya Harshavat - Portfolio Content
// All content centralized here for easy updates

export interface SiteContent {
  name: string;
  tagline: string;
  email: string;
  linkedin?: string;
  github?: string;
}

export interface Course {
  name: string;
  type: 'AP' | 'Honors' | 'Core';
  subject: string;
}

export interface AcademicYear {
  year: string;
  semester: string;
  courses: Course[];
}

export interface AcademicJourney {
  gpa: string;
  currentYear: string;
  years: AcademicYear[];
}

export interface ResearchExperience {
  id: string;
  institution: string;
  department: string;
  projectTitle: string;
  duration: string;
  period: string;
  description: string;
  outcomes: string[];
  skills: string[];
}

export interface VolunteerOrg {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
  icon: string;
}

export interface CommunityServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  organizations: VolunteerOrg[];
}

export interface CommunityService {
  totalHours: string;
  yearsActive: string;
  categories: CommunityServiceCategory[];
}

export interface ActivityItem {
  id: string;
  name: string;
  description: string;
  period: string;
  highlight?: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  activities: ActivityItem[];
}

export interface SportsAndArts {
  categories: ActivityCategory[];
}

export interface ClubsAndLeadership {
  categories: ActivityCategory[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'accent' | 'highlight';
  size?: 'large' | 'medium' | 'small';
  link?: string;
  linkText?: string;
  academicJourney?: AcademicJourney;
  researchExperiences?: ResearchExperience[];
  communityService?: CommunityService;
  sportsAndArts?: SportsAndArts;
  clubsAndLeadership?: ClubsAndLeadership;
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
  email: "aanyaharshavat@gmail.com",
  linkedin: "",
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
    size: "small",
    link: "#book",
    linkText: "View My Book",
  },
  {
    id: "2",
    title: "Academic Excellence",
    description: "Challenging coursework while balancing extracurriculars and community service.",
    icon: "Award",
    color: "accent",
    size: "small",
    academicJourney: {
      gpa: "4.0",
      currentYear: "Sophomore",
      years: [
        {
          year: "Freshman",
          semester: "2024-2025",
          courses: [
            { name: "Honors English 9", type: "Honors", subject: "English" },
            { name: "Honors Geometry", type: "Honors", subject: "Math" },
            { name: "Honors Biology", type: "Honors", subject: "Science" },
            { name: "AP Human Geography", type: "AP", subject: "Social Studies" },
            { name: "Spanish II", type: "Core", subject: "Language" },
            { name: "Art Foundations", type: "Core", subject: "Arts" },
          ]
        },
        {
          year: "Sophomore",
          semester: "2025-2026",
          courses: [
            { name: "Honors English 10", type: "Honors", subject: "English" },
            { name: "Honors Algebra II", type: "Honors", subject: "Math" },
            { name: "Honors Chemistry", type: "Honors", subject: "Science" },
            { name: "AP World History", type: "AP", subject: "Social Studies" },
            { name: "AP Computer Science Principles", type: "AP", subject: "Technology" },
            { name: "Spanish III", type: "Core", subject: "Language" },
          ]
        },
      ]
    }
  },
  {
    id: "3",
    title: "Research Experience",
    description: "Hands-on research at top universities, exploring the intersection of psychology and technology.",
    icon: "Briefcase",
    color: "highlight",
    size: "small",
    researchExperiences: [
      {
        id: "1",
        institution: "Northwestern University",
        department: "Department of Psychology",
        projectTitle: "AI-Assisted Analysis of Adolescent Anxiety Patterns",
        duration: "6 weeks",
        period: "Summer 2025",
        description: "Contributed to a research project examining how artificial intelligence can be used to identify and analyze anxiety patterns in adolescents transitioning to new school environments. Worked alongside graduate students and faculty to review literature, assist with data organization, and explore how AI tools can support mental health research.",
        outcomes: [
          "Assisted in literature review covering 30+ peer-reviewed articles on adolescent anxiety",
          "Learned to use AI-powered text analysis tools for psychological research",
          "Contributed to preliminary findings on common anxiety triggers during school transitions",
          "Presented research summary to the lab group at the end of the program"
        ],
        skills: ["Research Methods", "Literature Review", "AI Tools", "Data Organization", "Academic Writing", "Presentation"]
      }
    ]
  },
  {
    id: "4",
    title: "Leadership & Community",
    description: "Inspiring the next generation through tutoring, volunteering, and dedicated community service.",
    icon: "Heart",
    color: "accent",
    size: "small",
    communityService: {
      totalHours: "150+",
      yearsActive: "3",
      categories: [
        {
          id: "1",
          name: "Education & Tutoring",
          icon: "GraduationCap",
          color: "blue",
          organizations: [
            {
              id: "1",
              name: "Community Tutoring Program",
              role: "Volunteer Tutor",
              period: "2023 - Present",
              description: "Providing free tutoring in math and reading to underserved elementary and middle school students, helping them build confidence and improve academic performance.",
              icon: "BookOpen"
            }
          ]
        },
        {
          id: "2",
          name: "Hunger Relief",
          icon: "Heart",
          color: "orange",
          organizations: [
            {
              id: "2",
              name: "Feed My Starving Children",
              role: "Volunteer",
              period: "2023 - Present",
              description: "Packing nutritious meals for children facing food insecurity around the world. Participated in multiple packing events with family and community groups.",
              icon: "Package"
            },
            {
              id: "3",
              name: "Local Food Pantry",
              role: "Volunteer",
              period: "2024 - Present",
              description: "Sorting donations, stocking shelves, and assisting families in need at the community food pantry.",
              icon: "ShoppingBag"
            }
          ]
        },
        {
          id: "3",
          name: "Community Outreach",
          icon: "Users",
          color: "purple",
          organizations: [
            {
              id: "4",
              name: "Library Reading Program",
              role: "Guest Reader",
              period: "2025 - Present",
              description: "Reading stories to young children at local libraries and schools, inspiring a love of reading and literacy.",
              icon: "Book"
            }
          ]
        }
      ]
    }
  },
  {
    id: "5",
    title: "Sports & Arts",
    description: "Balancing athletics and artistic pursuits with dedication and passion.",
    icon: "Trophy",
    color: "highlight",
    size: "small",
    sportsAndArts: {
      categories: [
        {
          id: "1",
          name: "Basketball",
          icon: "Trophy",
          color: "orange",
          activities: [
            {
              id: "1",
              name: "School Basketball Team",
              description: "Competitive player on the school basketball team, developing teamwork, discipline, and athletic skills.",
              period: "Grade 4 - Present",
              highlight: "6+ years"
            },
            {
              id: "2",
              name: "AAU Basketball",
              description: "Currently competing in AAU basketball, playing at a higher competitive level with elite training and tournament experience.",
              period: "Current",
              highlight: "Competitive League"
            }
          ]
        },
        {
          id: "2",
          name: "Performing Arts",
          icon: "Music",
          color: "purple",
          activities: [
            {
              id: "3",
              name: "Indian Classical Dance",
              description: "Training in traditional Indian classical dance forms, learning cultural heritage, rhythm, expression, and discipline.",
              period: "Age 5 - Present",
              highlight: "10+ years"
            }
          ]
        }
      ]
    }
  },
  {
    id: "6",
    title: "Clubs & Leadership",
    description: "Active in school organizations, competitions, and student government.",
    icon: "Users",
    color: "primary",
    size: "small",
    clubsAndLeadership: {
      categories: [
        {
          id: "1",
          name: "Student Government",
          icon: "Users",
          color: "blue",
          activities: [
            {
              id: "1",
              name: "Student Council",
              description: "Serving as an Executive Member, helping plan school events, represent student voice, and lead initiatives.",
              period: "Current",
              highlight: "Executive Member"
            }
          ]
        },
        {
          id: "2",
          name: "Competitions & Awards",
          icon: "Award",
          color: "amber",
          activities: [
            {
              id: "2",
              name: "FBLA Business Plan",
              description: "Developed and presented a comprehensive business plan, demonstrating entrepreneurship and presentation skills.",
              period: "2025",
              highlight: "3rd Place - District"
            }
          ]
        },
        {
          id: "3",
          name: "School Clubs",
          icon: "Users",
          color: "green",
          activities: [
            {
              id: "3",
              name: "Various Club Memberships",
              description: "Active member of multiple school clubs, engaging with diverse interests and building connections.",
              period: "Ongoing",
              highlight: "Multiple Clubs"
            }
          ]
        }
      ]
    }
  },
];

export const bookContent: Book = {
  title: "Annie and Froggy Make a Friend",
  description: "A heartwarming children's book about friendship, inclusion, and the magic of making new friends.",
  coverImage: "/uploads/book-cover.png",
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
    { label: "Contact", href: "#contact" },
  ],
  copyright: `© ${new Date().getFullYear()} Aanya Harshavat. All rights reserved.`,
};
