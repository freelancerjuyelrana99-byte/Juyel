import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DynamicIcon } from '../components/DynamicIcon';
import { AdBanner } from '../components/AdBanner';
import { Search, Sparkles, Filter } from 'lucide-react';

interface ToolsPageProps {
  navigate: (path: string) => void;
  initialCategory?: string;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({ navigate, initialCategory }) => {
  const { tools, categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredTools = tools.filter(tool => {
    if (!tool.published) return false;
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      !filterQuery ||
      tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Explore All <span className="text-cyan-400">Online Tools</span>
        </h1>
        <p className="text-sm text-slate-400">
          Browse through our complete catalog of fast, browser-powered utility tools.
        </p>
      </div>

      {/* Ad Placement */}
      <AdBanner placement="Between Content" />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Filter tools..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category selector pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All ({tools.filter(t => t.published).length})
          </button>
          {categories.map(c => {
            const count = tools.filter(t => t.category === c.name && t.published).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.name
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => navigate(`/tools/${tool.slug}`)}
            className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                  <DynamicIcon name={tool.icon} className="w-5 h-5" />
                </div>
                {tool.isAi && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {tool.shortDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>{tool.category}</span>
              <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                Open Tool →
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm">No tools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
