interface MusicProps {
  genres: string[];
  artists: string[];
  songs: string[];
}

export const Music = ({ genres, artists, songs }: MusicProps) => {
  // Create an array of music items based on the provided data
  // We'll use the minimum length to avoid index out of bounds errors
  const minLength = Math.min(songs.length, artists.length, genres.length);
  const musicItems = Array.from({ length: minLength }, (_, index) => ({
    id: index,
    genre: genres[index] || 'Unknown Genre',
    artist: artists[index] || 'Unknown Artist',
    song: songs[index] || 'Unknown Song',
    album: 'Album Name', // In a real app, this would come from the data
  }));

  return (
    <div className="space-y-2">
      <p className="text-light text-gray-600">Onto Music</p>
      <div className="w-full flex flex-col gap-5 justify-center">
        <div className="flex items-center">
          <div className="bg-gray-600 h-72 w-72 rounded-sm"></div>
          <img
            src="/src/assets/png/half-vinyl.png"
            alt="Vinyl Record"
            className="h-64 object-contain"
          />
        </div>

        <div className="space-y-2 w-full">
          {musicItems.map((item) => (
            <div key={item.id} className="bg-foreground text-white p-4 w-full rounded-sm">
              <div className="flex gap-3">
                <div className="bg-gray-600 w-28 rounded-sm"></div>
                <div className="space-y-1">
                  <h1 className="text-sm">{item.artist}</h1>
                  <h1 className="text-lg font-semibold">{item.song}</h1>
                  <p className="text-sm">{item.album}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
