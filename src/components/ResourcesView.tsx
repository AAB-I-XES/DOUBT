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
    <div className="space-y-7">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE8E5]">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#222222]">
          Resources
        </h1>
        <p className="mt-0.5 text-[13.5px] text-[#858585]">
          Curated lecture notes, formula sheets, and problem sets for first-year courses.
        </p>
      </div>

      {/* Search & Filters */}
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
              placeholder="Search notes, formulas, or course topics..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FFFFFF] border border-[#EAE8E5] rounded-md text-[13.5px] text-[#222222] placeholder:text-[#858585] focus:outline-none focus:border-[#A99AE8]"
            />
          </div>

          <select
            aria-label="Filter by document type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'All' | ResourceDocType)}
            className="text-[13px] text-[#222222] bg-[#FFFFFF] border border-[#EAE8E5] rounded-md px-3 py-1.5 focus:outline-none focus:border-[#A99AE8] self-start sm:self-auto"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All document types' : t}
              </option>
            ))}
          </select>
        </div>

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

      {/* Compact List-Based Library */}
      <div className="border border-[#EAE8E5] rounded-lg bg-[#FFFFFF] divide-y divide-[#EAE8E5]">
        {filteredResources.length === 0 ? (
          <div className="py-12 px-6 text-center text-[13.5px] text-[#858585]">
            No resources match your current filters.
          </div>
        ) : (
          filteredResources.map((res) => {
            const Icon = getDocIcon(res.docType);
            const isBookmarked = bookmarkedIds.includes(res.id);
            return (
              <div
                key={res.id}
                className="p-4 sm:px-5 sm:py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF9F7]/70 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setPreviewResource(res)}
                  className="flex items-start gap-3.5 min-w-0 text-left flex-1 group"
                >
                  <div className="w-8 h-8 rounded-md border border-[#EAE8E5] bg-[#FAF9F7] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#858585] group-hover:text-[#222222]" strokeWidth={1.75} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-[#222222] group-hover:text-[#5B4BB7] transition-colors truncate">
                      {res.title}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[#858585] flex flex-wrap items-center gap-1.5">
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
                  className={`p-2 rounded-md border transition-colors shrink-0 ${
                    isBookmarked
                      ? 'border-[#A99AE8] bg-[#F3E8E7]/60 text-[#5B4BB7]'
                      : 'border-[#EAE8E5] bg-[#FFFFFF] text-[#858585] hover:text-[#222222]'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-[#A99AE8]/40' : ''}`}
                    strokeWidth={1.75}
                  />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Resource Preview Modal */}
      {previewResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-preview-title"
          className="fixed inset-0 z-50 bg-[#222222]/25 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-xl bg-[#FAF9F7] border border-[#EAE8E5] rounded-lg p-5 sm:p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#EAE8E5]">
              <div>
                <p className="text-[12px] text-[#858585]">
                  {previewResource.subject} · {previewResource.docType} · {previewResource.author}
                </p>
                <h2 id="resource-preview-title" className="mt-1 text-[18px] font-semibold text-[#222222]">
                  {previewResource.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                aria-label="Close resource preview"
                className="text-[#858585] hover:text-[#222222] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-[12.5px] font-medium text-[#858585]">Summary</h3>
              <p className="text-[14.5px] text-[#222222] leading-relaxed">
                <MathText text={previewResource.summary} />
              </p>
            </div>

            {previewResource.keyEquations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-[12.5px] font-medium text-[#858585]">Key formulas</h3>
                <div className="space-y-2">
                  {previewResource.keyEquations.map((eq, i) => (
                    <MathBlock key={i} latex={eq} />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-[#EAE8E5]">
              <button
                type="button"
                onClick={() => onToggleBookmark(previewResource.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#EAE8E5] bg-[#FFFFFF] text-[13px] text-[#222222] hover:border-[#A99AE8]"
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    bookmarkedIds.includes(previewResource.id)
                      ? 'text-[#7D6CD6] fill-[#A99AE8]/40'
                      : 'text-[#858585]'
                  }`}
                  strokeWidth={1.75}
                />
                <span>
                  {bookmarkedIds.includes(previewResource.id) ? 'Bookmarked' : 'Bookmark'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="px-4 py-1.5 rounded-md bg-[#222222] text-[#FAF9F7] text-[13px] font-medium hover:bg-[#363636]"
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
