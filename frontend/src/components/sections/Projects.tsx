import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/data/projects';

export function Projects() {
  // Show only first 4 projects on homepage
  const featuredProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">See Our Latest Projects</h2>
          <p className="text-muted-foreground">New and ongoing projects and more</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featuredProjects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full border-primary/10 hover:border-primary/30">
                <CardHeader>
                  <div className="text-6xl mb-4 text-center">{project.icon}</div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/projects">
            <Button variant="outline" size="lg" className="border-primary hover:bg-primary/10">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

