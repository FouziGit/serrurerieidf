# Full SEO Audit Report: vitriersparis.fr

**Date:** 2026-03-10
**Business Type:** Local Service Business (Glazier / Vitrier)
**Location:** Paris & Ile-de-France
**Platform:** Astro Static Site on Netlify CDN
**Pages Crawled:** 11

---

## SEO Health Score: 58/100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 25% | 62/100 | 15.5 |
| Content Quality | 25% | 52/100 | 13.0 |
| On-Page SEO | 20% | 65/100 | 13.0 |
| Schema / Structured Data | 10% | 70/100 | 7.0 |
| Performance (CWV) | 10% | 90/100 | 9.0 |
| Images | 5% | 55/100 | 2.75 |
| AI Search Readiness | 5% | 55/100 | 2.75 |
| **Total** | **100%** | | **63/100** |

---

## Executive Summary

### Top 5 Critical Issues

1. **Address mismatch (NAP inconsistency)** -- Schema says "12 Rue de la Verrerie, 75004" while footer shows "75 Rue de Lourmel, 75015". Destroys local SEO trust signals.
2. **404 page is indexable** -- Returns `index, follow` meta robots and has a canonical tag. Google may index `/404` as a real page.
3. **Sitemap URLs all 301-redirect** -- All 10 non-homepage URLs lack trailing slashes, causing unnecessary redirects on every crawl.
4. **Zero customer reviews/testimonials** -- No social proof anywhere on the site. No AggregateRating schema.
5. **No blog or editorial content** -- Zero informational search intent coverage. Missing "how-to" and "cost guide" content.

### Top 5 Quick Wins

1. **Add trailing slashes** to sitemap URLs and canonical tags (align with Netlify's served URLs)
2. **Add `noindex` to 404 page** and remove its canonical tag
3. **Unify the business address** across schema, footer, and all references
4. **Add `<link rel="preload">` for hero image** -- estimated 200-500ms LCP improvement
5. **Update stale `lastmod` dates** in sitemap (currently showing 2025-03-08)

---

## 1. Technical SEO (Score: 62/100)

### Crawlability

| Check | Status |
|-------|--------|
| robots.txt accessible | PASS |
| Disallow /api/ | PASS |
| AI crawler directives (GPTBot, ClaudeBot, etc.) | PASS -- explicitly allowed |
| Sitemap declared in robots.txt | PASS |
| Sitemap accessible | PASS |

### Indexability Issues

| Severity | Issue | Impact |
|----------|-------|--------|
| CRITICAL | 404 page has `meta robots: index, follow` and canonical tag | Google may index `/404` as a page |
| HIGH | Canonical tags use no trailing slash, but Netlify serves with trailing slash (301 redirect) | Search engines confused about preferred URL |
| MEDIUM | Homepage canonical uses trailing slash but sub-pages do not | Inconsistent convention |

### Security Headers

| Header | Status |
|--------|--------|
| HTTPS enforced | PASS |
| HSTS (1 year) | PASS |
| X-Content-Type-Options: nosniff | PASS |
| X-Frame-Options: SAMEORIGIN | PASS |
| Referrer-Policy | PASS |
| Content-Security-Policy | FAIL -- header rule targets `/*.html` but Netlify serves without `.html` extension |
| Permissions-Policy | FAIL -- same root cause as CSP |

### URL Structure

| Severity | Issue |
|----------|-------|
| HIGH | All internal links lack trailing slashes, causing 301 redirects on every navigation |
| MEDIUM | `netlify.toml` header rules for `/*.html` don't match actual URL patterns |

### Mobile Optimization

| Check | Status |
|-------|--------|
| Viewport meta tag | PASS |
| Responsive CSS (Tailwind) | PASS |
| Touch targets | PASS |
| Mobile menu | PASS |
| Skip-to-content link | PASS |

---

## 2. Content Quality (Score: 52/100)

### E-E-A-T Assessment (Composite: 40.5/100)

| Factor | Score | Key Finding |
|--------|-------|-------------|
| Experience | 35/100 | Claims "15+ years" but zero proof: no project gallery, no original photos, all Unsplash stock |
| Expertise | 55/100 | Good technical terminology (Ug values, EN 356, RT 2020) but no named team or certifications |
| Authoritativeness | 25/100 | Zero external validation: no Google reviews, no social profiles, no trade associations |
| Trustworthiness | 45/100 | Address mismatch is a critical red flag; legal pages present but SIRET not visible |

### Thin Content Detection

| Page | Words | Min Required | Status |
|------|-------|-------------|--------|
| Homepage | 993 | 500 | PASS |
| /services | 293 | 800 | FAIL |
| /services/vitrerie-double-vitrage | 776 | 800 | MARGINAL |
| /services/miroiterie-verre-decoratif | 770 | 800 | MARGINAL |
| /services/depannage-urgence-vitrage | 696 | 800 | FAIL |
| /services/vitrerie-commerciale | 684 | 800 | FAIL |
| /services/fenetres-menuiseries | 684 | 800 | FAIL |
| /entreprises | 461 | 800 | FAIL |
| /qui-sommes-nous | 481 | 500 | MARGINAL |

**5 of 9 pages fail minimum word count thresholds.**

### Duplicate Content Issues

- Meta descriptions are unique per page (verified on live site)
- Service pages follow identical template structure with repeated CTA/cross-link blocks
- Footer tagline has spelling error: "tranquilite" should be "tranquillite"

### Missing Content Types

| Content Type | Priority | Status |
|-------------|----------|--------|
| Blog / Guides | CRITICAL | Missing |
| Customer Reviews / Testimonials | CRITICAL | Missing |
| Project Portfolio / Gallery | HIGH | Missing |
| Location/arrondissement pages | HIGH | Missing |
| Pricing guide | HIGH | Missing |
| Google Maps embed | MEDIUM | Missing |
| Team credentials | MEDIUM | Missing |
| Video content | MEDIUM | Missing |

---

## 3. On-Page SEO (Score: 65/100)

### Title Tags

| Page | Title | Length | Quality |
|------|-------|--------|---------|
| Homepage | "Vitrier Paris \| Vitrerie & Depannage Vitrage 24h/24" | 52 chars | Good |
| Services | "Services de vitrerie Paris & IDF \| Vitriers Paris - Artisan Francilien IDF" | 75 chars | Too long |
| Entreprises | "Vitrerie professionnelle entreprises IDF \| Vitriers Paris - Artisan Francilien IDF" | 83 chars | Too long |
| Qui sommes-nous | "Qui sommes-nous \| Vitriers Paris & IDF - Artisan Francilien IDF" | 64 chars | OK |
| Service pages | "[Category] \| Vitriers Paris - Artisan Francilien IDF" | ~55 chars | Good |

### Heading Structure

- All pages have unique H1 tags -- PASS
- Correct H1 > H2 > H3 hierarchy on all pages -- PASS
- No multiple H1 tags detected -- PASS

### Internal Linking

| Severity | Issue |
|----------|-------|
| MEDIUM | No cross-links between service sub-pages (sibling linking missing) |
| LOW | Legal pages only linked from footer (expected) |

---

## 4. Schema / Structured Data (Score: 70/100)

### Current Implementation

| Schema Type | Status | Pages |
|-------------|--------|-------|
| LocalBusiness + HomeAndConstructionBusiness | Present | All |
| WebSite | Present | All |
| BreadcrumbList | Present | Sub-pages |
| Service (5 categories) | Present | Service pages |
| FAQPage (8 Q&As) | Present | Homepage |

### Validation Issues

| Severity | Issue |
|----------|-------|
| CRITICAL | Address mismatch between schema and footer |
| MEDIUM | Empty `sameAs: []` array |
| MEDIUM | GeoCoordinates are generic Paris center, not actual business address |
| LOW | `alternateName` duplicates `name` |
| LOW | `priceRange: "EUR"` is wrong format (should be "$$" or price range) |

### Missing Schema Opportunities

| Schema | Priority |
|--------|----------|
| AggregateRating / Review | HIGH |
| `@id` for cross-page entity resolution | MEDIUM |
| `hasMap` property | LOW |
| Individual Review objects | HIGH |

---

## 5. Performance / Core Web Vitals (Score: 90/100)

### Measured Metrics

| Metric | Value | Rating |
|--------|-------|--------|
| TTFB | ~52ms | Excellent |
| Estimated LCP | 1.4-2.2s | Good |
| Estimated INP | <50ms | Excellent |
| Estimated CLS | <0.05 | Good |
| DOM elements | 506 | Good |
| External scripts | 1 (gtag.js) | Excellent |

### Core Web Vitals Pass/Fail

| Metric | Threshold | Estimated p75 | Status |
|--------|-----------|---------------|--------|
| LCP | <=2.5s | ~1.8s | PASS |
| INP | <=200ms | ~40ms | PASS |
| CLS | <=0.1 | ~0.03 | PASS |

### Performance Recommendations

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Add `<link rel="preload">` for hero image | -200 to -500ms LCP |
| 2 | Move CSS `<link>` before LD+JSON in `<head>` | -50 to -100ms LCP |
| 3 | Reduce Inter font weights from 6 to 3 | -60-90KB transfer |
| 4 | Reduce hero 1920w quality to q=70 or add AVIF | -100 to -300ms desktop |
| 5 | Delay gtag.js until after `load` event | Minor bandwidth relief |

---

## 6. Images (Score: 55/100)

| Check | Status |
|-------|--------|
| WebP format | PASS -- all images use `fm=webp` |
| Responsive srcset/sizes | PASS -- hero and content images |
| Lazy loading (below fold) | PASS |
| fetchpriority="high" on LCP image | PASS |
| Preconnect to image CDN | PASS |
| Alt text on images | PARTIAL -- service images have descriptive alt, logo lacks explicit alt |

| Severity | Issue |
|----------|-------|
| HIGH | 100% stock photography from Unsplash -- no original work photos |
| MEDIUM | All images served from third-party CDN (cross-origin overhead) |
| MEDIUM | Hero image 1920w is 484KB -- heavy for desktop |
| LOW | Logo SVG lacks width/height HTML attributes |

---

## 7. AI Search Readiness (Score: 55/100)

| Factor | Score |
|--------|-------|
| Schema.org implementation | 80/100 |
| llms.txt | 0/100 (returns 404) |
| Quotable facts | 60/100 |
| Content hierarchy | 70/100 |
| Named entity clarity | 40/100 |
| FAQ content | 65/100 |
| Unique factual claims | 50/100 |

### Missing for AI Citation

- No "How much does X cost in Paris?" content with specific price ranges
- No comparison content (double vs triple vitrage)
- No procedural content (emergency steps)
- No structured pricing tables
- No unique data or statistics
- FAQPage schema won't generate rich results (restricted since Aug 2023) but still useful for AI extraction

---

## 8. Sitemap Analysis

### Current State

- 11 URLs, valid XML format
- All non-homepage URLs return 301 (missing trailing slashes)
- `lastmod` dates are stale (2025-03-08)
- `priority` and `changefreq` tags present but ignored by Google

### Recommended Fixes

1. Add trailing slashes to all `<loc>` URLs
2. Update `lastmod` to actual modification dates
3. Remove deprecated `priority` and `changefreq` tags
4. Add missing pages (contact, FAQ, zones) when created

---

## Competitor Positioning Notes

For "vitrier Paris" and related queries, this site needs:
- **Content depth** to compete with established glaziers who have blogs, guides, and case studies
- **Social proof** (reviews, testimonials) to build trust
- **Location pages** for arrondissement-level targeting
- **Original photography** to demonstrate real expertise
- **External authority signals** (Google Business Profile, social profiles, directory listings)
