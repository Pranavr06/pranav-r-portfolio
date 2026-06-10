import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // Ensures sitemap updates instantly when database changes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pranavr.netlify.app';

  // Static routes
  const staticRoutes = [
    '',
    '/projects',
    '/blogs',
    '/certificates',
    '/experiences',
    '/experiences/professional-journey',
    '/experiences/technical-expertise',
    '/testimonials',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Blog Routes
    const { data: blogs } = await supabase
      .from('blogs')
      .select('slug, created_at');

    const blogRoutes = (blogs || []).map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: new Date(blog.created_at).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Dynamic Project Routes
    const { data: projects } = await supabase
      .from('projects')
      .select('slug, created_at')
      .or('is_archived.is.null,is_archived.eq.false')
      .neq('status', 'Draft');

    const projectRoutes = (projects || []).map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: project.created_at ? new Date(project.created_at).toISOString() : new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    // Dynamic Experience Routes
    const { data: experiences } = await supabase
      .from('experiences')
      .select('read_more_url, created_at')
      .not('read_more_url', 'is', null);

    const experienceRoutes = (experiences || [])
      .filter((exp) => exp.read_more_url && exp.read_more_url.startsWith('/experiences/'))
      .map((exp) => ({
        url: `${baseUrl}${exp.read_more_url}`,
        lastModified: exp.created_at ? new Date(exp.created_at).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

    return [...staticRoutes, ...blogRoutes, ...projectRoutes, ...experienceRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
