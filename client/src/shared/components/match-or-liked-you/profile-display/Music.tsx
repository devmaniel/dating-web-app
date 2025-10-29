interface MusicProps {
  artists: string[];
  songs: string[];
  albums: string[];
  albumCovers: string[];
}

export const Music = ({ artists, songs, albums, albumCovers }: MusicProps) => {
  // If no music items, don't render the section
  if (!songs || songs.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-light text-gray-600">Your Top Soundtracks (1-6)</p>
      <div className="w-full flex flex-col gap-5 justify-center">
        {/* First track with vinyl display */}
        <div className="flex justify-between items-center">
          <div className="flex items-center w-full">
            {albumCovers && albumCovers[0] ? (
              <div className="relative">
                <div className="bg-gray-600 h-72 w-72 rounded-sm"></div>
                <img
                  src={albumCovers[0]}
                  alt="Album Cover"
                  className="absolute inset-0 w-72 h-72 object-cover rounded-sm"
                />
              </div>
            ) : (
              <div className="bg-gray-600 h-72 w-72 rounded-sm"></div>
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
            <p className="text-light text-muted-foreground">{artists[0] || "Unknown Artist"}</p>
            <h3 className="text-2xl">{songs[0] || "Unknown Song"}</h3>
            <p className="text-light text-muted-foreground">{albums[0] || "Unknown Album"}</p>
          </div>
        </div>

        {/* Remaining tracks with numbering */}
        <div className="space-y-2 w-full">
          {songs && songs.length > 1
            ? songs.slice(1).map((song, index) => (
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
                    {albumCovers &&
                    albumCovers[index + 1] ? (
                      <img
                        src={albumCovers[index + 1]}
                        alt="Album Cover"
                        className="w-28 h-28 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="bg-gray-600 w-28 h-28 rounded-sm flex-shrink-0" />
                    )}
                    <div className="space-y-1 flex justify-center flex-col">
                      <h1 className="text-sm">
                        {artists[index + 1] || "Unknown Artist"}
                      </h1>
                      <h1 className="text-lg font-semibold">
                        {song}
                      </h1>
                      <p className="text-sm">
                        {albums[index + 1] || "Unknown Album"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};
