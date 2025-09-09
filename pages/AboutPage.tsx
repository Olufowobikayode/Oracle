
import React from 'react';
import Logo from '../components/Logo';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Logo className="h-20 w-20 mx-auto" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mt-4">About Goddess Saga</h1>
        <p className="text-lg text-gray-400 mt-2">The Oracle of Modern Commerce</p>
      </div>
      
      <div className="space-y-8 text-gray-300 text-sm md:text-base leading-relaxed">
        <p>
          In an ever-shifting digital marketplace, clarity is the ultimate advantage. Goddess Saga was born from a vision to empower entrepreneurs, creators, and marketers with the strategic foresight of an oracle, combined with the analytical power of cutting-edge AI. We believe that behind every market trend and keyword search lies a story of human desire and opportunity. Our mission is to help you read those stories.
        </p>
        
        <h2 className="text-2xl font-bold text-purple-400 pt-4 border-t border-gray-700">Our Philosophy</h2>
        <p>
          We are more than just a data analysis tool. We are a strategic partner. Goddess Saga is designed to be an extension of your own intuition, providing structured, AI-driven insights that transform ambiguity into actionable plans. Whether you're validating a new idea, scaling an existing business, or creating content that resonates, our platform provides the divine clarity you need to move forward with confidence.
        </p>

        <h2 className="text-2xl font-bold text-pink-400 pt-4 border-t border-gray-700">The Technology</h2>
        <p>
          Powered by Google's Gemini API, Goddess Saga leverages state-of-the-art generative models to analyze complex data sets and deliver nuanced, comprehensive reports. From trend analysis and SEO intelligence to crafting entire business blueprints, our technology is tuned to provide not just information, but wisdom. We handle the complexity of market research so you can focus on what you do best: building, creating, and innovating.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
