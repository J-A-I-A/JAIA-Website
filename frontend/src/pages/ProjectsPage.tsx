import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import { Footer } from '@/components/sections/Footer';
import { projects } from '@/data/projects';

export function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-primary/10 bg-gradient-to-br from-yellow-50 via-white to-green-50 dark:from-gray-900 dark:via-background dark:to-green-950">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover our innovative AI projects designed to solve real-world problems 
              and empower Jamaican communities through technology.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col border-primary/10 hover:border-primary/30"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-6xl">{project.icon}</span>
                  <div className="flex items-center text-sm font-medium text-primary">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.date}
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/projects/${project.id}`}>
                  <Button className="w-full">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="border-t border-primary/10 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Collaborate?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for partners, researchers, and contributors 
            to help us build AI solutions for Jamaica.
          </p>
          <Link to="/#contact">
            <Button size="lg">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

