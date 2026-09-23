import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DynamicIcon } from './DynamicIcon';

interface SearchModalProps {
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ navigate }) => {
  const { tools, categories, searchOpen, setSearchOpen, searchQuery, setSearchQuery } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const query = searchQuery.trim().toLowerCase();

  // Instant filtering across tool names, categories, shortDesc, features, tags
  const filteredTools = tools.filter(tool => {
    if (!query) return true;
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query) ||
      tool.shortDesc.toLowerCase().includes(query) ||
      tool.slug.toLowerCase().includes(query) ||
      (tool.features && tool.features.some(f => f.toLowerCase().includes(query)))
    );
  }).slice(0, 12);

  const handleSelect = (slug: string) => {
    setSearchOpen(false);
    navigate(`/tools/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredTools[selectedIndex].slug);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />

      <div
        onKeyDown={handleKeyDown}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleUp"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all online tools... (e.g., compress, YouTube, Bangla, GPA, JSON)"
            className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white text-xs px-2 border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleSelect(tool.slug)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all ${
                    isSelected ? 'bg-cyan-500/10 border border-cyan-500/30' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-cyan-400'
                    }`}>
                      <DynamicIcon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white truncate">{tool.name}</span>
                        {tool.isAi && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{tool.shortDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    <span className="hidden sm:inline text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                      {tool.category}
                    </span>
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-12 px-4">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-300">No tools found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for keywords like "image", "PDF", "Bangla", "calc", or "developer".</p>
            </div>
          )}
        </div>

        {/* Quick category badges at bottom */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 overflow-x-auto">
          <span className="font-semibold text-slate-300 mr-2 flex-shrink-0">Popular:</span>
          <div className="flex space-x-1.5 overflow-x-auto">
            {categories.slice(0, 5).map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSearchQuery(c.name);
                  setSelectedIndex(0);
                }}
                className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 flex-shrink-0"
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
