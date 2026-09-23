import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface AdBannerProps {
  placement: 
    | 'Header Top'
    | 'Below Hero'
    | 'Before Tool'
    | 'Inside Tool'
    | 'After Tool'
    | 'Between Content'
    | 'Blog Top'
    | 'Blog Middle'
    | 'Blog Bottom'
    | 'Sidebar Top'
    | 'Sidebar Middle'
    | 'Footer'
    | 'Mobile Top'
    | 'Mobile Bottom';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const { getAdsByPlacement } = useApp();
  const ads = getAdsByPlacement(placement);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || ads.length === 0) return;
    
    // Clear and execute any script tags inside ad code cleanly
    const container = containerRef.current;
    const ad = ads[0]; // Active ad for this slot
    if (!ad || !ad.code) return;

    container.innerHTML = ad.code;
    
    // Execute script tags safely if present
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [ads]);

  if (ads.length === 0) return null;

  return (
    <aside 
      aria-label="Advertisement" 
      className={`w-full my-4 flex flex-col items-center justify-center transition-all ${className}`}
    >
      <div 
        ref={containerRef}
        className="w-full max-w-5xl min-h-[50px] flex items-center justify-center rounded-lg overflow-hidden"
      />
    </aside>
  );
};
