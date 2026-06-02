import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yyzucommunity.netlify.app";
  const routes = [
    "",
    "/about",
    "/activities",
    "/culture",
    "/faq",
    "/join",
    "/mentor-partnership",
    "/projects",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
