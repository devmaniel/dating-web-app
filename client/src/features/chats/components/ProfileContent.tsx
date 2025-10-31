import type { ChatProfile } from "../data/types";
import { ProfileAboutMe } from "./ProfileAboutMe";
import { ProfileInterest } from "./ProfileInterest";
import { ProfileLookingFor } from "./ProfileLookingFor";
import { ProfileMusic } from "./ProfileMusic";
import { ProfileAlbum } from "./ProfileAlbum";

interface ProfileContentProps {
  profile: ChatProfile;
}

export const ProfileContent = ({ profile }: ProfileContentProps) => {
  // Transform profile photos to the format expected by Album component
  const albumPhotos = profile.photos.map((url, index) => ({
    id: `photo-${index}`,
    url,
    name: `Photo ${index + 1}`
  }));

  // Helper functions to check if data exists
  const hasAboutMe = profile.aboutMe && profile.aboutMe.trim().length > 0;
  const hasLookingFor = profile.lookingFor && profile.lookingFor.trim().length > 0;
  const hasMusic = profile.musicGenres.length > 0 || profile.musicArtists.length > 0 || profile.musicSongs.length > 0;
  const hasAlbum = profile.photos.length > 0;

  return (
    <div className="w-full space-y-10">
      {hasAboutMe && <ProfileAboutMe content={profile.aboutMe} />}
      <ProfileInterest />
      {hasLookingFor && <ProfileLookingFor content={profile.lookingFor} />}
      {hasMusic && (
        <ProfileMusic 
          genres={profile.musicGenres}
          artists={profile.musicArtists}
          songs={profile.musicSongs}
        />
      )}
      {hasAlbum && <ProfileAlbum photos={albumPhotos} />}
    </div>
  );
};
