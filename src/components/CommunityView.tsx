import React, { useMemo, useState } from 'react';
import { ArrowUp, CheckCircle2, MessageSquare, Plus, Search, X } from 'lucide-react';
import { CommunityQuestion, SubjectName } from '../types/doubtly';
import { SUBJECT_LIST } from '../data/academicData';
import { MathText } from './MathText';

interface CommunityViewProps {
  questions: CommunityQuestion[];
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
  selectedQuestionId,
  onSelectQuestion,
  onToggleUpvote,
  onAddReply,
  onCreateQuestion,
}) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#221D1E]">
            Community
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#7B6F71]">
            Peer discussions reviewed by senior mentors and course faculty.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13.5px] font-semibold bg-[#C45B72] text-[#FFFFFF] hover:bg-[#A64258] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
          <span>Ask community</span>
        </button>
      </div>

      {/* iOS Search Bar & Segmented Control */}
      <div className="space-y-3">
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
              placeholder="Search questions or topics..."
              className="w-full min-h-[42px] pl-10 pr-3.5 py-2 bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl text-[14px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none focus:border-[#C45B72]"
            />
          </div>

          {/* iOS Segmented Control */}
          <div className="inline-flex items-center bg-[#F4E3E3] p-1 rounded-xl self-start">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'unanswered', label: 'Unanswered' },
                { id: 'answered', label: 'Answered' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`min-h-[34px] px-3.5 py-1 rounded-lg text-[12.5px] transition-all whitespace-nowrap shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-[#FFFFFF] text-[#221D1E] font-semibold shadow-[0_1px_2px_rgba(166,66,88,0.08)]'
                    : 'text-[#7B6F71] hover:text-[#221D1E] font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', ...SUBJECT_LIST].map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSubjectFilter(subj)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-[13px] border transition-colors whitespace-nowrap shrink-0 ${
                subjectFilter === subj
                  ? 'border-[#E7BFC4] bg-[#FFE4E1] text-[#A64258] font-semibold'
                  : 'border-transparent bg-[#FFFFFF]/70 text-[#7B6F71] hover:text-[#221D1E] hover:bg-[#FFFFFF]'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Inset Grouped List or Detail Thread */}
      {activeQuestion ? (
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => onSelectQuestion(null)}
            className="min-h-[40px] inline-flex items-center text-[13.5px] font-medium text-[#C45B72] hover:text-[#A64258] transition-colors"
          >
            ← All questions
          </button>

          <article className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#7B6F71]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-[#221D1E]">
                  {activeQuestion.isAnonymous ? 'Anonymous student' : activeQuestion.studentName}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeQuestion.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{activeQuestion.timestamp}</span>
              </div>

              <span
                className={`text-[12px] font-medium px-2.5 py-0.5 rounded-lg border ${
                  activeQuestion.isAnswered
                    ? 'border-[#EFE2E2] bg-[#FCF6F6] text-[#7B6F71]'
                    : 'border-[#F2CECA] bg-[#FFE4E1] text-[#A64258]'
                }`}
              >
                {activeQuestion.verifiedByFaculty
                  ? 'Faculty verified'
                  : activeQuestion.isAnswered
                  ? 'Answered'
                  : 'Unanswered'}
              </span>
            </div>

            <h2 className="text-[19px] font-semibold text-[#221D1E] leading-snug">
              <MathText text={activeQuestion.title} />
            </h2>

            <p className="text-[15px] text-[#221D1E]/90 leading-[1.68]">
              <MathText text={activeQuestion.body} />
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onToggleUpvote(activeQuestion.id)}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-[13px] font-medium transition-colors ${
                  activeQuestion.upvotedByMe
                    ? 'border-[#E7BFC4] bg-[#FFE4E1] text-[#A64258]'
                    : 'border-[#EFE2E2] bg-[#FCF6F6] text-[#221D1E] hover:border-[#C45B72]'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="tabular-nums">{activeQuestion.upvotes}</span>
                <span>Helpful</span>
              </button>

              <span className="text-[13px] text-[#7B6F71] tabular-nums">
                {activeQuestion.replies.length}{' '}
                {activeQuestion.replies.length === 1 ? 'response' : 'responses'}
              </span>
            </div>
          </article>

          {/* Replies */}
          <section className="space-y-3">
            <h3 className="text-[14px] font-semibold text-[#221D1E] px-1">
              Responses
            </h3>

            {activeQuestion.replies.length === 0 ? (
              <p className="py-8 text-center text-[13.5px] text-[#7B6F71] border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF]">
                No peer or mentor responses yet. Share an explanation below.
              </p>
            ) : (
              <ul className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl divide-y divide-[#EFE2E2] overflow-hidden">
                {activeQuestion.replies.map((reply) => (
                  <li key={reply.id} className="p-4 sm:p-5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#221D1E]">
                          {reply.authorName}
                        </span>
                        <span aria-hidden="true" className="text-[#7B6F71]">·</span>
                        <span className="text-[#7B6F71]">{reply.authorRole}</span>
                        <span aria-hidden="true" className="text-[#7B6F71]">·</span>
                        <span className="text-[#7B6F71]">{reply.timestamp}</span>
                      </div>

                      {reply.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#A64258] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C45B72]" strokeWidth={2} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[14.5px] text-[#221D1E] leading-[1.65]">
                      <MathText text={reply.content} />
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Add Reply Form */}
            <form
              onSubmit={handleReplySubmit}
              className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-4 space-y-3 focus-within:border-[#C45B72]"
            >
              <label htmlFor="community-reply" className="block text-[12.5px] font-medium text-[#7B6F71]">
                Write a response as Alex Rivera
              </label>
              <textarea
                id="community-reply"
                rows={3}
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder="Explain clearly or share a helpful hint (use $...$ for LaTeX math)..."
                className="w-full resize-none bg-transparent text-[14.5px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!replyDraft.trim()}
                  className="min-h-[40px] px-4 py-1.5 rounded-xl text-[13.5px] font-semibold bg-[#C45B72] text-[#FFFFFF] hover:bg-[#A64258] disabled:opacity-40 transition-colors"
                >
                  Post reply
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        <div className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-1.5">
              <p className="text-[15px] font-semibold text-[#221D1E]">
                No matching questions
              </p>
              <p className="text-[13px] text-[#7B6F71]">
                Try clearing your filters or ask the community directly.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:px-5 sm:py-4 hover:bg-[#FCF6F6] transition-colors flex items-start gap-3.5"
              >
                <button
                  type="button"
                  onClick={() => onToggleUpvote(q.id)}
                  aria-label={`Upvote question: ${q.title}`}
                  className={`flex flex-col items-center justify-center min-w-[44px] min-h-[48px] py-1.5 rounded-xl border text-[12px] shrink-0 transition-colors ${
                    q.upvotedByMe
                      ? 'border-[#E7BFC4] bg-[#FFE4E1] text-[#A64258] font-semibold'
                      : 'border-[#EFE2E2] bg-[#FCF6F6] text-[#7B6F71] hover:text-[#221D1E]'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="tabular-nums mt-0.5">{q.upvotes}</span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectQuestion(q.id)}
                      className="text-left text-[15px] font-medium text-[#221D1E] hover:text-[#A64258] transition-colors leading-snug"
                    >
                      <MathText text={q.title} />
                    </button>

                    <span
                      className={`text-[11.5px] font-medium px-2.5 py-0.5 rounded-lg border shrink-0 whitespace-nowrap ${
                        q.isAnswered
                          ? 'border-[#EFE2E2] bg-[#FCF6F6] text-[#7B6F71]'
                          : 'border-[#F2CECA] bg-[#FFE4E1] text-[#A64258]'
                      }`}
                    >
                      {q.verifiedByFaculty
                        ? 'Verified'
                        : q.isAnswered
                        ? 'Answered'
                        : 'Unanswered'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#7B6F71]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span>{q.isAnonymous ? 'Anonymous' : q.studentName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.timestamp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectQuestion(q.id)}
                      className="min-h-[32px] inline-flex items-center gap-1.5 text-[#7B6F71] hover:text-[#A64258] transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.85} />
                      <span className="tabular-nums">
                        {q.replies.length}{' '}
                        {q.replies.length === 1 ? 'reply' : 'replies'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* iOS Bottom Sheet / Desktop Centered Modal for Ask Community */}
      {isComposerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ask-community-title"
          className="fixed inset-0 z-50 bg-[#221D1E]/35 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-lg bg-[#FCF6F6] border-t sm:border border-[#EFE2E2] rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="w-10 h-1.5 bg-[#DFC8C8] rounded-full mx-auto mb-1 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-[#EFE2E2]">
              <h2 id="ask-community-title" className="text-[17px] font-semibold text-[#221D1E]">
                Ask the community
              </h2>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                aria-label="Close modal"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-[#F4E3E3] text-[#7B6F71] hover:text-[#221D1E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label htmlFor="comm-subject" className="block text-[12.5px] font-medium text-[#7B6F71] mb-1">
                  Subject
                </label>
                <select
                  id="comm-subject"
                  value={newSubject}
                  onChange={(e) =>
                    setNewSubject(e.target.value as Exclude<SubjectName, 'General'>)
                  }
                  className="w-full min-h-[42px] px-3 py-2 bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl text-[14px] text-[#221D1E] focus:outline-none focus:border-[#C45B72]"
                >
                  {SUBJECT_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comm-title" className="block text-[12.5px] font-medium text-[#7B6F71] mb-1">
                  Question title
                </label>
                <input
                  id="comm-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Summarize what you are stuck on..."
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl text-[14px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none focus:border-[#C45B72]"
                />
              </div>

              <div>
                <label htmlFor="comm-body" className="block text-[12.5px] font-medium text-[#7B6F71] mb-1">
                  Details & what you tried
                </label>
                <textarea
                  id="comm-body"
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Share your steps or where your reasoning breaks down..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl text-[14px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none focus:border-[#C45B72]"
                />
              </div>

              <label className="min-h-[40px] flex items-center gap-2.5 text-[13.5px] text-[#221D1E] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-[#C45B72] rounded"
                />
                <span>Post anonymously (hide my name from classmates)</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="min-h-[42px] px-4 py-2 rounded-xl border border-[#EFE2E2] bg-[#FFFFFF] text-[13.5px] font-medium text-[#221D1E] hover:bg-[#FCF6F6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[42px] px-5 py-2 rounded-xl bg-[#C45B72] text-[#FFFFFF] text-[13.5px] font-semibold hover:bg-[#A64258]"
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
