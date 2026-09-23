import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Upload, Download, Trash2, Plus, FileText, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PdfToolsProps {
  slug: string;
}

interface ImageItem {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
}

export const PdfTools: React.FC<PdfToolsProps> = ({ slug }) => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'p' | 'l'>('p');
  const [margin, setMargin] = useState<number>(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = event => {
        const dataUrl = event.target?.result as string;
        setImages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2),
            name: file.name,
            dataUrl,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) doc.addPage();
        const item = images[i];

        // Calculate aspect fit within page margins
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        await new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => {
            const imgAspect = img.naturalWidth / img.naturalHeight;
            let drawW = usableWidth;
            let drawH = drawW / imgAspect;

            if (drawH > usableHeight) {
              drawH = usableHeight;
              drawW = drawH * imgAspect;
            }

            const posX = margin + (usableWidth - drawW) / 2;
            const posY = margin + (usableHeight - drawH) / 2;

            doc.addImage(item.dataUrl, 'JPEG', posX, posY, drawW, drawH, undefined, 'FAST');
            resolve();
          };
          img.src = item.dataUrl;
        });
      }

      doc.save(`toolboxbd-converted-${Date.now()}.pdf`);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Error creating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/60"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3 border border-cyan-500/20">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">
          {images.length === 0 ? 'Select Images to Convert to PDF' : 'Add More Images'}
        </h3>
        <p className="text-xs text-slate-400">
          Select multiple JPG, PNG, or WebP photos. Reorder and convert into a single PDF document.
        </p>
      </div>

      {/* Selected Images List */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <span className="font-bold text-cyan-400">{images.length}</span> images selected
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Page:</span>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(e.target.value as any)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="a4">A4 Standard</option>
                  <option value="letter">US Letter</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Orientation:</span>
                <select
                  value={orientation}
                  onChange={e => setOrientation(e.target.value as any)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="p">Portrait</option>
                  <option value="l">Landscape</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 text-xs">
                <span className="text-slate-400">Margin:</span>
                <select
                  value={margin}
                  onChange={e => setMargin(Number(e.target.value))}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value={0}>Zero Margin</option>
                  <option value={10}>Normal (10mm)</option>
                  <option value={20}>Wide (20mm)</option>
                </select>
              </div>

              <button
                onClick={() => setImages([])}
                className="text-xs px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900/60 p-2"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center mb-2">
                  <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span className="truncate max-w-[100px] font-mono">#{index + 1} {img.name}</span>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="p-1 rounded hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4 text-center">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white shadow-lg shadow-rose-500/20 flex items-center justify-center space-x-2 mx-auto transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download Generated PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
