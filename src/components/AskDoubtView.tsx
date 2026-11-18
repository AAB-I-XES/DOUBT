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
    <div className="space-y-7">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#221D1E]">
            Ask Doubt
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#7B6F71]">
            Step-by-step explanations with formatted math and image or PDF analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exchanges.length > 0 && (
            <select
              aria-label="Select previous doubt"
              value={activeExchange?.id || ''}
              onChange={(e) => onSelectExchange(e.target.value || null)}
              className="min-h-[42px] max-w-[230px] text-[13px] font-medium text-[#221D1E] bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#C45B72] truncate"
            >
              <option value="">New question</option>
              {exchanges.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.subject}: {ex.question.replace(/\$/g, '').slice(0, 38)}
                </option>
              ))}
            </select>
          )}
          {activeExchange && (
            <button
              type="button"
              onClick={() => onSelectExchange(null)}
              className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-[#FFE4E1] text-[13px] font-semibold text-[#A64258] hover:bg-[#F7D3CF] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
            >
              New doubt
            </button>
          )}
        </div>
      </div>

      {/* Error State */}
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-4 border border-[#E7BFC4] bg-[#FFE4E1]/70 rounded-2xl px-4 py-3.5 text-[13.5px] text-[#221D1E]"
        >
          <div>
            <p className="font-semibold text-[#A64258]">Unable to generate explanation</p>
            <p className="mt-0.5 text-[#543E42]">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center text-[#7B6F71] hover:text-[#221D1E]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Central Composer */}
      {!activeExchange && !isLoading && (
        <div className="max-w-3xl mx-auto pt-2 pb-6 space-y-7">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(166,66,88,0.04)] focus-within:border-[#C45B72] transition-colors"
          >
            <label
              htmlFor="ask-ai-textarea"
              className="block text-[13px] font-medium text-[#7B6F71] mb-2"
            >
              Type your question, paste code, or attach notes
            </label>
            <textarea
              id="ask-ai-textarea"
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Why does L'Hôpital's rule apply to 0/0 limits, or attach a photo of a handwritten derivation..."
              className="w-full resize-y bg-transparent text-[15.5px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none leading-relaxed"
            />

            {attachment && (
              <div className="mt-3 flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-[#EFE2E2] bg-[#FCF6F6] text-[13px]">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#C45B72] shrink-0" strokeWidth={1.85} />
                  <span className="text-[#221D1E] font-medium truncate">{attachment.name}</span>
                  <span className="text-[#7B6F71] tabular-nums shrink-0">
                    · {attachment.sizeLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  aria-label="Remove attachment"
                  className="text-[#7B6F71] hover:text-[#221D1E] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#EFE2E2] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
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
                  className="min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#EFE2E2] bg-[#FCF6F6] text-[13px] font-medium text-[#221D1E] hover:bg-[#FFE4E1]/60 transition-colors whitespace-nowrap shrink-0"
                >
                  <Paperclip className="w-4 h-4 text-[#C45B72]" strokeWidth={1.85} />
                  <span>Attach image or PDF</span>
                </button>

                <select
                  aria-label="Course subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectName)}
                  className="min-h-[42px] text-[13px] font-medium text-[#221D1E] bg-[#FCF6F6] border border-[#EFE2E2] rounded-xl px-3 py-2 focus:outline-none focus:border-[#C45B72]"
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
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[14px] font-semibold bg-[#C45B72] text-[#FFFFFF] hover:bg-[#A64258] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap shrink-0"
              >
                <span>Explain step by step</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </form>

          {/* Starter Prompts Grouped List */}
          <div className="space-y-2">
            <p className="text-[12.5px] font-medium text-[#7B6F71] px-1">
              Try a first-year prompt
            </p>
            <div className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl divide-y divide-[#EFE2E2] overflow-hidden">
              {STARTER_QUESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuestion(prompt)}
                  className="w-full min-h-[48px] text-left px-4 py-3 text-[14px] text-[#221D1E] hover:bg-[#FCF6F6] active:bg-[#FFE4E1]/50 transition-colors flex items-center justify-between gap-4"
                >
                  <span>{prompt}</span>
                  <ChevronRight className="w-4 h-4 text-[#B8A7AA] shrink-0" strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-3xl mx-auto bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-6 space-y-5">
          <div className="border-b border-[#EFE2E2] pb-4">
            <p className="text-[12.5px] font-medium text-[#A64258]">Analyzing question…</p>
            <div className="mt-2.5 h-5 w-3/4 bg-[#F8E8E8] rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-[#FCF6F6] rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-[#FCF6F6] rounded animate-pulse" />
            <div className="h-16 w-full bg-[#FCF6F6] border border-[#EFE2E2] rounded-xl animate-pulse" />
            <div className="h-4 w-2/3 bg-[#FCF6F6] rounded animate-pulse" />
          </div>
        </div>
      )}

      {/* Distraction-free Editorial / iOS Document Explanation View */}
      {activeExchange && !isLoading && (
        <article className="max-w-3xl mx-auto space-y-6">
          {/* Question Card */}
          <header className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#7B6F71]">
              <span className="font-medium text-[#A64258]">
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
                  <span className="text-[#A64258] font-medium">
                    Escalated to {activeExchange.escalatedTo}
                  </span>
                </>
              )}
            </div>
            <h2 className="mt-2 text-[19px] sm:text-[21px] font-semibold text-[#221D1E] leading-snug">
              <MathText text={activeExchange.question} />
            </h2>
          </header>

          {/* Concept Overview + Steps */}
          <section className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-5 sm:p-6 space-y-6 shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
            <div className="space-y-2 pb-5 border-b border-[#EFE2E2]">
              <h3 className="text-[12.5px] font-semibold text-[#A64258]">
                Concept overview
              </h3>
              <p className="text-[15.5px] text-[#221D1E] leading-[1.7]">
                <MathText text={activeExchange.answer.conceptSummary} />
              </p>
            </div>

            <div className="space-y-5">
              <h3 className="text-[12.5px] font-semibold text-[#A64258]">
                Step-by-step explanation
              </h3>
              <ol className="space-y-5">
                {activeExchange.answer.steps.map((step, index) => (
                  <li
                    key={index}
                    className="pb-5 border-b border-[#EFE2E2] last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[12.5px] font-medium text-[#C45B72] tabular-nums shrink-0">
                        0{index + 1}.
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <h4 className="text-[15.5px] font-semibold text-[#221D1E]">
                          <MathText text={step.heading} />
                        </h4>
                        <p className="text-[15px] text-[#221D1E]/90 leading-[1.68]">
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

          {/* Common Pitfall Card */}
          <section className="border border-[#F2CECA] bg-[#FFE4E1]/55 rounded-2xl p-4 sm:p-5 space-y-1.5">
            <h3 className="text-[12.5px] font-semibold text-[#A64258]">
              Common pitfall to watch for
            </h3>
            <p className="text-[14.5px] text-[#221D1E] leading-relaxed">
              <MathText text={activeExchange.answer.commonPitfall} />
            </p>
          </section>

          {/* iOS Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(activeExchange)}
                className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EFE2E2] bg-[#FFFFFF] text-[13px] font-medium text-[#221D1E] hover:bg-[#FCF6F6] transition-colors whitespace-nowrap shrink-0"
              >
                {copiedId === activeExchange.id ? (
                  <Check className="w-3.5 h-3.5 text-[#C45B72]" strokeWidth={2} />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#7B6F71]" strokeWidth={1.85} />
                )}
                <span>{copiedId === activeExchange.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleSave(activeExchange.id)}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  savedExchangeIds.includes(activeExchange.id)
                    ? 'border-[#E7BFC4] bg-[#FFE4E1] text-[#A64258]'
                    : 'border-[#EFE2E2] bg-[#FFFFFF] text-[#221D1E] hover:bg-[#FCF6F6]'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    savedExchangeIds.includes(activeExchange.id)
                      ? 'text-[#C45B72] fill-[#C45B72]/25'
                      : 'text-[#7B6F71]'
                  }`}
                  strokeWidth={1.85}
                />
                <span>
                  {savedExchangeIds.includes(activeExchange.id) ? 'Saved' : 'Save'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onVoteHelpful(activeExchange.id)}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-[13px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeExchange.helpfulVote === 'up'
                    ? 'border-[#E7BFC4] bg-[#FFE4E1] text-[#A64258]'
                    : 'border-[#EFE2E2] bg-[#FFFFFF] text-[#221D1E] hover:bg-[#FCF6F6]'
                }`}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 ${
                    activeExchange.helpfulVote === 'up'
                      ? 'text-[#C45B72]'
                      : 'text-[#7B6F71]'
                  }`}
                  strokeWidth={1.85}
                />
                <span>
                  {activeExchange.helpfulVote === 'up' ? 'Helpful' : 'Mark helpful'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onEscalateToMentor(activeExchange)}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EFE2E2] bg-[#FFFFFF] text-[13px] font-medium text-[#221D1E] hover:border-[#C45B72] transition-colors whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#C45B72]" strokeWidth={1.85} />
              <span>Ask a mentor</span>
            </button>
          </div>

          {/* Follow-up Suggestions */}
          {activeExchange.answer.followUpPrompts.length > 0 && (
            <section className="space-y-2">
              <p className="text-[12.5px] font-medium text-[#7B6F71] px-1">
                Suggested follow-ups
              </p>
              <ul className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl divide-y divide-[#EFE2E2] overflow-hidden">
                {activeExchange.answer.followUpPrompts.map((followUp) => (
                  <li key={followUp}>
                    <button
                      type="button"
                      onClick={() =>
                        onSubmitQuestion(
                          followUp,
                          (activeExchange.answer.subject as SubjectName) ||
                            activeExchange.subject
                        )
                      }
                      className="w-full min-h-[46px] text-left px-4 py-3 text-[14px] text-[#221D1E] hover:bg-[#FCF6F6] active:bg-[#FFE4E1]/50 transition-colors flex items-center justify-between gap-4"
                    >
                      <span>
                        <MathText text={followUp} />
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-[#B8A7AA] shrink-0"
                        strokeWidth={2}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Compact Follow-up Composer */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFFFF] border border-[#EFE2E2] rounded-2xl p-3.5 focus-within:border-[#C45B72] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 px-1.5 bg-transparent text-[14.5px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none min-h-[40px]"
              />
              <div className="flex items-center justify-end gap-2">
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
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-[#EFE2E2] text-[#7B6F71] hover:text-[#221D1E] hover:bg-[#FCF6F6] transition-colors"
                >
                  <Paperclip className="w-4 h-4" strokeWidth={1.85} />
                </button>
                <button
                  type="submit"
                  disabled={!question.trim() && !attachment}
                  className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13.5px] font-semibold bg-[#C45B72] text-[#FFFFFF] hover:bg-[#A64258] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Ask</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
            {attachment && (
              <div className="mt-2 pt-2 border-t border-[#EFE2E2] flex items-center justify-between text-[12.5px] text-[#7B6F71]">
                <span className="truncate">Attached: {attachment.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-[#A64258] font-medium hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </form>
        </article>
      )}
    </div>
  );
};
