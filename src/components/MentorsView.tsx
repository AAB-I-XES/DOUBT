import React, { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Mentor, MentorHelpRequest } from '../types/doubtly';

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
    <div className="min-h-full bg-[#FBBFB5]">
      {/* Top Coral Peach Header Zone */}
      <div className="px-4 sm:px-8 pt-6 pb-7 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5 bg-[#FFFFFF] rounded-full px-4 h-12 shadow-[0_2px_10px_rgba(20,18,18,0.05)] max-w-xl">
          <Search className="w-4 h-4 text-[#6E5B59] shrink-0" strokeWidth={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentors by name, department, or topic..."
            className="flex-1 min-w-0 bg-transparent text-[14.5px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
          />
        </div>
      </div>

      {/* Curved Pale Misty Rose Main Sheet */}
      <div className="bg-[#FCEBE8] rounded-t-[32px] min-h-[calc(100vh-110px)] px-4 sm:px-8 pt-7 pb-28 md:pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-[#141212] leading-tight">
                Mentors
              </h1>
              <p className="mt-0.5 text-[13px] text-[#6E5B59]">
                Faculty &amp; senior undergraduate mentors
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['All', 'Faculty', 'Senior Mentor'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setRoleFilter(tab)}
                  className={`min-h-[36px] px-4 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap shrink-0 ${
                    roleFilter === tab
                      ? 'bg-[#141212] text-[#FFFFFF]'
                      : 'border border-[#141212]/35 text-[#141212] hover:bg-[#F6D5D0]/70'
                  }`}
                >
                  {tab === 'Senior Mentor' ? 'Seniors' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Picture-Free Blush Tile Directory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.length === 0 ? (
              <div className="md:col-span-2 py-12 px-6 text-center text-[13.5px] text-[#6E5B59] bg-[#FFF9F8] rounded-[24px]">
                No mentors match your search.
              </div>
            ) : (
              filteredMentors.map((mentor) => {
                const existingRequest = sentRequests.find((r) => r.mentorId === mentor.id);
                return (
                  <div
                    key={mentor.id}
                    className="bg-[#FFF9F8] rounded-[24px] p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-11 h-11 rounded-full bg-[#F6D5D0] flex items-center justify-center text-[13px] font-bold text-[#141212] shrink-0">
                          {mentor.initials}
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-[15.5px] font-bold text-[#141212] truncate">
                            {mentor.name}
                          </h2>
                          <p className="text-[12.5px] text-[#6E5B59] truncate">
                            {mentor.role} · {mentor.department}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[11.5px] font-semibold px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap ${
                          mentor.isAvailableNow
                            ? 'bg-[#FBBFB5] text-[#141212]'
                            : 'bg-[#FCEBE8] text-[#6E5B59]'
                        }`}
                      >
                        {mentor.availability}
                      </span>
                    </div>

                    <p className="text-[13.5px] text-[#141212]/85 leading-relaxed">
                      {mentor.expertise.join(' · ')}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="text-[12px] text-[#6E5B59] truncate">
                        {mentor.officeHours}
                      </span>

                      <button
                        type="button"
                        onClick={() => onRequestHelp(mentor)}
                        className={`min-h-[38px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                          existingRequest
                            ? 'bg-[#141212] text-[#FFFFFF]'
                            : 'bg-[#FBBFB5] text-[#141212] hover:bg-[#F7ACA0]'
                        }`}
                      >
                        {existingRequest ? (
                          <>
                            <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
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
              <h3 className="text-[14px] font-semibold text-[#141212] px-1">
                Active mentor requests
              </h3>
              <div className="space-y-2">
                {sentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-[#F6D5D0] rounded-[18px] px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-[13.5px]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-[#141212]">{req.mentorName}</span>
                      <span className="text-[#6E5B59]"> · {req.topic}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-[#141212]">
                      {req.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
