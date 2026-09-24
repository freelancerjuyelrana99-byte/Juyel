import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

/**
 * =======================================================================
 * ADSTERRA AD INTEGRATION COMPONENT FOR TOOLBOX BD
 * =======================================================================
 * Primary Adsterra Script:
 *   https://pl31483464.profitableratecpmnetwork.com/db/77/79/db7779bfe0e312a783c41c05e63abd3c.js
 *
 * Rules & Constraints Enforced:
 * 1. Executes ONLY on public pages; strictly disabled on /admin routes.
 * 2. Deduplication: Ensures the script tag is never injected multiple times.
 * 3. Enabled placement: "Below the Hero / Main Content" (placement === 'Below Hero').
 * 4. Responsive design: Centered on desktop, responsive & overflow-safe on mobile (no horizontal scroll).
 * 5. Layout stability: Prevents layout shift with standardized min-height.
 * 6. No fake or placeholder ads rendered.
 * =======================================================================
 */

export const ADSTERRA_SCRIPT_URL = 'https://pl31483464.profitableratecpmnetwork.com/db/77/79/db7779bfe0e312a783c41c05e63abd3c.js';
export const ADSTERRA_SCRIPT_ID = 'adsterra-ad-script';

export type AdPlacementType =
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

interface AdBannerProps {
  placement: AdPlacementType;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const { getAdsByPlacement } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Strict Protection: Check if current route is an admin page
  const isClient = typeof window !== 'undefined';
  const isAdminPage = isClient && (
    window.location.pathname.includes('/admin') ||
    window.location.hash.includes('/admin')
  );

  // 2. Only "Below Hero" is enabled as the primary Adsterra ad placement for now
  const isPrimaryAdsterraPlacement = placement === 'Below Hero';
  const customAds = getAdsByPlacement(placement);
  const activeCustomAd = customAds.find(a => a.status && a.code && !a.code.includes('[ Advertisement Space'));

  // If this is an admin page, or if this placement has no active ad, do not render
  if (isAdminPage) {
    return null;
  }

  if (!isPrimaryAdsterraPlacement && !activeCustomAd) {
    return null;
  }

  // 3. Script initialization & deduplication logic
  useEffect(() => {
    if (!containerRef.current || isAdminPage) return;

    // A. Primary Adsterra Placement ("Below the Hero / Main Content")
    if (isPrimaryAdsterraPlacement) {
      // Prevent duplicate script loading across SPA transitions
      const existingScript = document.getElementById(ADSTERRA_SCRIPT_ID);
      if (!existingScript) {
        const adsterraScript = document.createElement('script');
        adsterraScript.id = ADSTERRA_SCRIPT_ID;
        adsterraScript.src = ADSTERRA_SCRIPT_URL;
        adsterraScript.type = 'text/javascript';
        adsterraScript.async = true;

        // Mount inside container for isolated rendering
        containerRef.current.appendChild(adsterraScript);
      }
      return;
    }

    // B. Custom Ad code handler (if configured in future)
    if (activeCustomAd && activeCustomAd.code) {
      const container = containerRef.current;
      container.innerHTML = activeCustomAd.code;

      const scripts = container.querySelectorAll('script');
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });
    }
  }, [isPrimaryAdsterraPlacement, activeCustomAd, isAdminPage]);

  // 4. Render responsive, centered container with zero layout shift
  return (
    <aside
      id={isPrimaryAdsterraPlacement ? 'adsterra-below-hero-container' : undefined}
      aria-label="Advertisement"
      className={`w-full my-6 sm:my-8 flex flex-col items-center justify-center transition-all ${className}`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div
          ref={containerRef}
          id={isPrimaryAdsterraPlacement ? 'adsterra-slot-below-hero' : undefined}
          className="w-full min-h-[90px] flex items-center justify-center text-center overflow-hidden max-w-full rounded-2xl bg-slate-900/30 border border-slate-800/50"
        />
      </div>
    </aside>
  );
};
