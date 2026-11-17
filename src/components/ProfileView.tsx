import React, { useState } from 'react';
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
    <div className="space-y-9">
      {/* Header & Student Information */}
      <section className="pb-6 border-b border-[#EAE8E5] flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Avatar
            src={profile.avatarUrl}
            alt={profile.name}
            initials="AR"
            sizeClass="w-14 h-14"
          />
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#222222]">
              {profile.name}
            </h1>
            <p className="mt-0.5 text-[13.5px] text-[#858585]">
              {profile.program} · {profile.semester}
            </p>
            <p className="mt-0.5 font-mono text-[12px] text-[#858585]">
              ID {profile.rollNumber}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-[12px] text-[#858585]">Enrolled courses</p>
          <p className="mt-1 text-[14px] font-medium text-[#222222] tabular-nums">
            {profile.courses.length} active subjects
          </p>
        </div>
      </section>

      {/* Learning Activity & Minimal Progress Visualization */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[14px] font-semibold text-[#222222]">
              Weekly clarity goal
            </h2>
            <span className="text-[13px] text-[#858585] tabular-nums">
              {profile.weeklyCompletedDoubts} / {profile.weeklyGoalDoubts} doubts resolved
            </span>
          </div>

          <div
            role="progressbar"
            aria-valuenow={progressRatio}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Weekly doubt resolution progress"
            className="w-full h-2 bg-[#EAE8E5] rounded-sm overflow-hidden"
          >
            <div
              className="h-full bg-[#A99AE8] transition-all duration-300"
              style={{ width: `${progressRatio}%` }}
            />
          </div>

          <p className="text-[12.5px] text-[#858585]">
            {progressRatio}% of your weekly study target completed.
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[14px] font-semibold text-[#222222]">
              This week’s cadence
            </h2>
            <span className="text-[13px] text-[#858585] tabular-nums">
              {profile.studyDays.filter((d) => d.active).length} active days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-1">
            {profile.studyDays.map((item) => (
              <div key={item.day} className="flex flex-col items-center gap-1.5">
                <div
                  title={`${item.day}: ${item.count} doubts`}
                  className={`w-full h-7 rounded border flex items-center justify-center font-mono text-[11px] tabular-nums ${
                    item.count >= 2
                      ? 'border-[#A99AE8] bg-[#A99AE8]/25 text-[#222222]'
                      : item.active
                      ? 'border-[#E6D5D4] bg-[#F3E8E7] text-[#222222]'
                      : 'border-[#EAE8E5] bg-[#FAF9F7] text-[#858585]'
                  }`}
                >
                  {item.count}
                </div>
                <span className="text-[11px] text-[#858585]">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Collections: Saved Doubts, Bookmarks, Contributions */}
      <section className="space-y-4">
        <div className="flex items-center gap-1 border-b border-[#EAE8E5]">
          {(
            [
              { id: 'saved', label: `Saved doubts (${savedDoubts.length})` },
              {
                id: 'bookmarks',
                label: `Bookmarked resources (${bookmarkedResources.length})`,
              },
              {
                id: 'contributions',
                label: `Community contributions (${myCommunityPosts.length})`,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2.5 text-[13.5px] border-b-2 -mb-px transition-colors whitespace-nowrap shrink-0 ${
                activeSubTab === tab.id
                  ? 'border-[#A99AE8] text-[#222222] font-medium'
                  : 'border-transparent text-[#858585] hover:text-[#222222]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSubTab === 'saved' && (
          <div className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
            {savedDoubts.length === 0 ? (
              <p className="py-10 px-5 text-center text-[13.5px] text-[#858585]">
                No saved AI explanations yet. Use the Save button in Ask Doubt to keep key derivations here.
              </p>
            ) : (
              savedDoubts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onOpenExchange(item.id)}
                  className="w-full text-left px-5 py-3.5 hover:bg-[#FAF9F7] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#222222] truncate">
                      <MathText text={item.question} />
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#858585]">
                      {item.subject} · {item.createdAt}
                    </p>
                  </div>
                  <span className="text-[12.5px] text-[#858585] shrink-0">Open →</span>
                </button>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'bookmarks' && (
          <div className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
            {bookmarkedResources.length === 0 ? (
              <p className="py-10 px-5 text-center text-[13.5px] text-[#858585]">
                No bookmarked resources yet.
              </p>
            ) : (
              bookmarkedResources.map((res) => (
                <div
                  key={res.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#222222] truncate">
                      {res.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#858585]">
                      {res.subject} · {res.docType} · {res.author}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSubTab === 'contributions' && (
          <div className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
            {myCommunityPosts.length === 0 ? (
              <p className="py-10 px-5 text-center text-[13.5px] text-[#858585]">
                No community questions or peer replies posted yet.
              </p>
            ) : (
              myCommunityPosts.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => onOpenCommunityQuestion(q.id)}
                  className="w-full text-left px-5 py-3.5 hover:bg-[#FAF9F7] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#222222] truncate">
                      <MathText text={q.title} />
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#858585]">
                      {q.subject} · {q.replies.length} replies · {q.upvotes} upvotes
                    </p>
                  </div>
                  <span className="text-[12.5px] text-[#858585] shrink-0">View →</span>
                </button>
              ))
            )}
          </div>
        )}
      </section>

      {/* Enrolled Courses List */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-semibold text-[#222222]">
          Enrolled first-year courses
        </h2>
        <ul className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
          {profile.courses.map((course) => (
            <li
              key={course}
              className="px-5 py-3 text-[13.5px] text-[#222222] font-mono"
            >
              {course}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
