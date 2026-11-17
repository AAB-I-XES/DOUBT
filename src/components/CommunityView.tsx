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
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAE8E5]">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#222222]">
            Community
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#858585]">
            Peer discussions reviewed by senior mentors and course faculty.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsComposerOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-medium bg-[#222222] text-[#FAF9F7] hover:bg-[#363636] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Ask community</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="space-y-3">
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
              placeholder="Search questions or topics..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FFFFFF] border border-[#EAE8E5] rounded-md text-[13.5px] text-[#222222] placeholder:text-[#858585] focus:outline-none focus:border-[#A99AE8]"
            />
          </div>

          <div className="inline-flex items-center border border-[#EAE8E5] rounded-md bg-[#FFFFFF] p-0.5 self-start">
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
                className={`px-3 py-1 rounded text-[12.5px] transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-[#F3E8E7] text-[#222222] font-medium'
                    : 'text-[#858585] hover:text-[#222222]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', ...SUBJECT_LIST].map((subj) => (
            <button
              key={subj}
              type="button"
              onClick={() => setSubjectFilter(subj)}
              className={`px-3 py-1 rounded-md text-[12.5px] border transition-colors whitespace-nowrap shrink-0 ${
                subjectFilter === subj
                  ? 'border-[#A99AE8] bg-[#FFFFFF] text-[#222222] font-medium'
                  : 'border-transparent text-[#858585] hover:text-[#222222] hover:bg-[#FFFFFF]/60'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: List or Detail Thread */}
      {activeQuestion ? (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => onSelectQuestion(null)}
            className="text-[13px] text-[#858585] hover:text-[#222222] transition-colors"
          >
            ← Back to all questions
          </button>

          <article className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#858585]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-medium text-[#222222]">
                  {activeQuestion.isAnonymous ? 'Anonymous student' : activeQuestion.studentName}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeQuestion.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{activeQuestion.timestamp}</span>
              </div>

              <span
                className={`text-[12px] px-2 py-0.5 rounded border ${
                  activeQuestion.isAnswered
                    ? 'border-[#EAE8E5] bg-[#FAF9F7] text-[#222222]'
                    : 'border-[#E6D5D4] bg-[#F3E8E7] text-[#222222]'
                }`}
              >
                {activeQuestion.verifiedByFaculty
                  ? 'Faculty verified'
                  : activeQuestion.isAnswered
                  ? 'Answered'
                  : 'Unanswered'}
              </span>
            </div>

            <h2 className="text-[19px] font-semibold text-[#222222] leading-snug">
              <MathText text={activeQuestion.title} />
            </h2>

            <p className="text-[15px] text-[#222222]/90 leading-[1.68]">
              <MathText text={activeQuestion.body} />
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onToggleUpvote(activeQuestion.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] transition-colors ${
                  activeQuestion.upvotedByMe
                    ? 'border-[#A99AE8] bg-[#F3E8E7]/50 text-[#222222] font-medium'
                    : 'border-[#EAE8E5] bg-[#FAF9F7] text-[#222222] hover:border-[#A99AE8]'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="tabular-nums">{activeQuestion.upvotes}</span>
                <span>Helpful</span>
              </button>

              <span className="text-[13px] text-[#858585] tabular-nums">
                {activeQuestion.replies.length}{' '}
                {activeQuestion.replies.length === 1 ? 'response' : 'responses'}
              </span>
            </div>
          </article>

          {/* Replies */}
          <section className="space-y-4">
            <h3 className="text-[14px] font-semibold text-[#222222]">
              Responses
            </h3>

            {activeQuestion.replies.length === 0 ? (
              <p className="py-6 text-center text-[13.5px] text-[#858585] border border-[#EAE8E5] rounded-lg bg-[#FFFFFF]">
                No peer or mentor responses yet. Share an explanation below.
              </p>
            ) : (
              <ul className="space-y-3">
                {activeQuestion.replies.map((reply) => (
                  <li
                    key={reply.id}
                    className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-4 sm:p-5 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#222222]">
                          {reply.authorName}
                        </span>
                        <span aria-hidden="true" className="text-[#858585]">·</span>
                        <span className="text-[#858585]">{reply.authorRole}</span>
                        <span aria-hidden="true" className="text-[#858585]">·</span>
                        <span className="text-[#858585]">{reply.timestamp}</span>
                      </div>

                      {reply.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#5B4BB7] font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[14.5px] text-[#222222] leading-[1.65]">
                      <MathText text={reply.content} />
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Add Reply Form */}
            <form
              onSubmit={handleReplySubmit}
              className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-4 space-y-3 focus-within:border-[#A99AE8]"
            >
              <label htmlFor="community-reply" className="block text-[12.5px] text-[#858585]">
                Write a response as Alex Rivera
              </label>
              <textarea
                id="community-reply"
                rows={3}
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder="Explain clearly or share a helpful hint (use $...$ for LaTeX math)..."
                className="w-full resize-none bg-transparent text-[14.5px] text-[#222222] placeholder:text-[#858585] focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!replyDraft.trim()}
                  className="px-4 py-1.5 rounded-md text-[13px] font-medium bg-[#222222] text-[#FAF9F7] hover:bg-[#363636] disabled:opacity-40 transition-colors"
                >
                  Post reply
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : (
        <div className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
          {filteredQuestions.length === 0 ? (
            <div className="py-12 px-6 text-center space-y-2">
              <p className="text-[14.5px] font-medium text-[#222222]">
                No matching questions
              </p>
              <p className="text-[13px] text-[#858585]">
                Try clearing your filters or ask the community directly.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:px-5 sm:py-4 hover:bg-[#FAF9F7]/70 transition-colors flex items-start gap-4"
              >
                {/* Upvote Control */}
                <button
                  type="button"
                  onClick={() => onToggleUpvote(q.id)}
                  aria-label={`Upvote question: ${q.title}`}
                  className={`flex flex-col items-center justify-center w-11 py-1.5 rounded-md border text-[12px] shrink-0 transition-colors ${
                    q.upvotedByMe
                      ? 'border-[#A99AE8] bg-[#F3E8E7]/60 text-[#222222] font-medium'
                      : 'border-[#EAE8E5] bg-[#FAF9F7] text-[#858585] hover:text-[#222222]'
                  }`}
                >
                  <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span className="tabular-nums mt-0.5">{q.upvotes}</span>
                </button>

                {/* Question Row Body */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectQuestion(q.id)}
                      className="text-left text-[15px] font-medium text-[#222222] hover:text-[#5B4BB7] transition-colors leading-snug"
                    >
                      <MathText text={q.title} />
                    </button>

                    <span
                      className={`text-[11.5px] px-2 py-0.5 rounded border shrink-0 whitespace-nowrap ${
                        q.isAnswered
                          ? 'border-[#EAE8E5] bg-[#FAF9F7] text-[#858585]'
                          : 'border-[#E6D5D4] bg-[#F3E8E7] text-[#222222] font-medium'
                      }`}
                    >
                      {q.verifiedByFaculty
                        ? 'Verified'
                        : q.isAnswered
                        ? 'Answered'
                        : 'Unanswered'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#858585]">
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
                      className="inline-flex items-center gap-1.5 text-[#858585] hover:text-[#222222] transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.75} />
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

      {/* Ask Community Modal */}
      {isComposerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ask-community-title"
          className="fixed inset-0 z-50 bg-[#222222]/25 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg bg-[#FAF9F7] border border-[#EAE8E5] rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E5]">
              <h2 id="ask-community-title" className="text-[16px] font-semibold text-[#222222]">
                Ask the community
              </h2>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                aria-label="Close modal"
                className="text-[#858585] hover:text-[#222222] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label htmlFor="comm-subject" className="block text-[12.5px] text-[#858585] mb-1">
                  Subject
                </label>
                <select
                  id="comm-subject"
                  value={newSubject}
                  onChange={(e) =>
                    setNewSubject(e.target.value as Exclude<SubjectName, 'General'>)
                  }
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#EAE8E5] rounded-md text-[13.5px] text-[#222222] focus:outline-none focus:border-[#A99AE8]"
                >
                  {SUBJECT_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comm-title" className="block text-[12.5px] text-[#858585] mb-1">
                  Question title
                </label>
                <input
                  id="comm-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Summarize what you are stuck on..."
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#EAE8E5] rounded-md text-[14px] text-[#222222] placeholder:text-[#858585] focus:outline-none focus:border-[#A99AE8]"
                />
              </div>

              <div>
                <label htmlFor="comm-body" className="block text-[12.5px] text-[#858585] mb-1">
                  Details & what you tried
                </label>
                <textarea
                  id="comm-body"
                  rows={4}
                  required
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Share your steps or where your reasoning breaks down..."
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#EAE8E5] rounded-md text-[14px] text-[#222222] placeholder:text-[#858585] focus:outline-none focus:border-[#A99AE8]"
                />
              </div>

              <label className="flex items-center gap-2.5 text-[13.5px] text-[#222222] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 accent-[#A99AE8] rounded"
                />
                <span>Post anonymously (hide my name from classmates)</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 rounded-md border border-[#EAE8E5] bg-[#FFFFFF] text-[13px] text-[#222222] hover:bg-[#FAF9F7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#222222] text-[#FAF9F7] text-[13px] font-medium hover:bg-[#363636]"
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
