import React from 'react';
import type { CopyData } from '../../types';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

const CopyDisplay: React.FC<{ data: CopyData }> = ({ data }) => {
  return (
    <div className="space-y-4 text-sm">
      <p className="text-stone-300 pb-2 italic">"{data.description}"</p>

      <DetailSection title="Headlines">
        <ul className="list-disc list-inside text-stone-400 space-y-2 text-xs">
            {data.headlines.map((headline, i) => <li key={i}>{headline}</li>)}
        </ul>
      </DetailSection>

      <DetailSection title="Body Copy">
        <p className="text-stone-300 whitespace-pre-wrap text-xs">{data.body}</p>
      </DetailSection>

       <DetailSection title="Call to Action">
        <p className="text-yellow-400 font-bold text-center text-base">"{data.callToAction}"</p>
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

export default CopyDisplay;