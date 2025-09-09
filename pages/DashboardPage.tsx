
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';
import DashboardCard from '../components/DashboardCard';

const cardData = [
    { to: '/app/analysis', title: 'Market Analysis', description: 'Analyze market trends, audiences, and competitors.', icon: '📜' },
    { to: '/app/keywords', title: 'Keyword Research', description: 'Explore SEO metrics and search intent.', icon: '✨' },
    { to: '/app/platforms', title: 'Platform Finder', description: 'Discover the best platforms to sell your products.', icon: '🛒' },
    { to: '/app/scenarios', title: 'Scenario Planner', description: 'Simulate strategies to achieve your business goals.', icon: '🗺️' },
    { to: '/app/socials', title: 'Social Media', description: 'Get insights on social platforms and content ideas.', icon: '🌐' },
    { to: '/app/copy', title: 'Copywriting', description: 'Generate compelling marketing and ad copy.', icon: '✍️' },
    { to: '/app/content', title: 'Content Strategy', description: 'Create strategic blog and content ideas.', icon: '📚' },
    { to: '/app/ventures', title: 'Venture Ideas', description: 'Brainstorm and develop new business concepts.', icon: '🚀' },
    { to: '/app/arbitrage', title: 'Sales Arbitrage', description: 'Find price gaps and generate complete sales packages.', icon: '💰' },
    { to: '/app/media', title: 'Media Studio', description: 'Generate images and videos for your brand.', icon: '🎬' },
    { to: '/app/qna', title: 'AI Q&A', description: 'Ask questions based on your generated reports.', icon: '🔮' },
]

const DashboardPage: React.FC = () => {
    const { niche, purpose } = useSelector((state: RootState) => state.oracleSession);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <p className="text-sm text-stone-400">Current analysis session:</p>
                <h1 className="text-3xl font-bold text-amber-300 truncate">{niche}</h1>
                <p className="text-sm text-stone-400">Goal: <span className="font-semibold text-amber-400">{purpose}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cardData.map(card => (
                    <DashboardCard 
                        key={card.to}
                        to={card.to}
                        title={card.title}
                        description={card.description}
                        icon={card.icon}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;