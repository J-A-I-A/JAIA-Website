import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, MessageCircle, Youtube, Twitter, Facebook } from 'lucide-react';

export function Contact() {

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch With Us</h2>
          <p className="text-muted-foreground">Reach out to us any time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">Kingston, Jamaica</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">(876)-575-8425</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">admin@jaia.org.jm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Join Our Community */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Join Our Community</h3>
            </div>

            <p className="text-muted-foreground mb-6">
              Connect with us on your favorite platform and be part of Jamaica's AI revolution!
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button 
                variant="outline"
                onClick={() => window.open('https://discord.gg/NuVXk7yjNz', '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Discord
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://www.youtube.com/channel/UCImUF-AEYy3egB1otVuSJbQ?sub_confirmation=1', '_blank')}
              >
                <Youtube className="mr-2 h-4 w-4" />
                YouTube
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://twitter.com/jaia_876', '_blank')}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://www.facebook.com/groups/458315652207268', '_blank')}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              onClick={() => window.open('https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm', '_blank')}
            >
              <img src="/whatsapp-logo.svg" alt="WhatsApp" className="mr-2 h-5 w-5" />
              Join the conversation on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

