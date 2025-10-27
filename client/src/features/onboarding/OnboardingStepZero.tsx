import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { OnboardingHeader } from './components/step-1';
import { BookOpen, Briefcase, Heart } from 'lucide-react';

export interface OnboardingStepZeroProps {
  onNext?: () => void;
}

export function OnboardingStepZero({ onNext }: OnboardingStepZeroProps = {}) {
  return (
    <div className="min-h-screen w-full bg-background px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-[700px] mx-auto">
        <OnboardingHeader />
        
        <div className="space-y-8 mt-16 animate-in fade-in duration-500">
          {/* Main Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Welcome to Chemistry
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The intentional dating app for students seeking more than just romance
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-4 mt-12">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Find Your Study Buddy
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect with peers who share your academic goals. Ace exams together and build lasting study partnerships.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Build Business Connections
                </h3>
                <p className="text-sm text-muted-foreground">
                  Network with future collaborators, mentors, and co-founders. Grow your professional circle while in school.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-secondary/50 border border-border hover:bg-secondary/70 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Discover Meaningful Relationships
                </h3>
                <p className="text-sm text-muted-foreground">
                  Find genuine connections that support your academic journey and foster balanced personal growth.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-6 mt-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Let's set up your profile
              </h2>
              <p className="text-sm text-muted-foreground">
                Tell us about yourself so we can help you find the right connections
              </p>
            </div>
            
            <Button
              onClick={onNext}
              className="h-14 px-12 bg-primary text-primary-foreground rounded-full text-base font-medium hover:bg-primary/90 transition-all duration-200 inline-flex items-center justify-center gap-2 [&_svg]:!size-6"
            >
              Get Started
              <MoveRight strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
