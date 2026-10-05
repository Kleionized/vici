/**
 * The wait and the empty list, app-wide. Both are the mono kit's now
 * (`src/components/mono/Feedback.tsx`): no frame draws either, and the paper
 * system's spinner-on-nothing and `tide` illustration have no place on the
 * #0D0D0D ground. Every existing caller keeps its import and its props and gets
 * the new look — the ground and noise with a late, small `#9B968E` spinner, and
 * centred type with no art.
 */
export { EmptyState, LoadingView } from '@/components/mono/Feedback';
