'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Award,
  Users,
  Heart,
  Star,
  Lightbulb,
  Briefcase,
  Trophy,
  ChevronRight,
  LucideIcon
} from 'lucide-react';
import { achievements, AcademicJourney, ResearchExperience, CommunityService, SportsAndArts, ClubsAndLeadership } from '@/lib/content';
import { cn } from '@/lib/utils';
import AcademicJourneyModal from './AcademicJourneyModal';
import ResearchExperienceModal from './ResearchExperienceModal';
import CommunityServiceModal from './CommunityServiceModal';
import ActivitiesModal from './ActivitiesModal';

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Award,
  Users,
  Heart,
  Star,
  Lightbulb,
  Briefcase,
  Trophy,
};

const colorClasses = {
  primary: {
    bg: 'bg-gradient-to-br from-primary/10 to-purple-500/10',
    icon: 'text-primary',
    border: 'border-primary/20',
  },
  accent: {
    bg: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
    icon: 'text-pink-500',
    border: 'border-pink-500/20',
  },
  highlight: {
    bg: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
};

const sizeClasses = {
  large: 'bento-large',
  medium: 'bento-medium',
  small: 'bento-small',
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Achievements() {
  const [showAcademicModal, setShowAcademicModal] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<AcademicJourney | null>(null);
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<ResearchExperience[] | null>(null);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityService | null>(null);
  const [showSportsModal, setShowSportsModal] = useState(false);
  const [selectedSports, setSelectedSports] = useState<SportsAndArts | null>(null);
  const [showClubsModal, setShowClubsModal] = useState(false);
  const [selectedClubs, setSelectedClubs] = useState<ClubsAndLeadership | null>(null);

  const handleAcademicClick = (journey: AcademicJourney) => {
    setSelectedJourney(journey);
    setShowAcademicModal(true);
  };

  const handleResearchClick = (experiences: ResearchExperience[]) => {
    setSelectedResearch(experiences);
    setShowResearchModal(true);
  };

  const handleCommunityClick = (service: CommunityService) => {
    setSelectedCommunity(service);
    setShowCommunityModal(true);
  };

  const handleSportsClick = (sports: SportsAndArts) => {
    setSelectedSports(sports);
    setShowSportsModal(true);
  };

  const handleClubsClick = (clubs: ClubsAndLeadership) => {
    setSelectedClubs(clubs);
    setShowClubsModal(true);
  };

  return (
    <section id="achievements" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            What I've Accomplished
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
            Achievements & <span className="gradient-text">Highlights</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            A snapshot of my journey so far—from academics to leadership to making an impact.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="bento-grid"
        >
          {achievements.map((achievement) => {
            const Icon = iconMap[achievement.icon] || Star;
            const colors = colorClasses[achievement.color];
            const size = sizeClasses[achievement.size || 'small'];
            const hasAcademicJourney = !!achievement.academicJourney;
            const hasResearchExperience = !!achievement.researchExperiences?.length;
            const hasCommunityService = !!achievement.communityService;
            const hasSportsAndArts = !!achievement.sportsAndArts;
            const hasClubsAndLeadership = !!achievement.clubsAndLeadership;
            const isClickable = hasAcademicJourney || hasResearchExperience || hasCommunityService || hasSportsAndArts || hasClubsAndLeadership;

            const handleClick = () => {
              if (hasAcademicJourney) {
                handleAcademicClick(achievement.academicJourney!);
              } else if (hasResearchExperience) {
                handleResearchClick(achievement.researchExperiences!);
              } else if (hasCommunityService) {
                handleCommunityClick(achievement.communityService!);
              } else if (hasSportsAndArts) {
                handleSportsClick(achievement.sportsAndArts!);
              } else if (hasClubsAndLeadership) {
                handleClubsClick(achievement.clubsAndLeadership!);
              }
            };

            return (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                onClick={handleClick}
                className={cn(
                  'relative group rounded-2xl border p-6 md:p-8 overflow-hidden card-hover card-glow',
                  colors.bg,
                  colors.border,
                  size,
                  isClickable && 'cursor-pointer'
                )}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 opacity-10">
                  <Icon className="w-full h-full" />
                </div>

                <div className="relative z-10">
                  <motion.div
                    className={cn(
                      'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                      'bg-white dark:bg-white/10 shadow-lg',
                      colors.icon
                    )}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                  >
                    <Icon className="w-7 h-7" />
                  </motion.div>

                  <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground">
                    {achievement.title}
                  </h3>

                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {achievement.description}
                  </p>

                  {/* Link */}
                  {achievement.link && (
                    <a
                      href={achievement.link}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all"
                    >
                      <span>{achievement.linkText || 'Learn More'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}

                  {/* Clickable Card Preview */}
                  {hasAcademicJourney && (
                    <div className="mt-3 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>View Journey</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {hasResearchExperience && (
                    <div className="mt-3 flex items-center text-emerald-500 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>View Research</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {hasCommunityService && (
                    <div className="mt-3 flex items-center text-pink-500 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>View Service</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {hasSportsAndArts && (
                    <div className="mt-3 flex items-center text-emerald-500 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>View Activities</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {hasClubsAndLeadership && (
                    <div className="mt-3 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Academic Journey Modal */}
      {selectedJourney && (
        <AcademicJourneyModal
          isOpen={showAcademicModal}
          onClose={() => setShowAcademicModal(false)}
          journey={selectedJourney}
        />
      )}

      {/* Research Experience Modal */}
      {selectedResearch && (
        <ResearchExperienceModal
          isOpen={showResearchModal}
          onClose={() => setShowResearchModal(false)}
          experiences={selectedResearch}
        />
      )}

      {/* Community Service Modal */}
      {selectedCommunity && (
        <CommunityServiceModal
          isOpen={showCommunityModal}
          onClose={() => setShowCommunityModal(false)}
          service={selectedCommunity}
        />
      )}

      {/* Sports & Arts Modal */}
      {selectedSports && (
        <ActivitiesModal
          isOpen={showSportsModal}
          onClose={() => setShowSportsModal(false)}
          title="Sports & Arts"
          subtitle="Athletics and artistic pursuits"
          icon={Trophy}
          iconGradient="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
          categories={selectedSports.categories}
        />
      )}

      {/* Clubs & Leadership Modal */}
      {selectedClubs && (
        <ActivitiesModal
          isOpen={showClubsModal}
          onClose={() => setShowClubsModal(false)}
          title="Clubs & Leadership"
          subtitle="Organizations and achievements"
          icon={Users}
          iconGradient="bg-gradient-to-br from-primary via-purple-500 to-accent"
          categories={selectedClubs.categories}
        />
      )}
    </section>
  );
}
