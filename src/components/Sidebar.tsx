import React from 'react';
import {
  BookOpen,
  LayoutGrid,
  MessageSquareText,
  MessagesSquare,
  User,
  Users,
} from 'lucide-react';
import { NavTab, StudentProfile } from '../types/doubtly';

interface SidebarProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  profile: StudentProfile;
}

const NAV_ITEMS: Array<{
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'ask', label: 'Ask Doubt', icon: MessageSquareText },
  { id: 'community', label: 'Community', icon: MessagesSquare },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'mentors', label: 'Mentors', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  profile,
}) => {
  return (
    <>
      {/* Desktop / PC Left Sidebar (No DP / No Photos) */}
      <aside
        aria-label="Primary navigation"
        className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-60 flex-col justify-between bg-[#FCEBE8] border-r border-[#EED0CC] px-4 py-6 z-30"
      >
        <div>
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-full hover:bg-[#F6D5D0]/60 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141212]"
          >
            <span className="w-7 h-7 rounded-full bg-[#FBBFB5] flex items-center justify-center text-[13px] font-bold text-[#141212]">
              D
            </span>
            <span className="text-[14px] font-bold tracking-[0.14em] text-[#141212] whitespace-nowrap">
              DOUBTLY
            </span>
          </button>

          <nav className="mt-7 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 w-full min-h-[42px] px-4 py-2 rounded-full text-[13.5px] transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141212] ${
                    isActive
                      ? 'bg-[#141212] text-[#FFFFFF] font-semibold'
                      : 'text-[#6E5B59] hover:text-[#141212] hover:bg-[#F6D5D0]/60 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-[17px] h-[17px] shrink-0 ${
                      isActive ? 'text-[#FFFFFF]' : 'text-[#6E5B59]'
                    }`}
                    strokeWidth={isActive ? 2.1 : 1.75}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Picture-Free Student Profile Trigger */}
        <div className="pt-4 border-t border-[#EED0CC]">
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`flex items-center justify-between gap-3 w-full min-h-[48px] px-4 py-2.5 rounded-2xl text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141212] ${
              activeTab === 'profile'
                ? 'bg-[#141212] text-[#FFFFFF]'
                : 'bg-[#F6D5D0]/80 hover:bg-[#F6D5D0] text-[#141212]'
            }`}
          >
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold truncate">
                {profile.name}
              </p>
              <p
                className={`text-[11.5px] truncate ${
                  activeTab === 'profile' ? 'text-[#FFFFFF]/75' : 'text-[#6E5B59]'
                }`}
              >
                1st Year · CS
              </p>
            </div>
            <User
              className={`w-4 h-4 shrink-0 ${
                activeTab === 'profile' ? 'text-[#FFFFFF]' : 'text-[#6E5B59]'
              }`}
              strokeWidth={1.85}
            />
          </button>
        </div>
      </aside>

      {/* Mobile Floating Dark iOS Dock (Matching reference image bottom pill) */}
      <div className="md:hidden fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none pb-safe">
        <nav
          aria-label="Mobile navigation"
          className="pointer-events-auto flex items-center gap-1.5 bg-[#141212] text-[#FFFFFF] px-2.5 py-1.5 rounded-full shadow-[0_10px_28px_rgba(20,18,18,0.25)]"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                onClick={() => onNavigate(item.id)}
                className={`min-w-[44px] min-h-[40px] px-3 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#141212]'
                    : 'text-[#FFFFFF]/75 hover:text-[#FFFFFF]'
                }`}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                {isActive && (
                  <span className="whitespace-nowrap">{item.label === 'Ask Doubt' ? 'Ask' : item.label}</span>
                )}
              </button>
            );
          })}
          <button
            type="button"
            aria-label="Profile"
            onClick={() => onNavigate('profile')}
            className={`min-w-[40px] min-h-[40px] px-2.5 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              activeTab === 'profile'
                ? 'bg-[#FBBFB5] text-[#141212]'
                : 'text-[#FFFFFF]/75 hover:text-[#FFFFFF]'
            }`}
          >
            <User className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
          </button>
        </nav>
      </div>
    </>
  );
};
