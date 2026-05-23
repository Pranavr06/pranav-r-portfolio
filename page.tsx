import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Contact from '@/app/components/Contact'; // Adjust this path if your Contact component is located elsewhere

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: project } = await supabase.from('projects').select('title, description').eq('slug', slug).single();
  
  return {
    title: project ? `${project.title} | Pranav R` : 'Project Not Found',
    description: project?.description || 'Project details.',
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // CRITICAL: Next.js 15+ requires awaiting the params object
  const { slug } = await params;

  // Fetch the specific project from Supabase
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <>
      {/* Re-using the #blog-post ID here because your globals.css styles the 
          .blog-banner, .post-metadata, and .post-content securely under it */}
      <section id="blog-post">
        <div className="post-metadata" style={{ justifyContent: 'flex-start', maxWidth: '800px', margin: '0 auto 1rem auto' }}>
          <Link href="/projects" className="btn btn-color-2" style={{ padding: '0.5rem 1rem' }}>
            &larr; Back to Projects
          </Link>
        </div>

        <div className="blog-banner">
          <img src={project.image_url} alt={project.title} className="banner-img" />
          <h1 className="banner-title">{project.title}</h1>
        </div>

        <div className="post-metadata">
          {project.status && (
             <span className={`tag status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
               {project.status}
             </span>
          )}
        </div>

        <div className="tech-stack" style={{ marginBottom: '2rem' }}>
          {project.tech_stack?.map((tech: string, index: number) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>

        <div className="post-content">
          <ReactMarkdown>{project.content || 'No detailed content provided yet.'}</ReactMarkdown>
        </div>

      </section>

      {/* Imported Contact Component placed at the bottom */}
      <Contact />
    </>
  );
}