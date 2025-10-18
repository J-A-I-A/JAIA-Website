import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, Code2, Users, Lightbulb, BookOpen } from 'lucide-react';

export function OpenSource() {
  const features = [
    {
      icon: Code2,
      title: 'Explore the Code',
      description: 'Browse our modern React + TypeScript codebase and see how we build with Vite, Tailwind CSS, and more.',
    },
    {
      icon: Lightbulb,
      title: 'Share Your Ideas',
      description: 'Have suggestions for features or improvements? Open an issue or start a discussion on GitHub.',
    },
    {
      icon: Users,
      title: 'Contribute',
      description: 'Whether fixing bugs, improving docs, or adding features - all contributions are welcome!',
    },
    {
      icon: BookOpen,
      title: 'Learn & Grow',
      description: 'Use our codebase as a learning resource. We have guides for beginners and detailed documentation.',
    },
  ];

  return (
    <section id="opensource" className="py-20 bg-gradient-to-br from-green-50/50 via-white to-yellow-50/50 dark:from-gray-900 dark:via-background dark:to-green-950/30 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium mb-4 border border-primary/20">
            <Github className="h-4 w-4" />
            Open Source
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built in the Open, Together
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            This website is fully open source! We believe in transparency and community-driven development. 
            Review our code, suggest improvements, and help us build something amazing for Jamaica's AI community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-primary/10 bg-white/50 dark:bg-gray-900/50">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center mb-3">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Contribute?</CardTitle>
              <CardDescription className="text-base">
                Check out our GitHub repository to explore the code, report issues, or contribute to the project.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-base px-6"
                onClick={() => window.open('https://github.com/J-A-I-A/JAIA-Website', '_blank')}
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base px-6"
                onClick={() => window.open('https://github.com/J-A-I-A/JAIA-Website/issues', '_blank')}
              >
                <Lightbulb className="mr-2 h-5 w-5" />
                Share Ideas
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>New to coding?</strong> Our repository includes beginner-friendly guides to help you get started. 
              Check out our <a 
                href="https://github.com/J-A-I-A/JAIA-Website/blob/main/docs/getting-started.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Getting Started Guide
              </a> and learn as you contribute!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

