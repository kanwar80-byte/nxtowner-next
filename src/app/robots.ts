import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard/*", "/deal-room/*", "/api/*"],
      },
    ],
    sitemap: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`
      : "https://nxtowner.ca/sitemap.xml",
  };
}
