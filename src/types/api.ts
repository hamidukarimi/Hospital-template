export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
}

export interface SiteSettings {
  id: string;
  hospitalName: string;
  logo?: string | null;
  phone: string;
  emergencyPhone?: string | null;
  email: string;
  address: string;
  mapEmbedUrl?: string | null;
  sundayVisitingHours?: string | null;
  mondayFridayVisitingHours?: string | null;
  socialMedia: SocialMedia[];
}

export interface HeroSection {
  id: string;
  smallTitle?: string | null;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage?: string | null;
  secondaryImage?: string | null;
  informationCardTitle?: string | null;
  informationCardDescription?: string | null;
  isActive: boolean;
}

export interface HelpCard {
  id: string;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  color?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface HelpSection {
  id: string;
  title: string;
  isActive: boolean;
  cards: HelpCard[];
}

export interface AboutStatItem {
  icon?: string;
  value: string;
  title: string;
  description: string;
}

export interface AboutMilestoneItem {
  year: string;
  title: string;
  description: string;
}

/** Singleton institutional / About information (reusable site-wide). */
export interface About {
  id: string;
  singletonKey: string;
  smallTitle?: string | null;
  title: string;
  description: string;
  image?: string | null;
  buttonText: string;
  buttonUrl: string;
  informationImage?: string | null;
  informationTitle?: string | null;
  informationSubtitle?: string | null;
  informationLogo?: string | null;
  rating?: number | string | null;
  badgeText?: string | null;
  badgeValue?: string | null;
  heroBadge?: string | null;
  heroTitle?: string | null;
  heroTitleHighlight?: string | null;
  heroSubtitle?: string | null;
  heroButtonText?: string | null;
  heroImage?: string | null;
  heroImageCaption?: string | null;
  missionTitle?: string | null;
  missionTagline?: string | null;
  missionDescription?: string | null;
  missionButtonText?: string | null;
  visionTitle?: string | null;
  visionTagline?: string | null;
  visionDescription?: string | null;
  visionButtonText?: string | null;
  statsEyebrow?: string | null;
  statsTitle?: string | null;
  statsDescription?: string | null;
  stats?: AboutStatItem[] | null;
  milestonesEyebrow?: string | null;
  milestonesTitle?: string | null;
  milestonesDescription?: string | null;
  milestonesImage?: string | null;
  milestonesImageCaption?: string | null;
  milestones?: AboutMilestoneItem[] | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
  ctaButtonText?: string | null;
  ctaButtonUrl?: string | null;
  isActive: boolean;
}

/** @deprecated Use About — kept as alias for homepage teaser fields */
export type AboutSection = About;

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  image?: string | null;
  category?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  color?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImage?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  rating?: number | string | null;
  ratingText?: string | null;
  supportTitle?: string | null;
  supportDescription?: string | null;
  supportIcon?: string | null;
  overviewSmallTitle?: string | null;
  overviewTitle?: string | null;
  overviewDescription?: string | null;
  overviewImage?: string | null;
  overviewSecondaryTitle?: string | null;
  overviewSecondaryDescription?: string | null;
  overviewCtaText?: string | null;
  overviewCtaUrl?: string | null;
  metrics?: ServiceMetric[];
  partners?: ServicePartner[];
  isActive: boolean;
  sortOrder: number;
}

export interface ServiceMetric {
  id: string;
  label: string;
  value: number;
  suffix?: string | null;
  sortOrder: number;
  isActive: boolean;
}
export interface ServicePartner {
  id: string;
  name: string;
  logo?: string | null;
  url?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  content: string;
  name: string;
  role?: string | null;
  image?: string | null;
  rating: number;
  isActive: boolean;
  sortOrder: number;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string | null;
  linkText?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface LabTest {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  discount?: number | string | null;
  price: number | string;
  buttonText: string;
  buttonUrl: string;
  color?: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface DoctorSpecialtyItem {
  label: string;
  icon?: string | null;
  className?: string | null;
}

export interface DoctorEducationItem {
  year: string;
  title: string;
  institution: string;
}

export interface DoctorAchievementItem {
  label: string;
  icon?: string | null;
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  credentials?: string | null;
  description?: string | null;
  image?: string | null;
  profileUrl?: string | null;
  category?: string | null;
  yearsExperience?: string | null;
  patientsTreated?: string | null;
  rating?: string | null;
  overviewTitle?: string | null;
  specialties?: DoctorSpecialtyItem[] | null;
  education?: DoctorEducationItem[] | null;
  achievements?: DoctorAchievementItem[] | null;
  isActive: boolean;
  sortOrder: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string | null;
  category?: string | null;
  author: string;
  publishedAt?: string | Date | null;
  readTime?: number | null;
  slug: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FooterColumn {
  id: string;
  title: string;
  sortOrder: number;
  isActive: boolean;
  links: FooterLink[];
}

export interface FooterSettings {
  id: string;
  logo?: string | null;
  location: string;
  visitingHours?: string | null;
  phone: string;
  columns: FooterColumn[];
}
