import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Sliders, Check, RotateCw, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ImageToolsProps {
  slug: string;
}

export const ImageTools: React.FC<ImageToolsProps> = ({ slug }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('image');
  const [quality, setQuality] = useState(0.8);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setFileName(file.name.replace(/\.[^/.]+$/, ''));
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = event => {
      const src = event.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setAspectRatio(img.naturalWidth / img.naturalHeight);
        processImage(src, img.naturalWidth, img.naturalHeight, quality, rotation, outputFormat);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const processImage = (
    src: string,
    targetW: number,
    targetH: number,
    targetQ: number,
    rot: number,
    format: string
  ) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle 90/270 rotation dimension swap
      if (rot === 90 || rot === 270) {
        canvas.width = targetH;
        canvas.height = targetW;
      } else {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
      ctx.restore();

      const outFmt = slug === 'jpg-to-png' ? 'image/png' : slug === 'png-to-jpg' ? 'image/jpeg' : slug === 'webp-converter' ? 'image/webp' : format;
      const dataUrl = canvas.toDataURL(outFmt, targetQ);
      setProcessedUrl(dataUrl);

      // Estimate compressed size
      const head = `data:${outFmt};base64,`;
      const base64Str = dataUrl.substring(head.length);
      const decodedLen = Math.round((base64Str.length * 3) / 4);
      setCompressedSize(decodedLen);
    };
    img.src = src;
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    const ext = slug === 'jpg-to-png' ? 'png' : slug === 'webp-converter' ? 'webp' : 'jpg';
    a.download = `${fileName}-toolboxbd.${ext}`;
    a.click();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!imageSrc ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/60"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-4 border border-cyan-500/20">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Click to Upload Image</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Supports JPG, PNG, WebP, GIF. All processing is done 100% locally in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Adjust Settings</h4>
                  <p className="text-xs text-slate-400">File: {imageFile?.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setProcessedUrl(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Upload Different Image
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Quality Slider */}
              <div>
                <label className="text-xs font-semibold text-slate-300 flex justify-between mb-1.5">
                  <span>Quality: {Math.round(quality * 100)}%</span>
                  <span className="text-cyan-400 font-mono">
                    {compressedSize > 0 && originalSize > 0
                      ? `${Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))}% smaller`
                      : ''}
                  </span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={e => {
                    const q = parseFloat(e.target.value);
                    setQuality(q);
                    if (imageSrc) processImage(imageSrc, width, height, q, rotation, outputFormat);
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Dimensions */}
              <div className="flex items-center space-x-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={e => {
                      const w = parseInt(e.target.value) || 100;
                      setWidth(w);
                      const h = keepAspect ? Math.round(w / aspectRatio) : height;
                      if (keepAspect) setHeight(h);
                      if (imageSrc) processImage(imageSrc, w, h, quality, rotation, outputFormat);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => {
                      const h = parseInt(e.target.value) || 100;
                      setHeight(h);
                      const w = keepAspect ? Math.round(h * aspectRatio) : width;
                      if (keepAspect) setWidth(w);
                      if (imageSrc) processImage(imageSrc, w, h, quality, rotation, outputFormat);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Rotation & Output Format */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const nextRot = (rotation + 90) % 360;
                    setRotation(nextRot);
                    if (imageSrc) processImage(imageSrc, width, height, quality, nextRot, outputFormat);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Rotate 90°
                </button>
                <select
                  value={outputFormat}
                  onChange={e => {
                    const fmt = e.target.value as any;
                    setOutputFormat(fmt);
                    if (imageSrc) processImage(imageSrc, width, height, quality, rotation, fmt);
                  }}
                  className="px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Side-by-Side Preview & Download */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Original Image ({formatSize(originalSize)})
              </span>
              <div className="max-h-72 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/60 p-2">
                <img src={imageSrc} alt="Original preview" className="max-h-64 object-contain rounded-lg" />
              </div>
            </div>

            {/* Compressed/Processed */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-center">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                Optimized Result ({formatSize(compressedSize)})
              </span>
              <div className="max-h-72 flex items-center justify-center overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/60 p-2">
                {processedUrl ? (
                  <img src={processedUrl} alt="Processed preview" className="max-h-64 object-contain rounded-lg" />
                ) : (
                  <div className="py-20 text-slate-500">Processing...</div>
                )}
              </div>
            </div>
          </div>

          {/* Download Action */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={handleDownload}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Optimized Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
