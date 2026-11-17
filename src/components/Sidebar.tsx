import React from 'react';
import {
  LayoutGrid,
  MessageSquareText,
  MessagesSquare,
  BookOpen,
  Users,
} from 'lucide-react';
import { NavTab, StudentProfile } from '../types/doubtly';
import { Avatar } from './Avatar';

interface SidebarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  profile: StudentProfile;
}

const NAV_ITEMS: Array<{
  id: NavTab;
  label: string;
  mobileLabel: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { id: 'overview', label: 'Overview', mobileLabel: 'Overview', icon: LayoutGrid },
  { id: 'ask', label: 'Ask Doubt', mobileLabel: 'Ask', icon: MessageSquareText },
  { id: 'community', label: 'Community', mobileLabel: 'Community', icon: MessagesSquare },
  { id: 'resources', label: 'Resources', mobileLabel: 'Resources', icon: BookOpen },
  { id: 'mentors', label: 'Mentors', mobileLabel: 'Mentors', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  profile,
}) => {
  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside
        aria-label="Primary navigation"
        className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-60 flex-col justify-between bg-[#FAF9F7] border-r border-[#EAE8E5] px-5 py-7 z-30"
      >
        <div>
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A99AE8] rounded-sm"
          >
            <span className="text-[13px] font-semibold tracking-[0.18em] text-[#222222] whitespace-nowrap">
              DOUBTLY
            </span>
          </button>

          <nav className="mt-9 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-[14px] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A99AE8] ${
                    isActive
                      ? 'bg-[#FFFFFF] text-[#222222] font-medium border border-[#EAE8E5]'
                      : 'text-[#858585] hover:text-[#222222] hover:bg-[#F3E8E7]/50 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#7D6CD6]' : 'text-[#858585]'
                    }`}
                    strokeWidth={1.75}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Profile Trigger */}
        <div className="pt-5 border-t border-[#EAE8E5]">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-3 w-full px-2.5 py-2 rounded-md text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A99AE8] ${
              activeTab === 'profile'
                ? 'bg-[#FFFFFF] border border-[#EAE8E5]'
                : 'hover:bg-[#F3E8E7]/50 border border-transparent'
            }`}
          >
            <Avatar
              src={profile.avatarUrl}
              alt={profile.name}
              initials="AR"
              sizeClass="w-8 h-8"
            />
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-[#222222] truncate">
                {profile.name}
              </p>
              <p className="text-[12px] text-[#858585] truncate">
                1st Year · CS
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile Compact Header */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-12 px-4 bg-[#FAF9F7] border-b border-[#EAE8E5]">
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="text-[12.5px] font-semibold tracking-[0.18em] text-[#222222] whitespace-nowrap shrink-0"
        >
          DOUBTLY
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="Open student profile"
          className="flex items-center gap-2 py-1 px-1.5 rounded-md hover:bg-[#F3E8E7]/60 whitespace-nowrap shrink-0"
        >
          <span className="text-[12.5px] font-medium text-[#222222]">Alex</span>
          <Avatar
            src={profile.avatarUrl}
            alt={profile.name}
            initials="AR"
            sizeClass="w-6 h-6"
          />
        </button>
      </header>

      {/* Mobile Compact Bottom Navigation (<= 56px height) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-[#FAF9F7] border-t border-[#EAE8E5] grid grid-cols-5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] transition-colors duration-150 ${
                isActive ? 'text-[#222222] font-medium' : 'text-[#858585]'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? 'text-[#7D6CD6]' : 'text-[#858585]'}`}
                strokeWidth={1.75}
              />
              <span className="whitespace-nowrap">{item.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
