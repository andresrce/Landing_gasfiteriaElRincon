export default function handler(req, res) {

  const baseUrl = "https://www.gasfiteriaelrincon.cl"

  const pages = [
    "",
    "/servicios/agua-y-tuberias.html",
    "/servicios/agua-caliente.html",
    "/servicios/bano-cocina-artefactos.html",
    "/servicios/servicios-tecnicos-emergencias.html"
  ]

  const urls = pages.map(page => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join("")

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`

  res.setHeader("Content-Type", "text/xml")
  res.status(200).send(sitemap)
}