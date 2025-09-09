import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendQuestionStart } from '../features/qna/qnaSlice';
import type { RootState, ChatMessage } from '../types';
import ErrorDisplay from '../components/ErrorDisplay';

const QnaPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state: RootState) => state.qna);
  const { trends, keywords, marketplaces, content, socials, copy, arbitrage, scenarios } = useSelector((state: RootState) => ({
    trends: state.trends.data,
    keywords: state.keywords.data,
    marketplaces: state.marketplaces.data,
    content: state.content.data,
    socials: state.socials.data,
    copy: state.copy.data,
    arbitrage: state.arbitrage.data,
    scenarios: state.scenarios.data,
  }));
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { isAvailable } = useSelector((state: RootState) => state.apiStatus);

  const reportOptions = [
    { key: 'trends', label: 'Market Analysis', data: trends },
    { key: 'keywords', label: 'Keywords', data: keywords },
    { key: 'marketplaces', label: 'Platforms', data: marketplaces },
    { key: 'content', label: 'Content Strategy', data: content },
    { key: 'socials', label: 'Social Media', data: socials },
    { key: 'copy', label: 'Copywriting', data: copy },
    { key: 'arbitrage', label: 'Sales Arbitrage', data: arbitrage },
    { key: 'scenarios', label: 'Scenarios', data: scenarios },
  ].filter(option => option.data.length > 0);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContextToggle = (key: string) => {
    setSelectedContexts(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      dispatch(sendQuestionStart({ question, selectedContexts }));
      setQuestion('');
    }
  };
  
  const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
      <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
         {!isUser && <span className="text-2xl -mb-1">💡</span>}
        <div className={`max-w-md px-4 py-2 rounded-2xl ${isUser ? 'bg-amber-800' : 'bg-stone-700'}`}>
          <p className="text-white whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-amber-300">AI Q&A</h2>
        <p className="text-stone-400 text-sm">
          Ask strategic questions based on the reports you have generated.
        </p>
         {reportOptions.length === 0 && (
            <div className="mt-2 text-center bg-yellow-900/50 border border-yellow-500 text-yellow-300 px-3 py-2 rounded-lg text-xs">
                <strong>Tip:</strong> For the best answers, generate reports on other pages first.
            </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-stone-800/50 p-4 rounded-lg border border-stone-700/50 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
         {loading && (
             <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-stone-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
             </div>
         )}
        <div ref={endOfMessagesRef} />
      </div>

       {reportOptions.length > 0 && (
        <div className="mb-4 p-3 bg-stone-800/50 border border-stone-700/50 rounded-lg">
            <p className="text-sm font-semibold text-stone-300 mb-2">Select context for your question:</p>
            <div className="flex flex-wrap gap-2">
                {reportOptions.map(opt => (
                    <button
                        key={opt.key}
                        onClick={() => handleContextToggle(opt.key)}
                        className={`px-3 py-1.5 text-xs rounded-full border-2 transition-colors ${
                            selectedContexts.includes(opt.key)
                                ? 'bg-amber-800 border-amber-500 text-white'
                                : 'bg-stone-700 border-stone-600 hover:bg-stone-600 text-stone-300'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
      )}

      <div>
        {error && <ErrorDisplay message={error} />}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., 'What is the biggest risk?'"
            className="flex-grow bg-stone-700 text-white border-2 border-stone-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={loading || !isAvailable}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50"
            disabled={loading || !question.trim() || !isAvailable}
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
};

export default QnaPage;
