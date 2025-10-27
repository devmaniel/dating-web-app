import { Check, Music } from 'lucide-react';
import type { SpotifyTrack } from '@/shared/utils';

export interface SongCardProps {
  track: SpotifyTrack;
  isSelected: boolean;
  onClick: () => void;
  albumCoverUrl: string;
}

export function SongCard({ track, isSelected, onClick, albumCoverUrl }: SongCardProps) {
  const artistNames = track.artists.map(artist => artist.name).join(', ');

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-primary bg-muted' 
          : 'border-border bg-card hover:border-border hover:bg-muted'
        }
      `}
    >
      {/* Album Cover */}
      <div className="relative flex-shrink-0">
        {albumCoverUrl ? (
          <img 
            src={albumCoverUrl} 
            alt={`${track.album.name} cover`}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
            <Music className="text-muted-foreground" size={24} />
          </div>
        )}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Check className="text-primary-foreground" size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Song Info */}
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">
          {track.name}
        </p>
        <p className="text-muted-foreground text-xs truncate">
          {artistNames}
        </p>
        <p className="text-muted-foreground/70 text-xs truncate">
          {track.album.name}
        </p>
      </div>
    </button>
  );
}
