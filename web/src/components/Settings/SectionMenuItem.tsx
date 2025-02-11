import type { LucideIcon } from 'lucide-react';
import type React from 'react';

interface SettingMenuItemProps {
  text: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
}

const SectionMenuItem: React.FC<SettingMenuItemProps> = ({
  text,
  icon: IconComponent,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex w-auto max-w-full cursor-pointer select-none flex-row items-center justify-start rounded-lg px-3 leading-8 hover:opacity-80 ${
        isSelected ? 'bg-zinc-100 shadow dark:bg-zinc-900' : ''
      }`}
    >
      <IconComponent className="mr-2 h-auto w-4 shrink-0 opacity-80" />
      <span className="truncate">{text}</span>
    </div>
  );
};

export default SectionMenuItem;
