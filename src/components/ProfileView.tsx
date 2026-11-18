import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  CommunityQuestion,
  DoubtExchange,
  ResourceItem,
  StudentProfile,
} from '../types/doubtly';
import { MathText } from './MathText';

interface ProfileViewProps {
  profile: StudentProfile;
  exchanges: DoubtExchange[];
  savedExchangeIds: string[];
  resources: ResourceItem[];
  bookmarkedResourceIds: string[];
  communityQuestions: CommunityQuestion[];
  onOpenExchange: (id: string) => void;
  onOpenCommunityQuestion: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  exchanges,
  savedExchangeIds,
  resources,
  bookmarkedResourceIds,
  communityQuestions,
  onOpenExchange,
  onOpenCommunityQuestion,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'bookmarks' | 'contributions'>(
    'saved'
  );

  const savedDoubts = exchanges.filter((ex) => savedExchangeIds.includes(ex.id));
  const bookmarkedResources = resources.filter((res) =>
    bookmarkedResourceIds.includes(res.id)
  );
  const myCommunityPosts = communityQuestions.filter(
    (q) =>
      q.studentName === profile.name ||
      q.replies.some((r) => r.authorName === profile.name)
  );

  const progressRatio = Math.min(
    100,
    Math.round((profile.weeklyCompletedDoubts / profile.weeklyGoalDoubts) * 100)
  );

  return (
    <div className="min-h-full bg-[#FBBFB5]">
      {/* Top Coral Peach Header Zone (Completely Picture-Free / No DP) */}
      <div className="px-4 sm:px-8 pt-6 pb-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-semibold text-[#141212]/70">
              {profile.university} · {profile.semester} · {profile.rollNumber}
            </p>
            <h1 className="mt-1 text-[28px] sm:text-[34px] font-bold tracking-[-0.03em] text-[#141212] leading-tight">
              {profile.name}
            </h1>
            <p className="mt-1 text-[14px] font-medium text-[#141212]/80">
              {profile.program}
            </p>
          </div>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FCEBE8] text-[13px] font-semibold text-[#141212] self-start sm:self-auto tabular-nums">
            {profile.courses.length} enrolled courses
          </div>
        </div>
      </div>

      {/* Curved Pale Misty Rose Main Sheet */}
      <div className="bg-[#FCEBE8] rounded-t-[32px] min-h-[calc(100vh-140px)] px-4 sm:px-8 pt-7 pb-28 md:pb-12">
        <div className="max-w-5xl mx-auto space-y-7">
          {/* Progress & Cadence Blush Tiles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F6D5D0] rounded-[24px] p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-bold text-[#141212]">
                  Weekly clarity goal
                </h2>
                <span className="text-[13px] font-semibold text-[#141212] tabular-nums">
                  {profile.weeklyCompletedDoubts} / {profile.weeklyGoalDoubts} doubts
                </span>
              </div>

              <div
                role="progressbar"
                aria-valuenow={progressRatio}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Weekly doubt resolution progress"
                className="w-full h-3 bg-[#FCEBE8] rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-[#141212] rounded-full transition-all duration-300"
                  style={{ width: `${progressRatio}%` }}
                />
              </div>

              <p className="text-[12.5px] font-medium text-[#6E5B59]">
                {progressRatio}% of your weekly study target completed
              </p>
            </div>

            <div className="bg-[#FFF9F8] rounded-[24px] p-5 space-y-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-bold text-[#141212]">
                  This week’s cadence
                </h2>
                <span className="text-[13px] font-medium text-[#6E5B59] tabular-nums">
                  {profile.studyDays.filter((d) => d.active).length} active days
                </span>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-0.5">
                {profile.studyDays.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-1.5">
                    <div
                      title={`${item.day}: ${item.count} doubts`}
                      className={`w-full h-8 rounded-full flex items-center justify-center font-mono text-[12px] font-semibold tabular-nums ${
                        item.count >= 2
                          ? 'bg-[#141212] text-[#FFFFFF]'
                          : item.active
                          ? 'bg-[#FBBFB5] text-[#141212]'
                          : 'bg-[#FCEBE8] text-[#6E5B59]'
                      }`}
                    >
                      {item.count}
                    </div>
                    <span className="text-[11px] font-medium text-[#6E5B59]">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filter Pills + Saved/Bookmark/Contribution Lists */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {(
                [
                  { id: 'saved', label: `Saved doubts (${savedDoubts.length})` },
                  {
                    id: 'bookmarks',
                    label: `Bookmarks (${bookmarkedResources.length})`,
                  },
                  {
                    id: 'contributions',
                    label: `Contributions (${myCommunityPosts.length})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`min-h-[36px] px-4 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap shrink-0 ${
                    activeSubTab === tab.id
                      ? 'bg-[#141212] text-[#FFFFFF]'
                      : 'border border-[#141212]/35 text-[#141212] hover:bg-[#F6D5D0]/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeSubTab === 'saved' && (
              <div className="space-y-2.5">
                {savedDoubts.length === 0 ? (
                  <p className="py-10 px-5 text-center text-[13.5px] text-[#6E5B59] bg-[#FFF9F8] rounded-[22px]">
                    No saved AI explanations yet. Use Save in Ask Doubt to keep key derivations here.
                  </p>
                ) : (
                  savedDoubts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenExchange(item.id)}
                      className="w-full min-h-[58px] text-left px-5 py-3.5 rounded-[20px] bg-[#FFF9F8] hover:bg-[#F6D5D0]/70 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold text-[#141212] truncate">
                          <MathText text={item.question} />
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-[#6E5B59]">
                          {item.subject} · {item.createdAt}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6E5B59] shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'bookmarks' && (
              <div className="space-y-2.5">
                {bookmarkedResources.length === 0 ? (
                  <p className="py-10 px-5 text-center text-[13.5px] text-[#6E5B59] bg-[#FFF9F8] rounded-[22px]">
                    No bookmarked resources yet.
                  </p>
                ) : (
                  bookmarkedResources.map((res) => (
                    <div
                      key={res.id}
                      className="px-5 py-3.5 rounded-[20px] bg-[#FFF9F8] flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold text-[#141212] truncate">
                          {res.title}
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-[#6E5B59]">
                          {res.subject} · {res.docType} · {res.author}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'contributions' && (
              <div className="space-y-2.5">
                {myCommunityPosts.length === 0 ? (
                  <p className="py-10 px-5 text-center text-[13.5px] text-[#6E5B59] bg-[#FFF9F8] rounded-[22px]">
                    No community questions or peer replies posted yet.
                  </p>
                ) : (
                  myCommunityPosts.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onOpenCommunityQuestion(q.id)}
                      className="w-full min-h-[58px] text-left px-5 py-3.5 rounded-[20px] bg-[#FFF9F8] hover:bg-[#F6D5D0]/70 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="text-[14.5px] font-semibold text-[#141212] truncate">
                          <MathText text={q.title} />
                        </p>
                        <p className="mt-0.5 text-[12.5px] text-[#6E5B59]">
                          {q.subject} · {q.replies.length} replies · {q.upvotes} upvotes
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#6E5B59] shrink-0" />
                    </button>
                  ))
                )}
              </div>
            )}
          </section>

          {/* Enrolled Courses List */}
          <section className="space-y-3">
            <h2 className="text-[15px] font-bold text-[#141212] px-1">
              Enrolled first-year courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {profile.courses.map((course) => (
                <div
                  key={course}
                  className="px-4 py-3 rounded-[18px] bg-[#FFF9F8] text-[13px] font-medium text-[#141212] font-mono"
                >
                  {course}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
