---
name: seo-audit
description: Perform comprehensive SEO audit on the website. Analyzes meta tags, Open Graph, structured data, accessibility, performance hints, and provides actionable optimization recommendations.
---

# SEO Audit Skill

When performing an SEO audit, thoroughly analyze the following areas:

## 1. Technical SEO
- Check for `robots.txt` file
- Check for `sitemap.xml`
- Verify canonical URLs are set
- Check for proper 404 handling
- Review URL structure (clean, readable URLs)

## 2. Meta Tags & Head Content
- Title tags (50-60 characters, unique per page)
- Meta descriptions (150-160 characters, compelling)
- Viewport meta tag for mobile
- Charset declaration
- Language attribute on html tag

## 3. Open Graph & Social Media
- og:title, og:description, og:image
- og:url, og:type, og:site_name
- Twitter Card meta tags (twitter:card, twitter:title, twitter:description, twitter:image)

## 4. Structured Data (Schema.org)
- JSON-LD implementation
- Appropriate schema types (Person, WebSite, WebPage, Article, etc.)
- Validate schema completeness

## 5. Content & Accessibility
- Proper heading hierarchy (single H1, logical H2-H6 structure)
- Alt text on all images
- Descriptive link text (avoid "click here")
- ARIA labels where needed

## 6. Performance Hints
- Image optimization (next/image usage, lazy loading)
- Font loading strategy
- Critical CSS considerations
- Script loading (defer/async)

## 7. Mobile & Responsive
- Responsive design implementation
- Touch-friendly elements
- Readable font sizes

## Output Format

Provide findings in this format:

### Current Status
Summary of what's implemented correctly.

### Issues Found
List each issue with:
- **File**: path/to/file.tsx:line
- **Issue**: Description
- **Impact**: High/Medium/Low
- **Fix**: Specific code or recommendation

### Recommendations
Prioritized list of improvements with code examples.

### Quick Wins
Easy fixes that can be done immediately.
