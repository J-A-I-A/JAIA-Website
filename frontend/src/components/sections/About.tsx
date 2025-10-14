import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';

export function About() {
  const testimonials = [
    {
      text: 'JAIA provided me with the opportunity to showcase my skills and knowledge at a workshop, which gave me valuable exposure. They also gave me the chance to work on exciting AI projects, helping me grow both professionally and personally.',
      author: 'Kevonteh Brown',
      role: 'Member',
      initials: 'KB',
    },
    {
      text: 'The Law Bot gave me a deeper understanding of Jamaican laws and provided quick, easy access to legal information, saving me valuable time.',
      author: 'Mickayla',
      role: 'Law Student',
      initials: 'M',
    },
  ];

  return (
    <section id="about" className="py-20 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our community and be a part of the ever-growing world of A.I where you can learn and create.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-primary/10">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {testimonial.initials}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </div>
                  <Quote className="h-6 w-6 text-primary/30" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

