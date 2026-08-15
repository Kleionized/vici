/**
 * GENERATED FILE — do not edit by hand.
 *
 * The closing note each `Task DNN Options` board draws under its last option
 * row. On most days it repeats the Intro board's rule; on 23 it says something
 * else entirely, which is why it has to travel separately from `task.done`.
 *
 * `marginTop` is the gap the canvas leaves under the last option row, and
 * `lineHeight` varies by day (18, 18.5, 19) — both are stated, not derived.
 *
 * Rebuild: node scripts/uifinal/gen-task-close.mjs
 */

export interface TaskClosingNote {
  text: string;
  /** Gap under the last option row, in pt. */
  marginTop: number;
  lineHeight: number;
  color: string;
}

export const TASK_CLOSING_NOTE: Record<number, TaskClosingNote> = {
  8: { text: "Pick one improvement you wrote down and repeat that behaviour today. If nothing has improved yet, pick one behaviour you want to change and do it once today.", marginTop: 61, lineHeight: 19, color: "#767370" },
  11: { text: "An area can be unchanged or worse. Pick the one that still causes the most trouble and decide what you will change for the next seven days. Start that change today.", marginTop: 66, lineHeight: 19, color: "#767370" },
  14: { text: "Pin the note somewhere easy to find. The task is done when you know what you will do in all three situations without waiting to feel motivated.", marginTop: 50, lineHeight: 18, color: "#767370" },
  25: { text: "Pick whichever causes more trouble for you and practise what you would do today. If you are neither angry nor lonely today, practise while calm so the action is familiar next time.", marginTop: 66, lineHeight: 19, color: "#767370" },
  26: { text: "At the end, write the number of tally marks. Do not aim for zero; the count only shows how often you wanted to switch.", marginTop: 56, lineHeight: 19, color: "#767370" },
  40: { text: "Practise that action once now.", marginTop: 40, lineHeight: 19, color: "#767370" },
  42: { text: "Save the list somewhere easy to find, such as a pinned note or a card near the bed.", marginTop: 40, lineHeight: 19, color: "#767370" },
  43: { text: "What you will start with tomorrow morning.", marginTop: 66, lineHeight: 19, color: "#767370" },
  45: { text: "Save the three time blocks in a pinned note.", marginTop: 40, lineHeight: 19, color: "#767370" },
  46: { text: "Cross out optional catch-up work, extra training, and non-urgent errands for today.", marginTop: 40, lineHeight: 19, color: "#767370" },
  47: { text: "Send them a short message asking whether it is okay to call or message if you have a rough few days. Use your own words.", marginTop: 40, lineHeight: 19, color: "#767370" },
  54: { text: "If you need to stay reachable, use Do Not Disturb and allow calls from family, favourites, or emergency contacts.", marginTop: 40, lineHeight: 19, color: "#767370" },
  57: { text: "Keep the message to one or two sentences and send it.", marginTop: 40, lineHeight: 19, color: "#767370" },
  69: { text: "Make it smaller if needed. At bedtime, it should be obvious whether you did it or not.", marginTop: 40, lineHeight: 19, color: "#767370" },
  72: { text: "Spend 15 minutes on the action that is still possible, or finish it immediately if it is a message, booking, or payment.", marginTop: 66, lineHeight: 19, color: "#767370" },
  75: { text: "Start the first 20 minutes now.", marginTop: 40, lineHeight: 19, color: "#767370" },
  77: { text: "Put all four dates in the calendar and make any first message or booking needed for the first one.", marginTop: 66, lineHeight: 19, color: "#767370" },
  78: { text: "Add a calendar event 90 days from today to decide whether you want to keep the rule.", marginTop: 40, lineHeight: 19, color: "#767370" },
  81: { text: "If something else worked better for you, use that. Choose things you can do today.", marginTop: 40, lineHeight: 19, color: "#767370" },
};
