import { useEffect } from 'react'
import type { Page } from '../App'
import { DEFAULT_OG_IMAGE, PAGE_SEO, SITE_NAME, SITE_URL } from '../lib/seo'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

interface Props {
  page: Page
}

// No react-helmet in the dependency tree — this hand-rolls the same
// upsert-by-key behavior directly against document.head on navigation.
export default function Seo({ page }: Props) {
  useEffect(() => {
    const seo = PAGE_SEO[page]
    const url = `${SITE_URL}${seo.path}`
    const image = `${SITE_URL}${seo.image ?? DEFAULT_OG_IMAGE}`

    document.title = seo.title
    upsertMeta('name', 'description', seo.description)
    upsertLink('canonical', url)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', seo.title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', image)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', seo.title)
    upsertMeta('name', 'twitter:description', seo.description)
    upsertMeta('name', 'twitter:image', image)
  }, [page])

  return null
}
