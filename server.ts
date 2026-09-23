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
// 3. SERVER-SIDE GEMINI AI API WITH HIGH-AVAILABILITY MULTI-MODEL FALLBACK
// ==========================================

function generateSmartTemplate(rawInput: string, toolType?: string): string {
  // Extract topic cleanly
  const lines = rawInput.split('\n');
  const topicLine = lines.find(l => l.startsWith('Topic / Input:')) || lines[0] || 'your topic';
  const topic = topicLine.replace('Topic / Input:', '').trim() || 'Online Productivity & Growth';

  switch (toolType) {
    case 'youtube-title-generator':
      return `🔥 10 High-CTR & Viral YouTube Titles for: "${topic}"

1. How I Mastered ${topic} in 30 Days (And You Can Too)
2. Why 95% of Beginners Fail at ${topic} (Avoid This Mistake!)
3. The Ultimate 2026 Guide to ${topic} (Step-by-Step Tutorial)
4. Stop Doing ${topic} the Old Way! Try This Instead
5. 7 Game-Changing ${topic} Secrets Nobody Talks About
6. Master ${topic} in 15 Minutes: Complete Crash Course
7. The Honest Truth About ${topic} in 2026
8. How to Use ${topic} to Get 10x Results Faster
9. Don't Start ${topic} Until You Watch This Video!
10. I Tested 50 Different ${topic} Strategies — Here's What Actually Works`;

    case 'youtube-description-generator':
      return `📌 Complete YouTube Video Description: ${topic}

In this comprehensive guide, we dive deep into ${topic}. Whether you're a complete beginner or looking to sharpen your existing workflow, this tutorial will walk you through actionable techniques and pro tips.

⏱️ Timestamps & Chapters:
00:00 - Introduction & Key Takeaways
01:45 - Core Fundamentals & Prerequisites
05:10 - Step-by-Step Hands-on Demonstration
09:30 - Common Pitfalls & How to Avoid Them
13:15 - Pro Tips for Scaling & Optimization
16:40 - Summary & Next Steps

🔗 Free Tools & Resources:
• ToolBox BD All-in-One Online Hub: https://toolboxbd.com
• Comprehensive Step-by-Step Guides: https://toolboxbd.com/blog

💬 Leave a comment below with your questions and subscribe for more practical guides!

#${topic.replace(/\s+/g, '')} #Tutorial #ToolBoxBD #LearnOnline #Productivity`;

    case 'blog-idea-generator':
      return `💡 10 Viral Blog Ideas for: "${topic}"

1. "The Beginner's Handbook to ${topic}: Everything You Need to Know"
   • Search Intent: Educational / How-to
   • Outline: Definition, core benefits, setup steps, top 5 tools, and FAQs.

2. "10 Critical ${topic} Mistakes and How to Avoid Them in 2026"
   • Search Intent: Problem-solving / Authority building
   • Outline: Top traps beginners fall into, real-world examples, and preventive strategies.

3. "${topic} vs Alternatives: An Unbiased Comparison"
   • Search Intent: Commercial investigation
   • Outline: Feature comparison table, pros & cons, pricing analysis, and verdict.

4. "How to Optimize Your ${topic} Workflow in 5 Easy Steps"
   • Search Intent: Productivity / Efficiency
   • Outline: Workflow assessment, automation tools, measurement techniques.

5. "The Future of ${topic}: Predictions and Trends for 2026 and Beyond"
   • Search Intent: Thought leadership / Industry insights`;

    case 'social-media-caption-generator':
      return `Option 1: Short & High Engagement ⚡
${topic} completely transformed my workflow this month. 🚀
What is the one skill or tool you can't live without right now? Drop it in the comments! 👇

Option 2: Storytelling & Relatable 📖
When I first started learning about ${topic}, I felt lost in tutorials and information overload.
The turning point was focusing on one small habit every single day. Consistency will always beat intensity. Keep showing up! 🌟

Option 3: Actionable Value 💡
Here are 3 quick rules for mastering ${topic}:
1. Focus on fundamentals before advanced hacks
2. Automate repetitive tasks with free tools
3. Review your weekly progress
Save this post so you can reference it later! 🔖

#${topic.replace(/\s+/g, '')} #Productivity #SelfGrowth #ToolBoxBD #OnlineLearning`;

    case 'facebook-post-generator':
      return `Ever wondered how much difference ${topic} can make in your daily workflow? 🤔

A few weeks ago, I decided to streamline everything. Instead of spending hours on tedious manual tasks, I adopted a simple system that saves hours every week.

Here are the 3 biggest takeaways:
✅ Quality beats quantity every single time
✅ Consistency compounds faster than you think
✅ The right online tools make complex work effortless

Have you explored ${topic} recently? How has your experience been? Let's discuss in the comments below! 👇💬`;

    case 'product-description-generator':
      return `Introducing the Ultimate Solution for ${topic} ✨

Tired of complicated setups and slow performance? Designed from the ground up for modern creators, professionals, and students, this solution delivers speed, reliability, and precision.

Key Features & Specifications:
• ⚡ Lightning Fast: Engineered for zero-lag responsiveness and seamless workflow.
• 🔒 Privacy First: Built with client-first security and zero data leaks.
• 🎯 Intuitive Interface: Clean, distraction-free design accessible to beginners and pros alike.
• 🌐 Universal Compatibility: Works flawlessly across desktop, tablet, and mobile browsers.

Take your ${topic} workflow to the next level today. Try it free on ToolBox BD!`;

    case 'email-generator':
      return `Subject: Regarding ${topic} – Proposal & Next Steps

Hi [Recipient Name],

I hope you're having a productive week.

I am writing to connect with you regarding ${topic}. Given your recent focus on optimizing growth and efficiency, I wanted to share a few actionable ideas that can streamline your process:

1. Accelerate delivery times with lightweight automated tools.
2. Maintain consistent output quality across all projects.
3. Reduce overhead costs with free, browser-based utilities.

I'd welcome the opportunity to discuss this briefly at your convenience. Would you be open to a quick 10-minute catch-up later this week?

Thank you for your time, and I look forward to hearing from you.

Warm regards,

[Your Name]
[Your Title / Organization]
[Your Contact Information]`;

    case 'cover-letter-generator':
      return `Dear Hiring Team,

I am writing to express my enthusiastic interest in the opportunity related to ${topic}. With a solid track record of delivering measurable results, solving complex challenges, and optimizing workflows, I am confident in my ability to make an immediate, positive contribution to your team.

Throughout my career, I have dedicated myself to mastering ${topic} and implementing effective solutions that streamline operations. Some of my core competencies include:
• Designing efficient, scalable processes that improve turnaround times.
• Collaborating cross-functionally to achieve high-impact business objectives.
• Rapidly adopting modern digital tools to elevate quality and productivity.

What excites me most about this role is your commitment to innovation and continuous improvement. I welcome the opportunity to discuss how my skill set and proactive attitude align with your organization's goals.

Thank you for your consideration.

Sincerely,

[Your Name]
[Your Phone Number] | [Your Email]`;

    case 'client-proposal-generator':
      return `📋 Project Proposal: ${topic}

1. Project Overview & Understanding
Thank you for the opportunity to submit a proposal for ${topic}. The goal of this engagement is to deliver a high-quality, scalable solution tailored to your exact requirements and timeline.

2. Scope of Work & Deliverables
• Phase 1: Requirement analysis and workflow architecture
• Phase 2: Design and rapid implementation
• Phase 3: Testing, quality assurance, and refinement
• Phase 4: Final delivery, documentation, and hand-off

3. Why Choose This Approach?
• Proven methodology focused on rapid execution and minimal overhead.
• Transparent communication with regular milestone updates.
• High attention to detail ensuring long-term maintainability.

4. Estimated Timeline & Next Steps
We can kick off immediately upon agreement on milestones. Please review this outline and let me know if you'd like any adjustments!`;

    case 'hashtag-generator':
      return `🏷️ Curated Hashtag Collection for: "${topic}"

🔥 High Volume & Trending:
#${topic.replace(/\s+/g, '')} #TrendingNow #ViralPost #Innovation #DigitalTransformation #FutureTech

🎯 Niche & Targeted:
#${topic.replace(/\s+/g, '')}Tips #${topic.replace(/\s+/g, '')}Hacks #Learn${topic.replace(/\s+/g, '')} #SkillBuilding #OnlineTools

🌱 Community & Engagement:
#ProductivityBD #ToolBoxBD #TechBangladesh #FreelancingBD #StudentLifeBD`;

    default:
      return `✨ AI Productivity Result for: ${topic}

Summary:
Here is a structured, actionable breakdown for ${topic} tailored to your specifications.

Key Steps:
1. Clarify the core objective and measurable deliverables.
2. Use modern digital tools to automate repetitive portions.
3. Test early, gather feedback, and iterate quickly.

Result:
Everything has been tailored to ensure maximum clarity, speed, and real-world usefulness. Feel free to copy or customize further!`;
  }
}

app.post('/api/ai/generate', async (req: Request, res: Response) => {
  const { prompt, systemInstruction, toolType } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Valid prompt is required.' });
  }

  const defaultInstruction =
    'You are an expert AI productivity assistant built for ToolBox BD. Provide clean, well-formatted, high-quality, actionable results without unnecessary preamble.';
  const instruction = systemInstruction || defaultInstruction;

  // Multi-model resilience: attempt standard model first, then fallback models if 503 high demand occurs
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

  for (const model of modelsToTry) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        break; // Jump to smart template if no key is configured
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: instruction,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        return res.json({ result: response.text, toolType, modelUsed: model });
      }
    } catch (error: any) {
      console.warn(
        `Gemini AI model (${model}) temporary issue: ${error?.message || error}. Trying backup...`
      );
      // Wait 350ms before trying the next model
      await new Promise(r => setTimeout(r, 350));
    }
  }

  // If all external API calls are experiencing transient upstream high demand (503),
  // provide our high-quality structured template output so the user never faces a broken UI.
  console.log('Providing high-availability smart template fallback for toolType:', toolType);
  const fallbackResult = generateSmartTemplate(prompt, toolType);
  return res.json({ result: fallbackResult, toolType, fallback: true });
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
