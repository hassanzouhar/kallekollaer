import { Position } from '../types';

// Image paths for player portraits
export const PLAYER_IMAGES = [
  '/images/player1-middels.jpeg',
  '/images/player2-middels.jpeg',
  '/images/player3-middels.jpeg',
  '/images/player5-middels.jpeg',
];

export const GOALIE_IMAGES = [
  '/images/goalie1-middels.jpeg',
  '/images/goalie2-middels.jpeg',
  '/images/goalie3-middels.jpeg',
  '/images/goalie4-middels.jpeg',
];

// Action shot images for match events
export const ACTION_IMAGES = {
  goalScorer: '/images/goalscorer_gameshot1-middels.jpeg',
  gameAction: '/images/gameshot1-middels.jpeg',
  goalieSave: '/images/gameshot_goalie-middels.jpeg',
};

// Character images for narrative elements
export const CHARACTER_IMAGES = {
  fan: '/images/happyhockeymom-middels.jpeg',
  sponsor: '/images/sponsor-middels.jpeg',
  referee: '/images/refferee-middels.jpeg',
};

/**
 * Get a player portrait based on their ID and position
 * Uses deterministic selection so same player always gets same image
 */
export const getPlayerImage = (playerId: string, position: Position): string => {
  const isGoalie = position === Position.GOALIE;
  const images = isGoalie ? GOALIE_IMAGES : PLAYER_IMAGES;

  // Use player ID hash to deterministically select image
  const hash = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % images.length;

  return images[index];
};

/**
 * Get CSS classes for retro CRT image styling
 */
export const getCRTImageClasses = (size: 'small' | 'medium' | 'large' = 'medium'): string => {
  const baseClasses = 'image-pixelated border-2 border-green-700';

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  return `${baseClasses} ${sizeClasses[size]}`;
};

/**
 * Get inline style for CRT filter effect on images
 */
export const getCRTImageStyle = (): React.CSSProperties => {
  return {
    filter: 'contrast(1.1) brightness(0.95)',
    imageRendering: 'pixelated',
  };
};
