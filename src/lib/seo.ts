import type { Page } from '../App'

export const SITE_URL = 'https://biggestlittlemedia.com'
export const SITE_NAME = 'Biggest Little Media'
export const DEFAULT_OG_IMAGE = '/og-logo.png'

export interface PageSeo {
  path: string
  title: string
  description: string
  image?: string
}

export const PAGE_SEO: Record<Page, PageSeo> = {
  home: {
    path: '/',
    title: 'Biggest Little Media | Social Media Strategy & Brand Consulting in Reno, NV',
    description:
      "Reno-vate your brand with a personalized online presence. Biggest Little Media helps Reno, NV small businesses grow through social media management, content creation, and brand strategy.",
  },
  about: {
    path: '/about',
    title: 'About Bianka Patel | Biggest Little Media',
    description:
      'Meet Bianka Patel, social media strategist & brand consultant helping Reno-area small businesses build an authentic, strategy-first digital presence.',
    image: '/AboutMe1.jpeg',
  },
  portfolio: {
    path: '/portfolio',
    title: 'Portfolio | Biggest Little Media',
    description:
      'Featured social media content, short-form video, and creative direction from Biggest Little Media. Now accepting new clients in Reno, NV.',
  },
  services: {
    path: '/services',
    title: 'Services & Pricing | Biggest Little Media',
    description:
      'Social media management, marketing strategy, brand consulting, content creation, and website audits for Reno, NV small businesses. View packages & pricing.',
  },
  contact: {
    path: '/contact',
    title: 'Contact | Biggest Little Media',
    description:
      'Book a free discovery call with Biggest Little Media to talk social media strategy and brand consulting for your Reno, NV business.',
  },
}
