import { MoveRight, User, MapPin, School, Heart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { OnboardingLayout } from "..";
import { Card } from "@/shared/components/match-or-liked-you/card/Card";
import { LookingFor } from "@/features/match/components/LookingFor";
import { Album } from "@/features/match/components/Album";
import { InterestDisplay } from "./InterestDisplay";
import { useState, useEffect } from "react";

export interface OnboardingStepEightFormProps {
  onSubmit?: () => void;
  onBack?: () => void;
  profileData?: {
    // Personal Information
    name?: string;
    middleName?: string;
    lastName?: string;
    age?: number;
    gender?: "male" | "female" | "nonbinary";

    // Location & Education
    location?: string;
    school?: string;
    program?: string;
    education?: string;

    // Preferences
    openForEveryone?: boolean;
    genderPreferences?: Array<"male" | "female" | "nonbinary">;
    purposes?: Array<"study-buddy" | "date" | "bizz">;

    // Profile Content
    lookingFor?: string;
    interests?: string[];

    // Media
    cardPreviewUrl?: string;
    albumPhotos?: Array<{ id: string; url: string; name: string }>;

    // Music
    musicGenres?: string[];
    musicArtists?: string[];
    musicSongs?: string[];
    musicAlbumCovers?: string[];

    // About
    aboutMe?: string;
  };
}

export function OnboardingStepEight({
  onSubmit,
  onBack,
  profileData = {},
}: OnboardingStepEightFormProps = {}) {
  // Loading state for profile picture
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Debug: Log the music album covers
  console.log('OnboardingStepEight - musicAlbumCovers:', profileData.musicAlbumCovers);
  console.log('OnboardingStepEight - musicSongs:', profileData.musicSongs);
  console.log('OnboardingStepEight - musicArtists:', profileData.musicArtists);
  
  // Check if cardPreviewUrl is available
  useEffect(() => {
    if (profileData.cardPreviewUrl) {
      // Simulate loading for a brief moment to show skeleton
      const timer = setTimeout(() => {
        setIsImageLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // If no image URL, keep loading state until it's available
      setIsImageLoading(true);
    }
  }, [profileData.cardPreviewUrl]);

  // Default values for preview
  const {
    // Personal Information
    name = "Your Name",
    middleName = "",
    lastName = "",
    age = 25,
    gender = "nonbinary",

    // Location & Education
    location = "Your Location",
    school = "Your School",
    program = "Your Program",
    education = "Your Education",

    // Preferences
    openForEveryone = true,
    genderPreferences = [],
    purposes = ["date"],

    // Profile Content
    lookingFor = "What you're looking for will appear here",
    interests = [],

    // Media
    cardPreviewUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80",
    albumPhotos = [],

    // Music
    musicGenres = ["Pop", "Rock", "Jazz"],
    musicArtists = ["Artist 1", "Artist 2", "Artist 3"],
    musicSongs = ["Song 1", "Song 2", "Song 3"],
    musicAlbumCovers = [],

    // About
    aboutMe = "This is how your about me section will appear to others. Share something interesting about yourself!",
  } = profileData;

  const handleFormSubmit = () => {
    console.log("Onboarding Step 8 - Profile Preview Completed");
    onSubmit?.();
  };

  // Format full name
  const fullName = [name, middleName, lastName].filter(Boolean).join(" ");

  // Format purposes
  const purposeLabels: Record<string, string> = {
    "study-buddy": "Study Buddy",
    date: "Date",
    bizz: "Business",
  };

  const formattedPurposes = purposes.map((p) => purposeLabels[p] || p);

  // Format gender preferences
  const genderLabels: Record<string, string> = {
    male: "Male",
    female: "Female",
    nonbinary: "Non-binary",
  };

  const formattedGenderPreferences = genderPreferences.map(
    (g) => genderLabels[g] || g
  );

  // Format location to show only city
  const cityOnly = location
    ? (() => {
        const parts = location.split(",").map((part) => part.trim());
        // Database stores "City, State" format (e.g., "Makati, Metro Manila")
        // We want to display just the city (first part)
        return parts[0];
      })()
    : "Not provided";

  return (
    <OnboardingLayout currentStep={8}>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-foreground tracking-tight">
            Preview Your Profile
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            This is how others will see your profile. Take a moment to review
            everything before you start connecting!
          </p>
        </div>

        {/* Profile Preview Card */}
        <div className="space-y-10">
          {/* Main Card Preview */}
          <div className="relative w-full mx-auto">
            <div className="relative h-[450px] mb-10">
              <Card
                name={name}
                age={age}
                imageUrl={cardPreviewUrl}
                education={education}
                location={cityOnly}
                distanceKm={0}
                purposes={purposes}
                gender={gender}
                school={school}
                program={program}
              />
            </div>

            {/* Profile details section */}
            <div className="w-full space-y-10">
              {/* Personal Information Section */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{fullName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{age || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">
                      {genderLabels[gender] || gender || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Location
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{cityOnly}</p>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <School className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Education
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">School</p>
                    <p className="font-medium">{school || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Program/Track
                    </p>
                    <p className="font-medium">{program || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-foreground">
                    Preferences
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Open to Everyone
                    </p>
                    <p className="font-medium">
                      {openForEveryone ? "Yes" : "No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purposes</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formattedPurposes.length > 0 ? (
                        formattedPurposes.map((purpose, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                          >
                            {purpose}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">
                          Not specified
                        </span>
                      )}
                    </div>
                  </div>
                  {!openForEveryone && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">
                        Gender Preferences
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formattedGenderPreferences.length > 0 ? (
                          formattedGenderPreferences.map((gender, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                            >
                              {gender}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            Not specified
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* About Me Section - Only show if content exists */}
              {aboutMe && aboutMe.trim() && (
                <div className="space-y-2">
                  <p className="text-light text-gray-600">About Me</p>
                  <h3 className="text-2xl">
                    {aboutMe}
                  </h3>
                </div>
              )}

              {/* Interests Section */}
              <InterestDisplay selectedInterests={interests || []} />

              {/* Looking For Section - Only show if content exists */}
              {lookingFor && lookingFor.trim() && (
                <LookingFor content={lookingFor} />
              )}

              {/* Music Section - Only show if user added songs */}
              {musicSongs && musicSongs.length > 0 && (
              <div className="space-y-2">
                <p className="text-light text-gray-600">Your Top Soundtracks (1-{musicSongs.length})</p>
                <div className="w-full flex flex-col gap-5 justify-center">
                  {/* First Song - Large Display */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center w-full">
                      {musicAlbumCovers && musicAlbumCovers.length > 0 && musicAlbumCovers[0] ? (
                        <img
                          src={musicAlbumCovers[0]}
                          alt="Album Cover"
                          className="w-72 h-72 object-cover rounded-sm flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '';
                            target.alt = 'Failed to load';
                            target.className = 'bg-gray-600 h-72 w-72 rounded-sm flex-shrink-0 flex items-center justify-center text-white text-sm';
                          }}
                        />
                      ) : (
                        <div className="bg-gray-600 h-72 w-72 rounded-sm flex-shrink-0 flex items-center justify-center text-white text-sm">No Album Cover</div>
                      )}
                      <img
                        src="/src/assets/png/half-vinyl.png"
                        alt="Vinyl Record"
                        className="h-64 object-contain"
                      />
                    </div>

                    <div className="flex flex-col justify-center items-center text-center w-96">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mb-2">
                        <span className="text-primary-foreground font-bold text-sm">1</span>
                      </div>
                      <p className="text-light text-muted-foreground">{musicArtists[0] || "Unknown Artist"}</p>
                      <h3 className="text-2xl">{musicSongs[0]}</h3>
                      <p className="text-light text-muted-foreground">{musicGenres[0] || "Unknown Genre"}</p>
                    </div>
                  </div>

                  {/* Remaining Songs - List Display */}
                  {musicSongs.length > 1 && (
                    <div className="space-y-2 w-full">
                      {musicSongs.slice(1).map((song, index) => (
                        <div
                          key={index}
                          className="bg-foreground text-background flex items-center p-4 w-full rounded-sm"
                        >
                          {/* Number indicator */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-4">
                            <span className="text-primary-foreground font-bold text-sm">{index + 2}</span>
                          </div>
                          
                          <div className="flex gap-3">
                            {/* Album Cover */}
                            {musicAlbumCovers &&
                            musicAlbumCovers.length > index + 1 &&
                            musicAlbumCovers[index + 1] ? (
                              <img
                                src={musicAlbumCovers[index + 1]}
                                alt="Album Cover"
                                className="w-28 h-28 rounded object-cover flex-shrink-0"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '';
                                  target.alt = 'Failed to load';
                                  target.className = 'bg-gray-600 w-28 h-28 rounded-sm flex-shrink-0';
                                }}
                              />
                            ) : (
                              <div className="bg-gray-600 w-28 h-28 rounded-sm flex-shrink-0" />
                            )}
                            <div className="space-y-1 flex justify-center flex-col">
                              <h1 className="text-sm">
                                {musicArtists[index + 1] || "Unknown Artist"}
                              </h1>
                              <h1 className="text-lg font-semibold">
                                {song}
                              </h1>
                              <p className="text-sm">
                                {musicGenres[index + 1] || "Unknown Genre"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Album Photos Section - Only show if photos exist */}
              {albumPhotos && albumPhotos.length > 0 && (
                <Album photos={albumPhotos} isLoading={isImageLoading} />
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xl">✨</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Ready to start your journey?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your profile looks great! Once you complete the onboarding,
                  you'll be able to start discovering and connecting with
                  amazing people.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              onClick={onBack}
              variant="ghost"
              className="h-12 px-6 rounded-full text-base font-medium"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleFormSubmit}
              className="h-12 px-8 bg-primary text-primary-foreground rounded-full text-base font-semibold hover:bg-primary/90 transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Complete Onboarding
              <MoveRight strokeWidth={2.5} className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
