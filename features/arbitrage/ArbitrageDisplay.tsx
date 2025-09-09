import React from 'react';
import type { ArbitrageData } from '../../types';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

// Helper function to safely render price values, which might be strings, numbers, or objects.
const formatPriceValue = (price: unknown): string => {
    if (typeof price === 'string') {
        return price;
    }
    if (typeof price === 'number') {
        return String(price);
    }
    if (typeof price === 'object' && price !== null) {
        // Attempt to find a common property for price within the object
        if ('price' in price && price.price) return String(price.price);
        if ('value' in price && price.value) return String(price.value);
        // As a fallback, stringify the object to prevent a crash and show the raw data.
        return JSON.stringify(price);
    }
    // Fallback for null, undefined, etc.
    return 'N/A';
};


const ArbitrageDisplay: React.FC<{ data: ArbitrageData }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
        <p className="text-stone-300 pb-2">{data.description}</p>
        
        <DetailSection title="Pricing Strategy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-green-900/50 p-3 rounded-lg border border-green-700">
                    <p className="text-xs text-green-300">Source Price (Buy Low)</p>
                    {/* Use the safe rendering function to prevent crashes */}
                    <p className="text-2xl font-bold text-green-400">{formatPriceValue(data.pricingStrategy.buyLow)}</p>
                </div>
                 <div className="bg-sky-900/50 p-3 rounded-lg border border-sky-700">
                    <p className="text-xs text-sky-300">Target Price (Sell High)</p>
                    {/* Use the safe rendering function to prevent crashes */}
                    <p className="text-2xl font-bold text-sky-400">{formatPriceValue(data.pricingStrategy.sellHigh)}</p>
                </div>
            </div>
            <p className="text-stone-400 text-xs italic mt-3">{data.pricingStrategy.reasoning}</p>
        </DetailSection>

        <DetailSection title="Product Story">
            <p className="text-stone-300 whitespace-pre-wrap text-xs">{data.productStory}</p>
        </DetailSection>

        <DetailSection title="Marketing Angles">
          <div className="space-y-4">
            {data.marketingAngles.map((angle, index) => (
              <div key={index} className="p-3 bg-stone-900/50 rounded-lg border border-stone-700">
                <h4 className="font-bold text-md text-amber-400">{angle.headline} <span className="text-xs font-normal text-stone-400">- for {angle.platform}</span></h4>
                <p className="text-stone-300 whitespace-pre-wrap text-xs mt-1">{angle.body}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Tags & Keywords">
            <div className="flex flex-wrap gap-1">
                {data.tagsAndKeywords.map((keyword, index) => (
                    <span key={index} className="bg-stone-700 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">
                        {keyword}
                    </span>
                ))}
            </div>
        </DetailSection>

        <DetailSection title="Due Diligence Checklist">
            <ul className="list-disc list-inside text-yellow-400 space-y-2 text-xs">
                {data.dueDiligence.map((point, index) => <li key={index}><span className="text-stone-300">{point}</span></li>)}
            </ul>
        </DetailSection>

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

export default ArbitrageDisplay;