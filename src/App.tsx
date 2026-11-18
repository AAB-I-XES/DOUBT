import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  AIStructuredAnswer,
  AttachmentPreview,
  CommunityQuestion,
  DoubtExchange,
  Mentor,
  MentorHelpRequest,
  NavTab,
  RecentDoubtSummary,
  SubjectName,
} from './types/doubtly';
import {
  INITIAL_COMMUNITY_QUESTIONS,
  INITIAL_DOUBT_EXCHANGES,
  INITIAL_MENTORS,
  INITIAL_PROFILE,
  INITIAL_RECENT_DOUBTS,
  INITIAL_RESOURCES,
} from './data/academicData';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { AskDoubtView } from './components/AskDoubtView';
import { CommunityView } from './components/CommunityView';
import { ResourcesView } from './components/ResourcesView';
import { MentorsView } from './components/MentorsView';
import { ProfileView } from './components/ProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  // Ask Doubt state
  const [exchanges, setExchanges] = useState<DoubtExchange[]>(INITIAL_DOUBT_EXCHANGES);
  const [activeExchangeId, setActiveExchangeId] = useState<string | null>('ex-1');
  const [savedExchangeIds, setSavedExchangeIds] = useState<string[]>(['ex-1']);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Overview recent list
  const [recentDoubts, setRecentDoubts] = useState<RecentDoubtSummary[]>(INITIAL_RECENT_DOUBTS);

  // Community state
  const [communityQuestions, setCommunityQuestions] = useState<CommunityQuestion[]>(
    INITIAL_COMMUNITY_QUESTIONS
  );
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  // Resources state
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<string[]>([
    'res-1',
    'res-3',
  ]);

  // Mentors & help request modal state
  const [mentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [sentRequests, setSentRequests] = useState<MentorHelpRequest[]>([]);
  const [requestModalMentor, setRequestModalMentor] = useState<Mentor | null>(null);
  const [requestTopic, setRequestTopic] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [escalatingExchangeId, setEscalatingExchangeId] = useState<string | null>(null);

  const handleResolveWithAI = async (
    questionText: string,
    subject: SubjectName,
    attachment?: AttachmentPreview | null,
    hintFirst = false
  ) => {
    setActiveTab('ask');
    setIsAiLoading(true);
    setAiError(null);

    try {
      const history = exchanges.slice(0, 3).map((ex) => ({
        role: 'student' as const,
        text: ex.question,
      }));

      const res = await fetch('/api/ai/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          subject,
          hintFirst,
          history,
          attachment: attachment
            ? {
                name: attachment.name,
                mimeType: attachment.mimeType,
                data: attachment.data,
              }
            : null,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || 'Could not resolve your question.');
      }

      const answer = payload as AIStructuredAnswer;
      const newId = `ex-${Date.now()}`;
      const displayQuestion =
        questionText || `Attached file: ${attachment?.name || 'Document'}`;

      const newExchange: DoubtExchange = {
        id: newId,
        question: displayQuestion,
        subject,
        createdAt: 'Just now',
        attachmentName: attachment?.name,
        hintFirst,
        answer,
        helpfulVote: null,
      };

      setExchanges((prev) => [newExchange, ...prev]);
      setActiveExchangeId(newId);

      setRecentDoubts((prev) => [
        {
          id: `rec-${Date.now()}`,
          title: displayQuestion.replace(/\$/g, ''),
          subject: (answer.subject as SubjectName) || subject,
          timestamp: 'Just now',
          status: 'Resolved by AI',
          exchangeId: newId,
        },
        ...prev,
      ]);

      setProfile((prev) => ({
        ...prev,
        weeklyCompletedDoubts: prev.weeklyCompletedDoubts + 1,
      }));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error contacting AI service.';
      setAiError(message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleQuickQuestionFromOverview = (question: string, subject: SubjectName) => {
    void handleResolveWithAI(question, subject, null, false);
  };

  const handleOpenRecentDoubt = (item: RecentDoubtSummary) => {
    if (item.exchangeId) {
      setActiveExchangeId(item.exchangeId);
      setActiveTab('ask');
      return;
    }
    if (item.communityId) {
      setSelectedCommunityId(item.communityId);
      setActiveTab('community');
    }
  };

  const handleToggleSaveExchange = (exchangeId: string) => {
    setSavedExchangeIds((prev) =>
      prev.includes(exchangeId)
        ? prev.filter((id) => id !== exchangeId)
        : [...prev, exchangeId]
    );
  };

  const handleVoteHelpful = (exchangeId: string) => {
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === exchangeId
          ? { ...ex, helpfulVote: ex.helpfulVote === 'up' ? null : 'up' }
          : ex
      )
    );
  };

  const handleReportAnswer = (exchangeId: string, reason: string) => {
    setExchanges((prev) =>
      prev.map((ex) =>
        ex.id === exchangeId ? { ...ex, reportedReason: reason } : ex
      )
    );
  };

  const handleToggleCommunityUpvote = (id: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const nextUpvoted = !q.upvotedByMe;
        return {
          ...q,
          upvotedByMe: nextUpvoted,
          upvotes: nextUpvoted ? q.upvotes + 1 : Math.max(0, q.upvotes - 1),
        };
      })
    );
  };

  const handleAddCommunityReply = (questionId: string, content: string) => {
    setCommunityQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        return {
          ...q,
          isAnswered: true,
          replies: [
            ...q.replies,
            {
              id: `rep-${Date.now()}`,
              authorName: profile.name,
              authorRole: 'Student',
              content,
              timestamp: 'Just now',
            },
          ],
        };
      })
    );
  };

  const handleCreateCommunityQuestion = (payload: {
    title: string;
    body: string;
    subject: Exclude<SubjectName, 'General'>;
    isAnonymous: boolean;
  }) => {
    const newId = `comm-${Date.now()}`;
    const created: CommunityQuestion = {
      id: newId,
      title: payload.title,
      body: payload.body,
      studentName: payload.isAnonymous ? 'Anonymous' : profile.name,
      isAnonymous: payload.isAnonymous,
      subject: payload.subject,
      timestamp: 'Just now',
      upvotes: 1,
      upvotedByMe: true,
      isAnswered: false,
      replies: [],
    };
    setCommunityQuestions((prev) => [created, ...prev]);
    setSelectedCommunityId(newId);
  };

  const handleToggleResourceBookmark = (id: string) => {
    setBookmarkedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openMentorRequestModal = (
    mentor: Mentor,
    prefillTopic = '',
    exchangeId: string | null = null
  ) => {
    setRequestModalMentor(mentor);
    setRequestTopic(prefillTopic);
    setRequestNote('');
    setEscalatingExchangeId(exchangeId);
  };

  const handleEscalateExchangeToMentor = (exchange: DoubtExchange) => {
    const matchingMentor =
      mentors.find((m) =>
        m.expertise.some((exp) =>
          exp.toLowerCase().includes((exchange.answer.subject || exchange.subject).toLowerCase())
        )
      ) ||
      mentors.find((m) => m.isAvailableNow) ||
      mentors[0];
    openMentorRequestModal(
      matchingMentor,
      exchange.question.replace(/\$/g, '').slice(0, 90),
      exchange.id
    );
  };

  const handleSubmitMentorRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalMentor || !requestTopic.trim()) return;

    const req: MentorHelpRequest = {
      id: `mreq-${Date.now()}`,
      mentorId: requestModalMentor.id,
      mentorName: requestModalMentor.name,
      topic: requestTopic.trim(),
      note: requestNote.trim(),
      createdAt: 'Requested just now',
    };

    setSentRequests((prev) => [req, ...prev]);

    if (escalatingExchangeId) {
      const targetName = requestModalMentor.name;
      setExchanges((prev) =>
        prev.map((ex) =>
          ex.id === escalatingExchangeId
            ? { ...ex, escalatedTo: targetName }
            : ex
        )
      );
    }

    setRequestModalMentor(null);
    setEscalatingExchangeId(null);
  };

  const myRepliesCount = communityQuestions.reduce(
    (acc, q) =>
      acc + q.replies.filter((r) => r.authorName === profile.name).length,
    0
  );

  return (
    <div className="min-h-screen bg-[#FCEBE8] text-[#141212]">
      <Sidebar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab !== 'community') {
            setSelectedCommunityId(null);
          }
        }}
        profile={profile}
      />

      <main className="md:pl-60 min-h-screen">
        {activeTab === 'overview' && (
          <OverviewView
            recentDoubts={recentDoubts}
            mentors={mentors}
            resolvedCount={profile.weeklyCompletedDoubts}
            communityRepliesCount={myRepliesCount + 3}
            savedResourcesCount={bookmarkedResourceIds.length}
            onAskQuickQuestion={handleQuickQuestionFromOverview}
            onOpenRecentDoubt={handleOpenRecentDoubt}
            onNavigate={setActiveTab}
            onRequestMentor={(mentor) => openMentorRequestModal(mentor)}
          />
        )}

        {activeTab === 'ask' && (
          <AskDoubtView
            exchanges={exchanges}
            activeExchangeId={activeExchangeId}
            savedExchangeIds={savedExchangeIds}
            isLoading={isAiLoading}
            errorMessage={aiError}
            onSelectExchange={setActiveExchangeId}
            onSubmitQuestion={handleResolveWithAI}
            onToggleSave={handleToggleSaveExchange}
            onVoteHelpful={handleVoteHelpful}
            onReportAnswer={handleReportAnswer}
            onEscalateToMentor={handleEscalateExchangeToMentor}
            onOpenResources={() => setActiveTab('resources')}
            onDismissError={() => setAiError(null)}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            questions={communityQuestions}
            exchanges={exchanges}
            selectedQuestionId={selectedCommunityId}
            onSelectQuestion={setSelectedCommunityId}
            onToggleUpvote={handleToggleCommunityUpvote}
            onAddReply={handleAddCommunityReply}
            onCreateQuestion={handleCreateCommunityQuestion}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            resources={INITIAL_RESOURCES}
            bookmarkedIds={bookmarkedResourceIds}
            onToggleBookmark={handleToggleResourceBookmark}
          />
        )}

        {activeTab === 'mentors' && (
          <MentorsView
            mentors={mentors}
            sentRequests={sentRequests}
            onRequestHelp={(mentor) => openMentorRequestModal(mentor)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            exchanges={exchanges}
            savedExchangeIds={savedExchangeIds}
            resources={INITIAL_RESOURCES}
            bookmarkedResourceIds={bookmarkedResourceIds}
            communityQuestions={communityQuestions}
            onOpenExchange={(id) => {
              setActiveExchangeId(id);
              setActiveTab('ask');
            }}
            onOpenCommunityQuestion={(id) => {
              setSelectedCommunityId(id);
              setActiveTab('community');
            }}
          />
        )}
      </main>

      {/* Native iOS Sheet Modal for Mentor Help Request */}
      {requestModalMentor && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="mentor-request-title"
          className="fixed inset-0 z-50 bg-[#141212]/35 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-md bg-[#FCEBE8] rounded-t-[32px] sm:rounded-[28px] overflow-hidden">
            <div className="bg-[#FBBFB5] px-5 sm:px-6 pt-4 pb-5">
              <div className="w-10 h-1.5 bg-[#141212]/20 rounded-full mx-auto mb-3 sm:hidden" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-[#141212]/70">
                    {requestModalMentor.role} · {requestModalMentor.officeHours}
                  </p>
                  <h2
                    id="mentor-request-title"
                    className="mt-0.5 text-[18px] font-bold text-[#141212]"
                  >
                    Request help from {requestModalMentor.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setRequestModalMentor(null)}
                  aria-label="Close modal"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FCEBE8] text-[#141212] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitMentorRequest} className="p-5 sm:p-6 space-y-4">
              <div>
                <label
                  htmlFor="mentor-req-topic"
                  className="block text-[12.5px] font-semibold text-[#6E5B59] mb-1"
                >
                  Topic or doubt summary
                </label>
                <input
                  id="mentor-req-topic"
                  type="text"
                  required
                  value={requestTopic}
                  onChange={(e) => setRequestTopic(e.target.value)}
                  placeholder="e.g., Squeeze Theorem proof or pointer reversal"
                  className="w-full min-h-[42px] px-4 py-2 bg-[#FFF9F8] rounded-2xl text-[14px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="mentor-req-note"
                  className="block text-[12.5px] font-semibold text-[#6E5B59] mb-1"
                >
                  Where you are stuck (optional)
                </label>
                <textarea
                  id="mentor-req-note"
                  rows={3}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="Briefly describe what you already tried..."
                  className="w-full px-4 py-2.5 bg-[#FFF9F8] rounded-2xl text-[14px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
                />
              </div>

              <div className="pt-1 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRequestModalMentor(null)}
                  className="min-h-[42px] px-4 py-2 rounded-full bg-[#FFF9F8] text-[13.5px] font-semibold text-[#141212]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2 rounded-full bg-[#141212] text-[#FFFFFF] text-[13.5px] font-semibold hover:bg-[#2B2626]"
                >
                  Send request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
