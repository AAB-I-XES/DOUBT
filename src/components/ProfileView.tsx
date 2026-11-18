import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  CommunityQuestion,
  DoubtExchange,
  ResourceItem,
  StudentProfile,
} from '../types/doubtly';
import { Avatar } from './Avatar';
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
    <div className="space-y-7">
      {/* Header & Student Card */}
      <section className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
        <div className="flex items-center gap-4">
          <Avatar
            src={profile.avatarUrl}
            alt={profile.name}
            initials="AR"
            sizeClass="w-14 h-14"
          />
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#221D1E]">
              {profile.name}
            </h1>
            <p className="mt-0.5 text-[13.5px] text-[#7B6F71]">
              {profile.program} · {profile.semester}
            </p>
            <p className="mt-0.5 font-mono text-[12px] text-[#A64258]">
              ID {profile.rollNumber}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-[#EFE2E2]">
          <p className="text-[12px] text-[#7B6F71]">Enrolled courses</p>
          <p className="mt-0.5 text-[15px] font-semibold text-[#221D1E] tabular-nums">
            {profile.courses.length} active subjects
          </p>
        </div>
      </section>

      {/* Learning Activity & Minimal Progress Visualization */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[14.5px] font-semibold text-[#221D1E]">
              Weekly clarity goal
            </h2>
            <span className="text-[13px] font-medium text-[#A64258] tabular-nums">
              {profile.weeklyCompletedDoubts} / {profile.weeklyGoalDoubts} doubts
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={progressRatio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weekly doubt resolution progress"
            className="w-full h-2.5 bg-[#F4E3E3] rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-[#C45B72] rounded-full transition-all duration-300"
              style={{ width: `${progressRatio}%` }}
            />
          </div>

          <p className="text-[12.5px] text-[#7B6F71]">
            {progressRatio}% of your weekly study target completed.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 space-y-4 shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[14.5px] font-semibold text-[#221D1E]">
              This week’s cadence
            </h2>
            <span className="text-[13px] text-[#7B6F71] tabular-nums">
              {profile.studyDays.filter((d) => d.active).length} active days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-0.5">
            {profile.studyDays.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-1.5">
                <div
                  title={`${item.day}: ${item.count} doubts`}
                  className={`w-full h-8 rounded-xl border flex items-center justify-center font-mono text-[12px] font-medium tabular-nums ${
                    item.count >= 2
                      ? 'border-[#C45B72]/50 bg-[#C45B72] text-[#FFFFFF]'
                      : item.active
                      ? 'border-[#F2CECA] bg-[#FFE4E1] text-[#A64258]'
                      : 'border-[#EFE2E2] bg-[#FCF6F6] text-[#7B6F71]'
                  }`}
                >
                  {item.count}
                </div>
                <span className="text-[11px] font-medium text-[#7B6F71]">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* iOS Segmented Collection Switcher */}
      <section className="space-y-4">
        <div className="inline-flex flex-wrap items-center bg-[#F4E3E3] p-1 rounded-xl">
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
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-[13px] transition-all whitespace-nowrap shrink-0 ${
                activeSubTab === tab.id
                  ? 'bg-[#FFFFFF] text-[#221D1E] font-semibold shadow-[0_1px_2px_rgba(166,66,88,0.08)]'
                  : 'text-[#7B6F71] hover:text-[#221D1E] font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSubTab === 'saved' && (
          <div className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden">
            {savedDoubts.length === 0 ? (
              <p className="py-10 px-5 text-center text-[13.5px] text-[#7B6F71]">
                No saved AI explanations yet. Use the Save button in Ask Doubt to keep key derivations here.
              </p>
            ) : (
              savedDoubts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenExchange(item.id)}
                  className="w-full min-h-[56px] text-left px-4 sm:px-5 py-3.5 hover:bg-[#FCF6F6] transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#221D1E] truncate">
                      <MathText text={item.question} />
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#7B6F71]">
                      {item.subject} · {item.createdAt}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B8A7AA] group-hover:text-[#C45B72] shrink-0" />
                </button>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'bookmarks' && (
          <div className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden">
            {bookmarkedResources.length === 0 ? (
              <p className="py-10 px-5 text-center text-[13.5px] text-[#7B6F71]">
                No bookmarked resources yet.
              </p>
            ) : (
              bookmarkedResources.map((res) => (
                <div
                  key={res.id}
                  className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#221D1E] truncate">
                      {res.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#7B6F71]">
                      {res.subject} · {res.docType} · {res.author}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'contributions' && (
          <div className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden">
            {myCommunityPosts.length === 0 ? (
              <p className="py-10 px-5 text-center text-[13.5px] text-[#7B6F71]">
                No community questions or peer replies posted yet.
              </p>
            ) : (
              myCommunityPosts.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onOpenCommunityQuestion(q.id)}
                  className="w-full min-h-[56px] text-left px-4 sm:px-5 py-3.5 hover:bg-[#FCF6F6] transition-colors flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#221D1E] truncate">
                      <MathText text={q.title} />
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#7B6F71]">
                      {q.subject} · {q.replies.length} replies · {q.upvotes} upvotes
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B8A7AA] group-hover:text-[#C45B72] shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </section>

      {/* Enrolled Courses Inset Grouped List */}
      <section className="space-y-2.5">
        <h2 className="text-[14.5px] font-semibold text-[#221D1E] px-1">
          Enrolled first-year courses
        </h2>
        <ul className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden">
          {profile.courses.map((course) => (
            <li
              key={course}
              className="px-4 sm:px-5 py-3 text-[13.5px] text-[#221D1E] font-mono"
            >
              {course}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
