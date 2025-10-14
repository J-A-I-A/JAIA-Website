import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/sections/Footer';
import { projects } from '@/data/projects';

export function ProjectTemplate() {
  const { projectId } = useParams<{ projectId: string }>();
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        // Dynamically import markdown file as text
        const markdownModule = await import(`../data/projects/${projectId}.md?raw`);
        setMarkdown(markdownModule.default);
      } catch (error) {
        console.error('Error loading markdown:', error);
        setMarkdown('# Project Not Found\n\nSorry, we couldn\'t load this project.');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadMarkdown();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b border-primary/10 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-6">
          <Link to="/projects">
            <Button variant="ghost" className="mb-4 hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          {project && (
            <div className="flex items-center gap-4 mb-2">
              <span className="text-6xl">{project.icon}</span>
              <div>
                <h1 className="text-4xl font-bold">{project.title}</h1>
                <p className="text-muted-foreground mt-2">{project.description}</p>
                <div className="flex gap-2 mt-3">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Markdown content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-4xl font-bold mb-6 mt-8 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-bold mb-4 mt-8">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-semibold mb-3 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed text-foreground/90">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground/90">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                    {children}
                  </code>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-8 border-border" />,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}

