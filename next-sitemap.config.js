/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || "http://ciptamandiriperkasa.vercel.app", // Ubah dengan domain asli saat produksi
    generateRobotsTxt: true, // Generate robots.txt otomatis
    sitemapSize: 5000, // Maksimal 5000 URL per sitemap
    changefreq: "daily", // Update sitemap setiap hari
    priority: 0.7, // Prioritas indexing
    exclude: ["/admin", "/login"], // Halaman yang tidak diindeks
  };
  