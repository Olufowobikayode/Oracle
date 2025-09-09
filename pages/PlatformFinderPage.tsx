import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MarketplaceCard from '../features/marketplaces/MarketplaceCard';
import MarketplaceDisplay from '../features/marketplaces/MarketplaceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import FullscreenModal from '../components/FullscreenModal';
import type { RootState, MarketplaceData } from '../types';
import { fetchMarketplacesStart } from '../features/marketplaces/marketplacesSlice';

const PlatformFinderPage: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<MarketplaceData | null>(null);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.marketplaces);
  const { niche, isInitiated } = useSelector((state: RootState) => state.oracleSession);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  useEffect(() => {
    if (isAvailable && isInitiated && data.length === 0) {
      dispatch(fetchMarketplacesStart());
    }
  }, [isAvailable, isInitiated, data.length, dispatch]);

  return (
    <>
      <div className="p-4 max-w-4xl mx-auto animate-fade-in">
         <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-300">Platform Finder</h1>
          <p className="text-stone-400 text-sm">Finding the most promising platforms for "{niche}"</p>
        </div>

        <div className="mt-6">
          {loading && <LoadingSpinner message={["Searching for marketplaces...", "Scoring opportunities...", "Analyzing pros and cons..."]} />}
          {error && <ErrorDisplay message={error} />}

          <div className="space-y-4">
            {data.map((cardData, index) => (
              <div key={cardData.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <MarketplaceCard card={cardData} onSelect={() => setSelectedCard(cardData)} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <FullscreenModal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || ''}
      >
        {selectedCard && <MarketplaceDisplay data={selectedCard} />}
      </FullscreenModal>
    </>
  );
};

export default PlatformFinderPage;
