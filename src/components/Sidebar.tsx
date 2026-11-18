import React from 'react';
import {
  BookOpen,
  LayoutGrid,
  MessageSquareText,
  MessagesSquare,
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
  { id: 'ask', label: 'Ask Doubt', mobileLabel: 'Ask AI', icon: MessageSquareText },
  { id: 'community', label: 'Community', mobileLabel: 'Community', icon: MessagesSquare },
  { id: 'resources', label: 'Resources', mobileLabel: 'Resources', icon: BookOpen },
  { id: 'mentors', label: 'Mentors', mobileLabel: 'Mentors', icon: Users },
];

const TAB_TITLES: Record<NavTab, string> = {
  overview: 'DOUBTLY',
  ask: 'Ask Doubt',
  community: 'Community',
  resources: 'Resources',
  mentors: 'Mentors',
  profile: 'Profile',
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  profile,
}) => {
  return (
    <>
      {/* Desktop / iPadOS Fixed Left Sidebar */}
      <aside
        aria-label="Primary navigation"
        className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 flex-col justify-between bg-[#F9EFEF]/90 backdrop-blur-md border-r border-[#EFE2E2] px-4 py-6 z-30"
      >
        <div>
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-xl hover:bg-[#FFE4E1]/50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45B72]"
          >
            <span className="w-7 h-7 rounded-lg bg-[#FFE4E1] border border-[#F2CECA] flex items-center justify-center text-[13px] font-bold text-[#A64258]">
              D
            </span>
            <span className="text-[14px] font-semibold tracking-[0.14em] text-[#221D1E] whitespace-nowrap">
              DOUBTLY
            </span>
          </button>

          <nav className="mt-7 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 w-full min-h-[42px] px-3 py-2 rounded-xl text-[14px] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45B72] ${
                    isActive
                      ? 'bg-[#FFE4E1] text-[#221D1E] font-semibold shadow-[0_1px_2px_rgba(166,66,88,0.06)]'
                      : 'text-[#7B6F71] hover:text-[#221D1E] hover:bg-[#FFFFFF]/70 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 ${
                      isActive ? 'text-[#C45B72]' : 'text-[#7B6F71]'
                    }`}
                    strokeWidth={isActive ? 2.1 : 1.75}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Profile Row */}
        <div className="pt-4 border-t border-[#EFE2E2]">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-3 w-full min-h-[48px] px-2.5 py-2 rounded-xl text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C45B72] ${
              activeTab === 'profile'
                ? 'bg-[#FFE4E1] border border-[#F2CECA]'
                : 'bg-[#FFFFFF]/75 border border-[#EFE2E2] hover:bg-[#FFFFFF]'
            }`}
          >
            <Avatar
              src={profile.avatarUrl}
              alt={profile.name}
              initials="AR"
              sizeClass="w-8 h-8"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-[#221D1E] truncate">
                {profile.name}
              </p>
              <p className="text-[12px] text-[#7B6F71] truncate">
                1st Year · CS
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* Mobile iOS Translucent Sticky Navigation Bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between h-12 px-4 bg-[#FCF6F6]/85 backdrop-blur-md border-b border-[#EFE2E2]">
        <button
          type="button"
          onClick={() => onNavigate('overview')}
          className="min-h-[44px] flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span className="w-6 h-6 rounded-md bg-[#FFE4E1] border border-[#F2CECA] flex items-center justify-center text-[11px] font-bold text-[#A64258]">
            D
          </span>
          <span className="text-[14px] font-semibold text-[#221D1E]">
            {TAB_TITLES[activeTab]}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="Open student profile"
          className="min-h-[44px] min-w-[44px] flex items-center justify-end gap-2 rounded-xl active:opacity-70 whitespace-nowrap shrink-0"
        >
          <span className="text-[13px] font-medium text-[#A64258]">Alex</span>
          <Avatar
            src={profile.avatarUrl}
            alt={profile.name}
            initials="AR"
            sizeClass="w-7 h-7"
          />
        </button>
      </header>

      {/* Mobile iOS Translucent Bottom Tab Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 h-14 pb-safe bg-[#FCF6F6]/90 backdrop-blur-lg border-t border-[#EFE2E2] grid grid-cols-5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] tracking-tight transition-colors duration-150 active:scale-95 ${
                isActive ? 'text-[#C45B72] font-semibold' : 'text-[#7B6F71] font-medium'
              }`}
            >
              <Icon
                className={`w-[21px] h-[21px] ${
                  isActive ? 'text-[#C45B72]' : 'text-[#7B6F71]'
                }`}
                strokeWidth={isActive ? 2.2 : 1.75}
              />
              <span className="whitespace-nowrap">{item.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
