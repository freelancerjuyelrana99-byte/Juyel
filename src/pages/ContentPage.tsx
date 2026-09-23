import React, { useState, useEffect } from 'react';
import { PageContent } from '../types';
import { Mail, MapPin, Send, CheckCircle2, Shield, FileText, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContentPageProps {
  slug: string;
}

export const ContentPage: React.FC<ContentPageProps> = ({ slug }) => {
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPage(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSent(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
  };

  const getPageIcon = () => {
    switch (slug) {
      case 'privacy-policy':
        return <Shield className="w-8 h-8 text-cyan-400" />;
      case 'terms':
        return <FileText className="w-8 h-8 text-indigo-400" />;
      case 'disclaimer':
        return <HelpCircle className="w-8 h-8 text-amber-400" />;
      default:
        return <Mail className="w-8 h-8 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center flex-shrink-0">
          {getPageIcon()}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">
            {page?.title || slug.replace('-', ' ')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Last updated: {page?.updatedAt || 'Recently'}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed space-y-6">
        {page?.content ? (
          <div className="whitespace-pre-wrap">{page.content}</div>
        ) : (
          <p>Detailed information and guidelines for ToolBox BD users.</p>
        )}

        {/* Interactive Contact Form for Contact Page */}
        {slug === 'contact' && (
          <div className="pt-6 border-t border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Send Us a Direct Message</h3>

            {contactSent ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                  <p className="text-xs text-emerald-400/80 mt-0.5">
                    Thank you for reaching out to ToolBox BD. Our support team will review your inquiry and reply within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Tanvir Ahmed"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={e => setContactSubject(e.target.value)}
                    placeholder="Tool inquiry, suggestion or feedback..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
