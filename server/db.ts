import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Category, Tool, BlogPost, VideoItem, PageItem, Advertisement, MediaItem, SiteSettings, AnalyticsData } from '../src/types.js';

const DATA_FILE = path.resolve(process.cwd(), 'server-data.json');

// Default admin hash for "ToolBoxBD@2026!Master"
const DEFAULT_SALT = bcrypt.genSaltSync(10);
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('ToolBoxBD@2026!Master', DEFAULT_SALT);

export interface DBState {
  admin: {
    email: string;
    passwordHash: string;
    lastLogin?: string;
  };
  categories: Category[];
  tools: Tool[];
  posts: BlogPost[];
  videos: VideoItem[];
  pages: PageItem[];
  advertisements: Advertisement[];
  media: MediaItem[];
  settings: SiteSettings;
  analytics: AnalyticsData;
  sessions: { [token: string]: { email: string; expiresAt: number } };
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-ai', name: 'AI Tools', slug: 'ai-tools', description: 'Smart AI assistants for copy, ideas, titles & content creation', icon: 'Sparkles', color: 'from-purple-500 to-indigo-600' },
  { id: 'cat-image', name: 'Image Tools', slug: 'image-tools', description: 'Compress, resize, convert and optimize your photos locally', icon: 'Image', color: 'from-emerald-500 to-teal-600' },
  { id: 'cat-pdf', name: 'PDF Tools', slug: 'pdf-tools', description: 'Convert, merge, compress and manipulate PDF documents', icon: 'FileText', color: 'from-rose-500 to-red-600' },
  { id: 'cat-text', name: 'Text Tools', slug: 'text-tools', description: 'Word counters, case converters, sorters and text cleaners', icon: 'Type', color: 'from-blue-500 to-cyan-600' },
  { id: 'cat-calc', name: 'Calculator Tools', slug: 'calculator-tools', description: 'Age, BMI, Percentage, Salary, EMI and Financial calculators', icon: 'Calculator', color: 'from-amber-500 to-orange-600' },
  { id: 'cat-student', name: 'Student Tools', slug: 'student-tools', description: 'GPA/CGPA calculators, study planners and academic tools', icon: 'GraduationCap', color: 'from-indigo-500 to-blue-600' },
  { id: 'cat-job', name: 'Job & Career Tools', slug: 'job-career-tools', description: 'CV maker, resume builder, cover letter and interview prep', icon: 'Briefcase', color: 'from-cyan-500 to-teal-600' },
  { id: 'cat-freelance', name: 'Freelancing Tools', slug: 'freelancing-tools', description: 'Fiverr gig titles, proposal writers, and hourly rate calculators', icon: 'DollarSign', color: 'from-green-500 to-emerald-600' },
  { id: 'cat-social', name: 'Social Media Tools', slug: 'social-media-tools', description: 'YouTube titles, Instagram captions, hashtags and bio creators', icon: 'Share2', color: 'from-pink-500 to-rose-600' },
  { id: 'cat-bangla', name: 'Bangla Tools', slug: 'bangla-tools', description: 'বাংলা টু বাংলিশ, বাংলা ওয়ার্ড কাউন্টার, স্ট্যাটাস ও দরখাস্ত রাইটার', icon: 'Languages', color: 'from-red-500 to-green-600' },
  { id: 'cat-dev', name: 'Developer Tools', slug: 'developer-tools', description: 'JSON formatter, Base64, URL encoder, UUID, Hash & Regex tester', icon: 'Code', color: 'from-violet-500 to-purple-600' },
  { id: 'cat-utility', name: 'Utility Tools', slug: 'utility-tools', description: 'QR generator, strong password maker, stopwatch & converters', icon: 'Wrench', color: 'from-slate-500 to-gray-700' },
];

export const INITIAL_TOOLS: Tool[] = [
  // 1. AI Tools
  {
    id: 'tool-ai-prompt',
    name: 'AI Prompt Generator',
    slug: 'ai-prompt-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate high-impact, professional prompts for ChatGPT, Claude, Midjourney and Gemini based on your specific task.',
    shortDesc: 'Craft expert prompts for any AI model instantly.',
    icon: 'Sparkles',
    isPopular: true,
    isAi: true,
    published: true,
    features: ['Custom target AI selection', 'Role and context specialization', 'Ready-to-copy structured prompt'],
    howToUse: ['Describe what you want the AI to do', 'Select your role and tone', 'Click Generate to get a prompt'],
    faqs: [{ question: 'Is this prompt generator free?', answer: 'Yes, completely free with no signup required.' }]
  },
  {
    id: 'tool-yt-title',
    name: 'YouTube Title Generator',
    slug: 'youtube-title-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Create viral, high-CTR YouTube titles designed to rank higher and attract clicks.',
    shortDesc: 'Generate click-worthy, SEO-optimized YouTube titles.',
    icon: 'Youtube',
    isPopular: true,
    isAi: true,
    published: true,
    features: ['High CTR formulas', 'SEO keywords included', 'Multiple tone options (hype, educational, curiosity)'],
    howToUse: ['Enter your video topic', 'Choose your niche or emotion', 'Click Generate to see 10 winning titles']
  },
  {
    id: 'tool-yt-desc',
    name: 'YouTube Description Generator',
    slug: 'youtube-description-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate complete, SEO-friendly YouTube video descriptions with timestamps, social links and hashtags.',
    shortDesc: 'Complete YouTube descriptions with timestamps and hashtags.',
    icon: 'FileText',
    isAi: true,
    published: true
  },
  {
    id: 'tool-blog-idea',
    name: 'Blog Idea Generator',
    slug: 'blog-idea-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Discover trending blog post ideas, catchy headlines, and full content outlines for any niche.',
    shortDesc: 'Never run out of blog content ideas again.',
    icon: 'Lightbulb',
    isAi: true,
    published: true
  },
  {
    id: 'tool-social-caption',
    name: 'Social Media Caption Generator',
    slug: 'social-media-caption-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate engaging captions for Instagram, Facebook, LinkedIn and TikTok with relevant emojis and hashtags.',
    shortDesc: 'Engaging captions with emojis and hashtags.',
    icon: 'Share2',
    isPopular: true,
    isAi: true,
    published: true
  },
  {
    id: 'tool-fb-post',
    name: 'Facebook Post Generator',
    slug: 'facebook-post-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Write viral Facebook posts that drive comments, shares and engagement.',
    shortDesc: 'Write high-engagement Facebook posts.',
    icon: 'MessageSquare',
    isAi: true,
    published: true
  },
  {
    id: 'tool-product-desc',
    name: 'Product Description Generator',
    slug: 'product-description-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Craft compelling eCommerce product descriptions that convert visitors into paying customers.',
    shortDesc: 'Sales-driven eCommerce product descriptions.',
    icon: 'ShoppingBag',
    isAi: true,
    published: true
  },
  {
    id: 'tool-email-gen',
    name: 'Email Generator',
    slug: 'email-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate polished professional emails, client inquiries, follow-ups, and sales outreach in seconds.',
    shortDesc: 'Write professional emails for work and clients.',
    icon: 'Mail',
    isPopular: true,
    isAi: true,
    published: true
  },
  {
    id: 'tool-cv-gen',
    name: 'CV Generator',
    slug: 'cv-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate tailored CV summaries, work experience bullet points, and skills for your dream job.',
    shortDesc: 'AI-assisted CV writer and career enhancer.',
    icon: 'FileCheck',
    isAi: true,
    published: true
  },
  {
    id: 'tool-cover-letter',
    name: 'Cover Letter Generator',
    slug: 'cover-letter-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate persuasive cover letters tailored to your job title and target company.',
    shortDesc: 'Custom cover letters tailored to any job opening.',
    icon: 'Send',
    isAi: true,
    published: true
  },
  {
    id: 'tool-client-proposal',
    name: 'Client Proposal Generator',
    slug: 'client-proposal-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Write winning freelance proposals for Upwork, Fiverr, and direct client contracts.',
    shortDesc: 'High-converting freelance proposals that win jobs.',
    icon: 'Award',
    isPopular: true,
    isAi: true,
    published: true
  },
  {
    id: 'tool-client-reply',
    name: 'Client Reply Generator',
    slug: 'client-reply-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate professional responses to tough client questions, price negotiations, and revision requests.',
    shortDesc: 'Respond professionally to tricky client inquiries.',
    icon: 'MessageCircle',
    isAi: true,
    published: true
  },
  {
    id: 'tool-hashtag-gen',
    name: 'Hashtag Generator',
    slug: 'hashtag-generator',
    category: 'AI Tools',
    categoryId: 'cat-ai',
    description: 'Generate high-ranking hashtags tailored for Instagram, TikTok, LinkedIn, and YouTube.',
    shortDesc: 'Generate trending hashtags for any topic.',
    icon: 'Hash',
    isAi: true,
    published: true
  },

  // 2. Image Tools
  {
    id: 'tool-img-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Reduce image file size up to 80% without losing quality. Works 100% locally in your browser for total privacy.',
    shortDesc: 'Compress JPG, PNG & WebP images locally.',
    icon: 'Minimize2',
    isPopular: true,
    published: true,
    features: ['Adjustable compression quality slider', 'Real-time size comparison', '100% Client-side browser processing', 'Zero file uploads to server'],
    howToUse: ['Drag & drop or select your image', 'Adjust compression quality (0.1 to 1.0)', 'Click Download to save your compressed image']
  },
  {
    id: 'tool-img-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Resize images to exact pixel dimensions or percentage scale while maintaining aspect ratio.',
    shortDesc: 'Resize photos to custom width and height.',
    icon: 'Maximize2',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-img-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Crop images with customizable aspect ratios (1:1, 16:9, 4:3) or freeform selection.',
    shortDesc: 'Crop images with preset or custom ratios.',
    icon: 'Crop',
    published: true
  },
  {
    id: 'tool-jpg-to-png',
    name: 'JPG to PNG Converter',
    slug: 'jpg-to-png',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Convert JPG / JPEG images to lossless PNG format directly in your browser.',
    shortDesc: 'Convert JPG images to transparent PNG.',
    icon: 'FileImage',
    published: true
  },
  {
    id: 'tool-png-to-jpg',
    name: 'PNG to JPG Converter',
    slug: 'png-to-jpg',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Convert PNG images to JPG with custom background color fill for transparent areas.',
    shortDesc: 'Convert PNG to JPG with background options.',
    icon: 'Image',
    published: true
  },
  {
    id: 'tool-webp-converter',
    name: 'WebP Converter',
    slug: 'webp-converter',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Convert modern WebP images to JPG/PNG or encode images into lightweight WebP format.',
    shortDesc: 'Convert images to and from next-gen WebP format.',
    icon: 'RefreshCw',
    published: true
  },
  {
    id: 'tool-img-rotator',
    name: 'Image Rotator',
    slug: 'image-rotator',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Rotate images 90°, 180°, 270° or flip horizontally and vertically with live preview.',
    shortDesc: 'Rotate and flip photos instantly.',
    icon: 'RotateCw',
    published: true
  },
  {
    id: 'tool-img-metadata',
    name: 'Image Metadata Viewer',
    slug: 'image-metadata-viewer',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'Inspect image resolution, aspect ratio, file size, MIME type and dominant color palette.',
    shortDesc: 'View dimensions, size and color palette.',
    icon: 'Info',
    published: true
  },
  {
    id: 'tool-img-optimizer',
    name: 'Image Optimizer',
    slug: 'image-optimizer',
    category: 'Image Tools',
    categoryId: 'cat-image',
    description: 'One-click optimization presets for Web, Social Media avatars, and thumbnails.',
    shortDesc: 'One-click presets for Web & Social images.',
    icon: 'Zap',
    published: true
  },

  // 3. PDF Tools
  {
    id: 'tool-jpg-to-pdf',
    name: 'JPG to PDF',
    slug: 'jpg-to-pdf',
    category: 'PDF Tools',
    categoryId: 'cat-pdf',
    description: 'Convert single or multiple JPG images into a clean, printable PDF document.',
    shortDesc: 'Convert JPG images to PDF document.',
    icon: 'FileText',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-images-to-pdf',
    name: 'Images to PDF',
    slug: 'images-to-pdf',
    category: 'PDF Tools',
    categoryId: 'cat-pdf',
    description: 'Combine multiple photos (PNG, JPG, WebP) into a single PDF with page orientation controls.',
    shortDesc: 'Combine multiple images into one PDF.',
    icon: 'Layers',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-pdf-merger',
    name: 'PDF Merger',
    slug: 'pdf-merger',
    category: 'PDF Tools',
    categoryId: 'cat-pdf',
    description: 'Merge multiple documents and text reports into a unified PDF file seamlessly.',
    shortDesc: 'Merge multiple documents into one PDF.',
    icon: 'Copy',
    published: true
  },
  {
    id: 'tool-pdf-splitter',
    name: 'PDF Splitter',
    slug: 'pdf-splitter',
    category: 'PDF Tools',
    categoryId: 'cat-pdf',
    description: 'Extract custom page ranges and split documents into distinct PDF chapters.',
    shortDesc: 'Split PDF files by custom page ranges.',
    icon: 'Scissors',
    published: true
  },
  {
    id: 'tool-pdf-compressor',
    name: 'PDF Compressor',
    slug: 'pdf-compressor',
    category: 'PDF Tools',
    categoryId: 'cat-pdf',
    description: 'Optimize PDF file size for easy email sharing and web uploads.',
    shortDesc: 'Compress PDF documents for easy sharing.',
    icon: 'Minimize',
    published: true
  },

  // 4. Text Tools
  {
    id: 'tool-word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    category: 'Text Tools',
    categoryId: 'cat-text',
    description: 'Real-time count of words, characters (with and without spaces), sentences, paragraphs and reading time.',
    shortDesc: 'Count words, characters, sentences & reading time.',
    icon: 'AlignLeft',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    category: 'Text Tools',
    categoryId: 'cat-text',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case and kebab-case.',
    shortDesc: 'Convert text cases with one click.',
    icon: 'Type',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-remove-duplicates',
    name: 'Remove Duplicate Lines',
    slug: 'remove-duplicate-lines',
    category: 'Text Tools',
    categoryId: 'cat-text',
    description: 'Remove duplicate lines from email lists, logs, or datasets with case-sensitive options.',
    shortDesc: 'Clean lists by removing duplicate entries.',
    icon: 'Trash2',
    published: true
  },
  {
    id: 'tool-remove-spaces',
    name: 'Remove Extra Spaces',
    slug: 'remove-extra-spaces',
    category: 'Text Tools',
    categoryId: 'cat-text',
    description: 'Strip leading, trailing, and repeated whitespace and blank lines from your text.',
    shortDesc: 'Remove excess spaces and clean up messy text.',
    icon: 'Space',
    published: true
  },
  {
    id: 'tool-text-sorter',
    name: 'Text Sorter',
    slug: 'text-sorter',
    category: 'Text Tools',
    categoryId: 'cat-text',
    description: 'Sort lists alphabetically (A-Z or Z-A), by character length, or randomly shuffle lines.',
    shortDesc: 'Sort lists alphabetically, by length or shuffle.',
    icon: 'ArrowDownAZ',
    published: true
  },
  {
    id: 'tool-text-reverser',
    name: 'Text Reverser',
    slug: 'text-reverser',
    category: 'Text Tools',
    categoryId: 'cat-text',
    description: 'Reverse characters, words, or full line orders instantly.',
    shortDesc: 'Reverse text by character, word or line.',
    icon: 'Undo',
    published: true
  },

  // 5. Calculator Tools
  {
    id: 'tool-age-calc',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Calculate your exact age in years, months, days, total hours, and days remaining until your next birthday.',
    shortDesc: 'Calculate exact age, months, days & next birthday.',
    icon: 'Calendar',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-percentage-calc',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Calculate percentage of a number, percentage increase or decrease, and fractional ratios.',
    shortDesc: 'Calculate percentages, increases and discounts.',
    icon: 'Percent',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-bmi-calc',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Calculate Body Mass Index (BMI) using metric or imperial units with health categorization.',
    shortDesc: 'Calculate Body Mass Index & ideal weight.',
    icon: 'Activity',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-discount-calc',
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Find out final sale price, total savings, and applied sales tax on discounted items.',
    shortDesc: 'Calculate discount savings and final sale price.',
    icon: 'Tag',
    published: true
  },
  {
    id: 'tool-profit-loss-calc',
    name: 'Profit/Loss Calculator',
    slug: 'profit-loss-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Calculate net profit, profit margin percentage, loss percentage and breakeven numbers.',
    shortDesc: 'Calculate business profit margin and ROI.',
    icon: 'TrendingUp',
    published: true
  },
  {
    id: 'tool-salary-calc',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Convert hourly, weekly, monthly and annual salary with deductions and take-home pay estimate.',
    shortDesc: 'Convert hourly wage to monthly & annual pay.',
    icon: 'DollarSign',
    published: true
  },
  {
    id: 'tool-loan-emi-calc',
    name: 'Loan & EMI Calculator',
    slug: 'loan-emi-calculator',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Calculate monthly EMI, total interest payable, and payment amortization schedule.',
    shortDesc: 'Calculate loan EMI and total interest breakdown.',
    icon: 'CreditCard',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Convert units across length, mass/weight, temperature, speed, area and digital storage.',
    shortDesc: 'Comprehensive unit converter for all metrics.',
    icon: 'Repeat',
    published: true
  },
  {
    id: 'tool-currency-converter',
    name: 'Currency Converter',
    slug: 'currency-converter',
    category: 'Calculator Tools',
    categoryId: 'cat-calc',
    description: 'Convert between USD, BDT, EUR, GBP, INR, CAD, AUD and major world currencies.',
    shortDesc: 'Convert USD, BDT, EUR and global currencies.',
    icon: 'Coins',
    published: true
  },

  // 6. Student Tools
  {
    id: 'tool-gpa-calc',
    name: 'GPA Calculator',
    slug: 'gpa-calculator',
    category: 'Student Tools',
    categoryId: 'cat-student',
    description: 'Calculate semester GPA on 4.0 or 5.0 scale with custom course credits and letter grades.',
    shortDesc: 'Calculate semester GPA on 4.0 or 5.0 scale.',
    icon: 'Award',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-cgpa-calc',
    name: 'CGPA Calculator',
    slug: 'cgpa-calculator',
    category: 'Student Tools',
    categoryId: 'cat-student',
    description: 'Calculate cumulative grade point average (CGPA) across multiple university semesters.',
    shortDesc: 'Calculate cumulative CGPA across semesters.',
    icon: 'GraduationCap',
    published: true
  },
  {
    id: 'tool-study-time-calc',
    name: 'Study Time Calculator',
    slug: 'study-time-calculator',
    category: 'Student Tools',
    categoryId: 'cat-student',
    description: 'Plan daily study hours and break routines leading up to exam dates.',
    shortDesc: 'Plan study routines and daily schedules.',
    icon: 'Clock',
    published: true
  },

  // 7. Job & Career Tools
  {
    id: 'tool-cv-maker',
    name: 'CV Maker & Resume Builder',
    slug: 'cv-maker',
    category: 'Job & Career Tools',
    categoryId: 'cat-job',
    description: 'Fill in your personal details, education and experience to generate a clean, ATS-friendly resume to download.',
    shortDesc: 'Create a clean, ATS-friendly resume instantly.',
    icon: 'FileText',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-interview-prep',
    name: 'Interview Question Generator',
    slug: 'interview-question-generator',
    category: 'Job & Career Tools',
    categoryId: 'cat-job',
    description: 'Generate real interview questions and suggested answers based on job position and experience level.',
    shortDesc: 'Generate interview questions & model answers.',
    icon: 'HelpCircle',
    published: true
  },

  // 8. Freelancing Tools
  {
    id: 'tool-fiverr-gig-title',
    name: 'Fiverr Gig Title Generator',
    slug: 'fiverr-gig-title-generator',
    category: 'Freelancing Tools',
    categoryId: 'cat-freelance',
    description: 'Generate high-ranking "I will..." Fiverr gig titles containing top searched buyer keywords.',
    shortDesc: 'Create high-ranking Fiverr "I will..." gig titles.',
    icon: 'Tag',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-freelance-rate-calc',
    name: 'Freelance Rate Calculator',
    slug: 'freelance-rate-calculator',
    category: 'Freelancing Tools',
    categoryId: 'cat-freelance',
    description: 'Calculate your ideal hourly and project rates based on living expenses, billable hours and profit goals.',
    shortDesc: 'Determine your ideal hourly and project rates.',
    icon: 'DollarSign',
    published: true
  },

  // 9. Social Media Tools
  {
    id: 'tool-social-bio',
    name: 'Social Media Bio Generator',
    slug: 'social-media-bio-generator',
    category: 'Social Media Tools',
    categoryId: 'cat-social',
    description: 'Create memorable, aesthetic bios for Instagram, Twitter/X, TikTok and LinkedIn.',
    shortDesc: 'Generate catchy bios for Instagram & Twitter.',
    icon: 'UserCheck',
    published: true
  },

  // 10. Bangla Tools
  {
    id: 'tool-bangla-banglish',
    name: 'Bangla to Banglish Converter',
    slug: 'bangla-to-banglish-converter',
    category: 'Bangla Tools',
    categoryId: 'cat-bangla',
    description: 'বাংলা ইউনিকোড টেক্সটকে সহজে পড়ার উপযোগী বাংলিশে রূপান্তর করুন (e.g. আমি ভালো আছি -> Ami bhalo achi)।',
    shortDesc: 'বাংলা টেক্সটকে সহজে বাংলিশে কনভার্ট করুন।',
    icon: 'Languages',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-banglish-bangla',
    name: 'Banglish to Bangla Converter',
    slug: 'banglish-to-bangla-converter',
    category: 'Bangla Tools',
    categoryId: 'cat-bangla',
    description: 'ইংরেজি অক্ষরে লেখা বাংলিশ টাইপ করে তাৎক্ষণিক বিশুদ্ধ বাংলা ইউনিকোডে রূপান্তর করুন (ফনেটিক)।',
    shortDesc: 'বাংলিশ টাইপ করে খাঁটি বাংলা ইউনিকোড পান।',
    icon: 'Type',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-bangla-word-counter',
    name: 'Bangla Word Counter',
    slug: 'bangla-word-counter',
    category: 'Bangla Tools',
    categoryId: 'cat-bangla',
    description: 'বাংলা অনুচ্ছেদ ও আর্টিকেলের সঠিক শব্দ, বর্ণ, যতিচিহ্ন ও পড়ার সময় হিসেব করুন।',
    shortDesc: 'বাংলা শব্দ, অক্ষর ও লাইন গণনা করার টুল।',
    icon: 'AlignLeft',
    published: true
  },
  {
    id: 'tool-bangla-status-gen',
    name: 'Bangla Status & Caption Generator',
    slug: 'bangla-status-generator',
    category: 'Bangla Tools',
    categoryId: 'cat-bangla',
    description: 'ফেসবুক, হোয়াটসঅ্যাপ ও ইন্সটাগ্রামের জন্য রোমান্টিক, মোটিভেশনাল, ইসলামিক ও ভালোবাসার সেরা বাংলা স্ট্যাটাস ও ক্যাপশন।',
    shortDesc: 'রোমান্টিক, ইসলামিক ও মোটিভেশনাল বাংলা ক্যাপশন।',
    icon: 'Smile',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-bangla-app-writer',
    name: 'Bangla Application Writer',
    slug: 'bangla-application-writer',
    category: 'Bangla Tools',
    categoryId: 'cat-bangla',
    description: 'অফিস বা স্কুলের ছুটির আবেদন, চাকরির দরখাস্ত, ব্যাংক ম্যানেজারের কাছে আবেদনপত্র ও প্রত্যয়নপত্রের রেডিমেড ফরম্যাট।',
    shortDesc: 'ছুটি, চাকরি ও ব্যাংকের জন্য অফিসিয়াল দরখাস্ত ফরম্যাট।',
    icon: 'FileText',
    published: true
  },

  // 11. Developer Tools
  {
    id: 'tool-json-formatter',
    name: 'JSON Formatter & Validator',
    slug: 'json-formatter',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Beautify, format, minify and validate JSON data with syntax error detection.',
    shortDesc: 'Beautify, minify and validate JSON code.',
    icon: 'Code',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-base64-converter',
    name: 'Base64 Encoder & Decoder',
    slug: 'base64-converter',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Encode plain text to Base64 or decode Base64 strings back to text.',
    shortDesc: 'Encode and decode Base64 strings easily.',
    icon: 'Key',
    published: true
  },
  {
    id: 'tool-url-encoder',
    name: 'URL Encoder & Decoder',
    slug: 'url-encoder-decoder',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Encode special characters into percent-encoded URLs or decode URLs back to readable format.',
    shortDesc: 'Encode or decode URLs safely.',
    icon: 'Link',
    published: true
  },
  {
    id: 'tool-uuid-gen',
    name: 'UUID Generator',
    slug: 'uuid-generator',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Generate cryptographically random UUID v4 strings in single or batch quantities.',
    shortDesc: 'Generate random UUID v4 identifiers.',
    icon: 'Fingerprint',
    published: true
  },
  {
    id: 'tool-hash-gen',
    name: 'Hash Generator (SHA-256 / MD5)',
    slug: 'hash-generator',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Generate cryptographic hashes using SHA-256, SHA-512, and SHA-1 in your browser.',
    shortDesc: 'Generate SHA-256 and SHA-512 hashes.',
    icon: 'Shield',
    published: true
  },
  {
    id: 'tool-timestamp-converter',
    name: 'Timestamp Converter',
    slug: 'timestamp-converter',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Convert Unix epoch timestamps (seconds/milliseconds) to human-readable dates in local and UTC.',
    shortDesc: 'Convert Unix epoch to readable dates.',
    icon: 'Clock',
    published: true
  },
  {
    id: 'tool-color-converter',
    name: 'Color Converter (HEX/RGB/HSL)',
    slug: 'color-converter',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Convert color values seamlessly between HEX, RGB, HSL and CMYK with a visual color picker.',
    shortDesc: 'Convert between HEX, RGB, HSL & CMYK.',
    icon: 'Palette',
    published: true
  },
  {
    id: 'tool-regex-tester',
    name: 'Regex Tester',
    slug: 'regex-tester',
    category: 'Developer Tools',
    categoryId: 'cat-dev',
    description: 'Test regular expressions against sample text with live match highlights and capture groups.',
    shortDesc: 'Test regular expressions with real-time match highlight.',
    icon: 'Search',
    published: true
  },

  // 12. Utility Tools
  {
    id: 'tool-qr-gen',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    category: 'Utility Tools',
    categoryId: 'cat-utility',
    description: 'Generate high-resolution QR codes for websites, plain text, WiFi networks, phone numbers and vCards. Download in PNG or SVG.',
    shortDesc: 'Create customizable QR codes for links, text & WiFi.',
    icon: 'QrCode',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-password-gen',
    name: 'Password Generator',
    slug: 'password-generator',
    category: 'Utility Tools',
    categoryId: 'cat-utility',
    description: 'Generate strong, unbreakable passwords with custom length, symbols, numbers, and strength indicators.',
    shortDesc: 'Generate ultra-secure passwords with strength meter.',
    icon: 'Lock',
    isPopular: true,
    published: true
  },
  {
    id: 'tool-random-num',
    name: 'Random Number Generator',
    slug: 'random-number-generator',
    category: 'Utility Tools',
    categoryId: 'cat-utility',
    description: 'Generate single or multiple random numbers within any custom minimum and maximum range.',
    shortDesc: 'Generate random numbers within custom ranges.',
    icon: 'Shuffle',
    published: true
  },
  {
    id: 'tool-stopwatch',
    name: 'Stopwatch & Countdown Timer',
    slug: 'stopwatch-timer',
    category: 'Utility Tools',
    categoryId: 'cat-utility',
    description: 'Accurate digital stopwatch with lap recording and customizable countdown timer with audible alert.',
    shortDesc: 'Digital stopwatch with laps & countdown timer.',
    icon: 'Timer',
    published: true
  }
];

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'How to Compress Images Online Without Losing Quality',
    slug: 'how-to-compress-images-online',
    excerpt: 'Learn the difference between lossy and lossless compression and how to optimize photos for ultra-fast web pages.',
    featuredImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
    author: 'ToolBox BD Editorial',
    category: 'Tutorials',
    tags: ['Image Optimization', 'Web Performance', 'SEO', 'Tools'],
    published: true,
    publishDate: '2026-03-15',
    views: 1420,
    content: `Image optimization is one of the most effective ways to speed up your website and reduce mobile data usage. In this guide, we break down how modern compression algorithms work.

### Why Compress Your Images?
Large uncompressed images can exceed 5MB to 10MB each. When mobile visitors visit your webpage, loading multiple high-res photos slows page render down dramatically. Studies show that a 1-second delay in page load causes a 7% loss in conversions.

### Lossless vs Lossy Compression
- **Lossless:** Reduces file size by eliminating redundant metadata without changing a single pixel. Best for logos and sharp illustrations.
- **Lossy:** Intelligently discards micro-variations in colors that the human eye cannot perceive. Reduces file size by up to 80% while looking identical to the original!

### Using ToolBox BD's Free Image Compressor
Our Image Compressor runs entirely in your browser using the HTML5 Canvas API. Your photos never leave your device, ensuring maximum speed and total privacy!`
  },
  {
    id: 'post-2',
    title: 'How to Create a Professional CV and Resume in 2026',
    slug: 'how-to-create-a-professional-cv',
    excerpt: 'Step-by-step blueprint to passing Applicant Tracking Systems (ATS) and impressing hiring managers.',
    featuredImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    author: 'Career Advisor',
    category: 'Career',
    tags: ['Resume', 'Career Advice', 'Job Search', 'CV Maker'],
    published: true,
    publishDate: '2026-03-10',
    views: 980,
    content: `Creating an outstanding resume doesn't require expensive designers. Modern recruiters scan resumes in under 7 seconds, so clarity and structure are paramount.

### Core Elements of a Winning Resume
1. **Clear Header:** Name, professional title, phone number, email, and LinkedIn profile.
2. **Impact-Focused Summary:** 2-3 sentences summarizing your key achievements and core competencies.
3. **Work Experience with Metrics:** Instead of listing daily chores, use the formula: *Accomplished [X], as measured by [Y], by doing [Z]*.
4. **Relevant Skills:** Match keywords directly from the target job posting.

Try our built-in **CV Maker & Resume Builder** under Job & Career Tools to generate a clean PDF template today!`
  },
  {
    id: 'post-3',
    title: 'Best Free Online Tools Every Student Needs in Bangladesh',
    slug: 'best-free-online-tools-for-students',
    excerpt: 'From GPA calculations to essay word counts and study time management, streamline your academic journey.',
    featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    author: 'Student Ambassador',
    category: 'Student Tips',
    tags: ['GPA Calculator', 'Study Tips', 'Bangladesh', 'Productivity'],
    published: true,
    publishDate: '2026-03-05',
    views: 1250,
    content: `Being a student in college or university requires balancing multiple assignments, exams, and extracurriculars. Having the right digital toolbelt saves hours every week.

### 1. GPA & CGPA Calculators
Instead of manually calculating weighted grade points every semester, use our GPA Calculator. It supports both standard 4.0 grading (National University, DU, BUET, North South) and 5.0 scales.

### 2. Word and Character Counter
Ensure your essays and project reports hit exact required word limits without counting manually.

### 3. Study Time & Routine Planner
Break down your syllabus across remaining exam days with structured study blocks.`
  },
  {
    id: 'post-4',
    title: 'How to Convert JPG to PDF for Free Without Installing Software',
    slug: 'how-to-convert-jpg-to-pdf',
    excerpt: 'Easily bundle multiple photos, certificates, or document scans into a single printable PDF.',
    featuredImage: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop&q=80',
    author: 'Tech Guide',
    category: 'Tool Tutorials',
    tags: ['PDF Tools', 'JPG to PDF', 'Document Guide'],
    published: true,
    publishDate: '2026-02-28',
    views: 890,
    content: `Need to submit scanned documents, bank statements, or nid cards in PDF format? You don't need expensive paid software like Adobe Acrobat.

With ToolBox BD, you can select any JPG or PNG photos, arrange their order, and click "Download PDF" to receive a standardized PDF file within milliseconds.`
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'video-1',
    title: 'How to Compress Images to 100KB Without Losing Clarity',
    slug: 'how-to-compress-image-tutorial',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80',
    description: 'A quick 3-minute tutorial demonstrating how to use the ToolBox BD Image Compressor to reduce image file sizes drastically while maintaining crisp visual quality.',
    category: 'Tool Tutorials',
    duration: '03:15',
    tags: ['Image Compressor', 'Web Tutorial', 'Free Tools'],
    published: true,
    publishDate: '2026-03-12',
    views: 850
  },
  {
    id: 'video-2',
    title: 'Build a Winning Upwork & Fiverr Proposal Using AI Tools',
    slug: 'ai-freelance-proposal-guide',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    description: 'Learn how to generate personalized client proposals and find the perfect Fiverr gig keywords to boost client responses.',
    category: 'Freelancing',
    duration: '06:45',
    tags: ['Freelance Proposal', 'Fiverr', 'Upwork', 'AI Tools'],
    published: true,
    publishDate: '2026-03-08',
    views: 1120
  },
  {
    id: 'video-3',
    title: 'Mastering the GPA & CGPA Calculator for University Students',
    slug: 'gpa-cgpa-calculator-guide',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    description: 'Step by step walkthrough on calculating your semester GPA and cumulative CGPA across departments.',
    category: 'Student Tips',
    duration: '04:20',
    tags: ['GPA', 'CGPA', 'Student Guide'],
    published: true,
    publishDate: '2026-03-01',
    views: 640
  },
  {
    id: 'video-4',
    title: 'Best AI Prompt Engineering Techniques for Beginners',
    slug: 'ai-prompt-engineering-tips',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    description: 'How to craft context-rich prompts that extract the best answers and code from Gemini and ChatGPT.',
    category: 'AI Tips',
    duration: '08:10',
    tags: ['AI Prompt', 'Gemini', 'Productivity'],
    published: true,
    publishDate: '2026-02-25',
    views: 1390
  }
];

export const INITIAL_PAGES: PageItem[] = [
  {
    id: 'page-about',
    title: 'About ToolBox BD',
    slug: 'about',
    updatedAt: '2026-03-10',
    content: `## Welcome to ToolBox BD

ToolBox BD is Bangladesh's premier multi-tool platform created to provide free, lightning-fast, and privacy-respecting online utilities for students, freelancers, developers, content creators, and businesses.

### Our Mission
We believe everyday digital tools should be completely free, easy to use, and respectful of user privacy. Many modern websites bombard users with intrusive popups or lock essential features behind paywalls. ToolBox BD is built differently:
- **Zero Software Installation:** Everything runs directly inside your web browser.
- **Client-Side Privacy:** Your images, sensitive text, and documents are processed locally on your device whenever possible.
- **Continuous Expansion:** We regularly roll out new utilities, from AI assistants to specialized Bangla language converters.

Thank you for choosing ToolBox BD!`
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    slug: 'contact',
    updatedAt: '2026-03-10',
    content: `## Get in Touch with ToolBox BD

Have a suggestion for a new tool? Found a bug? Interested in partnership or advertising? We would love to hear from you!

### Contact Details:
- **Email:** support@toolboxbd.com
- **Business Inquiries:** admin@toolboxbd.com
- **Response Time:** We usually respond within 24 to 48 business hours.

### Submit Feedback
You can also reach out through our social media channels or directly email us with your tool ideas!`
  },
  {
    id: 'page-privacy',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    updatedAt: '2026-03-10',
    content: `## Privacy Policy

At ToolBox BD (accessible from https://toolboxbd.com), the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of information collected and recorded by ToolBox BD and how we use it.

### Local File Processing
Most of our tools (including Image Compressor, Resizer, Text Tools, and Calculators) execute directly inside your browser using client-side JavaScript. **We do not upload, save, or store your private images or processed files on our servers.**

### Log Files & Analytics
Like standard websites, ToolBox BD utilizes anonymous log files to analyze trends, administer the site, track user movement on the website, and gather broad demographic information. IP addresses and browser types are not linked to personally identifiable information.

### Cookies and Web Beacons
ToolBox BD uses cookies to store user preferences (such as Light/Dark mode). Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website.

### Third Party Advertising
Third-party ad servers or ad networks use technologies like cookies and JavaScript that are used in their respective advertisements and links that appear on ToolBox BD. You may consult the respective privacy policies of these third-party ad servers for more detailed information.`
  },
  {
    id: 'page-terms',
    title: 'Terms of Service',
    slug: 'terms',
    updatedAt: '2026-03-10',
    content: `## Terms of Service

By accessing ToolBox BD, you agree to comply with and be bound by the following terms and conditions of use.

### Use License
Permission is granted to use ToolBox BD tools for personal, academic, and commercial purposes free of charge. You agree not to:
1. Attempt to decompile or reverse engineer any server-side software.
2. Use automated scrapers or bots to overload our infrastructure.
3. Use our tools for unlawful, malicious, or abusive activities.

### Disclaimer
The tools and materials on ToolBox BD are provided on an 'as is' basis. ToolBox BD makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.`
  },
  {
    id: 'page-disclaimer',
    title: 'Disclaimer',
    slug: 'disclaimer',
    updatedAt: '2026-03-10',
    content: `## Disclaimer

The calculations, conversions, and AI generated outputs on ToolBox BD are provided for informational, educational, and convenience purposes only.

While we strive for extreme accuracy across all financial calculators (such as Loan EMI, Salary, and Profit/Loss) and academic GPA tools, you should verify critical figures with authorized financial institutions or educational boards before making binding decisions.`
  },
  {
    id: 'page-cookie',
    title: 'Cookie Policy',
    slug: 'cookie-policy',
    updatedAt: '2026-03-10',
    content: `## Cookie Policy

This Cookie Policy explains what cookies are, how we use cookies, and your choices regarding cookies on ToolBox BD.

### What are cookies?
Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier.

### How ToolBox BD uses cookies:
- **Essential Cookies:** To remember your theme preference (Dark Mode vs Light Mode).
- **Analytics Cookies:** To anonymously measure visitor counts and popular tools.
- **Advertising Cookies:** Used by advertising networks (such as Google AdSense and Adsterra) to deliver relevant ads.`
  }
];

export const INITIAL_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad-below-hero',
    name: 'Adsterra Below Hero Banner',
    network: 'Adsterra',
    type: 'Responsive',
    code: '<script src="https://pl31483464.profitableratecpmnetwork.com/db/77/79/db7779bfe0e312a783c41c05e63abd3c.js"></script>',
    placement: 'Below Hero',
    device: 'All Devices',
    status: true,
    createdAt: '2026-03-01'
  },
  {
    id: 'ad-between-content',
    name: 'Between Content Placement',
    network: 'Adsterra',
    type: 'Responsive',
    code: '',
    placement: 'Between Content',
    device: 'All Devices',
    status: false,
    createdAt: '2026-03-01'
  },
  {
    id: 'ad-after-tool',
    name: 'After Tool Results Placement',
    network: 'Adsterra',
    type: 'Native',
    code: '',
    placement: 'After Tool',
    device: 'All Devices',
    status: false,
    createdAt: '2026-03-01'
  },
  {
    id: 'ad-blog-bottom',
    name: 'Blog Bottom Placement',
    network: 'Adsterra',
    type: 'Responsive',
    code: '',
    placement: 'Blog Bottom',
    device: 'All Devices',
    status: false,
    createdAt: '2026-03-01'
  },
  {
    id: 'ad-footer',
    name: 'Footer Area Placement',
    network: 'Adsterra',
    type: 'Responsive',
    code: '',
    placement: 'Footer',
    device: 'All Devices',
    status: false,
    createdAt: '2026-03-01'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  siteName: 'ToolBox BD',
  tagline: 'All Your Useful Tools in One Place',
  description: 'Free, fast and easy-to-use online tools for everyday work, study, business and creativity.',
  contactEmail: 'support@toolboxbd.com',
  facebookUrl: 'https://facebook.com/toolboxbd',
  twitterUrl: 'https://twitter.com/toolboxbd',
  youtubeUrl: 'https://youtube.com/@toolboxbd',
  googleAnalyticsId: 'G-MEASUREMENT_ID',
  adsTxt: `# ToolBox BD ads.txt configuration
google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
# Adsterra Network
# adsterra.com, publisher-id, DIRECT
`,
  seoTitle: 'ToolBox BD – All Your Useful Tools in One Place',
  metaDescription: 'Free, fast and easy-to-use online tools for everyday work, study, business and creativity. Image compressor, PDF tools, AI generators, calculators, and Bangla tools.',
  ogImage: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
  maintenanceMode: false
};

export const INITIAL_ANALYTICS: AnalyticsData = {
  totalVisitors: 28450,
  todayVisitors: 1284,
  pageViews: 64920,
  deviceStats: {
    desktop: 58,
    mobile: 36,
    tablet: 6
  },
  topTools: [
    { name: 'Image Compressor', slug: 'image-compressor', views: 8940 },
    { name: 'AI Prompt Generator', slug: 'ai-prompt-generator', views: 7620 },
    { name: 'YouTube Title Generator', slug: 'youtube-title-generator', views: 6310 },
    { name: 'Age Calculator', slug: 'age-calculator', views: 5120 },
    { name: 'Bangla to Banglish Converter', slug: 'bangla-to-banglish-converter', views: 4890 },
    { name: 'CV Maker & Resume Builder', slug: 'cv-maker', views: 4210 },
    { name: 'QR Code Generator', slug: 'qr-code-generator', views: 3950 }
  ],
  topPages: [
    { path: '/', views: 24200 },
    { path: '/tools', views: 18500 },
    { path: '/blog', views: 8200 },
    { path: '/videos', views: 5400 },
    { path: '/category/ai-tools', views: 4900 }
  ],
  dailyViews: [
    { date: '2026-03-17', views: 2100, visitors: 950 },
    { date: '2026-03-18', views: 2450, visitors: 1080 },
    { date: '2026-03-19', views: 2780, visitors: 1150 },
    { date: '2026-03-20', views: 2600, visitors: 1100 },
    { date: '2026-03-21', views: 3100, visitors: 1320 },
    { date: '2026-03-22', views: 2950, visitors: 1240 },
    { date: '2026-03-23', views: 3200, visitors: 1284 }
  ]
};

class DB {
  private state: DBState;

  constructor() {
    this.state = this.load();
  }

  private load(): DBState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...parsed,
          sessions: parsed.sessions || {}
        };
      }
    } catch (e) {
      console.error('Error loading DB file, falling back to initial data:', e);
    }

    const initial: DBState = {
      admin: {
        email: 'admin@toolboxbd.com',
        passwordHash: DEFAULT_PASSWORD_HASH
      },
      categories: INITIAL_CATEGORIES,
      tools: INITIAL_TOOLS,
      posts: INITIAL_POSTS,
      videos: INITIAL_VIDEOS,
      pages: INITIAL_PAGES,
      advertisements: INITIAL_ADVERTISEMENTS,
      media: [],
      settings: INITIAL_SETTINGS,
      analytics: INITIAL_ANALYTICS,
      sessions: {}
    };

    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(data: DBState) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public save() {
    this.saveDirect(this.state);
  }

  public getState(): DBState {
    return this.state;
  }

  public getAdmin() {
    return this.state.admin;
  }

  public updateAdmin(email: string, passwordHash?: string) {
    this.state.admin.email = email;
    if (passwordHash) {
      this.state.admin.passwordHash = passwordHash;
    }
    this.save();
  }

  public createSession(email: string): string {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2);
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.state.sessions[token] = { email, expiresAt };
    this.save();
    return token;
  }

  public validateSession(token?: string): boolean {
    if (!token) return false;
    const session = this.state.sessions[token];
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      delete this.state.sessions[token];
      this.save();
      return false;
    }
    return true;
  }

  public removeSession(token?: string) {
    if (token && this.state.sessions[token]) {
      delete this.state.sessions[token];
      this.save();
    }
  }

  // Analytics increment
  public recordPageView(path: string, slug?: string) {
    this.state.analytics.pageViews += 1;
    this.state.analytics.todayVisitors += 1;
    if (slug) {
      const tool = this.state.tools.find(t => t.slug === slug);
      if (tool) {
        tool.views = (tool.views || 0) + 1;
        const top = this.state.analytics.topTools.find(t => t.slug === slug);
        if (top) top.views += 1;
      }
    }
    const page = this.state.analytics.topPages.find(p => p.path === path);
    if (page) {
      page.views += 1;
    }
    // We don't save to disk on every single pageview to keep disk I/O low, but debounce or batch save
  }
}

export const db = new DB();
