import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Presentation,
  Search,
  X,
} from 'lucide-react';
import { ResourceDocType, ResourceItem } from '../types/doubtly';
import { SUBJECT_LIST } from '../data/academicData';
import { MathBlock, MathText } from './MathText';

interface ResourcesViewProps {
  resources: ResourceItem[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

const DOC_TYPES: Array<'All' | ResourceDocType> = [
  'All',
  'Notes',
  'PDF',
  'Cheat Sheet',
  'Slides',
  'Problem Set',
];

function getDocIcon(docType: ResourceDocType) {
  switch (docType) {
    case 'PDF':
      return FileText;
    case 'Notes':
      return BookOpen;
    case 'Slides':
      return Presentation;
    case 'Problem Set':
      return FileCode2;
    case 'Cheat Sheet':
      return FileSpreadsheet;
    default:
      return FileText;
  }
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | ResourceDocType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      if (subjectFilter !== 'All' && res.subject !== subjectFilter) return false;
      if (typeFilter !== 'All' && res.docType !== typeFilter) return false;
      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(needle) ||
          res.subject.toLowerCase().includes(needle) ||
          res.summary.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [resources, subjectFilter, typeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-[-0.025em] text-[#221D1E]">
          Resources
        </h1>
        <p className="mt-0.5 text-[13.5px] text-[#7B6F71]">
          Curated lecture notes, formula sheets, and problem sets for first-year courses.
        </p>
      </div>

      {/* Search & Filters */}
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
              placeholder="Search notes, formulas, or course topics..."
              className="w-full min-h-[42px] pl-10 pr-3.5 py-2 bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl text-[14px] text-[#221D1E] placeholder:text-[#7B6F71] focus:outline-none focus:border-[#C45B72]"
            />
          </div>

          <select
            aria-label="Filter by document type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'All' | ResourceDocType)}
            className="min-h-[42px] text-[13.5px] font-medium text-[#221D1E] bg-[#FFFFFF] border border-[#EFE2E2] rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#C45B72] self-start sm:self-auto"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All document types' : t}
              </option>
            ))}
          </select>
        </div>

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

      {/* iOS Inset Grouped Resource List */}
      <div className="border border-[#EFE2E2] rounded-2xl bg-[#FFFFFF] divide-y divide-[#EFE2E2] overflow-hidden shadow-[0_1px_3px_rgba(166,66,88,0.04)]">
        {filteredResources.length === 0 ? (
          <div className="py-12 px-6 text-center text-[13.5px] text-[#7B6F71]">
            No resources match your current filters.
          </div>
        ) : (
          filteredResources.map((res) => {
            const Icon = getDocIcon(res.docType);
            const isBookmarked = bookmarkedIds.includes(res.id);
            return (
              <div
                key={res.id}
                className="p-4 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 hover:bg-[#FCF6F6] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setPreviewResource(res)}
                  className="flex items-start gap-3.5 min-w-0 text-left flex-1 group"
                >
                  <div className="w-9 h-9 rounded-xl border border-[#F2CECA] bg-[#FFE4E1]/75 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#C45B72]" strokeWidth={1.85} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[14.5px] font-semibold text-[#221D1E] group-hover:text-[#A64258] transition-colors truncate">
                      {res.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#7B6F71] flex flex-wrap items-center gap-1.5">
                      <span>{res.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{res.docType}</span>
                      <span aria-hidden="true">·</span>
                      <span>{res.meta}</span>
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(res.id)}
                  aria-label={isBookmarked ? `Remove bookmark for ${res.title}` : `Bookmark ${res.title}`}
                  className={`min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl border transition-colors shrink-0 ${
                    isBookmarked
                      ? 'border-[#E7BFC4] bg-[#FFE4E1] text-[#C45B72]'
                      : 'border-[#EFE2E2] bg-[#FCF6F6] text-[#7B6F71] hover:text-[#221D1E]'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-[#C45B72]/25' : ''}`}
                    strokeWidth={1.85}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* iOS Bottom Sheet / Desktop Dialog Resource Preview */}
      {previewResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-preview-title"
          className="fixed inset-0 z-50 bg-[#221D1E]/35 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-xl bg-[#FCF6F6] border-t sm:border border-[#EFE2E2] rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="w-10 h-1.5 bg-[#DFC8C8] rounded-full mx-auto -mt-1 sm:hidden" />

            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#EFE2E2]">
              <div>
                <p className="text-[12px] font-medium text-[#A64258]">
                  {previewResource.subject} · {previewResource.docType} · {previewResource.author}
                </p>
                <h2 id="resource-preview-title" className="mt-1 text-[18px] font-semibold text-[#221D1E]">
                  {previewResource.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                aria-label="Close resource preview"
                className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-[#F4E3E3] text-[#7B6F71] hover:text-[#221D1E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-[12.5px] font-semibold text-[#7B6F71]">Summary</h3>
              <p className="text-[14.5px] text-[#221D1E] leading-relaxed">
                <MathText text={previewResource.summary} />
              </p>
            </div>

            {previewResource.keyEquations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[12.5px] font-semibold text-[#7B6F71]">Key formulas</h3>
                <div className="space-y-2">
                  {previewResource.keyEquations.map((eq, i) => (
                    <MathBlock key={i} latex={eq} />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 flex items-center justify-between border-t border-[#EFE2E2]">
              <button
                type="button"
                onClick={() => onToggleBookmark(previewResource.id)}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-[#EFE2E2] bg-[#FFFFFF] text-[13.5px] font-medium text-[#221D1E] hover:border-[#C45B72]"
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    bookmarkedIds.includes(previewResource.id)
                      ? 'text-[#C45B72] fill-[#C45B72]/25'
                      : 'text-[#7B6F71]'
                  }`}
                  strokeWidth={1.85}
                />
                <span>
                  {bookmarkedIds.includes(previewResource.id) ? 'Bookmarked' : 'Bookmark'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="min-h-[42px] px-5 py-1.5 rounded-xl bg-[#C45B72] text-[#FFFFFF] text-[13.5px] font-semibold hover:bg-[#A64258]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
