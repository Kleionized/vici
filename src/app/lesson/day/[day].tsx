import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { LessonPageView } from '@/components/lesson/LessonPages';
import { LessonShell, type LessonBottom } from '@/components/lesson/LessonShell';
import { EmptyState, toggleChoice } from '@/components/mono';
import { LESSONS, type LessonPage } from '@/content/lessons';
import { useCompleteLesson, useLessonDetail, useLessonProgressMap, useSaveReflection, useStartLesson } from '@/lib/backend';
import { lessonSlug } from '@/lib/curriculum';

/**
 * The lesson reader — all 84 lessons of `Vici Overhaul`, one page per Week
 * frame (`src/content/lessons.ts`, generated). Each lesson is cover · quote ·
 * three or four Parts · [question · answer] · quote · the day's task (two
 * pages ending in the Done-when card) · complete.
 *
 * `?page=<k>` opens on frame k (1-based) and `?page=task` on `Today’s task` —
 * Today's task row and the old `/task/<n>` link land there (D324), and the
 * verification sweep reaches any of the 1,273 frames directly.
 *
 * Writes (lessons.md §12.3, D311): `Begin` records the lesson as started; a
 * question's `Continue` saves the choice, and the reflect page's `Continue`
 * the note, as the lesson's reflection (merged — `reflections:save` replaces
 * the whole record); `Finish lesson` records completion once (re-stamping
 * `completedAt` would move Morning's "finished yesterday" and the score day).
 * The day's task itself is still completed where it always was — Today's
 * check and Morning's question — as the complete page says.
 */

/** The page `?page=` names: `task` → the first task page; a number is 1-based; anything else → the cover. */
function startIndex(pages: readonly LessonPage[], param: string | undefined) {
  if (param === 'task') return Math.max(0, pages.findIndex((p) => p.k === 'task'));
  const k = Number(param);
  return Number.isInteger(k) && k >= 1 ? Math.min(k, pages.length) - 1 : 0;
}

export default function LessonReader() {
  const router = useRouter();
  const { day, page: pageParam } = useLocalSearchParams<{ day?: string; page?: string }>();
  const n = Number(String(day ?? '').replace(/^day-/, '')) || 1;
  const lesson = LESSONS[n];
  const pages = lesson?.pages ?? [];
  const slug = lessonSlug(n);

  // The cursor carries the lesson (and deep link) it belongs to. Opening a
  // different lesson reuses this component rather than remounting it, so a
  // bare `useState(0)` would drop the reader on whatever page — and with
  // whatever answers — the last lesson left behind.
  const at = `${n}|${pageParam ?? ''}`;
  const fresh = { at, index: startIndex(pages, pageParam), chosen: [] as string[], note: '' };
  const [state, setState] = useState(fresh);
  const cur = state.at === at ? state : fresh;
  const set = (patch: Partial<typeof fresh>) => setState({ ...cur, ...patch });

  const progress = useLessonProgressMap();
  const detail = useLessonDetail(slug);
  const startLesson = useStartLesson();
  const completeLesson = useCompleteLesson();
  const saveReflection = useSaveReflection();

  const close = () => (router.canGoBack() ? router.back() : router.replace('/(app)/today'));

  if (!lesson || !pages.length) {
    // an unknown lesson: the ground, the way out and the kit's not-found state,
    // worded as the medallion route words its own (it used to render nothing at all)
    return (
      <LessonShell n={n} index={0} count={0} bottom={null} tapAnywhere={false} onClose={close}>
        <EmptyState title="Lesson not found" body="The course has 84 lessons." h1 />
      </LessonShell>
    );
  }

  const index = Math.min(cur.index, pages.length - 1);
  const page = pages[index];
  const next = () => (index >= pages.length - 1 ? close() : set({ index: index + 1 }));

  // `reflections:save` replaces the record, so every save carries what is already there
  const save = (answers: Record<string, string | number>) => {
    const prev = detail && detail.reflection ? detail.reflection.answers : {};
    saveReflection(slug, { ...prev, ...answers }).catch(() => {});
  };

  let bottom: LessonBottom;
  switch (page.k) {
    case 'cover':
      bottom = {
        kind: 'pill',
        label: 'Begin',
        onPress: () => {
          startLesson(slug).catch(() => {});
          next();
        },
      };
      break;
    case 'question':
      bottom = {
        kind: 'pill',
        label: 'Continue',
        // the frame draws Continue live with nothing chosen, so it never waits for one
        onPress: () => {
          if (cur.chosen.length) save({ q: cur.chosen.join(',') });
          next();
        },
      };
      break;
    case 'answer':
      bottom = { kind: 'pill', label: 'Continue', onPress: next };
      break;
    case 'reflect':
      bottom = {
        kind: 'pill',
        label: 'Continue',
        onPress: () => {
          const note = cur.note.trim();
          if (note) save({ ...(cur.chosen.length ? { q: cur.chosen.join(',') } : {}), note });
          next();
        },
      };
      break;
    case 'taskEnd':
      bottom = {
        kind: 'pill',
        label: 'Finish lesson',
        onPress: () => {
          if (progress?.[slug]?.status !== 'completed') completeLesson(slug).catch(() => {});
          next();
        },
      };
      break;
    case 'complete':
      bottom = { kind: 'pill', label: 'Done', onPress: close };
      break;
    default:
      bottom = { kind: 'ring', onPress: next };
  }

  const choose = (letter: string) => {
    if (page.k !== 'question') return;
    set({ chosen: page.multi ? toggleChoice(cur.chosen, letter, { exclusive: page.exclusive ?? [] }) : [letter] });
  };

  return (
    <LessonShell
      n={n}
      index={index}
      count={pages.length}
      bottom={bottom}
      // the question's rows and the note field own their touches; every other page turns on a tap anywhere
      tapAnywhere={page.k !== 'question' && page.k !== 'reflect'}
      onClose={close}>
      <LessonPageView lesson={lesson} page={page} chosen={cur.chosen} onChoose={choose} note={cur.note} onNote={(note) => set({ note })} />
    </LessonShell>
  );
}
