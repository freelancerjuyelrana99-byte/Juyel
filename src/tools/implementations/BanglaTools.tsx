import React, { useState } from 'react';
import { Copy, Check, RotateCcw, Languages, Heart, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BanglaToolsProps {
  slug: string;
}

// Phonetic Banglish to Bangla mappings
const phoneticMap: Record<string, string> = {
  ami: 'আমি',
  tumi: 'তুমি',
  apni: 'আপনি',
  bhalo: 'ভালো',
  achi: 'আছি',
  achis: 'আছিস',
  kemon: 'কেমন',
  achho: 'আছো',
  dhaka: 'ঢাকা',
  bangladesh: 'বাংলাদেশ',
  kichu: 'কিছু',
  kore: 'করে',
  hobe: 'হবে',
  kintu: 'কিন্তু',
  ekhon: 'এখন',
  shomoy: 'সময়',
  bhalobashi: 'ভালোবাসি',
  shokal: 'সকাল',
  rat: 'রাত',
  kaaj: 'কাজ',
  bondhu: 'বন্ধু',
  poralekha: 'পড়াশোনা',
  taka: 'টাকা',
  desh: 'দেশ',
  shundor: 'সুন্দর',
};

// Bangla status & caption bank
const banglaStatusPresets = {
  romantic: [
    'তুমি আমার সেই অনুভূতি, যা কোনো শব্দের সংজ্ঞায় বাঁধা যায় না। ❤️',
    'হাজারটা ব্যস্ততার মাঝেও মনটা শুধু তোমার একটু খবর খুঁজে ফিরে। ✨',
    'তোমার হাসিটাই আমার ক্লান্ত দিনের সবচেয়ে শান্তির আশ্রয়। 🌸',
    'কিছু মানুষ জীবনে গল্প হয়ে নয়, জীবনের প্রতিটি পাতা হয়ে রয়ে যায়।',
  ],
  motivational: [
    'বাস্তবতা কখনো সহজ নয়, কিন্তু তোমার মনোবল তার চেয়েও অনেক বেশি শক্তিশালী! 🚀',
    'কঠিন সময় চিরকাল থাকে না, কিন্তু দৃঢ়চেতা মানুষ চিরকাল টিকে থাকে। 💡',
    'প্রতিদিনের ছোট ছোট চেষ্টাই একদিন বিশাল সফলতার রূপ নেয়। 🌟',
    'হার মেনে নেওয়া সবচেয়ে সহজ কাজ, কিন্তু চেষ্টা চালিয়ে যাওয়াটাই বীরত্ব।',
  ],
  islamic: [
    'সবর করুন, নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন। — আল কুরআন 🤲',
    'তকদিরে যা লেখা আছে তা কখনোই হাতছাড়া হবে না, তাই সর্বদা আলহামদুলিল্লাহ বলুন। 🌙',
    'আল্লাহর সন্তুষ্টিতেই আসল শান্তি ও পরম মুক্তি। 🌸',
  ],
  attitude: [
    'নিজের যোগ্যতায় বাঁচি, অন্যের করুণায় মাথা নত করার মানুষ আমি নই! 🦁',
    'কারো সাথে অহংকার করি না, তবে যে সম্মান বোঝে না তার ছায়াও মাড়াই না। ⚡',
    'সবাইকে ভালো লাগা সম্ভব নয়, আর আমি তো সবার পছন্দ হওয়ার জন্য জন্মাইনি! 🔥',
  ],
};

// Formal Application templates
const applicationTemplates = {
  leave: `তারিখ: [তারিখ]
বরাবর,
প্রধান শিক্ষক / অধ্যক্ষ / বিভাগীয় প্রধান,
[প্রতিষ্ঠানের নাম],
[ঠিকানা]।

বিষয়: ছুটির জন্য আবেদন।

মহোদয়,
বিনীত নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানের [শ্রেণি/বিভাগ] এর একজন নিয়মিত শিক্ষার্থী/কর্মচারী। হঠাৎ জরুরি পারিবারিক প্রয়োজনে / অসুস্থতার কারণে আগামী [শুরুর তারিখ] হতে [শেষের তারিখ] পর্যন্ত মোট [দিন সংখ্যা] দিন ক্লাসে/অফিসে উপস্থিত থাকতে পারব না।

অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমাকে উক্ত দিনগুলোর জন্য নৈমিত্তিক ছুটি মঞ্জুর করে বাধিত করবেন।

বিনীত নিবেদক,
[আপনার নাম]
রোল / আইডি: [আইডি নম্বর]
মোবাইল: [মোবাইল নম্বর]`,
  bank: `তারিখ: [তারিখ]
বরাবর,
শাখা ব্যবস্থাপক,
[ব্যাংকের নাম],
[শাখার নাম]।

বিষয়: ব্যাংক স্টেটমেন্ট ও নতুন চেক বই পাওয়ার আবেদন।

জনাব,
বিনীত নিবেদন এই যে, আমি আপনার শাখার একজন নিয়মিত হিসাবধারী। আমার সঞ্চয়ী/চলতি হিসাব নম্বর: [হিসাব নম্বর]। জরুরি দাপ্তরিক কাজের জন্য আমার বিগত ৬ মাসের ব্যাংক স্টেটমেন্ট এবং একটি নতুন চেক বই প্রয়োজন।

অতএব, অনুগ্রহপূর্বক আমার উল্লেখিত হিসাবের স্টেটমেন্ট ও চেক বই প্রদানের ব্যবস্থা গ্রহণে মর্জি হয়।

বিনীত,
[আপনার নাম]
স্বাক্ষর:
হিসাব নম্বর: [হিসাব নম্বর]`,
};

export const BanglaTools: React.FC<BanglaToolsProps> = ({ slug }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusCategory, setStatusCategory] = useState<'romantic' | 'motivational' | 'islamic' | 'attitude'>('romantic');

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  // Convert Banglish to Bangla
  const convertBanglishToBangla = (input: string) => {
    const words = input.split(/(\s+|[.,!?])/);
    const converted = words.map(w => {
      const clean = w.toLowerCase().trim();
      return phoneticMap[clean] || w;
    });
    return converted.join('');
  };

  // Simple phonetic Banglish converter
  const convertBanglaToBanglish = (input: string) => {
    // Reverse phonetic dictionary
    const reverseMap: Record<string, string> = {
      'আমি': 'Ami',
      'তুমি': 'Tumi',
      'আপনি': 'Apni',
      'ভালো': 'Bhalo',
      'আছি': 'Achi',
      'কেমন': 'Kemon',
      'ঢাকা': 'Dhaka',
      'বাংলাদেশ': 'Bangladesh',
      'ভালোবাসি': 'Bhalobashi',
      'বন্ধু': 'Bondhu',
      'টাকা': 'Taka',
      'কাজ': 'Kaaj',
      'সুন্দর': 'Shundor',
    };
    let res = input;
    Object.keys(reverseMap).forEach(k => {
      res = res.replaceAll(k, reverseMap[k]);
    });
    return res;
  };

  // 1. Bangla Application Writer
  if (slug === 'bangla-application-writer') {
    return (
      <div className="space-y-6 font-bangla">
        <div className="flex space-x-2">
          <button
            onClick={() => setOutputText(applicationTemplates.leave)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
          >
            ছুটির আবেদন ফরম্যাট
          </button>
          <button
            onClick={() => setOutputText(applicationTemplates.bank)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
          >
            ব্যাংকের দরখাস্ত ফরম্যাট
          </button>
        </div>

        <div className="relative">
          <textarea
            rows={12}
            value={outputText || applicationTemplates.leave}
            onChange={e => setOutputText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-bangla leading-relaxed"
          />
          <button
            onClick={() => handleCopy(outputText || applicationTemplates.leave)}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. Bangla Status & Caption Generator
  if (slug === 'bangla-status-generator') {
    return (
      <div className="space-y-6 font-bangla">
        <div className="flex flex-wrap gap-2">
          {(['romantic', 'motivational', 'islamic', 'attitude'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setStatusCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                statusCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'romantic' ? 'রোমান্টিক ও ভালোবাসা' : cat === 'motivational' ? 'অনুপ্রেরণামূলক' : cat === 'islamic' ? 'ইসলামিক বাণী' : 'অ্যাটিটিউড ও বাস্তব'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banglaStatusPresets[statusCategory].map((status, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between group"
            >
              <p className="text-sm text-slate-100 leading-relaxed mb-4 font-bangla">{status}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy(status)}
                  className="px-3 py-1 rounded-lg text-xs bg-slate-800 group-hover:bg-cyan-500/20 text-slate-300 group-hover:text-cyan-300 border border-slate-700 group-hover:border-cyan-500/30 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>কপি করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Default: Converter (Bangla to Banglish or Banglish to Bangla)
  return (
    <div className="space-y-6 font-bangla">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2 font-sans">
            {slug === 'bangla-to-banglish-converter' ? 'বাংলা টেক্সট লিখুন' : 'বাংলিশ টাইপ করুন (e.g., ami bhalo achi)'}
          </label>
          <textarea
            rows={8}
            value={inputText}
            onChange={e => {
              const val = e.target.value;
              setInputText(val);
              if (slug === 'bangla-to-banglish-converter') {
                setOutputText(convertBanglaToBanglish(val));
              } else {
                setOutputText(convertBanglishToBangla(val));
              }
            }}
            placeholder={slug === 'bangla-to-banglish-converter' ? 'আমি তোমাকে অনেক ভালোবাসি...' : 'ami tomake bhalobashi...'}
            className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 font-bangla leading-relaxed"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2 font-sans">
            <label className="text-xs font-bold text-cyan-400">রূপান্তরিত ফলাফল</label>
            {outputText && (
              <button
                onClick={() => handleCopy(outputText)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            )}
          </div>
          <div className="w-full h-48 p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-white text-sm overflow-y-auto font-bangla leading-relaxed">
            {outputText || <span className="text-slate-500 font-sans">এখানে ফলাফল প্রদর্শিত হবে...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
