import { MetadataRoute } from 'next'
import { getPosts } from '@/lib/posts'

export const dynamic = 'force-static'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://v-papageorgiou.github.io';
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cv.pdf`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getPosts({ includeDrafts: false }).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
