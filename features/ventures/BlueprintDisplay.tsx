
import React from 'react';
import type { VentureBlueprint } from '../../types';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

const BlueprintDisplay: React.FC<{ data: VentureBlueprint }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-stone-300 pb-2 italic">"{data.summary}"</p>
      
      <DetailSection title="Target Audience">
        <p className="text-stone-400 text-xs">{data.targetAudience}</p>
      </DetailSection>

      <DetailSection title="Marketing Plan">
        <div className="space-y-3">
            <div>
              <h4 className="font-bold text-yellow-500">Unique Selling Proposition</h4>
              <p className="text-stone-400 text-xs mt-1">{data.marketingPlan.uniqueSellingProposition}</p>
            </div>
            <div>
              <h4 className="font-bold text-yellow-500">Content Pillars</h4>
              <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs mt-1">
                {data.marketingPlan.contentPillars.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
             <div>
              <h4 className="font-bold text-yellow-500">Promotion Channels</h4>
              <ul className="list-disc list-inside text-stone-400 space-y-1 text-xs mt-1">
                {data.marketingPlan.promotionChannels.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
        </div>
      </DetailSection>

      <DetailSection title="Sourcing & Operations">
        <p className="text-stone-400 text-xs">{data.sourcingAndOperations}</p>
      </DetailSection>

      <DetailSection title="First Three Steps">
        <ol className="list-decimal list-inside text-stone-200 space-y-2 text-xs font-semibold">
          {data.firstThreeSteps.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
      </DetailSection>
    </div>
  );
};

export default BlueprintDisplay;