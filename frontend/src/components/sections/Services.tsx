import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Code } from 'lucide-react';

export function Services() {
  const services = [
    {
      number: '01',
      title: 'A.I Training & Education',
      icon: GraduationCap,
      description: 'Comprehensive training programs to help you understand and master AI technologies',
    },
    {
      number: '02',
      title: 'A.I Project Management & Consultation',
      icon: Briefcase,
      description: 'Expert guidance for your AI projects from conception to deployment',
    },
    {
      number: '03',
      title: 'A.I Development & Strategy',
      icon: Code,
      description: 'Strategic development solutions tailored to your organization\'s needs',
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empowering Jamaica through AI education, consultation, and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <Card key={service.number} className="hover:shadow-lg transition-shadow border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl font-bold text-primary/30">{service.number}</div>
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

