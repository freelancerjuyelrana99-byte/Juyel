import React, { useState } from 'react';
import { Copy, Check, Trash2, Download, AlignLeft, Type, Sparkles } from 'lucide-react';

interface TextToolsProps {
  slug: string;
}

export const TextTools: React.FC<TextToolsProps> = ({ slug }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Statistics
  const charCountWithSpaces = text.length;
  const charCountWithoutSpaces = text.replace(/\s/g, '').length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentenceCount = text.trim() === '' ? 0 : (text.match(/[\w|\)][.?!]+(\s|$)/g) || []).length;
  const paragraphCount = text.trim() === '' ? 0 : text.split(/\n+/).filter(p => p.trim() !== '').length;
  const readingTime = Math.ceil(wordCount / 200); // 200 wpm standard

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'toolboxbd-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Transformation actions
  const toUppercase = () => setText(text.toUpperCase());
  const toLowercase = () => setText(text.toLowerCase());
  const toTitleCase = () => {
    setText(text.toLowerCase().replace(/(?:^|\s|-)\S/g, char => char.toUpperCase()));
  };
  const toSentenceCase = () => {
    setText(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()));
  };
  const toCamelCase = () => {
    setText(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
        .trim()
    );
  };
  const toSnakeCase = () => {
    setText(
      text
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
    );
  };
  const toKebabCase = () => {
    setText(
      text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
    );
  };
  const removeDuplicates = () => {
    const lines = text.split('\n');
    const unique = Array.from(new Set(lines));
    setText(unique.join('\n'));
  };
  const removeExtraSpaces = () => {
    setText(text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim());
  };
  const sortAZ = () => {
    const lines = text.split('\n');
    setText(lines.sort((a, b) => a.localeCompare(b)).join('\n'));
  };
  const sortZA = () => {
    const lines = text.split('\n');
    setText(lines.sort((a, b) => b.localeCompare(a)).join('\n'));
  };
  const reverseChars = () => {
    setText(text.split('').reverse().join(''));
  };
  const reverseWords = () => {
    setText(text.split(/\s+/).reverse().join(' '));
  };
  const reverseLines = () => {
    setText(text.split('\n').reverse().join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Live Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Words</span>
          <span className="text-xl font-black text-cyan-400 font-mono">{wordCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Characters</span>
          <span className="text-xl font-black text-indigo-400 font-mono">{charCountWithSpaces}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">No Spaces</span>
          <span className="text-xl font-black text-purple-400 font-mono">{charCountWithoutSpaces}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Sentences</span>
          <span className="text-xl font-black text-emerald-400 font-mono">{sentenceCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Paragraphs</span>
          <span className="text-xl font-black text-amber-400 font-mono">{paragraphCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Read Time</span>
          <span className="text-xl font-black text-rose-400 font-mono">{readingTime} min</span>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={10}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type or paste your text here to analyze, count, convert case, sort, or format..."
          className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 text-sm font-sans focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
        />
        {text && (
          <div className="absolute top-3 right-3 flex items-center space-x-1.5">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 border border-slate-700 shadow"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-700"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
          Quick Text Transformations
        </span>
        <div className="flex flex-wrap gap-2">
          <button onClick={toUppercase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            UPPERCASE
          </button>
          <button onClick={toLowercase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            lowercase
          </button>
          <button onClick={toTitleCase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            Title Case
          </button>
          <button onClick={toSentenceCase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            Sentence case
          </button>
          <button onClick={toCamelCase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            camelCase
          </button>
          <button onClick={toSnakeCase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            snake_case
          </button>
          <button onClick={toKebabCase} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
            kebab-case
          </button>
          <button onClick={removeDuplicates} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Remove Duplicate Lines
          </button>
          <button onClick={removeExtraSpaces} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Remove Extra Spaces
          </button>
          <button onClick={sortAZ} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Sort (A - Z)
          </button>
          <button onClick={sortZA} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Sort (Z - A)
          </button>
          <button onClick={reverseChars} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
            Reverse Chars
          </button>
          <button onClick={reverseWords} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
            Reverse Words
          </button>
          <button onClick={reverseLines} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700">
            Reverse Lines
          </button>
        </div>
      </div>

      {/* Export / Download */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleDownload}
          disabled={!text}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-2 disabled:opacity-40 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download .TXT</span>
        </button>
      </div>
    </div>
  );
};
