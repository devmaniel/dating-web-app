# Onboarding Step 8 - Profile Preview

## Overview
Step 8 is the final step in the onboarding process. It provides users with a comprehensive preview of all their profile information collected throughout the onboarding process.

## Features
- **Profile Card Preview**: Shows the user's card preview image, name, age, education, location, and purposes
- **Personal Information Section**: Displays full name, age, and gender
- **Location & Education Section**: Shows location, school, and program/track
- **Preferences Section**: Displays openness to everyone, purposes, and gender preferences
- **About Me Section**: Shows user's self-description with consistent match design
- **Interests Section**: Displays selected interests with icons
- **Looking For Section**: Shows what the user is looking for
- **Music Section**: Shows favorite songs, artists, and album information
- **Album Gallery**: Displays uploaded album photos
- **Info Box**: Provides encouragement and next steps

## Component Props

```typescript
interface OnboardingStepEightFormProps {
  onSubmit?: () => void;
  onBack?: () => void;
  profileData?: {
    // Personal Information
    name?: string;
    middleName?: string;
    lastName?: string;
    age?: number;
    gender?: 'male' | 'female' | 'nonbinary';
    
    // Location & Education
    location?: string;
    school?: string;
    program?: string;
    education?: string;
    
    // Preferences
    openForEveryone?: boolean;
    genderPreferences?: Array<'male' | 'female' | 'nonbinary'>;
    purposes?: Array<'study-buddy' | 'date' | 'bizz'>;
    
    // Profile Content
    lookingFor?: string;
    interests?: string[];
    aboutMe?: string;
    
    // Media
    cardPreviewUrl?: string;
    albumPhotos?: Array<{ id: string; url: string; name: string }>;
    
    // Music
    musicGenres?: string[];
    musicArtists?: string[];
    musicSongs?: string[];
  };
}
```

## Usage

The component is automatically integrated into the onboarding flow and receives data from all previous steps:

- **Step 1**: Name, middle name, last name, age (from birthdate), gender
- **Step 2**: Location, school, program/track, education
- **Step 3**: Open for everyone, gender preferences, purposes
- **Step 4**: Looking for text
- **Step 5**: Selected interests
- **Step 6**: Music preferences (songs, artists, album names)
- **Step 7**: Card preview image, album photos

## Design
The preview uses a comprehensive layout with organized sections for each category of information:
- Each section is contained in a card with appropriate styling
- Personal information is clearly displayed with proper labels
- Interests are shown with emojis using the InterestDisplay component
- About Me section uses the same design as the match feature
- Music section displays album information along with songs and artists
- Program/Track is clearly labeled
- All information is displayed in a single scrollable view for easy review

## Navigation
- **Back Button**: Returns to Step 7 (photo upload)
- **Complete Onboarding Button**: Finalizes the onboarding process
