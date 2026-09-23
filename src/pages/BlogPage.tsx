import React from 'react';
import { useApp } from '../context/AppContext';
import { AdBanner } from '../components/AdBanner';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';

interface BlogPageProps {
  navigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const { posts } = useApp();
  const publishedPosts = posts.filter(p => p.published);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Blog Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          ToolBox BD <span className="text-cyan-400">Guides & Blog</span>
        </h1>
        <p className="text-sm text-slate-400">
          Practical tutorials, tips, and step-by-step guides to get the most out of our online tools.
        </p>
      </div>

      {/* Blog Top Ad */}
      <AdBanner placement="Blog Top" />

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedPosts.map(post => (
          <article
            key={post.id}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 overflow-hidden cursor-pointer transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:-translate-y-0.5"
          >
            {post.coverImage && (
              <div className="h-48 overflow-hidden bg-slate-950">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                  {post.title}
                </h2>

                <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 mt-4">
                <span>{post.publishDate}</span>
                <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Blog Bottom Ad */}
      <AdBanner placement="Blog Bottom" />
    </div>
  );
};
