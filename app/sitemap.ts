import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slug';

export const dynamic = 'force-dynamic'; // Ensures sitemap updates instantly when database changes

// Helper to sanitize URLs so reserved XML characters like '&' don't break the XML parser
function sanitizeSitemapUrl(url: string): string {
  if (!url) return '';
  return url.trim().replace(/&/g, '%26');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pranavr.netlify.app';

  // Static core routes
  const staticRoutes = [
    '',
    '/projects',
    '/projects/college-projects',
    '/blogs',
    '/certificates',
    '/experiences',
    '/experiences/professional-journey',
    '/experiences/technical-expertise',
    '/testimonials',
    '/contact',
  ].map((route) => ({
    url: sanitizeSitemapUrl(`${baseUrl}${route}`),
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // 1. Dynamic Blog Routes
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, created_at, status')
      .neq('status', 'Draft');

    const blogRoutes = (blogs || [])
      .filter((blog) => Boolean(blog.slug))
      .map((blog) => ({
        url: sanitizeSitemapUrl(`${baseUrl}/blogs/${blog.slug}`),
        lastModified: blog.created_at ? new Date(blog.created_at).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    // 2. Dynamic Project Routes
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, created_at, category, status')
      .or('is_archived.is.null,is_archived.eq.false')
      .neq('status', 'Draft');

    const projectRoutes: MetadataRoute.Sitemap = [];
    (projects || []).forEach((project) => {
      if (!project.slug) return;
      const lastMod = project.created_at ? new Date(project.created_at).toISOString() : new Date().toISOString();
      
      // Standard project URL
      projectRoutes.push({
        url: sanitizeSitemapUrl(`${baseUrl}/projects/${project.slug}`),
        lastModified: lastMod,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });

      // College project URL if categorized accordingly
      if (project.category === 'College Projects' || project.category === 'college-projects') {
        projectRoutes.push({
          url: sanitizeSitemapUrl(`${baseUrl}/projects/college-projects/${project.slug}`),
          lastModified: lastMod,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        });
      }
    });

    // 3. Dynamic Experience Routes
    const { data: experiences } = await supabase
      .from('experiences')
      .select('read_more_url, created_at')
      .not('read_more_url', 'is', null);

    const experienceRoutes = (experiences || [])
      .filter((exp) => exp.read_more_url && exp.read_more_url.startsWith('/experiences/'))
      .map((exp) => ({
        url: sanitizeSitemapUrl(`${baseUrl}${exp.read_more_url}`),
        lastModified: exp.created_at ? new Date(exp.created_at).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    // 4. Dynamic Certificate Routes
    const { data: certificates } = await supabase
      .from('certificates')
      .select('title, slug, created_at, status, is_archived')
      .or('is_archived.is.null,is_archived.eq.false')
      .or('status.is.null,status.eq.Published');

    const certificateRoutes = (certificates || [])
      .map((cert) => {
        const certSlug = cert.slug?.trim() || slugify(cert.title);
        if (!certSlug) return null;
        return {
          url: sanitizeSitemapUrl(`${baseUrl}/certificates/${certSlug}`),
          lastModified: cert.created_at ? new Date(cert.created_at).toISOString() : new Date().toISOString(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

    // Deduplicate by URL
    const allRoutes = [
      ...staticRoutes,
      ...blogRoutes,
      ...projectRoutes,
      ...experienceRoutes,
      ...certificateRoutes,
    ];

    const uniqueMap = new Map<string, (typeof allRoutes)[0]>();
    allRoutes.forEach((route) => {
      if (!uniqueMap.has(route.url)) {
        uniqueMap.set(route.url, route);
      }
    });

    return Array.from(uniqueMap.values());
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
