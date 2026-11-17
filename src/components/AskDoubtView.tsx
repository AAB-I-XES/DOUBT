import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Check,
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
    <div className="space-y-8">
      {/* Top Minimal Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EAE8E5]">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#222222]">
            Ask Doubt
          </h1>
          <p className="mt-0.5 text-[13.5px] text-[#858585]">
            Clear step-by-step explanations with mathematical typesetting and document analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {exchanges.length > 0 && (
            <select
              aria-label="Select previous doubt"
              value={activeExchange?.id || ''}
              onChange={(e) => onSelectExchange(e.target.value || null)}
              className="max-w-[240px] text-[13px] text-[#222222] bg-[#FFFFFF] border border-[#EAE8E5] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#A99AE8] truncate"
            >
              <option value="">New question</option>
              {exchanges.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.subject}: {ex.question.replace(/\$/g, '').slice(0, 42)}
                </option>
              ))}
            </select>
          )}
          {activeExchange && (
            <button
              type="button"
              onClick={() => onSelectExchange(null)}
              className="px-3 py-1.5 rounded-md border border-[#EAE8E5] bg-[#FFFFFF] text-[13px] font-medium text-[#222222] hover:bg-[#F3E8E7]/50 transition-colors whitespace-nowrap shrink-0"
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
          className="flex items-start justify-between gap-4 border border-[#D8B4B2] bg-[#F3E8E7] rounded-md px-4 py-3 text-[13.5px] text-[#222222]"
        >
          <div>
            <p className="font-medium">Unable to generate explanation</p>
            <p className="mt-0.5 text-[#5A4B4A]">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={onDismissError}
            aria-label="Dismiss error"
            className="text-[#858585] hover:text-[#222222] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Central Composer (always cleanly accessible when starting fresh, or compact at bottom when reading) */}
      {!activeExchange && !isLoading && (
        <div className="max-w-3xl mx-auto pt-4 pb-6 space-y-8">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-5 sm:p-6 focus-within:border-[#A99AE8] transition-colors"
          >
            <label
              htmlFor="ask-ai-textarea"
              className="block text-[13px] font-medium text-[#858585] mb-2"
            >
              Describe your question, paste code, or attach a problem sheet
            </label>
            <textarea
              id="ask-ai-textarea"
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Why does L'Hôpital's rule apply to 0/0 limits, or attach a photo of a handwritten derivation..."
              className="w-full resize-y bg-transparent text-[15.5px] text-[#222222] placeholder:text-[#858585] focus:outline-none leading-relaxed"
            />

            {attachment && (
              <div className="mt-3 flex items-center justify-between gap-3 px-3 py-2 rounded-md border border-[#EAE8E5] bg-[#FAF9F7] text-[13px]">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-[#7D6CD6] shrink-0" strokeWidth={1.75} />
                  <span className="text-[#222222] truncate">{attachment.name}</span>
                  <span className="text-[#858585] tabular-nums shrink-0">
                    · {attachment.sizeLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  aria-label="Remove attachment"
                  className="text-[#858585] hover:text-[#222222]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#EAE8E5] flex flex-wrap items-center justify-between gap-3">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#EAE8E5] bg-[#FAF9F7] text-[13px] text-[#222222] hover:bg-[#F3E8E7]/50 transition-colors whitespace-nowrap shrink-0"
                >
                  <Paperclip className="w-3.5 h-3.5 text-[#858585]" strokeWidth={1.75} />
                  <span>Attach image or PDF</span>
                </button>

                <select
                  aria-label="Course subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectName)}
                  className="text-[13px] text-[#222222] bg-[#FAF9F7] border border-[#EAE8E5] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#A99AE8]"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-[13.5px] font-medium bg-[#222222] text-[#FAF9F7] hover:bg-[#363636] disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explain step by step</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>
          </form>

          {/* Simple Text Suggestions */}
          <div>
            <p className="text-[12.5px] text-[#858585] mb-2.5">
              Or try a first-year prompt
            </p>
            <div className="divide-y divide-[#EAE8E5] border-y border-[#EAE8E5]">
              {STARTER_QUESTIONS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setQuestion(prompt)}
                  className="w-full text-left py-2.5 px-1 text-[14px] text-[#222222] hover:text-[#5B4BB7] transition-colors flex items-center justify-between gap-4"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#858585] shrink-0" strokeWidth={1.75} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-3xl mx-auto py-8 space-y-6">
          <div className="border-b border-[#EAE8E5] pb-4">
            <p className="text-[12.5px] text-[#858585]">Analyzing question…</p>
            <div className="mt-2 h-5 w-3/4 bg-[#EAE8E5]/70 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-[#EAE8E5]/60 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-[#EAE8E5]/60 rounded animate-pulse" />
            <div className="h-16 w-full bg-[#FFFFFF] border border-[#EAE8E5] rounded-md animate-pulse" />
            <div className="h-4 w-2/3 bg-[#EAE8E5]/60 rounded animate-pulse" />
          </div>
        </div>
      )}

      {/* Editorial Structured Response View (No avatars, no chat bubbles) */}
      {activeExchange && !isLoading && (
        <article className="max-w-3xl mx-auto space-y-8">
          {/* Student Question Header */}
          <header className="pb-5 border-b border-[#EAE8E5]">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[#858585]">
              <span>{activeExchange.answer.subject || activeExchange.subject}</span>
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
                  <span className="text-[#222222]">
                    Escalated to {activeExchange.escalatedTo}
                  </span>
                </>
              )}
            </div>
            <h2 className="mt-2.5 text-[20px] sm:text-[22px] font-semibold text-[#222222] leading-snug">
              <MathText text={activeExchange.question} />
            </h2>
          </header>

          {/* Concept Overview */}
          <section className="space-y-2">
            <h3 className="text-[12.5px] font-medium text-[#858585]">
              Concept overview
            </h3>
            <p className="text-[15.5px] text-[#222222] leading-[1.7]">
              <MathText text={activeExchange.answer.conceptSummary} />
            </p>
          </section>

          {/* Step-by-Step Breakdown */}
          <section className="space-y-5">
            <h3 className="text-[12.5px] font-medium text-[#858585]">
              Step-by-step explanation
            </h3>
            <ol className="space-y-5">
              {activeExchange.answer.steps.map((step, index) => (
                <li
                  key={index}
                  className="pb-5 border-b border-[#EAE8E5] last:border-b-0 last:pb-0"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[12.5px] text-[#858585] tabular-nums shrink-0">
                      0{index + 1}.
                    </span>
                    <div className="min-w-0 flex-1 space-y-2">
                      <h4 className="text-[15.5px] font-semibold text-[#222222]">
                        <MathText text={step.heading} />
                      </h4>
                      <p className="text-[15px] text-[#222222]/90 leading-[1.68]">
                        <MathText text={step.explanation} />
                      </p>
                      {step.math && <MathBlock latex={step.math} />}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Common Pitfall */}
          <section className="border border-[#EAE8E5] bg-[#FFFFFF] rounded-lg p-4 sm:p-5 space-y-1.5">
            <h3 className="text-[12.5px] font-medium text-[#858585]">
              Common pitfall to watch for
            </h3>
            <p className="text-[14.5px] text-[#222222] leading-relaxed">
              <MathText text={activeExchange.answer.commonPitfall} />
            </p>
          </section>

          {/* Action Bar: Copy, Save, Helpful, Escalate */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-4 border-b border-[#EAE8E5]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(activeExchange)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#EAE8E5] bg-[#FFFFFF] text-[13px] text-[#222222] hover:bg-[#F3E8E7]/50 transition-colors whitespace-nowrap shrink-0"
              >
                {copiedId === activeExchange.id ? (
                  <Check className="w-3.5 h-3.5 text-[#5B4BB7]" strokeWidth={1.75} />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#858585]" strokeWidth={1.75} />
                )}
                <span>{copiedId === activeExchange.id ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleSave(activeExchange.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] transition-colors whitespace-nowrap shrink-0 ${
                  savedExchangeIds.includes(activeExchange.id)
                    ? 'border-[#A99AE8] bg-[#F3E8E7]/60 text-[#222222] font-medium'
                    : 'border-[#EAE8E5] bg-[#FFFFFF] text-[#222222] hover:bg-[#F3E8E7]/50'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    savedExchangeIds.includes(activeExchange.id)
                      ? 'text-[#7D6CD6] fill-[#A99AE8]/40'
                      : 'text-[#858585]'
                  }`}
                  strokeWidth={1.75}
                />
                <span>
                  {savedExchangeIds.includes(activeExchange.id) ? 'Saved' : 'Save'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onVoteHelpful(activeExchange.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[13px] transition-colors whitespace-nowrap shrink-0 ${
                  activeExchange.helpfulVote === 'up'
                    ? 'border-[#A99AE8] bg-[#F3E8E7]/60 text-[#222222] font-medium'
                    : 'border-[#EAE8E5] bg-[#FFFFFF] text-[#222222] hover:bg-[#F3E8E7]/50'
                }`}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 ${
                    activeExchange.helpfulVote === 'up'
                      ? 'text-[#7D6CD6]'
                      : 'text-[#858585]'
                  }`}
                  strokeWidth={1.75}
                />
                <span>
                  {activeExchange.helpfulVote === 'up' ? 'Helpful' : 'Mark helpful'}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onEscalateToMentor(activeExchange)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#EAE8E5] bg-[#FAF9F7] text-[13px] text-[#222222] hover:border-[#A99AE8] transition-colors whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#858585]" strokeWidth={1.75} />
              <span>Ask a mentor about this</span>
            </button>
          </div>

          {/* Follow-up Prompts as Simple Text Suggestions */}
          {activeExchange.answer.followUpPrompts.length > 0 && (
            <section className="space-y-2">
              <p className="text-[12.5px] font-medium text-[#858585]">
                Suggested follow-ups
              </p>
              <ul className="divide-y divide-[#EAE8E5] border-y border-[#EAE8E5]">
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
                      className="w-full text-left py-2.5 text-[14px] text-[#222222] hover:text-[#5B4BB7] transition-colors flex items-center justify-between gap-4"
                    >
                      <span>
                        <MathText text={followUp} />
                      </span>
                      <ArrowRight
                        className="w-3.5 h-3.5 text-[#858585] shrink-0"
                        strokeWidth={1.75}
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
            className="bg-[#FFFFFF] border border-[#EAE8E5] rounded-lg p-3.5 focus-within:border-[#A99AE8] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 bg-transparent text-[14.5px] text-[#222222] placeholder:text-[#858585] focus:outline-none"
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
                  className="p-2 rounded-md border border-[#EAE8E5] text-[#858585] hover:text-[#222222] hover:bg-[#FAF9F7] transition-colors"
                >
                  <Paperclip className="w-4 h-4" strokeWidth={1.75} />
                </button>
                <button
                  type="submit"
                  disabled={!question.trim() && !attachment}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13px] font-medium bg-[#222222] text-[#FAF9F7] hover:bg-[#363636] disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Ask</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                </button>
              </div>
            </div>
            {attachment && (
              <div className="mt-2 pt-2 border-t border-[#EAE8E5] flex items-center justify-between text-[12.5px] text-[#858585]">
                <span className="truncate">Attached: {attachment.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="text-[#222222] hover:underline"
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
