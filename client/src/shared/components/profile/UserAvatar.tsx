import { useState, useEffect, memo } from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface UserAvatarProps {
  avatarUrl?: string;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9', 
  lg: 'w-12 h-12'
};

const UserAvatarComponent = ({ 
  avatarUrl, 
  isLoading = false,
  size = 'md'
}: UserAvatarProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Reset loading state when avatar URL changes
  useEffect(() => {
    if (avatarUrl) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [avatarUrl]);

  const sizeClass = sizeClasses[size];

  if (isLoading || !avatarUrl || imageError) {
    return <Skeleton className={`${sizeClass} rounded-full`} />;
  }

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden`}>
      {imageLoading && <Skeleton className="w-full h-full rounded-full" />}
      <img 
        src={avatarUrl} 
        alt="User Avatar" 
        className={`w-full h-full object-cover ${imageLoading ? 'hidden' : ''}`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageLoading(false);
          setImageError(true);
        }}
      />
    </div>
  );
};

export const UserAvatar = memo(UserAvatarComponent, (prevProps, nextProps) => {
  // Only re-render if avatarUrl, isLoading, or size actually changed
  return (
    prevProps.avatarUrl === nextProps.avatarUrl &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.size === nextProps.size
  );
});

UserAvatar.displayName = 'UserAvatar';
