import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  const icons = LucideIcons as unknown as Record<string, React.FC<any>>;
  const IconComponent = icons[name] || LucideIcons.Wrench;
  return <IconComponent className={className} size={size} />;
};
