import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Linkedin } from 'lucide-react';

export function Team() {
  const team = [
    { 
      name: 'Matthew Stone', 
      role: 'President and Founder',
      linkedin: 'https://www.linkedin.com/in/matthewstone095/',
      image: '/team/matthew-stone.jpg'
    },
    { 
      name: 'Zo Duncan', 
      role: 'Secretary',
      linkedin: 'https://www.linkedin.com/in/zoe-duncan-67ba26215/',
      image: '/team/zo-duncan.jpg'
    },
    { 
      name: 'Jordan Madden', 
      role: 'Director of Research',
      linkedin: 'https://www.linkedin.com/in/jordan~madden/',
      image: '/team/jordan-madden.jpg'
    },
    { 
      name: 'Dimitri Johnson', 
      role: 'Technical Director',
      linkedin: 'https://www.linkedin.com/in/dimitri-johnson-095b62217/',
      image: '/team/dimitri-johnson.jpg'
    },
    { 
      name: 'Daniel Geddes', 
      role: 'Director of Digital Operations',
      linkedin: 'https://www.linkedin.com/in/daniel-geddes-485536119/',
      image: '/team/daniel-geddes.jpg'
    },
    { 
      name: 'Siakani Morgan', 
      role: 'Treasurer',
      linkedin: 'https://www.linkedin.com/in/siakani-morgan/',
      image: '/team/siakani-morgan.jpg'
    },
  ];

  return (
    <section id="team" className="py-20 bg-muted/30 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team Members</h2>
          <p className="text-muted-foreground">Our dedicated leadership team</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow group border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden border-2 border-primary/20">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to User icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center">
                      <User className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-0 right-0 p-2 bg-secondary rounded-full text-secondary-foreground hover:bg-secondary/90 transition-colors shadow-lg"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <CardTitle className="text-lg">{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

