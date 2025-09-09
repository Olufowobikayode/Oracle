import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageStart, generateVideoStart } from '../features/media/mediaSlice';
import type { CardBase, RootState } from '../types';
import ShareButton from './ShareButton';
import CopyButton from './CopyButton';

interface CardActionBarProps {
  card: CardBase;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string; disabled?: boolean }> = ({ onClick, children, label, disabled }) => (
    <button onClick={onClick} aria-label={label} className="flex flex-col items-center text-stone-400 hover:text-amber-400 transition-colors text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-stone-400" disabled={disabled}>
        {children}
        <span className="mt-1">{label}</span>
    </button>
);

const CardActionBar: React.FC<CardActionBarProps> = ({ card }) => {
  const dispatch = useDispatch();
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  const handleGenerateImage = () => {
      // FIX: Add default aspectRatio and fix payload to match updated action creator.
      dispatch(generateImageStart({
          cardId: card.id,
          stackType: card.stackType,
          prompt: `A promotional image for "${card.title}". ${card.description}`,
          aspectRatio: '1:1'
      }));
  };

  const handleGenerateVideo = () => {
      // FIX: Fix payload to match updated action creator.
      dispatch(generateVideoStart({
          cardId: card.id,
          stackType: card.stackType,
          prompt: `A short, 15-second promotional video about "${card.title}". The video should visualize the following concept: ${card.description}`
      }));
  };

  const shareText = `${card.title}\n\n${card.description}`;
  
  return (
    <div className="mt-4 pt-2 border-t border-stone-700/50 flex justify-around items-center">
        <ShareButton text={shareText} />
        <CopyButton textToCopy={shareText} />
      <ActionButton onClick={handleGenerateImage} label="Image" disabled={!isAvailable}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </ActionButton>
      <ActionButton onClick={handleGenerateVideo} label="Video" disabled={!isAvailable}>
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
      </ActionButton>
    </div>
  );
};

export default CardActionBar;
