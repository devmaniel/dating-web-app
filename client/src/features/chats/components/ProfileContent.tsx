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

  return (
    <div className="w-full space-y-10">
      <ProfileAboutMe content={profile.aboutMe} />
      <ProfileInterest />
      <ProfileLookingFor content={profile.lookingFor} />
      <ProfileMusic 
        genres={profile.musicGenres}
        artists={profile.musicArtists}
        songs={profile.musicSongs}
      />
      <ProfileAlbum photos={albumPhotos} />
    </div>
  );
};
