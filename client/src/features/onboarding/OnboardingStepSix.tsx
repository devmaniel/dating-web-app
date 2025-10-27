import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MoveRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { onboardingStepSixSchema, type OnboardingStepSixFormData, type SelectedSong } from './schemas/onboardingStepSixSchema';
import { SongSearchInput, SongCard } from './components/step-6';
import { OnboardingLayout } from './components';
import { spotifyApi, type SpotifyTrack } from '@/shared/utils';

export interface OnboardingStepSixFormProps {
  onSubmit?: (data: OnboardingStepSixFormData) => void;
  onBack?: () => void;
  initialData?: OnboardingStepSixFormData;
}

export function OnboardingStepSix({ onSubmit, onBack, initialData }: OnboardingStepSixFormProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingStepSixFormData>({
    resolver: zodResolver(onboardingStepSixSchema),
    mode: 'onChange',
    defaultValues: {
      favoriteSongs: initialData?.favoriteSongs ?? [],
    },
  });

  const selectedSongs = watch('favoriteSongs');

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await spotifyApi.searchTracks(query, 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(
        error instanceof Error 
          ? error.message 
          : 'Failed to search songs. Please check your Spotify API credentials.'
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  const handleFormSubmit = async (data: OnboardingStepSixFormData) => {
    try {
      console.log('Onboarding Step 6 data:', data);
      onSubmit?.(data);
    } catch (err) {
      console.error('Onboarding error:', err);
    }
  };

  const toggleSong = (track: SpotifyTrack) => {
    const currentSongs = selectedSongs || [];
    const isAlreadySelected = currentSongs.some(song => song.id === track.id);

    if (isAlreadySelected) {
      // Remove song
      setValue(
        'favoriteSongs',
        currentSongs.filter(song => song.id !== track.id),
        { shouldValidate: true }
      );
    } else {
      // Add song (max 6)
      if (currentSongs.length >= 6) {
        return; // Don't add if already at max
      }

      const newSong: SelectedSong = {
        id: track.id,
        name: track.name,
        artists: track.artists,
        albumCoverUrl: spotifyApi.getAlbumCoverUrl(track, 'medium'),
        albumName: track.album.name,
      };

      setValue('favoriteSongs', [...currentSongs, newSong], { shouldValidate: true });
      
      // Clear search after selection
      setSearchQuery('');
      setSearchResults([]);
      setIsDialogOpen(false);
    }
  };

  const removeSong = (songId: string) => {
    const currentSongs = selectedSongs || [];
    setValue(
      'favoriteSongs',
      currentSongs.filter(song => song.id !== songId),
      { shouldValidate: true }
    );
  };

  // Always allow next - this step is optional
  const isFormValid = !isSubmitting;

  return (
    <OnboardingLayout currentStep={6}>
      <div className="space-y-6 animate-in fade-in duration-500">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Show us your soundtrack</h2>
            <p className="text-sm text-muted-foreground mt-2">Optional—add up to 6 songs that define your vibe</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Add Another Album Button */}
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-28 h-28 bg-secondary rounded flex items-center justify-center">
                <svg className="w-12 h-12 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-base font-normal text-foreground">Add Another Album</span>
            </button>

            {/* Search Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col border-0 bg-card">
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle className="text-xl font-semibold text-foreground">Search for Music</DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto space-y-4 px-6 pb-6 pt-4">
                  {/* Search Input */}
                  <Controller
                    name="favoriteSongs"
                    control={control}
                    render={() => (
                      <SongSearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search for a song or artist..."
                      />
                    )}
                  />

                  {/* Loading Indicator */}
                  {isSearching && (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-5 h-5 border-2 border-border border-t-primary rounded-full animate-spin"></div>
                        <span className="text-sm">Searching...</span>
                      </div>
                    </div>
                  )}

                  {/* Search Error */}
                  {searchError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{searchError}</p>
                    </div>
                  )}

                  {/* Search Results */}
                  {!isSearching && searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map((track) => {
                        const isSelected = selectedSongs?.some(song => song.id === track.id) || false;
                        const albumCoverUrl = spotifyApi.getAlbumCoverUrl(track, 'small');
                        
                        return (
                          <SongCard
                            key={track.id}
                            track={track}
                            isSelected={isSelected}
                            onClick={() => toggleSong(track)}
                            albumCoverUrl={albumCoverUrl}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Empty State */}
                  {!searchQuery && searchResults.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-sm">
                        Start typing to search for your favorite songs
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Selected Songs Section */}
            {selectedSongs && selectedSongs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-normal text-foreground">
                    Your Music Track
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {selectedSongs.length} / 6
                  </span>
                </div>
                <div className="space-y-4">
                  {selectedSongs.map((song) => (
                    <div key={song.id} className="flex items-center gap-4">
                      {song.albumCoverUrl ? (
                        <img 
                          src={song.albumCoverUrl} 
                          alt={song.albumName}
                          className="w-28 h-28 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded bg-secondary flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{song.artists.map(a => a.name).join(', ')}</p>
                        <p className="text-base font-semibold text-foreground">{song.name}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{song.albumName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSong(song.id)}
                        className="text-sm text-foreground hover:text-red-600 flex items-center gap-2 flex-shrink-0 transition-colors duration-200 group">
                        <span className="w-5 h-0.5 bg-foreground group-hover:bg-red-600 transition-colors duration-200"></span>
                        <span>Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}



            {/* Error Message */}
            {errors.favoriteSongs && (
              <p className="text-sm text-red-600">{errors.favoriteSongs.message}</p>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end items-center gap-4 pt-4">
              <Button
                type="button"
                onClick={onBack}
                variant="ghost"
                className="h-14 px-8 bg-secondary text-foreground rounded-full text-base font-medium hover:bg-secondary/80 transition-all duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid}
                className="h-14 px-8 bg-primary text-primary-foreground rounded-full text-base font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 inline-flex items-center justify-center gap-2 [&_svg]:!size-6"
              >
                {selectedSongs && selectedSongs.length > 0 ? 'Complete' : 'Skip'}
                <MoveRight strokeWidth={2.5} />
              </Button>
            </div>
          </form>
        </div>
    </OnboardingLayout>
  );
}
