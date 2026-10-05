import { Children, useRef, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Screen, type SegmentItem } from '@/components/mono';

import { RegisterHead } from './parts';

/**
 * The canvas y the panes start at: under the segmented switch (164 + 44). Each
 * pane scrolls on its own below it, so a long week never runs under the head.
 */
export const PANE_TOP = 208;

/**
 * The overview's and the weekly report's frame: a head that stands still
 * (chevron, range pill, title, switch) over a horizontal pager of panes. The
 * switch and the pager move together both ways — tap a segment and the pager
 * scrolls; swipe and the segment follows (D065: RN-web emits no
 * momentum-end, so the page is read off `onScroll`).
 *
 * Children are the panes, in the switch's order; lay each out in pane
 * coordinates (canvas y − `PANE_TOP`), e.g. with `PaneBody`.
 */
export function PagedRegister<K extends string>({
  title,
  pill,
  onBack,
  items,
  page,
  onPage,
  children,
}: {
  title: string;
  pill?: string;
  onBack: () => void;
  items: readonly SegmentItem<K>[];
  page: number;
  onPage: (index: number) => void;
  children: ReactNode;
}) {
  const { width } = useWindowDimensions();
  const pager = useRef<ScrollView>(null);
  const keys = items.map((it) => (typeof it === 'string' ? it : it.key));
  return (
    <Screen>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width));
          if (next !== page) onPage(next);
        }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
        {Children.toArray(children).map((pane, i) => (
          <View key={i} style={{ width, height: '100%' }}>
            <ScrollView
              style={{ position: 'absolute', left: 0, right: 0, top: PANE_TOP, bottom: 0 }}
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}>
              {pane}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
      <View style={S.head}>
        <RegisterHead
          title={title}
          pill={pill}
          onBack={onBack}
          items={items}
          value={keys[page] ?? keys[0]}
          onChange={(_, index) => {
            onPage(index);
            pager.current?.scrollTo({ x: index * width, animated: true });
          }}
        />
      </View>
    </Screen>
  );
}

// `box-none` must be a registered style on web: written inline it is CSS, where
// it is not a value, and the full-screen head would swallow every swipe.
const S = StyleSheet.create({ head: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, pointerEvents: 'box-none' } });

/**
 * A pane's content box: `height` in pane coordinates; its children place
 * themselves at `top = canvas y − PANE_TOP`. With `flowTop` the children flow
 * from that y instead and `height` is the least the pane takes — for a page
 * whose words can run to a second line and push what is under them down.
 */
export function PaneBody({ height, flowTop, children }: { height: number; flowTop?: number; children?: ReactNode }) {
  return <View style={flowTop != null ? { minHeight: height, paddingTop: flowTop } : { height }}>{children}</View>;
}
