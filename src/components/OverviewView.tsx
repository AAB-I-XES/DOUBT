import React, { useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal, User } from 'lucide-react';
import {
  Mentor,
  NavTab,
  RecentDoubtSummary,
  SubjectName,
} from '../types/doubtly';
import { SUBJECT_LIST } from '../data/academicData';

interface OverviewViewProps {
  recentDoubts: RecentDoubtSummary[];
  mentors: Mentor[];
  resolvedCount: number;
  communityRepliesCount: number;
  savedResourcesCount: number;
  onAskQuickQuestion: (question: string, subject: SubjectName) => void;
  onOpenRecentDoubt: (item: RecentDoubtSummary) => void;
  onNavigate: (tab: NavTab) => void;
  onRequestMentor: (mentor: Mentor) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  recentDoubts,
  mentors,
  resolvedCount,
  communityRepliesCount,
  savedResourcesCount,
  onAskQuickQuestion,
  onOpenRecentDoubt,
  onNavigate,
  onRequestMentor,
}) => {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState<SubjectName>('Calculus');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    onAskQuickQuestion(trimmed, subject);
    setQuestion('');
  };

  const visibleDoubts =
    activeFilter === 'All'
      ? recentDoubts
      : recentDoubts.filter((d) => d.subject === activeFilter);

  return (
    <div className="min-h-full bg-[#FBBFB5]">
      {/* Top Coral Peach Header Zone (Matching Reference Screen 2) */}
      <div className="px-4 sm:px-8 pt-5 pb-7 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 md:hidden mb-4">
          <span className="text-[13px] font-bold tracking-[0.16em] text-[#141212]">
            DOUBTLY
          </span>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className="min-h-[36px] inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCEBE8]/90 text-[12.5px] font-semibold text-[#141212]"
          >
            <User className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Shristii</span>
          </button>
        </div>

        {/* White Pill Search / Quick Doubt Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 bg-[#FFFFFF] rounded-full px-4 h-12 shadow-[0_2px_10px_rgba(20,18,18,0.05)]">
            <Search className="w-4 h-4 text-[#6E5B59] shrink-0" strokeWidth={2} />
            <label htmlFor="overview-question-input" className="sr-only">
              What are you stuck on?
            </label>
            <input
              id="overview-question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What are you stuck on?"
              className="flex-1 min-w-0 bg-transparent text-[14.5px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
            />
            <select
              aria-label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value as SubjectName)}
              className="hidden sm:block text-[12.5px] font-medium text-[#141212] bg-[#FCEBE8] rounded-full px-3 py-1 focus:outline-none"
            >
              {SUBJECT_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="General">General</option>
            </select>
          </div>

          <button
            type="submit"
            aria-label="Ask DOUBTLY"
            disabled={!question.trim()}
            className="w-12 h-12 rounded-full bg-[#141212] text-[#FFFFFF] flex items-center justify-center shrink-0 hover:bg-[#2B2626] active:scale-95 disabled:opacity-45 transition-all"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </form>
      </div>

      {/* Curved Pale Misty Rose Main Sheet */}
      <div className="bg-[#FCEBE8] rounded-t-[32px] min-h-[calc(100vh-110px)] px-4 sm:px-8 pt-7 pb-28 md:pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Editorial Two-Line Hero Header + Action */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[12.5px] font-medium text-[#6E5B59]">
                Semester 1 · Computer Science
              </p>
              <h1 className="mt-1 text-[28px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#141212] leading-[1.08]">
                Good morning,
                <br />
                Shristii.
              </h1>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('ask')}
              aria-label="Open full Ask AI workspace"
              className="w-10 h-10 rounded-full bg-[#F6D5D0] flex items-center justify-center text-[#141212] hover:bg-[#FBBFB5] transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Horizontal Black/Outlined Subject Filter Pills (Exact Picture Style) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {['All', ...SUBJECT_LIST].map((subj) => {
              const active = activeFilter === subj;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => setActiveFilter(subj)}
                  className={`min-h-[36px] px-4 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#141212] text-[#FFFFFF]'
                      : 'border border-[#141212]/35 text-[#141212] hover:bg-[#F6D5D0]/70'
                  }`}
                >
                  {subj}
                </button>
              );
            })}
          </div>

          {/* Recent Doubts 2-Column Mobile / 2-Column Desktop Blush Tile Grid (Exact Picture Style) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-[#141212]">
                Recent questions
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('community')}
                className="text-[13px] font-medium text-[#6E5B59] hover:text-[#141212]"
              >
                Community →
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              {visibleDoubts.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenRecentDoubt(item)}
                  className="bg-[#F6D5D0] hover:bg-[#F3C9C3] active:scale-[0.98] rounded-[22px] p-4 text-left flex flex-col justify-between min-h-[142px] transition-all"
                >
                  <div>
                    <span className="text-[11.5px] font-semibold text-[#6E5B59]">
                      {item.subject}
                    </span>
                    <p className="mt-1.5 text-[14px] font-semibold text-[#141212] leading-snug line-clamp-3">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-3 text-[11.5px] font-medium text-[#141212]/70">
                    {item.status}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Learning Summary + Available Mentors Responsive Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Compact Summary Tiles */}
            <section className="lg:col-span-5 space-y-3">
              <h2 className="text-[15px] font-semibold text-[#141212]">
                This week
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#FFF9F8] rounded-[20px] p-4">
                  <p className="text-[11.5px] font-medium text-[#6E5B59]">Resolved</p>
                  <p className="mt-1.5 text-[22px] font-bold text-[#141212] tabular-nums">
                    {resolvedCount}
                  </p>
                </div>
                <div className="bg-[#FFF9F8] rounded-[20px] p-4">
                  <p className="text-[11.5px] font-medium text-[#6E5B59]">Replies</p>
                  <p className="mt-1.5 text-[22px] font-bold text-[#141212] tabular-nums">
                    {communityRepliesCount}
                  </p>
                </div>
                <div className="bg-[#FFF9F8] rounded-[20px] p-4">
                  <p className="text-[11.5px] font-medium text-[#6E5B59]">Saved</p>
                  <p className="mt-1.5 text-[22px] font-bold text-[#141212] tabular-nums">
                    {savedResourcesCount}
                  </p>
                </div>
              </div>
            </section>

            {/* Available Mentors (Picture-Free Monograms + Soft Peach Action Pills) */}
            <section className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold text-[#141212]">
                  Available mentors
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigate('mentors')}
                  className="text-[13px] font-medium text-[#6E5B59] hover:text-[#141212]"
                >
                  View all →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mentors.slice(0, 4).map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-[#FFF9F8] rounded-[20px] p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-10 h-10 rounded-full bg-[#F6D5D0] flex items-center justify-center text-[12.5px] font-bold text-[#141212] shrink-0">
                        {mentor.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#141212] truncate">
                          {mentor.name}
                        </p>
                        <p className="text-[11.5px] text-[#6E5B59] truncate">
                          {mentor.availability}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRequestMentor(mentor)}
                      className="min-h-[34px] px-3.5 py-1 rounded-full bg-[#FBBFB5] text-[12px] font-semibold text-[#141212] hover:bg-[#F7ACA0] active:scale-95 transition-all shrink-0"
                    >
                      Ask
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
