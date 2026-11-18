import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronRight,
  Copy,
  FileText,
  Paperclip,
  ThumbsUp,
  UserPlus,
  X,
} from 'lucide-react';
import {
  AttachmentPreview,
  DoubtExchange,
  SubjectName,
} from '../types/doubtly';
import { SUBJECT_LIST } from '../data/academicData';
import { MathBlock, MathText } from './MathText';

interface AskDoubtViewProps {
  exchanges: DoubtExchange[];
  activeExchangeId: string | null;
  savedExchangeIds: string[];
  isLoading: boolean;
  errorMessage: string | null;
  onSelectExchange: (id: string | null) => void;
  onSubmitQuestion: (
    question: string,
    subject: SubjectName,
    attachment?: AttachmentPreview | null
  ) => Promise<void>;
  onToggleSave: (exchangeId: string) => void;
  onVoteHelpful: (exchangeId: string) => void;
  onEscalateToMentor: (exchange: DoubtExchange) => void;
  onDismissError: () => void;
}

const STARTER_QUESTIONS = [
  'Why does a recursive function overflow the stack without a base case?',
  'Derive the condition for critical damping in a second-order linear ODE.',
  'Explain why matrix multiplication is associative but not commutative.',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const AskDoubtView: React.FC<AskDoubtViewProps> = ({
  exchanges,
  activeExchangeId,
  savedExchangeIds,
  isLoading,
  errorMessage,
  onSelectExchange,
  onSubmitQuestion,
  onToggleSave,
  onVoteHelpful,
  onEscalateToMentor,
  onDismissError,
}) => {
  const [question, setQuestion] = useState('');
  const [subject, setSubject] = useState<SubjectName>('Calculus');
  const [attachment, setAttachment] = useState<AttachmentPreview | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeExchange =
    exchanges.find((ex) => ex.id === activeExchangeId) || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        setAttachment({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          sizeLabel: formatFileSize(file.size),
          data: base64,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!question.trim() && !attachment) || isLoading) return;
    const textToSend = question.trim();
    const fileToSend = attachment;
    setQuestion('');
    setAttachment(null);
    await onSubmitQuestion(textToSend, subject, fileToSend);
  };

  const handleCopy = async (exchange: DoubtExchange) => {
    const formatted = [
      `Question: ${exchange.question}`,
      '',
      `Concept: ${exchange.answer.conceptSummary}`,
      '',
      ...exchange.answer.steps.map(
        (s, i) => `${i + 1}. ${s.heading}\n${s.explanation}${s.math ? `\n${s.math}` : ''}`
      ),
      '',
      `Common Pitfall: ${exchange.answer.commonPitfall}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedId(exchange.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="min-h-full bg-[#FBBFB5]">
      {/* Top Coral Peach Header Zone */}
      <div className="px-4 sm:px-8 pt-6 pb-7 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold text-[#141212]/70">
              AI Doubt Solver
            </p>
            <h1 className="mt-0.5 text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] text-[#141212] leading-tight">
              Ask Doubt
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {exchanges.length > 0 && (
              <select
                aria-label="Select previous doubt"
                value={activeExchange?.id || ''}
                onChange={(e) => onSelectExchange(e.target.value || null)}
                className="min-h-[40px] max-w-[200px] sm:max-w-[240px] text-[13px] font-medium text-[#141212] bg-[#FFFFFF] rounded-full px-4 py-1.5 focus:outline-none truncate"
              >
                <option value="">New question</option>
                {exchanges.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.subject}: {ex.question.replace(/\$/g, '').slice(0, 36)}
                  </option>
                ))}
              </select>
            )}
            {activeExchange && (
              <button
                type="button"
                onClick={() => onSelectExchange(null)}
                className="min-h-[40px] px-4 py-1.5 rounded-full bg-[#141212] text-[13px] font-semibold text-[#FFFFFF] hover:bg-[#2B2626] active:scale-95 transition-all whitespace-nowrap shrink-0"
              >
                New doubt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curved Misty Rose Main Sheet */}
      <div className="bg-[#FCEBE8] rounded-t-[32px] min-h-[calc(100vh-116px)] px-4 sm:px-8 pt-7 pb-28 md:pb-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Error State */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start justify-between gap-4 bg-[#F6D5D0] rounded-[22px] px-5 py-4 text-[13.5px] text-[#141212]"
            >
              <div>
                <p className="font-semibold">Unable to generate explanation</p>
                <p className="mt-0.5 text-[#6E5B59]">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={onDismissError}
                aria-label="Dismiss error"
                className="p-1 text-[#6E5B59] hover:text-[#141212]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Fresh Doubt Composer */}
          {!activeExchange && !isLoading && (
            <div className="space-y-7">
              <form
                onSubmit={handleSubmit}
                className="bg-[#FFF9F8] rounded-[26px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(20,18,18,0.03)]"
              >
                <label
                  htmlFor="ask-ai-textarea"
                  className="block text-[13px] font-semibold text-[#6E5B59] mb-2"
                >
                  Describe your question, paste code, or attach a problem sheet
                </label>
                <textarea
                  id="ask-ai-textarea"
                  rows={5}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Why does L'Hôpital's rule apply to 0/0 limits, or attach a photo of a handwritten derivation..."
                  className="w-full resize-y bg-transparent text-[15.5px] text-[#141212] placeholder:text-[#6E5B59]/75 focus:outline-none leading-relaxed"
                />

                {attachment && (
                  <div className="mt-3 flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#FCEBE8] text-[13px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#141212] shrink-0" strokeWidth={2} />
                      <span className="text-[#141212] font-medium truncate">
                        {attachment.name}
                      </span>
                      <span className="text-[#6E5B59] tabular-nums shrink-0">
                        · {attachment.sizeLabel}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      aria-label="Remove attachment"
                      className="text-[#6E5B59] hover:text-[#141212] p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-[#EED0CC] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FCEBE8] text-[13px] font-semibold text-[#141212] hover:bg-[#F6D5D0] transition-colors whitespace-nowrap shrink-0"
                    >
                      <Paperclip className="w-3.5 h-3.5" strokeWidth={2} />
                      <span>Attach file</span>
                    </button>

                    <select
                      aria-label="Course subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as SubjectName)}
                      className="min-h-[40px] text-[13px] font-semibold text-[#141212] bg-[#FCEBE8] rounded-full px-4 py-2 focus:outline-none"
                    >
                      {SUBJECT_LIST.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj}
                        </option>
                      ))}
                      <option value="General">General</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!question.trim() && !attachment}
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2 rounded-full text-[13.5px] font-semibold bg-[#FBBFB5] text-[#141212] hover:bg-[#F7ACA0] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0"
                  >
                    <span>Explain step by step</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                </div>
              </form>

              <div className="space-y-3">
                <p className="text-[13px] font-semibold text-[#6E5B59] px-1">
                  Try a first-year prompt
                </p>
                <div className="space-y-2.5">
                  {STARTER_QUESTIONS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setQuestion(prompt)}
                      className="w-full min-h-[52px] text-left px-5 py-3.5 rounded-[20px] bg-[#F6D5D0] hover:bg-[#F3C9C3] active:scale-[0.99] text-[14px] font-medium text-[#141212] transition-all flex items-center justify-between gap-4"
                    >
                      <span>{prompt}</span>
                      <ChevronRight className="w-4 h-4 text-[#6E5B59] shrink-0" strokeWidth={2} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-[#FFF9F8] rounded-[26px] p-6 space-y-5">
              <div className="border-b border-[#EED0CC] pb-4">
                <p className="text-[12.5px] font-semibold text-[#6E5B59]">
                  Analyzing question…
                </p>
                <div className="mt-2.5 h-5 w-3/4 bg-[#F6D5D0] rounded-full animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-[#FCEBE8] rounded-full animate-pulse" />
                <div className="h-4 w-5/6 bg-[#FCEBE8] rounded-full animate-pulse" />
                <div className="h-16 w-full bg-[#FCEBE8] rounded-2xl animate-pulse" />
              </div>
            </div>
          )}

          {/* Editorial Answer Sheet (Matching Screen 3 simplicity) */}
          {activeExchange && !isLoading && (
            <article className="space-y-5">
              {/* Question Header Tile */}
              <header className="bg-[#FFF9F8] rounded-[26px] p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-[#6E5B59]">
                  <span className="text-[#141212] font-semibold">
                    {activeExchange.answer.subject || activeExchange.subject}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeExchange.createdAt}</span>
                  {activeExchange.attachmentName && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Attached: {activeExchange.attachmentName}</span>
                    </>
                  )}
                  {activeExchange.escalatedTo && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#141212] font-semibold">
                        Escalated to {activeExchange.escalatedTo}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="mt-2 text-[20px] sm:text-[22px] font-bold text-[#141212] leading-snug">
                  <MathText text={activeExchange.question} />
                </h2>
              </header>

              {/* Main Explanation Card */}
              <section className="bg-[#FFF9F8] rounded-[26px] p-5 sm:p-6 space-y-6">
                <div className="space-y-2 pb-5 border-b border-[#EED0CC]">
                  <h3 className="text-[12.5px] font-semibold text-[#6E5B59]">
                    Concept overview
                  </h3>
                  <p className="text-[15px] text-[#141212] leading-[1.7]">
                    <MathText text={activeExchange.answer.conceptSummary} />
                  </p>
                </div>

                <div className="space-y-5">
                  <h3 className="text-[12.5px] font-semibold text-[#6E5B59]">
                    Step-by-step explanation
                  </h3>
                  <ol className="space-y-5">
                    {activeExchange.answer.steps.map((step, index) => (
                      <li
                        key={index}
                        className="pb-5 border-b border-[#EED0CC] last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[12.5px] font-semibold text-[#6E5B59] tabular-nums shrink-0">
                            0{index + 1}.
                          </span>
                          <div className="min-w-0 flex-1 space-y-2">
                            <h4 className="text-[15.5px] font-semibold text-[#141212]">
                              <MathText text={step.heading} />
                            </h4>
                            <p className="text-[14.5px] text-[#141212]/90 leading-[1.68]">
                              <MathText text={step.explanation} />
                            </p>
                            {step.math && <MathBlock latex={step.math} />}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>

              {/* Common Pitfall Blush Tile */}
              <section className="bg-[#F6D5D0] rounded-[22px] p-5 space-y-1.5">
                <h3 className="text-[12.5px] font-semibold text-[#141212]">
                  Common pitfall
                </h3>
                <p className="text-[14.5px] text-[#141212]/90 leading-relaxed">
                  <MathText text={activeExchange.answer.commonPitfall} />
                </p>
              </section>

              {/* Action Row (Screen 3 style soft peach & clean pills) */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(activeExchange)}
                    className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF9F8] text-[13px] font-semibold text-[#141212] hover:bg-[#F6D5D0] transition-colors whitespace-nowrap shrink-0"
                  >
                    {copiedId === activeExchange.id ? (
                      <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-[#6E5B59]" strokeWidth={2} />
                    )}
                    <span>{copiedId === activeExchange.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSave(activeExchange.id)}
                    className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      savedExchangeIds.includes(activeExchange.id)
                        ? 'bg-[#141212] text-[#FFFFFF]'
                        : 'bg-[#FFF9F8] text-[#141212] hover:bg-[#F6D5D0]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>
                      {savedExchangeIds.includes(activeExchange.id) ? 'Saved' : 'Save'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onVoteHelpful(activeExchange.id)}
                    className={`min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      activeExchange.helpfulVote === 'up'
                        ? 'bg-[#141212] text-[#FFFFFF]'
                        : 'bg-[#FFF9F8] text-[#141212] hover:bg-[#F6D5D0]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>
                      {activeExchange.helpfulVote === 'up' ? 'Helpful' : 'Mark helpful'}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onEscalateToMentor(activeExchange)}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FBBFB5] text-[13px] font-semibold text-[#141212] hover:bg-[#F7ACA0] active:scale-95 transition-all whitespace-nowrap shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Ask a mentor</span>
                </button>
              </div>

              {/* Follow-up Suggestions */}
              {activeExchange.answer.followUpPrompts.length > 0 && (
                <section className="space-y-2.5">
                  <p className="text-[12.5px] font-semibold text-[#6E5B59] px-1">
                    Suggested follow-ups
                  </p>
                  <div className="space-y-2">
                    {activeExchange.answer.followUpPrompts.map((followUp) => (
                      <button
                        key={followUp}
                        type="button"
                        onClick={() =>
                          onSubmitQuestion(
                            followUp,
                            (activeExchange.answer.subject as SubjectName) ||
                              activeExchange.subject
                          )
                        }
                        className="w-full min-h-[46px] text-left px-4 py-3 rounded-[18px] bg-[#F6D5D0] hover:bg-[#F3C9C3] text-[13.5px] font-medium text-[#141212] transition-colors flex items-center justify-between gap-4"
                      >
                        <span>
                          <MathText text={followUp} />
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#6E5B59] shrink-0" strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* White Pill Follow-up Input */}
              <form onSubmit={handleSubmit} className="pt-1">
                <div className="flex items-center gap-2 bg-[#FFFFFF] rounded-full px-4 py-1.5 shadow-[0_2px_10px_rgba(20,18,18,0.04)]">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a follow-up question..."
                    className="flex-1 bg-transparent text-[14.5px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none min-h-[40px]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach image or PDF"
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full bg-[#FCEBE8] text-[#141212] hover:bg-[#F6D5D0]"
                  >
                    <Paperclip className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button
                    type="submit"
                    disabled={!question.trim() && !attachment}
                    aria-label="Send follow-up"
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full bg-[#141212] text-[#FFFFFF] hover:bg-[#2B2626] disabled:opacity-40"
                  >
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                </div>
                {attachment && (
                  <div className="mt-2 px-3 flex items-center justify-between text-[12.5px] text-[#6E5B59]">
                    <span className="truncate">Attached: {attachment.name}</span>
                    <button
                      type="button"
                      onClick={() => setAttachment(null)}
                      className="text-[#141212] font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>
            </article>
          )}
        </div>
      </div>
    </div>
  );
};
