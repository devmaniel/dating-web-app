import { X, Music } from 'lucide-react';
import type { SelectedSong } from '../../schemas/onboardingStepSixSchema';

export interface SelectedSongChipProps {
  song: SelectedSong;
  onRemove: () => void;
}

export function SelectedSongChip({ song, onRemove }: SelectedSongChipProps) {
  const artistNames = song.artists.map(artist => artist.name).join(', ');

  return (
    <div className="flex items-center gap-3 p-2 pr-3 bg-white border-2 border-black rounded-xl">
      {/* Album Cover */}
      {song.albumCoverUrl ? (
        <img 
          src={song.albumCoverUrl} 
          alt={`${song.albumName} cover`}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
          <Music className="text-gray-400" size={20} />
        </div>
      )}

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-black text-sm truncate">
          {song.name}
        </p>
        <p className="text-gray-600 text-xs truncate">
          {artistNames}
        </p>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 w-6 h-6 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors duration-200"
        aria-label="Remove song"
      >
        <X className="text-white" size={14} strokeWidth={3} />
      </button>
    </div>
  );
}
