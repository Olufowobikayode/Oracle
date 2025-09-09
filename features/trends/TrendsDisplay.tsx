import React from 'react';
import type { TrendData } from '../../types';


const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

const TrendDisplay: React.FC<{ data: TrendData }> = ({ data }) => {
  // Helper to ensure we always have an array to map over.
  // This prevents crashes if the AI returns a string instead of an array.
  const ensureArray = (value: string | string[] | undefined | null): string[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return [value];
    }
    return [];
  };

  // Helper function to safely render list items that could be strings or complex objects.
  const renderListItem = (item: any): string => {
    if (typeof item === 'string') {
        return item;
    }
    if (typeof item === 'object' && item !== null) {
        // AI might return a detailed persona object. Extract a meaningful string.
        return item.name || item.title || item.description || JSON.stringify(item);
    }
    return String(item);
  };

  return (
    <div className="space-y-4 text-sm">
      <p className="text-stone-300 pb-2">{data.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailSection title="Target Audience">
          <div>
            <h4 className="font-semibold text-stone-200 mb-1">Demographics:</h4>
            <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs">
              {(data.audience?.targetDemographics || []).map((item, index) => <li key={index}>{renderListItem(item)}</li>)}
            </ul>
            <h4 className="font-semibold text-stone-200 mt-2 mb-1">Interests:</h4>
            <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs">
              {(data.audience?.keyInterests || []).map((item, index) => <li key={index}>{renderListItem(item)}</li>)}
            </ul>
          </div>
        </DetailSection>

        <DetailSection title="SEO Keywords">
          <div className="flex flex-wrap gap-1">
            {(data.seoKeywords || []).map((keyword, index) => (
              <span key={index} className="bg-stone-700 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        </DetailSection>
      </div>
      
      <DetailSection title="Monetization Strategies">
        <div className="space-y-3">
          {(data.monetizationStrategies || []).map((strategy, index) => (
            strategy && (
              <div key={index}>
                <h4 className="font-bold text-yellow-500">{strategy.strategy}</h4>
                <p className="text-stone-400 text-xs mt-1">{strategy.description}</p>
              </div>
            )
          ))}
        </div>
      </DetailSection>
      
      <DetailSection title="Competitor Analysis">
        <div className="space-y-4">
          {(data.competitorAnalysis || []).map((competitor, index) => (
            competitor && (
              <div key={index} className="p-3 bg-stone-900/50 rounded-lg border border-stone-700">
                <h4 className="font-bold text-md text-amber-400">
                  <a href={competitor.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {competitor.name}
                  </a>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div>
                    <h5 className="font-semibold text-green-400 text-xs mb-1">Strengths</h5>
                    <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                      {ensureArray(competitor.strengths).map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-red-400 text-xs mb-1">Weaknesses</h5>
                    <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                      {ensureArray(competitor.weaknesses).map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </DetailSection>

      {data.sources && data.sources.length > 0 && (
        <DetailSection title="Sources">
            <ul className="space-y-2">
                {data.sources.map((source, index) => (
                    source && (
                      <li key={index} className="text-xs">
                          <a 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-amber-400 hover:text-amber-300 hover:underline truncate block"
                          >
                             {source.title}
                          </a>
                      </li>
                    )
                ))}
            </ul>
        </DetailSection>
      )}
    </div>
  );
};

export default TrendDisplay;