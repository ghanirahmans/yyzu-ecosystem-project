import type { MetadataRoute } from "next";
import { source } from "@/lib/source";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yyzu.tech";
  
  const routeConfigs: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/activities", priority: 0.8, changeFrequency: "weekly" },
    { path: "/culture", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/join", priority: 0.9, changeFrequency: "weekly" },
    { path: "/mentor-partnership", priority: 0.9, changeFrequency: "weekly" },
    { path: "/projects", priority: 0.8, changeFrequency: "weekly" },
  ];

  const staticEntries = routeConfigs.map((config) => ({
    url: `${baseUrl}${config.path}`,
    lastModified: new Date(),
    changeFrequency: config.changeFrequency,
    priority: config.priority,
  }));

  // Dynamically crawl all documentation pages loaded by Fumadocs
  const docPages = source.getPages();
  const docEntries = docPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.data.lastUpdated ? new Date(page.data.lastUpdated) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...docEntries];
}
