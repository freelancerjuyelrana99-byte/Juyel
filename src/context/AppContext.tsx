import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Category, Tool, BlogPost, VideoItem, Advertisement, SiteSettings } from '../types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_TOOLS,
  DEFAULT_POSTS,
  DEFAULT_VIDEOS,
  DEFAULT_ADVERTISEMENTS,
  DEFAULT_SETTINGS,
} from '../data/defaultData';

interface AppContextType {
  categories: Category[];
  tools: Tool[];
  posts: BlogPost[];
  videos: VideoItem[];
  advertisements: Advertisement[];
  settings: Partial<SiteSettings>;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isAdmin: boolean;
  adminEmail: string | null;
  checkAdminAuth: () => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  getAdsByPlacement: (placement: string) => Advertisement[];
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [tools, setTools] = useState<Tool[]>(DEFAULT_TOOLS);
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_VIDEOS);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(DEFAULT_ADVERTISEMENTS);
  const [settings, setSettings] = useState<Partial<SiteSettings>>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('tb_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default dark mode for modern SaaS feel
  });

  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  // Sync theme to root DOM
  useEffect(() => {
    localStorage.setItem('tb_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        setTools(data.tools || []);
        setPosts(data.posts || []);
        setVideos(data.videos || []);
        setAdvertisements(data.advertisements || []);
        setSettings(data.settings || {});
      }
    } catch (err) {
      console.error('Failed to load public data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAdminAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAdmin(true);
          setAdminEmail(data.email);
          return true;
        }
      }
    } catch {
      // not authenticated
    }
    setIsAdmin(false);
    setAdminEmail(null);
    return false;
  }, []);

  const logoutAdmin = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setIsAdmin(false);
    setAdminEmail(null);
  };

  useEffect(() => {
    fetchData();
    checkAdminAuth();
  }, [fetchData, checkAdminAuth]);

  // Global Ctrl+K or Cmd+K search hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter ads by placement and device type
  const getAdsByPlacement = useCallback((placement: string): Advertisement[] => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    
    return advertisements.filter(ad => {
      if (!ad.status || ad.placement !== placement) return false;
      if (ad.device === 'All Devices') return true;
      if (isMobile && ad.device === 'Mobile') return true;
      if (isTablet && ad.device === 'Tablet') return true;
      if (!isMobile && !isTablet && ad.device === 'Desktop') return true;
      return false;
    });
  }, [advertisements]);

  return (
    <AppContext.Provider
      value={{
        categories,
        tools,
        posts,
        videos,
        advertisements,
        settings,
        isLoading,
        theme,
        toggleTheme,
        searchOpen,
        setSearchOpen,
        searchQuery,
        setSearchQuery,
        isAdmin,
        adminEmail,
        checkAdminAuth,
        logoutAdmin,
        getAdsByPlacement,
        refreshData: fetchData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
