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
    <div className="min-h-full bg-[#FBBFB5]">
      {/* Top Coral Peach Header Zone */}
      <div className="px-4 sm:px-8 pt-6 pb-7 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2.5 bg-[#FFFFFF] rounded-full px-4 h-12 shadow-[0_2px_10px_rgba(20,18,18,0.05)]">
            <Search className="w-4 h-4 text-[#6E5B59] shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, formulas, or course topics..."
              className="flex-1 min-w-0 bg-transparent text-[14.5px] text-[#141212] placeholder:text-[#6E5B59] focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by document type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'All' | ResourceDocType)}
            className="h-12 text-[13.5px] font-semibold text-[#141212] bg-[#FFFFFF] rounded-full px-4 focus:outline-none self-start sm:self-auto"
          >
            {DOC_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All types' : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Curved Pale Misty Rose Main Sheet */}
      <div className="bg-[#FCEBE8] rounded-t-[32px] min-h-[calc(100vh-110px)] px-4 sm:px-8 pt-7 pb-28 md:pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] text-[#141212] leading-tight">
              Resources
            </h1>
            <p className="mt-0.5 text-[13px] text-[#6E5B59]">
              Curated notes, cheat sheets, and problem sets
            </p>
          </div>

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

          {/* 2-Column Mobile / 3-Column Desktop Blush Tile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 py-12 px-6 text-center text-[13.5px] text-[#6E5B59] bg-[#FFF9F8] rounded-[24px]">
                No resources match your current filters.
              </div>
            ) : (
              filteredResources.map((res) => {
                const Icon = getDocIcon(res.docType);
                const isBookmarked = bookmarkedIds.includes(res.id);
                return (
                  <div
                    key={res.id}
                    className="bg-[#F6D5D0] hover:bg-[#F3C9C3] rounded-[24px] p-5 flex flex-col justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewResource(res)}
                        className="w-10 h-10 rounded-2xl bg-[#FFF9F8] flex items-center justify-center shrink-0"
                        aria-label={`Open ${res.title}`}
                      >
                        <Icon className="w-4 h-4 text-[#141212]" strokeWidth={2} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleBookmark(res.id)}
                        aria-label={isBookmarked ? `Remove bookmark for ${res.title}` : `Bookmark ${res.title}`}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                          isBookmarked
                            ? 'bg-[#141212] text-[#FFFFFF]'
                            : 'bg-[#FFF9F8]/80 text-[#141212] hover:bg-[#FFF9F8]'
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
                          strokeWidth={2}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreviewResource(res)}
                      className="text-left space-y-1.5"
                    >
                      <p className="text-[15px] font-bold text-[#141212] leading-snug">
                        {res.title}
                      </p>
                      <p className="text-[12.5px] text-[#6E5B59]">
                        {res.subject} · {res.docType}
                      </p>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Resource Preview Sheet (Screen 3 Style) */}
      {previewResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-preview-title"
          className="fixed inset-0 z-50 bg-[#141212]/35 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4"
        >
          <div className="w-full sm:max-w-xl bg-[#FCEBE8] rounded-t-[32px] sm:rounded-[28px] overflow-hidden">
            <div className="bg-[#FBBFB5] px-5 sm:px-6 pt-4 pb-5">
              <div className="w-10 h-1.5 bg-[#141212]/20 rounded-full mx-auto mb-3 sm:hidden" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-semibold text-[#141212]/70">
                    {previewResource.subject} · {previewResource.docType} · {previewResource.author}
                  </p>
                  <h2 id="resource-preview-title" className="mt-1 text-[20px] font-bold text-[#141212] leading-snug">
                    {previewResource.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  aria-label="Close resource preview"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FCEBE8] text-[#141212] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              <div className="bg-[#FFF9F8] rounded-[22px] p-4 space-y-1.5">
                <h3 className="text-[12px] font-semibold text-[#6E5B59]">Summary</h3>
                <p className="text-[14.5px] text-[#141212] leading-relaxed">
                  <MathText text={previewResource.summary} />
                </p>
              </div>

              {previewResource.keyEquations.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[12px] font-semibold text-[#6E5B59] px-1">Key formulas</h3>
                  <div className="space-y-2">
                    {previewResource.keyEquations.map((eq, i) => (
                      <MathBlock key={i} latex={eq} />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-1 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => onToggleBookmark(previewResource.id)}
                  className={`min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-semibold ${
                    bookmarkedIds.includes(previewResource.id)
                      ? 'bg-[#141212] text-[#FFFFFF]'
                      : 'bg-[#FFF9F8] text-[#141212]'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      bookmarkedIds.includes(previewResource.id) ? 'fill-current' : ''
                    }`}
                    strokeWidth={2}
                  />
                  <span>
                    {bookmarkedIds.includes(previewResource.id) ? 'Bookmarked' : 'Bookmark'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewResource(null)}
                  className="min-h-[42px] px-5 py-2 rounded-full bg-[#FBBFB5] text-[#141212] text-[13.5px] font-semibold hover:bg-[#F7ACA0]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
