export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/admin", "/api/admin/*"],
      },
    ],
    sitemap: "https://chaatandchill.cafe/sitemap.xml",
  };
}
