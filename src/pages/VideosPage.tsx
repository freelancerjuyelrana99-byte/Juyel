import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';
import { Play, X, Clock, ExternalLink } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

interface VideosPageProps {
  navigate: (path: string) => void;
}

export const VideosPage: React.FC<VideosPageProps> = ({ navigate }) => {
  const { videos } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Video <span className="text-rose-400">Tutorials</span>
        </h1>
        <p className="text-sm text-slate-400">
          Step-by-step video guides on how to use our online tools, optimize your workflow, and boost productivity.
        </p>
      </div>

      <AdBanner placement="Between Content" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.filter(v => v.published).map(video => {
          const embedUrl = getYoutubeEmbed(video.url);
          return (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="rounded-3xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 overflow-hidden cursor-pointer transition-all group shadow-sm hover:shadow-xl hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-950/40 to-slate-900 flex items-center justify-center">
                    <Play className="w-12 h-12 text-rose-500/60" />
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  {video.category}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">{video.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="fixed inset-0" onClick={() => setSelectedVideo(null)} />
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl z-10">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white truncate pr-4">{selectedVideo.title}</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black">
              {getYoutubeEmbed(selectedVideo.url) ? (
                <iframe
                  src={`${getYoutubeEmbed(selectedVideo.url)}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-sm text-slate-300 mb-3">Unable to embed video directly.</p>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950 text-xs text-slate-400">
              {selectedVideo.description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
