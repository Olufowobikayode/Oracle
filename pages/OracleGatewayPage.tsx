import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { initiateSession } from '../features/oracleSession/oracleSessionSlice';
import Logo from '../components/Logo';

const OracleGatewayPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [niche, setNiche] = useState('');
  const [purpose, setPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [voiceSample, setVoiceSample] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNextStep = () => setStep(s => s + 1);
  const handlePrevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBrandVoice = brandVoice === 'custom' ? voiceSample : brandVoice;
    if (niche && purpose && targetAudience && finalBrandVoice) {
      dispatch(initiateSession({ niche, purpose, targetAudience, brandVoice: finalBrandVoice }));
      navigate('/app/dashboard');
    }
  };

  const purposeOptions = ['A physical product', 'A digital product or service', 'A blog or content website', 'An advertisement campaign', 'General market research'];
  const voiceOptions = ['Professional', 'Witty & Humorous', 'Inspirational & Uplifting', 'Casual & Friendly', 'Authoritative & Expert'];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold text-amber-300">State Your Niche</h2>
            <p className="text-stone-400 mt-1 mb-6">What market or idea do you want to analyze?</p>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g., 'Sustainable pet toys'"
              className="w-full bg-stone-800 text-white border-2 border-stone-700 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button onClick={handleNextStep} disabled={!niche.trim()} className="mt-4 w-full bg-amber-600 text-white font-bold py-3 rounded-lg disabled:opacity-50">Next</button>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold text-amber-300">Define Your Purpose</h2>
            <p className="text-stone-400 mt-1 mb-6">What is the primary goal of this analysis?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {purposeOptions.map(option => (
                    <button key={option} type="button" onClick={() => setPurpose(option)} className={`p-3 text-sm text-left rounded-md border-2 transition-colors ${purpose === option ? 'bg-amber-800 border-amber-500' : 'bg-stone-800 border-stone-700 hover:bg-stone-700'}`}>
                        {option}
                    </button>
                ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handlePrevStep} className="w-1/3 bg-stone-700 text-white font-bold py-3 rounded-lg">Back</button>
              <button onClick={handleNextStep} disabled={!purpose} className="w-2/3 bg-amber-600 text-white font-bold py-3 rounded-lg disabled:opacity-50">Next</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold text-amber-300">Describe Your Audience</h2>
            <p className="text-stone-400 mt-1 mb-6">Who are you trying to reach?</p>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={4}
              placeholder="e.g., 'Young professionals aged 25-35, living in urban areas, who are environmentally conscious and love their pets.'"
              className="w-full bg-stone-800 text-white border-2 border-stone-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex gap-2 mt-4">
              <button onClick={handlePrevStep} className="w-1/3 bg-stone-700 text-white font-bold py-3 rounded-lg">Back</button>
              <button onClick={handleNextStep} disabled={!targetAudience.trim()} className="w-2/3 bg-amber-600 text-white font-bold py-3 rounded-lg disabled:opacity-50">Next</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold text-amber-300">Define Your Brand Voice</h2>
            <p className="text-stone-400 mt-1 mb-6">How do you want your brand to sound?</p>
            <div className="grid grid-cols-2 gap-2">
              {voiceOptions.map(option => (
                <button key={option} type="button" onClick={() => { setBrandVoice(option); setVoiceSample(''); }} className={`p-3 text-sm rounded-md border-2 transition-colors ${brandVoice === option ? 'bg-amber-800 border-amber-500' : 'bg-stone-800 border-stone-700 hover:bg-stone-700'}`}>
                  {option}
                </button>
              ))}
              <button type="button" onClick={() => setBrandVoice('custom')} className={`p-3 text-sm rounded-md border-2 col-span-2 transition-colors ${brandVoice === 'custom' ? 'bg-amber-800 border-amber-500' : 'bg-stone-800 border-stone-700 hover:bg-stone-700'}`}>
                Use My Own Writing Sample
              </button>
            </div>
            {brandVoice === 'custom' && (
              <textarea
                value={voiceSample}
                onChange={(e) => setVoiceSample(e.target.value)}
                rows={4}
                placeholder="Paste a blog post, email, or social media update here. The AI will learn your style."
                className="w-full mt-4 bg-stone-800 text-white border-2 border-stone-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            )}
            <div className="flex gap-2 mt-4">
              <button onClick={handlePrevStep} className="w-1/3 bg-stone-700 text-white font-bold py-3 rounded-lg">Back</button>
              <button type="submit" disabled={!brandVoice || (brandVoice === 'custom' && !voiceSample.trim())} className="w-2/3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                Start Analysis
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-950 p-4">
        <div className="w-full max-w-lg text-center mb-8">
            <Logo className="h-20 w-20 mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-white">Market Oracle</h1>
        </div>
        <div className="w-full max-w-lg bg-stone-900 border border-amber-900/50 rounded-lg p-6 sm:p-8 animate-fade-in">
            <form onSubmit={handleSubmit}>
                {renderStep()}
            </form>
        </div>
    </div>
  );
};

export default OracleGatewayPage;