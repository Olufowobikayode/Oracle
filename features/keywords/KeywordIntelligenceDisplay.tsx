import React from 'react';
import type { KeywordData, KeywordMetrics } from '../../types';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
    {children}
  </div>
);

const MetricCard: React.FC<{ label: string; value: string | number; description: string }> = ({ label, value, description }) => (
    <div className="bg-stone-700/50 p-3 rounded-lg text-center">
        <div className="text-2xl font-bold text-yellow-500">{value}</div>
        <div className="text-xs font-semibold text-stone-200 mt-1">{label}</div>
        <div className="text-xs text-stone-400">{description}</div>
    </div>
);

const KeywordTable: React.FC<{ keywords: KeywordMetrics[] }> = ({ keywords }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-stone-400">
            <thead className="text-xs text-stone-200 uppercase bg-stone-700/50">
                <tr>
                    <th scope="col" className="px-2 py-2">Keyword</th>
                    <th scope="col" className="px-2 py-2 text-center">Volume</th>
                    <th scope="col" className="px-2 py-2 text-center">Difficulty</th>
                    <th scope="col" className="px-2 py-2 text-center">CPC</th>
                </tr>
            </thead>
            <tbody>
                {keywords.map((kw, index) => (
                    <tr key={index} className="border-b border-stone-700 hover:bg-stone-700/30">
                        <th scope="row" className="px-2 py-2 font-medium text-stone-100 whitespace-nowrap">{kw.keyword}</th>
                        <td className="px-2 py-2 text-center">{kw.volume}</td>
                        <td className="px-2 py-2 text-center">{kw.difficulty}</td>
                        <td className="px-2 py-2 text-center">{kw.cpc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const KeywordDisplay: React.FC<{ data: KeywordData }> = ({ data }) => {
  const { metrics, longTailKeywords } = data;

  return (
    <div className="space-y-4 text-sm">
      <p className="text-stone-300 pb-2">{data.description}</p>
      
      <DetailSection title="Main Keyword Metrics">
        <div className="grid grid-cols-3 gap-2">
            <MetricCard label="Search Volume" value={metrics.volume} description="Est. monthly" />
            <MetricCard label="SEO Difficulty" value={metrics.difficulty} description="0-100 scale" />
            <MetricCard label="Avg. CPC" value={metrics.cpc} description="Est. cost" />
        </div>
      </DetailSection>

      <DetailSection title="Long-Tail Keywords">
        <KeywordTable keywords={longTailKeywords} />
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

export default KeywordDisplay;