import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/browse",
    "/how-it-works",
    "/about",
    "/faq",
    "/contact",
    "/pricing",
    "/partners",
    "/valuation",
    "/legal/terms",
    "/legal/privacy",
  ];
  const lastModified = new Date().toISOString();
  return staticRoutes.map((url) => ({ url, lastModified }));
}
