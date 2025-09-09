import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, SocialsData, SocialsPlatformAnalysis } from '../../types';
import { useToast } from '../../hooks/useToast';
import { regeneratePostStart, clearSocialsError } from './socialsSlice';

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4">
      <h3 className="text-lg font-bold text-amber-400 mb-3">{title}</h3>
      {children}
    </div>
);

const PostCard: React.FC<{ post: SocialsPlatformAnalysis }> = ({ post }) => {
    const showToast = useToast();
    const dispatch = useDispatch();
    const { regeneratingPostId, isApiAvailable } = useSelector((state: RootState) => ({
      regeneratingPostId: state.socials.regeneratingPostId,
      isApiAvailable: state.apiStatus.isAvailable,
    }));
    const isRegenerating = regeneratingPostId === post.id;

    const postTypes = ['Educational', 'Engaging Question', 'Fun Fact', 'Promotional', 'Behind-the-Scenes'];

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`${type} copied to clipboard!`);
        }, () => {
            showToast(`Failed to copy ${type}.`, 'error');
        });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPostType = e.target.value;
        dispatch(regeneratePostStart({ postId: post.id, newPostType }));
    };

    return (
        <div className="bg-stone-800/50 border border-stone-700/50 rounded-lg p-4 relative">
            {isRegenerating && (
                <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
                    <p className="text-xs text-stone-300 mt-2">Regenerating...</p>
                </div>
            )}
            <div className="flex justify-between items-start mb-3 gap-2">
                <div>
                    <h4 className="font-bold text-lg text-amber-400">{post.platform}</h4>
                    <select 
                        value={post.postType}
                        onChange={handleTypeChange}
                        disabled={isRegenerating || !isApiAvailable}
                        className="text-xs text-stone-200 font-semibold bg-stone-700 border border-stone-600 rounded-md p-1 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50"
                    >
                        {postTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={() => handleCopy(post.content, 'Post text')}
                    className="text-xs bg-stone-700 hover:bg-stone-600 text-stone-200 font-bold py-1 px-3 rounded-md transition-colors flex-shrink-0"
                >
                    Copy Post
                </button>
            </div>
            <p className="text-stone-300 whitespace-pre-wrap text-sm bg-stone-900/50 p-3 rounded-md">{post.content}</p>
            <div className="mt-3">
                <h5 className="text-xs font-semibold text-stone-200 mb-1">Hashtags:</h5>
                <div className="flex flex-wrap gap-1">
                    {post.hashtags.map((tag, i) => (
                        <span key={i} className="bg-stone-700 text-amber-300 text-xs font-medium px-2 py-1 rounded-full">{tag}</span>
                    ))}
                </div>
            </div>
             <div className="mt-3 pt-3 border-t border-stone-700/50">
                <h5 className="text-xs font-semibold text-stone-200 mb-1">Rationale:</h5>
                <p className="text-xs text-stone-400 italic">{post.rationale}</p>
            </div>
        </div>
    );
};

const SocialsDisplay: React.FC<{ data: SocialsData }> = ({ data }) => {
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.socials.error);
  const showToast = useToast();

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearSocialsError());
    }
  }, [error, showToast, dispatch]);

  return (
    <div className="space-y-4 text-sm">
      <p className="text-stone-300 pb-2">{data.description}</p>
      
      <div className="space-y-4">
        {data.platformAnalysis.map((post) => (
           <PostCard key={post.id} post={post} />
        ))}
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

export default SocialsDisplay;
