import React, { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Mentor, MentorHelpRequest } from '../types/doubtly';
import { Avatar } from './Avatar';

interface MentorsViewProps {
  mentors: Mentor[];
  sentRequests: MentorHelpRequest[];
  onRequestHelp: (mentor: Mentor) => void;
}

export const MentorsView: React.FC<MentorsViewProps> = ({
  mentors,
  sentRequests,
  onRequestHelp,
}) => {
  const [roleFilter, setRoleFilter] = useState<'All' | 'Faculty' | 'Senior Mentor'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      if (roleFilter !== 'All' && mentor.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        return (
          mentor.name.toLowerCase().includes(needle) ||
          mentor.department.toLowerCase().includes(needle) ||
          mentor.expertise.some((e) => e.toLowerCase().includes(needle))
        );
      }
      return true;
    });
  }, [mentors, roleFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#221D1E]">
          Mentors
        </h1>
        <p className="mt-0.5 text-[13.5px] text-[#7B6F71]">
          Course faculty and senior undergraduate mentors available for one-on-one clarification.
        </p>
      </div>

      {/* iOS Search & Segmented Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#7B6F71] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.85}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, department, or topic..."
            className="w-full min-h-[42px] pl-10 pr-3.5 py-2 bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl text-[14px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none focus:border-[#C45B72]"
          />
        </div>

        <div className="inline-flex items-center bg-[#F4E3E3] p-1 rounded-xl self-start">
          {(['All', 'Faculty', 'Senior Mentor'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRoleFilter(tab)}
              className={`min-h-[34px] px-3.5 py-1 rounded-lg text-[12.5px] transition-all whitespace-nowrap shrink-0 ${
                roleFilter === tab
                  ? 'bg-[#FFFFFF] text-[#221D1E] font-semibold shadow-[0_1px_2px_rgba(166,66,88,0.08)]'
                  : 'text-[#7B6F71] hover:text-[#221D1E] font-medium'
              }`}
            >
              {tab === 'Senior Mentor' ? 'Senior Mentors' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* iOS Inset Grouped Mentor Directory */}
      <div className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
        {filteredMentors.length === 0 ? (
          <div className="py-12 px-6 text-center text-[13.5px] text-[#7B6F71]">
            No mentors match your search.
          </div>
        ) : (
          filteredMentors.map((mentor) => {
            const existingRequest = sentRequests.find((r) => r.mentorId === mentor.id);
            return (
              <div
                key={mentor.id}
                className="p-4 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <Avatar
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    initials={mentor.initials}
                    sizeClass="w-11 h-11"
                  />

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-semibold text-[#221D1E]">
                        {mentor.name}
                      </h2>
                      <span className="text-[12px] text-[#7B6F71]">
                        {mentor.role} · {mentor.yearOrTitle}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#7B6F71]">
                      {mentor.department}
                    </p>

                    <p className="text-[13px] text-[#221D1E]/85">
                      {mentor.expertise.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span
                    className={`text-[12px] font-medium px-2.5 py-0.5 rounded-lg border whitespace-nowrap ${
                      mentor.isAvailableNow
                        ? 'border-[#F2CECA] bg-[#FFE4E1]/70 text-[#A64258]'
                        : 'border-[#EFE2E2] bg-[#FCF6F6] text-[#7B6F71]'
                    }`}
                  >
                    {mentor.availability}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRequestHelp(mentor)}
                    className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 active:scale-[0.97] ${
                      existingRequest
                        ? 'border border-[#EFE2E2] bg-[#FCF6F6] text-[#A64258]'
                        : 'bg-[#FFE4E1] text-[#A64258] hover:bg-[#F7D3CF]'
                    }`}
                  >
                    {existingRequest ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C45B72]" strokeWidth={2} />
                        <span>Requested</span>
                      </>
                    ) : (
                      <span>Request help</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {sentRequests.length > 0 && (
        <section className="space-y-2.5">
          <h3 className="text-[13.5px] font-semibold text-[#7B6F71] px-1">
            Active mentor requests
          </h3>
          <ul className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden">
            {sentRequests.map((req) => (
              <li
                key={req.id}
                className="px-4 py-3.5 flex flex-wrap items-center justify-between gap-2 text-[13.5px]"
              >
                <div className="min-w-0">
                  <span className="font-semibold text-[#221D1E]">{req.mentorName}</span>
                  <span className="text-[#7B6F71]"> · {req.topic}</span>
                </div>
                <span className="text-[12px] font-medium text-[#A64258]">{req.createdAt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
