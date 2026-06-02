import { Fragment, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@/lib/theme';
import { AppText } from './AppText';

/**
 * Deliberately tiny markdown renderer — handles the subset our lessons use:
 * `#`/`##`/`###` headings, `-`/`*` bullets, `1.` ordered items, blank-line
 * paragraphs, and inline `**bold**` / `*italic*`. Kept in-house rather than
 * pulling a markdown library that may not yet support RN 0.85 / React 19.
 */

type Block =
  | { kind: 'h1' | 'h2' | 'h3' | 'p'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] };

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { kind: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: 'p', text: paragraph.join(' ').trim() });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    const ordered = /^\d+\.\s+(.*)$/.exec(line);

    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      blocks.push({ kind: level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3', text: heading[2] });
    } else if (bullet) {
      flushParagraph();
      if (!list || list.kind !== 'ul') {
        flushList();
        list = { kind: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
    } else if (ordered) {
      flushParagraph();
      if (!list || list.kind !== 'ol') {
        flushList();
        list = { kind: 'ol', items: [] };
      }
      list.items.push(ordered[1]);
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  return blocks;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) out.push(<Fragment key={key++}>{text.slice(lastIndex, match.index)}</Fragment>);
    const token = match[0];
    if (token.startsWith('**')) {
      out.push(
        <Text key={key++} style={{ fontWeight: '700' }}>
          {token.slice(2, -2)}
        </Text>,
      );
    } else {
      out.push(
        <Text key={key++} style={{ fontStyle: 'italic' }}>
          {token.slice(1, -1)}
        </Text>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) out.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  return out;
}

export function MarkdownView({ content }: { content: string }) {
  const blocks = parse(content);
  return (
    <View style={{ gap: spacing.md }}>
      {blocks.map((block, i) => {
        if (block.kind === 'ul' || block.kind === 'ol') {
          return (
            <View key={i} style={{ gap: spacing.xs }}>
              {block.items.map((item, j) => (
                <View key={j} style={{ flexDirection: 'row', gap: spacing.sm }}>
                  <AppText variant="muted" style={{ width: 22, textAlign: 'right' }}>
                    {block.kind === 'ol' ? `${j + 1}.` : '•'}
                  </AppText>
                  <AppText variant="muted" style={{ flex: 1 }}>
                    {renderInline(item)}
                  </AppText>
                </View>
              ))}
            </View>
          );
        }
        // block is now a text block (h1/h2/h3/p)
        if (block.kind === 'h1') {
          return (
            <AppText key={i} variant="title" style={{ marginTop: i === 0 ? 0 : spacing.sm }}>
              {renderInline(block.text)}
            </AppText>
          );
        }
        if (block.kind === 'h2') {
          return (
            <AppText key={i} variant="subtitle" style={{ marginTop: spacing.sm }}>
              {renderInline(block.text)}
            </AppText>
          );
        }
        if (block.kind === 'h3') {
          return (
            <AppText key={i} variant="body" weightOverride="700" style={{ marginTop: spacing.xs }}>
              {renderInline(block.text)}
            </AppText>
          );
        }
        if (block.kind === 'p') {
          return (
            <AppText key={i} variant="muted">
              {renderInline(block.text)}
            </AppText>
          );
        }
        return null;
      })}
    </View>
  );
}
