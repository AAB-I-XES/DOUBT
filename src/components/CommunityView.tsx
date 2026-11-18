import React, { useMemo, useState } from 'react';
import { ArrowUp, CheckCircle2, MessageSquare, Plus, Search, X } from 'lucide-react';
import { CommunityQuestion, DoubtExchange, SubjectName } from '../types/doubtly';
import { SUBJECT_LIST } from '../data/academicData';
import { MathText } from './MathText';

interface CommunityViewProps {
  questions: CommunityQuestion[];
  exchanges: DoubtExchange[];
  selectedQuestionId: string | null;
  onSelectQuestion: (id: string | null) => void;
  onToggleUpvote: (id: string) => void;
  onAddReply: (questionId: string, content: string) => void;
  onCreateQuestion: (payload: {
    title: string;
    body: string;
    subject: Exclude<SubjectName, 'General'>;
    isAnonymous: boolean;
  }) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  questions,
  exchanges,
  selectedQuestionId,
  onSelectQuestion,
  onToggleUpvote,
  onAddReply,
  onCreateQuestion,
}) => {
  const [viewMode, setViewMode] = useState<'feed' | 'insights'>('feed');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyDraft, setReplyDraft] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newSubject, setNewSubject] = useState<Exclude<SubjectName, 'General'>>('Calculus');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false;
      if (statusFilter === 'unanswered' && q.isAnswered) return false;
      if (statusFilter === 'answered' && !q.isAnswered) return false;
      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        return (
          q.title.toLowerCase().includes(needle) ||
          q.body.toLowerCase().includes(needle) ||
          q.subject.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [questions, subjectFilter, statusFilter, searchQuery]);

  const topicInsights = useMemo(() => {
    const map = new Map<
      string,
      { subject: string; total: number; unanswered: number; upvotes: number }
    >();
    SUBJECT_LIST.forEach((s) =>
      map.set(s, { subject: s, total: 0, unanswered: 0, upvotes: 0 })
    );
    questions.forEach((q) => {
      const entry = map.get(q.subject) || {
        subject: q.subject,
        total: 0,
        unanswered: 0,
        upvotes: 0,
      };
      entry.total += 1;
      if (!q.isAnswered) entry.unanswered += 1;
      entry.upvotes += q.upvotes;
      map.set(q.subject, entry);
    });
    return Array.from(map.values()).sort((a, b) => b.upvotes - a.upvotes);
  }, [questions]);

  const flaggedExchanges = useMemo(
    () => exchanges.filter((ex) => Boolean(ex.reportedReason)),
    [exchanges]
  );

  const activeQuestion =
    questions.find((q) => q.id === selectedQuestionId) || null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;
    onCreateQuestion({
      title: newTitle.trim(),
      body: newBody.trim(),
      subject: newSubject,
      isAnonymous,
    });
    setNewTitle('');
    setNewBody('');
    setIsComposerOpen(false);
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion || !replyDraft.trim()) return;
    onAddReply(activeQuestion.id, replyDraft.trim());
    setReplyDraft('');
  };

  return (
    <div className="min-h-full bg-[#FBBFB5]">
      {/* Top Coral Peach Header Zone */}
      <div className="px-4 sm:px-8 pt-6 pb-7 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 bg-[#FFFFFF] rounded-full px-4 h-12 shadow-[0_2px_10px_rgba(20,18,18,0.05)]">
            <Search className="w-4 h-4 text-[#6E5B59] shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search peer questions or topics..."
              className="flex-1 min-w-0 bg-transparent text-[14.5px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="h-12 px-4 sm:px-5 rounded-full bg-[#141212] text-[#FFFFFF] text-[13px] font-semibold inline-flex items-center gap-1.5 hover:bg-[#2B2626] active:scale-95 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.2} />
            <span>Ask</span>
          </button>
        </div>
      </div>

      {/* Curved Pale Misty Rose Sheet */}
      <div className="bg-[#FCEBE8] rounded-t-[32px] min-h-[calc(100vh-110px)] px-4 sm:px-8 pt-7 pb-28 md:pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-[#141212] leading-tight">
                {viewMode === 'feed' ? 'Community' : 'Doubt Insights'}
              </h1>
              <p className="mt-0.5 text-[13px] text-[#6E5B59]">
                {viewMode === 'feed'
                  ? 'Anonymous & peer Q&A verified by faculty'
                  : 'Common doubt trends for faculty support'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onSelectQuestion(null);
                  setViewMode('feed');
                }}
                className={`min-h-[34px] px-4 py-1 rounded-full text-[12.5px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                  viewMode === 'feed'
                    ? 'bg-[#141212] text-[#FFFFFF]'
                    : 'border border-[#141212]/30 text-[#141212] hover:bg-[#F6D5D0]'
                }`}
              >
                Discussions
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectQuestion(null);
                  setViewMode('insights');
                }}
                className={`min-h-[34px] px-4 py-1 rounded-full text-[12.5px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                  viewMode === 'insights'
                    ? 'bg-[#141212] text-[#FFFFFF]'
                    : 'border border-[#141212]/30 text-[#141212] hover:bg-[#F6D5D0]'
                }`}
              >
                Topic Insights
              </button>
            </div>
          </div>

          {viewMode === 'insights' ? (
            <div className="space-y-6">
              {/* Subject Doubt Heatmap Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topicInsights.map((item) => (
                  <div
                    key={item.subject}
                    className="bg-[#FFF9F8] rounded-[24px] p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-[15.5px] font-bold text-[#141212]">
                        {item.subject}
                      </h2>
                      <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F6D5D0] text-[#141212] tabular-nums">
                        {item.total} doubts
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-[#FCEBE8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#141212] rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(15, item.upvotes * 3))}%`,
                        }}
                      />
                    </div>

                    <p className="text-[12.5px] text-[#6E5B59] tabular-nums">
                      {item.upvotes} student upvotes · {item.unanswered} awaiting reply
                    </p>
                  </div>
                ))}
              </div>

              {/* Flagged AI Answers Queue for Faculty/Moderation */}
              <section className="space-y-3">
                <h2 className="text-[15px] font-bold text-[#141212]">
                  Flagged explanations for review
                </h2>
                {flaggedExchanges.length === 0 ? (
                  <p className="bg-[#FFF9F8] rounded-[22px] p-5 text-[13.5px] text-[#6E5B59]">
                    No AI answers have been flagged for faculty review.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {flaggedExchanges.map((ex) => (
                      <div
                        key={ex.id}
                        className="bg-[#F6D5D0] rounded-[20px] p-4 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-[#141212] truncate">
                            <MathText text={ex.question} />
                          </p>
                          <p className="text-[12px] text-[#6E5B59]">
                            {ex.subject} · Reason: {ex.reportedReason}
                          </p>
                        </div>
                        <span className="text-[11.5px] font-semibold px-3 py-1 rounded-full bg-[#FFF9F8] text-[#141212]">
                          Pending faculty check
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <>
              {/* Status & Subject Filter Pills */}
              {!activeQuestion && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                    {['All', ...SUBJECT_LIST].map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => setSubjectFilter(subj)}
                        className={`min-h-[36px] px-4 py-1.5 rounded-full text-[13px] font-medium transition-all whitespace-nowrap shrink-0 ${
                          subjectFilter === subj
                            ? 'bg-[#141212] text-[#FFFFFF]'
                            : 'border border-[#141212]/35 text-[#141212] hover:bg-[#F6D5D0]/70'
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1.5">
                    {(
                      [
                        { id: 'all', label: 'All statuses' },
                        { id: 'unanswered', label: 'Unanswered' },
                        { id: 'answered', label: 'Answered' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap shrink-0 ${
                          statusFilter === tab.id
                            ? 'bg-[#FBBFB5] text-[#141212]'
                            : 'text-[#6E5B59] hover:text-[#141212]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Thread Detail or Card List */}
              {activeQuestion ? (
                <div className="max-w-3xl space-y-5">
                  <button
                    type="button"
                    onClick={() => onSelectQuestion(null)}
                    className="min-h-[38px] px-4 py-1.5 rounded-full bg-[#F6D5D0] text-[13px] font-semibold text-[#141212] hover:bg-[#F3C9C3] transition-colors"
                  >
                    ← All questions
                  </button>

                  <article className="bg-[#FFF9F8] rounded-[26px] p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#6E5B59]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-[#141212]">
                          {activeQuestion.isAnonymous ? 'Anonymous student' : activeQuestion.studentName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{activeQuestion.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeQuestion.timestamp}</span>
                      </div>

                      <span
                        className={`text-[12px] font-semibold px-3 py-0.5 rounded-full ${
                          activeQuestion.isAnswered
                            ? 'bg-[#FCEBE8] text-[#6E5B59]'
                            : 'bg-[#FBBFB5] text-[#141212]'
                        }`}
                      >
                        {activeQuestion.verifiedByFaculty
                          ? 'Faculty verified'
                          : activeQuestion.isAnswered
                          ? 'Answered'
                          : 'Unanswered'}
                      </span>
                    </div>

                    <h2 className="text-[19px] font-bold text-[#141212] leading-snug">
                      <MathText text={activeQuestion.title} />
                    </h2>

                    <p className="text-[15px] text-[#141212]/90 leading-[1.68]">
                      <MathText text={activeQuestion.body} />
                    </p>

                    <div className="pt-2 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onToggleUpvote(activeQuestion.id)}
                        className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${
                          activeQuestion.upvotedByMe
                            ? 'bg-[#141212] text-[#FFFFFF]'
                            : 'bg-[#F6D5D0] text-[#141212] hover:bg-[#FBBFB5]'
                        }`}
                      >
                        <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.2} />
                        <span className="tabular-nums">{activeQuestion.upvotes}</span>
                        <span>Helpful</span>
                      </button>

                      <span className="text-[13px] font-medium text-[#6E5B59] tabular-nums">
                        {activeQuestion.replies.length}{' '}
                        {activeQuestion.replies.length === 1 ? 'response' : 'responses'}
                      </span>
                    </div>
                  </article>

                  <section className="space-y-3">
                    <h3 className="text-[14px] font-semibold text-[#141212] px-1">
                      Responses
                    </h3>

                    {activeQuestion.replies.length === 0 ? (
                      <p className="py-8 text-center text-[13.5px] text-[#6E5B59] rounded-[22px] bg-[#FFF9F8]">
                        No peer or mentor responses yet. Share an explanation below.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {activeQuestion.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-[#FFF9F8] rounded-[22px] p-4 sm:p-5 space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#141212]">
                                  {reply.authorName}
                                </span>
                                <span aria-hidden="true" className="text-[#6E5B59]">·</span>
                                <span className="text-[#6E5B59]">{reply.authorRole}</span>
                                <span aria-hidden="true" className="text-[#6E5B59]">·</span>
                                <span className="text-[#6E5B59]">{reply.timestamp}</span>
                              </div>

                              {reply.isVerified && (
                                <span className="inline-flex items-center gap-1 text-[12px] text-[#141212] font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                                  <span>Verified</span>
                                </span>
                              )}
                            </div>

                            <p className="text-[14.5px] text-[#141212] leading-[1.65]">
                              <MathText text={reply.content} />
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <form
                      onSubmit={handleReplySubmit}
                      className="bg-[#FFF9F8] rounded-[22px] p-4 space-y-3"
                    >
                      <label htmlFor="community-reply" className="block text-[12.5px] font-semibold text-[#6E5B59]">
                        Write a response as Shristii
                      </label>
                      <textarea
                        id="community-reply"
                        rows={3}
                        value={replyDraft}
                        onChange={(e) => setReplyDraft(e.target.value)}
                        placeholder="Explain clearly or share a helpful hint (use $...$ for LaTeX math)..."
                        className="w-full resize-none bg-transparent text-[14.5px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!replyDraft.trim()}
                          className="min-h-[40px] px-5 py-1.5 rounded-full text-[13px] font-semibold bg-[#FBBFB5] text-[#141212] hover:bg-[#F7ACA0] disabled:opacity-40 transition-colors"
                        >
                          Post reply
                        </button>
                      </div>
                    </form>
                  </section>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {filteredQuestions.length === 0 ? (
                    <div className="md:col-span-2 py-12 px-6 text-center bg-[#FFF9F8] rounded-[24px] space-y-1.5">
                      <p className="text-[15px] font-semibold text-[#141212]">
                        No matching questions
                      </p>
                      <p className="text-[13px] text-[#6E5B59]">
                        Try clearing your filters or ask the community directly.
                      </p>
                    </div>
                  ) : (
                    filteredQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-[#FFF9F8] hover:bg-[#F6D5D0]/65 rounded-[22px] p-4 sm:p-5 transition-colors flex items-start gap-3.5"
                      >
                        <button
                          type="button"
                          onClick={() => onToggleUpvote(q.id)}
                          aria-label={`Upvote question: ${q.title}`}
                          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[50px] py-1.5 rounded-2xl text-[12px] shrink-0 transition-colors ${
                            q.upvotedByMe
                              ? 'bg-[#141212] text-[#FFFFFF] font-semibold'
                              : 'bg-[#FCEBE8] text-[#141212] hover:bg-[#FBBFB5]'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.2} />
                          <span className="tabular-nums mt-0.5">{q.upvotes}</span>
                        </button>

                        <div className="min-w-0 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2.5">
                              <button
                                type="button"
                                onClick={() => onSelectQuestion(q.id)}
                                className="text-left text-[15px] font-semibold text-[#141212] leading-snug"
                              >
                                <MathText text={q.title} />
                              </button>

                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                                  q.isAnswered
                                    ? 'bg-[#FCEBE8] text-[#6E5B59]'
                                    : 'bg-[#FBBFB5] text-[#141212]'
                                }`}
                              >
                                {q.verifiedByFaculty
                                  ? 'Verified'
                                  : q.isAnswered
                                  ? 'Answered'
                                  : 'Unanswered'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#6E5B59]">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span>{q.isAnonymous ? 'Anonymous' : q.studentName}</span>
                              <span aria-hidden="true">·</span>
                              <span>{q.subject}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onSelectQuestion(q.id)}
                              className="inline-flex items-center gap-1 text-[#141212] font-medium whitespace-nowrap shrink-0"
                            >
                              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.85} />
                              <span className="tabular-nums">{q.replies.length}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Native iOS Sheet Modal for Ask Community */}
      {isComposerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ask-community-title"
          className="fixed inset-0 z-50 bg-[#141212]/35 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-lg bg-[#FCEBE8] rounded-t-[32px] sm:rounded-[28px] p-5 sm:p-6 space-y-4">
            <div className="w-10 h-1.5 bg-[#DFC1BD] rounded-full mx-auto -mt-1 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-[#EED0CC]">
              <h2 id="ask-community-title" className="text-[18px] font-bold text-[#141212]">
                Ask the community
              </h2>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                aria-label="Close modal"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F6D5D0] text-[#141212]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label htmlFor="comm-subject" className="block text-[12.5px] font-semibold text-[#6E5B59] mb-1">
                  Subject
                </label>
                <select
                  id="comm-subject"
                  value={newSubject}
                  onChange={(e) =>
                    setNewSubject(e.target.value as Exclude<SubjectName, 'General'>)
                  }
                  className="w-full min-h-[42px] px-4 py-2 bg-[#FFF9F8] rounded-2xl text-[14px] font-medium text-[#141212] focus:outline-none"
                >
                  {SUBJECT_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comm-title" className="block text-[12.5px] font-semibold text-[#6E5B59] mb-1">
                  Question title
                </label>
                <input
                  id="comm-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Summarize what you are stuck on..."
                  className="w-full min-h-[42px] px-4 py-2 bg-[#FFF9F8] rounded-2xl text-[14px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="comm-body" className="block text-[12.5px] font-semibold text-[#6E5B59] mb-1">
                  Details &amp; what you tried
                </label>
                <textarea
                  id="comm-body"
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Share your steps or where your reasoning breaks down..."
                  className="w-full px-4 py-2.5 bg-[#FFF9F8] rounded-2xl text-[14px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
                />
              </div>

              <label className="min-h-[40px] flex items-center gap-2.5 text-[13.5px] font-medium text-[#141212] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-[#141212] rounded"
                />
                <span>Post anonymously (hide my name from classmates)</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="min-h-[42px] px-4 py-2 rounded-full bg-[#FFF9F8] text-[13.5px] font-semibold text-[#141212]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2 rounded-full bg-[#141212] text-[#FFFFFF] text-[13.5px] font-semibold hover:bg-[#2B2626]"
                >
                  Publish question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
