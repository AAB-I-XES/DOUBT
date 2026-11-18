import React, { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import {
  Mentor,
  NavTab,
  RecentDoubtSummary,
  SubjectName,
} from '../types/doubtly';
import { SUBJECT_LIST } from '../data/academicData';
import { Avatar } from './Avatar';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    onAskQuickQuestion(trimmed, subject);
    setQuestion('');
  };

  return (
    <div className="space-y-8">
      {/* iOS Large Navigation Header */}
      <section>
        <p className="text-[13px] font-medium text-[#A64258]">
          First Year · Semester 1 · Computer Science
        </p>
        <h1 className="mt-1 text-[28px] sm:text-[34px] font-bold tracking-[-0.025em] text-[#221D1E] leading-tight">
          Good morning, Alex.
        </h1>
      </section>

      {/* Prominent iOS Grouped Composer */}
      <section aria-label="Quick doubt composer">
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(166,66,88,0.04)] transition-colors focus-within:border-[#C45B72]"
        >
          <label htmlFor="overview-question-input" className="sr-only">
            What are you stuck on?
          </label>
          <textarea
            id="overview-question-input"
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="What are you stuck on?"
            className="w-full resize-none bg-transparent text-[16px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none leading-relaxed"
          />

          <div className="mt-3 pt-3 border-t border-[#EFE2E2] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="overview-subject" className="text-[12.5px] font-medium text-[#7B6F71]">
                Subject
              </label>
              <select
                id="overview-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="min-h-[40px] text-[13.5px] font-medium text-[#221D1E] bg-[#FCF6F6] border border-[#EFE2E2] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#C45B72]"
              >
                {SUBJECT_LIST.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj}
                  </option>
                ))}
                <option value="General">General</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!question.trim()}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold bg-[#C45B72] text-[#FFFFFF] hover:bg-[#A64258] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0"
            >
              <span>Ask DOUBTLY</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </form>
      </section>

      {/* Compact iOS Grouped Activity Summary */}
      <section aria-label="Learning activity summary">
        <div className="grid grid-cols-3 bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl overflow-hidden divide-x divide-[#EFE2E2] shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
          <div className="px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-[12px] font-medium text-[#7B6F71]">Doubts resolved</p>
            <p className="mt-1 text-[22px] font-bold text-[#221D1E] tabular-nums">
              {resolvedCount}
            </p>
          </div>
          <div className="px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-[12px] font-medium text-[#7B6F71]">Peer replies</p>
            <p className="mt-1 text-[22px] font-bold text-[#221D1E] tabular-nums">
              {communityRepliesCount}
            </p>
          </div>
          <div className="px-4 py-3.5 sm:px-5 sm:py-4">
            <p className="text-[12px] font-medium text-[#7B6F71]">Saved notes</p>
            <p className="mt-1 text-[22px] font-bold text-[#221D1E] tabular-nums">
              {savedResourcesCount}
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Desktop 2-Column / Mobile Stacked iOS Inset Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Recent Questions Inset Grouped List */}
        <section className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-semibold text-[#221D1E]">
              Recent questions
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('community')}
              className="min-h-[40px] px-2 text-[13.5px] font-medium text-[#C45B72] hover:text-[#A64258] transition-colors whitespace-nowrap shrink-0"
            >
              See all
            </button>
          </div>

          <ul className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl divide-y divide-[#EFE2E2] overflow-hidden shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
            {recentDoubts.slice(0, 5).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onOpenRecentDoubt(item)}
                  className="w-full min-h-[60px] text-left px-4 py-3.5 hover:bg-[#FCF6F6] active:bg-[#FFE4E1]/50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#221D1E] leading-snug">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[12.5px] text-[#7B6F71] flex flex-wrap items-center gap-1.5">
                      <span>{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          item.status === 'Open in Community'
                            ? 'text-[#A64258] font-medium'
                            : 'text-[#7B6F71]'
                        }
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 text-[#B8A7AA] group-hover:text-[#C45B72] shrink-0 transition-colors"
                    strokeWidth={2}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Available Mentors Inset Grouped List */}
        <section className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-semibold text-[#221D1E]">
              Available mentors
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('mentors')}
              className="min-h-[40px] px-2 text-[13.5px] font-medium text-[#C45B72] hover:text-[#A64258] transition-colors whitespace-nowrap shrink-0"
            >
              Directory
            </button>
          </div>

          <ul className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl divide-y divide-[#EFE2E2] overflow-hidden shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
            {mentors.map((mentor) => (
              <li
                key={mentor.id}
                className="min-h-[60px] px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    initials={mentor.initials}
                    sizeClass="w-9 h-9"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#221D1E] truncate">
                      {mentor.name}
                    </p>
                    <p className="text-[12px] text-[#7B6F71] truncate">
                      {mentor.role} · {mentor.availability}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRequestMentor(mentor)}
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-[#FFE4E1] text-[13px] font-semibold text-[#A64258] hover:bg-[#F7D3CF] active:scale-[0.97] transition-all whitespace-nowrap shrink-0"
                >
                  Request
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
