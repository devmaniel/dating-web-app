import { Link, useMatchRoute } from '@tanstack/react-router';
import { cn } from '@/shared/utils/cn';
import { useTheme } from '@/shared/contexts/theme-context';
import { useLikedYouStore } from '@/shared/stores/likedYouStore';
import { useChatsStore } from '@/shared/stores/chatsStore';
import MatchLightIcon from '@/assets/svgs/Match - Light.svg';
import MatchDarkIcon from '@/assets/svgs/Match - Dark.svg';
import LikeLightIcon from '@/assets/svgs/Like - Light.svg';
import LikeDarkIcon from '@/assets/svgs/Like - Dark.svg';
import ChatsLightIcon from '@/assets/svgs/Chats- Light.svg';
import ChatsDarkIcon from '@/assets/svgs/Chats- Dark.svg';

interface Tab {
  id: string;
  label: string;
  iconLight: string;
  iconDark: string;
  path: string;
}

const tabs: Tab[] = [
  { id: 'match', label: 'Match', iconLight: MatchLightIcon, iconDark: MatchDarkIcon, path: '/match' },
  { id: 'like-you', label: 'Like You', iconLight: LikeLightIcon, iconDark: LikeDarkIcon, path: '/liked_you' },
  { id: 'chats', label: 'Chats', iconLight: ChatsLightIcon, iconDark: ChatsDarkIcon, path: '/chats' },
];

export const Navigation = () => {
  const matchRoute = useMatchRoute();
  const { resolvedTheme } = useTheme();
  const { pendingCount } = useLikedYouStore();
  const { unreadCount } = useChatsStore();

  return (
    <nav className="inline-flex items-center gap-2 rounded-full">
      {tabs.map(({ id, label, iconLight, iconDark, path }) => {
        const isActive = path === '/chats' 
          ? !!matchRoute({ to: '/chats' }) || !!matchRoute({ to: '/chats/$chatId' })
          : !!matchRoute({ to: path });
        const icon = resolvedTheme === 'dark' || isActive ? iconLight : iconDark;
        
        return (
          <Link
            key={id}
            to={path}
            className={cn(
              'flex items-center justify-center gap-2 px-4 py-2 rounded-full',
              'focus:outline-none min-w-[130px] font-medium shadow-sm',
              'transition-colors duration-200 no-underline',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent/10 bg-transparent'
            )}
          >
            <img src={icon} alt={label} className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm whitespace-nowrap">{label}</span>
            {id === 'like-you' && (
              <div className={cn(
                'flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold',
                isActive 
                  ? 'bg-background text-foreground' 
                  : 'bg-primary text-primary-foreground'
              )}>
                {pendingCount}
              </div>
            )}
            {id === 'chats' && unreadCount > 0 && (
              <div className={cn(
                'flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold',
                isActive 
                  ? 'bg-background text-foreground' 
                  : 'bg-primary text-primary-foreground'
              )}>
                {unreadCount}
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};
