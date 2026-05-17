# SEO Action Plan: vitriersparis.fr

**Generated:** 2026-03-10
**Current Score:** 63/100
**Target Score:** 80+/100

---

## Critical Priority (Fix Immediately)

### C1. Fix NAP (Name, Address, Phone) Inconsistency
- **Issue:** Schema shows "12 Rue de la Verrerie, 75004 Paris" while footer shows "75 Rue de Lourmel, 75015 Paris"
- **Impact:** Destroys local SEO trust. Google may distrust all business information
- **Action:** Unify to one correct address across schema JSON-LD, footer HTML, and Google Business Profile
- **Files:** All page templates (schema + footer sections)
- **Effort:** 30 minutes

### C2. Make 404 Page Non-Indexable
- **Issue:** 404 page has `<meta name="robots" content="index, follow">` and `<link rel="canonical" href="...404">`
- **Impact:** Google may index `/404` as a real page
- **Action:** Add `<meta name="robots" content="noindex">`, remove canonical tag
- **Files:** 404 page template
- **Effort:** 10 minutes

### C3. Fix Sitemap Trailing Slash Mismatch
- **Issue:** All 10 non-homepage URLs lack trailing slashes, causing 301 redirects
- **Impact:** Wastes crawl budget, signals URL inconsistency to Google
- **Action:** Add trailing slashes to all `<loc>` URLs in `sitemap.xml`
- **Files:** `sitemap.xml`
- **Effort:** 15 minutes

### C4. Fix Canonical Tag Mismatch
- **Issue:** Canonical tags point to non-trailing-slash URLs that 301-redirect
- **Impact:** Search engines confused about preferred URL version
- **Action:** Update all `<link rel="canonical">` to include trailing slashes
- **Files:** All page templates
- **Effort:** 30 minutes

---

## High Priority (Fix Within 1 Week)

### H1. Add Trailing Slashes to All Internal Links
- **Issue:** All `href` attributes use non-trailing-slash format, causing 301 redirects
- **Action:** Add trailing slashes to all internal navigation, footer, and content links
- **Files:** All page templates (nav, footer, content links)
- **Effort:** 1 hour

### H2. Fix Security Headers (CSP + Permissions-Policy)
- **Issue:** `netlify.toml` header rules target `/*.html` but Netlify serves without `.html`
- **Action:** Change `for = "/*.html"` to `for = "/*"` in `netlify.toml`
- **Action:** Update CSP to include `images.unsplash.com` and `googletagmanager.com`
- **Files:** `netlify.toml`
- **Effort:** 30 minutes

### H3. Update Sitemap Lastmod Dates
- **Issue:** All dates show 2025-03-08 (stale by over a year)
- **Action:** Update to actual modification dates; automate via build script
- **Files:** `sitemap.xml`
- **Effort:** 15 minutes

### H4. Add Hero Image Preload
- **Issue:** Browser discovers hero image late (after parsing 18KB of LD+JSON + CSS)
- **Action:** Add `<link rel="preload" as="image" ...>` with `imagesrcset` in `<head>`
- **Impact:** -200 to -500ms LCP improvement
- **Files:** Layout template `<head>`
- **Effort:** 15 minutes

### H5. Add Customer Reviews / Testimonials
- **Issue:** Zero social proof on the entire site
- **Action:** Add a testimonials section to homepage with real client quotes
- **Action:** Add AggregateRating schema to LocalBusiness JSON-LD
- **Action:** If Google reviews exist, embed review widget
- **Effort:** 2-4 hours

### H6. Populate `sameAs` or Remove Empty Array
- **Issue:** `"sameAs": []` in schema provides no value
- **Action:** Add Google Business Profile, social media URLs, or remove the property
- **Files:** Schema JSON-LD on all pages
- **Effort:** 15 minutes

---

## Medium Priority (Fix Within 1 Month)

### M1. Expand Thin Content Pages
- **Issue:** 5 of 9 content pages below minimum word count
- **Action:** Add 300-500 words of unique content to each thin page:
  - `/services` (293 words) -- add service overview, process description
  - `/depannage-urgence-vitrage` (696 words) -- add emergency checklist, what-to-do guide
  - `/vitrerie-commerciale` (684 words) -- add case study examples, industry specifics
  - `/fenetres-menuiseries` (684 words) -- add material comparison, energy ratings
  - `/entreprises` (461 words) -- add B2B benefits, contract details
- **Effort:** 4-8 hours

### M2. Add Cross-Links Between Service Pages
- **Issue:** No sibling links between service sub-pages
- **Action:** Add "Related services" section to each service detail page
- **Effort:** 1-2 hours

### M3. Create Blog / Guides Section
- **Issue:** Zero informational content; missing "how-to" and "cost guide" queries
- **Priority articles:**
  - "Prix vitrier Paris : tarifs 2026 et guide complet"
  - "Comment choisir entre double et triple vitrage"
  - "Vitre cassee : que faire en urgence ?"
  - "Guide du remplacement de fenetre a Paris"
- **Effort:** 2-4 hours per article

### M4. Add FAQ Sections to Service Pages
- **Issue:** FAQ schema only on homepage; service pages lack Q&A content
- **Action:** Add 3-5 relevant FAQs to each service page
- **Effort:** 2-3 hours

### M5. Replace Stock Photos with Original Photography
- **Issue:** 100% Unsplash stock photos -- negative E-E-A-T signal
- **Action:** Take photos of actual glazing work, team, completed projects
- **Effort:** Variable (requires photo shoot)

### M6. Fix GeoCoordinates in Schema
- **Issue:** Coordinates point to generic Paris center (48.8566, 2.3522)
- **Action:** Update to actual business address coordinates
- **Files:** Schema JSON-LD on all pages
- **Effort:** 10 minutes

### M7. Move CSS `<link>` Before LD+JSON in `<head>`
- **Issue:** CSS stylesheet discovered after 18KB of JSON-LD blocks
- **Action:** Reorder `<head>` elements: meta > preconnect > preload > CSS > LD+JSON
- **Impact:** -50 to -100ms LCP improvement
- **Effort:** 30 minutes

### M8. Reduce Font Weights
- **Issue:** Loading 6 Inter font weights (400-900); most likely unused
- **Action:** Audit CSS usage; reduce to 3 weights (400, 600, 700)
- **Impact:** -60-90KB transfer size
- **Effort:** 15 minutes

### M9. Self-Host Hero Images
- **Issue:** Cross-origin overhead from images.unsplash.com
- **Action:** Download, optimize, and self-host hero/service images
- **Impact:** Eliminates DNS+TLS overhead for LCP image
- **Effort:** 1-2 hours

### M10. Add Google Maps Embed
- **Issue:** No map on any page despite physical address
- **Action:** Add embedded map to About or Contact page
- **Effort:** 30 minutes

---

## Low Priority (Backlog)

### L1. Fix Footer Spelling
- **Issue:** "tranquilite" should be "tranquillite" (appears on every page)
- **Effort:** 5 minutes

### L2. Add HSTS `includeSubDomains`
- **Issue:** Current HSTS header lacks `includeSubDomains` directive
- **Effort:** 5 minutes

### L3. Remove Deprecated Sitemap Tags
- **Issue:** `priority` and `changefreq` ignored by Google since 2009
- **Action:** Remove from sitemap.xml
- **Effort:** 10 minutes

### L4. Fix `alternateName` in Schema
- **Issue:** Duplicates `name` value -- adds no signal
- **Action:** Set genuine alternate name or remove property
- **Effort:** 5 minutes

### L5. Fix `priceRange` in Schema
- **Issue:** Set to "EUR" (currency code) instead of a price range
- **Action:** Change to "60-2000 EUR" or remove (deprecated by Google)
- **Effort:** 5 minutes

### L6. Add Logo Width/Height Attributes
- **Issue:** Logo `<img>` uses CSS classes but no HTML dimensions (minor CLS risk)
- **Effort:** 5 minutes

### L7. Add llms.txt
- **Issue:** Returns 404 -- needed for AI search engine crawlers
- **Action:** Create `/llms.txt` with business info, services, contact details
- **Effort:** 30 minutes

### L8. Create Location Pages (Future)
- **Issue:** No arrondissement or city-level pages for local targeting
- **Action:** Plan and create location-specific content (requires unique content per page)
- **Effort:** Large project (1-2 days)

### L9. Add `@id` to Schema Blocks
- **Issue:** No entity resolution across pages
- **Action:** Add `"@id": "https://vitriersparis.fr/#business"` to LocalBusiness block
- **Effort:** 10 minutes

### L10. Delay gtag.js Loading
- **Issue:** Analytics script competes for bandwidth during initial page load
- **Action:** Load gtag.js after `window.load` event
- **Effort:** 15 minutes

---

## Implementation Timeline

| Week | Actions | Expected Score Change |
|------|---------|----------------------|
| Week 1 | C1-C4, H1-H4, H6 | 63 -> 72 |
| Week 2 | H5, M1 (partial), M2, M4 | 72 -> 76 |
| Week 3-4 | M1 (complete), M3 (first 2 articles), M5-M10 | 76 -> 82 |
| Month 2+ | L1-L10, M3 (ongoing blog), L8 (location pages) | 82 -> 85+ |

---

## Key Metrics to Track

1. **Google Search Console:** Impressions, clicks, CTR for "vitrier paris" queries
2. **Core Web Vitals:** LCP, INP, CLS in CrUX report
3. **Crawl Stats:** Crawl budget efficiency (reduce 301 redirects to zero)
4. **Local Pack:** Ranking position for "vitrier + [arrondissement]" queries
5. **Content Index:** Number of indexed pages (currently 11, target 20+)
