import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
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
    <div className="space-y-11">
      {/* Greeting Header */}
      <section>
        <p className="text-[13px] text-[#858585]">
          First Year · Semester 1 · B.Tech Computer Science
        </p>
        <h1 className="mt-1.5 text-[28px] sm:text-[32px] font-semibold tracking-[-0.025em] text-[#222222] leading-tight">
          Good morning, Alex.
        </h1>
      </section>

      {/* Prominent Simple Question Input */}
      <section aria-label="Quick doubt composer">
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-4 sm:p-5 transition-colors focus-within:border-[#A99AE8]"
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
            className="w-full resize-none bg-transparent text-[16px] text-[#222222] placeholder:text-[#858585] focus:outline-none leading-relaxed"
          />

          <div className="mt-3 pt-3 border-t border-[#EAE8E5] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="overview-subject" className="text-[12.5px] text-[#858585]">
                Subject
              </label>
              <select
                id="overview-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectName)}
                className="text-[13px] text-[#222222] bg-[#FAF9F7] border border-[#EAE8E5] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#A99AE8]"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13.5px] font-medium bg-[#222222] text-[#FAF9F7] hover:bg-[#363636] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ask DOUBTLY</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </form>
      </section>

      {/* Small Learning Activity Summary */}
      <section aria-label="Learning activity summary">
        <div className="grid grid-cols-3 border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-x divide-[#EAE8E5]">
          <div className="px-4 py-3.5 sm:px-5">
            <p className="text-[12px] text-[#858585]">Doubts resolved</p>
            <p className="mt-1 text-[20px] font-semibold text-[#222222] tabular-nums">
              {resolvedCount}
            </p>
          </div>
          <div className="px-4 py-3.5 sm:px-5">
            <p className="text-[12px] text-[#858585]">Peer replies</p>
            <p className="mt-1 text-[20px] font-semibold text-[#222222] tabular-nums">
              {communityRepliesCount}
            </p>
          </div>
          <div className="px-4 py-3.5 sm:px-5">
            <p className="text-[12px] text-[#858585]">Saved resources</p>
            <p className="mt-1 text-[20px] font-semibold text-[#222222] tabular-nums">
              {savedResourcesCount}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Questions & Available Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Questions List */}
        <section className="lg:col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E5]">
            <h2 className="text-[15px] font-semibold text-[#222222]">
              Recent questions
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('community')}
              className="text-[13px] text-[#858585] hover:text-[#222222] transition-colors whitespace-nowrap shrink-0"
            >
              View community
            </button>
          </div>

          <ul className="divide-y divide-[#EAE8E5]">
            {recentDoubts.slice(0, 5).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onOpenRecentDoubt(item)}
                  className="w-full text-left py-3.5 px-2 -mx-2 rounded-md hover:bg-[#F3E8E7]/45 transition-colors flex items-start justify-between gap-4 group"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#222222] group-hover:text-[#000000] leading-snug">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[12.5px] text-[#858585] flex flex-wrap items-center gap-1.5">
                      <span>{item.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.timestamp}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          item.status === 'Open in Community'
                            ? 'text-[#222222]'
                            : 'text-[#858585]'
                        }
                      >
                        {item.status}
                      </span>
                    </p>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#858585] group-hover:text-[#222222] shrink-0 mt-0.5 transition-colors"
                    strokeWidth={1.75}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Available Mentors Compact Rows */}
        <section className="lg:col-span-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E5]">
            <h2 className="text-[15px] font-semibold text-[#222222]">
              Available mentors
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('mentors')}
              className="text-[13px] text-[#858585] hover:text-[#222222] transition-colors whitespace-nowrap shrink-0"
            >
              All mentors
            </button>
          </div>

          <ul className="divide-y divide-[#EAE8E5]">
            {mentors.map((mentor) => (
              <li
                key={mentor.id}
                className="py-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    initials={mentor.initials}
                    sizeClass="w-8 h-8"
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#222222] truncate">
                      {mentor.name}
                    </p>
                    <p className="text-[12px] text-[#858585] truncate">
                      {mentor.role} · {mentor.availability}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRequestMentor(mentor)}
                  className="px-3 py-1.5 rounded-md border border-[#EAE8E5] bg-[#FFFFFF] text-[12.5px] font-medium text-[#222222] hover:border-[#A99AE8] hover:bg-[#F3E8E7]/40 transition-colors whitespace-nowrap shrink-0"
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
