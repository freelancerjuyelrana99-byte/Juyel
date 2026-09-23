import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check, RefreshCw, KeyRound, Play, Pause, RotateCcw, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UtilityToolsProps {
  slug: string;
}

export const UtilityTools: React.FC<UtilityToolsProps> = ({ slug }) => {
  // QR Code State
  const [qrText, setQrText] = useState('https://toolboxbd.com');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBg, setQrBg] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(250);
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Password Generator State
  const [pwLength, setPwLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  // Stopwatch State
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isSwRunning, setIsSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Random Number State
  const [rndMin, setRndMin] = useState(1);
  const [rndMax, setRndMax] = useState(100);
  const [rndCount, setRndCount] = useState(5);
  const [rndResults, setRndResults] = useState<number[]>([]);

  const [copied, setCopied] = useState(false);

  const handleCopy = (str: string) => {
    navigator.clipboard.writeText(str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR Code
  useEffect(() => {
    if (slug === 'qr-code-generator' && qrText) {
      QRCode.toDataURL(
        qrText,
        {
          width: qrSize,
          margin: 2,
          color: {
            dark: qrColor,
            light: qrBg,
          },
        },
        (err, url) => {
          if (!err && url) setQrDataUrl(url);
        }
      );
    }
  }, [qrText, qrColor, qrBg, qrSize, slug]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'toolboxbd-qrcode.png';
    a.click();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  // Generate Strong Password
  const generatePassword = () => {
    let chars = '';
    if (includeUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) chars += '0123456789';
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let res = '';
    const array = new Uint32Array(pwLength);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < pwLength; i++) {
      res += chars[array[i] % chars.length];
    }
    setPassword(res);
  };

  useEffect(() => {
    if (slug === 'password-generator') generatePassword();
  }, [slug]);

  // Stopwatch Logic
  useEffect(() => {
    let interval: any;
    if (isSwRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isSwRunning]);

  const formatSw = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  // 1. QR Code Generator
  if (slug === 'qr-code-generator') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Enter URL or Text</label>
              <input
                type="text"
                value={qrText}
                onChange={e => setQrText(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Color</label>
                <input
                  type="color"
                  value={qrColor}
                  onChange={e => setQrColor(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer bg-slate-800 border border-slate-700"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Background</label>
                <input
                  type="color"
                  value={qrBg}
                  onChange={e => setQrBg(e.target.value)}
                  className="w-full h-10 rounded-lg cursor-pointer bg-slate-800 border border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Size ({qrSize}px)</label>
              <input
                type="range"
                min="150"
                max="400"
                value={qrSize}
                onChange={e => setQrSize(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            {qrDataUrl ? (
              <div className="p-3 bg-white rounded-2xl shadow-xl mb-4">
                <img src={qrDataUrl} alt="Generated QR Code" className="max-w-[200px] h-auto rounded-lg" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <QrCode className="w-12 h-12 text-slate-600" />
              </div>
            )}

            <button
              onClick={downloadQR}
              disabled={!qrDataUrl}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" /> Download QR Code PNG
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Password Generator
  if (slug === 'password-generator') {
    return (
      <div className="space-y-6 max-w-xl mx-auto">
        {/* Output box */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-between">
          <span className="font-mono text-lg font-bold text-cyan-400 break-all select-all">{password}</span>
          <div className="flex space-x-1.5 ml-2 flex-shrink-0">
            <button
              onClick={generatePassword}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleCopy(password)}
              className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Customization Settings */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Password Length</span>
              <span className="text-cyan-400 font-mono text-sm">{pwLength} chars</span>
            </div>
            <input
              type="range"
              min="8"
              max="48"
              value={pwLength}
              onChange={e => {
                setPwLength(Number(e.target.value));
                generatePassword();
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={e => {
                  setIncludeUpper(e.target.checked);
                  generatePassword();
                }}
                className="rounded accent-cyan-500"
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={e => {
                  setIncludeLower(e.target.checked);
                  generatePassword();
                }}
                className="rounded accent-cyan-500"
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={e => {
                  setIncludeNumbers(e.target.checked);
                  generatePassword();
                }}
                className="rounded accent-cyan-500"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={e => {
                  setIncludeSymbols(e.target.checked);
                  generatePassword();
                }}
                className="rounded accent-cyan-500"
              />
              <span>Symbols (!@#$%)</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // 3. Stopwatch & Timer
  if (slug === 'stopwatch-timer') {
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="text-6xl font-black text-cyan-400 font-mono tracking-tight mb-6">
            {formatSw(stopwatchTime)}
          </div>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsSwRunning(!isSwRunning)}
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 ${
                isSwRunning ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
              }`}
            >
              {isSwRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSwRunning ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => {
                if (stopwatchTime > 0) setLaps(prev => [stopwatchTime, ...prev]);
              }}
              disabled={!isSwRunning}
              className="px-4 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40"
            >
              Lap
            </button>
            <button
              onClick={() => {
                setIsSwRunning(false);
                setStopwatchTime(0);
                setLaps([]);
              }}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {laps.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 max-h-48 overflow-y-auto space-y-2 text-xs font-mono">
            {laps.map((lap, idx) => (
              <div key={idx} className="flex justify-between px-3 py-1.5 rounded bg-slate-800/60 text-slate-300">
                <span>Lap #{laps.length - idx}</span>
                <span className="text-cyan-400">{formatSw(lap)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default: Random Number Generator
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-3 gap-3 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Min Value</label>
          <input
            type="number"
            value={rndMin}
            onChange={e => setRndMin(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Max Value</label>
          <input
            type="number"
            value={rndMax}
            onChange={e => setRndMax(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 block mb-1">Count</label>
          <input
            type="number"
            value={rndCount}
            onChange={e => setRndCount(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
          />
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            const list: number[] = [];
            for (let i = 0; i < rndCount; i++) {
              list.push(Math.floor(Math.random() * (rndMax - rndMin + 1)) + rndMin);
            }
            setRndResults(list);
            confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
          }}
          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950"
        >
          Generate Random Numbers
        </button>
      </div>

      {rndResults.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center p-6 rounded-2xl bg-slate-900 border border-cyan-500/30">
          {rndResults.map((n, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 font-mono font-black text-xl border border-cyan-500/30"
            >
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
