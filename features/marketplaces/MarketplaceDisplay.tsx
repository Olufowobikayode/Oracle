import React from 'react';
import type { MarketplaceData } from '../../types';

const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
      {children}
    </div>
);
  

const MarketplaceDisplay: React.FC<{ data: MarketplaceData }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
        <div className="flex justify-between items-start mb-2">
            <div>
                 <p className="text-stone-300 italic">"{data.reasoning}"</p>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
                <div className={`text-3xl font-bold ${getScoreColor(data.opportunityScore)}`}>{data.opportunityScore}<span className="text-lg">/100</span></div>
                <div className="text-xs text-stone-400">Opportunity</div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-stone-800/50 p-3 rounded-lg">
              <h5 className="font-semibold text-green-400 flex items-center mb-2 text-base">
                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Pros
              </h5>
              <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                {data.pros.map((pro, pIndex) => <li key={pIndex}>{pro}</li>)}
              </ul>
            </div>
            <div className="bg-stone-800/50 p-3 rounded-lg">
              <h5 className="font-semibold text-red-400 flex items-center mb-2 text-base">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Cons
              </h5>
              <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs pl-2">
                {data.cons.map((con, cIndex) => <li key={cIndex}>{con}</li>)}
              </ul>
            </div>
        </div>

        {data.sources && data.sources.length > 0 && (
            <DetailSection title="Sources">
                <ul className="space-y-2">
                    {data.sources.map((source, index) => (
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
                    ))}
                </ul>
            </DetailSection>
        )}
    </div>
  );
};

export default MarketplaceDisplay;