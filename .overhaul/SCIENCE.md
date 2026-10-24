# VICI: the science draft

A plan for making VICI read as an ACT-based, evidence-led recovery app, and for an onboarding you do things in rather than only read.

**Built on 24 Oct (D64):** boards A to F, the flame as days in a row on VICI (the owner's call, in place of a weekly count), the 30-day clean count on Your log, Settings › The science and the make-up step after a slip. Not built: the restore countdown ("3 more clean days"), "Based on" lines on lessons, and measuring the return after a slip. The cost boards were kept, and the universities are named rather than shown as logos. Every claim below comes from `Streak counters vs cognitive recovery: the evidence` (22 Oct 2026); anything that needs a source that document does not give is marked **needs a source**.

## The position

One line, from the evidence document:

> A recovery app that keeps your progress when you slip and teaches the skills linked to getting back on track.

What sets VICI apart from Quittr-style apps is not that it tracks less. Tracking helps (Harkin 2016, d = 0.40 across 138 experiments). The difference is what happens after a slip. A counter that drops to Day 0 hides the record at the moment it would help most, and VICI keeps it.

The case rests on three findings, all of which the app can show rather than just state:

1. **A broken streak stops people, most of all when they broke it themselves.** Continuation fell from 53% (streak intact) to 29% (self-caused break), and a repair option brought it back to 85% (Silverman & Barasch 2023). A relapse is always self-caused.
2. **Confidence is what breaks after a slip, not guilt.** Each drop in confidence after a lapse sped the next one (HR 1.09); guilt and self-blame did not (Kirchner 2012). Longer past abstinence made confidence more protective, so the record is worth keeping.
3. **Accepting urges beats pushing them away.** The largest app trial: an ACT app that taught acceptance of triggers beat one that taught avoidance at 12 months, 28.2% against 21.1% abstinent (Bricker 2020, 2,415 people). Suppressed thoughts come back (Wang 2020).

### How to say "ACT"

Say "built on acceptance and commitment therapy (ACT) and relapse prevention, methods tested in clinical trials." Avoid calling VICI itself "an ACT therapy" or "therapy". An app that says it treats a condition can fall under medical-device rules (FDA in the US, MHRA in the UK) and Apple's health-app review. That is a question for a lawyer before launch, not something this plan settles.

### Claims

Safe, with sources (from the evidence document):

- "Your progress doesn't reset to zero when you slip." (A design fact.)
- "Built on approaches studied in clinical trials: ACT, relapse prevention, mindfulness and CBT." (Krotter 2024; Bowen 2014; Magill 2019.)
- "People keep going after a setback when they can repair their progress." (Silverman & Barasch 2023; Duncan & Sharif 2026. These were not addiction studies.)
- "Losing confidence after a slip is linked to the next slip. VICI is designed to protect that confidence." (Shiffman 2000; Kirchner 2012.)
- "Teaches urge surfing: riding out an urge without acting on it." (Bowen & Marlatt 2009.)

Never:

- "Proven", "clinically proven", or any success rate. VICI has no outcome data.
- "Streak apps cause relapse", "Quittr makes people worse", or "better than other apps / NoFap / 12-step". No study tests this, and 12-step programmes have good abstinence evidence (Kelly 2020).
- "Rewires your brain", "resets dopamine", "neuroscience-backed". These are the unsourced claims the slop apps make.
- "Self-compassion / mindfulness prevents relapse."
- Any suicide figure from Prause & Binnie 2023.

The honesty is itself the selling point. Quittr's listing claims a 62% success rate with no method. VICI can say, in the app: "We don't have outcome data yet, so we won't give you a success rate."

## University logos: a different approach

Using university logos would imply those universities endorse VICI. They don't, and their logos are trademarks, so it risks takedowns, App Store rejection (guideline 5.2, intellectual property) and the very credibility this is meant to build. Journal logos raise the same problem.

What carries the same weight without the risk is **citations shown as cards**: journal, year, sample size, one-line finding, and a link to the paper. For example:

> **JAMA Internal Medicine · 2020**
> 2,415 smokers, 12 months
> An app teaching acceptance of urges beat one teaching avoidance.

The names *JAMA*, *Management Science* or *Cochrane* in plain text read as scientific without claiming a partnership. Logos only become an option with written permission or a real tie, such as a named academic adviser.

## First, fix what contradicts the pitch

The app currently shows two streak counters. Both would undercut "no streak to lose" the moment a reviewer opens the app:

| Where | Now | Change to |
|---|---|---|
| Today, header pill (`today.tsx:317`) | Flame and "N days in a row"; resets on a slip | Clean days this week, out of 7, which keeps the rest of the week after a slip. A weekly window is the "slack" Sharif & Shu 2019 found kept people going (next-day success 0.55 against 0.37). |
| Your log › Check-ins (`log.tsx:251`) | "7 Clean days in a row" | "Clean days, last 30" as the big number, with the week strip marking the slip as one day among the others. |

Also for the owner to decide:

- **The owner's letter R03 "After a streak ends" and the relapse note about a streak resetting** use the word "streak". They are the owner's copy (D60), so they stay unless you change them. If VICI has no streaks, they could speak of "a run of clean days" instead.
- **The cost boards (29 to 32: the next 30 days, one year, the squares to age 80, "If nothing changes")** use fear. The evidence warns against addiction framing in onboarding: feeling addicted predicts distress a year later, while actual use does not (Grubbs 2015; Grubbs 2018). These four boards are the natural place for the science boards below, which keeps the onboarding at its current length rather than making it longer.

## Onboarding: the science thread

Five new boards, placed where the cost boards are now (after 28, the starting rating), plus one change to the vow. Each one gets the user doing something, not just reading.

### A. What's really going on (replaces nothing; a question after 23)

An ACT and ICD-11 question that streak apps never ask:

> **What bothers you most about it?**
> Losing control of it · It clashes with what I believe · Both

Why: ICD-11 (6C72) treats distress from loss of control differently from distress that comes only from moral disapproval, and moral conflict explains much of the feeling of being "addicted" (r = .67, Grubbs 2019). The answer steers the Week 2 morality lesson and the letters' tone. Tap chips, existing kit.

### B. What a slip does to a counter (interactive)

A phone-in-phone demo. The top shows a streak app's counter: "Day 23". The user taps **Slip**. The counter shakes and drops to "Day 0". Below it, VICI's view of the same slip: 23 clean days stay, one day is marked, and the rating dips a little.

Under it, one line and a bar chart that draws in:

> When people broke a streak themselves, 29 in 100 kept going. With the streak intact, 53 did.
> Silverman & Barasch, 2023 · habit studies, not addiction studies

Motion: the D58 count-up and draw-in. Haptic: a heavy thud when the counter hits zero, a light tap for VICI's mark.

### C. Urge surfing, felt (interactive)

"Hold to ride it out." The user holds a finger on a wave. It rises for about 8 seconds, crests and falls. A haptic tick follows the wave: faster and stronger as it rises, slower as it falls. Letting go early stops the wave in place with: "Urges pass whether or not you act on them."

Copy follows the evidence's own warning: urge surfing changed what people *did*, not how strong the urge felt (Bowen & Marlatt 2009). So the board promises that urges pass, never that they shrink.

### D. Your values (interactive, ACT core)

This builds on 34 "What you want back". A card sort: twelve value cards (Close relationships, Focus, Health, Faith, Honesty, Self-respect…), and the user drags or taps three into "Matters most". Their three come back in the vow, the morning notes' goal line and the relapse letters ("You said honesty matters most").

ACT links behaviour to chosen values, and the best porn-specific trial used ACT (Crosby & Twohig 2016; viewing fell 93% against 21% on the waitlist, 28 men). **Value card list needs the owner's words.**

### E. The research behind it

Four citation cards in the style above, swiped through horizontally:

1. Bricker 2020, *JAMA Internal Medicine*: acceptance beat avoidance.
2. Silverman & Barasch 2023: repair brings people back.
3. Kirchner 2012: confidence, not guilt.
4. Bowen 2014, *JAMA Psychiatry*: mindfulness-based relapse prevention limited heavy use after a lapse.

The last card is **What we don't claim**: "VICI has no outcome data yet. We won't give you a success rate. Every source is in Settings › The science." Tapping a card opens its paper.

### F. Hold to make the vow (interactive, replaces "Sign" on 40)

The vow board keeps its text. "Sign" becomes **Hold to commit**. The user presses and holds, and a ring fills around the button over 3 seconds with their name writing itself along the signature line. Haptics speed up as it fills (selection ticks, then a success burst at 100%). Letting go early drains the ring with a soft tap, and the user tries again. On completion the laurel closes and the date stamps in.

Optional, if you want more: they trace their own signature with a finger instead of the typed name (an SVG path, saved with the Vow journal entry).

Build notes: a Reanimated progress value run by `withTiming` on press-in and reversed on press-out, a ticker that calls `haptic.tick()` at a shrinking interval, and `haptic.success()` at the end. Reduced-motion keeps the hold but drops the ring animation. VoiceOver gets a double-tap fallback, since holding is not accessible to everyone.

## In the app

- **Repair after a slip.** The relapse flow ends with one make-up action that visibly lifts the rating: ride out the next urge, or do the relapse-review lesson. The framing is "make up for it", which beat "second chance" (75.1% against 54.6% tried again; Duncan & Sharif 2026).
- **A restore rule.** After a slip, the abstinence part of the rating returns to where it was after a short run of clean days, as contingency management protocols do (after 2, 4 or 5 clean samples: Streck 2018, Rash 2023, Romanowich & Lamb 2015). The rating already doesn't reset; this makes the way back visible: "3 more clean days and you're back to 64."
- **Where this comes from.** Each lesson gets a small "Based on" line at the foot (author, year) that opens a sheet with the finding and its limits. Many lessons already describe their studies in the text.
- **Settings › The science.** A page listing every source, the claims VICI makes, and the ones it won't.
- **Measure the return.** Record how long people take to come back after a slip, so design changes can be tested against it (Kiluk 2026 notes trials rarely report this). It needs a line in the privacy page.

## Store and website copy (drafts, owner to edit)

- Headline: **Your progress doesn't reset when you slip.**
- Sub: Built on ACT and relapse prevention, the methods tested in clinical trials. No streak to lose.
- Body: Most quit apps count days and send you back to zero after one bad night. Research on broken streaks suggests that is when people give up. VICI keeps your record, marks the slip, and shows you how to get back.
- Proof line: Every claim in the app comes with its source. We don't publish a success rate, because we don't have one yet.

Don't name Quittr in the store listing. Comparing by name invites review problems and legal ones; "most quit apps" makes the point.

## Order of work

1. Change the two streak counters (small, removes the contradiction).
2. Hold to commit on the vow, with haptics (small, self-contained).
3. Boards B and C, the two interactive demos (medium).
4. Board D, values, once the owner gives the value words (medium, touches the vow, notes and letters).
5. Boards A and E, plus Settings › The science (small to medium).
6. Repair action and restore rule after a slip (medium, touches the rating).
7. Store copy (owner).

## Decisions for the owner

1. Replace the cost boards (29 to 32) with the science boards, or keep them and add the new ones?
2. Change the Today flame and "Clean days in a row" to weekly and 30-day counts?
3. Citations as text cards, with no university logos unless there is permission?
4. Typed name or a traced signature on the hold-to-commit vow?
5. The twelve value words for board D.
