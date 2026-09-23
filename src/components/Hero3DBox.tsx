import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, FileText, Image, Calculator, Type, GraduationCap, DollarSign, Share2 } from 'lucide-react';

interface FloatingIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  initialAngle: number;
  distance: number;
  speed: number;
  heightOffset: number;
}

export const Hero3DBox: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating orbiting tool badge configurations
  const toolIcons: FloatingIcon[] = [
    { id: 'ai', name: 'AI', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/30', initialAngle: 0, distance: 130, speed: 0.008, heightOffset: -30 },
    { id: 'pdf', name: 'PDF', icon: <FileText className="w-3.5 h-3.5" />, color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/30', initialAngle: Math.PI * 0.25, distance: 150, speed: 0.009, heightOffset: 20 },
    { id: 'img', name: 'Image', icon: <Image className="w-3.5 h-3.5" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/30', initialAngle: Math.PI * 0.5, distance: 120, speed: 0.011, heightOffset: -45 },
    { id: 'calc', name: 'Calc', icon: <Calculator className="w-3.5 h-3.5" />, color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/30', initialAngle: Math.PI * 0.75, distance: 160, speed: 0.007, heightOffset: 15 },
    { id: 'text', name: 'Text', icon: <Type className="w-3.5 h-3.5" />, color: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/30', initialAngle: Math.PI * 1.0, distance: 135, speed: 0.008, heightOffset: -10 },
    { id: 'student', name: 'Student', icon: <GraduationCap className="w-3.5 h-3.5" />, color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-indigo-500/30', initialAngle: Math.PI * 1.25, distance: 145, speed: 0.010, heightOffset: 35 },
    { id: 'freelance', name: 'Freelance', icon: <DollarSign className="w-3.5 h-3.5" />, color: 'bg-green-500/20 text-green-300 border-green-500/40 shadow-green-500/30', initialAngle: Math.PI * 1.5, distance: 125, speed: 0.009, heightOffset: -25 },
    { id: 'social', name: 'Social', icon: <Share2 className="w-3.5 h-3.5" />, color: 'bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-pink-500/30', initialAngle: Math.PI * 1.75, distance: 155, speed: 0.007, heightOffset: 5 },
  ];

  const [angles, setAngles] = useState<number[]>(toolIcons.map(t => t.initialAngle));

  // Check hardware performance and user preferences
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isMobile || prefersReducedMotion) {
      setIsLowPerformance(true);
    }
  }, []);

  // Mouse move tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLowPerformance || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Canvas 3D isometric glowing toolbox animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.018;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const tiltX = mousePos.x * 12;
      const tiltY = mousePos.y * 8;

      // Draw subtle glowing outer rings
      ctx.save();
      ctx.translate(cx + tiltX, cy + tiltY);
      
      // Floating motion
      const floatY = Math.sin(time * 1.5) * 8;
      ctx.translate(0, floatY);

      // Gradient halo behind toolbox
      const halo = ctx.createRadialGradient(0, 0, 10, 0, 0, 110);
      halo.addColorStop(0, 'rgba(6, 182, 212, 0.22)');
      halo.addColorStop(0.5, 'rgba(99, 102, 241, 0.12)');
      halo.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, 110, 0, Math.PI * 2);
      ctx.fill();

      // Draw 3D Isometric ToolBox Base
      const bw = 84; // box width
      const bh = 54; // box height
      const bd = 40; // box depth

      // Bottom Shadow
      ctx.beginPath();
      ctx.ellipse(0, bh + 25 - floatY * 0.5, 75, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();

      // Isometric 3D Box Faces
      // Top face
      ctx.beginPath();
      ctx.moveTo(0, -bd);
      ctx.lineTo(bw, -bd * 0.4);
      ctx.lineTo(0, bd * 0.2);
      ctx.lineTo(-bw, -bd * 0.4);
      ctx.closePath();
      const topGrad = ctx.createLinearGradient(-bw, -bd, bw, 0);
      topGrad.addColorStop(0, '#0284c7');
      topGrad.addColorStop(0.6, '#38bdf8');
      topGrad.addColorStop(1, '#818cf8');
      ctx.fillStyle = topGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Left face
      ctx.beginPath();
      ctx.moveTo(-bw, -bd * 0.4);
      ctx.lineTo(0, bd * 0.2);
      ctx.lineTo(0, bd * 0.2 + bh);
      ctx.lineTo(-bw, -bd * 0.4 + bh);
      ctx.closePath();
      const leftGrad = ctx.createLinearGradient(-bw, 0, 0, bh);
      leftGrad.addColorStop(0, '#0369a1');
      leftGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = leftGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(0, bd * 0.2);
      ctx.lineTo(bw, -bd * 0.4);
      ctx.lineTo(bw, -bd * 0.4 + bh);
      ctx.lineTo(0, bd * 0.2 + bh);
      ctx.closePath();
      const rightGrad = ctx.createLinearGradient(0, 0, bw, bh);
      rightGrad.addColorStop(0, '#4f46e5');
      rightGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = rightGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      // Toolbox Handle
      ctx.beginPath();
      ctx.roundRect(-22, -bd - 24, 44, 26, [8, 8, 2, 2]);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.stroke();

      // ToolBox latch / lock badge in center
      ctx.beginPath();
      ctx.roundRect(-10, bd * 0.2 + 8, 20, 16, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Small keyhole dot
      ctx.beginPath();
      ctx.arc(0, bd * 0.2 + 16, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      // Central neon icon badge on top face
      ctx.beginPath();
      ctx.arc(0, -bd * 0.1, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;

      ctx.restore();

      // Update orbiting badge angles
      setAngles(prev => prev.map((a, i) => a + toolIcons[i].speed));

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isLowPerformance]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-[420px] h-[360px] flex items-center justify-center select-none"
    >
      {/* 3D Canvas Centerpiece */}
      <canvas
        ref={canvasRef}
        width={420}
        height={360}
        className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
      />

      {/* Orbiting 3D floating tool badges */}
      {toolIcons.map((tool, idx) => {
        const angle = angles[idx];
        const radX = tool.distance;
        const radY = tool.distance * 0.48; // Isometric tilt
        const x = Math.cos(angle) * radX;
        const y = Math.sin(angle) * radY + tool.heightOffset;
        const scale = 0.85 + Math.sin(angle) * 0.15; // Depth scaling
        const zIndex = Math.sin(angle) > 0 ? 20 : 5; // Foreground vs background

        return (
          <div
            key={tool.id}
            style={{
              transform: `translate(${x}px, ${y}px) scale(${scale})`,
              zIndex,
            }}
            className={`absolute flex items-center space-x-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md transition-transform duration-75 shadow-lg ${tool.color} cursor-default`}
          >
            <span>{tool.icon}</span>
            <span className="text-[11px] font-bold tracking-tight">{tool.name}</span>
          </div>
        );
      })}
    </div>
  );
};
