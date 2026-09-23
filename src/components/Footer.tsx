import React from 'react';
import { Box, Heart, Shield, FileText, HelpCircle, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdBanner } from './AdBanner';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { categories, settings } = useApp();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Ad Placement */}
        <AdBanner placement="Footer" className="mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <Box className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                ToolBox <span className="text-cyan-400 font-black">BD</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              All Your Useful Tools in One Place. Free, fast and easy-to-use online tools for everyday work, study, business, and creativity. All client-side image & document operations are processed securely in your browser.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Free & Safe
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-400" /> {settings.contactEmail || 'support@toolboxbd.com'}
              </span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-300">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-300">
              More Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(6, 12).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="hover:text-cyan-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company Pages */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 text-slate-300">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-cyan-400 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-cyan-400 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-cyan-400" /> Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-indigo-400" /> Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3 h-3 text-amber-400" /> Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="hover:text-cyan-400 transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ToolBox BD. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built for speed, privacy, and everyday productivity in Bangladesh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 ml-1" />
          </div>
        </div>

      </div>
    </footer>
  );
};
