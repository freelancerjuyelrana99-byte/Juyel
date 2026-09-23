import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AdBanner } from './components/AdBanner';
import { HomePage } from './pages/HomePage';
import { ToolsPage } from './pages/ToolsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { VideosPage } from './pages/VideosPage';
import { ContentPage } from './pages/ContentPage';
import { ToolDispatcher } from './tools/ToolDispatcher';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';

// Helper to detect repository prefix for GitHub Pages (e.g. /my-repo)
export function getRepoPrefix(): string {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname || '';
  const knownPrefixes = [
    '/tools',
    '/category',
    '/categories',
    '/blog',
    '/videos',
    '/admin',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/cookie-policy',
  ];

  if (pathname === '/' || !pathname) return '';
  if (knownPrefixes.some(p => pathname.startsWith(p))) return '';

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    const candidate = '/' + segments[0];
    if (!knownPrefixes.includes(candidate)) {
      return candidate;
    }
  }
  return '';
}

export function normalizeRoute(rawPath: string): string {
  if (typeof window !== 'undefined' && window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }
  const prefix = getRepoPrefix();
  let clean = rawPath || '/';
  if (prefix && clean.startsWith(prefix)) {
    clean = clean.slice(prefix.length);
  }
  if (!clean || clean === '') clean = '/';
  return clean;
}

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => normalizeRoute(window.location.pathname));
  const { tools, categories, posts, isAdmin, checkAdminAuth, logoutAdmin, isLoading } = useApp();

  // Handle client-side history navigation preserving repo prefix
  const navigate = (path: string) => {
    const prefix = getRepoPrefix();
    const fullUrl = prefix ? `${prefix}${path}` : path;
    window.history.pushState({}, '', fullUrl);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(normalizeRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  // Check if current route is an admin page
  const isAdminRoute = currentPath.startsWith('/admin');

  // If loading public config
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold tracking-wide">Initializing ToolBox BD...</p>
        </div>
      </div>
    );
  }

  // Admin routing logic
  if (isAdminRoute) {
    if (currentPath === '/admin/login') {
      return (
        <AdminLogin
          navigate={navigate}
          onLoginSuccess={async () => {
            await checkAdminAuth();
            navigate('/admin');
          }}
        />
      );
    }

    if (!isAdmin) {
      return (
        <AdminLogin
          navigate={navigate}
          onLoginSuccess={async () => {
            await checkAdminAuth();
            navigate('/admin');
          }}
        />
      );
    }

    return (
      <AdminDashboard
        navigate={navigate}
        onLogout={async () => {
          await logoutAdmin();
          navigate('/admin/login');
        }}
      />
    );
  }

  // Public Routes rendering
  const renderPublicPage = () => {
    // 1. Single Tool Detail Page (/tools/:slug)
    if (currentPath.startsWith('/tools/')) {
      const slug = currentPath.replace('/tools/', '').split('/')[0];
      const tool = tools.find(t => t.slug === slug);
      if (tool) {
        return <ToolDispatcher tool={tool} navigate={navigate} />;
      }
      return <ToolsPage navigate={navigate} />;
    }

    // 2. All Tools Page (/tools)
    if (currentPath === '/tools') {
      return <ToolsPage navigate={navigate} />;
    }

    // 3. Category Filter Page (/category/:slug)
    if (currentPath.startsWith('/category/')) {
      const catSlug = currentPath.replace('/category/', '').split('/')[0];
      const category = categories.find(c => c.slug === catSlug);
      return <ToolsPage navigate={navigate} initialCategory={category ? category.name : undefined} />;
    }

    // 4. Categories Overview (/categories)
    if (currentPath === '/categories') {
      return <CategoriesPage navigate={navigate} />;
    }

    // 5. Single Blog Post (/blog/:slug)
    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '').split('/')[0];
      const post = posts.find(p => p.slug === slug);
      if (post) {
        return <BlogPostPage post={post} navigate={navigate} />;
      }
      return <BlogPage navigate={navigate} />;
    }

    // 6. Blog Listing (/blog)
    if (currentPath === '/blog') {
      return <BlogPage navigate={navigate} />;
    }

    // 7. Video Tutorials (/videos)
    if (currentPath === '/videos' || currentPath.startsWith('/videos/')) {
      return <VideosPage navigate={navigate} />;
    }

    // 8. Static Content Pages (/about, /contact, /privacy-policy, /terms, /disclaimer, /cookie-policy)
    const contentPages = ['/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/cookie-policy'];
    if (contentPages.includes(currentPath)) {
      const slug = currentPath.replace('/', '');
      return <ContentPage slug={slug} />;
    }

    // Default: Homepage (/)
    return <HomePage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Top Ad Placement */}
      <AdBanner placement="Header Top" />

      {/* Public Navbar - Note: Admin link is strictly hidden from public navigation */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Public Body Content */}
      <main className="flex-1 w-full">{renderPublicPage()}</main>

      {/* Global Interactive Search Modal */}
      <SearchModal navigate={navigate} />

      {/* Public Footer */}
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
