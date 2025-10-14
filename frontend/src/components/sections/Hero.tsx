import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-green-50 dark:from-gray-900 dark:via-background dark:to-green-950">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-8">
            <img 
              src="/jaia-logo.svg" 
              alt="JAIA Logo" 
              className="h-32 md:h-40 w-auto"
            />
          </div>
          
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium mb-4 border border-primary/20">
            Jamaica Artificial Intelligence Association
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Enter The World of{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              A.I
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            and explore the unknown
          </p>

          <div className="flex justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-secondary hover:bg-secondary/90"
              onClick={() => window.open('https://chat.whatsapp.com/FFzjagZ0ZxRCCHaNMjJODm', '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join WhatsApp Group
            </Button>
          </div>

          <div className="pt-16">
            <p className="text-lg font-semibold mb-4">Your Trusted Partners</p>
            <p className="text-2xl md:text-3xl font-bold">
              in Exploring A.I in Jamaica
            </p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              The purpose of the Association is to promote, advance, and facilitate the understanding, 
              development, and responsible use of artificial intelligence technologies and related fields in Jamaica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

