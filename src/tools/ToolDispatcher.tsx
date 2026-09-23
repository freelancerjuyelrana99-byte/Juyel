import React, { useEffect } from 'react';
import { Tool } from '../types';
import { useApp } from '../context/AppContext';
import { AdBanner } from '../components/AdBanner';
import { DynamicIcon } from '../components/DynamicIcon';
import { ImageTools } from './implementations/ImageTools';
import { PdfTools } from './implementations/PdfTools';
import { TextTools } from './implementations/TextTools';
import { CalculatorTools } from './implementations/CalculatorTools';
import { BanglaTools } from './implementations/BanglaTools';
import { DeveloperTools } from './implementations/DeveloperTools';
import { UtilityTools } from './implementations/UtilityTools';
import { AiTools } from './implementations/AiTools';
import { StudentFreelanceTools } from './implementations/StudentFreelanceTools';
import { Sparkles, ArrowLeft, Share2, Check, Shield } from 'lucide-react';

interface ToolDispatcherProps {
  tool: Tool;
  navigate: (path: string) => void;
}

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({ tool, navigate }) => {
  const { tools } = useApp();
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Ping view counter on load
  useEffect(() => {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `/tools/${tool.slug}`, slug: tool.slug }),
    }).catch(() => {});
  }, [tool.slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tool.name} - ToolBox BD`,
        text: tool.shortDesc,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related tools from same category
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id && t.published)
    .slice(0, 4);

  // Dispatch to the proper interactive implementation component
  const renderInteractiveTool = () => {
    if (tool.isAi) {
      return <AiTools slug={tool.slug} />;
    }

    switch (tool.category) {
      case 'Image Tools':
        return <ImageTools slug={tool.slug} />;
      case 'PDF Tools':
        return <PdfTools slug={tool.slug} />;
      case 'Text Tools':
        return <TextTools slug={tool.slug} />;
      case 'Calculator Tools':
        return <CalculatorTools slug={tool.slug} />;
      case 'Bangla Tools':
        return <BanglaTools slug={tool.slug} />;
      case 'Developer Tools':
        return <DeveloperTools slug={tool.slug} />;
      case 'Utility Tools':
        return <UtilityTools slug={tool.slug} />;
      case 'Student Tools':
      case 'Freelancing Tools':
      case 'Job & Career Tools':
        return <StudentFreelanceTools slug={tool.slug} />;
      default:
        // Default fallback to text/utility
        return <TextTools slug={tool.slug} />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/tools')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Tool'}</span>
          </button>
        </div>
      </div>

      {/* Tool Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10 flex-shrink-0">
              <DynamicIcon name={tool.icon} className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{tool.name}</h1>
                {tool.isAi && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Sparkles className="w-3 h-3" /> AI Powered
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">{tool.shortDesc}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      {/* Before Tool Ad Placement */}
      <AdBanner placement="Before Tool" />

      {/* Interactive Tool Container */}
      <section aria-label={tool.name} className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-sm">
        {renderInteractiveTool()}
      </section>

      {/* Inside Tool / Middle Ad Placement */}
      <AdBanner placement="Inside Tool" />

      {/* Tool Instructions & Guide Section */}
      <section className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" /> How to Use {tool.name}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {tool.longDesc || tool.shortDesc}
        </p>

        {tool.features && tool.features.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* After Tool Ad Placement */}
      <AdBanner placement="After Tool" />

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-white">Related {tool.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map(rel => (
              <button
                key={rel.id}
                onClick={() => navigate(`/tools/${rel.slug}`)}
                className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center mb-2.5 transition-colors">
                  <DynamicIcon name={rel.icon} className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {rel.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rel.shortDesc}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
