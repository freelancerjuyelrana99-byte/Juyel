import React from 'react';
import { useApp } from '../context/AppContext';
import { DynamicIcon } from '../components/DynamicIcon';
import { ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  navigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ navigate }) => {
  const { categories, tools } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Tool <span className="text-cyan-400">Categories</span>
        </h1>
        <p className="text-sm text-slate-400">
          Browse through all 12 specialized categories of tools crafted for students, professionals, and creators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => {
          const catTools = tools.filter(t => t.category === cat.name && t.published);
          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                    <DynamicIcon name={cat.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                    {catTools.length} Tools
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.description}</p>
              </div>

              {/* Sample tool tags */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {catTools.slice(0, 3).map(t => (
                    <span
                      key={t.id}
                      onClick={() => navigate(`/tools/${t.slug}`)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      {t.name}
                    </span>
                  ))}
                  {catTools.length > 3 && (
                    <span className="text-[11px] px-2 py-0.5 text-slate-500">
                      +{catTools.length - 3} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/category/${cat.slug}`)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Explore Category</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
