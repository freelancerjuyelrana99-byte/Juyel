import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Shield, Zap, Lock, Heart, Play, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Hero3DBox } from '../components/Hero3DBox';
import { DynamicIcon } from '../components/DynamicIcon';
import { AdBanner } from '../components/AdBanner';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { tools, categories, posts, videos, setSearchOpen, setSearchQuery } = useApp();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      setSearchOpen(true);
    }
  };

  const popularTools = tools.filter(t => t.popular && t.published).slice(0, 8);
  const aiTools = tools.filter(t => t.isAi && t.published).slice(0, 4);

  return (
    <div className="space-y-16 pb-12 animate-fadeIn">
      {/* ==================================================
          1. HERO SECTION WITH 3D TOOLBOX
         ================================================== */}
      <section className="relative pt-6 sm:pt-12 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient neon backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free Online Browser Tools</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              All Your Useful Tools in <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">One Place</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium">
              Free, fast and easy-to-use online tools for everyday work, study, business and creativity. No sign-up required.
            </p>

            {/* Hero Large Search Box */}
            <form onSubmit={handleHeroSearchSubmit} className="max-w-lg mx-auto lg:mx-0 relative">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-cyan-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={e => setHeroSearch(e.target.value)}
                  placeholder="Search for a tool... (e.g., Image Compressor, GPA, Bangla)"
                  className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-xl transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Hero CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/tools')}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center gap-2"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const popSection = document.getElementById('popular-tools');
                  popSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 hover:border-slate-600 transition-colors"
              >
                Popular Tools
              </button>
            </div>
          </div>

          {/* Right 3D Visual Centerpiece */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Hero3DBox />
          </div>

        </div>
      </section>

      {/* Below Hero Ad Placement */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner placement="Below Hero" />
      </div>

      {/* ==================================================
          2. TOOL CATEGORIES SECTION
         ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Browse By Category</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Everything You Need</h2>
          </div>
          <button
            onClick={() => navigate('/categories')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map(cat => {
            const catToolCount = tools.filter(t => t.category === cat.name && t.published).length;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center mb-3 transition-colors">
                  <DynamicIcon name={cat.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {catToolCount} Tools
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          3. POPULAR TOOLS SECTION
         ================================================== */}
      <section id="popular-tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Top Rated & Trending</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Popular Online Tools</h2>
          </div>
          <button
            onClick={() => navigate('/tools')}
            className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>See All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map(tool => (
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
      </section>

      {/* Between Content Ad Placement */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner placement="Between Content" />
      </div>

      {/* ==================================================
          4. AI TOOLS SPOTLIGHT
         ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4 mb-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen AI Assistance</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Create Content & Grow Faster with AI
            </h2>
            <p className="text-sm text-slate-300">
              Free AI tools for YouTube creators, freelancers, job seekers, and digital marketers. Generate titles, bios, proposals, and captions in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiTools.map(tool => (
              <button
                key={tool.id}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="p-5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-purple-500/20 hover:border-purple-400/50 text-left transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center mb-3 transition-colors">
                  <DynamicIcon name={tool.icon} className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tool.shortDesc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          5. WHY CHOOSE TOOLBOX BD?
         ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Trusted & Secure</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Why Millions Use ToolBox BD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Lightning Fast & Client-Side</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Image conversions, text manipulation, and calculations occur instantly inside your browser without sluggish uploads or server delays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Strict Privacy & Zero Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your files never get saved on remote servers. When you close the browser tab, your document data is completely wiped.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">100% Free Forever</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No hidden subscriptions, watermark penalties, or file size paywalls. All tools are open and unrestricted for personal and commercial use.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. RECENT GUIDES & VIDEO TUTORIALS
         ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Blog Guides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Latest Guides & Tips
            </h3>
            <button onClick={() => navigate('/blog')} className="text-xs text-cyan-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {posts.slice(0, 3).map(post => (
              <button
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{post.category}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-xs text-slate-500">{post.publishDate} • {post.readTime}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 flex-shrink-0 ml-3" />
              </button>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-rose-400" /> Video Tutorials
            </h3>
            <button onClick={() => navigate('/videos')} className="text-xs text-cyan-400 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {videos.slice(0, 3).map(video => (
              <button
                key={video.id}
                onClick={() => navigate(`/videos/${video.slug}`)}
                className="w-full p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-left transition-all flex items-center space-x-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                    {video.title}
                  </h4>
                  <span className="text-xs text-slate-500">{video.category} • Watch Tutorial</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
