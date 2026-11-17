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
    <div className="space-y-7">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE8E5]">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#222222]">
          Mentors
        </h1>
        <p className="mt-0.5 text-[13.5px] text-[#858585]">
          Course faculty and senior undergraduate mentors available for one-on-one clarification.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search
            className="w-4 h-4 text-[#858585] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, department, or topic..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FFFFFF] border border-[#EAE8E5] rounded-md text-[13.5px] text-[#222222] placeholder:text-[#858585] focus:outline-none focus:border-[#A99AE8]"
          />
        </div>

        <div className="inline-flex items-center border border-[#EAE8E5] rounded-md bg-[#FFFFFF] p-0.5 self-start">
          {(['All', 'Faculty', 'Senior Mentor'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setRoleFilter(tab)}
              className={`px-3 py-1 rounded text-[12.5px] transition-colors whitespace-nowrap shrink-0 ${
                roleFilter === tab
                  ? 'bg-[#F3E8E7] text-[#222222] font-medium'
                  : 'text-[#858585] hover:text-[#222222]'
              }`}
            >
              {tab === 'Senior Mentor' ? 'Senior Mentors' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Compact Directory */}
      <div className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
        {filteredMentors.length === 0 ? (
          <div className="py-12 px-6 text-center text-[13.5px] text-[#858585]">
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
                      <h2 className="text-[15px] font-semibold text-[#222222]">
                        {mentor.name}
                      </h2>
                      <span className="text-[12px] text-[#858585]">
                        {mentor.role} · {mentor.yearOrTitle}
                      </span>
                    </div>

                    <p className="text-[13px] text-[#858585]">
                      {mentor.department}
                    </p>

                    <p className="text-[13px] text-[#222222]/85">
                      {mentor.expertise.join(' · ')}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded border whitespace-nowrap ${
                      mentor.isAvailableNow
                        ? 'border-[#D5CEF2] bg-[#F6F4FC] text-[#222222]'
                        : 'border-[#EAE8E5] bg-[#FAF9F7] text-[#858585]'
                    }`}
                  >
                    {mentor.availability}
                  </span>

                  <button
                    type="button"
                    onClick={() => onRequestHelp(mentor)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                      existingRequest
                        ? 'border-[#EAE8E5] bg-[#FAF9F7] text-[#222222]'
                        : 'border-[#EAE8E5] bg-[#FFFFFF] text-[#222222] hover:border-[#A99AE8] hover:bg-[#F3E8E7]/40'
                    }`}
                  >
                    {existingRequest ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#5B4BB7]" strokeWidth={1.75} />
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
          <h3 className="text-[13.5px] font-medium text-[#858585]">
            Your active mentor requests
          </h3>
          <ul className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
            {sentRequests.map((req) => (
              <li
                key={req.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-[13.5px]"
              >
                <div className="min-w-0">
                  <span className="font-medium text-[#222222]">{req.mentorName}</span>
                  <span className="text-[#858585]"> · {req.topic}</span>
                </div>
                <span className="text-[12px] text-[#858585]">{req.createdAt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
