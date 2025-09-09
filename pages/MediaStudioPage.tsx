import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageStart, generateVideoStart } from '../features/media/mediaSlice';
import type { RootState, MediaJob } from '../types';
import MediaDisplay from '../features/media/MediaDisplay';
import { useToast } from '../hooks/useToast';

const MediaStudioPage: React.FC = () => {
    const dispatch = useDispatch();
    const showToast = useToast();
    const { jobs } = useSelector((state: RootState) => state.media);
    const { niche, targetAudience } = useSelector((state: RootState) => state.oracleSession);
    const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

    const [prompt, setPrompt] = useState(`A promotional image for ${niche}`);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [style, setStyle] = useState('Photorealistic');

    const sortedJobs = useMemo(() => {
        // FIX: Corrected arguments for localeCompare. It should compare the jobId strings.
        return Object.values(jobs).sort((a, b) => b.jobId.localeCompare(a.jobId));
    }, [jobs]);

    const activeJob = sortedJobs.find(job => job.status === 'queued' || job.status === 'processing');

    const platformOptions = [
        { label: 'Instagram Post', value: '1:1' },
        { label: 'Instagram Story', value: '9:16' },
        { label: 'YouTube Thumbnail', value: '16:9' },
        { label: 'Facebook Ad', value: '4:3' },
    ];

    const styleOptions = ['Photorealistic', 'Cinematic', 'Minimalist', 'Animated', 'Abstract', 'Vintage'];

    const handleGenerate = () => {
        if (!prompt.trim()) {
            showToast('Please enter a prompt.', 'error');
            return;
        }

        // Construct a more detailed prompt
        const finalPrompt = `${style} style. ${prompt}. The target audience is ${targetAudience}.`;
        
        if (mediaType === 'image') {
            dispatch(generateImageStart({ prompt: finalPrompt, aspectRatio }));
        } else {
            dispatch(generateVideoStart({ prompt: finalPrompt }));
        }
    };

    const JobStatus: React.FC<{ job: MediaJob }> = ({ job }) => (
        <div className="bg-stone-700/50 p-3 rounded-lg my-2 border border-stone-600">
          <p className="text-sm font-semibold text-amber-300">Generation in progress...</p>
          <p className="text-xs text-stone-400 capitalize italic truncate mt-1">Prompt: "{job.prompt}"</p>
          <div className="w-full bg-stone-600 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{width: `${job.progress}%`}}></div>
          </div>
        </div>
      );

    return (
        <div className="p-4 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-amber-300">Media Studio</h1>
                <p className="text-stone-400 text-sm">Generate strategic images and videos for your niche.</p>
            </div>

            <div className="bg-stone-800/50 p-4 rounded-lg border border-stone-700/50 mb-6 space-y-4">
                {/* Prompt */}
                <div>
                    <label className="text-sm font-bold text-stone-300">1. Master Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full mt-1 bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                        rows={4}
                        placeholder="e.g., A happy dog playing with an eco-friendly chew toy"
                        disabled={!!activeJob || !isAvailable}
                    />
                </div>
                
                {/* Media Type */}
                <div>
                    <label className="text-sm font-bold text-stone-300">2. Media Type</label>
                    <div className="flex gap-2 mt-1">
                        <button onClick={() => setMediaType('image')} disabled={!!activeJob || !isAvailable} className={`flex-1 p-2 rounded-md text-sm font-semibold border-2 transition-colors ${mediaType === 'image' ? 'bg-amber-800 border-amber-500' : 'bg-stone-700 border-stone-600'}`}>Image</button>
                        <button onClick={() => setMediaType('video')} disabled={!!activeJob || !isAvailable} className={`flex-1 p-2 rounded-md text-sm font-semibold border-2 transition-colors ${mediaType === 'video' ? 'bg-amber-800 border-amber-500' : 'bg-stone-700 border-stone-600'}`}>Video</button>
                    </div>
                </div>

                {/* Platform & Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaType === 'image' && (
                        <div>
                             <label htmlFor="platform" className="text-sm font-bold text-stone-300">3. Platform</label>
                            <select id="platform" value={aspectRatio} onChange={e => setAspectRatio(e.target.value)} disabled={!!activeJob || !isAvailable} className="w-full mt-1 bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500">
                                {platformOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    )}
                    <div className={mediaType === 'image' ? '' : 'col-span-2'}>
                        <label htmlFor="style" className="text-sm font-bold text-stone-300">
                            {mediaType === 'image' ? '4. Style' : '3. Style'}
                        </label>
                        <select id="style" value={style} onChange={e => setStyle(e.target.value)} disabled={!!activeJob || !isAvailable} className="w-full mt-1 bg-stone-700 text-white border border-stone-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500">
                            {styleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>

                 <button
                    onClick={handleGenerate}
                    disabled={!!activeJob || !isAvailable}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition duration-300 disabled:opacity-50 text-lg"
                 >
                    {activeJob ? 'Generating...' : `Generate ${mediaType === 'image' ? 'Image' : 'Video'}`}
                 </button>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-4">Generated Media</h2>
                 {activeJob && <JobStatus job={activeJob} />}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedJobs.map(job => (
                        job.status === 'completed' && job.asset ? <MediaDisplay key={job.jobId} asset={job.asset} /> :
                        job.status === 'failed' ? <div key={job.jobId} className="bg-red-900/50 p-3 rounded-lg border border-red-700 text-red-300 text-xs">Generation failed: {job.error}</div> : null
                    ))}
                 </div>
                 {sortedJobs.length === 0 && <p className="text-center text-stone-500 text-sm">Your generated media will appear here.</p>}
            </div>
        </div>
    );
};

export default MediaStudioPage;