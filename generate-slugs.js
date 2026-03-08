#!/usr/bin/env node

/**
 * generate-slugs.js (SSG Version)
 * Génère 113 landing pages statiques SEO-friendly pour chaque ville d'IDF
 * Usage: node generate-slugs.js
 */

const fs = require('fs');
const path = require('path');

const citiesPath = path.join(__dirname, 'data', 'cities.json');
const templatePath = path.join(__dirname, 'template-city.html');
const outputDir = path.join(__dirname, 'pages-villes');

function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/['']/g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function main() {
    console.log('===========================================');
    console.log('  URGENCE SERRURES — Générateur SSG (SEO)');
    console.log('===========================================\n');

    // 1. Load Data & Template
    if (!fs.existsSync(citiesPath) || !fs.existsSync(templatePath)) {
        console.error('❌ Erreur: cities.json ou template-city.html introuvable.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
    const templateHTML = fs.readFileSync(templatePath, 'utf8');

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const allRoutes = [];
    let totalCities = 0;

    data.departments.forEach(dept => {
        console.log(`\n📍 ${dept.name} (${dept.code})`);
        console.log('─'.repeat(40));

        dept.cities.forEach(city => {
            const slug = city.slug || `serrurier-${generateSlug(city.name)}-${city.zip}`;
            const route = `/${slug}`;
            const canonicalUrl = `https://urgenceserrures.fr${route}`;
            const isParis = dept.code === '75';

            // SEO Content Generation
            const title = isParis
                ? `Serrurier ${city.name} (${city.zip}) | Dépannage Urgence 24h/24`
                : `Serrurier ${city.name} (${city.zip}) | Dépannage en 20 min`;

            const metaDesc = `Serrurier de proximité à ${city.name} (${city.zip}). Artisan serrurier agréé assurances : ouverture de porte sans dégâts, changement de cylindre A2P. Intervention rapide 24h/7j.`;
            const h1Title = `Serrurier ${city.name} (${city.zip})`;

            // Template Replacement
            let cityHTML = templateHTML
                .replace(/{{TITLE}}/g, title)
                .replace(/{{META_DESC}}/g, metaDesc)
                .replace(/{{CANONICAL}}/g, canonicalUrl)
                .replace(/{{H1_TITLE}}/g, h1Title)
                .replace(/{{JSON_AREA_SERVED}}/g, `        "${city.name}",\n        "${dept.name}",\n        "Île-de-France"`);

            // Save HTML file
            const fileName = `${slug}.html`;
            const filePath = path.join(outputDir, fileName);
            fs.writeFileSync(filePath, cityHTML, 'utf8');

            allRoutes.push({
                department: dept.code,
                departmentName: dept.name,
                city: city.name,
                zip: city.zip,
                slug: slug,
                route: route,
                file: `/pages-villes/${fileName}`,
                title: title,
                metaDescription: metaDesc
            });

            totalCities++;
            console.log(`  ✅ ${fileName}`);
        });
    });

    // 2. Write routes.json output (for reference)
    const routesOutPath = path.join(__dirname, 'data', 'routes.json');
    fs.writeFileSync(routesOutPath, JSON.stringify(allRoutes, null, 2), 'utf8');

    console.log('\n===========================================');
    console.log(`  🎉 ${totalCities} pages HTML générées dans /pages-villes/`);
    console.log('===========================================\n');

    // 3. Generate _redirects for Netlify (Rewrite 200)
    const redirectsContent = allRoutes
        .map(r => `${r.route}    ${r.file}    200`)
        .join('\n');

    const redirectsPath = path.join(__dirname, '_redirects');
    fs.writeFileSync(redirectsPath, redirectsContent + '\n', 'utf8');
    console.log(`  📄 _redirects Netlify généré (Rewrite 200)\n`);

    // 4. Generate sitemap.xml
    const baseUrl = 'https://urgenceserrures.fr';
    const today = new Date().toISOString().split('T')[0];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/zones-intervention.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
`;

    allRoutes.forEach(r => {
        sitemap += `  <url>
    <loc>${baseUrl}${r.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    sitemap += '</urlset>';

    const sitemapPath = path.join(__dirname, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log(`  📄 sitemap.xml généré (${totalCities + 2} URLs)\n`);
}

main();
