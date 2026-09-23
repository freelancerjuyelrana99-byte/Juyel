import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Wrench,
  FolderTree,
  FileText,
  Video,
  DollarSign,
  Image as ImageIcon,
  Settings,
  Shield,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ExternalLink,
  Eye,
  ToggleLeft,
  ToggleRight,
  FileCode,
  Save,
  Search,
} from 'lucide-react';
import { Tool, Category, BlogPost, VideoItem, Advertisement, SiteSettings, MediaItem } from '../types';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tools' | 'categories' | 'blog' | 'videos' | 'ads' | 'adsTxt' | 'media' | 'seo' | 'settings' | 'security'
  >('overview');

  const [state, setState] = useState<{
    tools: Tool[];
    categories: Category[];
    posts: BlogPost[];
    videos: VideoItem[];
    pages: any[];
    advertisements: Advertisement[];
    media: MediaItem[];
    settings: SiteSettings;
    analytics: any;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals & Editing states
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [editingVideo, setEditingVideo] = useState<Partial<VideoItem> | null>(null);
  const [editingAd, setEditingAd] = useState<Partial<Advertisement> | null>(null);
  const [adsTxtContent, setAdsTxtContent] = useState('');

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [securityStatus, setSecurityStatus] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchAdminState = async () => {
    try {
      const res = await fetch('/api/admin/state');
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setAdsTxtContent(data.settings?.adsTxt || '');
      } else if (res.status === 401) {
        onLogout();
      }
    } catch (e) {
      console.error('Failed to load admin state', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminState();
  }, []);

  // Save Ads.txt
  const handleSaveAdsTxt = async () => {
    try {
      const res = await fetch('/api/admin/ads-txt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: adsTxtContent }),
      });
      if (res.ok) {
        showToast('ads.txt updated successfully! Available at /ads.txt');
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
      }
    } catch {
      showToast('Failed to save ads.txt');
    }
  };

  // Toggle Ad status
  const handleToggleAd = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/ads/${id}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        fetchAdminState();
        showToast('Ad status updated');
      }
    } catch {
      showToast('Error toggling ad');
    }
  };

  // Delete Ad
  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminState();
        showToast('Ad deleted');
      }
    } catch {
      showToast('Error deleting ad');
    }
  };

  // Save/Create Ad
  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !editingAd.name || !editingAd.placement || !editingAd.code) {
      alert('Please fill out Name, Placement, and Ad Code.');
      return;
    }

    try {
      const isNew = !editingAd.id;
      const url = isNew ? '/api/admin/ads' : `/api/admin/ads/${editingAd.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAd),
      });

      if (res.ok) {
        setEditingAd(null);
        fetchAdminState();
        showToast(isNew ? 'New ad created!' : 'Ad updated successfully!');
      }
    } catch {
      showToast('Failed to save advertisement');
    }
  };

  // Save Tool
  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editingTool.name || !editingTool.slug || !editingTool.category) {
      alert('Name, Slug, and Category are required.');
      return;
    }

    try {
      const isNew = !editingTool.id;
      const url = isNew ? '/api/admin/tools' : `/api/admin/tools/${editingTool.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTool),
      });

      if (res.ok) {
        setEditingTool(null);
        fetchAdminState();
        showToast(isNew ? 'Tool created successfully!' : 'Tool saved successfully!');
      }
    } catch {
      showToast('Error saving tool');
    }
  };

  // Delete Tool
  const handleDeleteTool = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    try {
      const res = await fetch(`/api/admin/tools/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminState();
        showToast('Tool deleted');
      }
    } catch {
      showToast('Error deleting tool');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state?.settings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state.settings),
      });
      if (res.ok) {
        showToast('Settings saved successfully!');
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
      }
    } catch {
      showToast('Failed to save settings');
    }
  };

  // Update Security
  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('Current password is required.');
      return;
    }
    try {
      const res = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newEmail, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSecurityStatus('Security credentials updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        showToast('Security updated');
      } else {
        setSecurityStatus(`Error: ${data.error}`);
      }
    } catch {
      setSecurityStatus('Error updating credentials');
    }
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-400">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold">Loading ToolBox BD Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl animate-scaleUp flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-sm">
                TB
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight">ToolBox BD</h2>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  Owner Admin
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              title="Visit Public Website"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview & Stats</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'tools' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Tools Manager ({state.tools.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'categories' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Categories ({state.categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'ads' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Ads Manager ({state.advertisements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('adsTxt')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'adsTxt' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Ads.txt Manager</span>
            </button>

            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'blog' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blog Guides ({state.posts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'videos' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videos ({state.videos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'seo' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>SEO Configuration</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'settings' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>General Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                activeTab === 'security' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </nav>
        </div>

        {/* Logout Bottom */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard Overview</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time operational summary of ToolBox BD platform.
              </p>
            </div>

            {/* Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tools</span>
                <span className="text-3xl font-black text-cyan-400 font-mono mt-1 block">
                  {state.tools.length}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 block">All operational</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Categories</span>
                <span className="text-3xl font-black text-indigo-400 font-mono mt-1 block">
                  {state.categories.length}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">12 Major hubs</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Views</span>
                <span className="text-3xl font-black text-purple-400 font-mono mt-1 block">
                  {state.analytics.totalViews.toLocaleString()}
                </span>
                <span className="text-[11px] text-purple-300 mt-1 block">Live page pings</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Ads</span>
                <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">
                  {state.advertisements.filter(a => a.status).length}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  of {state.advertisements.length} slots
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Blog Posts</span>
                <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">
                  {state.posts.length}
                </span>
                <span className="text-[11px] text-amber-300 mt-1 block">Published</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Tutorials</span>
                <span className="text-3xl font-black text-rose-400 font-mono mt-1 block">
                  {state.videos.length}
                </span>
                <span className="text-[11px] text-rose-300 mt-1 block">Videos</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Management</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setEditingTool({
                      name: '',
                      slug: '',
                      category: state.categories[0]?.name || 'AI Tools',
                      shortDesc: '',
                      icon: 'Wrench',
                      published: true,
                      popular: false,
                    });
                    setActiveTab('tools');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Tool
                </button>

                <button
                  onClick={() => {
                    setEditingAd({
                      name: 'New Banner',
                      placement: 'Below Hero',
                      network: 'Adsterra',
                      device: 'All Devices',
                      code: '<!-- Ad Code here -->',
                      status: true,
                    });
                    setActiveTab('ads');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Advertisement
                </button>

                <button
                  onClick={() => setActiveTab('adsTxt')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  <FileCode className="w-4 h-4 text-cyan-400" /> Edit ads.txt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADVERTISEMENT MANAGER (CRITICAL FEATURE) */}
        {activeTab === 'ads' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Advertisement Manager</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage Google AdSense, Adsterra, or custom banner placements without touching codebase.
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingAd({
                    name: '',
                    placement: 'Below Hero',
                    network: 'Google AdSense',
                    device: 'All Devices',
                    code: '',
                    status: true,
                  })
                }
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start"
              >
                <Plus className="w-4 h-4" /> Create Ad Slot
              </button>
            </div>

            {/* Ad Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Ad Name</th>
                    <th className="p-3.5">Placement Slot</th>
                    <th className="p-3.5">Network</th>
                    <th className="p-3.5">Device</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {state.advertisements.map(ad => (
                    <tr key={ad.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-white">{ad.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[11px]">
                          {ad.placement}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{ad.network}</td>
                      <td className="p-3.5 text-slate-400">{ad.device}</td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleAd(ad.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            ad.status
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {ad.status ? (
                            <>
                              <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-3.5 h-3.5 text-slate-500" /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setEditingAd(ad)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit/Create Ad Modal */}
            {editingAd && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <form
                  onSubmit={handleSaveAd}
                  className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">
                      {editingAd.id ? 'Edit Advertisement' : 'Create Advertisement'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingAd(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Ad Name</label>
                    <input
                      type="text"
                      required
                      value={editingAd.name || ''}
                      onChange={e => setEditingAd({ ...editingAd, name: e.target.value })}
                      placeholder="e.g. AdSense Responsive Header"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Placement</label>
                      <select
                        value={editingAd.placement || 'Below Hero'}
                        onChange={e => setEditingAd({ ...editingAd, placement: e.target.value as any })}
                        className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                      >
                        <option value="Header Top">Header Top</option>
                        <option value="Below Hero">Below Hero</option>
                        <option value="Before Tool">Before Tool</option>
                        <option value="Inside Tool">Inside Tool</option>
                        <option value="After Tool">After Tool</option>
                        <option value="Between Content">Between Content</option>
                        <option value="Blog Top">Blog Top</option>
                        <option value="Blog Middle">Blog Middle</option>
                        <option value="Blog Bottom">Blog Bottom</option>
                        <option value="Sidebar Top">Sidebar Top</option>
                        <option value="Sidebar Middle">Sidebar Middle</option>
                        <option value="Footer">Footer</option>
                        <option value="Mobile Top">Mobile Top</option>
                        <option value="Mobile Bottom">Mobile Bottom</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Network</label>
                      <select
                        value={editingAd.network || 'Google AdSense'}
                        onChange={e => setEditingAd({ ...editingAd, network: e.target.value as any })}
                        className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                      >
                        <option value="Google AdSense">Google AdSense</option>
                        <option value="Adsterra">Adsterra</option>
                        <option value="Custom HTML">Custom Banner / HTML</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Device Target</label>
                      <select
                        value={editingAd.device || 'All Devices'}
                        onChange={e => setEditingAd({ ...editingAd, device: e.target.value as any })}
                        className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                      >
                        <option value="All Devices">All Devices</option>
                        <option value="Desktop">Desktop Only</option>
                        <option value="Tablet">Tablet Only</option>
                        <option value="Mobile">Mobile Only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Ad Code (HTML / JavaScript / Script tag)
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={editingAd.code || ''}
                      onChange={e => setEditingAd({ ...editingAd, code: e.target.value })}
                      placeholder="Paste your Google AdSense or Adsterra code snippet here..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="adStatus"
                      checked={editingAd.status !== false}
                      onChange={e => setEditingAd({ ...editingAd, status: e.target.checked })}
                      className="rounded accent-emerald-500"
                    />
                    <label htmlFor="adStatus" className="text-xs text-slate-300 cursor-pointer">
                      Enable this ad immediately on the live website
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingAd(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                    >
                      Save Advertisement
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADS.TXT MANAGER */}
        {activeTab === 'adsTxt' && (
          <div className="space-y-6 animate-fadeIn max-w-3xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">ads.txt Manager</h1>
              <p className="text-xs text-slate-400 mt-1">
                Edit and verify your AdSense/Adsterra authorized digital sellers file directly. Served live at{' '}
                <a href="/ads.txt" target="_blank" className="text-cyan-400 underline">
                  /ads.txt
                </a>
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <textarea
                rows={10}
                value={adsTxtContent}
                onChange={e => setAdsTxtContent(e.target.value)}
                placeholder="google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0"
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none"
              />

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Example: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
                </span>
                <button
                  onClick={handleSaveAdsTxt}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save ads.txt</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TOOLS MANAGER */}
        {activeTab === 'tools' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">Tools Manager</h1>
                <p className="text-xs text-slate-400 mt-1">Manage all {state.tools.length} browser utilities.</p>
              </div>
              <button
                onClick={() =>
                  setEditingTool({
                    name: '',
                    slug: '',
                    category: state.categories[0]?.name || 'AI Tools',
                    shortDesc: '',
                    icon: 'Wrench',
                    published: true,
                    popular: false,
                  })
                }
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 self-start"
              >
                <Plus className="w-4 h-4" /> Add Tool
              </button>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Slug</th>
                    <th className="p-3.5">Views</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {state.tools.map(tool => (
                    <tr key={tool.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 font-bold text-white flex items-center gap-2">
                        <span>{tool.name}</span>
                        {tool.popular && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Popular</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-300">{tool.category}</td>
                      <td className="p-3.5 font-mono text-slate-400 text-[11px]">{tool.slug}</td>
                      <td className="p-3.5 text-slate-400 font-mono">{tool.views || 0}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tool.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {tool.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTool(tool.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Tool Modal */}
            {editingTool && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <form
                  onSubmit={handleSaveTool}
                  className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">
                      {editingTool.id ? 'Edit Tool' : 'Add New Tool'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingTool(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Tool Name</label>
                      <input
                        type="text"
                        required
                        value={editingTool.name || ''}
                        onChange={e => setEditingTool({ ...editingTool, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Slug</label>
                      <input
                        type="text"
                        required
                        value={editingTool.slug || ''}
                        onChange={e => setEditingTool({ ...editingTool, slug: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                      <select
                        value={editingTool.category || state.categories[0]?.name}
                        onChange={e => setEditingTool({ ...editingTool, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                      >
                        {state.categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Lucide Icon Name</label>
                      <input
                        type="text"
                        value={editingTool.icon || 'Wrench'}
                        onChange={e => setEditingTool({ ...editingTool, icon: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingTool.shortDesc || ''}
                      onChange={e => setEditingTool({ ...editingTool, shortDesc: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTool.published !== false}
                        onChange={e => setEditingTool({ ...editingTool, published: e.target.checked })}
                        className="rounded accent-cyan-500"
                      />
                      <span>Published</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingTool.popular)}
                        onChange={e => setEditingTool({ ...editingTool, popular: e.target.checked })}
                        className="rounded accent-cyan-500"
                      />
                      <span>Show in Popular Section</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingTool(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold"
                    >
                      Save Tool
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: GENERAL SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 animate-fadeIn max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Website Settings</h1>
              <p className="text-xs text-slate-400 mt-1">Configure site branding and contact information.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Site Name</label>
                <input
                  type="text"
                  value={state.settings.siteName}
                  onChange={e => setState({ ...state, settings: { ...state.settings, siteName: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tagline</label>
                <input
                  type="text"
                  value={state.settings.tagline}
                  onChange={e => setState({ ...state, settings: { ...state.settings, tagline: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={state.settings.contactEmail}
                  onChange={e => setState({ ...state, settings: { ...state.settings, contactEmail: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Google Analytics ID</label>
                <input
                  type="text"
                  value={state.settings.googleAnalyticsId || ''}
                  onChange={e => setState({ ...state, settings: { ...state.settings, googleAnalyticsId: e.target.value } })}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 6: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <form onSubmit={handleUpdateSecurity} className="space-y-6 animate-fadeIn max-w-xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Owner Security</h1>
              <p className="text-xs text-slate-400 mt-1">
                Change your administrator email and login password. Passwords are encrypted with bcrypt.
              </p>
            </div>

            {securityStatus && (
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                {securityStatus}
              </div>
            )}

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Current Password (Required)</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">New Email (Optional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="owner@toolboxbd.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Update Credentials
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 7: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">SEO & Sitemap Configuration</h1>
              <p className="text-xs text-slate-400 mt-1">Configure search engine indexing and sitemap generation.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">Dynamic XML Sitemap</span>
                  <span className="text-slate-400 text-[11px]">Auto-generated for all tools, categories & posts</span>
                </div>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View /sitemap.xml</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white block">Robots.txt</span>
                  <span className="text-slate-400 text-[11px]">Protects admin directories from indexing</span>
                </div>
                <a
                  href="/robots.txt"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>View /robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Global Meta Title</label>
                <input
                  type="text"
                  value={state.settings.seoTitle}
                  onChange={e => setState({ ...state, settings: { ...state.settings, seoTitle: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Global Meta Description</label>
                <textarea
                  rows={3}
                  value={state.settings.metaDescription}
                  onChange={e => setState({ ...state, settings: { ...state.settings, metaDescription: e.target.value } })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Save SEO Settings
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
