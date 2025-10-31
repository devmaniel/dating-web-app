import type { Profile } from "../data/profiles";
import { AboutMe } from "./AboutMe";
import { Interest } from "./Interest";
import { LookingFor } from "./LookingFor";
import { Music } from "./Music";
import { Album } from "./Album";

interface MoreInformationProps {
  profile: Profile;
}

export const MoreInformation = ({ profile }: MoreInformationProps) => {
  // Transform profile photos to the format expected by Album component
  // Filter out empty URLs to ensure only valid photos are passed
  const albumPhotos = (profile.photos || [])
    .filter(url => url && typeof url === 'string' && url.trim() !== '')
    .map((url, index) => ({
      id: `photo-${index}`,
      url,
      name: `Photo ${index + 1}`
    }));

  return (
    <>
      <div className="w-full space-y-10">
        <AboutMe content={profile.aboutMe} />
        <Interest />
        <LookingFor content={profile.lookingFor} />
        <Music 
          artists={profile.musicArtists}
          songs={profile.musicSongs}
          albums={profile.musicAlbums}
          albumCovers={profile.musicAlbumCovers}
        />
        <Album photos={albumPhotos} />
      </div>
    </>
  );
};
