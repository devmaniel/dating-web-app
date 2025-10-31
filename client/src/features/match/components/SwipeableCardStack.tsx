import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Card } from '@/shared/components/match-or-liked-you/card/Card';
import { EmptyState } from './EmptyState';
import { SwipeButtons } from './SwipeButtons';
import { MoreInformation } from './MoreInformation';
import { ScrollIndicator } from './ScrollIndicator';
import { useSwipe } from '../contexts/SwipeContext';

export const SwipeableCardStack = forwardRef((_, ref) => {
  const { currentIndex, handleSwipe, handleUndo, profiles, swipedProfiles } = useSwipe();
  const [swipeDirection, setSwipeDirection] = useState<'' | 'left' | 'right'>('');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'' | 'left' | 'right'>('');
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const cardStackRef = useRef<HTMLDivElement>(null);
  const mouseDownPosRef = useRef<{ x: number; time: number } | null>(null);

  // Handle scroll event to reveal MoreInformation
  useEffect(() => {
    const handleScroll = () => {
      if (cardStackRef.current) {
        const rect = cardStackRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.3;
        
        if (isVisible && !showMoreInfo) {
          setShowMoreInfo(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showMoreInfo]);

  const handleLocalSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Wait for animation to complete before moving to next card
    setTimeout(() => {
      handleSwipe(direction);
      setSwipeDirection('');
      setDragOffset(0);
    }, 300);
  };

  const handleLike = () => {
    // Animate drag to right first, then swipe
    setDragOffset(150);
    setDragDirection('right');
    setTimeout(() => {
      handleLocalSwipe('right');
    }, 200);
  };

  const handleDislike = () => {
    // Animate drag to left first, then swipe
    setDragOffset(-150);
    setDragDirection('left');
    setTimeout(() => {
      handleLocalSwipe('left');
    }, 200);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentIndex >= profiles.length) return;
    mouseDownPosRef.current = { x: e.clientX, time: Date.now() };
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || currentIndex >= profiles.length) return;
    
    // Calculate drag offset relative to card center
    const cardCenter = window.innerWidth / 2;
    const newOffset = e.clientX - cardCenter;
    setDragOffset(newOffset);
    
    // Set drag direction for button feedback
    setDragDirection(newOffset > 30 ? 'right' : newOffset < -30 ? 'left' : '');
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || currentIndex >= profiles.length) return;
    setIsDragging(false);
    setDragDirection('');
    
    // Check if this was a click (no drag movement and quick release)
    const isClick = mouseDownPosRef.current && 
      Math.abs(e.clientX - mouseDownPosRef.current.x) < 5 &&
      Date.now() - mouseDownPosRef.current.time < 300;
    
    mouseDownPosRef.current = null;
    
    if (isClick) {
      // Click detected - animate drag to right first, then swipe
      setDragOffset(150); // Animate to right
      setDragDirection('right');
      setTimeout(() => {
        handleLocalSwipe('right');
      }, 200); // Wait for drag animation
    } else {
      // Determine swipe direction based on drag offset
      // Lower threshold for more responsive swiping
      if (dragOffset > 50) {
        handleLocalSwipe('right');
      } else if (dragOffset < -50) {
        handleLocalSwipe('left');
      } else {
        // Animate back to center position
        setDragOffset(0);
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragDirection('');
      mouseDownPosRef.current = null;
      // Animate back to center position
      setDragOffset(0);
    }
  };

  // Handle click to reveal MoreInformation
  const handleRevealMoreInfo = () => {
    setShowMoreInfo(true);
  };

  // Expose undo functionality through ref
  useImperativeHandle(ref, () => ({
    undo: handleUndo
  }));

  // If we've gone through all profiles, show empty state
  if (currentIndex >= profiles.length) {
    return <EmptyState />;
  }

  return (
    <div 
      ref={cardStackRef}
      className="relative w-full mx-auto"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card stack - show up to 3 cards at once */}
      <div className="relative h-[450px] mb-10">
        {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => {
          // Only the top card is interactive
          const isTopCard = index === 0;
          
          // Determine if this profile has a previous decision
          let previousDecision: 'matched' | 'rejected' | null = null;
          
          // Check if this profile has been swiped before
          if (swipedProfiles.has(profile.id)) {
            const decision = swipedProfiles.get(profile.id);
            if (decision) {
              previousDecision = decision === 'right' ? 'matched' : 'rejected';
            }
          }
          
          return (
            <div
              key={profile.id}
              className={`absolute inset-0 transition-all duration-300 ${
                isTopCard && swipeDirection === 'left' ? 'translate-x-[-150%] rotate-[-30deg] opacity-0' :
                isTopCard && swipeDirection === 'right' ? 'translate-x-[150%] rotate-[30deg] opacity-0' :
                index === 1 ? 'scale-95 translate-y-2' :
                index === 2 ? 'scale-90 translate-y-4' :
                ''
              }`}
              style={{
                zIndex: 10 - index,
                transform: isTopCard && dragOffset !== 0 ? `translateX(${dragOffset}px) rotate(${dragOffset / 10}deg)` : undefined,
                transition: isTopCard && !isDragging ? 'transform 0.3s ease-out' : 'none',
              }}
              onMouseDown={isTopCard ? handleMouseDown : undefined}
            >
              <Card 
                name={profile.name}
                age={profile.age}
                imageUrl={profile.imageUrl}
                education={profile.education}
                previousDecision={previousDecision}
                purposes={profile.purposes}
                location={profile.location}
                distanceKm={profile.distanceKm}
              />
            </div>
          );
        })}
        
        {/* Action buttons positioned absolutely on left and right sides */}
        {currentIndex < profiles.length && (
          <SwipeButtons 
            onDislike={handleDislike}
            onLike={handleLike}
            dragDirection={dragDirection}
          />
        )}
      </div>
      
      {/* Scroll indicator */}
      {!showMoreInfo && currentIndex < profiles.length && (
        <div onClick={handleRevealMoreInfo}>
          <ScrollIndicator />
        </div>
      )}
      
      {/* More information section with animation */}
      {currentIndex < profiles.length && (
        <div className={`transition-all duration-700 ease-in-out ${showMoreInfo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <MoreInformation profile={profiles[currentIndex]} />
        </div>
      )}
    </div>
  );
});
