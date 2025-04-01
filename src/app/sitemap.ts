import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://haligtree.camburgaler.com",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: "https://haligtree.camburgaler.com/class",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.8,
        },
        {
            url: "https://haligtree.camburgaler.com/armor",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://haligtree.camburgaler.com/weapons",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: "https://haligtree.camburgaler.com/about",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.5,
        },
        {
            url: "https://haligtree.camburgaler.com/_not-found",
            lastModified: new Date(),
            changeFrequency: "never",
            priority: 0.3,
        },
    ];
}
