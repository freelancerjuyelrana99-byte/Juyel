import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Code, ShieldCheck, RefreshCw, Hash, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeveloperToolsProps {
  slug: string;
}

export const DeveloperTools: React.FC<DeveloperToolsProps> = ({ slug }) => {
  // JSON State
  const [jsonInput, setJsonInput] = useState('{"brand":"ToolBox BD","toolsCount":45,"status":"active"}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Base64 State
  const [b64Input, setB64Input] = useState('ToolBox BD - All Your Useful Tools in One Place');
  const [b64Output, setB64Output] = useState('');

  // URL Encoder/Decoder State
  const [urlInput, setUrlInput] = useState('https://toolboxbd.com/search?query=bangla tool&filter=free');
  const [urlOutput, setUrlOutput] = useState('');

  // UUID State
  const [uuids, setUuids] = useState<string[]>([]);
  const [uuidCount, setUuidCount] = useState(5);

  // Hash State
  const [hashInput, setHashInput] = useState('ToolBox BD');
  const [hashes, setHashes] = useState<{ sha1: string; sha256: string; sha512: string }>({
    sha1: '',
    sha256: '',
    sha512: '',
  });

  // Timestamp State
  const [timestamp, setTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));

  // Color Converter State
  const [hexColor, setHexColor] = useState('#06b6d4');

  // Regex State
  const [regexPattern, setRegexPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('Contact us at support@toolboxbd.com or info@example.org for assistance.');
  const [regexMatches, setRegexMatches] = useState<string[]>([]);

  const [copied, setCopied] = useState(false);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. JSON Operations
  const formatJSON = (spaces = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, spaces));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  // 2. Base64 Operations
  const encodeBase64 = () => {
    try {
      setB64Output(btoa(unescape(encodeURIComponent(b64Input))));
    } catch {
      setB64Output('Error encoding base64');
    }
  };

  const decodeBase64 = () => {
    try {
      setB64Output(decodeURIComponent(escape(atob(b64Input))));
    } catch {
      setB64Output('Invalid Base64 string');
    }
  };

  // 3. UUID Generator
  const generateUUIDs = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      list.push(crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }));
    }
    setUuids(list);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  // 4. Crypto Hashes
  const computeHashes = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const buf256 = await crypto.subtle.digest('SHA-256', data);
    const hash256 = Array.from(new Uint8Array(buf256)).map(b => b.toString(16).padStart(2, '0')).join('');

    const buf512 = await crypto.subtle.digest('SHA-512', data);
    const hash512 = Array.from(new Uint8Array(buf512)).map(b => b.toString(16).padStart(2, '0')).join('');

    const buf1 = await crypto.subtle.digest('SHA-1', data);
    const hash1 = Array.from(new Uint8Array(buf1)).map(b => b.toString(16).padStart(2, '0')).join('');

    setHashes({ sha1: hash1, sha256: hash256, sha512: hash512 });
  };

  useEffect(() => {
    if (slug === 'hash-generator') computeHashes(hashInput);
    if (slug === 'uuid-generator') generateUUIDs();
    if (slug === 'json-formatter-validator') formatJSON(2);
    if (slug === 'base64-encoder-decoder') encodeBase64();
  }, [slug]);

  // Live timestamp ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Regex Matcher
  useEffect(() => {
    if (slug === 'regex-tester') {
      try {
        const regex = new RegExp(regexPattern, regexFlags);
        const matches = regexText.match(regex) || [];
        setRegexMatches(matches);
      } catch {
        setRegexMatches([]);
      }
    }
  }, [regexPattern, regexFlags, regexText, slug]);

  // Render JSON Formatter
  if (slug === 'json-formatter-validator') {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => formatJSON(2)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
            >
              Format (2 Spaces)
            </button>
            <button
              onClick={() => formatJSON(4)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
            >
              Format (4 Spaces)
            </button>
            <button
              onClick={minifyJSON}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              Minify
            </button>
          </div>
          {jsonOutput && (
            <button
              onClick={() => handleCopy(jsonOutput)}
              className="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Result'}</span>
            </button>
          )}
        </div>

        {jsonError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            ⚠️ {jsonError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">Input JSON</label>
            <textarea
              rows={12}
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1.5">Formatted Output</label>
            <textarea
              rows={12}
              readOnly
              value={jsonOutput}
              className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Render UUID Generator
  if (slug === 'uuid-generator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <label className="text-xs font-bold text-slate-300">Quantity:</label>
          <select
            value={uuidCount}
            onChange={e => setUuidCount(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value={1}>1 UUID</option>
            <option value={5}>5 UUIDs</option>
            <option value={10}>10 UUIDs</option>
            <option value={25}>25 UUIDs</option>
          </select>
          <button
            onClick={generateUUIDs}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Generate
          </button>
          <button
            onClick={() => handleCopy(uuids.join('\n'))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 ml-auto flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" /> Copy All
          </button>
        </div>

        <div className="space-y-2">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300"
            >
              <span>{id}</span>
              <button
                onClick={() => handleCopy(id)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Hash Generator
  if (slug === 'hash-generator') {
    return (
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1.5">Input Text for Hashing</label>
          <input
            type="text"
            value={hashInput}
            onChange={e => {
              setHashInput(e.target.value);
              computeHashes(e.target.value);
            }}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm"
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>SHA-256 (256-bit)</span>
              <button onClick={() => handleCopy(hashes.sha256)} className="text-cyan-400 hover:underline">Copy</button>
            </div>
            <div className="font-mono text-xs text-cyan-300 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {hashes.sha256}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>SHA-512 (512-bit)</span>
              <button onClick={() => handleCopy(hashes.sha512)} className="text-cyan-400 hover:underline">Copy</button>
            </div>
            <div className="font-mono text-xs text-indigo-300 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {hashes.sha512}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>SHA-1</span>
              <button onClick={() => handleCopy(hashes.sha1)} className="text-cyan-400 hover:underline">Copy</button>
            </div>
            <div className="font-mono text-xs text-purple-300 break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              {hashes.sha1}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Base64 Encoder / Decoder
  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        <button
          onClick={encodeBase64}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950"
        >
          Encode to Base64
        </button>
        <button
          onClick={decodeBase64}
          className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
        >
          Decode from Base64
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1.5">Input Text</label>
          <textarea
            rows={8}
            value={b64Input}
            onChange={e => setB64Input(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-cyan-400">Result</label>
            {b64Output && (
              <button onClick={() => handleCopy(b64Output)} className="text-xs text-slate-300 hover:text-white">
                Copy
              </button>
            )}
          </div>
          <textarea
            rows={8}
            readOnly
            value={b64Output}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono"
          />
        </div>
      </div>
    </div>
  );
};
