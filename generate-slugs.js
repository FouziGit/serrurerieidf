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

const DEBUG = process.env.DEBUG === '1';
function log(...args) { if (DEBUG) console.log(...args); }

/**
 * Generate unique SEO content block for a city landing page.
 * @param {string} cityName - Display name of the city
 * @param {string} zip - Postal code
 * @param {string} deptName - Department name
 * @param {string} deptCode - Department code (75, 77, 78, 91, 92, 93, 94, 95)
 * @returns {string} HTML content block
 */
function generateSEOContent(cityName, zip, deptName, deptCode) {
    const isParis = deptCode === '75';
    const isPC = ['92', '93', '94'].includes(deptCode); // petite couronne
    const isGC = ['77', '78', '91', '95'].includes(deptCode); // grande couronne

    const delai = isParis ? '20 minutes' : isPC ? '30 minutes' : '45 minutes';
    const zone = isParis ? `dans le ${cityName}` : `à ${cityName} (${zip})`;
    const deptLabel = isParis ? 'Paris' : `${deptName} (${deptCode})`;

    // Variantes de paragraphes pour diversifier le contenu
    const intros = [
        `<p><strong>Urgence Serrures</strong> est votre <strong>serrurier de confiance ${zone}</strong>. Disponible <strong>24h/24 et 7j/7</strong>, notre équipe d'artisans qualifiés intervient en moins de <strong>${delai}</strong> pour tous vos besoins en serrurerie : ouverture de porte claquée, remplacement de cylindre haute sécurité, blindage de porte et installation de serrures multipoints.</p>`,
        `<p>Vous cherchez un <strong>serrurier fiable et rapide ${zone}</strong> ? <strong>Urgence Serrures</strong> met à votre disposition des artisans serruriers expérimentés, disponibles <strong>24 heures sur 24</strong>. Nous intervenons en <strong>${delai}</strong> maximum pour l'ouverture de porte, le changement de serrure, le blindage et toute urgence serrurerie.</p>`,
        `<p>Besoin d'un <strong>serrurier en urgence ${zone}</strong> ? <strong>Urgence Serrures</strong> intervient <strong>7 jours sur 7</strong>, de jour comme de nuit, en moins de <strong>${delai}</strong>. Nos artisans serruriers certifiés assurent tous types de prestations : ouverture fine sans dégâts, pose de cylindres A2P, blindage de porte et remplacement de serrures multipoints.</p>`,
    ];

    const services = [
        `<p style="margin-top: 1rem;">Notre spécialité ${zone} est l'<strong>ouverture de porte sans destruction</strong>. Grâce à des techniques fines (crochetage, by-pass, décodage), nous ouvrons votre porte sans endommager la serrure ni le bâti dans plus de 95% des cas. Que vous ayez claqué votre porte, perdu vos clés ou cassé une clé dans la serrure, nous avons la solution adaptée.</p>`,
        `<p style="margin-top: 1rem;">Nous proposons ${zone} le <strong>changement de cylindre haute sécurité A2P</strong> (Assurance Prévention Protection), recommandé après un cambriolage, une perte de clés ou un emménagement. Nous installons des cylindres certifiés A2P des marques <strong>Bricard, Vachette, Mul-T-Lock et Fichet</strong>, avec 3 niveaux de résistance : A2P* (5 min), A2P** (10 min) et A2P*** (15 min).</p>`,
        `<p style="margin-top: 1rem;">Pour renforcer la sécurité de votre domicile ${zone}, nous réalisons le <strong>blindage de porte</strong> : pose d'une tôle en acier sur votre porte existante avec serrure multipoints certifiée. Cette solution offre un excellent rapport sécurité-prix sans remplacer votre porte. Nous installons également des <strong>portes blindées certifiées A2P BP</strong> (bloc-porte complet avec huisserie renforcée).</p>`,
    ];

    const geoBlocks = [];
    if (isParis) {
        geoBlocks.push(`<p style="margin-top: 1rem;">Situés à Paris, nos serruriers connaissent parfaitement <strong>le ${cityName}</strong> et ses spécificités : immeubles haussmanniens, portes anciennes, serrures de copropriété. Nous intervenons aussi bien chez les particuliers que dans les commerces et bureaux de l'arrondissement. Notre proximité garantit un <strong>temps d'intervention parmi les plus rapides de Paris</strong>.</p>`);
    } else if (isPC) {
        geoBlocks.push(`<p style="margin-top: 1rem;">Nos artisans serruriers interviennent régulièrement <strong>${zone}</strong> et dans l'ensemble du département des <strong>${deptLabel}</strong>. Nous connaissons les particularités du parc immobilier local — résidences, pavillons, immeubles récents — et adaptons nos interventions en conséquence. Grâce à notre implantation en Île-de-France, nous garantissons un <strong>déplacement rapide en ${delai}</strong>.</p>`);
    } else {
        geoBlocks.push(`<p style="margin-top: 1rem;">Même en grande couronne, <strong>Urgence Serrures</strong> assure un service réactif <strong>${zone}</strong> et dans tout le département ${deptLabel}. Nos équipes mobiles couvrent l'intégralité du secteur et arrivent sur place en <strong>${delai} maximum</strong>. Pavillons, résidences, locaux professionnels : nous intervenons sur tous types de bâtiments.</p>`);
    }

    geoBlocks.push(`<p style="margin-top: 1rem;">En tant qu'<strong>artisan serrurier agréé assurances</strong>, nous fournissons systématiquement une <strong>facture détaillée conforme</strong> aux exigences des compagnies d'assurances pour faciliter votre remboursement. Devis gratuit, tarifs transparents annoncés avant intervention et garantie décennale sur tous nos travaux ${zone}.</p>`);

    // Sélection basée sur un hash simple du nom de ville pour varier le contenu
    const hash = cityName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const intro = intros[hash % intros.length];
    const service = services[hash % services.length];

    return intro + service + geoBlocks.join('');
}

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
    log('===========================================');
    log('  URGENCE SERRURES — Générateur SSG (SEO)');
    log('===========================================\n');

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
        log(`\n📍 ${dept.name} (${dept.code})`);
        log('─'.repeat(40));

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
                .replace(/{{JSON_AREA_SERVED}}/g, '')
                .replace(/{{CITY_NAME}}/g, city.name)
                .replace(/{{DEPT_NAME}}/g, dept.name)
                .replace(/{{SEO_CONTENT}}/g, generateSEOContent(city.name, city.zip, dept.name, dept.code));

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
            log(`  ✅ ${fileName}`);
        });
    });

    // 2. Write routes.json output (for reference)
    const routesOutPath = path.join(__dirname, 'data', 'routes.json');
    fs.writeFileSync(routesOutPath, JSON.stringify(allRoutes, null, 2), 'utf8');

    log('\n===========================================');
    log(`  🎉 ${totalCities} pages HTML générées dans /pages-villes/`);
    log('===========================================\n');

    // 3. Generate _redirects for Netlify (Rewrite 200)
    const redirectsContent = allRoutes
        .map(r => `${r.route}    ${r.file}    200`)
        .join('\n');

    const redirectsPath = path.join(__dirname, '_redirects');
    fs.writeFileSync(redirectsPath, redirectsContent + '\n', 'utf8');
    log('  📄 _redirects Netlify généré (Rewrite 200)\n');

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
  <url>
    <loc>${baseUrl}/mentions-legales.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/politique-de-confidentialite.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
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
    log(`  📄 sitemap.xml généré (${totalCities + 2} URLs)\n`);
}

main();
