import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './server/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());

// Server-side Gemini AI Client with User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory rate limiter for login
const loginAttempts: { [ip: string]: { count: number; resetAt: number } } = {};
const rateLimitLogin = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  if (!loginAttempts[ip] || loginAttempts[ip].resetAt < now) {
    loginAttempts[ip] = { count: 1, resetAt: now + 15 * 60 * 1000 };
    return next();
  }
  if (loginAttempts[ip].count >= 8) {
    return res.status(429).json({ error: 'Too many login attempts. Please wait 15 minutes.' });
  }
  loginAttempts[ip].count++;
  next();
};

// Admin authentication middleware
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.tb_admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token || !db.validateSession(token)) {
    return res.status(401).json({ error: 'Unauthorized. Admin session required.' });
  }
  next();
};

// ==========================================
// 1. PUBLIC SEO & SPECIAL ENDPOINTS
// ==========================================

// /ads.txt endpoint served directly from database
app.get('/ads.txt', (_req: Request, res: Response) => {
  const adsTxt = db.getState().settings.adsTxt || '# ToolBox BD ads.txt\n';
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(adsTxt);
});

// /robots.txt
app.get('/robots.txt', (_req: Request, res: Response) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/

Sitemap: /sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

// /sitemap.xml
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const state = db.getState();
  const host = `${req.protocol}://${req.get('host')}`;
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static routes
  const staticRoutes = ['/', '/tools', '/categories', '/videos', '/blog', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/cookie-policy'];
  staticRoutes.forEach(route => {
    xml += `  <url>\n    <loc>${host}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Tools
  state.tools.filter(t => t.published).forEach(tool => {
    xml += `  <url>\n    <loc>${host}/tools/${tool.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Categories
  state.categories.forEach(cat => {
    xml += `  <url>\n    <loc>${host}/category/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // Blog posts
  state.posts.filter(p => p.published).forEach(post => {
    xml += `  <url>\n    <loc>${host}/blog/${post.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  // Videos
  state.videos.filter(v => v.published).forEach(vid => {
    xml += `  <url>\n    <loc>${host}/videos/${vid.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.send(xml);
});

// ==========================================
// 2. PUBLIC API ENDPOINTS
// ==========================================

// Global bootstrap data for instant SPA loading
app.get('/api/public/data', (_req: Request, res: Response) => {
  const state = db.getState();
  const publicSettings = {
    siteName: state.settings.siteName,
    tagline: state.settings.tagline,
    description: state.settings.description,
    contactEmail: state.settings.contactEmail,
    facebookUrl: state.settings.facebookUrl,
    twitterUrl: state.settings.twitterUrl,
    youtubeUrl: state.settings.youtubeUrl,
    googleAnalyticsId: state.settings.googleAnalyticsId,
    seoTitle: state.settings.seoTitle,
    metaDescription: state.settings.metaDescription,
    ogImage: state.settings.ogImage,
    maintenanceMode: state.settings.maintenanceMode,
  };

  res.json({
    categories: state.categories,
    tools: state.tools.filter(t => t.published),
    posts: state.posts.filter(p => p.published),
    videos: state.videos.filter(v => v.published),
    advertisements: state.advertisements.filter(a => a.status),
    settings: publicSettings,
  });
});

// Tools
app.get('/api/tools', (_req: Request, res: Response) => {
  res.json(db.getState().tools.filter(t => t.published));
});

app.get('/api/tools/:slug', (req: Request, res: Response) => {
  const tool = db.getState().tools.find(t => t.slug === req.params.slug && t.published);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  db.recordPageView(`/tools/${tool.slug}`, tool.slug);
  res.json(tool);
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getState().categories);
});

// Posts
app.get('/api/posts', (_req: Request, res: Response) => {
  res.json(db.getState().posts.filter(p => p.published));
});

app.get('/api/posts/:slug', (req: Request, res: Response) => {
  const post = db.getState().posts.find(p => p.slug === req.params.slug && p.published);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.views = (post.views || 0) + 1;
  db.recordPageView(`/blog/${post.slug}`);
  res.json(post);
});

// Videos
app.get('/api/videos', (_req: Request, res: Response) => {
  res.json(db.getState().videos.filter(v => v.published));
});

app.get('/api/videos/:slug', (req: Request, res: Response) => {
  const video = db.getState().videos.find(v => v.slug === req.params.slug && v.published);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  video.views = (video.views || 0) + 1;
  db.recordPageView(`/videos/${video.slug}`);
  res.json(video);
});

// Pages
app.get('/api/pages/:slug', (req: Request, res: Response) => {
  const page = db.getState().pages.find(p => p.slug === req.params.slug);
  if (!page) return res.status(404).json({ error: 'Page not found' });
  db.recordPageView(`/${page.slug}`);
  res.json(page);
});

// Analytics view ping
app.post('/api/analytics/view', (req: Request, res: Response) => {
  const { path, slug } = req.body;
  if (path) {
    db.recordPageView(path, slug);
  }
  res.json({ ok: true });
});

// ==========================================
// 3. SERVER-SIDE GEMINI AI API
// ==========================================
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  const { prompt, systemInstruction, toolType } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt is required.' });
  }

  try {
    const defaultInstruction = 'You are an expert AI productivity assistant built for ToolBox BD. Provide clean, well-formatted, high-quality, actionable results without unnecessary preamble.';
    const instruction = systemInstruction || defaultInstruction;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: instruction,
        temperature: 0.7,
      },
    });

    const outputText = response.text || '';
    res.json({ result: outputText, toolType });
  } catch (error: any) {
    console.error('Server-side Gemini AI generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate AI response. Please try again.',
    });
  }
});

// ==========================================
// 4. ADMIN AUTHENTICATION
// ==========================================
app.post('/api/admin/login', rateLimitLogin, (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = db.getAdmin();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (email.toLowerCase() !== admin.email.toLowerCase()) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const matches = bcrypt.compareSync(password, admin.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid administrator credentials.' });
  }

  const token = db.createSession(admin.email);
  res.cookie('tb_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, email: admin.email, token });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = req.cookies.tb_admin_token;
  db.removeSession(token);
  res.clearCookie('tb_admin_token');
  res.json({ success: true });
});

app.get('/api/admin/me', (req: Request, res: Response) => {
  const token = req.cookies.tb_admin_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token || !db.validateSession(token)) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, email: db.getAdmin().email });
});

app.post('/api/admin/security', requireAdmin, (req: Request, res: Response) => {
  const { currentPassword, newEmail, newPassword } = req.body;
  const admin = db.getAdmin();

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }

  const matches = bcrypt.compareSync(currentPassword, admin.passwordHash);
  if (!matches) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  let updatedHash = admin.passwordHash;
  if (newPassword && newPassword.length >= 8) {
    const salt = bcrypt.genSaltSync(10);
    updatedHash = bcrypt.hashSync(newPassword, salt);
  }

  const targetEmail = newEmail ? newEmail.trim() : admin.email;
  db.updateAdmin(targetEmail, updatedHash);

  res.json({ success: true, message: 'Security credentials updated successfully.' });
});

// ==========================================
// 5. ADMIN PROTECTED CRUD OPERATIONS
// ==========================================

// Full State for Admin Dashboard
app.get('/api/admin/state', requireAdmin, (_req: Request, res: Response) => {
  const state = db.getState();
  res.json({
    tools: state.tools,
    categories: state.categories,
    posts: state.posts,
    videos: state.videos,
    pages: state.pages,
    advertisements: state.advertisements,
    media: state.media,
    settings: state.settings,
    analytics: state.analytics,
  });
});

// Tools CRUD
app.post('/api/admin/tools', requireAdmin, (req: Request, res: Response) => {
  const tool = req.body;
  if (!tool.name || !tool.slug || !tool.category) {
    return res.status(400).json({ error: 'Name, slug and category are required.' });
  }
  tool.id = tool.id || `tool-${Date.now()}`;
  tool.views = tool.views || 0;
  db.getState().tools.unshift(tool);
  db.save();
  res.json({ success: true, tool });
});

app.put('/api/admin/tools/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.getState().tools.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Tool not found.' });
  db.getState().tools[index] = { ...db.getState().tools[index], ...req.body };
  db.save();
  res.json({ success: true, tool: db.getState().tools[index] });
});

app.delete('/api/admin/tools/:id', requireAdmin, (req: Request, res: Response) => {
  const before = db.getState().tools.length;
  db.getState().tools = db.getState().tools.filter(t => t.id !== req.params.id);
  db.save();
  res.json({ success: true, deleted: before !== db.getState().tools.length });
});

// Categories CRUD
app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
  const cat = req.body;
  if (!cat.name || !cat.slug) {
    return res.status(400).json({ error: 'Name and slug are required.' });
  }
  cat.id = cat.id || `cat-${Date.now()}`;
  db.getState().categories.push(cat);
  db.save();
  res.json({ success: true, category: cat });
});

app.put('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.getState().categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found.' });
  db.getState().categories[index] = { ...db.getState().categories[index], ...req.body };
  db.save();
  res.json({ success: true, category: db.getState().categories[index] });
});

app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  db.getState().categories = db.getState().categories.filter(c => c.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// Blog Posts CRUD
app.post('/api/admin/posts', requireAdmin, (req: Request, res: Response) => {
  const post = req.body;
  if (!post.title || !post.slug) {
    return res.status(400).json({ error: 'Title and slug are required.' });
  }
  post.id = post.id || `post-${Date.now()}`;
  post.views = 0;
  post.publishDate = post.publishDate || new Date().toISOString().split('T')[0];
  db.getState().posts.unshift(post);
  db.save();
  res.json({ success: true, post });
});

app.put('/api/admin/posts/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.getState().posts.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Post not found.' });
  db.getState().posts[index] = { ...db.getState().posts[index], ...req.body };
  db.save();
  res.json({ success: true, post: db.getState().posts[index] });
});

app.delete('/api/admin/posts/:id', requireAdmin, (req: Request, res: Response) => {
  db.getState().posts = db.getState().posts.filter(p => p.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// Videos CRUD
app.post('/api/admin/videos', requireAdmin, (req: Request, res: Response) => {
  const vid = req.body;
  if (!vid.title || !vid.url) {
    return res.status(400).json({ error: 'Title and URL are required.' });
  }
  vid.id = vid.id || `vid-${Date.now()}`;
  vid.slug = vid.slug || vid.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  vid.views = 0;
  vid.publishDate = vid.publishDate || new Date().toISOString().split('T')[0];
  db.getState().videos.unshift(vid);
  db.save();
  res.json({ success: true, video: vid });
});

app.put('/api/admin/videos/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.getState().videos.findIndex(v => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Video not found.' });
  db.getState().videos[index] = { ...db.getState().videos[index], ...req.body };
  db.save();
  res.json({ success: true, video: db.getState().videos[index] });
});

app.delete('/api/admin/videos/:id', requireAdmin, (req: Request, res: Response) => {
  db.getState().videos = db.getState().videos.filter(v => v.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// Pages CRUD
app.put('/api/admin/pages/:slug', requireAdmin, (req: Request, res: Response) => {
  const index = db.getState().pages.findIndex(p => p.slug === req.params.slug);
  if (index === -1) {
    const newPage = {
      id: `page-${Date.now()}`,
      title: req.body.title || req.params.slug,
      slug: req.params.slug,
      content: req.body.content || '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    db.getState().pages.push(newPage);
    db.save();
    return res.json({ success: true, page: newPage });
  }
  db.getState().pages[index] = {
    ...db.getState().pages[index],
    ...req.body,
    updatedAt: new Date().toISOString().split('T')[0],
  };
  db.save();
  res.json({ success: true, page: db.getState().pages[index] });
});

// Advertisements CRUD (CRITICAL FEATURE)
app.post('/api/admin/ads', requireAdmin, (req: Request, res: Response) => {
  const ad = req.body;
  if (!ad.name || !ad.placement || !ad.code) {
    return res.status(400).json({ error: 'Ad name, placement and ad code are required.' });
  }
  ad.id = ad.id || `ad-${Date.now()}`;
  ad.createdAt = new Date().toISOString().split('T')[0];
  if (ad.status === undefined) ad.status = true;
  db.getState().advertisements.push(ad);
  db.save();
  res.json({ success: true, ad });
});

app.put('/api/admin/ads/:id', requireAdmin, (req: Request, res: Response) => {
  const index = db.getState().advertisements.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Advertisement not found.' });
  db.getState().advertisements[index] = { ...db.getState().advertisements[index], ...req.body };
  db.save();
  res.json({ success: true, ad: db.getState().advertisements[index] });
});

app.patch('/api/admin/ads/:id/toggle', requireAdmin, (req: Request, res: Response) => {
  const ad = db.getState().advertisements.find(a => a.id === req.params.id);
  if (!ad) return res.status(404).json({ error: 'Advertisement not found.' });
  ad.status = !ad.status;
  db.save();
  res.json({ success: true, ad });
});

app.delete('/api/admin/ads/:id', requireAdmin, (req: Request, res: Response) => {
  db.getState().advertisements = db.getState().advertisements.filter(a => a.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// Ads.txt Management
app.put('/api/admin/ads-txt', requireAdmin, (req: Request, res: Response) => {
  const { content } = req.body;
  db.getState().settings.adsTxt = content || '';
  db.save();
  res.json({ success: true, adsTxt: db.getState().settings.adsTxt });
});

// Media Library
app.post('/api/admin/media', requireAdmin, (req: Request, res: Response) => {
  const { name, url, size, mimeType } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'Name and URL are required.' });
  const mediaItem = {
    id: `media-${Date.now()}`,
    name,
    url,
    size: size || 'Unknown',
    mimeType: mimeType || 'image/jpeg',
    uploadedAt: new Date().toISOString().split('T')[0],
  };
  db.getState().media.unshift(mediaItem);
  db.save();
  res.json({ success: true, media: mediaItem });
});

app.delete('/api/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  db.getState().media = db.getState().media.filter(m => m.id !== req.params.id);
  db.save();
  res.json({ success: true });
});

// SEO & Settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  db.getState().settings = { ...db.getState().settings, ...req.body };
  db.save();
  res.json({ success: true, settings: db.getState().settings });
});

// Analytics
app.get('/api/admin/analytics', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getState().analytics);
});

// ==========================================
// 6. VITE & STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ToolBox BD server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
