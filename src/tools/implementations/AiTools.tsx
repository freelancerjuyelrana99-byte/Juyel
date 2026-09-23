import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiToolsProps {
  slug: string;
}

export const AiTools: React.FC<AiToolsProps> = ({ slug }) => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState('General audience');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Determine custom instructions based on tool slug
  const getToolConfig = () => {
    switch (slug) {
      case 'youtube-title-generator':
        return {
          title: 'YouTube Title Generator',
          placeholder: 'Enter your video topic or keywords (e.g., Learn Web Development in 30 Days)',
          system: 'You are a top YouTube viral strategist. Generate 10 high-CTR, click-worthy, engaging, and SEO-optimized YouTube video titles with different hooks (curiosity, how-to, lists, numbers, bold claims). Format cleanly with bullet points.',
        };
      case 'youtube-description-generator':
        return {
          title: 'YouTube Description Generator',
          placeholder: 'Describe your video content and main takeaways...',
          system: 'You are an SEO YouTube growth expert. Generate a comprehensive, professional video description including: an engaging 2-sentence hook, bulleted timestamps/chapters outline, relevant hashtags, call to actions (Subscribe, Links, Socials), and keywords for search ranking.',
        };
      case 'blog-idea-generator':
        return {
          title: 'Blog Idea Generator',
          placeholder: 'Enter your niche or industry (e.g., Remote Work, Freelancing in Bangladesh, AI)',
          system: 'Generate 10 viral, high-traffic blog post ideas with working titles, search intent explanation, and a brief 1-sentence outline for each.',
        };
      case 'social-media-caption-generator':
        return {
          title: 'Social Media Caption Generator',
          placeholder: 'What is your post about? (e.g., Launching a new online course)',
          system: 'You are a social media copywriter. Write 3 distinct social media caption variations (Short & Punchy, Storytelling, and Value-Driven) with suitable emojis, clear call-to-actions, and 5 relevant hashtags.',
        };
      case 'facebook-post-generator':
        return {
          title: 'Facebook Post Generator',
          placeholder: 'What do you want to share with your Facebook audience?',
          system: 'Write a high-engagement Facebook post designed to maximize comments and shares. Include an attention-grabbing first line, relatable conversational body, question at the end to spur discussion, and aesthetic line breaks.',
        };
      case 'product-description-generator':
        return {
          title: 'Product Description Generator',
          placeholder: 'Product name, key features, and material/specs...',
          system: 'You are an eCommerce conversion copywriter. Craft a compelling product description that highlights benefits over features, paints an emotional picture of ownership, lists 4 bulleted key specs, and ends with an urgent call-to-action.',
        };
      case 'email-generator':
        return {
          title: 'Email Generator',
          placeholder: 'What is the purpose of this email? (e.g., Pitching freelance services, Following up on unpaid invoice, Resignation letter)',
          system: 'Write a polished, clear email with a catchy subject line, warm professional opening, clear body paragraphs, and courteous sign-off.',
        };
      case 'cover-letter-generator':
        return {
          title: 'Cover Letter Generator',
          placeholder: 'Enter your target job role, key skills, and company name...',
          system: 'Generate a standout, modern cover letter that immediately proves relevance, highlights quantifiable past achievements, and shows enthusiasm for the specific company culture without sounding generic or cliché.',
        };
      case 'client-proposal-generator':
        return {
          title: 'Client Proposal Generator',
          placeholder: 'Describe the client project (e.g., Redesigning a Shopify eCommerce store for fashion brand)...',
          system: 'Write a high-converting freelance client proposal structured with: 1. Project Understanding & Problem Analysis, 2. Proposed Solution & Step-by-Step Milestones, 3. Expected Deliverables, 4. Estimated Timeline & Pricing structure, 5. Next Steps call to action.',
        };
      case 'client-reply-generator':
        return {
          title: 'Client Reply Generator',
          placeholder: 'Paste the client message or question you need to reply to...',
          system: 'Write 3 thoughtful client response options: 1. Professional & Direct, 2. Warm & Relationship-building, 3. Firm/Negotiating boundaries or pricing respectfully.',
        };
      case 'hashtag-generator':
        return {
          title: 'Hashtag Generator',
          placeholder: 'Enter topic, niche, or keywords (e.g., Dhaka street food, photography)',
          system: 'Generate 30 curated hashtags categorized into High Volume (broad), Medium Competition (niche-specific), and Low Competition (community targeted). Group them cleanly for easy 1-click copying.',
        };
      default:
        return {
          title: 'AI Productivity Assistant',
          placeholder: 'Describe what you need AI to generate or assist you with...',
          system: 'You are an expert AI productivity assistant for ToolBox BD. Provide crisp, high quality, actionable output.',
        };
    }
  };

  const config = getToolConfig();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please provide a topic or prompt.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');

    const fullPrompt = `Topic / Input: ${topic}
Tone of Voice: ${tone}
Target Audience: ${targetAudience}
${additionalDetails ? `Additional Instructions: ${additionalDetails}` : ''}`;

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          systemInstruction: config.system,
          toolType: slug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      setResult(data.result);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Configuration Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center justify-between">
            <span>What are you creating?</span>
            <span className="text-purple-400 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3" /> Powered by Gemini
            </span>
          </label>
          <textarea
            rows={3}
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={config.placeholder}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Tone of Voice</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            >
              <option value="Professional">Professional & Polished</option>
              <option value="Engaging & Viral">Engaging & High-CTR</option>
              <option value="Casual & Friendly">Casual & Friendly</option>
              <option value="Persuasive & Sales-oriented">Persuasive & Sales-Oriented</option>
              <option value="Academic & Formal">Academic & Formal</option>
              <option value="Funny & Humorous">Funny & Humorous</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="e.g. Students, Freelance Clients, Tech enthusiasts"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">Free, unlimited server-side generation</span>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking & Writing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate Result</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Result Display Box */}
      {result && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-purple-500/40 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Generated Result
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
          </div>

          <div className="text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed pt-2 selection:bg-purple-500/30">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
