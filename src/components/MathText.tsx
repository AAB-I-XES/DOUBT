import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

type Segment =
  | { type: 'text'; value: string }
  | { type: 'inline-math'; value: string }
  | { type: 'block-math'; value: string }
  | { type: 'inline-code'; value: string };

function parseSegments(input: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|`[^`\n]+?`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      segments.push({ type: 'block-math', value: token.slice(2, -2).trim() });
    } else if (token.startsWith('$') && token.endsWith('$')) {
      segments.push({ type: 'inline-math', value: token.slice(1, -1).trim() });
    } else if (token.startsWith('`') && token.endsWith('`')) {
      segments.push({ type: 'inline-code', value: token.slice(1, -1) });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

export function renderKatexHtml(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: false,
    });
  } catch {
    return latex;
  }
}

export const MathBlock: React.FC<{ latex: string; className?: string }> = ({
  latex,
  className = '',
}) => {
  const html = React.useMemo(() => renderKatexHtml(latex, true), [latex]);
  return (
    <div
      className={`my-2 overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  const segments = React.useMemo(() => parseSegments(text), [text]);

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
        }
        if (seg.type === 'inline-code') {
          return (
            <code
              key={idx}
              className="mx-0.5 rounded-md bg-[#FFE4E1]/75 px-1.5 py-0.5 font-mono text-[0.86em] text-[#221D1E]"
            >
              {seg.value}
            </code>
          );
        }
        if (seg.type === 'inline-math') {
          const html = renderKatexHtml(seg.value, false);
          return (
            <span
              key={idx}
              className="inline-block align-baseline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
        const blockHtml = renderKatexHtml(seg.value, true);
        return (
          <span
            key={idx}
            className="block my-2"
            dangerouslySetInnerHTML={{ __html: blockHtml }}
          />
        );
      })}
    </span>
  );
};
