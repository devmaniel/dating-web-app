interface Photo {
  id: string;
  url: string;
  name: string;
}

interface AlbumProps {
  photos?: Photo[];
  isLoading?: boolean;
}

export const Album = ({ photos = [], isLoading = false }: AlbumProps) => {
  // Don't render if no photos are provided and not loading
  if (photos.length === 0 && !isLoading) {
    return null;
  }

  // If no photos are provided, create placeholder items
  const displayPhotos = photos.length > 0 
    ? photos 
    : Array.from({ length: 6 }, (_, i) => ({
        id: `placeholder-${i}`,
        url: '',
        name: `Image ${i + 1}`
      }));

  return (
    <div className="space-y-4">
      <h3 className="text-light text-muted-foreground font-medium">Album</h3>
      <div className="columns-2 gap-3 space-y-3">
        {isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: 6 }, (_, i) => (
            <div key={`skeleton-${i}`} className="relative group break-inside-avoid mb-3">
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded overflow-hidden border-2 border-muted-foreground animate-pulse">
                <div className="h-32" />
              </div>
            </div>
          ))
        ) : (
          displayPhotos.map((photo) => (
            <div key={photo.id} className="relative group break-inside-avoid mb-3">
              <div className="w-full bg-secondary rounded overflow-hidden border-2 border-muted-foreground">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="h-32 flex items-center justify-center">
                    <span className="text-foreground text-sm font-medium">{photo.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
