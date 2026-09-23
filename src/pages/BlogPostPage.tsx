import React, { useEffect } from 'react';
import { BlogPost } from '../types';
import { AdBanner } from '../components/AdBanner';
import { ArrowLeft, Clock, Calendar, Share2, Check } from 'lucide-react';

interface BlogPostPageProps {
  post: BlogPost;
  navigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, navigate }) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: `/blog/${post.slug}`, slug: post.slug }),
    }).catch(() => {});
  }, [post.slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Guides</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
            {post.category}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readTime}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{post.publishDate}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>
      </header>

      {/* Blog Top Ad */}
      <AdBanner placement="Blog Top" />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="rounded-3xl overflow-hidden border border-slate-800 max-h-96 w-full">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Post Content Body */}
      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6 pt-4 text-sm sm:text-base">
        <p>
          Welcome to this in-depth guide on <strong>{post.title}</strong> provided by ToolBox BD. Everyday productivity requires fast and dependable tools.
        </p>
        
        {/* Blog Middle Ad */}
        <AdBanner placement="Blog Middle" />

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 font-sans space-y-4">
          <h3 className="text-lg font-bold text-white">Summary & Recommendations</h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            {post.content || post.excerpt}
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>Always optimize files before emailing or uploading to government portals.</li>
            <li>Take advantage of browser-based processing to protect personal and client confidential data.</li>
            <li>Bookmark your favorite tools on ToolBox BD for fast 1-click access.</li>
          </ul>
        </div>
      </div>

      {/* Blog Bottom Ad */}
      <AdBanner placement="Blog Bottom" />
    </article>
  );
};
