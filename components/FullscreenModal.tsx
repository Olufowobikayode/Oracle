
import React from 'react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex flex-col justify-end"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`w-full max-h-[95vh] bg-stone-900 rounded-t-2xl shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-shrink-0 p-4 border-b border-stone-700/50 flex items-center justify-between sticky top-0 bg-stone-900 rounded-t-2xl">
           <div className="w-8"></div> {/* Spacer */}
          <h2 className="text-lg font-bold text-center text-white truncate">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-700 hover:bg-stone-600 text-stone-300"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </header>
        <div className="flex-1 p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;