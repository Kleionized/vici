/**
 * GENERATED FILE — do not edit by hand.
 *
 * Source: src/content/interactive/*.md
 * Rebuild: node scripts/build-interactive.mjs
 *
 * 10 parts · 110 lessons.
 */

import type { InteractiveWeek } from '@/lib/types';

export const INTERACTIVE_WEEKS: InteractiveWeek[] = [
  {
    "n": 1,
    "title": "Part 0 · The Model",
    "ground": "Ground I · The Landing",
    "description": "The whole course comes down to one idea, which is that you slip when watching seems to pay more than it costs. This part explains that idea, helps you find a reason that still makes sense at one in the morning, and lets you choose how you want to think about the problem.",
    "subs": [
      {
        "code": "0.A",
        "title": "The equation",
        "description": "What happens when you slip, and why the sum has to be done before the urge arrives.",
        "lessons": [
          {
            "number": 1,
            "heading": "The slip equation",
            "title": "The slip equation",
            "tag": "reframe — the model",
            "tagColor": "#4B3F72",
            "sub": "0.A",
            "week": 1,
            "day": 1,
            "order": 0,
            "slug": "the-slip-equation-1",
            "pages": [
              {
                "kind": "teach",
                "headline": "Think about the last time you slipped. Stop the scene just before it happened.",
                "body": "You were somewhere specific, at a certain hour, carrying whatever the day had left you with. Then the decision took about a second. No wonder it’s hard to remember making it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "In that second, your mind made a quick comparison.",
                "body": "Watching seemed to offer more relief than it would cost. This course helps you change that balance before the urge arrives.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Watching can pay off in three ways.",
                "body": "Three things get paid out when you watch.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "It can bring relief",
                    "It can give you the hit itself",
                    "It can end the strain of saying no"
                  ],
                  "note": "That last one is easy to miss, and it’s often the biggest."
                }
              },
              {
                "kind": "teach",
                "headline": "The cost side is everything the slip takes from you.",
                "body": "The evening. The night. Tomorrow morning. Over time, much more. Those costs are real, but most of them weren’t in the room when you made the choice.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The sum wasn’t wrong. It was missing information.",
                "body": "A bad day makes relief look more valuable. A distant cost feels smaller. Both changes push the sum the same way.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Arguing with the sum in the moment is usually too late.",
                "body": "Change the numbers earlier. Every lesson in this app does one of two things: it shrinks the payoff or brings the cost close enough to feel.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When you have slipped, what won?",
                "checks": [
                  {
                    "key": "relief",
                    "label": "I wanted to feel better",
                    "asIn": "The day had been heavy and this was the quickest way I knew to change that",
                    "short": "wanting to feel better"
                  },
                  {
                    "key": "hit",
                    "label": "I just wanted it",
                    "asIn": "Nothing deeper was going on. I wanted it and that was the end of it",
                    "short": "plain wanting"
                  },
                  {
                    "key": "endresist",
                    "label": "I was tired of saying no",
                    "asIn": "I had been holding out all day and I didn’t want to keep holding out",
                    "short": "being tired of saying no"
                  },
                  {
                    "key": "blurred",
                    "label": "I couldn’t tell you",
                    "asIn": "It was over before I had really thought about any of it",
                    "short": "not really knowing"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "costside",
                "headline": "And the cost side. How much did it weigh at that moment?",
                "helper": "Pick whatever is true. There’s no wrong answer here.",
                "options": [
                  "It hardly weighed anything",
                  "Tomorrow did not feel real to me",
                  "I never thought about what I was spending",
                  "I knew the cost and did it anyway"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "relief",
                    "headline": "If you were mostly after relief, start with Part I.",
                    "body": "A bad day can make relief look worth almost any price. That isn’t weakness. It’s what a bad day does to the arithmetic. Part I is about making your days steadier so the same offer stops looking like such a bargain."
                  },
                  {
                    "key": "hit",
                    "headline": "If it was plain wanting, then the payoff itself is your largest number and that is where the work goes.",
                    "body": "The lessons on boredom and stimulation in Part I are the ones that bring it down. When ordinary life has some colour in it again, the hit is worth less at the moment it makes its offer, because it’s no longer the most interesting thing available to you."
                  },
                  {
                    "key": "endresist",
                    "headline": "If you were mostly tired of saying no, then read Lesson 27 before anything else in the course.",
                    "body": "It works on the wanting itself, not on your ability to resist it, which matters because resisting has a time limit and not wanting doesn’t. If the wanting fades, there’s nothing left to hold out against and nothing you need relief from either."
                  },
                  {
                    "key": "blurred",
                    "headline": "If you can’t say what won, then your first job is to watch it happen once.",
                    "body": "At your next urge, whether you give in or not, name whichever of the three was loudest. It takes a few seconds and it’s not an exam. Once you can see which part of the payoff is doing the work, everything else in this app has something specific to aim at instead of working in the dark."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "It hardly weighed anything"
                    ],
                    "body": "The cost side goes quiet for everybody when they’re aroused. Lesson 2 explains what happens without treating it as a personal failing. Parts II and IV are built around that fact."
                  },
                  {
                    "options": [
                      "Tomorrow did not feel real to me"
                    ],
                    "body": "Anything far away stops feeling real when you’re under pressure, which is the subject of Lesson 4. Part IV exists to drag the cost close enough that you can feel it while you’re still deciding, because a cost you can’t feel counts for nothing."
                  },
                  {
                    "options": [
                      "I never thought about what I was spending"
                    ],
                    "body": "Part V is about building things that are worth protecting. The more you have going on that matters to you, the more the cost side weighs on its own, without you having to remember anything or try harder in the moment."
                  },
                  {
                    "options": [
                      "I knew the cost and did it anyway"
                    ],
                    "body": "At the peak of an urge, knowing something loses to feeling something every time, so knowing more isn’t the answer. Part III trains you to ride the peak out instead, and riding it out requires no arithmetic at all."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "front",
                "headline": "Which side would you rather work on first?",
                "helper": "Any order works, so pick whichever sounds more like your problem.",
                "options": [
                  "Shrink the payoff (Part I)",
                  "Fewer moments of choice (Part II)",
                  "Make the cost felt (Part IV)",
                  "Build something worth keeping (Part V)"
                ],
                "result": "I'll start with {pick}"
              },
              {
                "kind": "collect",
                "title": "What you have worked out",
                "template": "\"I slip when watching looks like it’s worth more than it costs. What usually wins for me is {checks}. I’m going to start with {pick}.\"",
                "fallback": "\"At my next urge I’m going to watch the sum happen, and note which part of the payoff was loudest.\"",
                "source": "checks",
                "label": "What usually won:",
                "cta": "Save this"
              }
            ],
            "sources": "The payoff/cost model is a teaching frame that organises findings already in the evidence base: coping motives inflating the relief term (Bresin & Mekawi, 2021, parallel), present bias shrinking the felt cost (behavioural economics, Lessons 4 and 7 of the source set), and the coping-function finding (Part B1(b)). No new empirical claim is made.",
            "action": "At your next urge, win or lose, name which payoff term was loudest: the relief, the hit, or the end of resisting. One word in the log.",
            "reflection": "Write the equation in your own words, as it runs on your worst night: what the payoff usually is, and what the cost side is doing while it loses. Naming your usual winner is the aiming step for everything ahead."
          },
          {
            "number": 2,
            "heading": "The horny brain doesn't do maths",
            "title": "Two different people",
            "tag": "evidence — arousal and judgement",
            "tagColor": "#375623",
            "sub": "0.A",
            "week": 1,
            "day": 2,
            "order": 1,
            "slug": "two-different-people-2",
            "pages": [
              {
                "kind": "teach",
                "headline": "You already know this feeling.",
                "body": "You do not reason the same way at two in the afternoon and one in the morning.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Arousal changes what feels important.",
                "body": "Shame and disgust go quiet. Tomorrow stops feeling real. Rules you wrote yourself can look like somebody else’s handwriting. You don’t choose that shift. It happens.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Researchers have seen the shift in the lab.",
                "body": "In one study, aroused men agreed to things they had rejected minutes earlier (Ariely & Loewenstein, 2006). The study was small, all male, and used hypothetical choices. The exact size of the swing is uncertain, but the direction was clear.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The striking part was that the men didn’t see it coming.",
                "body": "While calm, they tried to predict how they would answer when aroused. They got it wrong. When you are calm, you often underestimate how differently you will think during a late-night urge.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So don’t build a plan that depends on good judgement at the peak.",
                "body": "Set things up beforehand, while you can still think straight. The phone in another room beats a rule you have to remember.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "That’s why so much familiar advice falls flat.",
                "body": "\"Remember why you started\" and \"just be disciplined\" depend on good judgement during the urge. Set things up earlier so you have fewer decisions to make at one.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "In the middle of an urge, what have you noticed?",
                "checks": [
                  {
                    "key": "absurd",
                    "label": "The rules stop making sense",
                    "asIn": "Whatever I decided when I was calm suddenly seems ridiculous",
                    "short": "the rules going soft"
                  },
                  {
                    "key": "tomorrow",
                    "label": "Tomorrow stops existing",
                    "asIn": "The consequences don’t feel real while it’s happening",
                    "short": "tomorrow disappearing"
                  },
                  {
                    "key": "after",
                    "label": "The disgust only comes afterwards",
                    "asIn": "I never feel it during, only once it’s over",
                    "short": "the regret arriving late"
                  },
                  {
                    "key": "reasons",
                    "label": "I can’t remember my reasons",
                    "asIn": "I know I had good ones, but I can’t get to them",
                    "short": "losing my reasons"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "survives",
                "headline": "What has held up at the peak, in your experience?",
                "helper": "Pick anything that has worked, even once.",
                "options": [
                  "A phone that was not in the room",
                  "A rule with no decision left in it",
                  "A habit I had practised",
                  "A clear picture of how I would feel after",
                  "Nothing yet, it all goes"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "absurd",
                    "headline": "The rules aren’t wrong. They’re unreadable in that state, which is a different problem and it has a different solution.",
                    "body": "So build them into the room and the routine, where nothing has to be read or agreed with in the moment. A phone charging in the kitchen works whether you feel calm or overwhelmed because there is no decision to make."
                  },
                  {
                    "key": "tomorrow",
                    "headline": "If tomorrow disappears at the peak, then it has to be loaded up in advance while it’s still real to you.",
                    "body": "That’s what the written-out morning after in Lesson 62 and the letter from a year ahead in Lesson 64 are for. You write them while you can still feel the cost, and then you read them back at the moment you can’t, which is a way of lending yourself a feeling you don’t currently have."
                  },
                  {
                    "key": "after",
                    "headline": "Notice when the disgust turns up, because the timing is the whole story. It arrives afterwards and never during.",
                    "body": "That means it’s not preventing anything. What it does instead is make you feel worse, and feeling worse is the state that sets up the next episode. Lesson 63 is about retiring it and finding something that works while the urge is still happening."
                  },
                  {
                    "key": "reasons",
                    "headline": "If you can’t reach your reasons in the moment, then stop relying on being able to remember them.",
                    "body": "Write them down and leave them somewhere you’ll physically see them, and build them into arrangements that happen without your involvement. What is written on the fridge doesn’t have to be recalled, and what is already unplugged doesn’t have to be resisted."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A phone that was not in the room",
                      "A rule with no decision left in it"
                    ],
                    "body": "Those two are strong tools because they work whether you feel calm or overwhelmed. Everything else in this course is trying to get closer to that standard."
                  },
                  {
                    "options": [
                      "A habit I had practised",
                      "A clear picture of how I would feel after"
                    ],
                    "body": "Habits and rehearsed pictures hold up because you built them in calm moments, over and over, until they became things that happen rather than things you choose. Parts III and IV are where that building gets done."
                  },
                  {
                    "options": [
                      "Nothing yet, it all goes"
                    ],
                    "body": "That’s a common answer and it points you straight at Part II, which is the one set of tools that asks nothing of you at the peak. Start there, not with the skills, because the skills need practice and the arrangements work immediately."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "upstream",
                "headline": "What will you set up today?",
                "helper": "Do it now, while you are calm.",
                "options": [
                  "Move the phone out of the bedroom",
                  "Write down one if-then rule",
                  "Picture the morning after, once",
                  "Give a password to someone else"
                ],
                "result": "Today: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your arrangement",
                "template": "\"My judgement changes during a late-night urge, so I will set this up while I am calm. Today: {pick}.\"",
                "fallback": "\"Today I’ll set up one thing that requires no decision during a late-night urge.\"",
                "source": "checks",
                "label": "What I have noticed at the peak:",
                "cta": "Save this"
              }
            ],
            "sources": "Arousal shifting judgement and people failing to predict the shift: Ariely & Loewenstein (2006), verified and in STUDY_BANK.md (small male student sample, hypothetical choices; used for the plan-upstream principle only). The pattern of users defeating their own defences at peak urge is from the evidence base, Part B1(d). This lesson is the design rationale for Parts II and IV.",
            "action": "Make one arrangement today that requires nothing from mid-urge you: the phone staged out of reach, one written if-then, or a blocker key handed to someone else.",
            "reflection": "Recall your last strong urge honestly: which of your rules or reasons were reachable in that state? Whatever wasn't, write the upstream version of it now."
          }
        ]
      },
      {
        "code": "0.B",
        "title": "Your reason",
        "description": "A reason that survives a bad night, and a target close enough to reach.",
        "lessons": [
          {
            "number": 3,
            "heading": "Your reason doesn't have to be moral",
            "title": "A reason of your own",
            "tag": "evidence — moral-incongruence research",
            "tagColor": "#375623",
            "sub": "0.B",
            "week": 1,
            "day": 3,
            "order": 2,
            "slug": "a-reason-of-your-own-3",
            "pages": [
              {
                "kind": "teach",
                "headline": "Most men start with a borrowed reason. Here’s why those reasons fail.",
                "body": "The usual ones sound like this.",
                "cta": "Next",
                "list": {
                  "ordered": false,
                  "items": [
                    "You should stop",
                    "Porn is bad",
                    "Good people don’t do this"
                  ],
                  "note": "Every one is a \"should\" handed to you by somebody else."
                }
              },
              {
                "kind": "teach",
                "headline": "A borrowed reason works perfectly well at noon and deserts you at one in the morning, which is when it was needed.",
                "body": "That’s not because you lack conviction. It’s because a rule you didn’t choose has no weight of its own, so it can only work while somebody is watching, and at one in the morning nobody is.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Shame can make the pattern worse.",
                "body": "The behaviour creates shame. Shame hurts. If you use the same behaviour to escape that pain, the cycle starts again.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Researchers have a name for the gap that drives this, which is moral incongruence (Grubbs et al., 2019).",
                "body": "What they found is that how much someone disapproves of porn predicts how addicted they feel, and how much distress they’re in, largely independently of how much they use. The disapproval does its own damage on top of the behaviour.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "None of this means your values are wrong or that you should stop having them.",
                "body": "It means they’re the wrong tool for this particular job, in the same way a hammer isn’t wrong for being a poor screwdriver. Values can tell you where you want to go. They can’t get you through a Tuesday night on their own.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So the reason you keep has to be one you feel, written in your own words.",
                "body": "Something ordinary works better than something noble, because you can still feel an ordinary want when you’re tired and it costs you nothing to admit to. Wanting your mornings back holds up at one in the morning in a way that wanting to be a better man doesn’t.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "After a slip, what does the voice in your head say?",
                "checks": [
                  {
                    "key": "disgust",
                    "label": "\"I'm disgusting\"",
                    "asIn": "The judgement lands on me as a person, not on what I did",
                    "short": "calling myself disgusting"
                  },
                  {
                    "key": "zero",
                    "label": "\"Back to zero\"",
                    "asIn": "All the good days before it suddenly stop counting for anything",
                    "short": "writing off the good days"
                  },
                  {
                    "key": "bother",
                    "label": "\"Why bother now\"",
                    "asIn": "The night is already ruined, so a bit more won’t matter",
                    "short": "giving up on the night"
                  },
                  {
                    "key": "rule",
                    "label": "\"Good people don't do this\"",
                    "asIn": "It’s a rule I picked up somewhere instead of one I chose",
                    "short": "a borrowed rule"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "want",
                "headline": "What do you want back?",
                "helper": "Ordinary answers are the best ones. Pick whatever aches a bit.",
                "options": [
                  "My mornings",
                  "A clear head",
                  "My time",
                  "Real closeness",
                  "Self-respect",
                  "My attention",
                  "Better sleep",
                  "Feeling something real"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "disgust",
                    "headline": "That voice is what keeps the loop turning, and it’s worth tracing the circuit once so you can see it.",
                    "body": "It hurts you, and the quickest relief you know is the very thing it’s condemning. So it doesn’t merely fail to help. It reliably produces the state in which the next episode becomes likely, which makes it an odd sort of guard."
                  },
                  {
                    "key": "zero",
                    "headline": "\"Back to zero\" is the counter talking rather than a description of anything that happened.",
                    "body": "Nothing you built before the slip went anywhere. The room is still set up, the practice is still in you, the learning is still learned. The only thing that reset was a number, and Lesson 93 explains why that number was working against you all along."
                  },
                  {
                    "key": "bother",
                    "headline": "\"Why bother now\" is the sentence that turns one slip into a whole evening, and it costs more than the slip does.",
                    "body": "It feels as though the verdict is already in and therefore the rest of the night is free. But it was never free. Every round after the first still costs exactly what it costs, and the morning bills you for all of them."
                  },
                  {
                    "key": "rule",
                    "headline": "A rule you got from somebody else doesn’t hold in the moment, however much you agree with it in principle.",
                    "body": "It’s good at judging you at noon and useless at one in the morning, because it was never really yours to begin with. A reason of your own, even a small ordinary one, stays with you because nobody else can take it back or argue you out of it."
                  },
                  {
                    "key": "none",
                    "headline": "If none of those voices sounds like yours, then the job is simpler than it is for most people.",
                    "body": "All you have to do is take the reason you pick today and make it concrete enough that it aches slightly when you read it. Vague reasons are the ones that evaporate, and the ache is how you know it’s specific enough to survive a bad night."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "My mornings",
                      "Better sleep"
                    ],
                    "body": "Let your reason be exactly that ordinary. You want your mornings back, and a want like that survives a bad night because nobody handed it to you and there’s no argument to be had about it."
                  },
                  {
                    "options": [
                      "Real closeness",
                      "Feeling something real"
                    ],
                    "body": "Point your reason there, then. Wanting something real with a real person will outlast any amount of judging yourself, because it pulls you towards something instead of pushing you away from something, and pulling turns out to be the more durable of the two."
                  },
                  {
                    "options": [
                      "My time",
                      "My attention",
                      "A clear head"
                    ],
                    "body": "Let the reason be plain arithmetic. It’s your time and your attention and you want them back. A slip can’t argue with that, because the hours were spent either way and the spending is a matter of fact, not a verdict on your character."
                  },
                  {
                    "options": [
                      "Self-respect"
                    ],
                    "body": "Build it on the plain version of self-respect, which is a life you’d be glad to be living. There’s no verdict attached to that and no way for one bad night to disprove it, which is what makes it usable."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "reason",
                "headline": "Which one aches the most?",
                "helper": "The ache is what gives a reason its grip.",
                "options": [
                  "My mornings",
                  "A clear head",
                  "My time",
                  "Real closeness",
                  "Self-respect",
                  "My attention",
                  "Better sleep",
                  "Feeling something real"
                ],
                "result": "Mine is: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your reason",
                "template": "\"I want this because I want {pick} back.\"",
                "fallback": "\"I want this because of what it costs me. I have written it in my own words and there’s no should anywhere in it.\"",
                "source": "checks",
                "label": "The voice to retire:",
                "cta": "Save this"
              }
            ],
            "sources": "Moral incongruence as a driver of distress and self-perceived \"addiction\": Grubbs et al. (2019), in the evidence base. Cross-addiction parallel: shame-proneness tracks worse addiction outcomes while self-forgiveness tracks recovery (general finding), stated qualitatively.",
            "action": "Write one honest, non-moral reason in the form \"I want this because ___.\" Save it. The app will show it back to you on hard nights.",
            "reflection": "Finish this in your own words, concretely enough to feel on a bad night: *\"I want this because ______.\"* Keep it short enough to read in ten seconds. We'll bring it back when the pull is strongest."
          },
          {
            "number": 4,
            "heading": "Use a shorter goal",
            "title": "Use a shorter goal",
            "tag": "evidence — short repeated targets",
            "tagColor": "#375623",
            "sub": "0.B",
            "week": 1,
            "day": 4,
            "order": 3,
            "slug": "use-a-shorter-goal-4",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"Never again\" is too far away to guide what you do tonight.",
                "body": "The long-term benefit feels far away. The urge offers relief right now, so it often wins when you are tired or stressed.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "When you are stressed, distant rewards matter less.",
                "body": "Behavioural economists call this present bias: immediate rewards feel more important than later ones. It happens to everyone, especially under stress.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Short, specific goals are easier to follow.",
                "body": "Plans in the form \"when this happens, I’ll do that\" raised follow-through across 94 separate studies (Gollwitzer & Sheeran, 2006). And in a classic experiment, children given close targets mastered maths problems that distant goals never got them through (Bandura & Schunk, 1981).",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Those studies tested general goals, not porn use.",
                "body": "They suggest that shorter goals improve follow-through. If a lifetime goal failed, the goal may have been too distant. It does not mean you lacked willpower.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Pick a time frame that feels manageable. One week is a good place to start.",
                "body": "A week is long enough to matter and short enough to picture. If that still feels too long, focus on tonight.",
                "cta": "Next",
                "quote": {
                  "text": "A journey of a thousand miles begins with a single step.",
                  "who": "Lao Tzu"
                }
              },
              {
                "kind": "teach",
                "headline": "A shorter goal is not a lower standard.",
                "body": "You are choosing a goal you can act on now. Finishing twelve weekly goals gets you further than making one lifetime promise and breaking it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How do your fresh starts usually go?",
                "checks": [
                  {
                    "key": "weekend",
                    "label": "They burn out by the weekend",
                    "asIn": "Day one is easy, Thursday wobbles, and by Sunday it’s over",
                    "short": "burning out by the weekend"
                  },
                  {
                    "key": "speech",
                    "label": "They start with a big speech",
                    "asIn": "I announce a whole new regime to myself, starting Monday",
                    "short": "starting with a speech"
                  },
                  {
                    "key": "slip",
                    "label": "They die at the first slip",
                    "asIn": "One bad night and the whole attempt is off",
                    "short": "ending at the first slip"
                  },
                  {
                    "key": "monday",
                    "label": "I restart every Monday",
                    "asIn": "There’s a clean slate every week and none of them stick",
                    "short": "restarting every Monday"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "friday",
                "headline": "What could a good Friday contain?",
                "helper": "Small and concrete. Pick what you’d honestly take.",
                "options": [
                  "Slept properly all week",
                  "Hid nothing",
                  "Phone out of the bedroom",
                  "One real conversation",
                  "Trained twice",
                  "Rode out one urge",
                  "Evenings with some shape"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "weekend",
                    "headline": "Big promises often create a strong start but no clear plan for later in the week.",
                    "body": "Choose one small result you can reach by Friday. Then you still know what to do on Thursday."
                  },
                  {
                    "key": "speech",
                    "headline": "A dramatic speech can feel motivating, but it is hard to follow on a difficult evening.",
                    "body": "The speech gives you a quick feeling of change. A small target gives you something clear to do on Thursday."
                  },
                  {
                    "key": "slip",
                    "headline": "An all-or-nothing goal can make one slip feel like total failure.",
                    "body": "A weekly goal can continue after a bad night. Learn from the slip and finish the rest of the week. Nothing in this app resets to zero."
                  },
                  {
                    "key": "monday",
                    "headline": "Restarting shows that you have not given up.",
                    "body": "What may be missing is a clear end point. Give each Monday a specific result to reach by Friday."
                  },
                  {
                    "key": "none",
                    "headline": "Even if your plans usually last, use a short time frame. It costs nothing to try.",
                    "body": "A finished week is proof in your own handwriting. And that kind of proof accumulates a great deal faster than promises do. After two months you have eight of them, and eight pieces of evidence is a different thing from eight weeks of good intentions."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Slept properly all week",
                      "Evenings with some shape"
                    ],
                    "body": "That is enough for this week: sleep properly and give your evenings a simple plan. Finishing it will make next week easier to trust."
                  },
                  {
                    "options": [
                      "Hid nothing",
                      "One real conversation"
                    ],
                    "body": "One honest conversation is a meaningful weekly goal. It is small enough to do and important enough to matter."
                  },
                  {
                    "options": [
                      "Phone out of the bedroom",
                      "Rode out one urge"
                    ],
                    "body": "The room set up and one wave ridden out. Both are specific things you can finish and check by Friday."
                  },
                  {
                    "options": [
                      "Trained twice"
                    ],
                    "body": "That is enough for this week. Two training sessions can improve your mood and make restless evenings easier."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "horizon",
                "headline": "What time frame feels manageable?",
                "helper": "A week is enough. Tonight also counts.",
                "options": [
                  "Tonight",
                  "Tomorrow",
                  "To Friday",
                  "A full week"
                ],
                "result": "My time frame: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your week",
                "template": "\"By {pick}, I’d be glad if I had managed {grid}. That is my only goal for now.\"",
                "fallback": "\"My time frame is {pick}. I’ll choose one small action I can finish by then.\"",
                "source": "grid",
                "label": "A good Friday would include:",
                "cta": "Save this"
              }
            ],
            "sources": "Present bias implies distant goals pull weakly in the moment. Cross-domain evidence: implementation intentions show a medium-to-large effect on goal attainment in meta-analysis (Gollwitzer & Sheeran, 2006; d ≈ 0.65, 94 studies); proximal-goal research supports breaking long goals into near ones. \"One day at a time\" is the same principle in practice. Added for the interactive set (verified, STUDY_BANK.md): proximal subgoals beat distal goals (Bandura & Schunk, 1981).",
            "action": "Set one target you can picture by the end of this week. Concrete, small, yours. Not a lifetime promise.",
            "reflection": "Write one sentence you could reach by Friday: *\"By the end of this week, I'd be glad if ______.\"* Small enough that you won't quit it by Thursday."
          }
        ]
      },
      {
        "code": "0.C",
        "title": "Your frames",
        "description": "What to call this, and where your own finish line is.",
        "lessons": [
          {
            "number": 5,
            "heading": "Competing frames — pick yours",
            "title": "Pick your frame",
            "tag": "contested — deliberately plural",
            "tagColor": "#7F6000",
            "sub": "0.C",
            "week": 1,
            "day": 5,
            "order": 4,
            "slug": "pick-your-frame-5",
            "pages": [
              {
                "kind": "teach",
                "headline": "Nobody has settled what this problem is, and you should know that before anybody sells you a solution to it.",
                "body": "A systematic review put it plainly: researchers still can’t say where heavy use tips over into something pathological (de Alarcón et al., 2019). The field is unsettled instead of merely cautious.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So this course isn’t going to hand you a certainty that nobody owns.",
                "body": "What it does instead is lay the four main ways of seeing it side by side and let you try them on, which is closer to how the honest clinicians work anyway. You’re choosing a working model instead of receiving a diagnosis.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The way you describe the problem affects what you try next.",
                "body": "If you call it an addiction, you may use blockers, abstinence, and accountability. If you call it a habit, you may change cues and routines. If it conflicts with your values, honesty matters. If it fills an empty life, you need more meaningful alternatives.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Which explains something that has probably happened to you already.",
                "body": "A method that transformed somebody online did nothing at all for you. Very often that isn’t a failure of effort but a mismatch of frame, because his tools were aimed at his problem and yours are a different shape.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "One warning about frames in general, which applies whichever you pick.",
                "body": "A frame is a working assumption, not a fact about you, and its job is to be useful. If it stops producing results, change it, and do that without treating the change as an admission of anything. Wearing glasses you chose is the point. Wearing glasses somebody handed you is how people spend years pointed at the wrong problem.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "From the inside, which of these does it feel most like?",
                "checks": [
                  {
                    "key": "addiction",
                    "label": "Something with a life of its own",
                    "asIn": "It feels as though it decides and I watch myself go along with it",
                    "short": "a compulsion"
                  },
                  {
                    "key": "habit",
                    "label": "A groove I fall into",
                    "asIn": "Cue, autopilot, done, before I have noticed choosing anything",
                    "short": "a habit"
                  },
                  {
                    "key": "values",
                    "label": "A war with what I believe",
                    "asIn": "The gap between what I do and who I mean to be is the painful part",
                    "short": "a conflict with my values"
                  },
                  {
                    "key": "vacuum",
                    "label": "Something that fills an empty space",
                    "asIn": "It expands to fill whatever empty time the day has left over",
                    "short": "filling an emptiness"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "tried",
                "headline": "What have you already tried?",
                "helper": "Everything counts, including the things that failed.",
                "options": [
                  "Blockers",
                  "Cold turkey",
                  "An accountability partner",
                  "Deleting apps",
                  "New habits",
                  "Therapy",
                  "Prayer or faith",
                  "Nothing structured"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "addiction",
                    "headline": "If it feels like a compulsion, then take that toolbox seriously and use it properly rather than half-heartedly.",
                    "body": "That means abstinence, accountability and removing your access, all of which have decent support behind them. There’s one risk that travels with this frame, though, which is that it can become an identity. Keep hold of the distinction: this is something you do, not something you are."
                  },
                  {
                    "key": "habit",
                    "headline": "If it feels like a habit, then you have drawn the frame that is easiest to work with, which is good news.",
                    "body": "Cues, friction and replacement are all straightforward, all cheap, and all reasonably well evidenced. The only real risk is underrating the problem, because a habit that has been running for years has usually grown teeth, and treating it casually is how people end up surprised."
                  },
                  {
                    "key": "values",
                    "headline": "If it feels like a conflict with your values, then the real work is honesty, not technique.",
                    "body": "That means saying plainly what you believe and where you stand, without using any of it as a stick to beat yourself with. The reason work in Lesson 3 has already started this, and the shame research in the same lesson explains why the stick makes everything worse."
                  },
                  {
                    "key": "vacuum",
                    "headline": "If it feels like filling an emptiness, then the real work is building, not removing.",
                    "body": "You need something worth wanting sitting in the empty stretch of the evening, because otherwise the emptiness will keep being filled by whatever happens to be nearest. Part V was written for exactly this, and for you it’s the main event, not the supporting material."
                  },
                  {
                    "key": "none",
                    "headline": "If none of them grabbed you, then wear the habit frame for the time being.",
                    "body": "It’s the cheapest to test and the quickest to show results, which makes it a sensible default when you’re undecided. You can swap it later once you know more about how the thing behaves in your own life, and swapping costs you nothing."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Blockers",
                      "Deleting apps",
                      "Cold turkey"
                    ],
                    "body": "Notice that all three of those belong to the addiction frame. If the frame that felt true from the inside was a different one, then that mismatch may be exactly why they kept sliding off. And it would be worth trying tools aimed at your own answer instead."
                  },
                  {
                    "options": [
                      "An accountability partner",
                      "Therapy"
                    ],
                    "body": "Those two work whichever frame you pick, so keep them either way. What the frame changes isn’t whether you use them but what you point them at when you get there."
                  },
                  {
                    "options": [
                      "New habits",
                      "Prayer or faith"
                    ],
                    "body": "Those already belong to a frame, either habit or meaning. If they half-worked then the fit was probably half right, so adjust the frame instead of abandoning the effort, since the effort wasn’t the part that failed."
                  },
                  {
                    "options": [
                      "Nothing structured"
                    ],
                    "body": "You’re in the best position of anybody here, because you get to choose your first toolbox instead of inheriting one from whoever happened to shout loudest online."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "frame",
                "headline": "Which frame will you work with for now?",
                "helper": "You can change it later. The point is to choose rather than to inherit.",
                "options": [
                  "Addiction",
                  "Habit",
                  "A conflict with my values",
                  "An emptiness to fill"
                ],
                "result": "For now: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your frame",
                "template": "\"For now I’m calling it {pick}, and I’ll run its tools properly before I judge them.\"",
                "fallback": "\"For now I’m trying the habit frame, since it’s the cheapest to test, and I’ll switch if the fit turns out wrong.\"",
                "source": "checks",
                "label": "From the inside it feels like:",
                "cta": "Save this"
              }
            ],
            "sources": "That \"porn addiction\" is not a settled construct, that the recognised construct (CSBD, ICD-11) is impulse-control rather than substance-style (Kraus et al., 2018), that self-perceived addiction often tracks distress and moral incongruence (Grubbs et al., 2019), and that imaging evidence is contested: all from the evidence base, Part A. Added: the unsettled-field conclusion is also the finding of a systematic review (de Alarcón et al., 2019).",
            "action": "Read all four frames. Pick the one that grips you most right now and write one line on why.",
            "reflection": "Which of the four frames (addiction, habit, values conflict, meaning vacuum) describes how this feels from the inside for you? Name it, and one reason."
          },
          {
            "number": 6,
            "heading": "The \"addiction\" word — use it or drop it",
            "title": "The word \"addiction\"",
            "tag": "contested",
            "tagColor": "#7F6000",
            "sub": "0.C",
            "week": 1,
            "day": 6,
            "order": 5,
            "slug": "the-word-addiction-6",
            "pages": [
              {
                "kind": "teach",
                "headline": "The word \"addiction\" does opposite jobs for different people. That’s why arguing about it in general is a waste of time.",
                "body": "For one man it finally makes the mess serious and gives him something he can climb out of. For the next it hardens into a broken identity that he then carries into every room he enters.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Same word, opposite effect, and the difference isn’t really about accuracy.",
                "body": "It’s about what the word does to you when you say it. That means the useful question isn’t whether it’s technically correct but whether it moves you towards the tools or towards the bed with the curtains shut.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "You do not have to use the word \"addiction.\"",
                "body": "It is not a formal diagnosis. The ICD-11 recognises compulsive sexual behaviour disorder and classifies it as an impulse-control condition, not a substance addiction (Reid & Kafka, 2014).",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So nobody can tell you that you’re required to use the word, and nobody can tell you that you’re forbidden from it either.",
                "body": "It’s yours to pick up or put down. And you don’t owe an explanation to a forum or to anybody else. Judge it by what it does to your behaviour over the following month.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Test whether the label helps you.",
                "body": "Say both sentences out loud. Notice which one helps you act and which one makes you hide. Keep the label if it moves you toward support. Drop it if it adds shame.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When you say \"I'm an addict\", what happens?",
                "checks": [
                  {
                    "key": "punctures",
                    "label": "It cuts through my denial",
                    "asIn": "The heavy word is what finally made me take this seriously",
                    "short": "cutting through denial"
                  },
                  {
                    "key": "licence",
                    "label": "It gives me permission to slip",
                    "asIn": "I couldn’t help it, because that is what addicts do",
                    "short": "giving myself permission"
                  },
                  {
                    "key": "hide",
                    "label": "It makes me want to hide",
                    "asIn": "The label feels like a verdict on who I am",
                    "short": "wanting to hide"
                  },
                  {
                    "key": "moves",
                    "label": "It gets me looking for help",
                    "asIn": "Once it had a name, I started looking for tools",
                    "short": "getting me moving"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "shortlist",
                "headline": "Which words are on your shortlist?",
                "helper": "Try each one in your mouth and keep whichever rings true.",
                "options": [
                  "Addiction",
                  "Habit",
                  "Compulsion",
                  "\"The thing I'm changing\"",
                  "My pattern",
                  "The old routine"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "punctures",
                    "headline": "The heavy word is earning its keep and you should carry on using it without apology.",
                    "body": "It broke through a denial that the lighter words were letting sleep, which is a real service and not everybody gets it. Keep it for as long as it goes on working, and drop it without ceremony on the day it stops."
                  },
                  {
                    "key": "licence",
                    "headline": "The word has turned into a licence, and a licence is the one thing you can’t afford here.",
                    "body": "Once \"I’m an addict\" becomes an explanation for the next slip, not a reason to act, it has changed sides. Trade it for a word that keeps the choice in your hands, because \"habit\" and \"the thing I’m changing\" both imply that you had a say."
                  },
                  {
                    "key": "hide",
                    "headline": "The word is feeding the exact loop it was supposed to help you name, which is worth catching early.",
                    "body": "A verdict you want to hide from is shame with a diagnosis attached, and Lesson 3 showed you where shame ends up going. A lighter word can carry every bit of the seriousness without the weight, and seriousness is the part you need."
                  },
                  {
                    "key": "moves",
                    "headline": "The word is doing the only useful job it has, which is getting you moving.",
                    "body": "Judge it by that and by nothing else, and ignore anybody who tells you the word is either compulsory or forbidden. If it keeps you reaching for tools then it’s the right word for you, whatever the diagnostic manuals happen to say this decade."
                  },
                  {
                    "key": "none",
                    "headline": "If the word leaves you feeling nothing much, then pick on results, not on feel.",
                    "body": "Try each one for a fortnight and watch what your behaviour does. Whichever word keeps you serious about the problem without making you ashamed of yourself is the one to keep, and there’s no prize for choosing the impressive one."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Addiction",
                      "Compulsion"
                    ],
                    "body": "A heavy shortlist suits somebody who is finished with minimising, and there’s nothing wrong with that at all. Just keep an eye on the identity trap, because this is something you do, not something you are, and the distinction stops mattering the moment you let it."
                  },
                  {
                    "options": [
                      "Habit",
                      "The old routine"
                    ],
                    "body": "A lighter shortlist can still carry full seriousness, which is the part people miss. It also keeps the behaviour a thing you do, and a thing you do is a thing you can change, whereas a thing you’re tends to feel permanent."
                  },
                  {
                    "options": [
                      "\"The thing I'm changing\"",
                      "My pattern"
                    ],
                    "body": "Naming it plainly, with no borrowed clinical weight at all, works perfectly well and has one advantage over the alternatives. It keeps the shame off your back while you get on with the job. And it doesn’t invite anybody to argue with you about definitions."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "word",
                "headline": "Which word will you use for now?",
                "helper": "You can revise it whenever you like.",
                "options": [
                  "Addiction",
                  "Habit",
                  "Compulsion",
                  "The thing I'm changing"
                ],
                "result": "My word: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your word",
                "template": "\"For now the word is {pick}, and the day it stops helping me I’ll change it.\"",
                "fallback": "\"I’m leaving it unnamed for now. Whichever word gets me moving is the one I’ll keep.\"",
                "source": "checks",
                "label": "What the old word did:",
                "cta": "Save this"
              }
            ],
            "sources": "\"Porn addiction\" is not a recognised diagnosis; the DSM-5 rejected hypersexual disorder (Reid & Kafka, 2014); the recognised construct (CSBD, ICD-11) is compulsive; self-perceived addiction often tracks distress and moral incongruence: evidence base, Parts A1 and A6. The twelve-step identity model versus harm-reduction's avoidance of the label is the relevant debate; the evidence crowns neither.",
            "action": "Decide, for now, which word you'll use for yourself: addiction, habit, compulsion, or just \"this.\" Write it down.",
            "reflection": "Say both out loud: \"I'm a porn addict\" and \"I'm someone changing my relationship with porn.\" Notice which one makes you want to fight and which makes you want to hide. Keep the one that helps."
          },
          {
            "number": 7,
            "heading": "Define your own finish line",
            "title": "Your finish line",
            "tag": "contested — abstinence vs moderation",
            "tagColor": "#7F6000",
            "sub": "0.C",
            "week": 1,
            "day": 7,
            "order": 6,
            "slug": "your-finish-line-7",
            "pages": [
              {
                "kind": "teach",
                "headline": "Your finish line might be borrowed too, and a borrowed finish line causes more trouble than a borrowed reason does.",
                "body": "Never again is exactly right for some men and completely wrong for others. The trouble is that almost nobody chooses it. They absorb it from whichever corner of the internet they landed in first.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Here is what goes wrong when you run towards a line you don’t believe in.",
                "body": "The effort feels hollow, the motivation keeps mysteriously draining away, and then the missing fire gets blamed on you. It was the line that was wrong, not your character, but from the inside those two feel identical.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "There is no single goal that fits everyone.",
                "body": "Focus on the distress, your sense of control, and the effect on your life. Frequency alone says less than many people assume. Two people can use just as often and be affected very differently.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Alcohol research fought this same argument for several decades and eventually settled on an unglamorous answer.",
                "body": "Different people need different lines, and the honest predictor of which is a person's own history, not a principle. Some patterns require abstinence and others don’t, and pretending otherwise helped nobody in either camp.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So the useful move is to consult your own record rather than your preference.",
                "body": "Preference will tell you what you’d like to be true. The record tells you what has happened every time you tried it, and the record is a far better guide because it has no stake in the answer.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "One caution about this lesson specifically, because it’s the one people misuse.",
                "body": "Choosing a line that isn’t zero is a legitimate decision. And it’s also the decision that a bad night will try to sell you at eleven o'clock. Make it now, in writing, while calm. A line you drew this afternoon is a line. A line you redrew mid-urge isn’t.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Be ruthless for a moment. What does your own history say?",
                "checks": [
                  {
                    "key": "collapses",
                    "label": "Cutting down never lasts",
                    "asIn": "Every time I have negotiated a reduction it has slid back within weeks",
                    "short": "cutting down collapsing"
                  },
                  {
                    "key": "relief",
                    "label": "Zero feels like relief",
                    "asIn": "The simplicity of never is a weight off, not a weight on",
                    "short": "zero feeling like relief"
                  },
                  {
                    "key": "control",
                    "label": "It’s the control I mind",
                    "asIn": "Losing the choice bothers me far more than the hours do",
                    "short": "minding the loss of control"
                  },
                  {
                    "key": "collide",
                    "label": "It goes against what I believe",
                    "asIn": "The gap between what I do and what I believe hurts more than the behaviour does",
                    "short": "going against what I believe"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "done",
                "headline": "What would being done look like?",
                "helper": "This is your race, so describe the finish honestly.",
                "options": [
                  "Zero, for good",
                  "No longer compulsive",
                  "No longer against my values",
                  "My time back",
                  "My attention back",
                  "Nothing left to hide"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "collapses",
                    "headline": "Your own record is voting for zero, and a record beats a preference every time the two disagree.",
                    "body": "Every negotiated cut has slid back within a few weeks, which is information, not a judgement about you. For you the simple line is probably the honest one. And it will also be easier to hold than the complicated one, because complicated lines require a negotiation every single evening."
                  },
                  {
                    "key": "relief",
                    "headline": "Take the relief seriously. It’s telling you something useful.",
                    "body": "For you, \"never\" feels simple rather than crushing. Not everybody experiences it that way. A line that feels like a weight coming off is one you can still hold on a bad night."
                  },
                  {
                    "key": "control",
                    "headline": "Your finish line is about choice, not about frequency, and you should measure it accordingly.",
                    "body": "You’re done when using no longer feels compulsive, so what you track week by week is whether the choice is coming back to you. That’s a slower measure than a day count and a more honest one, because it’s measuring the thing you want."
                  },
                  {
                    "key": "collide",
                    "headline": "Your line runs straight through your values, not through a number.",
                    "body": "You’re done when what you do stops fighting with who you mean to be. The honesty work from Lesson 3 is the road that gets you there, and the shame research in the same lesson is the warning about how not to travel it."
                  },
                  {
                    "key": "none",
                    "headline": "Having no clear signal yet is a perfectly good place to stand and you should not force the decision.",
                    "body": "Run the two-week experiment in Lesson 108 before committing to anything, and let your own history tell you which line is yours. Deciding in ignorance and then defending the decision is how people end up running somebody else's race for a year."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Zero, for good",
                      "Nothing left to hide"
                    ],
                    "body": "Say it plainly and without apologising for it, because {grid} is a simple line and simple lines hold best on complicated nights. There’s nothing to negotiate and therefore nothing to lose an argument about."
                  },
                  {
                    "options": [
                      "No longer compulsive",
                      "No longer against my values"
                    ],
                    "body": "Measure the things that matter to you, which are {grid}, and let the frequency look after itself. That will feel unsatisfying at first because it gives you no number to check. And that is why it works."
                  },
                  {
                    "options": [
                      "My time back",
                      "My attention back"
                    ],
                    "body": "Your line is a practical one, which is {grid}. Every evening you get back counts as progress, whatever any counter has to say about it, and the counting is done in hours, not in days abstained."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "line",
                "headline": "Say your finish line plainly",
                "helper": "The real one, not the impressive one.",
                "options": [
                  "Never again",
                  "No longer compulsive",
                  "In line with what I believe",
                  "My time and attention back"
                ],
                "result": "My line: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your finish line",
                "template": "\"If nobody else ever knew, the finish line I want is {pick}.\"",
                "fallback": "\"I’ll draw the line after the two-week experiment, and it will be mine, not borrowed.\"",
                "source": "checks",
                "label": "What my history says:",
                "cta": "Save this"
              }
            ],
            "sources": "That the evidence establishes no single universal goal, and that distress, loss of control, and impairment matter more than raw frequency, is from the evidence base (Part A). Cross-addiction parallel: the long-running abstinence-versus-controlled-drinking debate in alcohol, and nicotine harm reduction (Hartmann-Boyce et al., 2018, Cochrane: NRT raises quit rates ~50-60%), show outcomes depend on the person, with the honest caveat that some patterns require abstinence.",
            "action": "Write your actual target in one sentence, the real one, not the one you think you should pick.",
            "reflection": "Answer honestly, just for yourself: *\"If no one else ever knew, the finish line I want is ______.\"* That's the one worth running toward."
          }
        ]
      }
    ]
  },
  {
    "n": 2,
    "title": "Part I · Shrink the payoff",
    "ground": "Ground II · The Crossing",
    "description": "This part takes apart what watching gives you. That means the feelings that make relief look enormous, the state of the body underneath them, how much stimulation you’re used to, and what the wanting really delivers when it arrives.",
    "subs": [
      {
        "code": "I.A",
        "title": "Read the urge",
        "description": "Find out what the urge is for before you try to fight it.",
        "lessons": [
          {
            "number": 8,
            "heading": "What are you really using it for?",
            "title": "What it is really for",
            "tag": "evidence — coping motives",
            "tagColor": "#375623",
            "sub": "I.A",
            "week": 2,
            "day": 1,
            "order": 7,
            "slug": "what-it-is-really-for-8",
            "pages": [
              {
                "kind": "teach",
                "headline": "It’s rarely about sex, and the content is mostly just the vehicle.",
                "body": "What you’re buying is a change of state. The stress goes away for a while, or the boredom ends, or the loneliness gets numbed, or sleep finally arrives. The sexual part is how the change gets delivered instead of what you were shopping for.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "You can test that on yourself without taking my word for it.",
                "body": "Ask when the urges arrive instead of how often. If they cluster around particular feelings and particular hours instead of turning up at random, then something other than desire is doing the scheduling, and whatever that is is your actual problem.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Why somebody uses something turns out to predict the harm it does them, which is a useful finding.",
                "body": "In the alcohol research, drinking in order to cope predicts problems almost regardless of how much a person drinks (Bresin & Mekawi, 2021). Two men can drink the same amount and only one of them gets into trouble, and the difference is what they were drinking for.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "That study was about alcohol, not porn, so treat it as a comparison rather than proof.",
                "body": "The useful question is still the same: what does the behaviour do for you? You can observe that in your own life this week.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The practical consequence is that removing the behaviour without replacing the function tends to fail.",
                "body": "If porn is how you end a wired evening, then taking it away leaves a wired evening with nothing to end it, and a wired evening will go looking. That’s why so many attempts collapse in week three rather than week one. The willpower didn’t run out. The job kept needing doing.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So all of this part works on the function, not on the behaviour.",
                "body": "Once you know which job it does, you can find something else that does the same job, and at that point the choice is between two options instead of between an option and nothing at all. Choosing between two things is enormously easier than resisting one thing.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What job does it do for you?",
                "checks": [
                  {
                    "key": "switch",
                    "label": "It switches me off",
                    "asIn": "At the end of a wired day, nothing else winds me down",
                    "short": "switching off"
                  },
                  {
                    "key": "painkiller",
                    "label": "It kills the pain",
                    "asIn": "After a bad day it numbs things faster than anything else I know",
                    "short": "killing the pain"
                  },
                  {
                    "key": "filler",
                    "label": "It fills the time",
                    "asIn": "There are flat empty hours and nothing else is pulling at me",
                    "short": "filling the time"
                  },
                  {
                    "key": "sleep",
                    "label": "It gets me to sleep",
                    "asIn": "It’s the only reliable way I have of falling asleep",
                    "short": "getting to sleep"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "need",
                "headline": "If the job disappeared tomorrow, what would you need instead?",
                "helper": "Whatever replaces it has to do the same job.",
                "options": [
                  "A real way to wind down",
                  "Something for the pain that is not this",
                  "Something to build",
                  "People",
                  "A sleep routine",
                  "A way to let the pressure out"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "switch",
                    "headline": "If the job is switching off, then the wired evening is your real target, not the screen.",
                    "body": "Cut the porn without replacing the switch and the evening stays wired, and a wired evening will find another way to end itself sooner or later. The work is building a second way down, and Lessons 12 and 15 are where that gets done."
                  },
                  {
                    "key": "painkiller",
                    "headline": "If the job is killing pain, then the pain is your real target and it needs its own plan.",
                    "body": "Take the tool away and leave the pain exactly where it was and you’re standing out in the rain with no umbrella, which isn’t a strategy so much as an ordeal. Parts III and VIII are where the pain gets addressed directly instead of managed around."
                  },
                  {
                    "key": "filler",
                    "headline": "If the job is filling time, then the flat hours are your real target and they’re unusually easy to work on.",
                    "body": "An empty hour doesn’t argue with you or negotiate. It reaches for whatever is nearest. And you already know what that is. So the fix is to make something else nearer, which is what Lesson 23 is about."
                  },
                  {
                    "key": "sleep",
                    "headline": "If the job is getting you to sleep, then that is what has to be replaced first and nothing else will hold until it is.",
                    "body": "Nobody willingly gives up the only method they have of falling asleep. And they should not be expected to. Part I builds you a second one, and once that works the first stops carrying the whole night."
                  },
                  {
                    "key": "none",
                    "headline": "If none of those sounds like the job it does for you, then keep watching for a few days before deciding.",
                    "body": "Naming the feeling before each urge, for three days, will find the answer faster than theorising about it will. And if there is no function, then you’re in the simplest position here, because the habit lessons in Part II will do most of your work."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A real way to wind down",
                      "A sleep routine"
                    ],
                    "body": "Your replacement is in the sleep and body lessons just ahead, which is where {grid} gets built properly rather than improvised."
                  },
                  {
                    "options": [
                      "People"
                    ],
                    "body": "Your replacement is Part VI, because the loneliness that the screen numbs is the thing that only other people can feed. No technique substitutes for it, which is worth knowing early."
                  },
                  {
                    "options": [
                      "Something to build",
                      "A way to let the pressure out"
                    ],
                    "body": "Your replacement is in Parts III and V. You need somewhere for the pressure to go and something worth giving your hours to, and those are different jobs needing different lessons."
                  },
                  {
                    "options": [
                      "Something for the pain that is not this"
                    ],
                    "body": "Your replacement is in Parts III and VIII, which cover better tools for pain in the moment and an honest look at whatever keeps supplying it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "feeling",
                "headline": "Which feeling will you watch for first?",
                "helper": "One word after each urge, for three days.",
                "options": [
                  "Stress",
                  "Boredom",
                  "Loneliness",
                  "Low mood",
                  "Anxiety",
                  "Plain wanting"
                ],
                "result": "Watching for {pick}"
              },
              {
                "kind": "collect",
                "title": "What it’s really for",
                "template": "\"Most of the time, what I’m really reaching for it to fix is {pick}, and that is my real target now.\"",
                "fallback": "\"This week I’ll find out what job it does, by writing one word after each urge for three days.\"",
                "source": "checks",
                "label": "The job it has been doing:",
                "cta": "Save this"
              }
            ],
            "sources": "Internal cues (boredom, stress, loneliness, anxiety, low mood) preceding use, and porn functioning as coping, are from the evidence base, Part B1(b). Cross-addiction parallel: coping motives uniquely predict alcohol *problems* independent of consumption in large meta-analysis (Bresin & Mekawi, 2021; Cooper's motivational model), with stress a primary relapse driver (Sinha, 2007). Function, not just frequency, predicts harm.",
            "action": "For three days, after each urge, name the feeling you were trying to change. One word is fine.",
            "reflection": "Finish this honestly: *\"Most often, what I'm really reaching for it to fix is ______.\"* That word is the real target of everything ahead."
          },
          {
            "number": 9,
            "heading": "Name the emotion, rob the urge",
            "title": "Naming the feeling",
            "tag": "evidence — affect labelling",
            "tagColor": "#375623",
            "sub": "I.A",
            "week": 2,
            "day": 2,
            "order": 8,
            "slug": "naming-the-feeling-9",
            "pages": [
              {
                "kind": "teach",
                "headline": "A feeling with no name gets to run you, and the reason is that there’s nothing in it to take hold of.",
                "body": "It arrives as a wave of something bad with no edges and no shape, so there’s no part of it you can examine and no obvious thing to do about it except make it stop.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Naming a feeling creates a little distance from it.",
                "body": "Saying \"this is loneliness\" helps you notice the feeling without treating it as a command. You still feel it, but you have more room to choose what to do.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This has been looked at directly in brain scans, and the finding is neat.",
                "body": "Putting a feeling into words damped down the amygdala, which is the alarm centre, and brought the thinking part of the frontal lobe online (Lieberman et al., 2007). Naming it is not a distraction from the feeling. It changes what your brain is doing with it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Naming it also shows you why the usual answer is the wrong one, which is the practical half of the lesson.",
                "body": "A bang in the night is frightening until you work out that it was the gate blowing in the wind, and then it’s merely a gate. It works the same way here. Once the feeling is called loneliness, a screen is obviously not going to help, because loneliness is a thing only people can fix.",
                "cta": "Next",
                "quote": {
                  "text": "We suffer more often in imagination than in reality.",
                  "who": "Seneca"
                }
              },
              {
                "kind": "teach",
                "headline": "Use one word for the feeling.",
                "body": "\"Work is stressful\" names the situation. \"This is anxiety\" names the feeling. Name the feeling first, before you decide what to do.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Expect it to feel useless the first few times, because it does, and that is the main reason people abandon it.",
                "body": "It’s a small move and it produces a small effect, and the small effect compounds across a week instead of solving an evening. What you’re building is the habit of noticing, and Lesson 51 explains why that habit is the foundation everything else in Part III stands on.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When you strip the disguise off, what is your urge usually made of?",
                "checks": [
                  {
                    "key": "lonely",
                    "label": "Loneliness dressed up as wanting",
                    "asIn": "It’s an empty evening wearing the clothes of desire",
                    "short": "loneliness in disguise"
                  },
                  {
                    "key": "anxious",
                    "label": "Anxiety dressed up as wanting",
                    "asIn": "The deadline and the dread turn up as an urge instead",
                    "short": "anxiety in disguise"
                  },
                  {
                    "key": "bored",
                    "label": "Boredom dressed up as wanting",
                    "asIn": "Dead time is asking for the fastest thing that will fill it",
                    "short": "boredom in disguise"
                  },
                  {
                    "key": "tired",
                    "label": "Exhaustion dressed up as wanting",
                    "asIn": "It’s the only rest I have let myself have all day",
                    "short": "exhaustion in disguise"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "where",
                "headline": "Where will you do the naming?",
                "helper": "The word has to land somewhere to count.",
                "options": [
                  "Silently, in my head",
                  "Out loud, on my own",
                  "Written down in the log",
                  "Said to somebody else"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "lonely",
                    "headline": "Once you have named it, the loneliness stops being able to pose as desire, and that alone changes what you do next.",
                    "body": "Its real cure comes into view, which is people and contact and all of Part VI. The screen was never in the running for that job. But you couldn’t see that while the feeling had no name and only one obvious remedy."
                  },
                  {
                    "key": "anxious",
                    "headline": "Once you have named it, the anxiety shrinks back down to the size of a task, which is usually much smaller than it felt.",
                    "body": "The deadline needs an hour of work or a written list, and the urge was never going to supply either of those. Naming it puts the real job back in front of you, and quite often doing ten minutes of the real job settles the urge."
                  },
                  {
                    "key": "bored",
                    "headline": "Once you name boredom, you can solve the actual problem.",
                    "body": "Lesson 23 helps you make a short list of things to do before boredom hits. That is easier than trying to fight a vague feeling of desire."
                  },
                  {
                    "key": "tired",
                    "headline": "Once you have named it, the exhaustion asks for the obvious thing, which is sleep, not stimulation.",
                    "body": "The urge was your tiredness filing its request at the wrong desk. Answer the request properly and it stops being filed. That’s why Lesson 15 turns out to matter more than most people expect."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Silently, in my head",
                      "Out loud, on my own"
                    ],
                    "body": "Naming it silently works and saying it out loud works slightly better, probably because speaking makes it harder to skim past. Either way the feeling gets quieter. And nobody but you needs to hear any of it."
                  },
                  {
                    "options": [
                      "Written down in the log",
                      "Said to somebody else"
                    ],
                    "body": "Writing the names down builds a map of your week, and after a fortnight the words that keep coming back turn out to be your real problems, listed in your own handwriting instead of guessed at."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "word",
                "headline": "What is the first thing you’ll say tonight?",
                "helper": "One sentence, before anything else happens.",
                "options": [
                  "\"This is loneliness\"",
                  "\"This is anxiety\"",
                  "\"This is boredom dressed up\"",
                  "\"This is exhaustion\""
                ],
                "result": "I'll say: {pick}"
              },
              {
                "kind": "collect",
                "title": "Naming it first",
                "template": "\"Before I do anything else I say one thing: {pick}. Once it has a name it shrinks, and the screen shows itself up as the wrong answer.\"",
                "fallback": "\"Every urge this week gets a name before I make any decision about it.\"",
                "source": "checks",
                "label": "The usual disguises:",
                "cta": "Save this"
              }
            ],
            "sources": "Affect labelling is a well-established emotion-regulation technique; the flagged missing citation is now closed with the verified mechanism study (Lieberman et al., 2007, Psychological Science; STUDY_BANK.md): naming a feeling damped amygdala response and engaged the right ventrolateral prefrontal cortex. Ties to the coping-motives finding in the evidence base, Part B1(b).",
            "action": "At each urge, give the underlying feeling a one-word name before doing anything else.",
            "reflection": "Next urge, name the feeling underneath in one word before acting. Over a week, note which words keep recurring, those are the real problems to solve."
          },
          {
            "number": 10,
            "heading": "Curiosity over control",
            "title": "Curiosity instead of control",
            "tag": "reframe — ACT",
            "tagColor": "#4B3F72",
            "sub": "I.A",
            "week": 2,
            "day": 3,
            "order": 9,
            "slug": "curiosity-instead-of-control-10",
            "pages": [
              {
                "kind": "teach",
                "headline": "Fighting every urge is exhausting, and the part people miss is that even the nights you win cost you something.",
                "body": "You end up braced and drained with the urge still sitting in the middle of the evening. And you go to bed having spent three hours in a fight. Winning like that a few times a week isn’t sustainable and it’s not meant to be.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "There’s a lighter way to stand, and it works because it doesn’t fight.",
                "body": "You get curious about the urge instead. Not as a trick to make it go away, which it will detect, but as a genuine question about what is happening and why it has turned up tonight in particular.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The mechanism is simple enough to state in one line.",
                "body": "You can’t be curious about something and drowning in it at the same time, because curiosity requires a bit of distance and drowning doesn’t allow any. So the moment you lean in to look properly, you have already stepped back.",
                "cta": "Next",
                "quote": {
                  "text": "You have power over your mind — not outside events. Realize this, and you will find strength.",
                  "who": "Marcus Aurelius"
                }
              },
              {
                "kind": "teach",
                "headline": "That small gap is the same one that urge surfing depends on later in Part III. That’s why this lesson comes first.",
                "body": "Everything in that part assumes you can watch a thing without immediately doing something about it. And that assumption is a skill rather than a personality trait. This is where you start practising it, on a low-stakes question.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The question itself should be specific, not general, because general questions get general answers.",
                "body": "\"What is this about?\" is weak. \"What happened today that I haven’t dealt with?\" is strong, and so is \"what time is it and where am I?\". Specific questions produce information you can act on, and vague ones produce a shrug.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Curiosity can turn into self-criticism.",
                "body": "If your questions sound accusing, stop. Ask them as gently as you would ask a friend. The goal is to understand the pattern, not put yourself on trial.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How do you usually stand towards an urge?",
                "checks": [
                  {
                    "key": "combat",
                    "label": "I treat it as an enemy",
                    "asIn": "It feels like a fight, and I brace for it",
                    "short": "treating it as a fight"
                  },
                  {
                    "key": "dread",
                    "label": "I dread it arriving",
                    "asIn": "I see it coming and my heart sinks",
                    "short": "dreading it"
                  },
                  {
                    "key": "whiteknuckle",
                    "label": "I grip and hold on",
                    "asIn": "I hang on with my teeth gritted and wait for it to pass",
                    "short": "gripping and holding on"
                  },
                  {
                    "key": "curious",
                    "label": "On a good day I can study it",
                    "asIn": "Sometimes I manage to just watch what it does",
                    "short": "studying it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "message",
                "headline": "If the urge were carrying a message, what would yours say?",
                "helper": "Whatever is underneath it, when you listen.",
                "options": [
                  "\"I am lonely\"",
                  "\"I am avoiding that piece of work\"",
                  "\"I am exhausted\"",
                  "\"This is the only rest I have allowed myself\"",
                  "\"I am bored out of my mind\""
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "combat",
                    "headline": "A soldier never hears what the urge was trying to tell him, because he is too busy fighting it to listen.",
                    "body": "And the message is usually the useful part, since it points at something upstream that could be fixed. The scientist writes it down and then goes and deals with whatever it named. That means fewer urges next week, not the same number fought better."
                  },
                  {
                    "key": "dread",
                    "headline": "Dread arrives before the urge does, and it does a surprising amount of the damage on its own.",
                    "body": "Curiosity takes most of the sting out of it, because \"that is interesting, it’s early tonight\" puts you in a completely different position from \"oh no, here we go again\". It costs you nothing to try and the difference is noticeable within a week."
                  },
                  {
                    "key": "whiteknuckle",
                    "headline": "Gripping keeps you staring at the very thing you’re gripping, which is exactly where you don’t want your attention.",
                    "body": "Loosen your hold and have a proper look at it instead. The wave passes on its own while you’re studying it. And you finish the evening less worn out, which matters because tomorrow evening is coming too."
                  },
                  {
                    "key": "curious",
                    "headline": "The job is to stay curious on the bad days as well as the good ones, which is harder and more valuable.",
                    "body": "Curiosity that only shows up when things are easy isn’t much use as an instrument. And the loud nights are the ones with the most information in them, so those are the nights worth taking notes on."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "\"I am lonely\"",
                      "\"I am bored out of my mind\""
                    ],
                    "body": "Both of those have whole parts of this course aimed at them, so read properly, the urge is pointing you at the right lesson instead of merely being a nuisance."
                  },
                  {
                    "options": [
                      "\"I am avoiding that piece of work\""
                    ],
                    "body": "Urges that come from avoidance dissolve surprisingly fast once you start the thing you’re avoiding. Give the work fifteen minutes and watch what happens to the urge, because the result tends to be dramatic enough to change how you read the next one."
                  },
                  {
                    "options": [
                      "\"I am exhausted\"",
                      "\"This is the only rest I have allowed myself\""
                    ],
                    "body": "If the message is rest, then schedule some real rest rather than negotiating with the urge. It only volunteers for the job because it’s the one break you ever let yourself take. And that is a scheduling problem, not a willpower problem."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "question",
                "headline": "Which question will you meet it with?",
                "helper": "Ask it as though you want the answer.",
                "options": [
                  "\"What is this about today?\"",
                  "\"What set this off?\"",
                  "\"What do I need?\""
                ],
                "result": "I'll ask: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your new stance",
                "template": "\"I’m going to study the next urge instead of fight it, by asking {pick} and writing down whatever answer comes back.\"",
                "fallback": "\"The next urge gets met with a question, and I’ll write down the answer.\"",
                "source": "checks",
                "label": "How I used to stand:",
                "cta": "Save this"
              }
            ],
            "sources": "The curiosity or willingness over control stance is core ACT, acceptance rather than experiential avoidance, the best-supported approach for problematic pornography use per the evidence base. It operationalises the same observing stance as urge surfing (Day 37) and defusion (Day 38).",
            "action": "Meet each urge with one question, \"what's this about today?\", and log the answer.",
            "reflection": "Try meeting one urge as a curious scientist rather than a soldier. Write what you noticed, about the urge, and about whether curiosity made it easier to let pass."
          }
        ]
      },
      {
        "code": "I.B",
        "title": "The heavy states",
        "description": "Stress, low mood and shame, which are the states that make relief look worth almost anything.",
        "lessons": [
          {
            "number": 11,
            "heading": "The bad-day spike is math, not weakness",
            "title": "The bad-day spike",
            "tag": "evidence — hyperbolic discounting",
            "tagColor": "#375623",
            "sub": "I.B",
            "week": 2,
            "day": 4,
            "order": 10,
            "slug": "the-bad-day-spike-11",
            "pages": [
              {
                "kind": "teach",
                "headline": "A bad day can make an urge stronger without making you weak.",
                "body": "Future costs feel less important, while immediate relief feels more important. Both changes make a slip more likely.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Put those together and the pull has to peak at exactly the moment you’re least able to handle it.",
                "body": "It couldn’t really work any other way, and once you see that, the pattern stops looking like a character flaw. You’re not weaker on bad days. The sum is different on bad days.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Stress is the most reliable trigger anybody has found, across every addiction that has been studied.",
                "body": "Across drugs, drink and gambling, the brain's stress circuits and its craving circuits overlap, so a stressed brain wants harder (Sinha, 2007). This is about as replicated as findings get in this field.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "That means the single most useful thing you can do is stop treating bad days as unpredictable.",
                "body": "They’re not. They have shapes, and the shapes repeat. A knock-back, an argument, a day that ran you ragged, a long grey nothing. Most men have two or three that account for most of their bad evenings.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Once you know your warning signs, you can plan for a difficult evening.",
                "body": "Decide at noon what you will do at nine. Planning is easier before you are tired or upset.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "One thing to be clear about, since this is where people go wrong with it.",
                "body": "The plan for a bad day should be smaller than you think is reasonable. On a good day you’ll design something ambitious, and on the actual bad day you’ll not do it. Make the plan small enough to do when you feel flat and tired.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What kind of day tends to flatten you?",
                "checks": [
                  {
                    "key": "knock",
                    "label": "A knock-back",
                    "asIn": "Rejection, criticism, or a door shut in my face",
                    "short": "a knock-back"
                  },
                  {
                    "key": "fight",
                    "label": "An argument",
                    "asIn": "The row keeps replaying in my head for hours afterwards",
                    "short": "an argument"
                  },
                  {
                    "key": "grey",
                    "label": "A long grey nothing",
                    "asIn": "No wins, no plans, and no shape to the day at all",
                    "short": "a grey day"
                  },
                  {
                    "key": "wreck",
                    "label": "A day that ran me ragged",
                    "asIn": "Deadlines from start to finish and nothing left of me",
                    "short": "a day that ran me ragged"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "when",
                "headline": "And when does the spike usually land?",
                "helper": "Pick every window that is true for you.",
                "options": [
                  "Late that night",
                  "Straight afterwards",
                  "The next morning",
                  "Once I am finally alone",
                  "After a drink",
                  "In bed"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "knock",
                    "headline": "For you, rejection is an early warning sign.",
                    "body": "Rejection blurs the future just as the want for relief jumps. That’s why those two together are so hard to sit through. Plan the evening after a rejection while you are still calm."
                  },
                  {
                    "key": "fight",
                    "headline": "For you, an argument is an early warning sign, especially when you keep replaying it.",
                    "body": "The row goes round in your head, the discomfort climbs, and relief starts looking cheap by comparison. That means the hour after an argument is worth planning for in advance. And it also means Lesson 54's advice about anger is directly relevant to you."
                  },
                  {
                    "key": "grey",
                    "headline": "For you, an empty and low day is the warning sign.",
                    "body": "With no shape and no wins, by evening the fastest available feeling looks like the only one on offer. A simple schedule can help. Lesson 43 shows you how to make one."
                  },
                  {
                    "key": "wreck",
                    "headline": "For you, an exhausting day is the warning sign. Protect the evening instead of expecting more effort.",
                    "body": "A day like that leaves you spent, and spent is exactly where the pull is strongest. So the move is to defend the evening on those days rather than to try harder during them, because trying harder is what emptied you in the first place."
                  },
                  {
                    "key": "none",
                    "headline": "If your flatteners aren’t on that list, then name them yourself over the next week instead of adopting mine.",
                    "body": "The log you’re about to keep will draw your own forecast. And it will be more accurate than any list somebody else could write. Two weeks of entries is usually enough to see the shapes."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Late that night",
                      "In bed"
                    ],
                    "body": "Your spike lands late, so your move is to change the room instead of to strengthen your resolve. Put the phone in the kitchen before the risky late-night window. Lesson 42 shows you how."
                  },
                  {
                    "options": [
                      "Straight afterwards"
                    ],
                    "body": "Your spike lands straight after the bad thing, so your move is to put something in between the two. A walk first, before any other decision, gives the charge somewhere to go while the peak passes."
                  },
                  {
                    "options": [
                      "Once I am finally alone"
                    ],
                    "body": "Your spike waits for the empty flat, so your move is contact, not technique. One call or message before the door closes on the evening changes what the evening is made of. And it’s a great deal easier than fighting what it would otherwise become."
                  },
                  {
                    "options": [
                      "After a drink",
                      "The next morning"
                    ],
                    "body": "Your spike rides on the drink or on the morning after, so guard those particular hours specifically and let the rest of the week look after itself. Lesson 21 deals with the drink half of that directly."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "move",
                "headline": "What will you do on the next bad day?",
                "helper": "Choose it now so that midnight doesn’t have to.",
                "options": [
                  "Put the phone in the kitchen",
                  "Walk before anything else",
                  "Call or message somebody",
                  "Train that evening",
                  "Write the day down"
                ],
                "result": "My move: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your forecast",
                "template": "\"When a day flattens me, I {pick}. I decided that while I was calm, so I don’t have to argue it out at midnight.\"",
                "fallback": "\"When a day flattens me, I follow the move I chose in the afternoon.\"",
                "source": "checks",
                "label": "The spike usually lands:",
                "cta": "Save this"
              }
            ],
            "sources": "Present bias / hyperbolic discounting is established behavioural economics. Cross-addiction parallel: stress is a major, well-replicated relapse trigger with overlapping stress and craving circuitry (Sinha, 2007). Negative mood as an antecedent also appears in the evidence base (Part B).",
            "action": "For one week, before each urge, log your mood (1–5) and what happened that day. You're building a map of your own spikes.",
            "reflection": "Name your three most reliable \"bad-day\" triggers, the specific situations that flatten you. Write them down. Knowing the shape of your own bad day is half of seeing the spike coming."
          },
          {
            "number": 12,
            "heading": "Calm the body, starve the urge (slow breathing)",
            "title": "Slowing the body down",
            "tag": "evidence — stress regulation",
            "tagColor": "#375623",
            "sub": "I.B",
            "week": 2,
            "day": 5,
            "order": 11,
            "slug": "slowing-the-body-down-12",
            "pages": [
              {
                "kind": "teach",
                "headline": "If you had to bet on a single trigger across every addiction ever studied, you’d bet on stress and you’d win comfortably.",
                "body": "Which raises an obvious question that most advice skips over. If stress is the trigger, why is nearly all the advice about resisting the urge, not about reducing the stress that produced it?",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Stress and craving share wiring. That means a stressed body wants harder and a calmer body wants less.",
                "body": "That gives you a change you can make before the urge arrives instead of during it. Bring the body down and you starve the urge that would otherwise have been sitting on top of it, which is a much easier fight than the one you have been having.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Your breathing is the one handle you have on the part of the nervous system that otherwise runs itself.",
                "body": "You can’t lower your heart rate by deciding to. You can lower it by breathing in a particular way, because the out-breath is wired to the brake. This is mechanical, not mystical and it works whether or not you believe in it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The instructions matter, and vague versions of them don’t work, so here they are.",
                "body": "Slow to around six breaths a minute, which is roughly four seconds in and six seconds out. Make the out-breath longer than the in-breath. Five minutes a day. A review of fifteen studies found this raised heart-rate variability and lowered anxiety (Zaccaro et al., 2018).",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Two honest caveats about that evidence, because you should know what you’re getting.",
                "body": "Two things are worth knowing before you rely on it.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "The studies were mostly small and mostly on healthy volunteers, and none of them measured porn use",
                    "The link from calmer body to weaker urge is an inference from the stress-craving connection rather than a demonstrated result"
                  ],
                  "note": "It’s a reasonable inference and it’s not a proven one."
                }
              },
              {
                "kind": "teach",
                "headline": "The part people get wrong is timing, so this is the instruction that decides whether it works.",
                "body": "Practise it daily when nothing is happening, and then use it at the first sign of pressure, not at the peak. A brake you have rehearsed is fitted by the time the hill arrives. A brake you’re reading the manual for at the bottom of the hill isn’t much use.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do your urges usually ride on?",
                "checks": [
                  {
                    "key": "stresstension",
                    "label": "Stress and tension",
                    "asIn": "The day's pressure ends up looking for a way out",
                    "short": "stress and tension"
                  },
                  {
                    "key": "woundbody",
                    "label": "A wound-up body",
                    "asIn": "Shoulders up at my ears, jaw set, breathing high in the chest",
                    "short": "a wound-up body"
                  },
                  {
                    "key": "deadline",
                    "label": "Deadline weeks",
                    "asIn": "My slips cluster in the weeks when everything is due",
                    "short": "deadline weeks"
                  },
                  {
                    "key": "calmdesire",
                    "label": "Ordinary wanting",
                    "asIn": "Stress isn’t really my pattern",
                    "short": "ordinary wanting"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "protocol",
                "headline": "The instructions, which are specific on purpose",
                "helper": "Vague advice about breathing doesn’t work. These numbers do.",
                "options": [
                  "About six breaths a minute",
                  "A longer out-breath than in-breath",
                  "Five minutes, every day",
                  "Used at the first sign of pressure"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "stresstension",
                    "headline": "Your pattern is the textbook one, which is good news because it’s also the best understood.",
                    "body": "Treat the stress that arrives before the urge and the urge either turns up smaller or doesn’t turn up at all. You’re working one step upstream of the moment you keep losing, and upstream is where these fights are winnable."
                  },
                  {
                    "key": "woundbody",
                    "headline": "The body holds tension long after the mind has stopped noticing that it’s there. That’s why this works when it seems unnecessary.",
                    "body": "Five slow minutes drops the shoulders first and the pressure follows them down a minute or two later. Don’t judge it on how stressed you felt beforehand, because the tension you had stopped noticing is the tension doing the damage."
                  },
                  {
                    "key": "deadline",
                    "headline": "In a crunch week the breathing has to be scheduled, not left to whether you remember.",
                    "body": "The daily five minutes matters most in the weeks it feels most skippable, which is an annoying rule and a reliable one. Put it in the calendar during the calm week so that the crunch week inherits it."
                  },
                  {
                    "key": "calmdesire",
                    "headline": "If your urges arrive in a calm body then this is background work for you, not a main tool.",
                    "body": "Keep the practice for its general benefits, since five minutes is cheap, and put your real effort into the lessons that match your own pattern. Knowing which tools aren’t yours is worth as much as knowing which are."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "About six breaths a minute",
                      "A longer out-breath than in-breath"
                    ],
                    "body": "The numbers are the point, not the decoration. Around six a minute with a long out-breath is where the brake engages, and \"just breathe deeply\" is a different instruction that does something else."
                  },
                  {
                    "options": [
                      "Five minutes, every day",
                      "Used at the first sign of pressure"
                    ],
                    "body": "Daily practice plus early use is the pairing that works, because a brake rehearsed in calm moments is already fitted by the time the hill turns out to be real. Either half on its own does less."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "breathslot",
                "headline": "When will you do the five minutes?",
                "helper": "Practise it before you ever need it in a crisis.",
                "options": [
                  "In the morning",
                  "At lunchtime",
                  "Before the risky hours",
                  "Before bed"
                ],
                "result": "My five minutes: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your five minutes",
                "template": "\"Six breaths a minute with a long out-breath, five minutes at {pick}, and again at the first sign of pressure. A body turned down a notch starves the urge sitting on top of it.\"",
                "fallback": "\"I’ll schedule the five daily minutes this week, and use the long out-breath at the first sign of pressure.\"",
                "source": "checks",
                "label": "What my urges ride on:",
                "cta": "Save this"
              }
            ],
            "sources": "Slow-paced breathing (around six breaths per minute, longer exhale) reliably reduces stress and anxiety and raises heart-rate variability in the general research literature (external, well-established). The craving link is inferred because stress is consistently reported as a top relapse trigger across addictions (general addiction-relapse literature, stated qualitatively per the evidence base); no porn-specific breathing trial. Pairs with Day 76 (box breathing) and urge-surfing (Tier 1). Added: the slow-breathing systematic review (Zaccaro et al., 2018).",
            "action": "Practise slow breathing (about six breaths a minute, exhale longer than the inhale) for five minutes daily, and use it at the first sign of stress or an urge.",
            "reflection": "Note your stress level (1–5) before and after a few slow-breathing sessions. Does turning the body down a notch take any edge off the urges that follow?"
          },
          {
            "number": 13,
            "heading": "Act your way out of the low mood (behavioural activation)",
            "title": "Acting before you feel like it",
            "tag": "plausible — behavioural activation",
            "tagColor": "#0B3C49",
            "sub": "I.B",
            "week": 2,
            "day": 6,
            "order": 12,
            "slug": "acting-before-you-feel-like-it-13",
            "pages": [
              {
                "kind": "teach",
                "headline": "Low mood and inactivity can reinforce each other.",
                "body": "You feel low, so you do less. With fewer useful or enjoyable activities, your mood drops further and you withdraw more.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Into the space that clears out slides the one reliable hit you have got left.",
                "body": "That’s the connection to this course. Porn isn’t competing with a full life on those evenings. It’s competing with an empty one, and in an empty evening it wins without having to be particularly attractive.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Waiting to feel better before you act often keeps you stuck.",
                "body": "Low mood reduces motivation. If you wait for motivation to return first, nothing changes. Start with one small scheduled action and let the feeling follow.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The treatment turns the order round, so that you act first and let the feeling catch up afterwards.",
                "body": "It’s called behavioural activation, and across 25 randomised trials it beat the control treatments for low mood by a wide margin (Ekers et al., 2014). The authors note the studies were of variable quality and the follow-ups short, so it’s strong, not settled.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The method is more specific than \"do more things\", and the specifics are what make it work.",
                "body": "You schedule the activity in advance, you make it absurdly small, and then you do it at the scheduled time regardless of how you feel on the day. The scheduling is what removes the decision, and removing the decision is the entire mechanism.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "One thing to be clear about before you try it, because it matters and it’s not a formality.",
                "body": "If the lowness is severe, and particularly if it feels hopeless or has lasted months, that is depression, not a flat patch. And it deserves professional help alongside anything in this app. Lesson 99 has the screening tool and Lesson 104 has the case for therapy.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What shape does the spiral take for you?",
                "checks": [
                  {
                    "key": "dless",
                    "label": "I feel low, so I do less",
                    "asIn": "When I feel low I stop doing things",
                    "short": "doing less"
                  },
                  {
                    "key": "rewardsgone",
                    "label": "The small pleasures disappear",
                    "asIn": "My days empty out of anything that lifts me",
                    "short": "losing the small pleasures"
                  },
                  {
                    "key": "withdraw",
                    "label": "I pull away from people",
                    "asIn": "I drop plans and people one at a time",
                    "short": "pulling away from people"
                  },
                  {
                    "key": "onehit",
                    "label": "Porn is the one thing left",
                    "asIn": "It ends up as the last reliable reward standing",
                    "short": "being the last reward left"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "threekinds",
                "headline": "Three kinds to schedule this week",
                "helper": "One of each. Small enough that you’d still do them on a bad day.",
                "options": [
                  "Something I used to enjoy",
                  "Something small that I finish",
                  "Something with another person in it"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "dless",
                    "headline": "The spiral breaks at the doing, not at the feeling, which is the whole point and the hardest part to accept.",
                    "body": "One scheduled thing, done while you still feel flat, is the wheel starting to turn the other way. It won’t feel like much at the time. And that is why it has to be scheduled, not left to how you feel on the day."
                  },
                  {
                    "key": "rewardsgone",
                    "headline": "The pleasures went because the activities that carried them went, so they will come back the same way.",
                    "body": "Put the activities back and the pleasure follows, usually running a step or two behind. That means the first attempt is a poor test. Give it three or four goes before you decide whether the old hobby still does anything for you."
                  },
                  {
                    "key": "withdraw",
                    "headline": "Pulling away feels protective and works like rust, and over months instead of dramatically.",
                    "body": "Connection is the thing that pays most and it’s reliably the first thing people drop, which is an unfortunate combination. So schedule it the way you’d take medicine, on the day, whether or not you feel like it, and judge it afterwards rather than before."
                  },
                  {
                    "key": "onehit",
                    "headline": "When one reward is the only one standing, it wins by default, not on merit, and that is worth noticing.",
                    "body": "You’re not choosing it over the alternatives. There are no alternatives. Put three kinds back on the schedule and you have rebuilt the competition, at which point the monopoly breaks without any fighting."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Something I used to enjoy"
                    ],
                    "body": "The old pleasures come back rusty and they work anyway. Ten minutes of the old hobby, with your mood written down before and after, is enough of a test and the writing down is what stops you dismissing a real effect."
                  },
                  {
                    "options": [
                      "Something small that I finish"
                    ],
                    "body": "Finishing something is the most reliable mood tool there is. And it doesn’t have to be impressive to count. One tidied drawer is real evidence against the flatness, and evidence is what the flatness is short of."
                  },
                  {
                    "options": [
                      "Something with another person in it"
                    ],
                    "body": "Anything with a person in it counts twice, because it fills the time and lifts the mood at once. A walk with somebody does both jobs in one go. That’s why it’s usually the best value item on the list."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "firstsmall",
                "headline": "What is the first small thing?",
                "helper": "Make it smaller than feels respectable.",
                "options": [
                  "Walk to the end of the road",
                  "Ten minutes of the old hobby",
                  "Text one person",
                  "Finish one small task"
                ],
                "result": "Starting with: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your schedule",
                "template": "\"I act first and let the mood follow. This week that means {grid}, starting with {pick}, whatever I feel like on the day.\"",
                "fallback": "\"I’ll schedule three small activities this week and do them on schedule, not on mood.\"",
                "source": "checks",
                "label": "My spiral:",
                "cta": "Save this"
              }
            ],
            "sources": "Behavioural activation is a well-established treatment for low mood, now cited with a verified meta-analysis: 25 RCTs, N=1,088, SMD -0.74 versus controls, carrying the authors' own low-study-quality and short-follow-up caveat (Ekers et al., 2014; STUDY_BANK.md). Relevant because low mood is a common coping driver in the evidence base (Parts A4, B1(b)); act-first aligns with ACT committed action. Severe depression is directed to professional care.",
            "action": "Schedule three small activities this week, one pleasure, one mastery, one connection, and do them regardless of mood. Log your mood before and after each.",
            "reflection": "Name one small activity that used to give you something, and schedule it this week even if you don't feel like it. Note whether doing it shifted your mood at all."
          },
          {
            "number": 14,
            "heading": "Self-compassion beats self-flagellation",
            "title": "How you talk to yourself after",
            "tag": "evidence — self-compassion / shame research",
            "tagColor": "#375623",
            "sub": "I.B",
            "week": 2,
            "day": 7,
            "order": 13,
            "slug": "how-you-talk-to-yourself-after-14",
            "pages": [
              {
                "kind": "teach",
                "headline": "Harsh self-talk can make the next slip more likely.",
                "body": "If you use porn to escape painful feelings, attacking yourself creates more of the feeling you are trying to escape.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "That means the harshness isn’t merely failing to help. It’s actively working for the other side.",
                "body": "That’s a strange thing to accept, because it feels as though letting yourself off would be worse. But the question isn’t whether harshness feels appropriate. It’s what it does to your behaviour over the following week, and the answer is reliably nothing good.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The evidence points the same way from several directions.",
                "body": "The men most caught up in shame and relapse thinking had the worst time after a slip (Prause & Binnie, 2024), and the moral incongruence work in Lesson 3 found the same shape. Shame predicts more of the behaviour instead of less of it, consistently enough that the app is built around it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Being kinder to yourself isn’t the same as going soft, and the difference is precise.",
                "body": "Softness would be pretending it didn’t matter. What is being asked for is honesty without contempt. That means the same facts, stated plainly, with the verdict on your character left off the end. That’s a harder thing to do than being harsh, not an easier one.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The practical version is a test you can apply in about five seconds.",
                "body": "Ask what you’d say to a good friend who told you exactly what you have just done. You’d be honest with him and you’d not be cruel. And you’d almost certainly ask what he thought had led up to it. Say that to yourself instead, in those words.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Being kinder to yourself does not mean you stop caring.",
                "body": "You can take the behavior seriously without insulting yourself. That leaves more attention for understanding what happened and changing the plan.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does your inner voice sound like after a slip?",
                "checks": [
                  {
                    "key": "contempt",
                    "label": "Contemptuous",
                    "asIn": "It’s a tone I’d never use on anybody I cared about",
                    "short": "contemptuous"
                  },
                  {
                    "key": "names",
                    "label": "Full of names",
                    "asIn": "Pathetic, weak, hopeless, over and over",
                    "short": "full of name-calling"
                  },
                  {
                    "key": "silence",
                    "label": "Coldly silent",
                    "asIn": "No words at all, just my own respect withdrawn",
                    "short": "coldly silent"
                  },
                  {
                    "key": "friend",
                    "label": "Reasonably kind",
                    "asIn": "I’m decent to myself most of the time",
                    "short": "reasonably kind"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "friendsays",
                "headline": "What would you say to a friend in the same position?",
                "helper": "The words themselves, as you’d really say them.",
                "options": [
                  "\"That happened\"",
                  "\"It is not the end of anything\"",
                  "\"What can we learn from it?\"",
                  "\"Let us keep going\"",
                  "\"You are not hopeless, you are tired\""
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "contempt",
                    "headline": "You’d never speak to a struggling friend that way, and there’s a reason you’d not.",
                    "body": "You already know that contempt crushes people into a spiral instead of lifting them out of one. The same mechanics apply when the person on the receiving end happens to be you, and knowing that is most of what it takes to stop."
                  },
                  {
                    "key": "names",
                    "headline": "The names manufacture misery, and misery is the state the behaviour feeds on, which makes this a closed circuit.",
                    "body": "The part of you doing the name-calling believes it’s coaching you towards better behaviour. In practice it’s producing the raw material for the next episode. And it has been doing so for years with results you can check."
                  },
                  {
                    "key": "silence",
                    "headline": "The cold silence still delivers a verdict. It skips the words, which makes it harder to catch and argue with.",
                    "body": "Withdrawing your own respect is a punishment whether or not it’s spoken aloud. Warmth combined with honesty works better. And it’s something you can decide to do, in the same way you decided to go quiet."
                  },
                  {
                    "key": "friend",
                    "headline": "What is left to work on is consistency, not the basic stance, which puts you ahead of most people here.",
                    "body": "You need the friendly voice on your worst night not only on the ordinary ones. So write down what it says now, while the nights are still easy, because writing it in advance is how it becomes available later."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "\"That happened\"",
                      "\"It is not the end of anything\""
                    ],
                    "body": "Plain acknowledgement with no verdict attached is the whole first move. And it’s harder than it looks. It keeps the slip as one event, and the event is already over by the time you’re talking about it."
                  },
                  {
                    "options": [
                      "\"What can we learn from it?\"",
                      "\"Let us keep going\""
                    ],
                    "body": "The learning question is what makes kindness rigorous rather than soft. And it’s the part that separates this from letting yourself off. It looks straight at the slip, which is something contempt never manages to do."
                  },
                  {
                    "options": [
                      "\"You are not hopeless, you are tired\""
                    ],
                    "body": "That sentence separates the state you were in from the person you are, and blurring exactly that line is what shame exists to do. Keeping the two apart is most of the skill."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "card",
                "headline": "What will you write down for next time?",
                "helper": "Write it now, while it’s easy to write.",
                "options": [
                  "The friend's answer, word for word",
                  "The question \"what can we learn?\"",
                  "Both, on one card"
                ],
                "result": "I'll write: {pick}"
              },
              {
                "kind": "collect",
                "title": "The friendly voice",
                "template": "\"After the next slip I talk to myself the way I’d talk to a friend. That means {grid}. {pick}, because being honest and kind is what keeps me in this.\"",
                "fallback": "\"I’ll write the friendly answer down this week, before the night I need it.\"",
                "source": "checks",
                "label": "How the voice has sounded:",
                "cta": "Save this"
              }
            ],
            "sources": "That shame and self-criticism predict more relapse and maintain distress is central to the evidence base: moral incongruence (Grubbs et al., 2019), the shame trap (Part B3), and the finding that people most involved in shame-and-relapse-focused forum involvement report worse emotional outcomes after a lapse (Prause & Binnie, 2024). The self-compassion counterpart is well-supported in the broader clinical literature and is the natural, evidence-aligned alternative.",
            "action": "After any slip, write the response you'd give a good friend in your position, then give it to yourself.",
            "reflection": "Write what you say to yourself after a slip. Then write what you'd say to a friend. If there's a gap, the friend version is the one that helps, start using it."
          }
        ]
      },
      {
        "code": "I.C",
        "title": "Sleep and food",
        "description": "A run-down body makes every offer look better than it is, so the floor gets fixed first.",
        "lessons": [
          {
            "number": 15,
            "heading": "Sleep is impulse control",
            "title": "Sleep and self-control",
            "tag": "evidence — sleep and self-control",
            "tagColor": "#375623",
            "sub": "I.C",
            "week": 2,
            "day": 8,
            "order": 14,
            "slug": "sleep-and-self-control-15",
            "pages": [
              {
                "kind": "teach",
                "headline": "Self-control is something your brain does, not something you have, and what it runs on is sleep.",
                "body": "That distinction matters. If it were a quantity of character then a bad night wouldn’t affect it. Since it’s a function, it degrades when the machinery is underpowered, in the same way your reaction times do.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Poor sleep makes impulse control weaker.",
                "body": "A review of the research ties poor sleep habits directly to impulsive behaviour and weaker self-control (Pilcher et al., 2015). That was general research, not specific to porn, but the mechanism it describes is exactly the one you’re relying on at one in the morning.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A tired brain also falls back on whatever it has done most often before, which is the second half of the problem.",
                "body": "Rested, it can stop, weigh the options and pick the harder one. Tired, it skips that step and slides into the deepest available groove. And you already know which groove is deepest at one in the morning.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Put those two together and you get the finding that changes what you should work on.",
                "body": "The fight you keep losing at one in the morning is largely being decided at ten the night before. Not completely, but enough that it’s the highest-value hour in your day and almost nobody treats it that way.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "An earlier bedtime is easier to control than a peak urge.",
                "body": "At bedtime, you can still make a calm decision. Good sleep also improves impulse control the next day.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The practical instruction is a fixed lights-out, not a target number of hours, and the reason is specific.",
                "body": "Hours are an outcome you can’t directly control, whereas a time you turn the light off is a behaviour you can. Fix the behaviour and the hours follow. Aim at the hours and you end up lying in the dark being annoyed about it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What came before your last few slips?",
                "checks": [
                  {
                    "key": "short",
                    "label": "A short night",
                    "asIn": "Five or six hours, and then a day running on fumes",
                    "short": "a short night"
                  },
                  {
                    "key": "broken",
                    "label": "A broken night",
                    "asIn": "Awake at three, lying in the dark, wrecked by morning",
                    "short": "a broken night"
                  },
                  {
                    "key": "latestart",
                    "label": "Lights out but screen on",
                    "asIn": "I go to bed on time and then stay on the phone for hours",
                    "short": "going to bed but staying on the phone"
                  },
                  {
                    "key": "rested",
                    "label": "Nothing unusual",
                    "asIn": "My slips don’t seem to track how rested I am",
                    "short": "sleeping normally"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "thief",
                "headline": "What steals your bedtime?",
                "helper": "Name the thief, because you can only stop what you can name.",
                "options": [
                  "One more episode",
                  "The endless scroll",
                  "Work running late",
                  "Late gaming",
                  "Late caffeine",
                  "Nothing in particular, I just drift"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "short",
                    "headline": "If your slips ride on short nights, then most of the midnight loss was booked several hours earlier.",
                    "body": "That’s good news rather than a rebuke, because the winnable fight turns out to be getting the light off, which is a far easier fight than the one you have been having at one in the morning and involves no willpower at all."
                  },
                  {
                    "key": "broken",
                    "headline": "Broken nights load the dice twice over. That’s why they feel so much worse than short ones.",
                    "body": "You get the tiredness and you also get the empty waking hours in the dark, which are their own kind of danger. Moving the phone out of the room, as in Lesson 42, therefore matters double for you instead of being a general suggestion."
                  },
                  {
                    "key": "latestart",
                    "headline": "The screen is stealing the very sleep that would have helped you resist the screen, which is a tidy little circle.",
                    "body": "The place to break it’s at the lights-out end, while you can still think clearly about what you’re doing. Breaking it at the other end means arguing with yourself at half past midnight, which isn’t where you win things."
                  },
                  {
                    "key": "rested",
                    "headline": "If your slips don’t track your sleep, then believe your own data, not the lesson.",
                    "body": "Sleep supports you, but it may not be your main issue. Another lesson may fit your pattern better. Crossing a tool off honestly is worth as much as adding one."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "One more episode",
                      "The endless scroll",
                      "Late gaming"
                    ],
                    "body": "That thief has an off switch, which is more than can be said for most of them. Decide the rule about the last episode at dinner, while the deciding part of your brain is still on duty and the decision is cheap."
                  },
                  {
                    "options": [
                      "Work running late"
                    ],
                    "body": "Work needs a hard edge more than your evening needs willpower. A time when the laptop shuts is a bedtime wearing office clothes. And it’s easier to defend to other people than a bedtime is."
                  },
                  {
                    "options": [
                      "Late caffeine"
                    ],
                    "body": "Your thief starts work in the afternoon, not in the evening, and Lesson 18 deals with it directly. It’s the cheapest of all these to fix because nothing gets given up."
                  },
                  {
                    "options": [
                      "Nothing in particular, I just drift"
                    ],
                    "body": "Drifting means the evening has nothing to organise itself around, which is a structural problem rather than a discipline one. A fixed lights-out is that structure, and hitting it is the whole assignment."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "lightsout",
                "headline": "What time are the lights going out tonight?",
                "helper": "Pick the one you’d hit, not the impressive one.",
                "options": [
                  "Ten",
                  "Half past ten",
                  "Eleven",
                  "Midnight"
                ],
                "result": "Lights out at {pick}"
              },
              {
                "kind": "collect",
                "title": "Where the fight is",
                "template": "\"Lights out at {pick}. That’s where the one in the morning fight gets won, hours early, while it’s still cheap.\"",
                "fallback": "\"I’ll fix a bedtime this week, because that is where the fight gets won.\"",
                "source": "checks",
                "label": "What came before my slips:",
                "cta": "Save this"
              }
            ],
            "sources": "The sleep-and-self-control link is well established in general neuroscience; the earlier draft's unverifiable citations were dropped, and the gap is now closed with a verified review tying poor sleep habits to weaker self-control and more impulsive decisions (Pilcher et al., 2015; STUDY_BANK.md). Tag preserved.",
            "action": "Set one fixed lights-out time this week and track the nights you hit it.",
            "reflection": "Name your honest current lights-out time, and the one you'll aim for this week. Then notice: on your last few slips, how rested were you? Write what you find."
          },
          {
            "number": 16,
            "heading": "Eat regularly",
            "title": "Eating properly",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "I.C",
            "week": 2,
            "day": 9,
            "order": 15,
            "slug": "eating-properly-16",
            "pages": [
              {
                "kind": "teach",
                "headline": "Hunger can feel like irritability, restlessness, or hopelessness.",
                "body": "When you have not eaten, patience and self-control can drop. The evening may feel worse than it is.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Watch for the thought \"I don’t care any more.\"",
                "body": "Before you believe it, check when you last ate. Hunger may be affecting your mood and judgement.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Food is not a treatment for compulsive behavior.",
                "body": "The claim is only that regular meals can support steadier energy and mood. The theory that sugar directly restores willpower is disputed.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Regular meals may make the evening steadier.",
                "body": "This is ordinary practical advice, not a proven treatment for porn use. The aim is simply to remove hunger as an extra trigger.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Make one small change. Do not start a whole diet.",
                "body": "Pick the single meal you most reliably skip and put it back. Usually that is lunch. Don’t reorganise your eating, because reorganising is the kind of project that lasts nine days and then collapses along with everything attached to it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The fix is so small that people skip it.",
                "body": "Missing lunch can leave you tired and irritable by evening. Eating it is a simple way to remove that disadvantage.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "In the hours before a slip, what had you eaten?",
                "checks": [
                  {
                    "key": "nolunch",
                    "label": "I had skipped lunch",
                    "asIn": "The day got busy and the meal never happened",
                    "short": "skipping lunch"
                  },
                  {
                    "key": "nothing",
                    "label": "Nothing since the morning",
                    "asIn": "Coffee and momentum all day, and then a hollow evening",
                    "short": "eating nothing all day"
                  },
                  {
                    "key": "snacks",
                    "label": "Only snacks",
                    "asIn": "Grazing on things that never add up to a meal",
                    "short": "living on snacks"
                  },
                  {
                    "key": "finefed",
                    "label": "I had eaten properly",
                    "asIn": "My slips don’t seem to track my meals",
                    "short": "eating properly"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "hollow",
                "headline": "What do you notice when you have not eaten?",
                "helper": "Pick the signs that fit you.",
                "options": [
                  "\"I do not care any more\"",
                  "Everything looks bleak",
                  "My patience is gone",
                  "Shaky and restless",
                  "Just empty"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "nolunch",
                    "headline": "Skipping lunch can make the evening harder than it needs to be.",
                    "body": "The fix is so small it feels almost insulting. And that is exactly why it keeps getting skipped year after year. Eat lunch and see whether the evening feels steadier."
                  },
                  {
                    "key": "nothing",
                    "headline": "If you run on coffee and skip food, you may reach the evening tired, hungry, and easier to trigger.",
                    "body": "Eat regularly so you have more energy and patience in the evening. This isn’t an intervention so much as removing an unnecessary disadvantage, and removing unnecessary disadvantages is most of what this part does."
                  },
                  {
                    "key": "snacks",
                    "headline": "Snacks may not give you the same energy as a proper meal.",
                    "body": "Try one real meal in the afternoon and see whether the evening feels different."
                  },
                  {
                    "key": "finefed",
                    "headline": "If your slips don’t track what you have eaten, then cross this tool off with a clear conscience.",
                    "body": "Focus on the other basics in this part. It helps to know which changes do not matter for you."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "\"I do not care any more\""
                    ],
                    "body": "When you catch that thought, check when you last ate. Eat first, then decide whether the thought still feels true."
                  },
                  {
                    "options": [
                      "Everything looks bleak",
                      "Just empty"
                    ],
                    "body": "If everything feels bleak and you have not eaten, eat first. Then check how you feel again."
                  },
                  {
                    "options": [
                      "My patience is gone",
                      "Shaky and restless"
                    ],
                    "body": "A short fuse and shaky hands are the body sending you a direct message. Answer it with food before the urge gets a chance to offer its own answer to the same question."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "plank",
                "headline": "Which eating habit will you try?",
                "helper": "Pick one for this week.",
                "options": [
                  "A real lunch every day",
                  "A set time for dinner",
                  "Something to eat at four",
                  "Food is not my issue"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "Regular meals",
                "template": "\"This week I will eat regularly by doing {pick}. I’ll see whether my evenings feel steadier.\"",
                "fallback": "\"I’ll make my meals regular this week and see whether it changes my evenings.\"",
                "source": "checks",
                "label": "What happens before slips:",
                "cta": "Save this"
              }
            ],
            "sources": "That regular eating supports steadier mood and decision-making is general knowledge (hunger affects mood). The stronger glucose-powers-willpower, or ego-depletion, model is contested among researchers and is deliberately not relied on here; kept at the plausible level.",
            "action": "Log whether you'd eaten in the few hours before each urge this week. Look for the link.",
            "reflection": "Think back to your last two or three slips. How long had it been since you'd eaten or properly rested? Write down what you notice, even a loose pattern is useful."
          },
          {
            "number": 17,
            "heading": "Hydration nudges mood",
            "title": "Drinking enough water",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "I.C",
            "week": 2,
            "day": 10,
            "order": 16,
            "slug": "drinking-enough-water-17",
            "pages": [
              {
                "kind": "teach",
                "headline": "Being slightly dehydrated never announces itself either, which is the theme of this whole section.",
                "body": "You’re just a bit off all day, meaning a little more tired and a notch more irritable than you’d otherwise have been. And you attribute it to the day instead of to the cause.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Mild dehydration can add to other small problems.",
                "body": "On its own, it may not matter much. Combined with poor sleep and missed meals, it can leave you more tired and irritable by evening.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This is basic care, not treatment.",
                "body": "Water does not detox or reset you. It simply helps you avoid unnecessary tiredness and irritability.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "It will never feel as though it’s doing anything, which is the main reason people stop.",
                "body": "That’s what maintenance is like. You don’t notice the days it prevents, only the days it doesn’t, and there are no days it doesn’t because you were doing it. Dull tools still hold. And this is about as dull as they get.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The instruction is a default rather than a target, and the difference matters more than it sounds.",
                "body": "A target is something you have to remember and then check. A default is a bottle that lives on your desk, or a glass with every meal. And it requires no remembering because the water is there. Build the default and stop thinking about it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Test it for one week and accept either result.",
                "body": "Drink enough water and see whether your evenings feel different. If they do not, stop focusing on it. Not every lesson will apply to you.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do your days mostly run on?",
                "checks": [
                  {
                    "key": "coffee",
                    "label": "Mostly coffee",
                    "asIn": "Caffeine does the water's job, at least on paper",
                    "short": "mostly coffee"
                  },
                  {
                    "key": "parched",
                    "label": "Nothing much until I’m parched",
                    "asIn": "By three in the afternoon my eyes are gritty and a headache is starting",
                    "short": "nothing until I am parched"
                  },
                  {
                    "key": "covered",
                    "label": "I usually have a bottle nearby",
                    "asIn": "I have mostly got this one covered",
                    "short": "having it covered"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "drains",
                "headline": "Which of these are open on an ordinary day?",
                "helper": "The small leaks that add up by evening.",
                "options": [
                  "A short night",
                  "Skipped meals",
                  "No shape to the day",
                  "Not drinking enough",
                  "Late caffeine"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "coffee",
                    "headline": "Coffee only does the job on paper, and the paper isn’t where you live.",
                    "body": "A day run on it reaches the evening drier and twitchier than it needed to be. Put a glass of water next to the mug and the problem solves itself without any further attention from you."
                  },
                  {
                    "key": "parched",
                    "headline": "That gritty three o'clock feeling is the leak becoming visible, and by then it has been open for several hours.",
                    "body": "Loading up in the morning works better than patching the afternoon, because by the afternoon the day has already been affected and you’re catching up instead of preventing."
                  },
                  {
                    "key": "covered",
                    "headline": "Bank it and move on, because this lesson is only confirming something you already do.",
                    "body": "Spend your attention on a basic habit that needs work. Confirmation is useful and it’s not where your effort should go."
                  },
                  {
                    "key": "none",
                    "headline": "However your days run, this is about as cheap a thing to test as exists in the whole course.",
                    "body": "Drink properly for a week and give your own verdict on whether the evenings feel different. If they don’t, cross it off. And you’ll have spent a week finding out something true about yourself."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A short night",
                      "Late caffeine"
                    ],
                    "body": "Water can’t fix either of those and it doesn’t need to. All it does is stop a third leak stacking on top of the two you already have, which is a modest job done reliably."
                  },
                  {
                    "options": [
                      "Skipped meals",
                      "No shape to the day"
                    ],
                    "body": "Those two have lessons of their own and they matter more than this one does. This is the cheapest of the lot to close today, so close it and then go and do the harder ones."
                  },
                  {
                    "options": [
                      "Not drinking enough"
                    ],
                    "body": "Named and closed in the same breath. Keep water somewhere you can see it and the leak shuts itself, which is all of the intervention."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "default",
                "headline": "What is the arrangement that needs no thinking?",
                "helper": "Pick one and stop deciding about it.",
                "options": [
                  "A bottle on the desk",
                  "A glass with every meal",
                  "A pint when I get up",
                  "Water is not my tool"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The maintenance",
                "template": "\"{pick}. It will never feel as though it’s doing anything, and that is fine, because I reach the hard hour with a bit more in the tank.\"",
                "fallback": "\"I’ll drink properly through the day this week, and reach the hard hour with a bit more in the tank.\"",
                "source": "checks",
                "label": "How my days run:",
                "cta": "Save this"
              }
            ],
            "sources": "That mild dehydration can nudge mood, energy, and concentration is general health knowledge. No claim is made that hydration affects pornography use directly; kept at the plausible level.",
            "action": "Pick a simple daily water target and track it for the week.",
            "reflection": "Be honest: is dehydration a real background drag for you, or a non-issue? Either answer is fine, write which it is, so you stop spending attention on a tool that isn't yours."
          },
          {
            "number": 18,
            "heading": "Caffeine curfew",
            "title": "A cut-off time for caffeine",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "I.C",
            "week": 2,
            "day": 11,
            "order": 17,
            "slug": "a-cut-off-time-for-caffeine-18",
            "pages": [
              {
                "kind": "teach",
                "headline": "The coffee you had at four in the afternoon is still in the room at eleven at night, and that isn’t a figure of speech.",
                "body": "Caffeine takes five or six hours to half clear your system. That means a substantial fraction of the afternoon cup is still circulating when you’re trying to go to sleep.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Caffeine blocks the signal that makes you feel sleepy.",
                "body": "You may fall asleep at the usual time but get lighter sleep. Eight hours in bed may not leave you feeling as rested as expected.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The link can be easy to miss.",
                "body": "You may still fall asleep, but sleep can be lighter. The next day you may feel tired or irritable without connecting it to the previous afternoon's caffeine.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Follow the chain one more step and it reaches this course.",
                "body": "A thinner night gives you weaker self-control the following evening, for the reasons in Lesson 15. So the four o'clock cup is connected to the nine o'clock decision, through two links that nobody notices at the time.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "What makes this tool unusually attractive is that it takes nothing away from you.",
                "body": "You drink the same coffees, in the same quantity, earlier in the day. There’s no giving up and no substitute involved, which puts it in a small category of changes that cost you nothing at all to make.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "People vary a great deal in how fast they clear caffeine, so treat the cut-off as an experiment, not a rule.",
                "body": "Pick a time, hold it for a week, and judge by how your evenings go, not by how virtuous it felt. If nothing changes, move the cut-off later and try again, or conclude that this isn’t your tool.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is your caffeine pattern, honestly?",
                "checks": [
                  {
                    "key": "midafternoon",
                    "label": "A cup mid-afternoon",
                    "asIn": "The three or four o'clock one that feels harmless",
                    "short": "a mid-afternoon cup"
                  },
                  {
                    "key": "evening",
                    "label": "Sometimes one in the evening",
                    "asIn": "Coffee after dinner, or an espresso for a late deadline",
                    "short": "an evening cup"
                  },
                  {
                    "key": "constant",
                    "label": "Topped up all day",
                    "asIn": "The mug seems to refill itself",
                    "short": "topping up all day"
                  },
                  {
                    "key": "early",
                    "label": "Finished by midday",
                    "asIn": "I already stop drinking it by lunchtime",
                    "short": "stopping by midday"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "cost",
                "headline": "What do the thin nights cost you?",
                "helper": "You have met this chain before, in the sleep lesson.",
                "options": [
                  "Foggy mornings",
                  "A short fuse",
                  "Weaker evenings",
                  "Lighter sleep than the hours suggest",
                  "Hard to tell, worth testing"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "midafternoon",
                    "headline": "That harmless-feeling cup is the one leaving the window open, and it’s harmless in every respect except this one.",
                    "body": "Half of it is still working on you at ten at night. Move it two hours earlier and nothing else about your day has to change at all, which makes it one of the cheapest changes available in this part."
                  },
                  {
                    "key": "evening",
                    "headline": "An evening cup trades the depth of the night for about an hour of alertness, and it’s worth pricing that trade honestly.",
                    "body": "On a night before a day when you’ll need your patience, which is most of them, you’re borrowing at a poor rate. If the deadline requires it then take the trade knowingly, not by habit."
                  },
                  {
                    "key": "constant",
                    "headline": "If you top up all day then the block never lifts at any point, which makes the pattern harder to see.",
                    "body": "Pick any cut-off you like this week, because the fact that a fence exists matters more than exactly where you put it. You can move it later once you know whether it does anything."
                  },
                  {
                    "key": "early",
                    "headline": "This one is already banked and you can leave it alone.",
                    "body": "If your sleep still runs thin despite a midday cut-off, then the answer is somewhere in Lessons 15 and 20 instead. And it’s worth going there instead of tightening a screw that is already tight."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Foggy mornings",
                      "Lighter sleep than the hours suggest"
                    ],
                    "body": "That’s the signature of a thinned night, which is the same hours in bed with less depth in them. A week behind a curfew is the cheapest possible way to test whether that is what is happening to you."
                  },
                  {
                    "options": [
                      "A short fuse",
                      "Weaker evenings"
                    ],
                    "body": "The cost lands exactly where you do your fighting, because a better-slept brain meets the same urge with more in the tank. That’s the whole reason a lesson about coffee is sitting in a course about this."
                  },
                  {
                    "options": [
                      "Hard to tell, worth testing"
                    ],
                    "body": "That’s the right answer and the honest one. Hold a cut-off for a week and let your own evenings deliver the verdict, since your evenings know more about this than any general rule does."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "cutoff",
                "headline": "Which cut-off will you hold for a week?",
                "helper": "People vary a lot, so this is how you find your own number.",
                "options": [
                  "Midday",
                  "Two",
                  "Three",
                  "Five"
                ],
                "result": "Nothing after {pick}"
              },
              {
                "kind": "collect",
                "title": "Your cut-off",
                "template": "\"Nothing after {pick}. Same coffees, a deeper night, and a steadier evening at the end of it.\"",
                "fallback": "\"I’ll hold a cut-off this week and let my own sleep give the verdict.\"",
                "source": "checks",
                "label": "My pattern now:",
                "cta": "Save this"
              }
            ],
            "sources": "That late caffeine can reduce deep, restorative sleep even without delaying sleep onset is general health knowledge. The sleep to self-control link follows Day 12. No pornography-specific claim is made; kept at the plausible level.",
            "action": "Set an afternoon caffeine cut-off time and track the days you keep it.",
            "reflection": "What time is your honest last caffeine right now, and what cut-off will you try this week? After a few nights, note whether your sleep (and your evenings) feel any different."
          }
        ]
      },
      {
        "code": "I.D",
        "title": "Movement and rhythm",
        "description": "Unspent energy, the body clock, and the two things that wreck an evening.",
        "lessons": [
          {
            "number": 19,
            "heading": "Move your body, drain the charge",
            "title": "Spending the energy",
            "tag": "evidence — exercise reduces craving",
            "tagColor": "#375623",
            "sub": "I.D",
            "week": 2,
            "day": 12,
            "order": 18,
            "slug": "spending-the-energy-19",
            "pages": [
              {
                "kind": "teach",
                "headline": "Sitting still all day can leave you restless by evening.",
                "body": "That restless feeling can be mistaken for sexual desire. A short period of movement may reduce it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The evidence is limited and indirect.",
                "body": "One exercise session reduced smokers' cravings by about one point on a ten-point scale for up to fifty minutes (Taylor, Ussher & Faulkner, 2007). This was nicotine research, not porn research, so treat movement as an experiment rather than a proven treatment.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How does the unspent energy show up in you?",
                "checks": [
                  {
                    "key": "wired",
                    "label": "Wired and flat at the same time",
                    "asIn": "There’s a low hum under my skin and nowhere for it to go",
                    "short": "wired and flat"
                  },
                  {
                    "key": "pacing",
                    "label": "Pacing about",
                    "asIn": "I circle the kitchen, open cupboards and shut them again",
                    "short": "pacing about"
                  },
                  {
                    "key": "sitstill",
                    "label": "Unable to settle to anything",
                    "asIn": "I abandon every show, page and app within minutes",
                    "short": "unable to settle"
                  },
                  {
                    "key": "calm",
                    "label": "My urges arrive in a still body",
                    "asIn": "There’s no restlessness in it, just the pull",
                    "short": "arriving calm"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "buildtime",
                "headline": "When does the energy tend to build up?",
                "helper": "Mark whichever hours are true.",
                "options": [
                  "After work",
                  "Mid evening",
                  "Late at night",
                  "Weekend afternoons",
                  "Any day I have sat down since morning"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "wired",
                    "headline": "That wired but flat feeling is the giveaway, because desire doesn’t usually feel like that.",
                    "body": "Porn happens to be the only outlet you have ever practised for it. Dig a second channel and the energy will take it, because energy isn’t fussy about where it goes."
                  },
                  {
                    "key": "pacing",
                    "headline": "The pacing is the dog scratching at the door, and it doesn’t want anything in the cupboard.",
                    "body": "It wants out. Twenty minutes of moving beats a whole evening of circling the kitchen, and it costs you less time than the circling does."
                  },
                  {
                    "key": "sitstill",
                    "headline": "Nothing holds your attention because the body is still full of the day.",
                    "body": "Spend some of it and you’ll find the same show holds you perfectly well. The restlessness was never really about the show."
                  },
                  {
                    "key": "calm",
                    "headline": "If your urges arrive in a still body, then movement is mood support for you, not a main tool.",
                    "body": "Keep it for the general benefits and put your real effort into the lessons about triggers, because that is where your answer will be."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "After work",
                      "Any day I have sat down since morning"
                    ],
                    "body": "Put the movement at the hinge of the day, between work and evening, before the energy has picked its own way out."
                  },
                  {
                    "options": [
                      "Mid evening",
                      "Late at night"
                    ],
                    "body": "Keep the late version small and indoors, because push-ups and a stretch at ten o'clock will happen and a heroic gym plan won’t."
                  },
                  {
                    "options": [
                      "Weekend afternoons"
                    ],
                    "body": "The weekend needs the walk most of all, since long empty hours build up the most charge with the fewest interruptions."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "drain",
                "headline": "What would you do?",
                "helper": "The bar is that you moved, so pick something you’d really do.",
                "options": [
                  "A walk",
                  "Push-ups in my room",
                  "A run",
                  "Stairs, twice, hard",
                  "Twenty minutes of anything"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "Where the energy goes",
                "template": "\"When the restlessness builds, I {pick} first. The dog gets its walk before it starts chewing.\"",
                "fallback": "\"This week the restlessness gets a second channel, small enough that I’d still use it on a bad night.\"",
                "source": "checks",
                "label": "How it shows up:",
                "cta": "Save this"
              }
            ],
            "sources": "A single bout of exercise measurably reduced craving intensity in a systematic review of smoking studies (Taylor, Ussher & Faulkner, 2007): about a one-point drop on a craving scale, lasting up to roughly 50 minutes. That evidence is from nicotine craving, not pornography, and no equivalent porn trial exists; the craving mechanism is shared enough to make the parallel reasonable, not proven. Movement as one of the most-credited coping strategies in recovery forums is an aggregate pattern (NoFap dataset; Fernandez et al., 2021), reported as popularity, not effectiveness.",
            "action": "Schedule three workouts this week, any kind, and log them.",
            "reflection": "Name the time of day your restlessness usually builds, and the one kind of movement you'd do at that hour. Not the ideal one. The one you'd do."
          },
          {
            "number": 20,
            "heading": "Morning light, better night",
            "title": "Getting light in the morning",
            "tag": "plausible — circadian",
            "tagColor": "#0B3C49",
            "sub": "I.D",
            "week": 2,
            "day": 13,
            "order": 19,
            "slug": "getting-light-in-the-morning-20",
            "pages": [
              {
                "kind": "teach",
                "headline": "Your body clock resets on one main signal, which is bright light reaching your eyes early in the day.",
                "body": "If it doesn’t get that signal the clock drifts later, the night runs shallower than it should, and tomorrow's brain meets its urges half fuelled.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Morning light can help later in the day.",
                "body": "Light helps set your body clock. A steadier body clock can improve sleep, and better sleep supports impulse control the next day.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do your mornings usually look like?",
                "checks": [
                  {
                    "key": "curtains",
                    "label": "Curtains shut until late",
                    "asIn": "The room stays dim until half the day has gone",
                    "short": "shut curtains"
                  },
                  {
                    "key": "screenfirst",
                    "label": "Straight onto a screen",
                    "asIn": "The first light my eyes get comes from a phone",
                    "short": "starting on a screen"
                  },
                  {
                    "key": "dark",
                    "label": "Out of the door in the dark",
                    "asIn": "Early shifts, and no daylight until nearly midday",
                    "short": "leaving in the dark"
                  },
                  {
                    "key": "outside",
                    "label": "Outside early already",
                    "asIn": "I’m out and about early most days",
                    "short": "getting out early"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "slot",
                "headline": "Where could light fit into a morning you already have?",
                "helper": "You’re not adding a routine. You’re just adding light to one.",
                "options": [
                  "Curtains open the moment I wake",
                  "Breakfast by the window",
                  "Walking to get the coffee",
                  "Taking the first call outside",
                  "Waiting at the bus stop"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "curtains",
                    "headline": "Open the curtains before you do anything else and the day starts on time.",
                    "body": "The clock can’t hear anything through a room that is being kept at dusk, and that is really all that is going wrong."
                  },
                  {
                    "key": "screenfirst",
                    "headline": "As far as the body clock is concerned, a phone screen is barely light at all.",
                    "body": "Get your eyes outside first and then pick up the screen. It’s the same ten minutes of your morning and it produces a very different night."
                  },
                  {
                    "key": "dark",
                    "headline": "Dark mornings make this harder but they don’t make it impossible.",
                    "body": "Take the light whenever it comes, because late-morning daylight is a great deal better than none at all."
                  },
                  {
                    "key": "outside",
                    "headline": "This is already working for you and you don’t need to change anything.",
                    "body": "Keep it going, and let this lesson be the explanation of something you were doing right by accident."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Curtains open the moment I wake",
                      "Breakfast by the window"
                    ],
                    "body": "The indoor versions cost you nothing and catch most of the signal, so start there and let the habit prove itself before you attempt anything more ambitious."
                  },
                  {
                    "options": [
                      "Walking to get the coffee",
                      "Waiting at the bus stop"
                    ],
                    "body": "Walking for the coffee gets you the movement and the light in a single errand, which makes it two of this part's tools for the price of one."
                  },
                  {
                    "options": [
                      "Taking the first call outside"
                    ],
                    "body": "Borrowed time counts. A call you were going to take anyway, taken in daylight, sneaks the signal into a day that has no room in it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "light",
                "headline": "Which one will you use?",
                "helper": "Fold it into a morning that already exists.",
                "options": [
                  "Curtains open on waking",
                  "Breakfast by the window",
                  "Walk for the coffee",
                  "First call outside"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The morning signal",
                "template": "\"Ten minutes of morning light from {pick}. That’s tonight's sleep, paid for in advance.\"",
                "fallback": "\"I’ll get morning light most days this week, folded into a morning I already have.\"",
                "source": "checks",
                "label": "My mornings now:",
                "cta": "Save this"
              }
            ],
            "sources": "That early daylight helps anchor the circadian clock and supports easier, deeper sleep is general health knowledge. The downstream sleep to self-control link follows Day 12. Kept at the plausible level; no pornography-specific claim is made.",
            "action": "Get ten minutes of daylight within an hour of waking; track the mornings you manage it.",
            "reflection": "What's the easiest way to get morning light into a day you already live, curtains, a window seat, a short walk? Pick the one you won't have to think about."
          },
          {
            "number": 21,
            "heading": "Alcohol lowers the gate",
            "title": "Drink and the evening",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "I.D",
            "week": 2,
            "day": 14,
            "order": 20,
            "slug": "drink-and-the-evening-21",
            "pages": [
              {
                "kind": "teach",
                "headline": "Some slips don’t start with a craving at all. They start with a drink.",
                "body": "Even a few drinks can weaken the judgement that would normally help you stop. That’s most of what people mean when they say a drink loosens them up.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "It also gets you twice, not once.",
                "body": "The gate comes down tonight, and then the broken, shallow sleep sets up a depleted tomorrow, so one drinking night can cast a shadow over two days. Look at your own pattern the way a detective would. That means facts first and no verdict at the end.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When you trace your slips back, what do you find?",
                "checks": [
                  {
                    "key": "startdrink",
                    "label": "A drink at the start",
                    "asIn": "The first domino is usually the glass",
                    "short": "a drink at the start"
                  },
                  {
                    "key": "cluster",
                    "label": "They cluster on drinking nights",
                    "asIn": "The risky nights and the drinking nights turn out to be the same nights",
                    "short": "clustering on drinking nights"
                  },
                  {
                    "key": "morningafter",
                    "label": "The morning after is the risk",
                    "asIn": "Foggy and depleted, with the gate still half down",
                    "short": "the morning after"
                  },
                  {
                    "key": "notmine",
                    "label": "No connection at all",
                    "asIn": "Alcohol doesn’t seem to come into it",
                    "short": "no connection"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "shape",
                "headline": "What does your riskiest drinking night look like?",
                "helper": "Describe the actual scene, not the category.",
                "options": [
                  "Home alone after the pub",
                  "Drinks in, evening empty",
                  "The habitual nightcap",
                  "A proper session at the weekend",
                  "Drinks and then a long scroll"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "startdrink",
                    "headline": "If the glass is the first domino, then that is where the decision lives.",
                    "body": "Guard the choice to pour and the later choice never comes up for a vote at all, which is a much easier thing to do than winning an argument at midnight."
                  },
                  {
                    "key": "cluster",
                    "headline": "A real cluster is some of the most useful information you own about yourself.",
                    "body": "It’s a pattern rather than a verdict, and the fix goes wherever the pattern is, which in your case means the drinking nights specifically instead of every night."
                  },
                  {
                    "key": "morningafter",
                    "headline": "Treat the morning after as a day you have already marked in the diary.",
                    "body": "Set it up the night before, with the phone out of reach and one thing already booked, so that the day runs on rails while your defences are down."
                  },
                  {
                    "key": "notmine",
                    "headline": "A clear log closes the case, and that is worth knowing.",
                    "body": "This lesson doesn’t apply to you, which saves your attention for the tools that do."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Home alone after the pub",
                      "Drinks in, evening empty"
                    ],
                    "body": "Being alone and having had a drink is the back door standing wide open, so make those the lighter nights or the ones you prepare for in advance."
                  },
                  {
                    "options": [
                      "The habitual nightcap"
                    ],
                    "body": "The nightcap trades an hour of ease for the depth of the night and the state of your defences tomorrow. Work out honestly what that hour is costing you."
                  },
                  {
                    "options": [
                      "A proper session at the weekend",
                      "Drinks and then a long scroll"
                    ],
                    "body": "Big nights need the room sorted out before the first glass, because afterwards you’re negotiating with the gate already down."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "move",
                "headline": "What one thing will you change about that night?",
                "helper": "Just the riskiest kind of night, not every night.",
                "options": [
                  "Drink less when I am on my own",
                  "No drink at home for now",
                  "Phone put away before the first glass",
                  "Tell someone about the link"
                ],
                "result": "My change: {pick}"
              },
              {
                "kind": "collect",
                "title": "The pattern",
                "template": "\"The cluster is real for me, so drink first and then slip. What I’m changing: {pick}.\"",
                "fallback": "\"I’ll add a column for alcohol to my log this week and let the pattern speak for itself.\"",
                "source": "checks",
                "label": "What the tracing showed:",
                "cta": "Save this"
              }
            ],
            "sources": "Alcohol's disinhibiting effect and its disruption of deep sleep are general knowledge. Alcohol or substance involvement appears as a relapse-adjacent factor in honest forum accounts, used as an aggregate pattern, not a specific study finding. Kept at the plausible level.",
            "action": "In your log, note whether alcohol was involved before each slip. Look for the cluster.",
            "reflection": "Looking back honestly: do your slips cluster around nights you've been drinking? If they do, write the one adjustment you'd make to your riskiest kind of night."
          },
          {
            "number": 22,
            "heading": "Heavy late meals & sluggish evenings",
            "title": "The sluggish evening",
            "tag": "folklore/observational",
            "tagColor": "#843C3C",
            "sub": "I.D",
            "week": 2,
            "day": 15,
            "order": 21,
            "slug": "the-sluggish-evening-22",
            "pages": [
              {
                "kind": "teach",
                "headline": "There is no evidence that a big dinner directly causes a relapse.",
                "body": "The practical concern is how you feel afterwards: tired, inactive, and on the sofa with your phone. Test whether that situation is a trigger for you.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "What does the damage is the loss of momentum.",
                "body": "Slips often come not from desire but from a flat evening in which the easiest thing wins by default, and the phone in your hand is always the easiest thing available. Keep a little momentum going and the default changes.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What comes before your risky evenings?",
                "checks": [
                  {
                    "key": "bigdinner",
                    "label": "A big late dinner",
                    "asIn": "Eaten after nine, heavy, and then horizontal",
                    "short": "a big late dinner"
                  },
                  {
                    "key": "dinnerdrinks",
                    "label": "Dinner and drinks together",
                    "asIn": "Full and loosened up at the same time",
                    "short": "dinner and drinks"
                  },
                  {
                    "key": "sunk",
                    "label": "Sinking into the sofa",
                    "asIn": "No plan to get up again that night",
                    "short": "sinking into the sofa"
                  },
                  {
                    "key": "notshape",
                    "label": "Something else",
                    "asIn": "My evenings don’t really look like that",
                    "short": "something else"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "ingredients",
                "headline": "What is usually in the mix?",
                "helper": "The ingredients of your own sluggish evening.",
                "options": [
                  "Eating after nine",
                  "The sofa by default",
                  "The phone already in my hand",
                  "No plan to move again",
                  "A drink alongside it"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "bigdinner",
                    "headline": "Test the narrow question instead of believing the theory.",
                    "body": "On a night you know is risky, does eating a bit lighter and a bit earlier leave you with enough momentum to walk past the urge? A week of trying it will tell you more than any argument will."
                  },
                  {
                    "key": "dinnerdrinks",
                    "headline": "Full and loosened at the same time is a bad combination, because it gives you the dropped gate and the fog in one evening.",
                    "body": "Split them up on the risky nights and see what changes, which is a smaller sacrifice than giving up either one."
                  },
                  {
                    "key": "sunk",
                    "headline": "The sofa state is the risk, whatever route you took into it.",
                    "body": "One small plan for after dinner, even just a walk or a phone call, keeps the evening's spine intact and that turns out to matter more than the food did."
                  },
                  {
                    "key": "notshape",
                    "headline": "Skip this one without a second thought.",
                    "body": "Lessons like this earn their place person by person, and this one isn’t yours."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Eating after nine",
                      "A drink alongside it"
                    ],
                    "body": "Move one of those earlier or lighter, on test nights only. This is an experiment and nobody is taking your dinner away permanently."
                  },
                  {
                    "options": [
                      "The sofa by default",
                      "The phone already in my hand"
                    ],
                    "body": "Change where you sit before you change what you eat, because the sofa and the phone together do more of the damage than the meal does."
                  },
                  {
                    "options": [
                      "No plan to move again"
                    ],
                    "body": "That’s the ingredient that matters most of all. One small plan for after dinner, kept, is the whole counter-move."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "night",
                "headline": "Which night will you experiment on?",
                "helper": "Pick the one where the sunk evening happens most.",
                "options": [
                  "Friday",
                  "Saturday",
                  "Sunday",
                  "A weeknight"
                ],
                "result": "Testing: {pick}"
              },
              {
                "kind": "collect",
                "title": "The experiment",
                "template": "\"Lighter and earlier on {pick} nights, and then a verdict. My own results outrank anybody's theory.\"",
                "fallback": "\"I’ll run the sunk-evening test this week, and my own results will outrank anybody's theory.\"",
                "source": "checks",
                "label": "What comes before:",
                "cta": "Save this"
              }
            ],
            "sources": "No controlled evidence links meal size or timing to pornography relapse; labelled folklore/observational. The underlying point, that low-momentum, passive evenings are high-risk, aligns with the boredom and unstructured-time trigger in the evidence base (Part B) and Day 16, and with the forum dataset's sluggish-evening texture, used as an aggregate pattern.",
            "action": "On a couple of risk nights, try a lighter, earlier dinner and note whether the evening goes differently.",
            "reflection": "Is the \"full, sluggish, sunk-in-the-sofa\" evening a real risk state for you? If yes, name the night of the week it most often happens. That's the one to experiment on."
          }
        ]
      },
      {
        "code": "I.E",
        "title": "Boredom and stimulation",
        "description": "There are two kinds of boredom here and they need two different answers.",
        "lessons": [
          {
            "number": 23,
            "heading": "Boredom is the real enemy",
            "title": "Boredom as the trigger",
            "tag": "evidence — boredom trigger",
            "tagColor": "#375623",
            "sub": "I.E",
            "week": 2,
            "day": 16,
            "order": 22,
            "slug": "boredom-as-the-trigger-23",
            "pages": [
              {
                "kind": "teach",
                "headline": "Your real trigger might not be lust at all, and for a lot of men it’s not.",
                "body": "It’s boredom. That means a flat empty stretch of time with porn sitting there as the fastest way of making it disappear. If that is your pattern, then every lesson about managing desire has been aimed at a target that isn’t there.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The good news is that a boredom problem is much easier to solve than a desire problem.",
                "body": "Do not wait until you are bored to choose an alternative. Write down five things you can start within one minute and keep the list nearby.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where do your urges tend to land?",
                "checks": [
                  {
                    "key": "afternoon",
                    "label": "The aimless afternoon",
                    "asIn": "Hours with nothing pulling me in any direction",
                    "short": "the aimless afternoon"
                  },
                  {
                    "key": "afterwork",
                    "label": "The restless hour after work",
                    "asIn": "I have finished for the day and nothing has taken over",
                    "short": "the hour after work"
                  },
                  {
                    "key": "nothingon",
                    "label": "An evening with nothing on",
                    "asIn": "Flat time with the phone already in my hand",
                    "short": "an empty evening"
                  },
                  {
                    "key": "desire",
                    "label": "It really is desire",
                    "asIn": "For me it’s not emptiness, it’s wanting",
                    "short": "actual desire"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "menu",
                "headline": "What could go on the menu?",
                "helper": "It has to be startable within a minute, so no projects.",
                "options": [
                  "The book on the bedside table",
                  "A particular walk I know",
                  "A friend I could text",
                  "Something made with my hands",
                  "A job with a clear end to it",
                  "A game that needs both hands"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "afternoon",
                    "headline": "An aimless afternoon is hours of pull with nothing else on offer.",
                    "body": "The menu's job is to make sure something else is on offer before those hours start, because you’ll not be able to invent one once they have."
                  },
                  {
                    "key": "afterwork",
                    "headline": "The restless hour after work is the most predictable trigger you own, and predictable is good.",
                    "body": "Attach the first thing on your menu to it, at the same time every day, until the hour has a new default and stops asking you to decide."
                  },
                  {
                    "key": "nothingon",
                    "headline": "\"Nothing on\" is the urge's favourite kind of evening, because it wins without competing.",
                    "body": "Five named alternatives turn the empty evening into a choice between real options, which is a completely different position to be in."
                  },
                  {
                    "key": "desire",
                    "headline": "If it really is desire, then the boredom menu is a side tool for you.",
                    "body": "The urge-skill lessons in Part III are the ones that carry your load, and it’s worth going to them first."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The book on the bedside table",
                      "A particular walk I know"
                    ],
                    "body": "Physical and instant is the backbone of a good menu, because there’s no setting up and no screen, and you can be underway inside a minute."
                  },
                  {
                    "options": [
                      "A friend I could text",
                      "A game that needs both hands"
                    ],
                    "body": "Contact and occupied hands both beat dead time, and neither of them leaves a hand free for the phone."
                  },
                  {
                    "options": [
                      "Something made with my hands",
                      "A job with a clear end to it"
                    ],
                    "body": "Things that finish give the hour a shape and a small win at the end of it, and boredom feeds on shapelessness more than on anything else."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "first",
                "headline": "What goes at the top of the menu?",
                "helper": "The one you’d reach for first.",
                "options": [
                  "The book",
                  "The walk",
                  "Texting a friend",
                  "Making something"
                ],
                "result": "First on the list: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your menu",
                "template": "\"Boredom is my trigger and boredom can be solved. Five named things, with {pick} at the top, all of which I could start in a minute.\"",
                "fallback": "\"I’ll write the five-item menu this week, before I need it, while I can still be bothered.\"",
                "source": "checks",
                "label": "Where the urges land:",
                "cta": "Save this"
              }
            ],
            "sources": "Boredom as one of the most commonly reported triggers, an internal state porn is used to escape, is from the evidence base, Part B1(b), and the forum dataset. Pre-loaded alternatives apply if-then planning (Day 36) and the replace-don't-just-remove logic (Day 52).",
            "action": "Write an \"if bored, then ___\" menu of five ready alternatives. Keep it visible.",
            "reflection": "Be honest: how much of your use is really boredom rather than desire? If it's a lot, write your five-item boredom menu now, specific things you'd start in sixty seconds."
          },
          {
            "number": 24,
            "heading": "Embrace the bored minute",
            "title": "Letting a minute be dull",
            "tag": "plausible — stimulation diet",
            "tagColor": "#0B3C49",
            "sub": "I.E",
            "week": 2,
            "day": 17,
            "order": 23,
            "slug": "letting-a-minute-be-dull-24",
            "pages": [
              {
                "kind": "teach",
                "headline": "The last lesson was about filling the risky hours, and this one is the opposite, so hold both.",
                "body": "Not every bored minute needs filling. If you feed every single one with something quick, then everything quiet stays grey by comparison, and the only way that changes is if some minutes go unfed.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Lower the amount of stimulation you take in and the dull things slowly start to brighten again.",
                "body": "Lesson 25 explains why that happens and what the limits of the idea are. This is the everyday version of it, which is meeting a bored minute with a walk, or something made by hand, or a window, or with nothing at all.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happens to your bored minutes at the moment?",
                "checks": [
                  {
                    "key": "phonesecond",
                    "label": "The phone, within a second",
                    "asIn": "My hand moves before the gap has even opened",
                    "short": "the phone straight away"
                  },
                  {
                    "key": "feedqueue",
                    "label": "One app after another",
                    "asIn": "I close one and the next is already opening",
                    "short": "one app after another"
                  },
                  {
                    "key": "snackstabs",
                    "label": "Something in my mouth or on the screen",
                    "asIn": "There’s always something being topped up",
                    "short": "topping up constantly"
                  },
                  {
                    "key": "leftalone",
                    "label": "Some of them go unfed",
                    "asIn": "A few minutes already pass without me filling them",
                    "short": "leaving some unfed"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "natural",
                "headline": "What would you do with an unfed minute?",
                "helper": "Slower answers, and real ones.",
                "options": [
                  "A walk with no phone",
                  "Making something with my hands",
                  "Just sitting with it for a minute",
                  "A window and a coffee",
                  "A page of something on paper"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "phonesecond",
                    "headline": "A hand that moves in under a second isn’t choosing anything, because there was no time in which to choose.",
                    "body": "Park the phone one room away for an hour a day and the bored minute gets to exist at all, which is the first requirement for doing anything else with it."
                  },
                  {
                    "key": "feedqueue",
                    "headline": "If one app opens as the last one closes, then no minute ever finishes.",
                    "body": "Close one without opening the next, once a day, and see what the gap really costs you. It’s usually a matter of seconds."
                  },
                  {
                    "key": "snackstabs",
                    "headline": "Topping up constantly keeps the baseline pinned high. That’s why nothing quiet seems worth doing.",
                    "body": "One unfed stretch a day, however short, is the dose that starts to bring it down."
                  },
                  {
                    "key": "leftalone",
                    "headline": "You have already had a taste of what this does.",
                    "body": "Make the unfed minutes deliberate instead of accidental, and let them multiply from there."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A walk with no phone",
                      "A window and a coffee"
                    ],
                    "body": "Those are half boredom anyway, which is the point of them. They’re quiet enough for the baseline to drift down while the minute still passes pleasantly."
                  },
                  {
                    "options": [
                      "Making something with my hands",
                      "A page of something on paper"
                    ],
                    "body": "Hands and paper are boredom's oldest answers, and they’re engaged enough to hold you while staying quiet enough to count."
                  },
                  {
                    "options": [
                      "Just sitting with it for a minute"
                    ],
                    "body": "The straight version works best of all, because sixty seconds of nothing teaches your system that the alarm it was sounding was false."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "dose",
                "headline": "What will you start with?",
                "helper": "Small, daily, and kept.",
                "options": [
                  "Sixty unfed seconds a day",
                  "One walk a day with no phone",
                  "One quiet evening this week"
                ],
                "result": "Starting with: {pick}"
              },
              {
                "kind": "collect",
                "title": "The quiet diet",
                "template": "\"Bored minutes are allowed to exist now, so {pick}. Fed less often, the quiet things get their colour back.\"",
                "fallback": "\"I’ll let three bored minutes go unfed today and watch what my hand reaches for.\"",
                "source": "checks",
                "label": "Where the minutes go now:",
                "cta": "Save this"
              }
            ],
            "sources": "The baseline logic rests on the opponent-process/pleasure-pain framing already in STUDY_BANK.md (Lembke; Koob & Le Moal) and on habituation as standard learning science; no claim is made that boredom-tolerance is a tested treatment. Boredom as a top reported trigger is evidence base Part B1(b): the risky empty hours still get filled (Lesson 23); this lesson works the baseline, a different timescale.",
            "action": "Leave three bored minutes unfed today: no screen, no snack. Note what your hand reaches for, and what happens if you don't follow it.",
            "reflection": "After a few unfed minutes, write what you noticed: how loud the first ten seconds were, and what the minute was like once the reaching passed. That difference is the diet starting to work."
          },
          {
            "number": 25,
            "heading": "The dopamine reframe — handle with care",
            "title": "What is true about dopamine",
            "tag": "contested / folklore — included, labelled",
            "tagColor": "#843C3C",
            "sub": "I.E",
            "week": 2,
            "day": 18,
            "order": 24,
            "slug": "what-is-true-about-dopamine-25",
            "pages": [
              {
                "kind": "teach",
                "headline": "Claims about \"fried receptors\" and fixed ninety-day resets are not supported by neuroscience.",
                "body": "People can feel flat after reducing intense stimulation, but there is no universal damage-and-recovery timeline.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A grain of truth does survive the debunking, though.",
                "body": "A brain that is used to intense stimulation on demand can find ordinary life flat for a while, which is closer to a see-saw than to damage, and see-saws come back level. The useful experiment survives too, which is to spend one day quiet and see what happens.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which of these have you picked up along the way?",
                "checks": [
                  {
                    "key": "fried",
                    "label": "Fried receptors",
                    "asIn": "Damage language, with nothing much behind it",
                    "short": "fried receptors"
                  },
                  {
                    "key": "ninety",
                    "label": "The ninety-day reset",
                    "asIn": "Healing on a schedule that somebody invented",
                    "short": "the ninety-day reset"
                  },
                  {
                    "key": "damaged",
                    "label": "That I have damaged my brain",
                    "asIn": "Permanent harm, asserted without evidence",
                    "short": "damaging my brain"
                  },
                  {
                    "key": "flatness",
                    "label": "Only that things went flat",
                    "asIn": "Ordinary things did dull for a while, which is the fair part",
                    "short": "things going flat"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "lowstim",
                "headline": "What could a low-stimulation day contain?",
                "helper": "Quieter and slower, on purpose, for one day.",
                "options": [
                  "No feeds at all",
                  "A long walk",
                  "A book, on paper",
                  "One real conversation",
                  "Cooking something slowly",
                  "Nothing scheduled"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "fried",
                    "headline": "Nothing got fried and nothing broke, and that is worth knowing properly rather than half believing.",
                    "body": "The flatness is ordinary habituation doing what habituation does, and it eases the same way it arrived, by comparison and over time."
                  },
                  {
                    "key": "ninety",
                    "headline": "No schedule governs you, and anyone who gives you one is guessing.",
                    "body": "When the quiet pleasures get their colour back varies by person and by week, and a printed timeline mostly manufactures dread as day eighty-nine approaches."
                  },
                  {
                    "key": "damaged",
                    "headline": "The damage story runs on fear, and fear feeds the loop this app is trying to interrupt.",
                    "body": "Even the imaging study behind the headlines was correlational, and its own authors said that a predisposition explains their results just as well as harm does (Kühn & Gallinat, 2014)."
                  },
                  {
                    "key": "flatness",
                    "headline": "You have kept exactly the right part and thrown away the rest.",
                    "body": "The experience is real. It was only the mechanism story and the timetable that were decoration."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "No feeds at all",
                      "Nothing scheduled"
                    ],
                    "body": "The subtraction is the experiment. One day in which nothing bids for your attention at industrial volume is enough to notice a difference."
                  },
                  {
                    "options": [
                      "A long walk",
                      "A book, on paper",
                      "Cooking something slowly"
                    ],
                    "body": "Those quiet activities are your measuring stick, so notice whether they carry any more colour by the evening than they did in the morning."
                  },
                  {
                    "options": [
                      "One real conversation"
                    ],
                    "body": "Conversation is the one thing no feed can match, because it’s slow and real and it answers back properly."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "story",
                "headline": "What will you call the experiment?",
                "helper": "Same action either way. The label just needs to be honest.",
                "options": [
                  "\"Getting used to less stimulation\"",
                  "\"Letting quiet things get their colour back\"",
                  "I will skip this one"
                ],
                "result": "I'll call it: {pick}"
              },
              {
                "kind": "collect",
                "title": "The experiment",
                "template": "\"One low-stimulation day, run under an honest label, which for me is {pick}. The useful part without the mythology.\"",
                "fallback": "\"I’ll run one low-stimulation day this week and compare the quiet pleasures before and after.\"",
                "source": "checks",
                "label": "What I had picked up:",
                "cta": "Save this"
              }
            ],
            "sources": "The evidence base is explicit that \"dopamine detox\" and fixed reset timelines are popularisation, not findings, while the pleasure-pain (opponent-process) framing has a grain of grounding (Part A3; Lembke). Kept clearly labelled contested/folklore; the usable action (a low-stimulation day) is offered with an accurate story. Added: the headline imaging study, named with its correlational caveat (Kühn & Gallinat, 2014).",
            "action": "Try one deliberately low-stimulation day as an experiment in resetting your baseline. Note the effect.",
            "reflection": "Try a deliberately low-stimulation day. Afterwards, note honestly whether quieter pleasures (a walk, a book, a conversation) felt any richer, framed as \"resetting my baseline,\" not \"healing receptors.\""
          },
          {
            "number": 26,
            "heading": "Semen retention & \"superpowers\"",
            "title": "Retention, honestly",
            "tag": "folklore — flagged",
            "tagColor": "#843C3C",
            "sub": "I.E",
            "week": 2,
            "day": 19,
            "order": 25,
            "slug": "retention-honestly-26",
            "pages": [
              {
                "kind": "teach",
                "headline": "The physical claims fall apart as soon as you check them.",
                "body": "The testosterone study that people pass around was formally retracted. That means it has been withdrawn from the record and can’t be used as evidence for anything, and no solid evidence backs the superpowers version.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So why is it in the course at all? Because motivation is real even when the mechanism isn’t.",
                "body": "If the framing fires you up then that is yours to use. But most of the benefits people report, which are energy and drive and confidence, are better explained by everything else they changed at the same time, meaning sleep, exercise, people and purpose.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where do you stand on it?",
                "checks": [
                  {
                    "key": "motivates",
                    "label": "It motivates me",
                    "asIn": "The framing does fire me up",
                    "short": "being motivated by it"
                  },
                  {
                    "key": "believed",
                    "label": "I believed the superpowers",
                    "asIn": "The mythology reached me before the evidence did",
                    "short": "believing the superpowers"
                  },
                  {
                    "key": "toughness",
                    "label": "It became a test of toughness",
                    "asIn": "It turned into another thing to pass or fail at",
                    "short": "turning it into a test"
                  },
                  {
                    "key": "notmything",
                    "label": "It does nothing for me",
                    "asIn": "The whole frame can stay on the shelf",
                    "short": "not being interested"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "alongside",
                "headline": "What else changed at the same time?",
                "helper": "This is where the real benefits usually come from.",
                "options": [
                  "Sleep",
                  "Exercise",
                  "Getting out of the house more",
                  "Seeing more people",
                  "All the other tools in this app"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "motivates",
                    "headline": "Use it with your eyes open, which is a perfectly reasonable thing to do.",
                    "body": "Let it inspire you, but don’t bank on the mechanism and don’t expect anything to arrive by a particular date, because nothing has been shown to."
                  },
                  {
                    "key": "believed",
                    "headline": "A retracted study stays retracted, and that matters more than people realise.",
                    "body": "What you felt was real enough. It was only the explanation that was borrowed, and swapping the explanation doesn’t take the feeling away."
                  },
                  {
                    "key": "toughness",
                    "headline": "A test of toughness brings back the pass-or-fail shame that this whole programme exists to remove.",
                    "body": "If the frame has started grading you, then drop the frame, because the grading will cost you more than the motivation gains you."
                  },
                  {
                    "key": "notmything",
                    "headline": "Leave it on the shelf without a second thought.",
                    "body": "No frame is compulsory here, and least of all one with no evidence behind it."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Sleep",
                      "Exercise"
                    ],
                    "body": "The energy people credit to retention usually belongs to sleep and training, and the boring explanations keep turning out to be the true ones."
                  },
                  {
                    "options": [
                      "Getting out of the house more",
                      "Seeing more people",
                      "All the other tools in this app"
                    ],
                    "body": "Confidence tracks a life filling up. The frame takes the credit, but the connection and the structure did the work."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "frame",
                "headline": "How will you hold it?",
                "helper": "Track what happens without assuming why.",
                "options": [
                  "Use the motivation, ignore the mechanism",
                  "Track it and credit things carefully",
                  "Drop the frame entirely"
                ],
                "result": "My view: {pick}"
              },
              {
                "kind": "collect",
                "title": "Where the credit goes",
                "template": "\"Whatever I feel gets credited where it’s earned, which is to {grid}. My view of the frame: {pick}.\"",
                "fallback": "\"Whatever I feel this month gets credited honestly, with the boring explanations first.\"",
                "source": "checks",
                "label": "Where I stood:",
                "cta": "Save this"
              }
            ],
            "sources": "The evidence base is explicit that the \"superpowers\"/testosterone claims are unsupported and that the key ejaculation-testosterone paper was retracted (2021); the \"no special physiological benefit\" point is directly sourced (Part A3, reference list). Kept clearly labelled folklore; motivation acknowledged as real, mechanism as not.",
            "action": "If this framing motivates you, track honestly how you feel, without assuming the mechanism.",
            "reflection": "If the retention framing motivates you, use it, but list what *else* you changed alongside it (sleep, exercise, connection). That's likely where the real benefits are coming from."
          }
        ]
      },
      {
        "code": "I.F",
        "title": "What it delivers",
        "description": "Looking at what the wanting really pays out, before it makes its next offer.",
        "lessons": [
          {
            "number": 27,
            "heading": "EasyPeasy: there's nothing to give up",
            "title": "Nothing to give up",
            "tag": "folklore — useful reframe",
            "tagColor": "#843C3C",
            "sub": "I.F",
            "week": 2,
            "day": 20,
            "order": 26,
            "slug": "nothing-to-give-up-27",
            "pages": [
              {
                "kind": "teach",
                "headline": "One way to reduce desire is to question what the behavior really gives you.",
                "body": "This idea comes from Allen Carr's reframing method. It has no controlled evidence behind it, so treat it as a thought experiment, not a fact.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Think honestly about what it pays you, because mostly what it pays is the end of the craving.",
                "body": "That’s the relief of an itch finally being scratched, and the habit is what planted the itch in the first place. So what you’d be giving up is the privilege of scratching a bite that only itches because you keep scratching it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does it promise you beforehand?",
                "checks": [
                  {
                    "key": "relief",
                    "label": "Enormous relief",
                    "asIn": "That everything will ease off once I have",
                    "short": "enormous relief"
                  },
                  {
                    "key": "escape",
                    "label": "A way out",
                    "asIn": "Out of the day, or the feeling, or the hour",
                    "short": "a way out"
                  },
                  {
                    "key": "wanted",
                    "label": "The feeling of being wanted",
                    "asIn": "A stand-in for being wanted by an actual person",
                    "short": "feeling wanted"
                  },
                  {
                    "key": "quiet",
                    "label": "Just quiet",
                    "asIn": "The itch stopping, and nothing more than that",
                    "short": "quiet"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "leaves",
                "headline": "And what does it leave you with?",
                "helper": "What gets delivered, as opposed to what was advertised.",
                "options": [
                  "A bit emptier than before",
                  "Time gone",
                  "The next craving, already planted",
                  "Flat, with nothing relieved",
                  "Some real pleasure, on some nights"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "relief",
                    "headline": "Hold the relief it promised up against the flatness it delivered.",
                    "body": "The gap between those two things is the whole lesson, and the urge is relying on you never measuring it. Measure it once, in writing, and it becomes much harder to unsee."
                  },
                  {
                    "key": "escape",
                    "headline": "The escape lasts a few minutes and the day is still there when you get back, with the fog on top of it.",
                    "body": "An exit that returns you to a slightly worse version of the room you left isn’t really an exit at all."
                  },
                  {
                    "key": "wanted",
                    "headline": "Being wanted is the deepest promise it makes and the emptiest thing it delivers.",
                    "body": "A screen can’t want you back, no matter how convincing it is. The real version of that is what Part VI is for."
                  },
                  {
                    "key": "quiet",
                    "headline": "If quiet is all it delivers, then ask who planted the noise.",
                    "body": "The habit relieves a discomfort that the habit itself manufactures, which is the structure of a protection racket, not a service."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A bit emptier than before",
                      "Flat, with nothing relieved",
                      "Time gone"
                    ],
                    "body": "Read your own ledger back to yourself. The glass was never full of anything, and turning it down opens a door instead of closing one."
                  },
                  {
                    "options": [
                      "The next craving, already planted"
                    ],
                    "body": "The guaranteed next craving is the giveaway, because real pleasures don’t send you an invoice for the following evening."
                  },
                  {
                    "options": [
                      "Some real pleasure, on some nights"
                    ],
                    "body": "Skip the absolute version of the reframe, because you don’t need it. The gap between what is promised and what is delivered does all the work on its own."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "verdict",
                "headline": "Does the bleach picture fit you?",
                "helper": "There’s no prize for forcing a frame that doesn’t.",
                "options": [
                  "It clicks, and I will use it",
                  "Partly, in that the gap is real",
                  "It feels false, and I will leave it"
                ],
                "result": "My verdict: {pick}"
              },
              {
                "kind": "collect",
                "title": "The gap",
                "template": "\"It promises me {checks} and it leaves me {grid}. My verdict on the reframe: {pick}.\"",
                "fallback": "\"At the next urge I’ll write down what was promised and what arrived.\"",
                "source": "checks",
                "label": "What it promises:",
                "cta": "Save this"
              }
            ],
            "sources": "Allen Carr's Easy Way method, and the EasyPeasy porn adaptation, has no controlled outcome evidence and is kept clearly labelled folklore. The underlying move, loosening a craving by noticing the gap between what it promises and what it delivers, is consistent with ACT defusion (Crosby & Twohig, 2016). No shame or all-or-nothing mechanic is imported.",
            "action": "At each urge, name what porn delivers versus what it promised. Log the gap.",
            "reflection": "In your own words, finish this: what it promises me beforehand is ______; what it leaves me with afterwards is ______. Read it back next time the promise gets loud."
          },
          {
            "number": 28,
            "heading": "Drop the willpower model",
            "title": "Why willpower runs out",
            "tag": "reframe / folklore",
            "tagColor": "#843C3C",
            "sub": "I.F",
            "week": 2,
            "day": 21,
            "order": 27,
            "slug": "why-willpower-runs-out-28",
            "pages": [
              {
                "kind": "teach",
                "headline": "Hold your arm straight out in front of you and wait.",
                "body": "At first it’s nothing at all, a few minutes later it’s agony, and eventually the arm comes down without you having decided anything. Willpower used as pure restraint is that arm, and if it’s your whole method then the ending was written before you started.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "That means you weren’t weak. The tool was.",
                "body": "People fight hard, lose anyway, and then blame their character for an outcome the method guaranteed. This is a reframe, not a trial result. But it earns its place because freedom doesn’t run on a clock and restraint does.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does saying no usually feel like?",
                "checks": [
                  {
                    "key": "strain",
                    "label": "Like holding something up",
                    "asIn": "There’s effort in it, and a timer running somewhere",
                    "short": "holding something up"
                  },
                  {
                    "key": "clock",
                    "label": "Like a clock I can hear",
                    "asIn": "The question is how long I can keep this up",
                    "short": "hearing a clock"
                  },
                  {
                    "key": "caving",
                    "label": "Like holding a door shut",
                    "asIn": "I’m one weak moment away from giving in",
                    "short": "holding a door shut"
                  },
                  {
                    "key": "free",
                    "label": "Like walking away from something useless",
                    "asIn": "Some days there’s nothing to fight, and I just don’t want it",
                    "short": "walking away"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "sentence",
                "headline": "Which sentence sits underneath your no?",
                "helper": "The frame you’re using in the moment.",
                "options": [
                  "\"I am depriving myself\"",
                  "\"I am not allowed\"",
                  "\"I am being good tonight\"",
                  "\"I am free of it\""
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "strain",
                    "headline": "The strain is the model, and the model is what needs replacing.",
                    "body": "Picture two men turning down the same slice of cake, where one of them still wants it and the other doesn’t. Only the first one is suffering, and the reframe works on the wanting, not on the resisting."
                  },
                  {
                    "key": "clock",
                    "headline": "A no with a clock inside it will ring eventually, because that is what clocks do.",
                    "body": "The move is to get rid of the wanting, and the timer goes with it. Nothing else you do will stop the clock while the wanting is intact."
                  },
                  {
                    "key": "caving",
                    "headline": "Holding a door shut is exhausting because the pull on the other side is still there.",
                    "body": "Once you see that there’s nothing behind the door worth having, the holding stops on its own and you don’t have to be strong about it."
                  },
                  {
                    "key": "free",
                    "headline": "You have already stood in the free man's shoes, at least sometimes.",
                    "body": "The work now is getting back there on the loud nights, and the bleach picture from Lesson 27 is the way back."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "\"I am depriving myself\"",
                      "\"I am not allowed\""
                    ],
                    "body": "Both of those treat the thing as a treat being withheld from you. Write \"I’m freeing myself from something useless\" once, in your own handwriting, and see how differently it sits."
                  },
                  {
                    "options": [
                      "\"I am being good tonight\""
                    ],
                    "body": "Being good implies a treat refused and credit earned, which keeps the treat valuable. Freedom doesn’t need the credit and doesn’t miss it."
                  },
                  {
                    "options": [
                      "\"I am free of it\""
                    ],
                    "body": "That’s the sentence with no clock in it, so keep it somewhere the loud nights can find it easily."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "rewrite",
                "headline": "Which sentence will you carry?",
                "helper": "Same moment, different sentence.",
                "options": [
                  "\"I am freeing myself from something useless\"",
                  "\"There is nothing in the glass\"",
                  "\"No wanting, so no fight\"",
                  "\"It is a trap, not a treat\""
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The new sentence",
                "template": "\"{pick}. That’s a cage door opening rather than a treat going back on the shelf.\"",
                "fallback": "\"The next time I catch myself thinking I’m depriving myself, I’ll rewrite it in my own words.\"",
                "source": "checks",
                "label": "How my no has felt:",
                "cta": "Save this"
              }
            ],
            "sources": "Carr's anti-willpower claim is a reframe with no controlled evidence, kept as folklore. It dovetails with the evidence base's central warning that shame-based, white-knuckle approaches tend to backfire (Part B3), and with ACT's move away from suppression toward acceptance and values (Day 2).",
            "action": "Catch one \"I'm depriving myself\" thought and rewrite it as \"I'm freeing myself.\"",
            "reflection": "Notice your own framing today: when you say no, does it feel like restraint (holding back from a treat) or freedom (walking from a trap)? Write which, and whether the freedom version is available to you."
          },
          {
            "number": 29,
            "heading": "Surf the chaser",
            "title": "The craving that comes after",
            "tag": "observational — forum",
            "tagColor": "#0B3C49",
            "sub": "I.F",
            "week": 2,
            "day": 22,
            "order": 28,
            "slug": "the-craving-that-comes-after-29",
            "pages": [
              {
                "kind": "teach",
                "headline": "For a lot of men the craving spikes after release instead of before it, which is the opposite of what you’d expect.",
                "body": "Recovery communities call it the chaser effect. Running backwards like that is exactly what makes it dangerous, because it arrives at the one moment your guard is down.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The spike itself is only a wave. What causes the damage is the story you tell about it.",
                "body": "If you think there must be something wrong with you, that breeds panic and shame, which is the fuel a relapse runs on. Named in advance, it’s just a wave arriving at an odd time, and waves can be sat out.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What have you noticed after release?",
                "checks": [
                  {
                    "key": "spike",
                    "label": "A spike instead of calm",
                    "asIn": "I want more, only minutes afterwards",
                    "short": "a spike instead of calm"
                  },
                  {
                    "key": "withinhour",
                    "label": "The pull comes straight back",
                    "asIn": "It returns within the hour",
                    "short": "the pull coming straight back"
                  },
                  {
                    "key": "panic",
                    "label": "Panic about wanting it",
                    "asIn": "I start wondering whether something is broken",
                    "short": "panicking about it"
                  },
                  {
                    "key": "nochaser",
                    "label": "Nothing like that",
                    "asIn": "It hasn’t happened to me",
                    "short": "not having it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "story",
                "headline": "What story have you told yourself about it?",
                "helper": "How you read the spike at the time.",
                "options": [
                  "Something is wrong with me",
                  "It did not work, so I need more",
                  "I am worse off than I thought",
                  "Just a wave at an odd time"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "spike",
                    "headline": "Your curve spikes where you expected it to drop, and that is a known pattern, not a malfunction.",
                    "body": "Met with \"ah, there it is, right on time\", it loses most of its power immediately, because most of its power was in the surprise."
                  },
                  {
                    "key": "withinhour",
                    "headline": "The quick return is the chaser's signature, and it’s common enough to plan for.",
                    "body": "Treat the hour after release as a risky window like any other. That means the phone somewhere else and something unremarkable to do."
                  },
                  {
                    "key": "panic",
                    "headline": "The panic is the only dangerous part, and it dies the moment you can name what is happening.",
                    "body": "You were warned this might come, so nothing has gone wrong, and the wave will pass whether or not you understand it."
                  },
                  {
                    "key": "nochaser",
                    "headline": "A clear sky still benefits from a forecast.",
                    "body": "If it ever turns up, you’ll be greeting something you have a name for not something that frightens you."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Something is wrong with me",
                      "I am worse off than I thought"
                    ],
                    "body": "Those stories are where a relapse gets set up. Replace them with the boring truth, which is that this is a temporary spike some people get and it passes."
                  },
                  {
                    "options": [
                      "It did not work, so I need more"
                    ],
                    "body": "\"I need more\" is the wave talking at its highest point. You surf the chaser the same way you surf anything else, which is Lesson 52's skill pointed backwards."
                  },
                  {
                    "options": [
                      "Just a wave at an odd time"
                    ],
                    "body": "That’s the accurate reading, so keep it, and the chaser becomes a footnote rather than a crisis."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "plan",
                "headline": "What will you do when it arrives?",
                "helper": "Recognise it first, then use the usual skill.",
                "options": [
                  "Name it as the chaser",
                  "Ride it out like any other wave",
                  "Write it down and get on with the hour"
                ],
                "result": "My plan: {pick}"
              },
              {
                "kind": "collect",
                "title": "The forecast",
                "template": "\"If the wanting spikes after release, that is the chaser and it’s expected weather. {pick}.\"",
                "fallback": "\"The chaser is on my forecast now, so if it comes, it comes with a name attached.\"",
                "source": "checks",
                "label": "What I have noticed:",
                "cta": "Save this"
              }
            ],
            "sources": "The chaser effect (cravings spiking after sexual activity) is a commonly reported forum pattern in the evidence base, Part B1(c). The handling, recognise it, then urge-surf, uses the Tier 1 acceptance technique from Day 37; presented as observational, not a controlled finding.",
            "action": "Anticipate and log any post-activity craving spike, instead of being ambushed by it.",
            "reflection": "Have you noticed cravings spiking after release rather than before? Note whether the chaser is real for you, naming it in advance is most of how you take its power away."
          },
          {
            "number": 30,
            "heading": "The flatline is not failure",
            "title": "The flat spell",
            "tag": "folklore/observational — the reframe is what matters",
            "tagColor": "#843C3C",
            "sub": "I.F",
            "week": 2,
            "day": 23,
            "order": 29,
            "slug": "the-flat-spell-30",
            "pages": [
              {
                "kind": "teach",
                "headline": "Some people report a period of low mood and low libido after stopping.",
                "body": "Online communities call this the \"flatline.\" Close to a third of one forum sample described some version of it, but the timing and cause are not well established.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The flat spell passes on its own. What causes trouble is the conclusion people draw from it.",
                "body": "Wondering whether you have broken something leads straight to wanting to test it, and the test is a relapse dressed up as a check-up. The biological explanations online run a long way ahead of anything established, so hold them loosely.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What has happened to you in a flat spell?",
                "checks": [
                  {
                    "key": "broke",
                    "label": "I worried I had broken something",
                    "asIn": "The sudden quiet felt like damage",
                    "short": "worrying I had broken something"
                  },
                  {
                    "key": "test",
                    "label": "I wanted to test it",
                    "asIn": "I felt the urge to check everything still worked",
                    "short": "wanting to test it"
                  },
                  {
                    "key": "grey",
                    "label": "Everything went grey",
                    "asIn": "No spark for anything at all, including this",
                    "short": "everything going grey"
                  },
                  {
                    "key": "never",
                    "label": "It has never happened",
                    "asIn": "I haven’t hit one",
                    "short": "never hitting one"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "signs",
                "headline": "What does it look like when it happens?",
                "helper": "The signs, named plainly.",
                "options": [
                  "The libido goes quiet",
                  "The mood goes flat and grey",
                  "No drive for anything",
                  "Powered down, with no spark"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "broke",
                    "headline": "Nothing broke, and there’s evidence you can hold on to here.",
                    "body": "In large European samples, porn use wasn’t a significant risk factor for younger men's erectile difficulties (Landripet & Štulhofer, 2015). Quiet things get loud again on their own schedule, and yours will too."
                  },
                  {
                    "key": "test",
                    "headline": "The urge to test it’s a relapse holding a clipboard, and it’s worth calling it that.",
                    "body": "Checking whether everything still works is the single worst move available during this phase, because it restarts the exact cycle the quiet was part of recovering from."
                  },
                  {
                    "key": "grey",
                    "headline": "The grey stretch passes like everything else in this app does.",
                    "body": "It only looks endless from the inside, in the same way that a bare field in January looks permanently dead to anyone who hasn’t seen a spring."
                  },
                  {
                    "key": "never",
                    "headline": "Just bank the forecast and move on.",
                    "body": "If a flat spell ever does arrive, you’ll recognise it as a season instead of treating it as a crisis."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The libido goes quiet"
                    ],
                    "body": "Quiet isn’t the same as gone. The drive is resting, and testing it restarts the cycle that the rest is part of recovering from."
                  },
                  {
                    "options": [
                      "The mood goes flat and grey",
                      "No drive for anything"
                    ],
                    "body": "For some people the grey mood comes along with it. Keep the basics running. That means sleep and food and daylight, and let the season turn in its own time."
                  },
                  {
                    "options": [
                      "Powered down, with no spark"
                    ],
                    "body": "Ground lying fallow looks dead and isn’t, and spring arrives whatever January looked like. That’s all of the reframe."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "rule",
                "headline": "What is your rule for the flat spell?",
                "helper": "Decide it before you need it.",
                "options": [
                  "No testing, just wait it out",
                  "Write it down as expected weather",
                  "Come back and read this page"
                ],
                "result": "My rule: {pick}"
              },
              {
                "kind": "collect",
                "title": "The season",
                "template": "\"If the flat spell comes, it’s a known and temporary phase, so {pick}. Nothing needs testing.\"",
                "fallback": "\"The flat spell is on my map now, named as a season, not a crisis.\"",
                "source": "checks",
                "label": "What has happened before:",
                "cta": "Save this"
              }
            ],
            "sources": "The flatline (temporary loss of libido or flat mood during abstinence, reported by close to a third of forum members) and the temptation to test it, which becomes a relapse, are from the evidence base, Part B1(c) (Fernandez et al., 2021). Labelled observational/folklore on mechanism; the reframe plus urge-surfing (Day 37) is the evidenced part. Added: no significant porn-ED association in younger men across large European samples (Landripet & Štulhofer, 2015), used against the panic story, never as proof of harmlessness.",
            "action": "If a flatline hits, log it as expected and resist the urge to \"test.\"",
            "reflection": "If you've hit a flat spell before, what story did you tell yourself about it? Write the truer one (\"this is a known, temporary phase. I don't need to test anything\") to have ready next time."
          }
        ]
      }
    ]
  },
  {
    "n": 3,
    "title": "Part II · Fewer moments of choice",
    "ground": "Ground III · Deep Waters",
    "description": "This part is about not having the argument in the first place. That means dealing with the rooms that ask you, the friction and the locks, the feeds, the hours that repeat, and the decisions you can make while your head is still clear.",
    "subs": [
      {
        "code": "II.A",
        "title": "Rooms that ask",
        "description": "Some places have learned to ask you. This is how you rearrange them so they stop.",
        "lessons": [
          {
            "number": 31,
            "heading": "Cues beat willpower",
            "title": "Why the room matters",
            "tag": "evidence — stimulus control",
            "tagColor": "#375623",
            "sub": "II.A",
            "week": 3,
            "day": 1,
            "order": 30,
            "slug": "why-the-room-matters-31",
            "pages": [
              {
                "kind": "teach",
                "headline": "Notice the order in which things happen, because it’s not the order you’d assume.",
                "body": "You don’t decide to slip and then find yourself in bed with the phone. You’re already in bed with the phone in your hand, and then the urge turns up, as though the room had called for it. In a sense that is exactly what happened.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Cues are far easier to change than willpower is to summon.",
                "body": "Nobody can produce iron resolve at one in the morning on demand, but anybody can change where the phone charges overnight and what the bedroom gets used for. The method has a name in the research, which is stimulus control.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which of these is most loaded for you?",
                "checks": [
                  {
                    "key": "bed",
                    "label": "The bed at one in the morning",
                    "asIn": "It’s the setting with the most repetitions behind it",
                    "short": "the bed at one in the morning"
                  },
                  {
                    "key": "desk",
                    "label": "The desk with the door shut",
                    "asIn": "My workstation doubles as the place it happens",
                    "short": "the desk with the door shut"
                  },
                  {
                    "key": "sofa",
                    "label": "The sofa in the evening",
                    "asIn": "That’s where I drift, with the phone in my hand",
                    "short": "the sofa in the evening"
                  },
                  {
                    "key": "hour",
                    "label": "A particular hour",
                    "asIn": "The time of day itself seems to ask",
                    "short": "a particular hour"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "fires",
                "headline": "How does it fire in you?",
                "helper": "What happens before you have chosen anything at all.",
                "options": [
                  "The urge arrives before I have decided",
                  "My hand moves on its own",
                  "The room feels like permission",
                  "The hour itself asks",
                  "A restless drifting starts"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "bed",
                    "headline": "The bed is the worn path across your lawn, so that is where something has to go in the way.",
                    "body": "The phone charges elsewhere, the bed goes back to being for sleeping, and over a few weeks the room forgets what it used to mean."
                  },
                  {
                    "key": "desk",
                    "headline": "The shut door is doing half the work for the habit. That means it’s doing half the work against you.",
                    "body": "Open it, or move the desk, or take the risky jobs into a shared room. The cue needs the privacy more than you do."
                  },
                  {
                    "key": "sofa",
                    "headline": "The sofa drift is as much a posture as a place.",
                    "body": "Change where you sit, or give that hour one fixed thing to do, and the cue loses most of its grip without you having to resist anything."
                  },
                  {
                    "key": "hour",
                    "headline": "A cue that runs on time of day needs an appointment put in its place.",
                    "body": "Put something real into that hour and the asking suddenly has competition, which it has never had before."
                  },
                  {
                    "key": "none",
                    "headline": "If no single cue stands out, then keep a log for a few days and let the repetitions point at it.",
                    "body": "Everybody has at least one loaded room, and yours will show up quickly once you’re looking."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The urge arrives before I have decided",
                      "My hand moves on its own"
                    ],
                    "body": "That is an automatic response happening before you pause to decide. That’s why \"be stronger next time\" keeps failing. The strength turns up too late to be any use."
                  },
                  {
                    "options": [
                      "The room feels like permission",
                      "The hour itself asks"
                    ],
                    "body": "Cues that work by giving permission answer to rearranging the room, because if you change what the room holds then the permission expires."
                  },
                  {
                    "options": [
                      "A restless drifting starts"
                    ],
                    "body": "The drift is the cue's opening move, so catch it at the first step. Every step after that one is steeper than the last."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "change",
                "headline": "What will you change this week?",
                "helper": "One cue changed is worth three resisted.",
                "options": [
                  "Charge the phone in another room",
                  "Use the bed only for sleeping",
                  "Open the door, or move the desk",
                  "Take a different route through the evening"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your loaded cue",
                "template": "\"The most loaded cue for me is {checks}, and this week I’m changing it by choosing to {pick}.\"",
                "fallback": "\"I’ll find my most loaded cue this week and then change one concrete thing about it.\"",
                "source": "checks",
                "label": "How it fires:",
                "cta": "Save this"
              }
            ],
            "sources": "Stimulus control (changing cues rather than resisting the response) is a long-established behaviour-change method and appears among the evidence-supported (Tier 1-2) strategies in the evidence base. That the bedroom and phone routinely function as cues is from the evidence base, Part B1(a). The specific neuroimaging behind cue-triggered wanting is covered fully on Day 37 (Voon et al., 2014).",
            "action": "Identify your top three physical cues. Pick one and change it this week.",
            "reflection": "Name the single most loaded cue in your life, the place, object, or time most soaked in the behaviour. What's one concrete way to change it this week?"
          },
          {
            "number": 32,
            "heading": "The bedroom is for sleep",
            "title": "Taking the bedroom back",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "II.A",
            "week": 3,
            "day": 2,
            "order": 31,
            "slug": "taking-the-bedroom-back-32",
            "pages": [
              {
                "kind": "teach",
                "headline": "The bedroom got loaded by sheer repetition, and there’s nothing mysterious about it.",
                "body": "Years of being alone in the dark with the door shut will do that to a room. If you climb into the setting most wired to the behaviour every single night, there’s no puzzle about why the urge finds you there.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Having a screen in the bed costs you twice over instead of once.",
                "body": "It keeps the cue alive. And it thins out the sleep that would have paid for tomorrow's self-control. That makes this one of the few changes that pays you back on both sides at the same time.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is your bedroom like at the moment?",
                "checks": [
                  {
                    "key": "site",
                    "label": "It’s where most of it happened",
                    "asIn": "It’s the strongest single trigger I own",
                    "short": "where most of it happened"
                  },
                  {
                    "key": "den",
                    "label": "It doubles as a screen room",
                    "asIn": "Scrolling and drifting happen where sleeping should",
                    "short": "a screen room as well"
                  },
                  {
                    "key": "inbed",
                    "label": "The phone lives in the bed",
                    "asIn": "It’s within reach all night, every night",
                    "short": "the phone living in the bed"
                  },
                  {
                    "key": "banked",
                    "label": "It’s already just for sleeping",
                    "asIn": "My room is already only for sleep",
                    "short": "already just for sleeping"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "leaves",
                "headline": "What is leaving the room this week?",
                "helper": "The deal is that the bed is for sleep, and for sex with a partner.",
                "options": [
                  "The phone",
                  "The tablet",
                  "The laptop",
                  "The television",
                  "The charger itself"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "site",
                    "headline": "Your strongest trigger has a door that you close behind yourself every single night.",
                    "body": "Taking that room back is worth more than almost any other single move in this programme, because you can’t avoid the room."
                  },
                  {
                    "key": "den",
                    "headline": "The room has to pick a job, and it can’t be both a screen room and a place you sleep well.",
                    "body": "Give the scrolling somewhere else to happen, and within a few weeks the bed will start to mean rest again on its own."
                  },
                  {
                    "key": "inbed",
                    "headline": "The phone in the bed is the whole knot, and there’s one thing that unties it.",
                    "body": "Move the charger out of the room, so that the \"just checking something\" which reopens the old link has nothing left to check."
                  },
                  {
                    "key": "banked",
                    "headline": "Hold onto it, and know why it matters so that you keep holding.",
                    "body": "The path across the lawn grows back one lazy night at a time, and having no exceptions is what keeps it grass."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The phone",
                      "The charger itself"
                    ],
                    "body": "The charger is the anchor. Move that and the phone follows without any nightly debate about whether tonight is different."
                  },
                  {
                    "options": [
                      "The tablet",
                      "The laptop",
                      "The television"
                    ],
                    "body": "Every screen that leaves takes a bit of the association with it, and the room forgets faster the emptier it gets."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "winddown",
                "headline": "What replaces the scrolling?",
                "helper": "Something the bed can keep.",
                "options": [
                  "A paper book",
                  "A shower and then straight down",
                  "Some stretching",
                  "Just an earlier lights-out"
                ],
                "result": "Instead: {pick}"
              },
              {
                "kind": "collect",
                "title": "The room",
                "template": "\"The bed means sleep again. Out of the room go {grid}, and in their place, {pick}. Give it a few weeks and the association fades.\"",
                "fallback": "\"The screens leave the bedroom this week, and the room starts forgetting.\"",
                "source": "checks",
                "label": "The room as it stands:",
                "cta": "Save this"
              }
            ],
            "sources": "The bedroom as the default site of use, and thus a powerful cue, is from the evidence base, Part B1(a). The sleep to self-control link follows Week 2. Reclaiming the room combines stimulus control with basic sleep hygiene; kept at the plausible level.",
            "action": "No devices in bed for a week. Track the nights you keep it.",
            "reflection": "What does your bed currently \"mean\" to your brain, rest, or stimulation? Name the one bedtime habit you'll change this week to start tilting it back toward sleep."
          },
          {
            "number": 33,
            "heading": "Put the device out of reach",
            "title": "Putting distance in",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "II.A",
            "week": 3,
            "day": 3,
            "order": 32,
            "slug": "putting-distance-in-33",
            "pages": [
              {
                "kind": "teach",
                "headline": "A phone in your hand is a decision with no steps in it, and a phone in another room is a decision with several.",
                "body": "Somewhere on the walk to fetch it, more often than you’d expect, the wave breaks and you find you can’t be bothered. That’s not willpower. That’s just distance doing the work.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Point the distance at the hours you already know are risky.",
                "body": "In one study of around eight hundred people, a phone merely sitting on the desk took up some of the thinking capacity that a phone left in another room didn’t (Ward et al., 2017). A later replication found less than the original did, so hold it lightly, but the practical advice is the same either way.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "During your risky hours, where is the phone?",
                "checks": [
                  {
                    "key": "inhand",
                    "label": "In my hand",
                    "asIn": "There are no steps at all between the impulse and the act",
                    "short": "in my hand"
                  },
                  {
                    "key": "withinreach",
                    "label": "Within reach",
                    "asIn": "On the arm of the sofa, the bedside table, the edge of the desk",
                    "short": "within reach"
                  },
                  {
                    "key": "sameroom",
                    "label": "Somewhere in the room",
                    "asIn": "Near enough that fetching it takes seconds",
                    "short": "somewhere in the room"
                  },
                  {
                    "key": "elsewhere",
                    "label": "Usually in another room",
                    "asIn": "I mostly keep it out of the way already",
                    "short": "in another room"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "windows",
                "headline": "Which hours are your risky ones?",
                "helper": "This is where the distance gets aimed.",
                "options": [
                  "After work",
                  "Mid evening",
                  "Late at night",
                  "First thing in the morning",
                  "Weekend afternoons"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "inhand",
                    "headline": "If it’s already in your hand, the urge never meets a single obstacle between wanting and doing.",
                    "body": "Give it a staircase to climb. Waves very rarely survive a flight of stairs, because the peak passes somewhere around the landing."
                  },
                  {
                    "key": "withinreach",
                    "headline": "Arm's length counts as no distance at all once the hour is late enough.",
                    "body": "Out of the room is the version that works, and the difference between the two is larger than it sounds."
                  },
                  {
                    "key": "sameroom",
                    "headline": "Same room is the compromise the urge talks its way past most easily.",
                    "body": "The whole point is a journey long enough that the peak passes somewhere in the middle of it, and a few steps doesn’t buy you that."
                  },
                  {
                    "key": "elsewhere",
                    "headline": "Make the spot official instead of occasional.",
                    "body": "A fixed charging place turns remembering into routine, and routine is the thing that holds up on the nights when remembering wouldn’t."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Late at night",
                      "First thing in the morning"
                    ],
                    "body": "The night and the morning share one fix, which is that the phone sleeps on its charger in another room and you sleep in yours."
                  },
                  {
                    "options": [
                      "After work",
                      "Mid evening"
                    ],
                    "body": "Evening windows want the phone parked the moment you come through the door, before the sofa has claimed both of you."
                  },
                  {
                    "options": [
                      "Weekend afternoons"
                    ],
                    "body": "Long loose afternoons need the parking spot and a plan, because distance alone leaves you with the same empty hours."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "spot",
                "headline": "Where does the phone live?",
                "helper": "One place, every device, during the risky hours.",
                "options": [
                  "The kitchen counter",
                  "A shelf by the front door",
                  "The hallway",
                  "A desk in another room"
                ],
                "result": "The spot: {pick}"
              },
              {
                "kind": "collect",
                "title": "The distance",
                "template": "\"During {grid}, the phone lives at {pick}, because the urge can’t act on something my hand can’t reach.\"",
                "fallback": "\"The phone gets a fixed spot this week, and the risky hours get their distance.\"",
                "source": "checks",
                "label": "Where it has been living:",
                "cta": "Save this"
              }
            ],
            "sources": "Physical distance as friction is an application of stimulus control (Tier 1-2 in the evidence base). Targeting known high-risk windows draws on self-monitoring and trigger identification. The urge-as-wave model is covered fully on Day 37. Added: the phone-presence effect (Ward et al., 2017), stated with its failed-replication caveat.",
            "action": "During your riskiest window this week, keep your phone in another room. Track it.",
            "reflection": "Name the one window this week you'll deliberately put the phone out of reach, the exact hours. Match it to the danger window you mapped earlier."
          },
          {
            "number": 34,
            "heading": "Public by default",
            "title": "Where you sit",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "II.A",
            "week": 3,
            "day": 4,
            "order": 33,
            "slug": "where-you-sit-34",
            "pages": [
              {
                "kind": "teach",
                "headline": "The behaviour has one structural weakness, which is that it needs privacy to happen at all.",
                "body": "It needs a door you can shut, a room to yourself, and a screen nobody else can see. Take those conditions away and the same urge runs into an obstacle that has nothing whatever to do with willpower.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This is subtraction, not surveillance, and the difference matters.",
                "body": "Nobody is watching you and nothing gets announced to anyone. You move where you sit by default, in the same way you might keep biscuits in a jar on the counter instead of hidden in a drawer.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where has most of it happened?",
                "checks": [
                  {
                    "key": "locked",
                    "label": "Behind a locked door",
                    "asIn": "I arrange the privacy on purpose",
                    "short": "behind a locked door"
                  },
                  {
                    "key": "myroom",
                    "label": "Alone in my room",
                    "asIn": "The hours are just alone by default",
                    "short": "alone in my room"
                  },
                  {
                    "key": "empty",
                    "label": "When the house is empty",
                    "asIn": "The window opens as soon as everyone leaves",
                    "short": "when the house is empty"
                  },
                  {
                    "key": "notprivacy",
                    "label": "Somewhere else",
                    "asIn": "My pattern doesn’t really depend on privacy",
                    "short": "somewhere else"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "movable",
                "headline": "What could move into the open?",
                "helper": "Quietly, and with no announcement to anybody.",
                "options": [
                  "The evening scroll",
                  "Messages and admin",
                  "Watching things",
                  "Browsing",
                  "The last hour before bed"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "locked",
                    "headline": "If you lock the door on purpose, then make the locking itself cost something.",
                    "body": "With your default seat in a shared room, seeking privacy becomes a chain of deliberate moves, and an urge has to survive every link in it rather than none."
                  },
                  {
                    "key": "myroom",
                    "headline": "Being alone by default does the quiet work here, because you never have to decide anything.",
                    "body": "Move the ordinary screen time out of that room and it stops being the place where the whole evening automatically pools."
                  },
                  {
                    "key": "empty",
                    "headline": "The empty house needs a plan more than it needs a rule.",
                    "body": "Those are the hours for a walk, or a café, or one fixed thing. The absence of people is what triggers it, so fill the absence on purpose."
                  },
                  {
                    "key": "notprivacy",
                    "headline": "If privacy isn’t one of your conditions, then spend the effort elsewhere.",
                    "body": "This tool mostly moves people whose pattern lives behind a closed door, and it’s fine for it not to be yours."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The evening scroll",
                      "The last hour before bed"
                    ],
                    "body": "Move the high-risk hours into the open first. That means the sofa instead of the bedroom, and the kitchen table before everyone turns in."
                  },
                  {
                    "options": [
                      "Messages and admin",
                      "Browsing"
                    ],
                    "body": "Moving the harmless things matters more than it looks, because it drains the private room of any reason to be in it."
                  },
                  {
                    "options": [
                      "Watching things"
                    ],
                    "body": "Watching something in company, even quiet company, changes what the watching is able to turn into."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "seat",
                "headline": "Where is your new default seat?",
                "helper": "Where the ordinary screen time now happens.",
                "options": [
                  "The kitchen table",
                  "The living room",
                  "The sofa, with others about",
                  "A café during the risky hours"
                ],
                "result": "New default: {pick}"
              },
              {
                "kind": "collect",
                "title": "The new default",
                "template": "\"My ordinary screen time moves to {pick}, which makes the private room the one that takes effort to get to.\"",
                "fallback": "\"My default seat moves into the open this week, and with no announcement.\"",
                "source": "checks",
                "label": "Where it happened:",
                "cta": "Save this"
              }
            ],
            "sources": "That use overwhelmingly relies on privacy, typically alone, behind a closed door, is from the evidence base, Part B1(a). Shifting to visible spaces is stimulus control: removing a necessary condition rather than resisting the response. Kept at the plausible level; explicitly not a surveillance or shame mechanic.",
            "action": "Use your laptop in common/visible areas for a week. Track how it feels and what changes.",
            "reflection": "Where do you do most of your \"alone with a screen\" time? Name one routine activity you could move into a shared, visible space this week."
          }
        ]
      },
      {
        "code": "II.B",
        "title": "Friction and locks",
        "description": "Add a few seconds between the urge and the action.",
        "lessons": [
          {
            "number": 35,
            "heading": "Add friction everywhere",
            "title": "Making it slower",
            "tag": "evidence — stimulus control",
            "tagColor": "#375623",
            "sub": "II.B",
            "week": 3,
            "day": 5,
            "order": 34,
            "slug": "making-it-slower-35",
            "pages": [
              {
                "kind": "teach",
                "headline": "When access is instant, you can act before you have time to think.",
                "body": "A login, password, or walk to another room gives you a few seconds to pause and reconsider.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The apps were built frictionless on purpose, by people who were paid to make them that way.",
                "body": "So you’re only taking a bit of that friction back for your own side. What you’re doing is turning a reflex into a decision, and a decision is somewhere you get a vote.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How instant is your access right now?",
                "checks": [
                  {
                    "key": "loggedin",
                    "label": "I’m already logged in",
                    "asIn": "There’s no gate at all between the urge and the act",
                    "short": "already logged in"
                  },
                  {
                    "key": "onetap",
                    "label": "One tap from the home screen",
                    "asIn": "A shortcut is doing the urge's work for it",
                    "short": "one tap away"
                  },
                  {
                    "key": "saved",
                    "label": "Passwords saved everywhere",
                    "asIn": "The browser remembers, so I never have to decide",
                    "short": "passwords saved"
                  },
                  {
                    "key": "devices",
                    "label": "Instant on several devices",
                    "asIn": "Close one door and another one is standing open",
                    "short": "instant on several devices"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "add",
                "headline": "What could you do in one calm sitting?",
                "helper": "Each of these buys you seconds.",
                "options": [
                  "Log out of everything",
                  "Delete the saved passwords",
                  "Take the shortcuts off the home screen",
                  "Clear the autocomplete",
                  "Send codes to another device"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "loggedin",
                    "headline": "Being permanently logged in is what makes a four-second slip possible.",
                    "body": "Log out of everything today and the same urge has to fumble its way through a chain of steps instead, and the fumbling is often enough."
                  },
                  {
                    "key": "onetap",
                    "headline": "Take the shortcut away and the reflex loses the rail it was running on.",
                    "body": "The urge then has to spell out what it wants, and spelling it out tends to wake up the rest of you."
                  },
                  {
                    "key": "saved",
                    "headline": "The browser's memory is working for the urge, not for you.",
                    "body": "Clear it, and every future visit needs a decision made in full daylight, not a form filling itself in."
                  },
                  {
                    "key": "devices",
                    "headline": "Whatever you do has to cover the whole set, because the urge doesn’t care which screen it uses.",
                    "body": "One sitting, every device, the same treatment. Doing three out of four leaves the whole thing pointless."
                  },
                  {
                    "key": "none",
                    "headline": "If your access already has steps in it, then keep them and check them occasionally.",
                    "body": "Friction erodes one convenient exception at a time, and rebuilding it today costs you almost nothing."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Log out of everything",
                      "Delete the saved passwords"
                    ],
                    "body": "Start with those two. They add enough effort to interrupt an automatic choice during a strong urge."
                  },
                  {
                    "options": [
                      "Take the shortcuts off the home screen",
                      "Clear the autocomplete"
                    ],
                    "body": "The small cosmetic ones count as well, since every rail you remove makes the drift a little less automatic."
                  },
                  {
                    "options": [
                      "Send codes to another device"
                    ],
                    "body": "That’s the strongest single bump available, because the pause it forces usually outlasts the peak of the wave."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "first",
                "headline": "What are you doing today?",
                "helper": "In cold blood, with no urge in sight.",
                "options": [
                  "Log out of everything",
                  "Delete the saved passwords",
                  "Take the shortcuts off",
                  "Clear the autocomplete"
                ],
                "result": "Today: {pick}"
              },
              {
                "kind": "collect",
                "title": "The speed bumps",
                "template": "\"Today, in one sitting, I’ll {pick}, and then work through the rest of the list. Access stays possible. It just stops being instant.\"",
                "fallback": "\"One calm sitting this week turns instant into effortful, everywhere.\"",
                "source": "checks",
                "label": "Where it was instant:",
                "cta": "Save this"
              }
            ],
            "sources": "Adding friction is an application of stimulus control (Tier 1-2 in the evidence base). The two-system (fast/impulsive vs slow/deliberate) account is general behavioural science. Converting reflexive access into deliberate access aligns with the relapse-as-a-gradual-slide finding in the evidence base, Part B1(d).",
            "action": "Add as many friction points as you can in one sitting (log-outs, removed shortcuts) and count them.",
            "reflection": "What's the single biggest \"zero-step\" access point in your life right now, the thing that's instant? Write down the one piece of friction you'll add to it today."
          },
          {
            "number": 36,
            "heading": "Blockers — useful, not bulletproof",
            "title": "What blockers can and cannot do",
            "tag": "plausible — honest limit",
            "tagColor": "#0B3C49",
            "sub": "II.B",
            "week": 3,
            "day": 6,
            "order": 35,
            "slug": "what-blockers-can-and-cannot-do-36",
            "pages": [
              {
                "kind": "teach",
                "headline": "Two things are true about blockers at once, and you need to hold both of them.",
                "body": "Hold both of these at the same time.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "A blocker helps, and it closes the idle, half-hearted door very effectively",
                    "A blocker won’t save you on its own"
                  ],
                  "note": "At the peak of an urge people get round their own blockers, because you’re the one holding all the keys to your own locks."
                }
              },
              {
                "kind": "teach",
                "headline": "So pair the tool with a decision that the tool can’t make for you.",
                "body": "Write down the exact workaround you’re choosing not to use, spelled out as the actual move, not as a vague category. Naming it takes away its innocence, and its innocence is most of what makes it usable.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What has your history with blockers been?",
                "checks": [
                  {
                    "key": "deleted",
                    "label": "I installed one and deleted it",
                    "asIn": "The off switch was always within reach",
                    "short": "installing and deleting one"
                  },
                  {
                    "key": "knowway",
                    "label": "I know exactly how to get round it",
                    "asIn": "I already know my own way round",
                    "short": "knowing the way round"
                  },
                  {
                    "key": "never",
                    "label": "I have never tried one",
                    "asIn": "It’s not something I have used",
                    "short": "never trying one"
                  },
                  {
                    "key": "only",
                    "label": "It’s my only defence",
                    "asIn": "One thing is holding the whole wall up",
                    "short": "relying on it entirely"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "ways",
                "headline": "Which routes round it do you already know?",
                "helper": "Be exact, because daylight is where these lose their power.",
                "options": [
                  "Another browser",
                  "Switching networks",
                  "A second device",
                  "Uninstalling it",
                  "Private browsing",
                  "Typing in the unlock words"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "deleted",
                    "headline": "Deleting the blocker during an urge means you still control the off switch.",
                    "body": "Next time you install one, let somebody else hold the password. That makes the blocker harder to remove in the moment."
                  },
                  {
                    "key": "knowway",
                    "headline": "A workaround you already know is a workaround you have half used.",
                    "body": "Write it down as a named commitment and it stops being an innocent little move and becomes something you’d have to decide to do."
                  },
                  {
                    "key": "never",
                    "headline": "Start using one this week, with your eyes open about what it does.",
                    "body": "It will catch the idle drift, which is most of the traffic. The peak-urge gap is what the rest of this page is about."
                  },
                  {
                    "key": "only",
                    "headline": "One wall is one point of failure, and this particular wall has a door in it.",
                    "body": "Keep the blocker and add the things it can’t do, which are a pre-commitment and some physical distance. Several imperfect layers hold where one perfect layer can’t."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Another browser",
                      "Private browsing"
                    ],
                    "body": "The browser-shaped routes die by subtraction. One browser, blocked, with the spares uninstalled in the same sitting."
                  },
                  {
                    "options": [
                      "Switching networks",
                      "A second device"
                    ],
                    "body": "Hardware routes need hardware answers. That means the blocker goes on every device and the password lives with somebody else."
                  },
                  {
                    "options": [
                      "Uninstalling it",
                      "Typing in the unlock words"
                    ],
                    "body": "If you can switch it off during an urge, change who controls the password. Let somebody else hold it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "commit",
                "headline": "Which route are you leaving alone?",
                "helper": "Name the one move, in full daylight.",
                "options": [
                  "Another browser",
                  "Switching networks",
                  "A second device",
                  "Unlocking my own filter"
                ],
                "result": "I'm leaving alone: {pick}"
              },
              {
                "kind": "collect",
                "title": "The commitment",
                "template": "\"The blocker stays, and I’m leaving {pick} alone. I named it while calm, in writing, so it’s no longer an innocent move.\"",
                "fallback": "\"The blocker gets a partner this week, which is one named route that I have sworn off in writing.\"",
                "source": "checks",
                "label": "My history with them:",
                "cta": "Save this"
              }
            ],
            "sources": "Blockers as useful friction, and the documented pattern of users circumventing their own blockers at peak urge (including unlocking one's own filter, described in the evidence base as leading to a spiral), are from the evidence base, Part B1(d). Pre-commitment pairs the tool with stimulus control and the if-then planning covered on Day 36.",
            "action": "Install a blocker AND write down the one workaround you commit not to use.",
            "reflection": "Be honest about your own workaround, the exact move flooded-you would make to get around a blocker. Name it in writing. Naming it is half of not using it."
          },
          {
            "number": 37,
            "heading": "The AI-chatbot frontier",
            "title": "The newer door",
            "tag": "observational — recent",
            "tagColor": "#0B3C49",
            "sub": "II.B",
            "week": 3,
            "day": 7,
            "order": 36,
            "slug": "the-newer-door-37",
            "pages": [
              {
                "kind": "teach",
                "headline": "A growing share of relapses now involve no porn site at all.",
                "body": "They happen in AI companions and roleplay chatbots, which answer back, appear to remember you, and escalate when you ask them to. People describe them as harder to put down than any video ever was.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The trouble is that they slip past defences built for the older thing.",
                "body": "Blockers are pointing at video sites while the slip is happening in a chat window that nobody thought to count. Strip away the novelty, though. And it’s exactly what everything else in this part is about, which is a cue and an easy way in.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where does this sit for you?",
                "checks": [
                  {
                    "key": "mine",
                    "label": "It’s one of mine",
                    "asIn": "The chat window is part of my pattern",
                    "short": "one of mine"
                  },
                  {
                    "key": "cycle",
                    "label": "I keep deleting and reinstalling",
                    "asIn": "I have deleted the app and downloaded it again more than once",
                    "short": "deleting and reinstalling"
                  },
                  {
                    "key": "harder",
                    "label": "It pulls harder than the old thing",
                    "asIn": "The fact that it answers back is the hook",
                    "short": "pulling harder"
                  },
                  {
                    "key": "notmine",
                    "label": "It’s not part of my pattern",
                    "asIn": "It hasn’t come up for me",
                    "short": "not part of my pattern"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "hook",
                "headline": "What makes it pull?",
                "helper": "Name the actual mechanism, not the category.",
                "options": [
                  "It answers back",
                  "It seems to remember me",
                  "It escalates when I ask",
                  "It feels like being wanted",
                  "It is always there and never impatient"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "mine",
                    "headline": "It goes on the list today, plainly, and with no extra shame attached for it being new.",
                    "body": "Blocked, logged out, friction added, exactly as you’d treat any other door. Newness doesn’t earn it special status in either direction."
                  },
                  {
                    "key": "cycle",
                    "headline": "Deleting and reinstalling is the blocker problem wearing different clothes.",
                    "body": "Close the account properly and give the password away, because that beats another private deletion that you can undo at two in the morning."
                  },
                  {
                    "key": "harder",
                    "headline": "The extra pull is real and there’s a reason for it, which is that it borrows the shape of a relationship.",
                    "body": "That means the blocks handle the surface and Part VI handles the actual problem, and you’ll want both rather than either."
                  },
                  {
                    "key": "notmine",
                    "headline": "A door you have named is a door you’ll notice opening.",
                    "body": "Defences built before a door exists are the only ones that catch it, so it’s worth two minutes even if it never applies to you."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "It answers back",
                      "It seems to remember me"
                    ],
                    "body": "The responsiveness is the hook and it’s engineered. The warmth is a product feature, and it’s priced in hours of your evening."
                  },
                  {
                    "options": [
                      "It escalates when I ask",
                      "It is always there and never impatient"
                    ],
                    "body": "Escalation on demand combined with infinite patience is built for one in the morning, which is why the access has to be decided at ten."
                  },
                  {
                    "options": [
                      "It feels like being wanted"
                    ],
                    "body": "That feeling is pointing at something real that is missing, and the counterfeit can’t fill it however good it gets. Part VI is where the real version gets built."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "move",
                "headline": "What are you doing about it today?",
                "helper": "Same toolkit, pointed at a new target.",
                "options": [
                  "Block the specific apps",
                  "Close the account and log out",
                  "Add it to the blocker's list",
                  "Note it, since it stays closed"
                ],
                "result": "Today: {pick}"
              },
              {
                "kind": "collect",
                "title": "The doors",
                "template": "\"A door is a door, whether it’s new or old, and this one now has a name. {pick}. The ones you don’t name are the ones that stay open.\"",
                "fallback": "\"This week I’ll check my defences for doors that were built after them.\"",
                "source": "checks",
                "label": "Where this sits for me:",
                "cta": "Save this"
              }
            ],
            "sources": "AI companions and roleplay chatbots as a rising relapse vector is observational, drawn from the NoFap forum dataset's AI-chatbot cluster (nofap_relapse_summary.md), used as an aggregate pattern, not a controlled finding. The handling, name it, block it, add friction, is standard stimulus control.",
            "action": "If relevant, name and block AI companion/roleplay apps explicitly. Track it.",
            "reflection": "Is this one of your doors? Answer honestly. If yes, name the specific app(s) so your defences can point at them instead of a blind spot."
          }
        ]
      },
      {
        "code": "II.C",
        "title": "Screens and feeds",
        "description": "The pulls that were engineered on purpose, and the settings that switch them off.",
        "lessons": [
          {
            "number": 38,
            "heading": "Greyscale your phone",
            "title": "Taking the colour out",
            "tag": "folklore/emerging",
            "tagColor": "#843C3C",
            "sub": "II.C",
            "week": 3,
            "day": 8,
            "order": 37,
            "slug": "taking-the-colour-out-38",
            "pages": [
              {
                "kind": "teach",
                "headline": "The colours on your phone were tuned, and they were tested on people until they worked.",
                "body": "The red badge and the bright tappable things are there to grab you. Strip the colour out and the feed turns into a grey wall, which is still perfectly usable and less moreish.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The evidence for this is early but it does exist, which is more than most phone advice can say.",
                "body": "In one trial, 161 students set their phones to greyscale for around nine days and cut their screen time by roughly forty minutes a day (Holte & Ferraro, 2020). That measured screen time instead of porn use, so treat it as a cheap experiment, not a proven cure.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where does your chain usually start?",
                "checks": [
                  {
                    "key": "thumbnail",
                    "label": "With a striking image",
                    "asIn": "The picture pulls before there’s any decision to make",
                    "short": "a striking image"
                  },
                  {
                    "key": "badge",
                    "label": "With a red badge",
                    "asIn": "There’s a dot to clear, and then the drifting starts",
                    "short": "a red badge"
                  },
                  {
                    "key": "boredscroll",
                    "label": "With a bored scroll",
                    "asIn": "Phone up, feed on, nothing in particular in mind",
                    "short": "a bored scroll"
                  },
                  {
                    "key": "feeling",
                    "label": "With a feeling, before the phone",
                    "asIn": "The mood arrives first and the screen comes second",
                    "short": "a feeling first"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "feeds",
                "headline": "What does your scrolling feed on?",
                "helper": "Where the pull lives, in your case.",
                "options": [
                  "Bright badges",
                  "Images and thumbnails",
                  "The endless feed",
                  "Videos playing automatically",
                  "The mood, more than the screen"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "thumbnail",
                    "headline": "If your chain starts with an image, then greyscale is aimed exactly at your problem.",
                    "body": "The pull it takes away is the one that starts everything else, so run the test properly, not for an afternoon."
                  },
                  {
                    "key": "badge",
                    "headline": "The badge works by colour far more than by content.",
                    "body": "In grey it’s only a dot, so watch over the week whether the compulsion to clear it fades along with the redness."
                  },
                  {
                    "key": "boredscroll",
                    "headline": "Grey makes an aimless scroll duller, which is the entire point of it.",
                    "body": "A duller way in means fewer slides that should never have started, and the ones that do start are easier to stop."
                  },
                  {
                    "key": "feeling",
                    "headline": "If the feeling arrives before the phone does, then greyscale has less to work with.",
                    "body": "Your trigger was never the glitter, so spend your effort on the lessons about the mood itself and treat this as optional."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Bright badges",
                      "Images and thumbnails"
                    ],
                    "body": "Those two are engineered colour doing its job on you, and the experiment takes away its main tool for a week. That’s a fair fight to have."
                  },
                  {
                    "options": [
                      "The endless feed",
                      "Videos playing automatically"
                    ],
                    "body": "Grey dulls the feed but the belt keeps moving underneath, so pair it with turning off autoplay in Lesson 40 for the full effect."
                  },
                  {
                    "options": [
                      "The mood, more than the screen"
                    ],
                    "body": "Expect this to do nothing much, and that is fine. Crossing a tool off the list is progress too, because it stops you spending attention on it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "test",
                "headline": "What will you try?",
                "helper": "Thirty seconds to turn on, thirty to turn off.",
                "options": [
                  "Greyscale for a week",
                  "Grey on the risky evenings only",
                  "Skip this one"
                ],
                "result": "My test: {pick}"
              },
              {
                "kind": "collect",
                "title": "The grey test",
                "template": "\"{pick}. Then the verdict comes from my own scrolling. That means I either keep a free tool that works or turn it back and move on.\"",
                "fallback": "\"I’ll run the grey test this week and let my own scrolling decide.\"",
                "source": "checks",
                "label": "Where my chain starts:",
                "cta": "Save this"
              }
            ],
            "sources": "That app colour is engineered to capture attention is general knowledge about persuasive design. Greyscale now has one small verified trial: 161 students, phones grey for 8-10 days, screen time down about 40 minutes a day (Holte & Ferraro, 2020; STUDY_BANK.md). It measures screen time, and says nothing about porn use, so the tag stays folklore/emerging. Targeting the scroll rather than the slip aligns with the trigger-chain logic in the evidence base, Part B1(d).",
            "action": "Turn on greyscale for a few days and notice whether your scrolling drops.",
            "reflection": "After a few greyscale days, write your honest verdict: did your phone get less magnetic, or did you not notice? Keep it or drop it on the strength of your own answer."
          },
          {
            "number": 39,
            "heading": "Curate the on-ramps",
            "title": "The first link in the chain",
            "tag": "evidence — trigger chains",
            "tagColor": "#375623",
            "sub": "II.C",
            "week": 3,
            "day": 9,
            "order": 38,
            "slug": "the-first-link-in-the-chain-39",
            "pages": [
              {
                "kind": "teach",
                "headline": "The slip you notice is the last link in a chain, and the earliest links are the weak ones.",
                "body": "People describe a relapse as a slide made of steps that each looked innocent on its own. Just scrolling. Just watching something ordinary. And then suddenly not.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Which is useful, because the top of the slide is nearly flat.",
                "body": "Unfollowing the account that starts your drift takes one second on a calm afternoon with no urge anywhere in sight. The bottom of the slide is a cliff face. Same chain, wildly different price depending on where you work on it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Tracing your last slip back, what was the first innocent step?",
                "checks": [
                  {
                    "key": "feeddrift",
                    "label": "Drifting through a feed",
                    "asIn": "Scrolling with no aim until the feed found one for me",
                    "short": "drifting through a feed"
                  },
                  {
                    "key": "videochain",
                    "label": "One video, then a spicier one",
                    "asIn": "The ladder gets climbed a rung at a time",
                    "short": "climbing a ladder of videos"
                  },
                  {
                    "key": "search",
                    "label": "A search that wasn’t quite innocent",
                    "asIn": "Worded innocently but aimed carefully",
                    "short": "an almost-innocent search"
                  },
                  {
                    "key": "appopen",
                    "label": "Opening an app for no reason",
                    "asIn": "No reason on the way in, and one supplied on arrival",
                    "short": "opening an app for no reason"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "ramps",
                "headline": "What could you prune this afternoon?",
                "helper": "Ten minutes, while none of it has any pull.",
                "options": [
                  "Particular accounts",
                  "Suggested videos",
                  "My search history",
                  "Notifications",
                  "One app in particular"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "feeddrift",
                    "headline": "Your chain opens with the drift, so the job is learning to recognise its opening bars.",
                    "body": "The app, the hour, the mood. You’d recognise a song from that much, and this is no harder once you have decided to listen for it."
                  },
                  {
                    "key": "videochain",
                    "headline": "The first rung of the ladder always looks respectable, and that is the whole trick of it.",
                    "body": "Your unfollow list is where the ladder gets sawn off, because the respectable rung is the one you can remove without any struggle."
                  },
                  {
                    "key": "search",
                    "headline": "An almost-innocent search is the most deliberate innocent step there is.",
                    "body": "Clear the history that keeps completing it for you, so that the wording has to be typed out in full each time and you have to hear yourself do it."
                  },
                  {
                    "key": "appopen",
                    "headline": "An app opened for no reason will always find you a reason once you’re inside.",
                    "body": "Move it off the home screen, or give the aimless opening one rule, which is that you have to say what you opened it for."
                  },
                  {
                    "key": "none",
                    "headline": "If your last slip seemed to come from nowhere, then trace it again more slowly.",
                    "body": "There’s nearly always a first step and it’s nearly always earlier than you think, usually by hours instead of minutes."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Particular accounts",
                      "One app in particular"
                    ],
                    "body": "Names beat categories here, so unfollow the specific accounts and mute the specific app today, while they have no pull on you at all."
                  },
                  {
                    "options": [
                      "Suggested videos",
                      "Notifications"
                    ],
                    "body": "The machine-made ramps get machine answers. That means suggestions stripped and notifications turned off, and the next lesson finishes that job."
                  },
                  {
                    "options": [
                      "My search history"
                    ],
                    "body": "The history is the road most travelled, and once it’s cleared it stops auto-completing the way back for you."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "cut",
                "headline": "What are you cutting today?",
                "helper": "A calm afternoon, in cold blood.",
                "options": [
                  "Unfollow the accounts",
                  "Clear the search history",
                  "Turn off the notifications",
                  "Mute or move the app"
                ],
                "result": "Today: {pick}"
              },
              {
                "kind": "collect",
                "title": "The chain",
                "template": "\"The first link in my chain is {checks}, and today I’m cutting it at the flat end by choosing to {pick}.\"",
                "fallback": "\"This week I’ll trace my last slip backwards and cut the first link in the chain.\"",
                "source": "checks",
                "label": "The innocent first steps:",
                "cta": "Save this"
              }
            ],
            "sources": "Relapse as a gradual, cunning and insidious chain of small steps, and external cues (feeds, video platforms, ads, apps) as on-ramps, are from the evidence base, Part B1(a) and B1(d). Acting on early links in the chain is stimulus control and trigger management, Tier 1-2 strategies.",
            "action": "Unfollow or mute ten accounts that act as on-ramps. Notice how the feed changes.",
            "reflection": "Trace your last slip backwards: what was the very first \"innocent\" step on the chain? Name it. That early link is the cheapest one to cut next time."
          },
          {
            "number": 40,
            "heading": "Kill the algorithm's grip",
            "title": "Turning the feed down",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "II.C",
            "week": 3,
            "day": 10,
            "order": 39,
            "slug": "turning-the-feed-down-40",
            "pages": [
              {
                "kind": "teach",
                "headline": "The recommendation engine is aimed at keeping you watching, and it’s extremely good at its job.",
                "body": "The ninety minutes that started as one video before bed is a machine doing that job on you. And it does the same job on everybody who opens the app. There’s nothing personal about it and nothing weak about losing to it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "You can change the data and settings that drive recommendations.",
                "body": "Clear your history, reset recommendations, turn off autoplay, and hide the sidebar. Turning off autoplay stops the next video from starting before you choose it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which part of it catches you?",
                "checks": [
                  {
                    "key": "autoplay",
                    "label": "Autoplay",
                    "asIn": "The next one starts before there’s any choice to make",
                    "short": "autoplay"
                  },
                  {
                    "key": "upnext",
                    "label": "The list of what is next",
                    "asIn": "Tuned thumbnails waiting in the wings",
                    "short": "the list of what is next"
                  },
                  {
                    "key": "infinite",
                    "label": "The endless feed",
                    "asIn": "There’s no bottom to it and no natural place to stop",
                    "short": "the endless feed"
                  },
                  {
                    "key": "tuned",
                    "label": "Thumbnails picked for me",
                    "asIn": "The machine knows which threads to pull",
                    "short": "thumbnails picked for me"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "platforms",
                "headline": "Where does it steer you most?",
                "helper": "Name the actual platforms.",
                "options": [
                  "YouTube",
                  "Shorts or Reels",
                  "TikTok",
                  "Reddit or X",
                  "Instagram"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "autoplay",
                    "headline": "Autoplay is the walkway, because standing still carries you forwards anyway.",
                    "body": "It’s one setting, turned off once, and then standing still costs you nothing again. Very few changes are that cheap."
                  },
                  {
                    "key": "upnext",
                    "headline": "The list of what comes next exists to outbid your sense of having had enough.",
                    "body": "Strip it out with a setting or a browser extension, and then the video ends where it ends."
                  },
                  {
                    "key": "infinite",
                    "headline": "Feeds with no bottom have no exit built in, so you have to build one yourself.",
                    "body": "That means a timer, or a stripped-down feed, or moving the platform off the phone and keeping it on a laptop."
                  },
                  {
                    "key": "tuned",
                    "headline": "The tuning runs on your history, which is the part you can delete.",
                    "body": "Clear it and the machine forgets which threads to pull, and its next few guesses will be noticeably blunter."
                  },
                  {
                    "key": "none",
                    "headline": "If no single part stands out, then check by how you feel on the way out.",
                    "body": "Whichever app you leave feeling steered is the one to disarm first, and you’ll know it as soon as you ask."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "YouTube",
                      "Shorts or Reels"
                    ],
                    "body": "The video platforms respond well to a bit of surgery. That means history cleared, autoplay off and the sidebar stripped. Ten minutes, once."
                  },
                  {
                    "options": [
                      "TikTok"
                    ],
                    "body": "The pure feed apps have the fewest settings and the strongest pull, so for those, distance and greyscale do what the settings can’t."
                  },
                  {
                    "options": [
                      "Reddit or X",
                      "Instagram"
                    ],
                    "body": "Mixed feeds hide the on-ramp inside the ordinary scroll, so muting and unfollowing will do more there than any switch."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "setting",
                "headline": "What are you changing today?",
                "helper": "Ten minutes on your worst platform.",
                "options": [
                  "Turn off autoplay",
                  "Clear the history",
                  "Reset the recommendations",
                  "Add an extension that strips the feed"
                ],
                "result": "Today: {pick}"
              },
              {
                "kind": "collect",
                "title": "Taking the wheel back",
                "template": "\"The walkway stops moving, so I’ll {pick}, starting with {grid}. I can use the platforms without being steered by them.\"",
                "fallback": "\"I’ll disarm the worst one this week, which is one setting and ten minutes.\"",
                "source": "checks",
                "label": "What was steering me:",
                "cta": "Save this"
              }
            ],
            "sources": "That recommendation engines are optimised for engagement and manufacture continued viewing is general knowledge about platform design. The drift or just one more on-ramp aligns with the trigger-chain finding in the evidence base, Part B1(d). Kept at the plausible level.",
            "action": "Clear your history, reset recommendations, and add one feed-stripping extension or setting.",
            "reflection": "Which platform's \"just one more\" engine catches you most? Name it, and the one setting (autoplay off, history cleared, recommendations stripped) you'll change on it today."
          },
          {
            "number": 41,
            "heading": "The first 20 minutes awake",
            "title": "The first twenty minutes",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "II.C",
            "week": 3,
            "day": 11,
            "order": 40,
            "slug": "the-first-twenty-minutes-41",
            "pages": [
              {
                "kind": "teach",
                "headline": "For the first stretch after you wake up, nobody is really driving.",
                "body": "The deciding part of the brain takes a while to boot up, and your hand finds the phone long before a single clear thought has formed. You’re at your most suggestible and your least supervised in the same moment.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So the answer is to protect the first twenty minutes rather than to try harder during them.",
                "body": "No phone until the deliberate part of your brain has clocked in and can face the day's first pull. It also stacks neatly with the morning light lesson, because instead of reaching for the screen you reach for the door.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happens in the first ten seconds after you wake?",
                "checks": [
                  {
                    "key": "handfinds",
                    "label": "My hand finds the phone",
                    "asIn": "The reach happens before any thought does",
                    "short": "my hand finding the phone"
                  },
                  {
                    "key": "scrollfirst",
                    "label": "I start scrolling",
                    "asIn": "The feed picks up as though the night was a pause",
                    "short": "starting to scroll"
                  },
                  {
                    "key": "checkloop",
                    "label": "I run through the same apps",
                    "asIn": "Messages, mail and feeds, in the same worn order",
                    "short": "running through the same apps"
                  },
                  {
                    "key": "noreach",
                    "label": "I wake up without it",
                    "asIn": "I get up fine without reaching for anything",
                    "short": "waking without it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "costs",
                "headline": "What does the morning reach cost you?",
                "helper": "Whatever you have noticed it doing.",
                "options": [
                  "The day starts on the back foot",
                  "It is a risky window for me",
                  "I feel scattered from the off",
                  "It keeps the bed and the phone connected"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "handfinds",
                    "headline": "The reach beats the thought because the phone is within range, and that is all of the problem.",
                    "body": "Charge it outside the room and there’s no contest to win at seven in the morning, because there’s nothing there to reach for."
                  },
                  {
                    "key": "scrollfirst",
                    "headline": "When the feed picks up first thing, the day starts in consumption mode and nobody chose that.",
                    "body": "Twenty screenless minutes hands the morning back to you, and you’ll notice the difference in the tone of the whole day instead of just the twenty minutes."
                  },
                  {
                    "key": "checkloop",
                    "headline": "Running the same loop feels like duty and works like a current.",
                    "body": "It will run just as well at minute twenty-one, with somebody at the wheel, and nothing will have been missed in the meantime."
                  },
                  {
                    "key": "noreach",
                    "headline": "This window is already yours, which is worth more than it sounds.",
                    "body": "Pair it with getting some daylight and the morning does two lessons' work without any extra effort."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The day starts on the back foot",
                      "I feel scattered from the off"
                    ],
                    "body": "That’s the quiet cost, because if you begin the day being pulled at, the rest of the day tends to inherit the posture."
                  },
                  {
                    "options": [
                      "It is a risky window for me"
                    ],
                    "body": "If mornings are one of your risky windows, then these are the most valuable twenty minutes in all of this part."
                  },
                  {
                    "options": [
                      "It keeps the bed and the phone connected"
                    ],
                    "body": "Scrolling in bed in the morning teaches the room exactly the lesson that Lesson 32 is trying to unteach, and the fix is the same one."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "reach",
                "headline": "What does your hand get instead?",
                "helper": "Something you’d reach for.",
                "options": [
                  "The door and some daylight",
                  "The kettle",
                  "A shower",
                  "Nothing, because the phone stays where it is"
                ],
                "result": "Instead: {pick}"
              },
              {
                "kind": "collect",
                "title": "The first twenty minutes",
                "template": "\"For the first twenty minutes, I will do {pick} before I use a screen. This gives me time to wake up and think clearly.\"",
                "fallback": "\"I’ll guard the groggy window this week. That means twenty minutes with no phone.\"",
                "source": "checks",
                "label": "The reach as it stands:",
                "cta": "Save this"
              }
            ],
            "sources": "That the prefrontal, deliberate system is slow to come online after waking is general knowledge. The morning reach-for-phone as an on-ramp is observational, and pairs with the morning-light circadian lever from Day 18. Kept at the plausible level.",
            "action": "No phone for the first 20 minutes after waking this week. Track the mornings you manage it.",
            "reflection": "What's the very first thing your hand reaches for on waking? Name what you'll reach for instead this week, ideally something that gets you toward daylight."
          }
        ]
      },
      {
        "code": "II.D",
        "title": "The hours that repeat",
        "description": "Some hours come round every week. This is how you prepare them in advance.",
        "lessons": [
          {
            "number": 42,
            "heading": "The 1 a.m. trap is a staging problem",
            "title": "The one in the morning trap",
            "tag": "evidence — staging and cues",
            "tagColor": "#375623",
            "sub": "II.D",
            "week": 3,
            "day": 12,
            "order": 41,
            "slug": "the-one-in-the-morning-trap-42",
            "pages": [
              {
                "kind": "teach",
                "headline": "Late, alone, lights off, phone within reach.",
                "body": "A hundred honest accounts of relapse describe that same scene, almost word for word. That means it’s better read as a problem with how the evening was set up than as a problem with your resolve, and the setting up is the part you can change.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The bedroom itself is doing half the work.",
                "body": "Repeat a behaviour in one place for long enough and the place starts producing the craving on its own. One forum member put it plainly, saying that lying in bed after waking, with nothing to do, was itself a serious trigger (Fernandez et al., 2021).",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does your version of the trap involve?",
                "checks": [
                  {
                    "key": "nightstand",
                    "label": "The phone on the bedside table",
                    "asIn": "It’s six inches from my hand before I have had a thought",
                    "short": "the phone on the bedside table"
                  },
                  {
                    "key": "waking",
                    "label": "Waking with nothing to do",
                    "asIn": "The empty stretch at three in the morning, when the phone is the only thing awake",
                    "short": "waking with nothing to do"
                  },
                  {
                    "key": "hours",
                    "label": "A shut door and an empty evening",
                    "asIn": "The room is sealed and the evening behind it had no shape",
                    "short": "a shut door and an empty evening"
                  },
                  {
                    "key": "morning",
                    "label": "The reach first thing",
                    "asIn": "It happens before the day has properly started",
                    "short": "the reach first thing"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "reach",
                "headline": "What is within arm's reach of your bed?",
                "helper": "Take an honest inventory.",
                "options": [
                  "The phone",
                  "A tablet",
                  "A laptop",
                  "A television",
                  "A charger that lives there",
                  "Nothing much"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "nightstand",
                    "headline": "The phone on the bedside table is the whole trap for you, because at your weakest hour it asks nothing of you but a reach.",
                    "body": "Move the fight to ten in the evening, which is where you win it, and by one in the morning there’s nothing left to decide."
                  },
                  {
                    "key": "waking",
                    "headline": "Waking with nothing to do is your trap, and nobody grits their teeth well at three in the morning.",
                    "body": "If the phone is sleeping somewhere else then the waking has nothing to hand you, and you’ll usually just go back to sleep."
                  },
                  {
                    "key": "hours",
                    "headline": "The sealed room is your trap, and by now the room itself has become the cue.",
                    "body": "Open the door, move the screens out, and let the room go back to meaning sleep. It takes a few weeks and it doesn’t require you to resist anything."
                  },
                  {
                    "key": "morning",
                    "headline": "The reach first thing is your trap, which makes it the day's first choice made on autopilot.",
                    "body": "Charge the phone outside the room and the reach finds nothing there, which settles it without any argument."
                  },
                  {
                    "key": "none",
                    "headline": "If that scene doesn’t fit you, then find your own version of it.",
                    "body": "Somewhere there’s a device waiting within reach at your weakest hour. The principle is the same and only the room is different."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The phone",
                      "A charger that lives there"
                    ],
                    "body": "The charger is the anchor, so move that to the kitchen and the phone follows it. The decision gets made while you can still think, which is the whole idea."
                  },
                  {
                    "options": [
                      "A tablet",
                      "A laptop",
                      "A television"
                    ],
                    "body": "More screens means more to move, and every one that leaves the room is one fewer test at your worst hour."
                  },
                  {
                    "options": [
                      "Nothing much"
                    ],
                    "body": "You have nearly finished this job already. Hold the line, because the trap rebuilds itself one lazy night at a time."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "where",
                "headline": "Where is the phone sleeping tonight?",
                "helper": "Decide it now, at full strength.",
                "options": [
                  "In the kitchen",
                  "In the hallway",
                  "Across the room",
                  "In the bed, as usual"
                ],
                "result": "Tonight: {pick}"
              },
              {
                "kind": "collect",
                "title": "How the evening is set up",
                "template": "\"The phone sleeps {pick}, decided at ten in the evening instead of argued about at one in the morning.\"",
                "fallback": "\"I’m changing the set-up tonight. The phone leaves the bed, decided while I can still think clearly.\"",
                "source": "checks",
                "label": "What my trap involves:",
                "cta": "Save this"
              }
            ],
            "sources": "Cues being everywhere, and the bedroom and phone-in-bed setup acting as a default trigger, are from the evidence base, Part B1(a); the quote (\"lying in bed... a serious trigger\") is a pre-vetted, anonymised forum quote from Fernandez et al. (2021), used as illustrative voice, not a named case. Stimulus control (changing the environment rather than relying on willpower) is a Tier 1-2 strategy in the evidence base.",
            "action": "Charge your phone outside the bedroom this week. Track the nights you manage it.",
            "reflection": "Describe your own \"1 a.m. trap\" in one concrete sentence, where you are, what's in reach. Then name the single change to that scene you'll make at 10 p.m. tonight."
          },
          {
            "number": 43,
            "heading": "A day with shape resists cravings",
            "title": "Giving the day a shape",
            "tag": "evidence — boredom trigger",
            "tagColor": "#375623",
            "sub": "II.D",
            "week": 3,
            "day": 13,
            "order": 42,
            "slug": "giving-the-day-a-shape-43",
            "pages": [
              {
                "kind": "teach",
                "headline": "A blank day works against you in two ways at once.",
                "body": "Boredom is one of the most commonly reported triggers there is, and a day with no current in it gives an urge nothing to compete against. You end up sitting in it, and sitting in it’s how it wins.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "New routines take time to feel automatic.",
                "body": "In one study of everyday habits, the median was 66 days, with a range from 18 to 254 days (Lally et al., 2010). This was not addiction research, so use it as a rough guide, not a promise.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which part of your week has the least shape?",
                "checks": [
                  {
                    "key": "saturday",
                    "label": "Saturdays",
                    "asIn": "I wake with no plan and I’m scrolling by midday",
                    "short": "Saturdays"
                  },
                  {
                    "key": "evenings",
                    "label": "Weekday evenings",
                    "asIn": "Work ends and nothing takes over from it",
                    "short": "weekday evenings"
                  },
                  {
                    "key": "gap",
                    "label": "The hour after work",
                    "asIn": "That flat stretch between finishing and working out what the night is",
                    "short": "the hour after work"
                  },
                  {
                    "key": "prebed",
                    "label": "The hour before bed",
                    "asIn": "The day is done and there’s nothing left but the phone",
                    "short": "the hour before bed"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "anchors",
                "headline": "Which of these could your week hold?",
                "helper": "Three or four fixed points is plenty. This isn’t a timetable.",
                "options": [
                  "A fixed time to get up",
                  "Moving in the morning",
                  "One thing booked each day",
                  "A wind-down in the evening",
                  "A standing phone call",
                  "Cooking a proper meal"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "saturday",
                    "headline": "A shapeless Saturday needs one fixed point before eleven in the morning.",
                    "body": "A day that starts with some current in it tends to keep it, because the afternoon inherits whatever the morning was doing."
                  },
                  {
                    "key": "evenings",
                    "headline": "Your evenings need a handover rather than a whole plan.",
                    "body": "One fixed thing at the border between work and home means the urge has to compete with somewhere you’re already going, and it usually loses that."
                  },
                  {
                    "key": "gap",
                    "headline": "That flat hour after work is your whole battle, because it’s the emptiest water in your week.",
                    "body": "Drop the anchor right in the middle of it, not at either end, since the middle is where the drifting starts."
                  },
                  {
                    "key": "prebed",
                    "headline": "The last hour needs a shape of its own, and ideally one with no screen in it.",
                    "body": "Blank time and a tired brain is the classic pairing, and it’s avoidable once you have decided what the hour is for."
                  },
                  {
                    "key": "none",
                    "headline": "If no stretch feels shapeless, then your structure is already doing its job.",
                    "body": "Keep the fixed points where they’re and treat this lesson as an audit you have passed."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A fixed time to get up",
                      "A wind-down in the evening"
                    ],
                    "body": "The start and the end hold up everything in between, so if you fix those two the middle of the day mostly organises itself."
                  },
                  {
                    "options": [
                      "One thing booked each day",
                      "A standing phone call"
                    ],
                    "body": "Anything you owe to another person holds best, because a booked thing survives moods that a private plan won’t."
                  },
                  {
                    "options": [
                      "Moving in the morning",
                      "Cooking a proper meal"
                    ],
                    "body": "Anchors that use your body count twice over, since they give the hour a shape and spend some of the restlessness at the same time."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "anchor",
                "headline": "What goes into the empty stretch?",
                "helper": "One thing, dropped into the middle of it.",
                "options": [
                  "A fixed time to get up",
                  "Moving in the morning",
                  "One thing booked",
                  "A wind-down in the evening",
                  "A standing call"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The shape of the week",
                "template": "\"One fixed point goes into the empty hours, which for me is {pick}. And if it still feels like effort on day nine, that means it’s working, not failing.\"",
                "fallback": "\"I’ll drop one fixed point into the emptiest stretch of my week.\"",
                "source": "checks",
                "label": "The shapeless part:",
                "cta": "Save this"
              }
            ],
            "sources": "Boredom as one of the most commonly reported relapse triggers, and unstructured time as fertile ground for use, are from the evidence base, Part B1(b), and the forum dataset (boredom or nothing-to-do cluster), used as aggregate pattern. Habit automaticity taking a median of 66 days (range 18 to 254) is from Lally et al. (2010), a study of everyday habits like diet and exercise, not addiction; used only to set realistic expectations for how long a new routine takes to feel automatic, never as a recovery timeline.",
            "action": "Pre-plan three daily anchor points (wake, move, wind-down) and track how many days you keep them.",
            "reflection": "Name the single emptiest, most shapeless stretch in your typical week, the dead hours. What's one small anchor you could drop into the middle of it?"
          },
          {
            "number": 44,
            "heading": "Know your urge windows",
            "title": "When your urges arrive",
            "tag": "folklore/observational",
            "tagColor": "#843C3C",
            "sub": "II.D",
            "week": 3,
            "day": 14,
            "order": 43,
            "slug": "when-your-urges-arrive-44",
            "pages": [
              {
                "kind": "teach",
                "headline": "The universal theories about when urges strike are guesswork dressed up.",
                "body": "Hormone peaks at dawn, dopamine troughs at three in the afternoon, and so on. But underneath the bad explanations, your own pattern is usually real, and watching your own life is a method you can trust in a way you can’t trust a diagram on a forum.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Urges feel random and they very rarely are.",
                "body": "They cluster around particular times, moods and places that repeat every week. Most of the randomness is what never having checked looks like, and a week of writing things down usually clears it up.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "If you had to guess, when do yours arrive?",
                "checks": [
                  {
                    "key": "firstthing",
                    "label": "First thing in the morning",
                    "asIn": "Before the day has had any say in it",
                    "short": "first thing"
                  },
                  {
                    "key": "postwork",
                    "label": "The flat hour after work",
                    "asIn": "Finished, but not landed anywhere yet",
                    "short": "the hour after work"
                  },
                  {
                    "key": "latenight",
                    "label": "Late at night",
                    "asIn": "The day is done and the house has gone quiet",
                    "short": "late at night"
                  },
                  {
                    "key": "dip",
                    "label": "The mid-afternoon dip",
                    "asIn": "The energy trough, dressed up as an urge",
                    "short": "the afternoon dip"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "wears",
                "headline": "What feeling does it usually arrive in?",
                "helper": "The mood that comes with the window.",
                "options": [
                  "Loneliness",
                  "Boredom",
                  "Tiredness",
                  "Restlessness",
                  "Low mood",
                  "Plain habit"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "firstthing",
                    "headline": "A morning window means the preparation happens the night before, not on the day.",
                    "body": "Whatever is within reach at seven in the morning was decided at eleven the previous night, so that is where you make the change."
                  },
                  {
                    "key": "postwork",
                    "headline": "The hour after work is the classic one, and no theory is needed to explain it.",
                    "body": "Drop something into the middle of it before the week starts, and treat it as a standing appointment, not a thing you’ll sort out on the day."
                  },
                  {
                    "key": "latenight",
                    "headline": "A late window focuses your plan on what time the lights go out.",
                    "body": "Lessons 15 and 42 are the pair that matter for you, and they work better run together than separately."
                  },
                  {
                    "key": "dip",
                    "headline": "If it tracks the afternoon dip, then treat it as an energy problem first and an urge second.",
                    "body": "Eat something, move, or step outside at three, and then see what is left of the urge afterwards. Quite often there’s not much."
                  },
                  {
                    "key": "none",
                    "headline": "Having no guess is a perfectly good place to start from.",
                    "body": "That’s exactly what a week of logging is for, and the data will name the window more accurately than a guess would have."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Loneliness",
                      "Low mood"
                    ],
                    "body": "If the window arrives wearing a feeling, write the feeling next to the time. The same hour plus the same feeling is your actual trigger, and it’s twice as easy to plan around."
                  },
                  {
                    "options": [
                      "Boredom",
                      "Plain habit"
                    ],
                    "body": "If it arrives as boredom or bare habit then the window is structural. That means filling the hour closes it without any inner work at all."
                  },
                  {
                    "options": [
                      "Tiredness",
                      "Restlessness"
                    ],
                    "body": "If it arrives with the body's states then the body lessons are your counter-move, because the window is sitting downstream of how depleted you are."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "guess",
                "headline": "Commit to a guess before you look",
                "helper": "The gap between the guess and the data is where the lesson is.",
                "options": [
                  "First thing",
                  "The hour after work",
                  "Late at night",
                  "The afternoon dip"
                ],
                "result": "My guess: {pick}"
              },
              {
                "kind": "collect",
                "title": "The wager",
                "template": "\"My guess is {pick}. Now a week of writing it down, and whatever gap turns up between the guess and the data is the thing worth knowing.\"",
                "fallback": "\"I haven’t guessed, so the log starts clean: a week of times, places and feelings.\"",
                "source": "checks",
                "label": "Where I think they land:",
                "cta": "Save this"
              }
            ],
            "sources": "The specific biological claims tied to particular times of day (hormone peaks, dopamine troughs) are labelled folklore. The value of mapping your own recurring high-risk windows is observational and personal, and aligns with self-monitoring and trigger identification, which are Tier 1 strategies in the evidence base.",
            "action": "Log the time of day of each urge this week. After seven days, look for your personal peak.",
            "reflection": "Without checking yet, guess your two riskiest windows. Then log for a week and see if you were right. The gap between the guess and the data is often the most useful part."
          }
        ]
      },
      {
        "code": "II.E",
        "title": "Chains and dominoes",
        "description": "Tracing a slip back to the point where it could still be stopped cheaply.",
        "lessons": [
          {
            "number": 45,
            "heading": "CBT trigger chains",
            "title": "The five links",
            "tag": "evidence — CBT",
            "tagColor": "#375623",
            "sub": "II.E",
            "week": 3,
            "day": 15,
            "order": 44,
            "slug": "the-five-links-45",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"It just happened\" is a compressed version of a much longer story.",
                "body": "Slow it down and a relapse turns out to be a chain with about five links in it.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "A cue",
                    "A thought",
                    "A feeling",
                    "A ritual",
                    "The act"
                  ],
                  "note": "The early links are far weaker than the last one."
                }
              },
              {
                "kind": "teach",
                "headline": "Breaking the chain at the act is close to impossible, and breaking it at the cue is close to trivial.",
                "body": "By the time you reach the act you’re at peak wanting with full momentum behind you. At the cue you weren’t even aroused yet. You put the phone in another room and went and did something else.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Looking back, what do your slips feel like?",
                "checks": [
                  {
                    "key": "instant",
                    "label": "One instant event",
                    "asIn": "Fine one moment and done the next",
                    "short": "one instant event"
                  },
                  {
                    "key": "happened",
                    "label": "Something that just happened",
                    "asIn": "There’s no decision anywhere in the story",
                    "short": "something that just happened"
                  },
                  {
                    "key": "slide",
                    "label": "A smooth slide",
                    "asIn": "I can see the steps afterwards but never during",
                    "short": "a smooth slide"
                  },
                  {
                    "key": "visible",
                    "label": "A chain I can already see",
                    "asIn": "I can name the links",
                    "short": "a chain I can see"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "links",
                "headline": "Which links can you name in your own chain?",
                "helper": "Take your last slip and slow it down.",
                "options": [
                  "The cue: alone, late, phone in hand",
                  "The thought: I deserve a minute",
                  "The feeling: it starts to sharpen",
                  "The ritual: the same opening moves",
                  "The act, arriving last"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "instant",
                    "headline": "What feels instant is five stages wearing a single coat.",
                    "body": "Write your last slip out as cue, thought, feeling, ritual and act, and watch the one moment come apart into steps that each had a bit of time in them."
                  },
                  {
                    "key": "happened",
                    "headline": "If it just happened, then the choosing happened somewhere upstream, in links nobody was counting.",
                    "body": "Count them once and they stop being invisible, and once they’re visible they stop being automatic."
                  },
                  {
                    "key": "slide",
                    "headline": "A slide has a top, and the top of a slide is nearly flat.",
                    "body": "Your map has one job, which is to find the flat part where stepping off costs you almost nothing."
                  },
                  {
                    "key": "visible",
                    "headline": "A chain you can already see needs one more thing, which is a circle drawn on it.",
                    "body": "Mark the earliest link you could realistically break, and then put your effort there and nowhere else."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The cue: alone, late, phone in hand"
                    ],
                    "body": "Your break point is the set-up, and this part has already given you the tools for it. Remove the cue and the rest of the cascade never gets going."
                  },
                  {
                    "options": [
                      "The thought: I deserve a minute",
                      "The feeling: it starts to sharpen"
                    ],
                    "body": "The middle links answer to naming. Saying \"I’m having the thought that I deserve this\" is cheap at link two and useless at link five, so the timing is what matters."
                  },
                  {
                    "options": [
                      "The ritual: the same opening moves",
                      "The act, arriving last"
                    ],
                    "body": "If you can only see the late links, then trace backwards from the ritual, because the first move of a ritual always has a quieter cause a few minutes before it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "break",
                "headline": "Which link could you realistically break?",
                "helper": "The cheapest one wins.",
                "options": [
                  "The cue",
                  "The thought",
                  "The feeling",
                  "The ritual"
                ],
                "result": "I'll break it at: {pick}"
              },
              {
                "kind": "collect",
                "title": "The chain",
                "template": "\"My chain runs cue, thought, feeling, ritual, act. I break it at {pick}, where it’s still weak enough to break.\"",
                "fallback": "\"This week I’ll write my last slip out as five links and circle the earliest one I could break.\"",
                "source": "checks",
                "label": "How slips have looked:",
                "cta": "Save this"
              }
            ],
            "sources": "Chain analysis (functional analysis) is a core CBT technique. CBT, alongside ACT, has the best controlled evidence for problematic pornography use, per the evidence base. Acting on early links also draws on stimulus control (Week 3).",
            "action": "Write out your last slip as a chain (cue → thought → feeling → ritual → act). Mark the earliest breakable link.",
            "reflection": "Map one real chain of your own, link by link. Circle the earliest link you could realistically break. That's where your effort is cheapest and most effective."
          },
          {
            "number": 46,
            "heading": "The slip starts upstream (apparently irrelevant decisions)",
            "title": "The first domino",
            "tag": "evidence — relapse prevention",
            "tagColor": "#375623",
            "sub": "II.E",
            "week": 3,
            "day": 16,
            "order": 45,
            "slug": "the-first-domino-46",
            "pages": [
              {
                "kind": "teach",
                "headline": "Almost every slip, told honestly, contains the phrase \"I wasn’t even going to, I just...\".",
                "body": "And the real story is hiding in whatever comes after the word \"just\". The slip started hours earlier, in a small choice you’d never have flagged as having anything to do with it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Relapse research has a name for these, which is apparently irrelevant decisions.",
                "body": "Each one is trivial and deniable on its own, but together they assemble the exact scene you’re most at risk in, so that by the time the urge arrives all the real decisions have already been taken. The early ones were taken while you were calm, which is where changing them is cheap.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do your own \"I just\" choices sound like?",
                "checks": [
                  {
                    "key": "phonebed",
                    "label": "\"I'll just keep the phone in bed\"",
                    "asIn": "It sets the whole scene and it feels like nothing at the time",
                    "short": "keeping the phone in bed"
                  },
                  {
                    "key": "uplater",
                    "label": "\"I'll just stay up a bit longer\"",
                    "asIn": "The hour stretches towards the risky one",
                    "short": "staying up a bit longer"
                  },
                  {
                    "key": "innocentscroll",
                    "label": "\"I'll just have a quick scroll\"",
                    "asIn": "An aimless open that somehow knows where it’s going",
                    "short": "having a quick scroll"
                  },
                  {
                    "key": "looseningdrink",
                    "label": "\"Just the one drink\"",
                    "asIn": "The gate comes down a notch, deniably",
                    "short": "having just the one drink"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "upstreamrules",
                "headline": "What rule would remove it?",
                "helper": "Written calm, applied early.",
                "options": [
                  "The phone charges outside the room at ten",
                  "Lights out before the drift hour",
                  "No opening the app without a reason",
                  "Nights alone get planned in advance"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "phonebed",
                    "headline": "The phone in the bed is the classic first domino, because there’s no urge in sight when you put it there.",
                    "body": "By the time an urge does turn up, the whole scene has been assembled around you, and you’d have had to be a prophet to see it coming."
                  },
                  {
                    "key": "uplater",
                    "headline": "Staying up a bit longer walks you straight into the window you mapped in Lesson 44.",
                    "body": "The lights-out rule is boring because it works this far upstream, and boring rules are the ones that survive bad nights."
                  },
                  {
                    "key": "innocentscroll",
                    "headline": "A quick scroll is deniable by design, because it has no stated destination.",
                    "body": "That’s exactly how it reaches the usual one. The counter-question is a simple one: opened for what?"
                  },
                  {
                    "key": "looseningdrink",
                    "headline": "The drink tips all the other dominoes more easily than they would otherwise fall.",
                    "body": "Lesson 21's logic applies here, one decision earlier than it appears to."
                  },
                  {
                    "key": "none",
                    "headline": "If none of those phrases rings true, then trace your last slip backwards until one of them does.",
                    "body": "The feeling of having been ambushed is almost always a chain that has been traced too short."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The phone charges outside the room at ten",
                      "Lights out before the drift hour"
                    ],
                    "body": "The night rules kill the commonest dominoes at almost no cost. Decided at dinner, done by ten, and nothing left to win at midnight."
                  },
                  {
                    "options": [
                      "No opening the app without a reason",
                      "Nights alone get planned in advance"
                    ],
                    "body": "Those two work on the deniable middle of the chain, by requiring an opening to have a stated purpose and an evening alone to have a shape."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "dominorule",
                "headline": "What is your rule?",
                "helper": "One rule, aimed upstream.",
                "options": [
                  "Phone out of the room at ten",
                  "Lights out before the drift hour",
                  "Say what I opened it for",
                  "Plan the nights I am alone"
                ],
                "result": "My rule: {pick}"
              },
              {
                "kind": "collect",
                "title": "Upstream",
                "template": "\"The slip starts upstream. My first domino is {checks}, and the rule that removes it is {pick}.\"",
                "fallback": "\"This week I’ll trace my last slip past its 'just', and give the first domino a rule.\"",
                "source": "checks",
                "label": "My usual \"just\":",
                "cta": "Save this"
              }
            ],
            "sources": "\"Apparently irrelevant decisions\" is a core concept in Marlatt and Gordon's relapse-prevention model, and aligns with the trigger-chain / gradual-slide findings in the evidence base (Part B1(d)). Acting on early links is stimulus control (Week 3).",
            "action": "Trace your last one or two slips back to the first small \"irrelevant\" decision that set them up. Name your top two or three recurring ones, and write a rule for each.",
            "reflection": "What's the small, deniable choice that most often turns out to be your first domino? Name it, and the upstream rule you'll use to break the chain early."
          },
          {
            "number": 47,
            "heading": "Track leading indicators",
            "title": "The early warnings",
            "tag": "plausible — behaviour change",
            "tagColor": "#0B3C49",
            "sub": "II.E",
            "week": 3,
            "day": 17,
            "order": 46,
            "slug": "the-early-warnings-47",
            "pages": [
              {
                "kind": "teach",
                "headline": "The wave doesn’t really ambush you, however much it feels that way afterwards.",
                "body": "It sends things on ahead of it: a restlessness, a reach for the phone, a door closed. Learn to spot your own early signs and the wave loses most of its element of surprise.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A day counter can only ever report the past. That’s why it’s such a poor instrument.",
                "body": "But how you slept, what the day took out of you, and whether you have spoken to anybody all run ahead of a slip. Those are called leading indicators. And they warn you while there’s still time to do something about it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "In the hours before a slip, what are you doing?",
                "checks": [
                  {
                    "key": "scrolling",
                    "label": "Scrolling restlessly",
                    "asIn": "Round the same three apps, wanting none of them",
                    "short": "scrolling restlessly"
                  },
                  {
                    "key": "sleep",
                    "label": "Putting off going to bed",
                    "asIn": "Tired at eleven, still up at one, with nothing to show for it",
                    "short": "putting off going to bed"
                  },
                  {
                    "key": "fine",
                    "label": "Saying I’m fine when I’m not",
                    "asIn": "Somebody asks and \"fine\" comes out flat",
                    "short": "saying I am fine"
                  },
                  {
                    "key": "alone",
                    "label": "Arranging to be on my own",
                    "asIn": "setting up an evening where nobody will be about",
                    "short": "arranging to be alone"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "under",
                "headline": "And what is usually underneath it?",
                "helper": "Pick every one that rings true.",
                "options": [
                  "Lonely",
                  "Wound up",
                  "Bored",
                  "Low",
                  "Irritable",
                  "Numb",
                  "Tired",
                  "Out of place",
                  "Hungry"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "scrolling",
                    "headline": "For you the wave announces itself as restless scrolling, round the same three apps, wanting none of them.",
                    "body": "When you catch yourself doing that, the wave is already on its way, and you have got maybe twenty minutes in which to do something cheap about it."
                  },
                  {
                    "key": "sleep",
                    "headline": "For you the wave announces itself as a stretched-out night.",
                    "body": "Tired at eleven, still up at one, and nothing to show for the two hours in between. That’s the sign, and going to bed is the answer to it."
                  },
                  {
                    "key": "fine",
                    "headline": "For you the wave announces itself in the word fine.",
                    "body": "It’s the answer that closes a conversation down, so notice it as it leaves your mouth, because it usually means something is being avoided."
                  },
                  {
                    "key": "alone",
                    "headline": "For you the wave announces itself as an evening cleared.",
                    "body": "It feels like a preference at the time and it’s a warning, so treat a cleared evening as a signal, not as a plan."
                  },
                  {
                    "key": "none",
                    "headline": "If today's list doesn’t fit, then your early signs wear different clothes.",
                    "body": "For one week, write down what shows up in the hour before trouble, and you’ll have your own list instead of mine."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Lonely",
                      "Out of place"
                    ],
                    "body": "Since it’s usually loneliness underneath, the early move is contact. One message tonight does more than an hour of resolve at midnight will."
                  },
                  {
                    "options": [
                      "Wound up",
                      "Irritable"
                    ],
                    "body": "Since it’s usually a wound-up restlessness underneath, the early move is to move. A walk drains it faster than gritting your teeth can hold it."
                  },
                  {
                    "options": [
                      "Tired",
                      "Low"
                    ],
                    "body": "Since you’re usually running low underneath, the early move is sleep. Protect tonight as though it were the whole plan, because on those days it is."
                  },
                  {
                    "options": [
                      "Bored",
                      "Numb"
                    ],
                    "body": "Since it’s usually flatness underneath, the early move is shape. Give tomorrow one fixed thing with a time and a place attached to it."
                  },
                  {
                    "options": [
                      "Hungry"
                    ],
                    "body": "Since it’s often plain hunger underneath, the early move is the boring one. Eat something properly and then check again before you believe anything."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "anchor",
                "headline": "When will you check?",
                "helper": "Attach it to something you already do, so it takes two seconds.",
                "options": [
                  "With my morning coffee",
                  "When I brush my teeth",
                  "On the commute",
                  "Winding down in bed",
                  "A habit of my own"
                ],
                "result": "Checking: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your early signs",
                "template": "\"If I notice I am {checks}, then the wave is on its way and I go to the tools first instead of waiting.\"",
                "fallback": "\"When one of my early signs shows up, the wave is coming, and I go to the tools first.\"",
                "source": "checks",
                "label": "What is underneath:",
                "cta": "Save this"
              }
            ],
            "sources": "The leading/lagging distinction is general behaviour-change knowledge; the specific predictors (sleep, mood, connection, structure) draw on the trigger findings in the evidence base (Part B1) and Weeks 2/6. Replacing the zero-reset count implements the base's anti-shame recommendation. Kept at \"plausible.\"",
            "action": "Track sleep, mood, connection, and structure each day. Act when several warning signs get worse.",
            "reflection": "Pick the three warning signs that best predict a slip, such as poor sleep, isolation, or an empty day. Check them daily and decide what you will do when several get worse."
          }
        ]
      },
      {
        "code": "II.F",
        "title": "Deciding in advance",
        "description": "Make important decisions before the urge.",
        "lessons": [
          {
            "number": 48,
            "heading": "If-then plans",
            "title": "Deciding it in advance",
            "tag": "evidence — implementation intentions",
            "tagColor": "#375623",
            "sub": "II.F",
            "week": 3,
            "day": 18,
            "order": 47,
            "slug": "deciding-it-in-advance-48",
            "pages": [
              {
                "kind": "teach",
                "headline": "Deciding in the middle of an urge means deciding at the worst possible moment.",
                "body": "An if-then plan does the deciding beforehand, while you’re calm, in the form of \"if this happens, I’ll do that\". When the situation turns up, the response is already sitting there waiting and no new willpower is required.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This is one of the most heavily tested ideas in behaviour science, which is unusual for something so simple.",
                "body": "Across 94 studies, people who wrote if-then plans followed through on their goals substantially more often than people who only had intentions (Gollwitzer & Sheeran, 2006). Those were general goals rather than this one, but the mechanism carries over directly.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does deciding in the moment look like for you?",
                "checks": [
                  {
                    "key": "scramble",
                    "label": "A scramble",
                    "asIn": "What do I do, what do I do, with the worst possible brain",
                    "short": "a scramble"
                  },
                  {
                    "key": "justonce",
                    "label": "A negotiation",
                    "asIn": "Maybe just this once, and it only ever ends one way",
                    "short": "a negotiation"
                  },
                  {
                    "key": "losedebate",
                    "label": "A debate I lose",
                    "asIn": "I assemble the arguments and then ignore the verdict",
                    "short": "a debate I lose"
                  },
                  {
                    "key": "autopilot",
                    "label": "No debate at all",
                    "asIn": "It goes from trigger to act with nothing in between",
                    "short": "no debate at all"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "triggers",
                "headline": "Which of your triggers are most predictable?",
                "helper": "These are the \"if\" half, taken from your own map.",
                "options": [
                  "Alone at night with the phone",
                  "The flat hour after work",
                  "The end of a bad day",
                  "Not being able to sleep",
                  "Hours alone in the house"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "scramble",
                    "headline": "A scramble is what a missing plan feels like from the inside.",
                    "body": "The plan replaces it with a corridor, which is one trigger leading to one response that you have already walked through in advance."
                  },
                  {
                    "key": "justonce",
                    "headline": "The negotiation dies when the answer already exists before the question is asked.",
                    "body": "A clear decision made in advance leaves less room to negotiate during an urge."
                  },
                  {
                    "key": "losedebate",
                    "headline": "Stop assembling arguments and load an action instead.",
                    "body": "\"Then I’ll resist\" is only willpower with extra steps. \"Then I’ll go into the kitchen and put the phone on the charger\" is a plan."
                  },
                  {
                    "key": "autopilot",
                    "headline": "Autopilot has to be met with a competing autopilot, not with an argument.",
                    "body": "An if-then rule, rehearsed a few times, fires on the same cue and gets there first, which is the only way to beat something automatic."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Alone at night with the phone",
                      "Not being able to sleep"
                    ],
                    "body": "The plan writes itself. If I’m awake with the phone in reach, then the phone goes to the kitchen and I go back to bed."
                  },
                  {
                    "options": [
                      "The flat hour after work",
                      "Hours alone in the house"
                    ],
                    "body": "The empty-hour triggers pair well with contact or with leaving the house. Then I text a friend, or then I step outside. Small and exact, so that they’re doable while flooded."
                  },
                  {
                    "options": [
                      "The end of a bad day"
                    ],
                    "body": "Write the bad-day plan first, because it’s the most predictable fight you have, and Lesson 11 has already given you its forecast."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "response",
                "headline": "What is the \"then\"?",
                "helper": "One exact move, small enough for your worst night.",
                "options": [
                  "Go to the kitchen and plug the phone in",
                  "Text a friend",
                  "Step outside",
                  "Ten press-ups",
                  "Put the kettle on"
                ],
                "result": "My plan: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your plan",
                "template": "\"If {grid}, then I {pick}. Decided now, while calm, and ready for the night I need it.\"",
                "fallback": "\"I’ll write three if-then rules this week, one for each mapped trigger, each small enough for my worst night.\"",
                "source": "checks",
                "label": "What deciding in the moment was:",
                "cta": "Save this"
              }
            ],
            "sources": "Implementation intentions (if-then plans) are one of the most heavily-tested behaviour-change techniques in psychology: a meta-analysis of 94 studies found a medium-to-large effect on goal follow-through (d ≈ 0.65) (Gollwitzer & Sheeran, 2006). That evidence spans general goal domains, not pornography specifically, but the mechanism, pre-deciding a response to a known trigger, applies directly. Built here on the user's own mapped triggers (self-monitoring, a Tier 1 strategy in the evidence base).",
            "action": "Write three if-then rules for your most common triggers. Track when you use them.",
            "reflection": "Write one full if-then plan right now for your single most common trigger: \"If ______, then I will ______.\" Make the \"then\" small enough to do on your worst night."
          },
          {
            "number": 49,
            "heading": "Say your why out loud",
            "title": "Telling one person",
            "tag": "plausible — commitment",
            "tagColor": "#0B3C49",
            "sub": "II.F",
            "week": 3,
            "day": 19,
            "order": 48,
            "slug": "telling-one-person-49",
            "pages": [
              {
                "kind": "teach",
                "headline": "A reason you have only ever kept to yourself can disappear without costing you anything.",
                "body": "Nobody saw you make it, so nobody sees you drop it at one in the morning. Telling one person changes that arithmetic, and one sentence is enough to do it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Agree in advance that slips will be met with curiosity, not contempt.",
                "body": "Warm support helps people change. Nagging and policing often backfire. The agreement should make honesty safer, not add pressure.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What has stopped you telling anyone?",
                "checks": [
                  {
                    "key": "differently",
                    "label": "They would think less of me",
                    "asIn": "I’m afraid of the change in somebody's face",
                    "short": "fearing they would think less of me"
                  },
                  {
                    "key": "real",
                    "label": "It would make it real",
                    "asIn": "Once it’s said out loud I can’t deny it to myself",
                    "short": "not wanting it to be real"
                  },
                  {
                    "key": "nobody",
                    "label": "There’s nobody safe",
                    "asIn": "There’s no one within reach who would hold it gently",
                    "short": "having nobody safe"
                  },
                  {
                    "key": "alone",
                    "label": "I want to beat it alone first",
                    "asIn": "I’d tell people after the victory, not during the fight",
                    "short": "wanting to do it alone"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "expect",
                "headline": "How do you expect saying it would feel?",
                "helper": "Pick every one that applies.",
                "options": [
                  "Lighter",
                  "Exposed",
                  "Ashamed",
                  "Relieved",
                  "Frightening",
                  "Closer to them",
                  "Not much either way"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "differently",
                    "headline": "The fear of the changed face is manufactured by shame, and it’s almost always wrong.",
                    "body": "What usually happens is the opposite of what you expect, because being trusted with something real tends to deepen a friendship instead of damage it."
                  },
                  {
                    "key": "real",
                    "headline": "Making it real is the point, not the risk.",
                    "body": "A thing you can still deny to yourself stays free to run. Said out loud once, it starts to cost something to abandon, and that cost is on your side."
                  },
                  {
                    "key": "nobody",
                    "headline": "Having nobody safe within reach is itself worth knowing, because it tells you what to build.",
                    "body": "A kind community or a therapist can be the witness in the meantime, and that is part of what Part VI is for."
                  },
                  {
                    "key": "alone",
                    "headline": "Wanting to do it alone first is the secrecy talking, and it’s very persuasive.",
                    "body": "It books the witness for after the war, which is when you no longer need one, so it manages to sound like a plan while removing the help."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Exposed",
                      "Frightening"
                    ],
                    "body": "The bar is much lower than the fear suggests. One sentence, said once, with no detail at all, and you’re allowed to stop there."
                  },
                  {
                    "options": [
                      "Ashamed"
                    ],
                    "body": "Note what the shame predicts and then watch it be wrong, because that is useful evidence. Secrets that get spoken shrink, and secrets that stay sealed grow."
                  },
                  {
                    "options": [
                      "Lighter",
                      "Relieved",
                      "Closer to them"
                    ],
                    "body": "Your own guess agrees with the evidence here. The secret loses its power at the moment it’s spoken, so trust the lighter feeling you’re expecting."
                  },
                  {
                    "options": [
                      "Not much either way"
                    ],
                    "body": "If it moves nothing, then you have spent one sentence. Tiny cost and a real possible upside, which is the whole argument for trying it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "who",
                "headline": "Who could hold one sentence?",
                "helper": "Safe matters more than close.",
                "options": [
                  "An old friend",
                  "My partner",
                  "Somebody in my family",
                  "A mentor or a coach",
                  "An online group",
                  "Nobody safe yet"
                ],
                "result": "Telling: {pick}"
              },
              {
                "kind": "collect",
                "title": "The witness",
                "template": "\"{pick} gets one sentence this week, which is that I’m changing my relationship with porn because I want my time back.\"",
                "fallback": "\"There’s nobody safe yet, and that is noted. Part VI builds the witness, and the sentence waits, already written.\"",
                "source": "checks",
                "label": "What has stopped me:",
                "cta": "Save this"
              }
            ],
            "sources": "Non-shaming accountability is among the most-credited strategies in the evidence base (Part B4), with the documented condition that it must be non-shaming (Part B3). Cross-addiction parallel: supportive, non-judgemental support aids smoking and substance cessation, while criticism undermines it (general finding).",
            "action": "Tell one trusted person your reason this week. One sentence is enough.",
            "reflection": "Name the one person you'd trust with this, and the single sentence you'd say. Writing it now makes saying it later far more likely."
          },
          {
            "number": 50,
            "heading": "Make the later choice harder",
            "title": "Make the later choice harder",
            "tag": "plausible — commitment devices",
            "tagColor": "#0B3C49",
            "sub": "II.F",
            "week": 3,
            "day": 20,
            "order": 49,
            "slug": "make-the-later-choice-harder-50",
            "pages": [
              {
                "kind": "teach",
                "headline": "Your judgement changes during a strong late-night urge.",
                "body": "Make the unwanted choice harder while you are calm. Then you do not have to rely on willpower during the urge.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A commitment device is any arrangement made while you can think that makes the unwanted choice harder later on.",
                "body": "That might mean options removed, or a password held by somebody else, or a small stake agreed in advance. In one trial, smokers who locked their own money against a nicotine test six months later quit measurably more often, and the effect was still there at a surprise test afterwards (Giné, Karlan & Zinman, 2010). The wider research is mixed, so test it on yourself.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What can you still undo during a strong urge?",
                "checks": [
                  {
                    "key": "allpasswords",
                    "label": "All the passwords",
                    "asIn": "Every lock can be opened by the person it’s meant to stop",
                    "short": "holding all the passwords"
                  },
                  {
                    "key": "finalvote",
                    "label": "The final vote",
                    "asIn": "My calm plans get overturned at the last minute, most nights",
                    "short": "having the final vote"
                  },
                  {
                    "key": "workarounds",
                    "label": "All the routes round the fences",
                    "asIn": "I have every one of them memorised",
                    "short": "knowing all the routes round"
                  },
                  {
                    "key": "lessthan",
                    "label": "Less than he used to",
                    "asIn": "He holds less than he did",
                    "short": "holding less than before"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "devices",
                "headline": "Which device would you use?",
                "helper": "Choose while calm, then test whether it helps.",
                "options": [
                  "A blocker password held by a friend",
                  "A standing check-in I would hate to fail",
                  "The phone put away on a schedule",
                  "A small stake I would forfeit"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "allpasswords",
                    "headline": "If you hold every password, you can remove every blocker during an urge.",
                    "body": "Give one password to somebody reliable so you cannot undo the blocker in the moment."
                  },
                  {
                    "key": "finalvote",
                    "headline": "Remove options instead of relying on a stronger last-minute decision.",
                    "body": "If something is not available at one in the morning, you do not have to refuse it at one in the morning."
                  },
                  {
                    "key": "workarounds",
                    "headline": "Knowing all the routes round is what kills most devices before they start.",
                    "body": "Close the workarounds you already know before adding anything complicated."
                  },
                  {
                    "key": "lessthan",
                    "headline": "Add one more limit while you are calm.",
                    "body": "Each limit that holds makes the plan easier to trust."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A blocker password held by a friend",
                      "The phone put away on a schedule"
                    ],
                    "body": "Those two remove options instead of adding pressure, which makes them the gentlest and the most reliable. There’s nothing to resist, because there’s nothing available."
                  },
                  {
                    "options": [
                      "A standing check-in I would hate to fail",
                      "A small stake I would forfeit"
                    ],
                    "body": "Stakes suit some people and send others into a spiral. If losing a stake would turn into fuel for shame in your case, use the option-removing kind instead. That’s a design decision and it’s yours to make."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "device",
                "headline": "What are you setting up this week?",
                "helper": "Friction arranged in advance, chosen while calm.",
                "options": [
                  "A password given to a friend",
                  "A standing check-in",
                  "The phone away on a schedule",
                  "A small stake"
                ],
                "result": "Setting up: {pick}"
              },
              {
                "kind": "collect",
                "title": "My commitment device",
                "template": "\"While calm, I will set up {pick}. It makes the unwanted choice harder without punishing me.\"",
                "fallback": "\"I’ll set up one arrangement this week that is difficult to undo during an urge.\"",
                "source": "checks",
                "label": "What I can currently undo:",
                "cta": "Save this"
              }
            ],
            "sources": "Commitment devices and pre-commitment arrangements have real but mixed support in behavioural-economics research on health behaviours generally (no specific effect size claimed here). The \"Ulysses contract\" concept is general knowledge; the design caution (friction, not shame) aligns with the evidence base's anti-shame finding (Part B3). Added: the deposit-contract trial (Giné, Karlan & Zinman, 2010), stated with its low take-up caveat.",
            "action": "Set up one commitment device this week: a blocker password held by someone you trust, a standing accountability check-in, or a small stake you forfeit if you break an agreement. Choose it as upfront friction, not self-punishment.",
            "reflection": "Which kind fits you, removing the option entirely, or putting a stake on it, and who or what will hold you to it?"
          }
        ]
      }
    ]
  },
  {
    "n": 4,
    "title": "Part III · Survive the wave",
    "ground": "Ground IV · Held Ground",
    "description": "Some moments will still arrive whatever you have set up, so this part is about the skills that get you through one without leaning on willpower, from the first pause to the hardest spikes.",
    "subs": [
      {
        "code": "III.A",
        "title": "The two basic skills",
        "description": "Watching the wave, and unhooking from the sentence that comes with it.",
        "lessons": [
          {
            "number": 51,
            "heading": "Build a mindfulness base",
            "title": "Practising when it is easy",
            "tag": "plausible — mindfulness-based relapse prevention",
            "tagColor": "#0B3C49",
            "sub": "III.A",
            "week": 4,
            "day": 1,
            "order": 50,
            "slug": "practising-when-it-is-easy-51",
            "pages": [
              {
                "kind": "teach",
                "headline": "The two main skills in this part share a hidden requirement, which is being able to notice something without reacting to it.",
                "body": "And you can’t summon a skill in a crisis that you have never practised while calm. That’s why these tools wobble so badly the first time people reach for them mid-urge, and why the wobble isn’t a sign that they don’t work.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The practice itself is very simple. That’s why people underrate it.",
                "body": "You sit down, you follow your breathing, you notice that your mind has wandered off. And you bring it back. That loop, done daily, is exactly the same unhooking you’ll need in the middle of a wave. Count it as repetitions, not as a streak you could break.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happened when you reached for these tools in a crisis?",
                "checks": [
                  {
                    "key": "notthere",
                    "label": "The skill wasn’t there",
                    "asIn": "It sounded right and it just wouldn’t come",
                    "short": "the skill not being there"
                  },
                  {
                    "key": "calmonly",
                    "label": "It only works when I’m calm",
                    "asIn": "Fine on a quiet Tuesday and gone at the peak",
                    "short": "it only working when calm"
                  },
                  {
                    "key": "nevertried",
                    "label": "I have only tried it mid-crisis",
                    "asIn": "I have never practised it when nothing was happening",
                    "short": "only trying it mid-crisis"
                  },
                  {
                    "key": "comes",
                    "label": "It comes easily",
                    "asIn": "The groundwork is partly there already",
                    "short": "it coming fairly easily"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "slot",
                "headline": "Where would ten minutes fit?",
                "helper": "A slot that survives an ordinary week.",
                "options": [
                  "Before the first coffee",
                  "At lunchtime",
                  "On the commute, with my eyes open",
                  "Before bed",
                  "Straight after training"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "notthere",
                    "headline": "The skill wasn’t there because the repetitions weren’t there, and that is all it was.",
                    "body": "Nobody learns to swim after falling off the boat. Ten calm minutes a day is the swimming pool, and it’s dull in exactly the way that useful practice usually is."
                  },
                  {
                    "key": "calmonly",
                    "headline": "A skill that only works in fair weather is real progress that is half finished.",
                    "body": "More calm repetitions is how it becomes a foul-weather skill, so keep going instead of concluding that it doesn’t work for you."
                  },
                  {
                    "key": "nevertried",
                    "headline": "Start with nothing at stake, on purpose, and expect it to feel pointless at first.",
                    "body": "The wandering mind is the exercise, not a failure of it, and every time you catch it and come back, that counts as one repetition."
                  },
                  {
                    "key": "comes",
                    "headline": "Groundwork that is already there still needs maintaining.",
                    "body": "And yours makes every other tool in this part cheaper to use, so guard the slot in the way you’d guard a standing appointment."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Before the first coffee",
                      "Before bed"
                    ],
                    "body": "The edges of the day survive best, because the world has either not started yet or has already finished with you."
                  },
                  {
                    "options": [
                      "At lunchtime",
                      "Straight after training"
                    ],
                    "body": "Slots in the middle of the day hold when they’re welded to something fixed, so make it after the sandwich or after the shower, with no separate decision required."
                  },
                  {
                    "options": [
                      "On the commute, with my eyes open"
                    ],
                    "body": "Eyes open counts perfectly well. Paying attention to your breathing in a moving world is the same repetition with a bit of weather added."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "when",
                "headline": "When are you doing the ten minutes?",
                "helper": "Most days, tracked as practice, not as a run.",
                "options": [
                  "Before the first coffee",
                  "At lunchtime",
                  "Before bed",
                  "After training"
                ],
                "result": "My slot: {pick}"
              },
              {
                "kind": "collect",
                "title": "The practice",
                "template": "\"Ten minutes at {pick}, counted as practice. A missed day is a missed repetition and nothing more than that.\"",
                "fallback": "\"I’ll put ten daily minutes in the diary this week, as practice.\"",
                "source": "checks",
                "label": "Where the tools stand:",
                "cta": "Save this"
              }
            ],
            "sources": "Mindfulness builds the observe-without-reacting capacity that urge surfing and defusion depend on. Mindfulness-based relapse prevention has real supporting trial evidence in substance use (Bowen et al., 2014, covered fully on Day 37), kept at plausible for pornography specifically since no equivalent trial exists. The reps-not-purity framing protects the no-shame principle.",
            "action": "Do ten minutes of guided meditation daily this week. Track it as practice, not purity.",
            "reflection": "If you tried ten minutes of daily practice, note honestly: does sitting with your own mind get even slightly easier across the week? That easing is the muscle you're building."
          },
          {
            "number": 52,
            "heading": "Urge surfing",
            "title": "Riding it out",
            "tag": "evidence — acceptance and mindfulness-based relapse prevention",
            "tagColor": "#375623",
            "sub": "III.A",
            "week": 4,
            "day": 2,
            "order": 51,
            "slug": "riding-it-out-52",
            "pages": [
              {
                "kind": "teach",
                "headline": "Fighting an urge tends to feed it, which is the opposite of what everyone assumes.",
                "body": "Tell somebody not to think about a white bear and they think about it more (Wegner et al., 1987). Push against a craving and it pushes back, and every second of gritting your teeth feels like the one where you’re about to give way.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "An urge behaves like a wave, in that it rises, peaks and falls on its own, usually inside twenty or thirty minutes, provided you don’t feed it.",
                "body": "And this has been tested properly. People taught to ride cravings this way were drinking and using less a full year afterwards, in a trial of 286 people leaving treatment (Bowen et al., 2014).",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do you usually do in the middle of one?",
                "checks": [
                  {
                    "key": "crush",
                    "label": "Grit my teeth",
                    "asIn": "I tense up and try to force my way through it",
                    "short": "gritting my teeth"
                  },
                  {
                    "key": "obey",
                    "label": "Give in quickly",
                    "asIn": "There’s barely a gap between the wave and the act",
                    "short": "giving in quickly"
                  },
                  {
                    "key": "argue",
                    "label": "Argue with it",
                    "asIn": "I debate with a wave at its highest point, and I lose",
                    "short": "arguing with it"
                  },
                  {
                    "key": "watch",
                    "label": "Sometimes just watch it",
                    "asIn": "Occasionally I manage to sit and let it pass",
                    "short": "sometimes watching it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "body",
                "headline": "Where does it land in your body?",
                "helper": "Get curious about it, and look for its edges.",
                "options": [
                  "In my chest",
                  "In my stomach",
                  "In my hands",
                  "On my skin",
                  "In my breathing",
                  "Everywhere at once"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "crush",
                    "headline": "Gritting your teeth is the trap, because force keeps the wave at the centre of everything with you braced against it.",
                    "body": "Riding it asks a good deal less of you and works better, which is an unusual combination and worth taking seriously."
                  },
                  {
                    "key": "obey",
                    "headline": "Your work is the gap between the wave and the act, and it can be widened.",
                    "body": "Even one minute of surfing teaches your brain that an urge can exist without being obeyed, and the timer is your first surfboard."
                  },
                  {
                    "key": "argue",
                    "headline": "Waves don’t listen, so stop negotiating and start watching instead.",
                    "body": "Where does it sit, how does it move, when does it peak. Watching costs you nothing and it puts you in a different position from the one you have been fighting from."
                  },
                  {
                    "key": "watch",
                    "headline": "You have already surfed without knowing the name for it.",
                    "body": "Now do it, with a timer running, and let the clock show you how short the wave is compared with how long it feels."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "In my chest",
                      "In my breathing"
                    ],
                    "body": "It lands where your breathing lives, so breathe around it. Slow the out-breath down and watch the wave from there, not from inside it."
                  },
                  {
                    "options": [
                      "In my stomach",
                      "In my hands"
                    ],
                    "body": "An urge you can locate is already smaller than one you can’t. A hollow stomach and buzzing hands are edges, and anything with edges is a thing that can pass."
                  },
                  {
                    "options": [
                      "On my skin",
                      "Everywhere at once"
                    ],
                    "body": "When it’s everywhere, say so out loud, because saying \"this is a wave\" plainly makes the sky one size smaller almost immediately."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "surf",
                "headline": "What will you do next time?",
                "helper": "Ride it and let it break.",
                "options": [
                  "Set a timer and watch it",
                  "Say out loud that it is a wave",
                  "Breathe and find its edges",
                  "Count the minutes to the peak"
                ],
                "result": "My move: {pick}"
              },
              {
                "kind": "collect",
                "title": "Riding it out",
                "template": "\"An urge isn’t a command and it’s not an emergency. I {pick}, and the wave breaks without me having to do anything about it.\"",
                "fallback": "\"The next urge gets a timer and somebody watching it.\"",
                "source": "checks",
                "label": "What I used to do:",
                "cta": "Save this"
              }
            ],
            "sources": "Urge surfing (Marlatt); mindfulness-based relapse prevention tested in Bowen et al. (2014), JAMA Psychiatry (N=286, substance use, not porn). Cue reactivity in compulsive sexual behaviour: Voon et al. (2014), PLoS ONE (small fMRI study, 19 users vs 19 controls). Wanting vs liking: Robinson & Berridge incentive-sensitization. Thought suppression: Wegner et al. (1987). Extinction is standard learning science. The \"20 to 30 minutes\" is the usual qualitative description, not a measured statistic.",
            "action": "Next urge, set a timer and just observe the wave without acting. Log how long it lasted.",
            "reflection": "After surfing one urge with a timer, write down how long it lasted versus how long it felt like it would last. That gap is worth remembering for next time."
          },
          {
            "number": 53,
            "heading": "You are not your thoughts",
            "title": "Stepping back from the thought",
            "tag": "evidence — ACT defusion",
            "tagColor": "#375623",
            "sub": "III.A",
            "week": 4,
            "day": 3,
            "order": 52,
            "slug": "stepping-back-from-the-thought-53",
            "pages": [
              {
                "kind": "teach",
                "headline": "During an urge, \"I need this\" can feel like a fact.",
                "body": "It is still a thought. Naming it as a thought gives you a chance to question it before you act.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The counter-move is called defusion in ACT, and it’s almost absurdly simple (Twohig & Crosby, 2010; Crosby & Twohig, 2016).",
                "body": "You restate \"I need this\" as \"I’m having the thought that I need this\". The thought is still there and the grip loosens, and in that loosened grip there’s enough room to choose something.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What line does your mind use on you?",
                "checks": [
                  {
                    "key": "need",
                    "label": "\"I need this\"",
                    "asIn": "Flat and certain, like a weather report",
                    "short": "\"I need this\""
                  },
                  {
                    "key": "once",
                    "label": "\"Just once won’t matter\"",
                    "asIn": "It always sounds so reasonable in the moment",
                    "short": "\"just once won't matter\""
                  },
                  {
                    "key": "deserve",
                    "label": "\"I deserve it\"",
                    "asIn": "A hard day gets submitted as evidence",
                    "short": "\"I deserve it\""
                  },
                  {
                    "key": "stand",
                    "label": "\"I can’t stand this feeling\"",
                    "asIn": "An emergency siren over an ordinary wave",
                    "short": "\"I can't stand this\""
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "fused",
                "headline": "When you’re stuck to the thought, what does it feel like?",
                "helper": "How the disguise works on you.",
                "options": [
                  "Like a fact",
                  "Like an order I am already following",
                  "Completely seamless",
                  "Like a conclusion I have just reached"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "need",
                    "headline": "\"I need this\" unhooks about as cleanly as any sentence does.",
                    "body": "Say \"I’m having the thought that I need this\" and suddenly there’s a you doing the watching and a thought being watched, which are two different things."
                  },
                  {
                    "key": "once",
                    "headline": "The \"just once\" thought floats past most evenings, and you don’t have to argue about the arithmetic with it.",
                    "body": "Spot it, name it, and watch it drift by. Arguing keeps it in the room, whereas naming it lets it leave."
                  },
                  {
                    "key": "deserve",
                    "headline": "\"I deserve it\" is half true, and that is exactly what makes it effective.",
                    "body": "You probably do deserve something. Once you’re unhooked from the sentence you can ask what the something is, and it’s usually, not this."
                  },
                  {
                    "key": "stand",
                    "headline": "\"I can’t stand this feeling\" is a thought about a feeling, not the feeling itself.",
                    "body": "And you’re standing it right now, while reading this sentence, which is the quickest available disproof."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Like a fact",
                      "Like a conclusion I have just reached"
                    ],
                    "body": "That certainty is what being stuck to a thought feels like from the inside, and the restating move exists to put a seam back into something that felt seamless."
                  },
                  {
                    "options": [
                      "Like an order I am already following",
                      "Completely seamless"
                    ],
                    "body": "A good deal of a slip is plain obedience, in that a convincing sentence issues an order and you carry it out. Defusion puts the pause back in, and refusal lives in the pause."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "line",
                "headline": "What is your step-back line?",
                "helper": "Say it exactly the same way every time.",
                "options": [
                  "\"I am having the thought that I need this\"",
                  "\"There is that thought again\"",
                  "\"Thanks, mind\"",
                  "\"There goes the just-once one\""
                ],
                "result": "My line: {pick}"
              },
              {
                "kind": "collect",
                "title": "Stepping back",
                "template": "\"When {checks} turns up, it’s a sentence rather than a fact, and my answer to it is {pick}.\"",
                "fallback": "\"This week I’ll catch my mind's usual line in writing, and drill the step-back answer to it.\"",
                "source": "checks",
                "label": "My mind's usual lines:",
                "cta": "Save this"
              }
            ],
            "sources": "Cognitive defusion is a core ACT skill. ACT has the strongest controlled evidence for problematic pornography use of any approach tested (Twohig & Crosby, 2010, pilot n=6; Crosby & Twohig, 2016, RCT n=28), per the evidence base.",
            "action": "Each urge today, restate the demand as \"I'm having the thought that ___.\" Notice the grip loosen.",
            "reflection": "Write the exact sentence your urges most often use on you (\"I deserve it,\" \"just once,\" etc.). Seeing your mind's go-to line in writing makes it easier to spot (and unhook from) next time."
          }
        ]
      },
      {
        "code": "III.B",
        "title": "The pause and the body",
        "description": "Putting a delay in, working out what is missing, and using the body as a wedge.",
        "lessons": [
          {
            "number": 54,
            "heading": "The 5-minute delay & HALT",
            "title": "Never decide in the heat",
            "tag": "plausible — clinical folk wisdom",
            "tagColor": "#0B3C49",
            "sub": "III.B",
            "week": 4,
            "day": 4,
            "order": 53,
            "slug": "never-decide-in-the-heat-54",
            "pages": [
              {
                "kind": "teach",
                "headline": "Don’t decide anything while the urge is at full strength.",
                "body": "Put five minutes in front of the decision. You’re not saying no and starting a fight. You’re saying, \"Not yet. I’ll decide in five minutes.\" By then the wave will usually have started to fall.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Then, during the pause, run through four letters.",
                "body": "Most cravings turn out to be a feeling in disguise, and these are the usual suspects.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "Hungry",
                    "Angry",
                    "Lonely",
                    "Tired"
                  ],
                  "note": "Whichever letter lights up tells you what the actual fix is."
                }
              },
              {
                "kind": "ask",
                "headline": "When you check, which letter usually lights up?",
                "checks": [
                  {
                    "key": "hungry",
                    "label": "Hungry",
                    "asIn": "That bleak late afternoon when my patience has run out",
                    "short": "hungry"
                  },
                  {
                    "key": "angry",
                    "label": "Angry",
                    "asIn": "There’s a charge in me looking for somewhere to go",
                    "short": "angry"
                  },
                  {
                    "key": "lonely",
                    "label": "Lonely",
                    "asIn": "The evening reaches for a substitute for a person",
                    "short": "lonely"
                  },
                  {
                    "key": "tired",
                    "label": "Tired",
                    "asIn": "The sneaky one, because it wears all the other masks",
                    "short": "tired"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "hold",
                "headline": "What fills the five minutes?",
                "helper": "Something to do while the wave comes down.",
                "options": [
                  "Put the kettle on",
                  "Walk to the corner and back",
                  "Press-ups until it eases",
                  "A shower",
                  "One song, loud"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "hungry",
                    "headline": "If you’re hungry, then eat something, and preferably something real instead of whatever is nearest.",
                    "body": "The bleakness usually leaves along with the empty stomach, and the urge tends to go quiet at the same time without you having done anything about it directly."
                  },
                  {
                    "key": "angry",
                    "headline": "If you’re angry, then the answer is to bring yourself down instead of to let it out, because letting it out fails its own tests.",
                    "body": "Across 154 studies, lowering arousal reduced anger while hitting things and hard running mostly didn’t (Kjærvik & Bushman, 2024). So it’s long out-breaths and a slow walk, and then the grievance gets written down so that it stops going round."
                  },
                  {
                    "key": "lonely",
                    "headline": "If you’re lonely, then the answer is a person, not a technique.",
                    "body": "Text or call somebody, even briefly, and if nobody is reachable then get near humans instead. That means a café, a gym, or a shop that is still open."
                  },
                  {
                    "key": "tired",
                    "headline": "If you’re tired, then the answer is sleep, and it’s worth taking that literally.",
                    "body": "Phone in the other room and go down early, because an under-slept brain loses this particular fight most nights that it tries to have it."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Put the kettle on",
                      "A shower"
                    ],
                    "body": "Small and warm handles a mild flicker, and quite often the wave can’t outlast a kettle."
                  },
                  {
                    "options": [
                      "Walk to the corner and back",
                      "Press-ups until it eases"
                    ],
                    "body": "A strong wave needs the physical version. Bigger wave, bigger response, and further away from the screen while it passes."
                  },
                  {
                    "options": [
                      "One song, loud"
                    ],
                    "body": "One song is a timer you don’t have to keep checking. When it finishes you decide again, and most waves are shorter than three tracks."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "delay",
                "headline": "How long is the delay?",
                "helper": "You’re postponing the verdict, not delivering one.",
                "options": [
                  "Five minutes",
                  "Ten minutes",
                  "Fifteen minutes"
                ],
                "result": "Not yet: {pick}"
              },
              {
                "kind": "collect",
                "title": "The pause",
                "template": "\"I never decide in the heat. {pick} first, and then I check the four letters. My usual one is {checks}, and I know what it needs.\"",
                "fallback": "\"The delay rule starts this week, with no decisions made hot and the four letters checked during the pause.\"",
                "source": "checks",
                "label": "My usual letter:",
                "cta": "Save this"
              }
            ],
            "sources": "The delay-before-deciding rule and HALT (Hungry/Angry/Lonely/Tired) are long-standing recovery-community and clinical folk tools originating in twelve-step and substance recovery; general knowledge, no controlled trial exists for HALT itself. The delay leverages the urge-as-wave mechanism (Day 37). The four states map onto documented relapse antecedents: hunger and fatigue reducing self-control (Days 12 and 14), negative affect and stress as a top relapse driver generally, and loneliness (evidence base, Part B1(b)). Added: the Angry response now follows the anger meta-analysis, calming beats venting (Kjærvik & Bushman, 2024); the earlier burn-it-off phrasing was softened to match the evidence.",
            "action": "Impose a mandatory delay + HALT check before any decision this week. Log what HALT reveals.",
            "reflection": "Over a week of HALT checks, which letter comes up most: Hungry, Angry, Lonely, or Tired? Write your most frequent one, and the specific go-to response you'll pair with it from now on."
          },
          {
            "number": 55,
            "heading": "Sweat before screens",
            "title": "Moving before deciding",
            "tag": "plausible — competing response",
            "tagColor": "#0B3C49",
            "sub": "III.B",
            "week": 4,
            "day": 5,
            "order": 54,
            "slug": "moving-before-deciding-55",
            "pages": [
              {
                "kind": "teach",
                "headline": "The rule fits on a note stuck to the fridge, which is that when an urge hits you move first and decide second.",
                "body": "Body before screen, every time, with no discussion about it at the door. The point is that the decision gets made from a different body than the one that wanted to make it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The technique has a proper name, which is a competing response.",
                "body": "You wedge a deliberate physical action into the gap between wanting and doing. It buys you time, and a wave that you don’t act on begins to fall, and the movement itself spends some of the restlessness on the way.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How much gap is there between wanting and doing?",
                "checks": [
                  {
                    "key": "seconds",
                    "label": "Seconds at most",
                    "asIn": "The impulse and the action are wired almost together",
                    "short": "seconds at most"
                  },
                  {
                    "key": "argument",
                    "label": "A short argument I lose",
                    "asIn": "The debate happens and the verdict rarely changes",
                    "short": "a short argument I lose"
                  },
                  {
                    "key": "unused",
                    "label": "Time I don’t use",
                    "asIn": "There’s a real gap and I spend it hovering",
                    "short": "time I do not use"
                  },
                  {
                    "key": "widegap",
                    "label": "A real gap already",
                    "asIn": "I catch urges early and ride them out",
                    "short": "a real gap already"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "wedge",
                "headline": "Which of these would survive your worst night?",
                "helper": "Small enough that you’d still do it when you didn’t want to.",
                "options": [
                  "Ten press-ups",
                  "A lap round the block",
                  "The stairs, twice",
                  "Twenty squats",
                  "A stretch while the kettle boils"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "seconds",
                    "headline": "A gap of seconds needs a physical wedge, because thought can’t outdraw a reflex.",
                    "body": "A body that is already moving can, though. That’s why the rule is about movement, not about thinking harder or faster."
                  },
                  {
                    "key": "argument",
                    "headline": "Stop debating and start moving, since the debate was never winnable mid-urge.",
                    "body": "Ten press-ups later you’re making the decision from a different body, and the decision usually goes differently as a result."
                  },
                  {
                    "key": "unused",
                    "headline": "You have the time already. What it needs is a shape.",
                    "body": "Hovering feeds the loop by keeping you near it, whereas the wedge turns the same minutes into spent energy."
                  },
                  {
                    "key": "widegap",
                    "headline": "With a real gap already working, treat this as your backup rather than your main tool.",
                    "body": "Keep it for the nights when the gap shrinks, because it will shrink occasionally and you’ll want something ready."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Ten press-ups",
                      "Twenty squats"
                    ],
                    "body": "Things you can do in a room survive weather, hours and moods, because nothing stands between you and them except the floor."
                  },
                  {
                    "options": [
                      "A lap round the block",
                      "The stairs, twice"
                    ],
                    "body": "Leaving the room is the strongest version, since the scene changes and the body spends energy at the same time."
                  },
                  {
                    "options": [
                      "A stretch while the kettle boils"
                    ],
                    "body": "Small counts. The bar is that you moved, and a stretch you’d do beats press-ups you’d not."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "rule",
                "headline": "What is your rule, exactly?",
                "helper": "What, and how much, doable at your least motivated.",
                "options": [
                  "Ten press-ups",
                  "A lap round the block",
                  "The stairs, twice",
                  "Twenty squats"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "Moving first",
                "template": "\"Bad feeling, then {pick}, and only then the decision.\"",
                "fallback": "\"I’ll write my move-first rule down tonight, small enough for my worst night.\"",
                "source": "checks",
                "label": "My gap as it stands:",
                "cta": "Save this"
              }
            ],
            "sources": "The competing response (inserting an incompatible physical action between impulse and behaviour) is an established behavioural technique. Combined here with urge-surfing (Tier 1 in the evidence base, covered fully on Day 37) and with exercise's craving-lowering effect from Day 17 (Taylor, Ussher & Faulkner, 2007, a smoking study, not a pornography study).",
            "action": "Set a tiny \"move first\" rule (e.g. 10 push-ups or a short walk before deciding) and track when you use it.",
            "reflection": "Write your exact \"move first\" rule, the specific small action, small enough you'd do it on your worst night. Make it concrete: what, and how much."
          },
          {
            "number": 56,
            "heading": "The cold shower",
            "title": "The cold shower",
            "tag": "folklore",
            "tagColor": "#843C3C",
            "sub": "III.B",
            "week": 4,
            "day": 6,
            "order": 55,
            "slug": "the-cold-shower-56",
            "pages": [
              {
                "kind": "teach",
                "headline": "The legend around cold water oversells it.",
                "body": "No study has tested cold water against porn relapse, and the business about resetting your dopamine is decoration. But you can throw away the mythology and still keep the trick underneath it, which is a fair trade.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The honest mechanism is that it interrupts you.",
                "body": "An urge narrows your attention down to a tunnel, and a hard shock of cold drags that attention back into your skin. For thirty seconds there’s no fantasy at all, only cold, and an urge that has been interrupted has to build itself back up from lower down.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happens when an urge narrows you down?",
                "checks": [
                  {
                    "key": "fades",
                    "label": "The room goes quiet at the edges",
                    "asIn": "The loop tightens and everything else fades out",
                    "short": "the room going quiet"
                  },
                  {
                    "key": "arguing",
                    "label": "Reasoning with it doesn’t work",
                    "asIn": "Arguing at the peak has never got me anywhere",
                    "short": "reasoning not working"
                  },
                  {
                    "key": "jolt",
                    "label": "A sharp shock can break it",
                    "asIn": "Cold, or a sprint, or anything abrupt",
                    "short": "a sharp shock breaking it"
                  },
                  {
                    "key": "nothing",
                    "label": "Nothing interrupts it",
                    "asIn": "Once it starts it runs its course",
                    "short": "nothing interrupting it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "underneath",
                "headline": "After you have towelled off, what is still there?",
                "helper": "The things an interruption can’t touch.",
                "options": [
                  "Boredom",
                  "Stress",
                  "Loneliness",
                  "The empty evening",
                  "Whatever the day left behind"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "fades",
                    "headline": "That narrowing is exactly the thing a shock can break, and it doesn’t break it by winning an argument.",
                    "body": "It breaks it by changing the channel for long enough that the wave passes while you’re looking at something else."
                  },
                  {
                    "key": "arguing",
                    "headline": "Stop trying to reason with it and interrupt it instead.",
                    "body": "The wave crests and falls on its own if you can buy the minutes, and buying minutes is a much more achievable job than winning a debate."
                  },
                  {
                    "key": "jolt",
                    "headline": "You already own the tool and you don’t need to believe anything about dopamine to use it.",
                    "body": "Keep it as an interruption, and let your own results outrank whatever the testimonials online happen to claim."
                  },
                  {
                    "key": "nothing",
                    "headline": "If nothing interrupts it, then skip this one without any guilt.",
                    "body": "Urge surfing in Lesson 52 rides the wave instead of trying to break it, and that may suit you better."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Boredom",
                      "The empty evening"
                    ],
                    "body": "The cold buys you minutes and nothing more, so the empty evening still needs its own answer, and Lesson 43 is where that is."
                  },
                  {
                    "options": [
                      "Stress",
                      "Whatever the day left behind"
                    ],
                    "body": "The cold buys you minutes. Whatever load you were carrying still needs draining, and movement in Lesson 19 is the thing that does that part."
                  },
                  {
                    "options": [
                      "Loneliness"
                    ],
                    "body": "The cold buys you minutes. The loneliness it can’t touch is the whole assignment of Part VI."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "test",
                "headline": "Are you going to try it?",
                "helper": "One honest test, kept only if it earns its place.",
                "options": [
                  "Cold water at the next urge",
                  "A cold finish to tomorrow's shower",
                  "Skip it, it is not for me"
                ],
                "result": "My test: {pick}"
              },
              {
                "kind": "collect",
                "title": "The verdict",
                "template": "\"{pick}. And the verdict comes from my own nervous system, not from whatever the internet says about it.\"",
                "fallback": "\"One honest test, and then a verdict from my own nervous system.\"",
                "source": "checks",
                "label": "How my urges behave:",
                "cta": "Save this"
              }
            ],
            "sources": "No controlled study has tested whether cold-water exposure reduces pornography relapse; kept clearly labelled folklore. The interrupt-a-peaking-urge mechanism draws on acceptance and urge-surfing, which has real supporting evidence (Tier 1 in the evidence base, covered fully on Day 37); the cold shower is framed only as one possible way to buy time for that to work, not as evidence in itself.",
            "action": "Next time an urge hits, try cold water first, then decide. Log honestly whether it helped.",
            "reflection": "After you've tested it once or twice, write your honest verdict: does a sharp physical interrupt break the spell for you, or not? Either answer is useful data about how your urges work."
          }
        ]
      },
      {
        "code": "III.C",
        "title": "The hard moments",
        "description": "Settling the nervous system, getting through a crisis, and one advanced tool with real limits.",
        "lessons": [
          {
            "number": 57,
            "heading": "Trauma and the nervous system",
            "title": "Settling the system",
            "tag": "plausible — trauma-informed",
            "tagColor": "#0B3C49",
            "sub": "III.C",
            "week": 4,
            "day": 7,
            "order": 56,
            "slug": "settling-the-system-57",
            "pages": [
              {
                "kind": "teach",
                "headline": "Trauma tends to leave the nervous system stuck outside its calm middle range.",
                "body": "Either it sits too high, which feels wired and watchful, or too low, which feels numb and flat. In that state, porn works as a fast and crude way of changing the channel, which is self-regulation done with the bluntest tool in the house. It’s not a moral failing.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Regulating a system that is stuck is both sensible and necessary, so the problem isn’t that you do it.",
                "body": "The problem is owning only one way of doing it. Better ones exist, such as box breathing, feeling your feet on the floor, holding something cold, or naming what is in the room. Practise them while calm and they will be there when you’re not.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where does your system usually sit?",
                "checks": [
                  {
                    "key": "toohigh",
                    "label": "Too high",
                    "asIn": "Wired and watchful, and hard to switch off",
                    "short": "too high"
                  },
                  {
                    "key": "toolow",
                    "label": "Too low",
                    "asIn": "Numb, flat and powered down",
                    "short": "too low"
                  },
                  {
                    "key": "swinging",
                    "label": "Swinging between the two",
                    "asIn": "Both states, in no predictable order",
                    "short": "swinging between them"
                  },
                  {
                    "key": "middle",
                    "label": "Mostly in the middle",
                    "asIn": "The calm range is where I usually live",
                    "short": "mostly in the middle"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "tools",
                "headline": "Which tools will you learn?",
                "helper": "Practical ways of moving a stuck system.",
                "options": [
                  "Box breathing, four in, hold, four out, hold",
                  "Feeling my feet flat on the floor",
                  "Holding something cold",
                  "Naming five things in the room"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "toohigh",
                    "headline": "A system stuck too high reaches for porn as a way of coming down, and slow breathing does that same job more cleanly.",
                    "body": "The long out-breath is the body's own brake, and it’s always fitted, which is more than can be said for anything else you might reach for."
                  },
                  {
                    "key": "toolow",
                    "headline": "A system stuck too low reaches for a jolt, because numbness wants sensation.",
                    "body": "Grounding gives it sensation without the bill afterwards. That means something cold in your hand, feet on the floor, and the room named out loud."
                  },
                  {
                    "key": "swinging",
                    "headline": "A swinging system needs both ends of the kit, plus the knack of noticing which state has turned up.",
                    "body": "The noticing is half the regulation, because using the wrong tool for the state you’re in won’t do much either way."
                  },
                  {
                    "key": "middle",
                    "headline": "A settled system still benefits from having one tool properly practised.",
                    "body": "Urges visit everybody eventually, and a brake you have rehearsed is cheap insurance against the one week when things are harder."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Box breathing, four in, hold, four out, hold"
                    ],
                    "body": "Breathing is the tool that is always installed. It needs no equipment, it’s invisible in public, and it works on the system directly, not through your thoughts."
                  },
                  {
                    "options": [
                      "Feeling my feet flat on the floor",
                      "Holding something cold"
                    ],
                    "body": "Anchors in the body pull a hijacked system back into the present, which is where the urge isn’t."
                  },
                  {
                    "options": [
                      "Naming five things in the room"
                    ],
                    "body": "Naming the room tells a watchful system that it’s here and now and safe, in the only language such a system reads, which is evidence."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "tool",
                "headline": "Which one will you practise while calm?",
                "helper": "So that it’s there when you’re not.",
                "options": [
                  "Box breathing",
                  "Feet on the floor",
                  "Something cold in my hand",
                  "Naming the room"
                ],
                "result": "Practising: {pick}"
              },
              {
                "kind": "collect",
                "title": "A better way to change the channel",
                "template": "\"A better way of changing the channel, which for me is {pick}, practised calm and used early. Deep wounds still need a professional, and these skills run the system in the meantime.\"",
                "fallback": "\"I’ll practise one settling tool this week while calm, and use it early at the next urge.\"",
                "source": "checks",
                "label": "Where my system sits:",
                "cta": "Save this"
              }
            ],
            "sources": "The trauma and dysregulation framing, and nervous-system skills (box breathing, grounding, orienting), are trauma-informed clinical practice (general knowledge), kept at the plausible level. The behaviour-as-self-regulation reading aligns with the coping-motive finding in the evidence base; deep trauma is directed to professional care.",
            "action": "Learn one regulation tool (box breathing or grounding) and use it at the first sign of an urge.",
            "reflection": "Pick one regulation tool (box breathing or grounding) to practise this week when calm. Note whether, used early, it changes how an urge unfolds."
          },
          {
            "number": 58,
            "heading": "Survive the spike without making it worse (distress tolerance)",
            "title": "Getting through the worst of it",
            "tag": "evidence — DBT distress tolerance",
            "tagColor": "#375623",
            "sub": "III.C",
            "week": 4,
            "day": 8,
            "order": 57,
            "slug": "getting-through-the-worst-of-it-58",
            "pages": [
              {
                "kind": "teach",
                "headline": "Sometimes a feeling is too intense for calm observation.",
                "body": "In that moment, the goal is simply to get through the peak without making the situation worse. Use a strong but safe grounding action.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The skills for this come from DBT, which was developed by Marsha Linehan and has strong support for intense emotion and impulsive coping.",
                "body": "Cold water on the face sets off a built-in calming reflex. A few minutes of hard exercise burns off the surge. And accepting that this is happening, just for now, drops the fight with reality that is doubling the weight of it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which wave is the one that outruns you?",
                "checks": [
                  {
                    "key": "rage",
                    "label": "Rage",
                    "asIn": "A charge that demands to go somewhere",
                    "short": "rage"
                  },
                  {
                    "key": "grief",
                    "label": "Grief",
                    "asIn": "A weight that wants numbing",
                    "short": "grief"
                  },
                  {
                    "key": "panic",
                    "label": "Panic",
                    "asIn": "An alarm that wants any exit at all",
                    "short": "panic"
                  },
                  {
                    "key": "emptiness",
                    "label": "Emptiness",
                    "asIn": "A void that wants filling quickly",
                    "short": "emptiness"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "crisistools",
                "headline": "Which tools do you want ready?",
                "helper": "For the peak itself, not for afterwards.",
                "options": [
                  "Cold water on the face for thirty seconds",
                  "A few minutes of hard exercise",
                  "Saying plainly that this is happening",
                  "The contacts saved in Lesson 106"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "rage",
                    "headline": "Rage answers to the tools that bring arousal down first. That means cold water and long out-breaths.",
                    "body": "Across 154 anger studies, bringing arousal down worked and venting mostly didn’t (Kjærvik & Bushman, 2024). The grievance, if it’s real, gets dealt with afterwards, on paper, while calm."
                  },
                  {
                    "key": "grief",
                    "headline": "Grief wants numbing and what it needs is a witness.",
                    "body": "Get through the peak with the cold water, and then let the feeling be felt, or told to somebody. Grief that gets numbed sends the bill again later on."
                  },
                  {
                    "key": "panic",
                    "headline": "Panic answers to the body's brake harder than anything else does.",
                    "body": "Cold on the face and long out-breaths, and the minute it takes to work is all of the assignment."
                  },
                  {
                    "key": "emptiness",
                    "headline": "Emptiness at crisis pitch is the state most tempted by the old exit, because the old exit was designed for it.",
                    "body": "The acceptance move suits it best. That means saying that this is happening and that fighting the fact of it is what is making it worse."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Cold water on the face for thirty seconds",
                      "A few minutes of hard exercise"
                    ],
                    "body": "The body tools work in under two minutes and require no belief whatever. The heart rate drops, the surge burns off, and the peak becomes survivable."
                  },
                  {
                    "options": [
                      "Saying plainly that this is happening"
                    ],
                    "body": "Most of the suffering is the fighting, because \"this should not be happening\" gets stacked on top of the pain itself. Drop that, just for now, and the load roughly halves."
                  },
                  {
                    "options": [
                      "The contacts saved in Lesson 106"
                    ],
                    "body": "If your emotions reach this pitch regularly then take that seriously. These skills are taught properly in professional rooms and you deserve the proper version, not a summary."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "matched",
                "headline": "Which tool matches your wave?",
                "helper": "Pick the one that suits the wave you get.",
                "options": [
                  "Cold water, thirty seconds",
                  "Hard exercise for a few minutes",
                  "Saying out loud that this is happening"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "Getting through it",
                "template": "\"I get through the worst twenty minutes without adding anything to them. That means {checks} gets {pick}. The original problem, and nothing new piled on top.\"",
                "fallback": "\"I’ll learn the matching tool this week, calmly, before the wave that needs it arrives.\"",
                "source": "checks",
                "label": "The wave that outruns me:",
                "cta": "Save this"
              }
            ],
            "sources": "Distress tolerance is a core module of dialectical behaviour therapy (DBT), developed by Marsha Linehan, a well-established therapy for emotion dysregulation and impulsive, self-destructive coping (general clinical knowledge). The cold-water calming reflex and radical acceptance are standard DBT crisis-survival skills. Pairs with trauma/nervous-system regulation (Day 76); no porn-specific trial, applied by mechanism. Added: the rage branch follows Kjærvik & Bushman (2024): arousal-lowering tools first.",
            "action": "Learn one distress-tolerance skill (cold water on the face, or a few minutes of intense exercise) and use it at the next emotional spike, before you decide anything.",
            "reflection": "Which skill will you reach for, and which emotion (rage, grief, panic, emptiness) most often precedes your slips? Name both so the tool is matched to the moment."
          },
          {
            "number": 59,
            "heading": "Let the trigger lose its charge (cue exposure)",
            "title": "Turning a trigger down",
            "tag": "contested — mixed evidence",
            "tagColor": "#7F6000",
            "sub": "III.C",
            "week": 4,
            "day": 9,
            "order": 58,
            "slug": "turning-a-trigger-down-59",
            "pages": [
              {
                "kind": "teach",
                "headline": "The jolt a cue gives you was learned, which is Pavlov's mechanism exactly, so in principle it can be partly unlearned.",
                "body": "You meet the cue, no reward arrives, and over enough repetitions the firing should fade. That’s called extinction, and in practice it’s urge surfing pointed at a target you have chosen.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "But you should know going in that the evidence here is thin.",
                "body": "A meta-analysis of nine treatment trials found no consistent benefit from cue exposure as it’s practised (Conklin & Tiffany, 2002). Extinction also transfers badly between places and lies on top of the old learning instead of erasing it. At best you get the volume turned down, sometimes, for a while.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where do you stand on practising with cues?",
                "checks": [
                  {
                    "key": "solidskills",
                    "label": "My surfing skills are solid",
                    "asIn": "The groundwork is in place",
                    "short": "having solid skills"
                  },
                  {
                    "key": "stilljolts",
                    "label": "Cues still jolt me",
                    "asIn": "The charge is live and I know where it is",
                    "short": "cues still jolting me"
                  },
                  {
                    "key": "tempts",
                    "label": "It tempts more than it trains",
                    "asIn": "My practice keeps drifting towards the edge",
                    "short": "it tempting rather than training"
                  },
                  {
                    "key": "shaky",
                    "label": "Early and shaky",
                    "asIn": "This is a tool for later",
                    "short": "being early and shaky"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "mildcues",
                "headline": "Which mild cues could you test with?",
                "helper": "Small ones only, and never the dangerous one.",
                "options": [
                  "An app icon",
                  "A particular time of night",
                  "A mood as it arrives",
                  "A place that hums a bit"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "solidskills",
                    "headline": "With the skills in place you can run this like a laboratory rather than like a dare.",
                    "body": "One mild cue, a brief exposure, surf it, write it down. Then judge the tool by your own repetitions, not by anybody's theory."
                  },
                  {
                    "key": "stilljolts",
                    "headline": "A live charge argues both for the tool and for being careful about the dose.",
                    "body": "Start with the mildest cue you have, and the moment it starts feeling like temptation instead of training, stop for that session."
                  },
                  {
                    "key": "tempts",
                    "headline": "Practice that turns into edging is the exact opposite of extinction.",
                    "body": "It’s a fresh pairing, which strengthens the thing you meant to weaken. The line is that you never act, and if the line won’t hold then the tool goes back on the shelf without argument."
                  },
                  {
                    "key": "shaky",
                    "headline": "Early and shaky skips this one, and that is the correct decision, not a cautious one.",
                    "body": "It’s here for completeness. Surfing comes first, for months, and there’s no hurry to get to this."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "An app icon",
                      "A particular time of night"
                    ],
                    "body": "The abstract cues make the safest laboratory, because an icon seen and outlasted teaches the mechanism at close to no risk."
                  },
                  {
                    "options": [
                      "A mood as it arrives",
                      "A place that hums a bit"
                    ],
                    "body": "The felt cues are much stronger medicine, so only test those once the abstract ones have gone quiet."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "exporule",
                "headline": "What is your rule, if you run it?",
                "helper": "Written down before the first attempt.",
                "options": [
                  "Never act during an exposure",
                  "One mild cue only, written down",
                  "Drop it if nothing changes"
                ],
                "result": "My rule: {pick}"
              },
              {
                "kind": "collect",
                "title": "The test",
                "template": "\"Volume down, possibly, sometimes. Tested on {grid} under the rule that {pick}, and dropped without regret if it does nothing.\"",
                "fallback": "\"The tool stays on the shelf until my surfing skills are solid, and if I do test it, the never-act line holds.\"",
                "source": "checks",
                "label": "Where I stand:",
                "cta": "Save this"
              }
            ],
            "sources": "Cue exposure/extinction rests on classical-conditioning theory; as an addiction treatment its evidence is small and inconsistent, with no decisive support as a standalone, limited by the renewal effect and the fact that extinction doesn't erase the original learning (general addiction-treatment literature on cue-exposure therapy). Labelled contested. The \"expose and surf without acting\" mechanism overlaps with Tier 1 urge-surfing in the evidence base. Added: the mixed-evidence claim now carries its citation, a meta-analysis of nine trials with no consistent effect (Conklin & Tiffany, 2002).",
            "action": "Pick one mild, specific cue. Expose yourself to it briefly and deliberately, surf the urge without acting, and log whether its charge drops across repetitions.",
            "reflection": "Be honest after a few tries: does sitting with the cue weaken it for you, or does it mostly just tempt you? Either answer is useful data about whether this tool is yours."
          }
        ]
      }
    ]
  },
  {
    "n": 5,
    "title": "Part IV · Make the cost felt in advance",
    "ground": "Ground V · First Camp",
    "description": "A cost only counts for anything if you can feel it before the moment arrives, so this part is about the ledger, tonight's bill, watching the whole film, not the trailer, and the defences that survive being aroused.",
    "subs": [
      {
        "code": "IV.A",
        "title": "The ledger",
        "description": "Costs with edges on them, so that they can be felt, not merely known.",
        "lessons": [
          {
            "number": 60,
            "heading": "The cost ledger",
            "title": "Writing down what it costs",
            "tag": "reframe",
            "tagColor": "#4B3F72",
            "sub": "IV.A",
            "week": 5,
            "day": 1,
            "order": 59,
            "slug": "writing-down-what-it-costs-60",
            "pages": [
              {
                "kind": "teach",
                "headline": "A vague cost is easy to ignore. That’s why \"it’s bad for me\" rarely changes a decision.",
                "body": "Make the cost specific: write down the hours, money, sleep, or next-morning feeling. Today you will put those costs on paper.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This is a proper clinical technique, not a bit of homework.",
                "body": "In motivational interviewing it’s called decisional balance, and the important part is that the person writes the costs themselves. Reasons in your own handwriting shift behaviour in a way that other people's warnings reliably don’t.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is honestly on your ledger?",
                "checks": [
                  {
                    "key": "hours",
                    "label": "The hours, added up",
                    "asIn": "An amount per week I’d never say out loud",
                    "short": "the hours added up"
                  },
                  {
                    "key": "closeness",
                    "label": "The nights I turned away",
                    "asIn": "Evenings where I chose the screen over a person who was right there",
                    "short": "the nights I turned away"
                  },
                  {
                    "key": "tax",
                    "label": "The mornings after",
                    "asIn": "Foggy days paying for the night before",
                    "short": "the mornings after"
                  },
                  {
                    "key": "overhead",
                    "label": "The managing",
                    "asIn": "Tabs, history, half-lies and a lot of small covering up",
                    "short": "the managing"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "currency",
                "headline": "What is it spending?",
                "helper": "Tick every one that is true.",
                "options": [
                  "Time",
                  "Sleep",
                  "Closeness",
                  "Focus",
                  "Money",
                  "Self-respect",
                  "Honesty",
                  "Energy"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "hours",
                    "headline": "Start the ledger with the hours and put a real number on your week.",
                    "body": "Numbers are hard to wave away, which is why the fog never uses one and why writing one down changes something."
                  },
                  {
                    "key": "closeness",
                    "headline": "Start the ledger with those nights, and describe one of them properly.",
                    "body": "A scene you recognise lands where \"it affects my relationships\" floats straight past, so write it down as a fact, not as a category."
                  },
                  {
                    "key": "tax",
                    "headline": "Start the ledger with the mornings and count this week's foggy ones.",
                    "body": "The night does the advertising and the morning pays the bill, and the morning never gets a line of its own unless you give it one."
                  },
                  {
                    "key": "overhead",
                    "headline": "Start the ledger with the managing. That means the checking and clearing and covering.",
                    "body": "Those hide because no single one of them looks like much, so the only way to see them is to add them up."
                  },
                  {
                    "key": "none",
                    "headline": "If nothing on that list bit, then find your own first line instead.",
                    "body": "Whatever makes you uncomfortable when you write it down is the information, and the discomfort is how you know you have found it."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Time",
                      "Money"
                    ],
                    "body": "Total those two first, because they have the hardest edges and hard edges are exactly what the fog can’t survive."
                  },
                  {
                    "options": [
                      "Closeness",
                      "Honesty",
                      "Self-respect"
                    ],
                    "body": "Total those first, because the costs that never show up as hours are the ones the sales pitch most needs you to skip over."
                  },
                  {
                    "options": [
                      "Sleep",
                      "Focus",
                      "Energy"
                    ],
                    "body": "Total those first, because that column bills you again every following day, which is how one night's cost becomes a week's."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "worst",
                "headline": "Which line do you least want to look at?",
                "helper": "That’s usually the one with the power in it.",
                "options": [
                  "The hours added up",
                  "The nights I turned away",
                  "The mornings after",
                  "The managing"
                ],
                "result": "Facing: {pick}"
              },
              {
                "kind": "collect",
                "title": "The ledger",
                "template": "\"The line I least want to read is {pick}. I’m keeping it factual and keeping it ready for the next time the offer arrives looking attractive.\"",
                "fallback": "\"I’ll write the first honest line of the ledger tonight, priced and factual and mine.\"",
                "source": "checks",
                "label": "What it’s spending:",
                "cta": "Save this"
              }
            ],
            "sources": "Reframe lesson; the \"forty minutes a day\" figure is explicitly illustrative, not a statistic. The approach mirrors \"decisional balance\" within motivational interviewing, an evidence-supported counselling style for addictive behaviour. The caution against shame rests on the moral-incongruence findings (Grubbs et al., 2019).",
            "action": "List the real, concrete costs, and put an actual number on the time. Keep it factual, not self-punishing.",
            "reflection": "Write the single most uncomfortable line on your own ledger, the specific cost you'd least like to look at. That's usually the one with the most power in it."
          },
          {
            "number": 61,
            "heading": "What a slip costs tonight",
            "title": "Tonight's bill",
            "tag": "reframe — immediate costs",
            "tagColor": "#4B3F72",
            "sub": "IV.A",
            "week": 5,
            "day": 2,
            "order": 60,
            "slug": "tonights-bill-61",
            "pages": [
              {
                "kind": "teach",
                "headline": "The bill starts arriving within minutes instead of within years, and that is the part the pitch leaves out.",
                "body": "The flatness, the history cleared, the night shortened, and a morning already taxed before it starts. That’s tonight's price, and it’s kept in small print for a reason.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Write down the cost of the full evening, not just the next ten minutes.",
                "body": "An urge highlights immediate relief and hides what comes afterwards. List the time, sleep, mood, and other costs while you are calm.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does tonight lose?",
                "checks": [
                  {
                    "key": "evening",
                    "label": "The rest of the evening",
                    "asIn": "The plans dissolve afterwards",
                    "short": "the rest of the evening"
                  },
                  {
                    "key": "nightdepth",
                    "label": "The night itself",
                    "asIn": "A later bedtime and thinner sleep, or both",
                    "short": "the night itself"
                  },
                  {
                    "key": "morningafter2",
                    "label": "The morning after",
                    "asIn": "The fog tax, paid before breakfast",
                    "short": "the morning after"
                  },
                  {
                    "key": "planned",
                    "label": "The thing I had planned",
                    "asIn": "The session, or the call, or the work that was tonight's actual job",
                    "short": "the thing I had planned"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "quietitems",
                "headline": "And the quieter items?",
                "helper": "The overheads that never appear in the sales pitch.",
                "options": [
                  "Clearing the history",
                  "Listening at the door",
                  "Having a half-lie ready",
                  "The momentum, dented"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "evening",
                    "headline": "The dissolved evening is the biggest visible line on the bill.",
                    "body": "Two hours or so, bought with ten minutes, and it’s worth writing that exchange rate down somewhere you’ll meet it again."
                  },
                  {
                    "key": "nightdepth",
                    "headline": "The night pays twice over, once at bedtime and once in depth.",
                    "body": "And Part I has already shown you what a thinned night does to tomorrow's self-control, so this line is really two lines."
                  },
                  {
                    "key": "morningafter2",
                    "headline": "The morning tax is the line the pitch hides best of all.",
                    "body": "Tomorrow's first hours get spent tonight, so price them now while they still belong to you."
                  },
                  {
                    "key": "planned",
                    "headline": "The cancelled plan is the item most worth naming, because tonight had a job and the ten minutes want its slot.",
                    "body": "Put the job on the bill so that the trade is visible, not implied."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Clearing the history",
                      "Having a half-lie ready"
                    ],
                    "body": "The hiding bills you in self-respect, which is the one currency the pitch never mentions at all. Itemised, those stop being invisible."
                  },
                  {
                    "options": [
                      "Listening at the door"
                    ],
                    "body": "That one is small and telling, because an evening spent slightly braced isn’t really a free evening."
                  },
                  {
                    "options": [
                      "The momentum, dented"
                    ],
                    "body": "The dent is real and it’s only a dent rather than a write-off. Lesson 93 holds that line, and this page just prices the dent honestly."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "stings",
                "headline": "Which line stings most?",
                "helper": "That one goes at the top of the bill.",
                "options": [
                  "The dissolved evening",
                  "The shortened night",
                  "The taxed morning",
                  "The cancelled plan"
                ],
                "result": "Top line: {pick}"
              },
              {
                "kind": "collect",
                "title": "Tonight's bill",
                "template": "\"Read in advance: {pick}, plus {grid}. The ten minutes never mention any of that.\"",
                "fallback": "\"I’ll write tonight's bill once, four or five lines, and keep it with the ledger.\"",
                "source": "checks",
                "label": "What tonight loses:",
                "cta": "Save this"
              }
            ],
            "sources": "A reframe: itemising the immediate costs applies the decisional-balance method (Lesson 60's basis) at the same-evening timescale, and feeds the vivid-cost rehearsal of Lesson 62 (episodic future thinking). No new empirical claims; the \"no shame, price it factually\" rule follows the evidence base's anti-shame findings (Part B3).",
            "action": "Write tonight's bill once: the four or five things a slip costs before sunrise, in your own words. Keep it with the cost ledger, and read it at the next pitch.",
            "reflection": "Which line on tonight's bill stings most, honestly? Write it as a plain fact, priced, with no verdict attached. That line is the one to read back when the ten minutes make their offer."
          },
          {
            "number": 62,
            "heading": "Play the tape forward",
            "title": "Watching the whole film",
            "tag": "plausible — episodic future thinking",
            "tagColor": "#0B3C49",
            "sub": "IV.A",
            "week": 5,
            "day": 3,
            "order": 61,
            "slug": "watching-the-whole-film-62",
            "pages": [
              {
                "kind": "teach",
                "headline": "An urge focuses your attention on the promised relief and leaves out what happens next.",
                "body": "Before you act, picture the rest of the evening and the next morning. Include the full result in the decision.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The future only loses this argument when it’s vague.",
                "body": "A blurry sense that you’ll probably regret it can’t compete with a sharp craving. A clear picture of exactly how flat eleven o'clock is going to feel tonight can. You’re not adding willpower here. You’re putting real weight back onto the side of the scales that got emptied.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does the trailer show you?",
                "checks": [
                  {
                    "key": "anticipation",
                    "label": "The build-up",
                    "asIn": "Cut together nicely, and rather glossy",
                    "short": "the build-up"
                  },
                  {
                    "key": "relief",
                    "label": "The relief it promises",
                    "asIn": "Everything easing off, allegedly",
                    "short": "the relief it promises"
                  },
                  {
                    "key": "glow",
                    "label": "The good part and nothing after",
                    "asIn": "The film ends before the lights come up",
                    "short": "the good part and nothing after"
                  },
                  {
                    "key": "noafter",
                    "label": "I never think about the after at all",
                    "asIn": "It doesn’t cross my mind",
                    "short": "never thinking about the after"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "floor",
                "headline": "What has been left on the cutting-room floor?",
                "helper": "The footage the urge deletes.",
                "options": [
                  "How flat I feel afterwards",
                  "The time, gone",
                  "Eleven o'clock tonight",
                  "Remembering it in the morning",
                  "Wondering what I was even chasing"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "anticipation",
                    "headline": "The build-up is real enough and it’s about ten minutes of a two-hour film.",
                    "body": "Narrate the other hundred and ten minutes to yourself before you decide anything, because that is the part being withheld from you."
                  },
                  {
                    "key": "relief",
                    "headline": "Check the relief it promises against your own records, not against your memory.",
                    "body": "What arrives is mostly just the craving stopping, and by now you know what that costs."
                  },
                  {
                    "key": "glow",
                    "headline": "Run the projector past the point where it usually stops.",
                    "body": "The act, the after, getting into bed, and remembering it tomorrow. Accurately, and all the way through, instead of stopping where the film wants to stop."
                  },
                  {
                    "key": "noafter",
                    "headline": "Tonight's homework writes itself.",
                    "body": "One honest paragraph on how the two hours afterwards go. Keep it somewhere, because that is your missing reel and you’ll need it."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "How flat I feel afterwards",
                      "Eleven o'clock tonight"
                    ],
                    "body": "Those are your strongest bits of footage, because they’re specific and felt, and they’re exactly what the trailer is built to keep out."
                  },
                  {
                    "options": [
                      "The time, gone",
                      "Remembering it in the morning"
                    ],
                    "body": "Time and the morning are the costs that compound, so playing them forward re-prices the trade on the spot, not in the abstract."
                  },
                  {
                    "options": [
                      "Wondering what I was even chasing"
                    ],
                    "body": "That line is the film's real ending, and it belongs in every screening."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "method",
                "headline": "How will you run the tape?",
                "helper": "Thirty seconds, before deciding anything.",
                "options": [
                  "Narrate the next two hours",
                  "Read back what I wrote about the after",
                  "Picture eleven o'clock tonight, exactly"
                ],
                "result": "My way: {pick}"
              },
              {
                "kind": "collect",
                "title": "The whole film",
                "template": "\"Before I act I {pick}. A vivid cost against a vivid pleasure is a fair fight, and fair fights change endings.\"",
                "fallback": "\"I’ll write the honest 'after' down once this week, and then play it forward whenever the offer comes.\"",
                "source": "checks",
                "label": "What the trailer sells me:",
                "cta": "Save this"
              }
            ],
            "sources": "Playing the tape forward is a vivid form of episodic future thinking, used here as the deliberate counter to present bias (Day 3). Treated as a general behavioural technique (plausible), not a pornography-specific controlled finding.",
            "action": "Before acting on an urge, narrate the next two hours honestly to yourself. Then choose.",
            "reflection": "Write the honest \"after\" the craving always edits out, how the two hours following a slip go and feel for you. Keep it handy to play forward next time."
          }
        ]
      },
      {
        "code": "IV.B",
        "title": "What survives being aroused",
        "description": "Retiring the defences that vanish, and fitting the ones that hold.",
        "lessons": [
          {
            "number": 63,
            "heading": "The tools that vanish when you're aroused",
            "title": "The defences that vanish",
            "tag": "evidence — why shame can't be the plan",
            "tagColor": "#375623",
            "sub": "IV.B",
            "week": 5,
            "day": 4,
            "order": 62,
            "slug": "the-defences-that-vanish-63",
            "pages": [
              {
                "kind": "teach",
                "headline": "Shame, disgust and fear all clock off at the moment you need them.",
                "body": "When you’re aroused they go quiet, and then afterwards they come back at double strength as fuel for the next round (Grubbs et al., 2019; Prause & Binnie, 2024). A guard who misses the incident and then bills you for it afterwards isn’t much of a guard.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "What survives being aroused is whatever was fitted before the arousal started.",
                "body": "That means the room being set up, rules with no decisions left in them, habits you have practised, and a rehearsed picture of how the after goes. Vividness does the job that shame was pretending to do. And it does it without the trapdoor underneath.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What have you been leaning on?",
                "checks": [
                  {
                    "key": "selfdisgust",
                    "label": "Disgust at myself",
                    "asIn": "The revulsion that evaporates at the peak",
                    "short": "disgust at myself"
                  },
                  {
                    "key": "caught",
                    "label": "Fear of being found out",
                    "asIn": "Vivid at noon and weightless at midnight",
                    "short": "fear of being found out"
                  },
                  {
                    "key": "punish",
                    "label": "Punishments I promised myself",
                    "asIn": "Penalties agreed and never once enforced",
                    "short": "punishments I promised myself"
                  },
                  {
                    "key": "regret",
                    "label": "Remembering yesterday's regret",
                    "asIn": "Yesterday's ache, which I can’t reach tonight",
                    "short": "remembering the regret"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "standing",
                "headline": "At the peak, what was still standing?",
                "helper": "Whatever being aroused couldn’t switch off.",
                "options": [
                  "The room was already set up",
                  "A rule fired on its own",
                  "The picture of the after came back to me",
                  "Nothing at all"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "selfdisgust",
                    "headline": "Disgust doesn’t merely vanish at the peak. It comes back afterwards as shame, and shame is fuel.",
                    "body": "Lesson 14 made that whole case. That means retiring this particular tool pays you twice, not once."
                  },
                  {
                    "key": "caught",
                    "headline": "Fear needs the watcher to feel present, and being aroused clears the room of watchers.",
                    "body": "The working version of that instinct is a commitment device, as in Lesson 50, because that keeps watching without needing to be felt."
                  },
                  {
                    "key": "punish",
                    "headline": "During a strong urge, it is easy to abandon a penalty you set for yourself.",
                    "body": "A stake only works when somebody else holds it. Even then, use it to slow the choice down, not to punish yourself."
                  },
                  {
                    "key": "regret",
                    "headline": "Regret can’t be recalled at the peak, but it can be recorded in advance, which is the loophole.",
                    "body": "Written once and read at the moment of the offer, it becomes Lesson 62's film, not a memory you can’t reach."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The room was already set up",
                      "A rule fired on its own"
                    ],
                    "body": "You have seen the answer working with your own eyes. The defences that need nothing from you in the moment are the ones that hold, so build outwards from those."
                  },
                  {
                    "options": [
                      "The picture of the after came back to me"
                    ],
                    "body": "A rehearsed picture that surfaces on its own has become a reflex, so keep screening it as in Lesson 62 and it will keep turning up."
                  },
                  {
                    "options": [
                      "Nothing at all"
                    ],
                    "body": "Everything moves upstream, and that is a plan rather than a defeat. Part II holds the line while the practised tools get built."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "replacement",
                "headline": "What replaces it?",
                "helper": "Fitted while calm, and working while flooded.",
                "options": [
                  "The rehearsed after, from Lesson 62",
                  "Setting the room up, from Part II",
                  "A key given away, from Lesson 50",
                  "The friendly voice after a slip, from Lesson 14"
                ],
                "result": "Fitting: {pick}"
              },
              {
                "kind": "collect",
                "title": "The replacement",
                "template": "\"The defences that vanish are off my plan, and in their place I’m fitting {pick}.\"",
                "fallback": "\"I’ll retire the vanishing defences this week and give each one's job to something that survives.\"",
                "source": "checks",
                "label": "What I was leaning on:",
                "cta": "Save this"
              }
            ],
            "sources": "Shame and moral incongruence driving distress and relapse rather than preventing it: Grubbs et al. (2019) and Prause & Binnie (2024), both in the evidence base; the abstinence-violation effect (Part B3) is the mechanism by which the returning shame converts one slip into a binge. Arousal suppressing cold-state judgement: Ariely & Loewenstein (2006), STUDY_BANK.md. This lesson is the cost-side twin of Lesson 2.",
            "action": "Name the vanishing tool you've leaned on most (disgust, fear, punishment, remembered regret) and write down its replacement from the surviving set: staging, an if-then, a held key, or the rehearsed after.",
            "reflection": "Be honest: which tool were you counting on, and where was it at your last peak urge? Write the surviving tool that now takes its job, and set it up while you're calm."
          },
          {
            "number": 64,
            "heading": "The future-self letter",
            "title": "Writing to yourself in a year",
            "tag": "plausible — future-self continuity",
            "tagColor": "#0B3C49",
            "sub": "IV.B",
            "week": 5,
            "day": 5,
            "order": 63,
            "slug": "writing-to-yourself-in-a-year-64",
            "pages": [
              {
                "kind": "teach",
                "headline": "What you do tonight affects how you feel and live a year from now.",
                "body": "The relief is immediate, while the cost comes later. Thinking clearly about your future makes that cost easier to consider now.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "That’s why this is a studied nudge, not a nice idea.",
                "body": "People who feel connected to their future make more patient decisions about money and health (Hershfield and colleagues). This is a small exercise, but it only takes ten minutes.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "A year from now, what would you least want?",
                "checks": [
                  {
                    "key": "fog",
                    "label": "The same fog, a year older",
                    "asIn": "The mornings still going the same way",
                    "short": "the same fog"
                  },
                  {
                    "key": "hiding",
                    "label": "Still hiding the same thing",
                    "asIn": "The tabs and the history and the managing, unchanged",
                    "short": "still hiding it"
                  },
                  {
                    "key": "closeness",
                    "label": "The closeness never arriving",
                    "asIn": "Another year of settling for the substitute",
                    "short": "the closeness never arriving"
                  },
                  {
                    "key": "stranger",
                    "label": "Him still being a stranger",
                    "asIn": "A future self too vague for me to owe anything to",
                    "short": "him still being a stranger"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "free",
                "headline": "What should this year free up for him?",
                "helper": "His side of the ledger. Pick whatever he would want.",
                "options": [
                  "Mornings",
                  "Money",
                  "Closeness",
                  "Focus",
                  "Self-respect",
                  "Energy",
                  "Time",
                  "Quiet nights"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "fog",
                    "headline": "The letter starts with the fog, because that is what he remembers most clearly.",
                    "body": "He remembers it the way you remember an illness, and what he is asking you for is to keep him out of it."
                  },
                  {
                    "key": "hiding",
                    "headline": "The letter starts with the hiding.",
                    "body": "He has put down the tabs and the half-lies and all the small covering up, and the thing he wants protected is that lightness, not anything grander."
                  },
                  {
                    "key": "closeness",
                    "headline": "The letter starts with the closeness.",
                    "body": "Whatever he has built with somebody by then began with the evenings you’re choosing now, which isn’t a sentimental claim but a practical one."
                  },
                  {
                    "key": "stranger",
                    "headline": "The letter's first job is an introduction.",
                    "body": "Give him a morning, a face and a stake in tonight, because it’s harder to short-change somebody you can picture."
                  },
                  {
                    "key": "none",
                    "headline": "If none of those dreads fit, then write it the other way round instead.",
                    "body": "Name the year he is glad happened, and then work backwards from it to what tonight would have to look like."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Mornings",
                      "Energy",
                      "Quiet nights"
                    ],
                    "body": "Put those at the top of his list, because they’re the cheapest thing tonight can buy him and the first thing the old trade always took."
                  },
                  {
                    "options": [
                      "Closeness",
                      "Self-respect"
                    ],
                    "body": "Put those at the top of his list, because they’re the slow-growing kind, which is exactly why only a year of protected evenings can buy them."
                  },
                  {
                    "options": [
                      "Focus",
                      "Time",
                      "Money"
                    ],
                    "body": "Put those at the top of his list, because they compound. Whatever tonight protects, next month multiplies."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "direction",
                "headline": "Which way round will you write it?",
                "helper": "Either direction makes him real.",
                "options": [
                  "A thank-you from him",
                  "A request from him",
                  "Both, half and half"
                ],
                "result": "Writing: {pick}"
              },
              {
                "kind": "collect",
                "title": "His letter",
                "template": "\"What he most needs me to protect this year is {grid}, and tonight counts towards it.\"",
                "fallback": "\"I’ll write the letter this week, {pick}, and tonight counts towards it.\"",
                "source": "grid",
                "label": "",
                "cta": "Save this"
              }
            ],
            "sources": "Future-self continuity is a studied effect: greater felt connection to the future self is associated with more patient, long-term choices, and vividness interventions can shift them (Hershfield and colleagues), used here at the \"plausible\" level. Specific neuroimaging claims are deliberately not asserted.",
            "action": "Write a short letter from one-year-from-now-you back to today-you. What did this year free up? Save it; re-read on hard nights.",
            "reflection": "In one line, name what future-you (a year out) most wants you to protect this year. Write it as if he's asking you directly."
          },
          {
            "number": 65,
            "heading": "The deathbed lens",
            "title": "Sorting what matters",
            "tag": "reframe — logotherapy",
            "tagColor": "#4B3F72",
            "sub": "IV.B",
            "week": 5,
            "day": 6,
            "order": 64,
            "slug": "sorting-what-matters-65",
            "pages": [
              {
                "kind": "teach",
                "headline": "On an ordinary day everything shouts at you at roughly the same volume.",
                "body": "The email, the craving and the worry all sound equally urgent. Frankl's question cuts through that by asking you to look back from near the end of your life and work out what would have mattered, which sorts what matters from what is merely loud.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Run the question across three different lengths of time.",
                "body": "Each one tells you something the others don’t.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "A week strips life down to what is non-negotiable, and the answer is almost always people",
                    "A month adds whatever you’d want to put right",
                    "A year is long enough to build something and too short to waste"
                  ],
                  "note": "The year is the interesting one."
                }
              },
              {
                "kind": "ask",
                "headline": "What do you notice when you ask it?",
                "checks": [
                  {
                    "key": "people",
                    "label": "The week is all people",
                    "asIn": "Being present, and being known, and nothing else survives",
                    "short": "the week being all people"
                  },
                  {
                    "key": "build",
                    "label": "The year has something to build in it",
                    "asIn": "Something started, or learned, or repaired",
                    "short": "the year having something to build"
                  },
                  {
                    "key": "absent",
                    "label": "Porn is on none of the lists",
                    "asIn": "Held up against the question it’s trivial",
                    "short": "it being on none of the lists"
                  },
                  {
                    "key": "unsettles",
                    "label": "The question unsettles me",
                    "asIn": "It’s uncomfortable to look at directly",
                    "short": "being unsettled by it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "year",
                "headline": "If you had a year, what would go in it?",
                "helper": "Pull out the real items rather than the impressive ones.",
                "options": [
                  "A relationship repaired",
                  "A skill learned",
                  "The thing I keep not starting",
                  "Proper time with my people",
                  "My health, rebuilt"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "people",
                    "headline": "Your week list is the standard human answer, and it’s also the true one.",
                    "body": "The craving never appears on that list, which tells you something precise about its actual size."
                  },
                  {
                    "key": "build",
                    "headline": "The thing you’d build is your tool, so make it concrete and start it.",
                    "body": "Once it exists you have something to point at whenever the craving insists that nothing matters much anyway."
                  },
                  {
                    "key": "absent",
                    "headline": "Notice that absence properly instead of skimming past it.",
                    "body": "It survives no honest list at any length of time, which is what something looks like when you finally see it at its real size."
                  },
                  {
                    "key": "unsettles",
                    "headline": "The discomfort is the question coming into focus.",
                    "body": "It sorts what matters from what is merely loud, and that sorting stings a little before it settles, which is normal, not a sign of anything wrong."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A relationship repaired",
                      "Proper time with my people"
                    ],
                    "body": "Start with the person. One message or one visit, this week, because the year-long list is built out of exactly those small moves."
                  },
                  {
                    "options": [
                      "A skill learned",
                      "The thing I keep not starting"
                    ],
                    "body": "Give it its first hour this week. A year is made out of things that got started, and started things tend to fill the space that cravings grew in."
                  },
                  {
                    "options": [
                      "My health, rebuilt"
                    ],
                    "body": "The body makes every other item on the list easier, so an hour of it this week is a down payment on all of them."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "piece",
                "headline": "What are you starting this week?",
                "helper": "Off the list and into the diary.",
                "options": [
                  "The person",
                  "The skill",
                  "The thing I keep not starting",
                  "An hour on my health"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The year",
                "template": "\"If I had a year, it would go on {grid}, and this week's piece of it is {pick}. The craving looks small next to that.\"",
                "fallback": "\"I’ll answer all three versions of the question this week and take one item off the list and into the diary.\"",
                "source": "checks",
                "label": "What the question showed:",
                "cta": "Save this"
              }
            ],
            "sources": "The imagine looking back from the end prompt is a paraphrase of Frankl's logotherapeutic technique (Man's Search for Meaning). No empirical statistic is claimed; presented as a clarifying reframe.",
            "action": "Answer all three (one week / month / year). Pull out one thing to act on this week.",
            "reflection": "Answer the one-year version honestly: if I had a year left, I'd want to spend it on ______. Then name one piece of that you could start this week."
          }
        ]
      }
    ]
  },
  {
    "n": 6,
    "title": "Part V · Raise what watching would spend",
    "ground": "Ground VI · The Long March",
    "description": "This part works on the other side of the sum. That means having a reason, a life that is filling up, an idea of who you’re becoming, and rewards that can compete, until the offer has to bid against something that outweighs it.",
    "subs": [
      {
        "code": "V.A",
        "title": "Your reason",
        "description": "Something to walk towards, a why, a better scoreboard, and the fact that the days are finite.",
        "lessons": [
          {
            "number": 66,
            "heading": "Toward, not away",
            "title": "Something to walk towards",
            "tag": "evidence — ACT values",
            "tagColor": "#375623",
            "sub": "V.A",
            "week": 6,
            "day": 1,
            "order": 65,
            "slug": "something-to-walk-towards-66",
            "pages": [
              {
                "kind": "teach",
                "headline": "A goal that is only \"stop\" points you at an empty room.",
                "body": "Suppose you get through the evening without it. The job it was doing, whether that was winding you down or getting you out of the day, is still sitting there unfilled, and your nervous system will grab the fastest thing available, which is the thing you have just put down.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Trying not to think about something also rebounds on you.",
                "body": "Tell somebody not to think about a white bear and the watching for it is the thinking about it (Wegner et al., 1987). ACT's answer, which is the best evidenced approach here, is to walk towards something you value instead (Twohig & Crosby, 2010).",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does your goal sound like?",
                "checks": [
                  {
                    "key": "never",
                    "label": "\"Never again\"",
                    "asIn": "All brake and no destination",
                    "short": "\"never again\""
                  },
                  {
                    "key": "fix",
                    "label": "\"Stop being like this\"",
                    "asIn": "Aimed at who I am, not at what I do",
                    "short": "\"stop being like this\""
                  },
                  {
                    "key": "tonight",
                    "label": "\"Just get through tonight\"",
                    "asIn": "Teeth gritted, eyes fixed on the thing I’m avoiding",
                    "short": "\"just get through tonight\""
                  },
                  {
                    "key": "back",
                    "label": "\"Get my evenings back\"",
                    "asIn": "That’s an actual destination",
                    "short": "\"get my evenings back\""
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "dest",
                "headline": "What would the freed-up evenings hold?",
                "helper": "Pick what would really be there, not what should be.",
                "options": [
                  "Somebody I love",
                  "My children",
                  "Training",
                  "Making something",
                  "Reading",
                  "Proper sleep",
                  "Friends",
                  "Being outside"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "never",
                    "headline": "\"Never again\" is all brake and no steering. That’s why it holds until the first empty evening.",
                    "body": "After that the room fills itself with whatever is nearest, and nearest is the thing you were trying not to do."
                  },
                  {
                    "key": "fix",
                    "headline": "\"Stop being like this\" points all the effort at your character, which isn’t where the behaviour lives.",
                    "body": "The behaviour lives in a particular hour of a particular evening, so point the effort there and it has something to work on."
                  },
                  {
                    "key": "tonight",
                    "headline": "Getting through tonight with your teeth gritted is like walking across ice while staring at the ice.",
                    "body": "You end up braced and rigid and more likely to slip, because all your attention is on the thing you’re afraid of."
                  },
                  {
                    "key": "back",
                    "headline": "\"Get my evenings back\" is already pointed the right way, because it names a destination.",
                    "body": "That’s what steadies a stop, since you can walk towards something in a way you can never walk away from something for very long."
                  },
                  {
                    "key": "none",
                    "headline": "If your goal is none of those, then check it for one thing only.",
                    "body": "Does it name somewhere you’re going, or does it only name a brake? If it’s only a brake, add the destination."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Somebody I love",
                      "My children"
                    ],
                    "body": "Put them in the room. Being properly present with them in the evening leaves no empty space for the old habit to move back into."
                  },
                  {
                    "options": [
                      "Training",
                      "Making something"
                    ],
                    "body": "Give the freed-up hour something to build, because energy with a destination stops pooling and looking for the nearest drain."
                  },
                  {
                    "options": [
                      "Reading",
                      "Being outside"
                    ],
                    "body": "Small is perfectly fine. A book or a walk is a real doorway, and walking towards it beats standing still staring at the ice."
                  },
                  {
                    "options": [
                      "Proper sleep",
                      "Friends"
                    ],
                    "body": "Sleep and people are the two strongest things you could put in that hour, and aiming the evening at either one tends to produce the stopping sideways."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "hour",
                "headline": "When does your empty hour open up?",
                "helper": "That’s the hour that needs somewhere to go.",
                "options": [
                  "Straight after work",
                  "Once everybody is asleep",
                  "Weekend afternoons",
                  "The last hour before bed"
                ],
                "result": "My hour: {pick}"
              },
              {
                "kind": "collect",
                "title": "Where the hour goes",
                "template": "\"I want to stop so that I can have {grid}. That’s what the freed-up hour is for.\"",
                "fallback": "\"I want to stop so that the freed-up hour has somewhere to go, and I’ll name the destination this week.\"",
                "source": "grid",
                "label": "The hour to guard:",
                "cta": "Save this"
              }
            ],
            "sources": "The toward-values stance and the rebound problem with suppression are core to ACT, the best-supported approach for problematic pornography use (Twohig & Crosby, 2010; Crosby & Twohig, 2016). The white-bear suppression effect is Wegner et al. (1987).",
            "action": "Rewrite your goal as a toward statement. Take your \"stop ___\" and turn it into a \"become / build / be present for ___.\"",
            "reflection": "Write the second half of your own sentence: *\"I want to stop ______ so that I can ______.\"* The part after \"so that\" is the one to keep where you can see it."
          },
          {
            "number": 67,
            "heading": "Frankl's why",
            "title": "Having a reason",
            "tag": "reframe — logotherapy",
            "tagColor": "#4B3F72",
            "sub": "V.A",
            "week": 6,
            "day": 2,
            "order": 66,
            "slug": "having-a-reason-67",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"Nothing matters anyway, so why not\" isn’t really a craving talking.",
                "body": "It’s a problem about meaning, wearing a craving's clothes, and no technique will out-argue it. The machinery in this app will get you through a difficult Tuesday. This particular question has to be met on its own ground.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Frankl, inside the camps, watched who endured and who didn’t.",
                "body": "It wasn’t the strongest. It was the ones who still had something waiting for them, whether that was a book left unwritten or a child who might still be alive (Man's Search for Meaning). He kept Nietzsche's line about it, which is that a man with a why to live can bear almost any how.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When does the \"why bother\" voice turn up?",
                "checks": [
                  {
                    "key": "flatnights",
                    "label": "On flat nights",
                    "asIn": "No trigger and no bad day, just why not",
                    "short": "on flat nights"
                  },
                  {
                    "key": "afterslips",
                    "label": "Right after a slip",
                    "asIn": "Nothing matters now anyway",
                    "short": "right after a slip"
                  },
                  {
                    "key": "noforce",
                    "label": "When nothing is pushing me",
                    "asIn": "Urges with no pressure behind them, only emptiness",
                    "short": "when nothing is pushing me"
                  },
                  {
                    "key": "rarely",
                    "label": "Rarely",
                    "asIn": "My struggle runs on something else",
                    "short": "rarely"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "why",
                "headline": "What is waiting for you?",
                "helper": "The unfinished things with your name on them.",
                "options": [
                  "Somebody I love",
                  "Work that wants finishing",
                  "The father or partner I mean to be",
                  "My own mind, back again",
                  "Something I promised myself"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "flatnights",
                    "headline": "A flat night is the empty space, and you can’t take a filler away and leave the space empty.",
                    "body": "A strong enough reason starts filling it, and once it’s partly filled the craving has less room in which to grow."
                  },
                  {
                    "key": "afterslips",
                    "headline": "\"Nothing matters now\" is the slip trying to buy the rest of the evening off you.",
                    "body": "Your reason is the one thing a slip can’t disprove, because it’s still waiting either way, and it will still be waiting tomorrow."
                  },
                  {
                    "key": "noforce",
                    "headline": "An urge with no pressure behind it is being pulled by emptiness instead of pushed by anything.",
                    "body": "Emptiness answers to meaning instead of to technique. That means these lessons are aimed at exactly the kind of night you get."
                  },
                  {
                    "key": "rarely",
                    "headline": "If the voice is rare for you, then write the reason down anyway.",
                    "body": "It’s the tool for the one night when the machinery falls short, and that night arrives for most people sooner or later."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Somebody I love",
                      "The father or partner I mean to be"
                    ],
                    "body": "Your reason has a face, which is the strongest kind there is. When a reason like that is intact, people endure almost unimaginable circumstances."
                  },
                  {
                    "options": [
                      "Work that wants finishing",
                      "Something I promised myself"
                    ],
                    "body": "An unfinished thing pulls you forwards through bad nights. For some men in the camps, the book they hadn’t written was the reason to see the morning."
                  },
                  {
                    "options": [
                      "My own mind, back again"
                    ],
                    "body": "Wanting your own attention back is a perfectly good reason, and it happens to be exactly what is being spent."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "form",
                "headline": "What kind of reason is yours?",
                "helper": "The sentence itself gets written tonight.",
                "options": [
                  "Somebody I love",
                  "Work that wants finishing",
                  "Who I am becoming",
                  "Still working it out"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your reason",
                "template": "\"A man with a why can bear almost any how, and mine is {pick}. I’m keeping it where the flat nights can find it.\"",
                "fallback": "\"I’ll draft the reason this week, in one sentence, and keep it where the flat nights can find it.\"",
                "source": "checks",
                "label": "When the voice comes:",
                "cta": "Save this"
              }
            ],
            "sources": "Viktor Frankl, Man's Search for Meaning (1946): the camp observation that a why predicted endurance, the Nietzsche line, and logotherapy's claim that meaning is the primary drive and its absence gets filled with the fastest filler, all Frankl's own, in his own words in the primary text. Negative mood and emptiness as common relapse antecedents: evidence base, Part B.",
            "action": "Write your current \"why\" in one honest sentence.",
            "reflection": "Write your why in one honest sentence, the future person, relationship, or work that's worth getting through a hard night for. Keep it where the \"nothing matters\" voice can be answered by it."
          },
          {
            "number": 68,
            "heading": "Values inventory",
            "title": "Changing what you measure",
            "tag": "evidence — ACT values + measurement",
            "tagColor": "#375623",
            "sub": "V.A",
            "week": 6,
            "day": 3,
            "order": 67,
            "slug": "changing-what-you-measure-68",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"Days clean\" is the streak mechanic wearing the costume of a scoreboard.",
                "body": "It measures the absence of one act, it’s all or nothing. And it crashes to zero the moment you slip. What you measure is what you steer by, and that particular measure steers you straight into the trapdoor.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A scoreboard built on your values measures the presence of a life instead of the absence of an act.",
                "body": "A week with a slip in it can still have been a strongly aligned week, in which you were present with your people and did good work. And it gets counted as what it was. ACT measures exactly this (Crosby & Twohig, 2016).",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does your current scoreboard do?",
                "checks": [
                  {
                    "key": "daysclean",
                    "label": "It counts days",
                    "asIn": "One absence stands in for everything else",
                    "short": "counting days"
                  },
                  {
                    "key": "allornothing",
                    "label": "It’s all or nothing",
                    "asIn": "Perfect or zero, with nothing in between",
                    "short": "being all or nothing"
                  },
                  {
                    "key": "crashes",
                    "label": "It crashes on one slip",
                    "asIn": "Weeks of living get erased in a moment",
                    "short": "crashing on one slip"
                  },
                  {
                    "key": "already",
                    "label": "It already measures values",
                    "asIn": "I have half made the swap",
                    "short": "already measuring values"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "values",
                "headline": "Which five are yours?",
                "helper": "The ones you feel, not the ones that sound good.",
                "options": [
                  "Being present as a father or partner",
                  "Work I am proud of",
                  "Real friendship",
                  "Honesty with the people close to me",
                  "Health",
                  "Learning",
                  "Courage",
                  "Being calm"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "daysclean",
                    "headline": "Counting days measures one absence and misses the entire life around it.",
                    "body": "Swap the measure and a week finally gets scored for what it contained, not for what it didn’t."
                  },
                  {
                    "key": "allornothing",
                    "headline": "Scoreboards that are all or nothing manufacture the \"might as well\" feeling.",
                    "body": "Alignment comes in degrees, which is what makes it survivable, and it also happens to be a more truthful description of a week."
                  },
                  {
                    "key": "crashes",
                    "headline": "A measure that zeroes on a slip is the abstinence-violation effect with a user interface.",
                    "body": "An alignment score takes a dent and carries on, in the same way that the week itself does."
                  },
                  {
                    "key": "already",
                    "headline": "Refine what you have got.",
                    "body": "Five values you feel, rated weekly, giving one number you’d be willing to defend. The steering gets better as the measure gets better."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Being present as a father or partner",
                      "Real friendship",
                      "Honesty with the people close to me"
                    ],
                    "body": "The values about people usually rate highest and steer hardest, and they’re also exactly what the behaviour spends."
                  },
                  {
                    "options": [
                      "Work I am proud of",
                      "Learning",
                      "Courage"
                    ],
                    "body": "The values about building give the week a direction to be aligned with, because something has to be true before \"aligned\" means anything at all."
                  },
                  {
                    "options": [
                      "Health",
                      "Being calm"
                    ],
                    "body": "The values about the body are the quiet base of the list, since weeks that are aligned with them make every other value cheaper to live by."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "tracked",
                "headline": "Which one gets rated first?",
                "helper": "One honest number per week.",
                "options": [
                  "Being present with my people",
                  "Work I am proud of",
                  "Honesty",
                  "Health"
                ],
                "result": "First: {pick}"
              },
              {
                "kind": "collect",
                "title": "The new scoreboard",
                "template": "\"The measure changes to how aligned the week was with {grid}, starting with {pick}. A week with a slip in it can still be a good week.\"",
                "fallback": "\"I’ll write down my five real values this week and change what the scoreboard measures.\"",
                "source": "checks",
                "label": "The old scoreboard:",
                "cta": "Save this"
              }
            ],
            "sources": "Values clarification and values-consistent living are core to ACT, the best-supported approach for problematic pornography use (Crosby & Twohig, 2016). Replacing the zero-reset streak metric with a values measure directly implements the evidence base's central recommendation to abandon the shame-driving streak mechanic (Part B3).",
            "action": "List your top five values. Each week, rate how aligned the week was, use that as your metric.",
            "reflection": "Write your top five real values (the ones you feel, not the impressive ones). These become your scoreboard, the thing you measure instead of \"days clean.\""
          },
          {
            "number": 69,
            "heading": "Memento mori, daily",
            "title": "Remembering the days are finite",
            "tag": "reframe — Stoic",
            "tagColor": "#4B3F72",
            "sub": "V.A",
            "week": 6,
            "day": 4,
            "order": 68,
            "slug": "remembering-the-days-are-finite-69",
            "pages": [
              {
                "kind": "teach",
                "headline": "The Stoics kept a daily reminder that they would die, and they meant it as a way of sharpening things, not as gloom.",
                "body": "Remember that you’ll die, so remember what today is for. The last day of a holiday is vivid because it’s the last one, and being finite is what makes anything feel precious.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A slip lives inside a kind of trance that assumes time is free.",
                "body": "Hours dissolve without being noticed, on the unspoken theory that there will always be more of them. A light daily reminder punctures that, because once today is finite, dissolving it starts to feel like what it is.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where do your evenings usually go?",
                "checks": [
                  {
                    "key": "trance",
                    "label": "Into a kind of trance",
                    "asIn": "The time goes without a decision anywhere in it",
                    "short": "into a trance"
                  },
                  {
                    "key": "unnoticed",
                    "label": "Hours vanish unnoticed",
                    "asIn": "The clock jumps from eight to midnight",
                    "short": "hours vanishing"
                  },
                  {
                    "key": "unvalued",
                    "label": "On things I don’t value",
                    "asIn": "Held up against the question, none of it survives",
                    "short": "on things I do not value"
                  },
                  {
                    "key": "counts",
                    "label": "They mostly count",
                    "asIn": "My compass is already roughly true",
                    "short": "mostly counting"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "counting",
                "headline": "What does a day that counted contain?",
                "helper": "Your own units, rather than anybody else's.",
                "options": [
                  "Time with somebody",
                  "Work moved forward",
                  "My body used",
                  "Something made",
                  "Rest, chosen on purpose"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "trance",
                    "headline": "The trance runs on the assumption of infinite time, and the reminder is what switches it off.",
                    "body": "Today doesn’t come round again, and feeling that lightly at the end of each day is enough to thin the trance."
                  },
                  {
                    "key": "unnoticed",
                    "headline": "A clock that jumps from eight to midnight is the mark of an evening nobody examined.",
                    "body": "One line written at the end of the day makes the hours visible again, which is most of what is needed."
                  },
                  {
                    "key": "unvalued",
                    "headline": "Keep that feeling, and keep the guilt out of it.",
                    "body": "Spending finite time on things you don’t value is information, not an accusation, and a compass points north without telling you off about it."
                  },
                  {
                    "key": "counts",
                    "headline": "The practice is maintenance for you instead of repair.",
                    "body": "The nightly line keeps a true compass true, and on the days when the honest answer is no, note it and turn towards tomorrow."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Time with somebody",
                      "Rest, chosen on purpose"
                    ],
                    "body": "Rest that you chose counts every bit as much as effort does, because the question is whether the day counted instead of whether it was productive."
                  },
                  {
                    "options": [
                      "Work moved forward",
                      "Something made"
                    ],
                    "body": "If movement is your unit then measure movement, since a day that pushed something forward answers the question without any argument."
                  },
                  {
                    "options": [
                      "My body used"
                    ],
                    "body": "A day in which you used your body is the quietest kind of day that counted, and it compounds into every other kind."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "nightline",
                "headline": "What is the one line you’ll write?",
                "helper": "Gently, at the end of the day.",
                "options": [
                  "\"Did today count?\"",
                  "\"What did today go on?\"",
                  "\"Would I take another one like it?\""
                ],
                "result": "My line: {pick}"
              },
              {
                "kind": "collect",
                "title": "The evening line",
                "template": "\"One line at the end of the day, which is {pick}. It’s a compass, not a court, and the days drift towards whatever counts.\"",
                "fallback": "\"I’ll start the evening line this week, one question, with no verdicts attached to it.\"",
                "source": "checks",
                "label": "Where my evenings go:",
                "cta": "Save this"
              }
            ],
            "sources": "Memento mori is a Stoic practice (general knowledge, primary tradition), presented as a reframe. The gentle, not harsh framing protects the no-shame principle (Day 50). No empirical statistic is claimed.",
            "action": "Add a one-line evening check: \"Did today count?\", honest, not harsh.",
            "reflection": "Try the evening line for a few days: \"Did today count?\" Write what you notice, not as a verdict on yourself, but as a compass showing which way your days are drifting."
          }
        ]
      },
      {
        "code": "V.B",
        "title": "Filling the empty space",
        "description": "Meaning, put together out of ordinary materials on ordinary weekdays.",
        "lessons": [
          {
            "number": 70,
            "heading": "The existential vacuum",
            "title": "The empty feeling",
            "tag": "reframe",
            "tagColor": "#4B3F72",
            "sub": "V.B",
            "week": 6,
            "day": 5,
            "order": 69,
            "slug": "the-empty-feeling-70",
            "pages": [
              {
                "kind": "teach",
                "headline": "Frankl gave a name to a feeling you’ll now start recognising everywhere, which he called the existential vacuum.",
                "body": "It’s that flat, restless, slightly aimless ache. The Sunday evening, nothing-on feeling. Not exactly unhappy, but not engaged with anything either. Just drifting.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Very often the urge is that emptiness going out shopping for something to fill itself with.",
                "body": "The emptiness turns up first, and the craving is it casting about for the quickest way to stop feeling empty. Porn happens to be the fastest thing available, which makes it junk food for a hunger you haven’t read properly.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does your version of it feel like?",
                "checks": [
                  {
                    "key": "sunday",
                    "label": "The Sunday evening feeling",
                    "asIn": "Nothing on, slightly hollow, faintly restless",
                    "short": "the Sunday evening feeling"
                  },
                  {
                    "key": "neither",
                    "label": "A stale sort of neutral",
                    "asIn": "Comfortable enough to ignore and empty enough to feed on",
                    "short": "a stale neutral"
                  },
                  {
                    "key": "unnamed",
                    "label": "A space I can’t name",
                    "asIn": "Something wants filling and I can’t say what",
                    "short": "a space I cannot name"
                  },
                  {
                    "key": "notmine",
                    "label": "It rarely visits",
                    "asIn": "My urges ride sharper weather than that",
                    "short": "it rarely visiting"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "arrives",
                "headline": "When does yours tend to arrive?",
                "helper": "Map its habits, because it keeps them.",
                "options": [
                  "Sunday evening",
                  "Weeknights after ten",
                  "Aimless afternoons",
                  "Between plans",
                  "Just after finishing something"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "sunday",
                    "headline": "The Sunday evening version is the classic one, and it’s worth catching as it settles.",
                    "body": "Name it as it arrives and the evening becomes a choice rather than a drift towards whatever is nearest."
                  },
                  {
                    "key": "neither",
                    "headline": "A stale neutral is the vacuum's camouflage, because it’s comfortable enough that you leave it alone.",
                    "body": "Naming it breaks the camouflage, and once it has a name you can decide what to do about it instead of being carried."
                  },
                  {
                    "key": "unnamed",
                    "headline": "A space you can’t name is a space that steers you, because it has no name.",
                    "body": "Saying \"ah, this is that empty feeling again\" is all of the first move, and anything you have caught you can choose about."
                  },
                  {
                    "key": "notmine",
                    "headline": "If your weather is sharper, meaning boredom or stress or loneliness, then that is fine.",
                    "body": "The naming skill still transfers directly, and this particular feeling isn’t your main problem."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Sunday evening",
                      "Weeknights after ten"
                    ],
                    "body": "A fixed arrival time is a gift, because something that keeps appointments can have something booked into its slot."
                  },
                  {
                    "options": [
                      "Aimless afternoons",
                      "Between plans"
                    ],
                    "body": "The in-between version answers to structure, so one fixed thing in the middle of the gap gives the drifting something to hold onto."
                  },
                  {
                    "options": [
                      "Just after finishing something"
                    ],
                    "body": "The hollow that follows finishing something is real and short, so name it and give it twenty minutes before you believe anything it tells you."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "move",
                "headline": "What will you do when you catch it?",
                "helper": "Once it’s caught it can be fed properly.",
                "options": [
                  "Name it out loud",
                  "Feed it something real",
                  "Step outside for ten minutes first"
                ],
                "result": "My move: {pick}"
              },
              {
                "kind": "collect",
                "title": "The empty feeling",
                "template": "\"That flat restless nothing has a name now, and when it turns up I {pick}. Named, it stops being able to steer.\"",
                "fallback": "\"I’ll watch for the empty feeling this week and name it as it arrives.\"",
                "source": "checks",
                "label": "What mine feels like:",
                "cta": "Save this"
              }
            ],
            "sources": "The existential vacuum is Frankl's own concept (Man's Search for Meaning). That emptiness and negative mood precede use is from the evidence base, Part B1(b); naming the feeling draws on the affect-labelling idea (Day 45).",
            "action": "Track the moods that precede your urges. When the vacuum shows up, name it as the vacuum.",
            "reflection": "Describe your own \"existential vacuum\" in your words, when it tends to arrive and how it feels. Naming its texture is how you'll catch it next time instead of being steered by it."
          },
          {
            "number": 71,
            "heading": "Three sources of meaning",
            "title": "Three ordinary materials",
            "tag": "reframe",
            "tagColor": "#4B3F72",
            "sub": "V.B",
            "week": 6,
            "day": 6,
            "order": 70,
            "slug": "three-ordinary-materials-71",
            "pages": [
              {
                "kind": "teach",
                "headline": "Meaning sounds like something you find on a mountaintop, and that picture stops most people before they start.",
                "body": "Frankl said the opposite, which is that meaning gets assembled locally and repeatedly, out of ordinary materials, on ordinary Wednesdays.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "He named three materials, and all of them are available to you today.",
                "body": "Meaning gets assembled out of these.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "What you make or do",
                    "Who you love and turn up for",
                    "The attitude you take towards whatever you can’t change"
                  ],
                  "note": "You act first, imperfectly, while still feeling flat, and the feeling follows along behind the action."
                }
              },
              {
                "kind": "ask",
                "headline": "Where do you stand at the moment?",
                "checks": [
                  {
                    "key": "nothing",
                    "label": "I’m not making anything",
                    "asIn": "There’s nothing that is mine and that matters",
                    "short": "not making anything"
                  },
                  {
                    "key": "noone",
                    "label": "I’m not turning up for anyone",
                    "asIn": "The richest of the three, and currently unattended",
                    "short": "not turning up for anyone"
                  },
                  {
                    "key": "nostance",
                    "label": "I’m carrying something without a stance",
                    "asIn": "Something unchangeable that I just suffer at random",
                    "short": "carrying it without a stance"
                  },
                  {
                    "key": "waiting",
                    "label": "I’m waiting to feel like it",
                    "asIn": "Still waiting to feel like it before doing anything",
                    "short": "waiting to feel like it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "deeds",
                "headline": "What small thing could you do this week?",
                "helper": "One from each, imperfect and today-sized.",
                "options": [
                  "An hour on something of my own",
                  "One small job finished properly",
                  "A proper evening with somebody",
                  "A call made rather than meant",
                  "Naming a hardship and choosing how I carry it"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "nothing",
                    "headline": "The workbench fills by being started, not by being planned.",
                    "body": "One hour on anything that is yours this week is enough, because the making is the meaning and the scale of it is beside the point."
                  },
                  {
                    "key": "noone",
                    "headline": "The empty chair is the one that pays the most. That’s why it’s worth attending to first.",
                    "body": "One evening, one person, and your undivided attention. For most people this turns out to be the richest of the three by some distance."
                  },
                  {
                    "key": "nostance",
                    "headline": "The third material is the subtle one and it’s easy to skip.",
                    "body": "Towards whatever you can’t change, you still keep one freedom, which is the attitude you take to it, and choosing that on purpose is itself the deed."
                  },
                  {
                    "key": "waiting",
                    "headline": "The waiting room doesn’t have an exit of its own, which is the whole trouble with it.",
                    "body": "You act while still feeling flat and the feeling follows afterwards. Frankl and the trial evidence arrive at the same reversal from different directions."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "An hour on something of my own",
                      "One small job finished properly"
                    ],
                    "body": "Start with the making, because it needs nobody else's diary and can therefore happen tonight."
                  },
                  {
                    "options": [
                      "A proper evening with somebody",
                      "A call made rather than meant"
                    ],
                    "body": "Start with the person. Turning up is the deed, and the meaning grows out of the act itself instead of being decided in advance."
                  },
                  {
                    "options": [
                      "Naming a hardship and choosing how I carry it"
                    ],
                    "body": "Start with the stance. Name the thing you can’t change and choose, in writing, how you’re going to carry it. That’s the deed, not the preparation for one."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "firstdeed",
                "headline": "Which one is first?",
                "helper": "This week, with flat feelings permitted.",
                "options": [
                  "Make something",
                  "Turn up for somebody",
                  "Choose how I carry something"
                ],
                "result": "First: {pick}"
              },
              {
                "kind": "collect",
                "title": "The three materials",
                "template": "\"Meaning gets assembled rather than found. This week I start with {pick}, and the feeling follows the act.\"",
                "fallback": "\"I’ll put one small thing from each of the three in the diary this week, imperfectly and on purpose.\"",
                "source": "checks",
                "label": "Where I stand:",
                "cta": "Save this"
              }
            ],
            "sources": "The three sources of meaning (creative, experiential, attitudinal) are Frankl's own (Man's Search for Meaning). The act toward values, let feeling follow stance is core ACT (committed action), the best-supported approach for problematic pornography use per the evidence base (Crosby & Twohig, 2016).",
            "action": "Do one small thing from each of the three categories this week. Log them.",
            "reflection": "Name one concrete thing from each bucket you could do this week: one to make/do, one person to show up for, one hardship to take a better stance toward."
          },
          {
            "number": 72,
            "heading": "Ikigai",
            "title": "A reason to get up",
            "tag": "reframe",
            "tagColor": "#4B3F72",
            "sub": "V.B",
            "week": 6,
            "day": 7,
            "order": 71,
            "slug": "a-reason-to-get-up-72",
            "pages": [
              {
                "kind": "teach",
                "headline": "Ikigai translates roughly as a reason to get up in the morning, and the claim is that a life organised around one is sturdier.",
                "body": "Which sounds like an odd thing to put in a programme about evenings, until you see the wiring. A day with some pull in it resists the empty feeling that the night feeds on.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "An urge that arrives in an empty evening walks into an open room and wins without competing.",
                "body": "The same urge arriving in a life with real pull in it has to compete against a project, a person, or a purpose. And a craving that has to compete loses more often than one that doesn’t.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What are your mornings like?",
                "checks": [
                  {
                    "key": "nopull",
                    "label": "Nothing pulls",
                    "asIn": "The alarm is the only argument for getting up",
                    "short": "nothing pulling"
                  },
                  {
                    "key": "obligations",
                    "label": "Only obligations",
                    "asIn": "Plenty to do and none of it wanted",
                    "short": "only obligations"
                  },
                  {
                    "key": "somedays",
                    "label": "Some days have pull",
                    "asIn": "Some do and some don’t",
                    "short": "some days having pull"
                  },
                  {
                    "key": "realpull",
                    "label": "Most days have pull",
                    "asIn": "The room is already occupied",
                    "short": "most days having pull"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "pulls",
                "headline": "What could pull you through a day?",
                "helper": "A rough sketch is enough. This isn’t a life plan.",
                "options": [
                  "A project halfway through",
                  "People counting on me",
                  "A craft that is improving",
                  "Work that matters",
                  "Somewhere I am useful"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "nopull",
                    "headline": "Start smaller than the word purpose, because purpose isn’t a thing you can begin on a Tuesday.",
                    "body": "One thing you’re tinkering with is enough to give a day somewhere to go, and you find the reason partly by getting up and trying things, not by deciding on it first."
                  },
                  {
                    "key": "obligations",
                    "headline": "Duties fill the hours without ever occupying the room, and the difference is whether you want the thing.",
                    "body": "Add one wanted thing to the week and then watch what happens to the evenings, because that is where you’ll notice it."
                  },
                  {
                    "key": "somedays",
                    "headline": "The flicker means the sketch is already working somewhere.",
                    "body": "Feed the days that pull and notice what they have in common, because whatever that is will be your rough answer."
                  },
                  {
                    "key": "realpull",
                    "headline": "Your nights are already easier than they would otherwise be, whether or not you had noticed.",
                    "body": "Keep the room occupied, and let this lesson be an explanation of something you’re already doing right."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A project halfway through",
                      "A craft that is improving"
                    ],
                    "body": "Something that is improving is the most reliable pull there is, because progress makes its own appointments."
                  },
                  {
                    "options": [
                      "People counting on me",
                      "Somewhere I am useful"
                    ],
                    "body": "Being needed is pull in its strongest form, since it’s hard to ignore at seven in the morning and still working at eleven at night."
                  },
                  {
                    "options": [
                      "Work that matters"
                    ],
                    "body": "If the work itself can matter then the day has a spine built into it, so shape the job towards whichever part of it does."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "movefwd",
                "headline": "What is one move towards it?",
                "helper": "This week, and rough is fine.",
                "options": [
                  "An hour on the project",
                  "Offer to be useful somewhere",
                  "Book the thing",
                  "Get up and try one thing"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The sketch",
                "template": "\"A rough reason to get up, which is {grid}, and this week's move towards it is {pick}. A direction is enough to be going on with.\"",
                "fallback": "\"I’ll sketch it out this week, meaning what I love, what I’m decent at and what is needed, and take one step towards the overlap.\"",
                "source": "checks",
                "label": "My mornings now:",
                "cta": "Save this"
              }
            ],
            "sources": "Ikigai is a cultural concept (general knowledge), used here as another route to the meaning and vacuum point. No empirical claim is made; presented as a reframe.",
            "action": "Sketch your rough ikigai. Note one concrete move toward it this week.",
            "reflection": "Sketch a rough answer: what you love, what you're good at, what's needed. Name one small move toward where they overlap, a direction is enough; it doesn't have to be the whole answer."
          },
          {
            "number": 73,
            "heading": "The contribution antidote",
            "title": "Doing something for somebody else",
            "tag": "plausible — meaning / wellbeing",
            "tagColor": "#0B3C49",
            "sub": "V.B",
            "week": 6,
            "day": 8,
            "order": 72,
            "slug": "doing-something-for-somebody-else-73",
            "pages": [
              {
                "kind": "teach",
                "headline": "Meaning tends to arrive through giving, not through getting, which is annoying but reasonably well established.",
                "body": "Across the wellbeing research, doing something for other people keeps coming up as one of the most reliable sources of it there is. We go looking for it by acquiring things and it keeps arriving through the other door.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Which matters here because the behaviour is a closed loop made of getting.",
                "body": "Contribution points the other way, at somebody who isn’t you. The empty feeling is a sealed room, and giving opens it at exactly the spot where getting seals it a little tighter.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When you feel empty, what is your instinct?",
                "checks": [
                  {
                    "key": "inward",
                    "label": "To turn inwards",
                    "asIn": "Down the tunnel of me and my problem",
                    "short": "turning inwards"
                  },
                  {
                    "key": "treat",
                    "label": "To treat myself",
                    "asIn": "Get something, quickly, to feel better",
                    "short": "treating myself"
                  },
                  {
                    "key": "consume",
                    "label": "To consume my way out",
                    "asIn": "Screens, food, buying things",
                    "short": "consuming my way out"
                  },
                  {
                    "key": "outward",
                    "label": "Sometimes to turn outwards",
                    "asIn": "I have felt this work once or twice",
                    "short": "sometimes turning outwards"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "who",
                "headline": "Who could use an hour of your time?",
                "helper": "Real names belong here instead of categories.",
                "options": [
                  "A friend having a rough time",
                  "Family who would notice",
                  "A neighbour",
                  "Somebody newer to this than me",
                  "A cause I could reach"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "inward",
                    "headline": "The tunnel deepens the very emptiness it promises to relieve.",
                    "body": "That’s because the emptiness is partly made of too much attention pointed at yourself, so the exit runs outwards instead of further in."
                  },
                  {
                    "key": "treat",
                    "headline": "A treat quiets the pang for about ten minutes and then feeds the loop.",
                    "body": "The odd move, which is giving something away exactly when you feel you have least to give, is the one that reaches the bottom of it."
                  },
                  {
                    "key": "consume",
                    "headline": "Getting is the empty feeling's native language, so answering in the same language never settles anything.",
                    "body": "Answer in the opposite one, which is a small cost, not a small purchase, and the emptiness shrinks where it expected to be fed."
                  },
                  {
                    "key": "outward",
                    "headline": "You have already felt the odd part of this work.",
                    "body": "Make it deliberate on the flat days, which are the days when the instinct to turn inwards shouts loudest."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A friend having a rough time",
                      "Family who would notice"
                    ],
                    "body": "Start with the nearest name, because the smallest real help given at slight cost beats the grandest intention every time."
                  },
                  {
                    "options": [
                      "A neighbour",
                      "A cause I could reach"
                    ],
                    "body": "Nearby beats grand. One hour, somewhere you already are, this week."
                  },
                  {
                    "options": [
                      "Somebody newer to this than me"
                    ],
                    "body": "Helping somebody a few steps behind you counts twice over, since it fills your empty space and thins theirs at the same time."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "give",
                "headline": "What is the small, slightly costly thing?",
                "helper": "The cost is what makes it giving rather than gesturing.",
                "options": [
                  "An hour of my time",
                  "Practical help with something",
                  "A proper check-in",
                  "Teaching somebody something I know"
                ],
                "result": "Giving: {pick}"
              },
              {
                "kind": "collect",
                "title": "The experiment",
                "template": "\"The opposite move, tried honestly. That means {pick} for {grid}. Giving reaches what getting only deepens.\"",
                "fallback": "\"I’ll do one act of real help this week at slight cost, and then check what happened to the emptiness.\"",
                "source": "checks",
                "label": "My old instinct:",
                "cta": "Save this"
              }
            ],
            "sources": "That meaning arrives more through contribution than acquisition is a robust theme in wellbeing research generally (general knowledge), used here at the plausible level as the structural opposite of the self-focused compulsive loop. Ties to the meaning and vacuum material this week; no pornography-specific statistic claimed.",
            "action": "Do one act of service or help this week. Log how it shifted the emptiness, if at all.",
            "reflection": "Name one person you could help this week in a way that costs you a little. Afterwards, write what it did to the emptiness, test the giving-versus-getting claim on yourself."
          },
          {
            "number": 74,
            "heading": "The spiritual route (for those it fits)",
            "title": "The religious route",
            "tag": "contested — works for some; faith-specific",
            "tagColor": "#7F6000",
            "sub": "V.B",
            "week": 6,
            "day": 9,
            "order": 73,
            "slug": "the-religious-route-74",
            "pages": [
              {
                "kind": "teach",
                "headline": "For some men, faith is the route. Leaving it out would be dishonest.",
                "body": "A living faith can provide both meaning and community. Those are two of the strongest supports in this part. The route is here for people who want it, and it isn’t pushed on anyone else.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "There’s one caution because this route can cut both ways.",
                "body": "A gap between what you believe and what you do can breed shame, and shame can feed the next relapse (Grubbs et al., 2019). The same faith can help through grace or harm through condemnation.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where does faith stand for you?",
                "checks": [
                  {
                    "key": "central",
                    "label": "Central and alive",
                    "asIn": "The framework already carries me",
                    "short": "central and alive"
                  },
                  {
                    "key": "strained",
                    "label": "There but strained",
                    "asIn": "The belief is intact and the relationship is tired",
                    "short": "there but strained"
                  },
                  {
                    "key": "condemns",
                    "label": "It has become condemnation",
                    "asIn": "The voice of it has mostly turned into a judge",
                    "short": "it having become condemnation"
                  },
                  {
                    "key": "notroute",
                    "label": "Not my road",
                    "asIn": "I skip this one without any guilt",
                    "short": "not being my road"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "supplies",
                "headline": "What does the tradition give you?",
                "helper": "Its actual working parts.",
                "options": [
                  "Meaning that is already built",
                  "A community",
                  "Accountability",
                  "Practices that steady me",
                  "Grace after failure"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "central",
                    "headline": "Use its strengths instead of incidentally.",
                    "body": "The meaning and the people are what the empty feeling and the isolation feed on in their absence, so you’re already holding the two strongest cards."
                  },
                  {
                    "key": "strained",
                    "headline": "A strained faith usually needs the practice more than it needs the argument.",
                    "body": "One steadying practice this week, kept small, and then let the relationship breathe instead of trying to settle it by thinking about it."
                  },
                  {
                    "key": "condemns",
                    "headline": "The caution matters most of all for you.",
                    "body": "Condemnation manufactures the exact shame that drives the cycle. The traditions themselves put grace at the centre, meaning a love that meets failure, and Lesson 14's friendly voice is the secular version of the same thing."
                  },
                  {
                    "key": "notroute",
                    "headline": "Skip it cleanly and without guilt.",
                    "body": "Different routes fit different people, and yours runs through other parts of this course."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Meaning that is already built",
                      "Practices that steady me"
                    ],
                    "body": "The meaning and the practices answer the empty feeling directly. Where other people have to assemble something from scratch, you have a framework already standing."
                  },
                  {
                    "options": [
                      "A community",
                      "Accountability"
                    ],
                    "body": "The people are half the power of this route, since real faces and kind ones are already gathered. That’s Part VI's work, mostly done in advance."
                  },
                  {
                    "options": [
                      "Grace after failure"
                    ],
                    "body": "Grace after failure answers the entire caution, so keep the faith on that side of the line and it will heal instead of harm."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "practice",
                "headline": "What will you do this week, if it fits?",
                "helper": "The route, walked.",
                "options": [
                  "One practice, daily",
                  "One contact with the community",
                  "Both",
                  "A different road for me"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The route",
                "template": "\"Planted on the grace side. That means {pick}. The version that works meets failure with love, not with a verdict.\"",
                "fallback": "\"I’ll either walk the route or skip it honestly this week, and no version of it gets used as a stick.\"",
                "source": "checks",
                "label": "Where faith stands:",
                "cta": "Save this"
              }
            ],
            "sources": "Presented as contested and faith-specific, one route among several, not pressed on anyone. The caution rests on the best-evidenced moderator in the field: religiosity and moral incongruence inflating shame and self-perceived addiction (Grubbs et al., 2019), tied to the self-compassion finding (Day 50).",
            "action": "If it fits you, add one spiritual practice and one faith-community contact this week.",
            "reflection": "If faith is part of your life, ask honestly: is yours functioning as grace (which heals) or as condemnation (which shames)? Write one way to keep it on the grace side after a slip."
          }
        ]
      },
      {
        "code": "V.C",
        "title": "Who you’re becoming",
        "description": "The root underneath, the story you tell, the identity you’re building, and having something worth not spoiling.",
        "lessons": [
          {
            "number": 75,
            "heading": "Sam's weeds-from-the-root",
            "title": "Pulling weeds up properly",
            "tag": "reframe — Sathiya Sam (coaching text)",
            "tagColor": "#4B3F72",
            "sub": "V.C",
            "week": 6,
            "day": 10,
            "order": 74,
            "slug": "pulling-weeds-up-properly-75",
            "pages": [
              {
                "kind": "teach",
                "headline": "Sathiya Sam tells a story about mowing his family's lawn when he was sixteen.",
                "body": "There was a patch of weeds in it, and every week he ran the mower straight over the patch instead of kneeling down and pulling the roots out. The lawn looked clean for a few days and the weeds were always back by the weekend, week after week, for years (The Last Relapse).",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "His blunt claim is that all behaviour is rooted in belief, and the lawn is what he means by it.",
                "body": "Filters, counters and white-knuckle weeks are all mowing. The surface gets cut down to a nice flat plane and then it grows back, because the root, which might be a belief or a wound or an emptiness, was never touched at all.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What has your mowing looked like?",
                "checks": [
                  {
                    "key": "filters",
                    "label": "Filters and blockers",
                    "asIn": "Trimming the surface with software",
                    "short": "filters and blockers"
                  },
                  {
                    "key": "counting",
                    "label": "Counting the days",
                    "asIn": "Admiring the lawn with the patch still in it",
                    "short": "counting the days"
                  },
                  {
                    "key": "whiteknuckle",
                    "label": "Weeks of gritted teeth",
                    "asIn": "Effort holding the top of it down",
                    "short": "weeks of gritted teeth"
                  },
                  {
                    "key": "regimes",
                    "label": "A new regime every Monday",
                    "asIn": "A fresh mower every week and the same patch",
                    "short": "a new regime every Monday"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "roots",
                "headline": "What might the root be?",
                "helper": "What the weed is growing out of.",
                "options": [
                  "A life pointed nowhere",
                  "An old wound",
                  "Loneliness",
                  "A belief that I am broken",
                  "The empty feeling itself"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "filters",
                    "headline": "Keep the filters and stop expecting them to reach the soil, because software cuts the surface and that is all it does.",
                    "body": "Kneeling down is a different job with different tools, and you can do both without either one being a criticism of the other."
                  },
                  {
                    "key": "counting",
                    "headline": "The count only measures the mowing, not the state of the lawn.",
                    "body": "A clean fortnight with a live root underneath is a patch waiting for rain. That’s why clean fortnights sometimes end so suddenly."
                  },
                  {
                    "key": "whiteknuckle",
                    "headline": "Effort held against a growing thing tires first, because the growing thing doesn’t get tired.",
                    "body": "The root feeds every night and your grip has a limit, so send the effort downwards instead of trying to hold on for longer."
                  },
                  {
                    "key": "regimes",
                    "headline": "A new mower cuts the same patch in exactly the same way as the old one did.",
                    "body": "The Monday energy is real and worth having. Spend it kneeling down for once, not on a better mower."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A life pointed nowhere",
                      "The empty feeling itself"
                    ],
                    "body": "The meaning work in this part is your root work, because the weed is growing out of unpointed time and pointing it is the pulling out."
                  },
                  {
                    "options": [
                      "An old wound",
                      "A belief that I am broken"
                    ],
                    "body": "Roots like those may need more than a course of lessons, which is what Part VIII is for. Kneeling down with a professional is still kneeling down."
                  },
                  {
                    "options": [
                      "Loneliness"
                    ],
                    "body": "The root has a name and a plan attached to it, because the substitute grows wherever the real thing is missing, and Part VI grows the real thing."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "root",
                "headline": "What is the root?",
                "helper": "The patch where the actual work is.",
                "options": [
                  "A life pointed nowhere",
                  "An old wound",
                  "Loneliness",
                  "A belief that needs shifting"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The root",
                "template": "\"Mowing keeps the war going week after week. My root, named, is {pick}, and that is where the dirty work is and the only work that stays done.\"",
                "fallback": "\"I’ll name the root this week and stop mistaking mowing for removal.\"",
                "source": "checks",
                "label": "My mowing:",
                "cta": "Save this"
              }
            ],
            "sources": "Sathiya Sam, The Last Relapse (Chapter 1): the lawn and weeds anecdote, the fifteen-year struggle, and \"all behaviour is rooted in belief\" are from the primary text, rendered in our own words with one short attributed phrase. Used as a useful reframe, secularised, not as scientific authority; it is a faith-based coaching text, not a research source. The root as a life not pointed anywhere ties to the meaning and vacuum material this week.",
            "action": "Name the \"root\" you suspect sits under the behaviour, not just the behaviour itself.",
            "reflection": "Honestly: what's the root for you, the belief, wound, or emptiness the behaviour grows from? Name it. Naming the root is the first move that isn't just mowing."
          },
          {
            "number": 76,
            "heading": "The hero's-journey reframe",
            "title": "The story you tell about it",
            "tag": "reframe",
            "tagColor": "#4B3F72",
            "sub": "V.C",
            "week": 6,
            "day": 11,
            "order": 75,
            "slug": "the-story-you-tell-about-it-76",
            "pages": [
              {
                "kind": "teach",
                "headline": "Two different stories fit exactly the same set of facts, and you get to pick which one you’re living in.",
                "body": "Same slips, same history, and completely opposite fuel.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "This struggle proves there’s something wrong with you",
                    "This is the difficult middle section of a story you’re still writing"
                  ],
                  "note": "Only one of those two is any use to you tonight."
                }
              },
              {
                "kind": "teach",
                "headline": "Describe a direction, not a permanent verdict.",
                "body": "\"I’m broken\" suggests that change is impossible. \"I’m changing this\" leaves room for a next step.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which story have you been telling yourself?",
                "checks": [
                  {
                    "key": "wrong",
                    "label": "That something is wrong with me",
                    "asIn": "The struggle read as a diagnosis",
                    "short": "that something is wrong with me"
                  },
                  {
                    "key": "verdict",
                    "label": "A verdict, already delivered",
                    "asIn": "Past tense, case closed",
                    "short": "a verdict already delivered"
                  },
                  {
                    "key": "chapter",
                    "label": "A chapter, still going",
                    "asIn": "I can half see what it’s making",
                    "short": "a chapter still going"
                  },
                  {
                    "key": "depends",
                    "label": "It depends on the day",
                    "asIn": "The story changes with the weather",
                    "short": "it depending on the day"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "becoming",
                "headline": "What might it be making of you?",
                "helper": "The person this chapter is producing.",
                "options": [
                  "Somebody who keeps going",
                  "Somebody honest about hard things",
                  "Somebody forged by exactly this",
                  "Somebody whose story has a next page"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "wrong",
                    "headline": "Take the struggle out of any story worth telling and there’s no story left in it.",
                    "body": "You’re only left with a flat character to whom nothing ever happened. What has gone wrong isn’t you but the casting of the hard part."
                  },
                  {
                    "key": "verdict",
                    "headline": "A verdict has no forward motion in it at all, and that is the damage it does.",
                    "body": "Reopen the case as a chapter instead and the same facts start pushing you along instead of pinning you down."
                  },
                  {
                    "key": "chapter",
                    "headline": "Hold onto that casting on the loud nights as well as the calm ones.",
                    "body": "The brokenness story auditions hardest right after a slip, which is exactly when the chapter version is worth the most."
                  },
                  {
                    "key": "depends",
                    "headline": "The story flipping about is normal, and the fix for it is a written line.",
                    "body": "A sentence chosen in daylight outvotes a story improvised at midnight, because at midnight you’re not really choosing anything."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Somebody who keeps going",
                      "Somebody whose story has a next page"
                    ],
                    "body": "Keeping going is the plainest kind of heroism there is, and it consists mostly of coming back the next morning whatever the night did."
                  },
                  {
                    "options": [
                      "Somebody honest about hard things",
                      "Somebody forged by exactly this"
                    ],
                    "body": "The forging only happens in this chapter, because comfortable chapters build nothing. That’s not a consolation, it’s just how stories work."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "line",
                "headline": "Finish the sentence",
                "helper": "\"Through this, I’m becoming somebody who...\"",
                "options": [
                  "keeps going",
                  "faces things squarely",
                  "is being forged by this",
                  "turns up anyway"
                ],
                "result": "Becoming somebody who {pick}"
              },
              {
                "kind": "collect",
                "title": "Your sentence",
                "template": "\"Through working through this, I’m becoming somebody who {pick}. The facts are fixed and the meaning is mine to set.\"",
                "fallback": "\"I’ll write my sentence this week and keep it somewhere visible for the hard chapters.\"",
                "source": "checks",
                "label": "The story so far:",
                "cta": "Save this"
              }
            ],
            "sources": "Narrative framing as a reframe; no empirical claim is made. Aligns with the evidence base's core anti-shame stance: a broken identity feeds the shame that drives relapse, while an in-progress identity keeps a person engaged (Part B3).",
            "action": "Write one \"what I'm becoming through this\" sentence and keep it where you'll see it.",
            "reflection": "Finish the line in your own words: \"Through working through this, I'm becoming someone who ______.\" That's your hero's-journey sentence, keep it visible for the hard chapters."
          },
          {
            "number": 77,
            "heading": "Identity-based change",
            "title": "Who you say you are",
            "tag": "plausible — identity / habits",
            "tagColor": "#0B3C49",
            "sub": "V.C",
            "week": 6,
            "day": 12,
            "order": 76,
            "slug": "who-you-say-you-are-77",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"I’m trying to quit porn\" keeps the behaviour at the centre of who you are.",
                "body": "Porn stays the main character in the story and you stay the man permanently wrestling with it. Something like \"I’m somebody who is present and lives by what he believes\" moves your identity somewhere else, and the behaviour becomes a footnote that no longer fits.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "An identity becomes true by repetition, not by decision.",
                "body": "You decide it, you act from it once, and then daily, and each action is a small vote for it being true. This idea comes from the habit-writing shelf, not from a clinic, so hold it at plausible, but a lot of people find it does real work.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is your current sentence about yourself?",
                "checks": [
                  {
                    "key": "trying",
                    "label": "\"I’m trying to quit porn\"",
                    "asIn": "The fight has become the identity",
                    "short": "\"I'm trying to quit\""
                  },
                  {
                    "key": "fighting",
                    "label": "\"I’m fighting this\"",
                    "asIn": "Another round every day, in a war that defines me",
                    "short": "\"I'm fighting this\""
                  },
                  {
                    "key": "goodday",
                    "label": "\"Good day, bad day\"",
                    "asIn": "My whole self graded by one behaviour",
                    "short": "grading myself daily"
                  },
                  {
                    "key": "identity",
                    "label": "Something about who I am",
                    "asIn": "The centre has started moving already",
                    "short": "something about who I am"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "become",
                "headline": "Which sentence would you rather be voting for?",
                "helper": "Who the votes are for.",
                "options": [
                  "Somebody present with his people",
                  "Somebody who lives by what he believes",
                  "Somebody who tells the truth",
                  "Somebody who keeps his evenings",
                  "Somebody who finishes things"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "trying",
                    "headline": "The struggler sentence turns every urge into a battle in the war that defines you.",
                    "body": "The identity sentence turns it into something that is out of character, and out of character declines things almost without effort."
                  },
                  {
                    "key": "fighting",
                    "headline": "Fighters need opponents, so that sentence keeps the opponent in work.",
                    "body": "A vegetarian doesn’t fight bacon every morning. He is just somebody who doesn’t eat it, and there’s no daily battle involved anywhere."
                  },
                  {
                    "key": "goodday",
                    "headline": "Grading your whole self by one behaviour hands that behaviour the gavel.",
                    "body": "An identity holds through a bad day in the way that somebody who reads is still somebody who reads even in a week when they read nothing."
                  },
                  {
                    "key": "identity",
                    "headline": "Keep voting, because that is the whole mechanism.",
                    "body": "It stays aspirational until enough repetitions have made it the case, and every day you act from it is another ballot in the box."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Somebody present with his people",
                      "Somebody who tells the truth"
                    ],
                    "body": "The identities about other people pay twice over, because every vote for them is also a vote against the secrecy the old pattern needed."
                  },
                  {
                    "options": [
                      "Somebody who lives by what he believes",
                      "Somebody who finishes things",
                      "Somebody who keeps his evenings"
                    ],
                    "body": "The identities about yourself give the days a spine. Act from one, once, today, and the vote is cast whether or not it felt significant."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "statement",
                "headline": "What is your sentence?",
                "helper": "Written down, then acted from once a day.",
                "options": [
                  "present with my people",
                  "living by what I believe",
                  "honest, including with myself",
                  "somebody who keeps his evenings"
                ],
                "result": "I'm someone who is {pick}"
              },
              {
                "kind": "collect",
                "title": "Your identity",
                "template": "\"I’m somebody who is {pick}. Every day's action is a vote, and the votes are what make it true.\"",
                "fallback": "\"I’ll write my sentence this week and cast the first vote the same day.\"",
                "source": "checks",
                "label": "The old sentence:",
                "cta": "Save this"
              }
            ],
            "sources": "Identity-based habit change is a popular idea from habit literature, kept honestly at \"plausible\" (not a hard clinical finding from the evidence base). It pairs with the toward-values and replacement principles that the evidence base does support (ACT; Part B).",
            "action": "Write one \"I'm someone who…\" identity statement and act from it once daily.",
            "reflection": "Write your \"I'm someone who…\" statement, the identity you're growing into. Then name one small action today that's a \"vote\" for it being true."
          },
          {
            "number": 78,
            "heading": "Things worth not ruining",
            "title": "Having something worth keeping",
            "tag": "plausible — protect the build",
            "tagColor": "#0B3C49",
            "sub": "V.C",
            "week": 6,
            "day": 13,
            "order": 77,
            "slug": "having-something-worth-keeping-78",
            "pages": [
              {
                "kind": "teach",
                "headline": "A good day defends itself, and you’ll have noticed this without necessarily naming it.",
                "body": "After a day with some wins in it the pull is noticeably smaller, because there’s something real sitting on the scales that a grey day doesn’t have. Build days like that on purpose and the cost side starts arming itself without any effort from you.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This is pride, not a streak, and the difference matters a great deal.",
                "body": "A streak is one number and it shatters. What you’re growing is a set of things a slip can’t touch, such as the training block, the friendship you repaired, or the work you shipped. What you have earned stays earned, and a slip spends none of it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What are you growing that you’d hate to dent?",
                "checks": [
                  {
                    "key": "training",
                    "label": "A run of training",
                    "asIn": "Weeks of work already in the body",
                    "short": "a run of training"
                  },
                  {
                    "key": "project",
                    "label": "A project halfway through",
                    "asIn": "Momentum with my name on it",
                    "short": "a project halfway through"
                  },
                  {
                    "key": "mended",
                    "label": "A relationship I have repaired",
                    "asIn": "Something warm that took real effort to rebuild",
                    "short": "a repaired relationship"
                  },
                  {
                    "key": "mornings",
                    "label": "A stretch of good mornings",
                    "asIn": "Clear-headed days, strung together",
                    "short": "a stretch of good mornings"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "defends",
                "headline": "What makes one of your days defend itself?",
                "helper": "The wins that change the sum in the evening.",
                "options": [
                  "A win before midday",
                  "Something finished",
                  "Real contact with somebody",
                  "My body used",
                  "An evening with some shape"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "training",
                    "headline": "A run of training is the cleanest stake there is, because it’s visible and you can feel it and it belongs to you.",
                    "body": "Tonight's session is one more weight on the cost side, which is a more useful way to think about it than as an obligation."
                  },
                  {
                    "key": "project",
                    "headline": "A project weighs most on the nights when it’s moving, so keep it moving in small pieces.",
                    "body": "A day on which you shipped something walks past the offer differently from a day on which you didn’t, and you’ll feel the difference instead of having to remember it."
                  },
                  {
                    "key": "mended",
                    "headline": "A repaired relationship is the stake with a face attached to it, and the substitute bids directly against it.",
                    "body": "Naming that trade once, calmly and in writing, is worth more than a dozen rules about screens."
                  },
                  {
                    "key": "mornings",
                    "headline": "Good mornings compound quietly, and every one of them was bought the night before.",
                    "body": "That’s the trade tonight's offer is really about, even though it never mentions the morning at all."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A win before midday",
                      "Something finished"
                    ],
                    "body": "Early wins arm the whole day, because by the evening there’s already something banked that the offer has to outbid."
                  },
                  {
                    "options": [
                      "Real contact with somebody",
                      "My body used"
                    ],
                    "body": "Contact and training defend the evening twice over, since they lift the floor and add weight to the scales at the same time."
                  },
                  {
                    "options": [
                      "An evening with some shape"
                    ],
                    "body": "A shaped evening never puts the question to a vote at all, and a day defends itself best when the empty hour never opens."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "stake",
                "headline": "What is on the scales tonight?",
                "helper": "Name the thing you’d rather not dent.",
                "options": [
                  "The training",
                  "The project",
                  "The relationship",
                  "The good mornings"
                ],
                "result": "Tonight: {pick}"
              },
              {
                "kind": "collect",
                "title": "What you’re protecting",
                "template": "\"Good days defend themselves. I have got {pick} growing, a slip couldn’t unbank any of it, and tonight still counts towards it.\"",
                "fallback": "\"I’ll name one thing worth not ruining tonight, and put one win on tomorrow's scales before midday.\"",
                "source": "checks",
                "label": "What is growing:",
                "cta": "Save this"
              }
            ],
            "sources": "Formalises the good-day observation from the v2 framework notes. Guardrails are load-bearing: no streak, no zero-reset, earned rewards never clawed back, per the evidence base's anti-shame findings (Part B3) and the contingency-management design rules (Prendergast et al., 2006, STUDY_BANK.md). The mechanism (a fuller day raising the opportunity cost) is the replacement logic of Lessons 79 and 80 stated at day-scale; plausible, no new trial claimed.",
            "action": "Name one thing you're building that a slip can't unbank, and put one small win on tomorrow's scales before noon. Track the evenings that follow win-days versus grey days.",
            "reflection": "Write your stake in one line: \"I've got ______ growing, and tonight counts toward it.\" Then notice, without a counter anywhere in sight, how differently a pitch lands on a day with a win in it."
          }
        ]
      },
      {
        "code": "V.D",
        "title": "Rewards that can compete",
        "description": "Every stop paired with a start that pays you something.",
        "lessons": [
          {
            "number": 79,
            "heading": "Replace, don't just remove",
            "title": "Replacing rather than removing",
            "tag": "evidence — habit science",
            "tagColor": "#375623",
            "sub": "V.D",
            "week": 6,
            "day": 14,
            "order": 78,
            "slug": "replacing-rather-than-removing-79",
            "pages": [
              {
                "kind": "teach",
                "headline": "Just stopping leaves you with a cue that still fires and a slot with nothing in it.",
                "body": "And the brain fills that slot with the routine it knows best, which happens to be the one you have just removed. Nothing about the cue has changed. It’s still eleven at night, you’re still on your own, and the feeling still arrives on schedule.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "A dammed stream pools up and eventually breaks through, whereas a redirected one flows.",
                "body": "So every stop needs a start paired with it. When the cue fires, a routine you chose in advance runs instead. And it has to have a real reward in it, because otherwise the brain has no reason to keep choosing it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happened last time you just stopped?",
                "checks": [
                  {
                    "key": "cuefired",
                    "label": "The cue kept firing",
                    "asIn": "Eleven o'clock arrived every night, on schedule, asking",
                    "short": "the cue kept firing"
                  },
                  {
                    "key": "ache",
                    "label": "The empty slot ached",
                    "asIn": "There was a gap where the routine used to sit",
                    "short": "the empty slot ached"
                  },
                  {
                    "key": "clock",
                    "label": "Willpower ran out",
                    "asIn": "I held out for days and then it gave way",
                    "short": "willpower ran out"
                  },
                  {
                    "key": "backin",
                    "label": "The old routine came back",
                    "asIn": "It was the only thing that ever fitted the gap",
                    "short": "the old routine came back"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "channels",
                "headline": "What could the cue point at instead?",
                "helper": "It has to have a real reward in it of its own.",
                "options": [
                  "Tea and a book in another room",
                  "Straight out for a walk",
                  "A call to somebody",
                  "Training",
                  "A shower and an early night"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "cuefired",
                    "headline": "The cue was never going to stop firing, because it’s wired in and wiring doesn’t expire.",
                    "body": "The work is giving it somewhere new to point, and after enough repetitions it points there by default."
                  },
                  {
                    "key": "ache",
                    "headline": "The ache was the empty slot doing exactly what slots do, which is demanding to be filled.",
                    "body": "Choose what fills it in advance, or the old groove will make the choice on your behalf while you’re not paying attention."
                  },
                  {
                    "key": "clock",
                    "headline": "The clock ran out because you were holding a dam shut with your hands.",
                    "body": "Redirection needs no holding, since water takes the easier channel on its own and doesn’t have to be persuaded."
                  },
                  {
                    "key": "backin",
                    "headline": "It came back because it was the only shape that fitted the gap.",
                    "body": "So carve a second shape, and let repetition turn the new channel into the one that gets taken automatically."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Tea and a book in another room",
                      "A shower and an early night"
                    ],
                    "body": "The quiet channels suit a late cue, because they’re warm and slow and pointed away from every screen in the house."
                  },
                  {
                    "options": [
                      "Straight out for a walk",
                      "Training"
                    ],
                    "body": "The physical channels pay twice, since the slot gets filled and the restlessness gets spent in the same move."
                  },
                  {
                    "options": [
                      "A call to somebody"
                    ],
                    "body": "The contact channel answers the cue that was loneliness all along, and the reward it gives you is the real version of what the old routine was imitating."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "pair",
                "headline": "What runs when the cue fires?",
                "helper": "Pair it with your strongest cue.",
                "options": [
                  "Tea and a book somewhere else",
                  "Straight out for a walk",
                  "A phone call",
                  "Training",
                  "A shower and an early night"
                ],
                "result": "Instead: {pick}"
              },
              {
                "kind": "collect",
                "title": "The new channel",
                "template": "\"When my cue fires, I {pick} instead. The stream gets a channel and the cue slowly learns to point at it.\"",
                "fallback": "\"I’ll pair my strongest cue with a replacement this week, chosen in advance, not in the moment.\"",
                "source": "checks",
                "label": "What just stopping did:",
                "cta": "Save this"
              }
            ],
            "sources": "The cue-routine-reward habit loop, and the principle that removing a routine without replacing it leaves a live cue that re-triggers the old behaviour, is general habit science. It directly matches the evidence base's coping-function finding: removing porn without replacing the coping function tends to fail (Part B1(b)).",
            "action": "Assign one specific replacement behaviour to your strongest cue, and track using it.",
            "reflection": "Take your single strongest cue and write its paired replacement: \"When ______ happens, instead of porn I will ______.\" Make the replacement something with a real reward of its own."
          },
          {
            "number": 80,
            "heading": "Replacement, not vacuum",
            "title": "Filling the space it leaves",
            "tag": "evidence — habit science",
            "tagColor": "#375623",
            "sub": "V.D",
            "week": 6,
            "day": 15,
            "order": 79,
            "slug": "filling-the-space-it-leaves-80",
            "pages": [
              {
                "kind": "teach",
                "headline": "Take the behaviour away and you’re left with three gaps, not one.",
                "body": "Three things go missing at once.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "The freed-up time",
                    "The coping that is no longer being done",
                    "The missing stimulation"
                  ],
                  "note": "Your nervous system won’t sit with all three for long, and the fastest thing available has the deepest groove."
                }
              },
              {
                "kind": "teach",
                "headline": "So the rule from the last lesson becomes a general principle: pair every stop with a start.",
                "body": "The evenings need somewhere to go, the coping needs a substitute, and the cue needs a new routine. The fuller the replacement life is, the less room the old behaviour has to grow back into.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does quitting mostly leave you with?",
                "checks": [
                  {
                    "key": "timegap",
                    "label": "Empty time",
                    "asIn": "Whole evenings, suddenly unallocated",
                    "short": "empty time"
                  },
                  {
                    "key": "copinggap",
                    "label": "Nothing to cope with",
                    "asIn": "The stress and the loneliness with their tool taken away",
                    "short": "nothing to cope with"
                  },
                  {
                    "key": "stimgap",
                    "label": "Everything gone flat",
                    "asIn": "Ordinary life dulled for a while",
                    "short": "everything gone flat"
                  },
                  {
                    "key": "allthree",
                    "label": "All three at once",
                    "asIn": "The full set",
                    "short": "all three at once"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "starts",
                "headline": "What could fill the space?",
                "helper": "Real things, with something in them for you.",
                "options": [
                  "An evening activity with a name",
                  "A person I see regularly",
                  "A project halfway through",
                  "Ways of settling myself that work",
                  "A run of training"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "timegap",
                    "headline": "Unallocated evenings allocate themselves, and they don’t consult you about it.",
                    "body": "Give the freed-up hours a named destination before the old groove volunteers one, because it will volunteer within about a week."
                  },
                  {
                    "key": "copinggap",
                    "headline": "The coping gap is the dangerous one of the three, and it’s the one people forget.",
                    "body": "The stress and the loneliness still arrive every night, and they will take the old tool over no tool at all, so build the substitute first rather than last."
                  },
                  {
                    "key": "stimgap",
                    "headline": "The flatness passes faster once the quieter pleasures get some practice.",
                    "body": "They have stopped having to compete with something enormous, and they get their colour back with use, not with time alone."
                  },
                  {
                    "key": "allthree",
                    "headline": "If it’s all three then the replacement is your whole strategy, not just one part of it.",
                    "body": "That means not one start but a small set of them: an activity, a person and a tool, which between them cover the three gaps."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "An evening activity with a name",
                      "A project halfway through"
                    ],
                    "body": "Gaps shaped like time need fillers shaped like time, and the activity and the project give the hours somewhere to land."
                  },
                  {
                    "options": [
                      "A person I see regularly",
                      "Ways of settling myself that work"
                    ],
                    "body": "Gaps shaped like coping need fillers shaped like coping. That means a person for the loneliness and a tool for the restlessness."
                  },
                  {
                    "options": [
                      "A run of training"
                    ],
                    "body": "Training fills all three gaps at once. That’s why it keeps earning its place in almost everybody's stack."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "start",
                "headline": "What is the start that goes with your main stop?",
                "helper": "Name it instead of leaving it general.",
                "options": [
                  "The evening activity",
                  "The regular person",
                  "The project",
                  "The training"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The pairing",
                "template": "\"Every stop gets paired with a start, and mine is {pick}, aimed at {checks}. The building is what makes the quitting stick.\"",
                "fallback": "\"I’ll name and schedule the start that goes with my main stop this week.\"",
                "source": "checks",
                "label": "What quitting leaves:",
                "cta": "Save this"
              }
            ],
            "sources": "The cue-routine-reward habit loop and the instability of removal-without-replacement are general habit science, matching the evidence base's coping-function finding: removing porn without replacing the coping function tends to fail (Part B1(b)). Restated as a core principle (see also Day 52).",
            "action": "For your main \"stop,\" define the specific \"start\" that fills the space it leaves.",
            "reflection": "Name the biggest vacuum quitting leaves for you (time, coping, or stimulation) and the specific \"start\" you'll build to fill it. The fuller the replacement, the weaker the pull."
          },
          {
            "number": 81,
            "heading": "The patch logic: substitutes as a bridge, not a cure",
            "title": "Stepping down rather than stopping dead",
            "tag": "contested — harm reduction (smoking evidence; none direct for porn)",
            "tagColor": "#7F6000",
            "sub": "V.D",
            "week": 6,
            "day": 16,
            "order": 80,
            "slug": "stepping-down-rather-than-stopping-dead-81",
            "pages": [
              {
                "kind": "teach",
                "headline": "Medicine gave heavy smokers a smaller step to take, which was to keep the nicotine and drop the smoke.",
                "body": "Across 133 trials involving tens of thousands of people, replacement raised quit rates by roughly half compared with willpower alone (Hartmann-Boyce et al., 2018). That’s modest and reliable, and it’s not a cure.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The version for porn borrows the logic and only the logic, so be clear about what is being claimed.",
                "body": "For a severe pattern you step down for a while, perhaps to written material or imagination instead of video, in order to unplug the escalation while the deeper work gets going. Nobody has run this trial. The numbers above are smoking numbers.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How severe is your pattern, honestly?",
                "checks": [
                  {
                    "key": "allday",
                    "label": "All day, and getting worse",
                    "asIn": "The version where stopping dead keeps failing",
                    "short": "all day and getting worse"
                  },
                  {
                    "key": "badstretch",
                    "label": "Severe in bad stretches",
                    "asIn": "The intensity arrives in weather systems",
                    "short": "severe in bad stretches"
                  },
                  {
                    "key": "moderate",
                    "label": "Difficult but manageable",
                    "asIn": "Hard, but without the cliff",
                    "short": "difficult but manageable"
                  },
                  {
                    "key": "mild",
                    "label": "mild",
                    "asIn": "Going straight to stopping would be cleaner for me",
                    "short": "fairly mild"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "weaknesses",
                "headline": "The four weaknesses to keep watching",
                "helper": "This is why it stays temporary rather than becoming the plan.",
                "options": [
                  "The wiring stays warm",
                  "The job underneath is untouched",
                  "Milder rarely stays milder",
                  "A bridge you live on becomes a cage"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "allday",
                    "headline": "For the version where stopping dead keeps failing, a bridge can be the difference between an impossible leap and a possible step.",
                    "body": "Build it as temporary by design, with a date for review written down at the start, and point it at the deeper work, not at comfort."
                  },
                  {
                    "key": "badstretch",
                    "headline": "If it arrives in weather systems then you may only need the bridge during the storms.",
                    "body": "Which makes the review date matter twice as much, so that the exception for storms doesn’t become the climate."
                  },
                  {
                    "key": "moderate",
                    "headline": "Patterns in the middle usually do better skipping the bridge altogether.",
                    "body": "The costs of stepping down arrive either way, and you can probably start without its help, which saves you the trouble of dismantling it later."
                  },
                  {
                    "key": "mild",
                    "headline": "For a mild pattern this is almost certainly unnecessary.",
                    "body": "Going straight to stopping is cleaner, and a bridge would mostly just move the habit somewhere quieter where you’d notice it less."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The wiring stays warm",
                      "The job underneath is untouched"
                    ],
                    "body": "The first two are why a bridge buys time instead of change, because arousal still soothes, just more quietly, and the deeper work is still the work."
                  },
                  {
                    "options": [
                      "Milder rarely stays milder",
                      "A bridge you live on becomes a cage"
                    ],
                    "body": "The last two are why the review date matters most, since the pull back towards the original is strong and comfort is what cages are made of."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "bridge",
                "headline": "Bridge, or no bridge?",
                "helper": "Decide it on severity, not on preference.",
                "options": [
                  "A step-down with a review date",
                  "No bridge, straight to the work",
                  "Undecided, review in a fortnight"
                ],
                "result": "Decided: {pick}"
              },
              {
                "kind": "collect",
                "title": "The bridge",
                "template": "\"A bridge, not a destination. That means {pick}. Whatever quiet it buys is only worth what the deeper work does with it.\"",
                "fallback": "\"I’ll judge the severity this week and answer the bridge question with a date attached to it.\"",
                "source": "checks",
                "label": "My severity:",
                "cta": "Save this"
              }
            ],
            "sources": "Nicotine replacement raises quit rates by about 50-60% versus willpower alone (relative risk ~1.55; Hartmann-Boyce et al., 2018, Cochrane review, 133 trials, ~64,640 participants), used honestly as a smoking-cessation parallel, not porn evidence. There is no controlled evidence for pornography substitution; the application here is an analogy only. Porn-side caveats (persistent cue-reactivity but no demonstrated permanent structural damage; the chaser effect; mixed evidence on escalation/novelty) draw on the evidence base, Parts A3 and B1(c).",
            "action": "If your use is severe, choose one specific step-down to use as a temporary bridge (for example, cut the most extreme or novel content first), and set a review date to check whether it's genuinely helping or just relocating the habit.",
            "reflection": "Answer honestly: would a step-down bridge help you start, or would it just keep the loop alive in a quieter form? Write which, and if you use one, the date you'll reassess it."
          },
          {
            "number": 82,
            "heading": "Reward the progress (contingency management)",
            "title": "Paying yourself for the wins",
            "tag": "evidence — contingency management",
            "tagColor": "#375623",
            "sub": "V.D",
            "week": 6,
            "day": 17,
            "order": 81,
            "slug": "paying-yourself-for-the-wins-82",
            "pages": [
              {
                "kind": "teach",
                "headline": "Look at the arrangement you currently have with yourself, which is pain for failure and silence for success.",
                "body": "The research says that is the wrong way round. Behaviour grows wherever it gets rewarded, and the old habit paid you reliably, several times a week, right on time.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Rewarding progress you can verify is one of the strongest behavioural tools on record.",
                "body": "In substance treatment the average effect was around 0.42 and higher for some drugs (Prendergast et al., 2006). One caveat travels with it, which is that the effect fades once the rewards stop, so treat it as a booster, not as the engine.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does your current arrangement look like?",
                "checks": [
                  {
                    "key": "punish",
                    "label": "Punishment for slips",
                    "asIn": "Shame is the only currency in circulation",
                    "short": "punishment for slips"
                  },
                  {
                    "key": "silence",
                    "label": "Silence for the wins",
                    "asIn": "A clean week goes by unmarked",
                    "short": "silence for the wins"
                  },
                  {
                    "key": "both",
                    "label": "Both at once",
                    "asIn": "Charged for failure and never paid for progress",
                    "short": "both at once"
                  },
                  {
                    "key": "pays",
                    "label": "I already pay for progress",
                    "asIn": "There’s a reward system of some kind",
                    "short": "already paying for progress"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "goals",
                "headline": "What would you pay yourself for?",
                "helper": "Things you control, instead of things that depend on luck.",
                "options": [
                  "A week of hitting my bedtime",
                  "Five urges ridden out and written down",
                  "Finishing the two-week audit",
                  "Reviewing a month's trend",
                  "Three real contacts made"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "punish",
                    "headline": "An arrangement made of punishment manufactures the exact misery the behaviour feeds on.",
                    "body": "Retire the stick and hire the carrot, because the machinery works either way and at the moment it’s pointed at you."
                  },
                  {
                    "key": "silence",
                    "headline": "Wins that go unpaid tend to stop happening, which isn’t a character flaw but an incentive problem.",
                    "body": "Mark them and they multiply, because incentives do what incentives have always done."
                  },
                  {
                    "key": "both",
                    "headline": "That’s backwards twice over, and it’s cheap to fix.",
                    "body": "Two milestones and two real rewards, chosen tonight. The machinery already works. It only needs pointing the right way."
                  },
                  {
                    "key": "pays",
                    "headline": "Check that the two design rules still hold in your version.",
                    "body": "Reward progress and process rather than a fragile streak, and never claw back anything already earned, because clawing back is how a reward system turns into a punishment system."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A week of hitting my bedtime",
                      "Five urges ridden out and written down"
                    ],
                    "body": "Goals about process are the honest ones, because they’re fully within your control and every one you get paid for builds the next."
                  },
                  {
                    "options": [
                      "Finishing the two-week audit",
                      "Reviewing a month's trend"
                    ],
                    "body": "The dull instruments deserve rewards as well, since they’re the ones that steer everything else and they’re the easiest to skip."
                  },
                  {
                    "options": [
                      "Three real contacts made"
                    ],
                    "body": "Paying yourself for connection stacks two lessons into one reward, so the incentive and the antidote arrive at the same time."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "reward",
                "headline": "What is the reward?",
                "helper": "Something you’d want, decided in advance.",
                "options": [
                  "A proper meal out",
                  "Some new kit, or the book",
                  "A day out somewhere",
                  "Something of my own, written down"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The new arrangement",
                "template": "\"The arrangement flips, so {grid} earns {pick}. What is earned stays earned, and slips never get invoiced.\"",
                "fallback": "\"I’ll write down two milestones and their rewards this week, and close the all-punishment arrangement.\"",
                "source": "checks",
                "label": "The old arrangement:",
                "cta": "Save this"
              }
            ],
            "sources": "Contingency management is among the best-supported behavioural treatments for substance use: meta-analysis mean effect d ≈ 0.42, higher for cocaine/opioids (d ≈ 0.65), with effects that tend to decay after rewards stop (Prendergast et al., 2006, Addiction, meta-analysis of 47 comparisons). No porn-specific CM trial exists; the application is by analogy, and the non-shaming design (reward progress, never punish slips) aligns with the evidence base's anti-shame finding (Part B3).",
            "action": "Pick two or three concrete milestones or process goals, and a real, pre-decided reward for each. Reward progress; never claw a reward back for a slip.",
            "reflection": "Name one reward that would genuinely motivate you, and the specific process goal (something you control) you'll tie it to this week."
          }
        ]
      }
    ]
  },
  {
    "n": 7,
    "title": "Part VI · Connection",
    "ground": "Ground VII · The Watchfire",
    "description": "This part supplies the real version of the thing the substitute imitates. That means why it matters more than anything else here, how it gets built out in the world, and the telling of the truth that breaks the secrecy open.",
    "subs": [
      {
        "code": "VI.A",
        "title": "Why connection matters",
        "description": "The substitute, the real thing, and eighty-five years of evidence.",
        "lessons": [
          {
            "number": 83,
            "heading": "Loneliness triggers; connection heals",
            "title": "Alone is the setting",
            "tag": "evidence / observational",
            "tagColor": "#375623",
            "sub": "VI.A",
            "week": 7,
            "day": 1,
            "order": 82,
            "slug": "alone-is-the-setting-83",
            "pages": [
              {
                "kind": "teach",
                "headline": "Look back at your slips and the same setting keeps turning up, which is that you were on your own.",
                "body": "Not by yourself, but cut off, with no real contact all day. Put the emptiness and the privacy and the low mood together and a quiet evening becomes something close to a recipe.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "And here is the unpleasant part of it. Porn is an imitation of connection.",
                "body": "A few minutes of something that resembles closeness, which leaves you lonelier than you were, because an imitation doesn’t feed the hunger. It only reminds you that it’s there. The whole loop runs in the gap where real contact should have been.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is the usual setting for your slips?",
                "checks": [
                  {
                    "key": "alone",
                    "label": "On my own, properly",
                    "asIn": "Cut off, not just by myself",
                    "short": "being on my own"
                  },
                  {
                    "key": "nocontact",
                    "label": "No real contact that day",
                    "asIn": "Hours without anybody, and then the urge",
                    "short": "having no contact that day"
                  },
                  {
                    "key": "away",
                    "label": "When the house is empty",
                    "asIn": "The empty flat is the starting bell",
                    "short": "when the house is empty"
                  },
                  {
                    "key": "around",
                    "label": "around people",
                    "asIn": "Being isolated isn’t really my pattern",
                    "short": "being around people"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "storm",
                "headline": "Which ingredients does yours use?",
                "helper": "Name the recipe.",
                "options": [
                  "The empty feeling, flat and aimless",
                  "The privacy, with the door shut",
                  "The low mood that loneliness produces",
                  "All three together"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "alone",
                    "headline": "Your version needs the disconnection in order to form at all, which makes the cure embarrassingly direct.",
                    "body": "Real contact, booked into the exact evenings where the storm usually gathers, and booked in advance instead of hoped for."
                  },
                  {
                    "key": "nocontact",
                    "headline": "A day with no contact in it primes the evening before the evening arrives.",
                    "body": "That means the fix starts before dark. One real conversation during the day changes what ten o'clock at night is made of."
                  },
                  {
                    "key": "away",
                    "headline": "The empty house is a window you already know about, so book it like the risk it is.",
                    "body": "Put the call or the visit or the plan into that slot instead of leaving it to chance, since chance hasn’t been reliable so far."
                  },
                  {
                    "key": "around",
                    "headline": "If being isolated plays a small part for you, then build the connection anyway.",
                    "body": "For most people it’s most of the point of stopping, quite apart from anything it does for prevention."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The empty feeling, flat and aimless",
                      "The low mood that loneliness produces"
                    ],
                    "body": "Contact answers both of those at once, because an hour properly spent with somebody fills the flat evening and lifts its floor at the same time."
                  },
                  {
                    "options": [
                      "The privacy, with the door shut"
                    ],
                    "body": "Privacy is the one ingredient that contact removes by definition, since being sealed in and being with somebody can’t both be true at once."
                  },
                  {
                    "options": [
                      "All three together"
                    ],
                    "body": "All three means the full counter-move, which is real contact placed in the risky window before the storm has had a chance to gather."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "contact",
                "headline": "What are you booking?",
                "helper": "Deliberate beats hoping something turns up.",
                "options": [
                  "A phone call, booked",
                  "An evening with a friend",
                  "Dinner with family",
                  "Training with somebody"
                ],
                "result": "Booking: {pick}"
              },
              {
                "kind": "collect",
                "title": "The counter-move",
                "template": "\"The storm needs all its ingredients and contact removes two of them. This week that means {pick}, placed in the risky window.\"",
                "fallback": "\"I’ll book two real contacts this week, aimed at the exact windows the storm uses.\"",
                "source": "checks",
                "label": "My usual setting:",
                "cta": "Save this"
              }
            ],
            "sources": "Loneliness and isolation as a leading internal trigger, and porn as a counterfeit of connection that deepens isolation, are from the evidence base, Part B1(b), and the forum dataset (loneliness cluster). The vacuum plus privacy plus low mood synthesis draws on Weeks 3 and 5.",
            "action": "Schedule two real social contacts this week, ideally in your risky windows. Track them.",
            "reflection": "Name two real people you could put into this week's risky windows, and when. Connection deliberately scheduled beats connection left to chance."
          },
          {
            "number": 84,
            "heading": "The Harvard 85-year finding",
            "title": "What eighty-five years found",
            "tag": "evidence — Harvard Study of Adult Development",
            "tagColor": "#375623",
            "sub": "VI.A",
            "week": 7,
            "day": 2,
            "order": 83,
            "slug": "what-eighty-five-years-found-84",
            "pages": [
              {
                "kind": "teach",
                "headline": "The Harvard Study of Adult Development has followed 724 men since 1938, and its main finding surprised the researchers running it.",
                "body": "The strongest predictor of long-term health and happiness turned out to be the quality of a man's close relationships, ahead of money, fame and career. How satisfied people were with their relationships at fifty predicted their health at eighty.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The wider evidence says the same thing on a much larger scale.",
                "body": "Across 148 studies covering 308,849 people, stronger relationships went with about a fifty per cent higher chance of survival over the periods studied, which puts it in the same class as giving up smoking (Holt-Lunstad et al., 2010). And warm connection is exactly what porn imitates and isolation starves.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What have you been treating as the main thing?",
                "checks": [
                  {
                    "key": "money",
                    "label": "Money and getting ahead",
                    "asIn": "The default scoreboard, inherited without checking it",
                    "short": "money and getting ahead"
                  },
                  {
                    "key": "career",
                    "label": "Career and achievement",
                    "asIn": "The ladder treated as the point of the exercise",
                    "short": "career and achievement"
                  },
                  {
                    "key": "sortfirst",
                    "label": "Sorting myself out first",
                    "asIn": "Closeness postponed until I feel I deserve it",
                    "short": "sorting myself out first"
                  },
                  {
                    "key": "already",
                    "label": "Relationships, already",
                    "asIn": "The finding confirms what I thought",
                    "short": "relationships already"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "people",
                "headline": "Who are your key people?",
                "helper": "Where the investment is going to go.",
                "options": [
                  "A partner",
                  "An old friend",
                  "A parent",
                  "A brother or sister",
                  "A friend who has gone quiet"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "money",
                    "headline": "The men in the study made the same bet and the data disagreed with them firmly.",
                    "body": "What the flourishing tracked was warmth, not income, so move a little of the effort across and see what happens."
                  },
                  {
                    "key": "career",
                    "headline": "Achievement kept nobody healthy at eighty, which isn’t an argument against ambition.",
                    "body": "The ladder is fine and it’s a different variable. One evening a week moved across pays better than one more hour on the ladder."
                  },
                  {
                    "key": "sortfirst",
                    "headline": "Sorting yourself out first postpones the very thing that does the sorting.",
                    "body": "Connection is one of the engines of recovery rather than a reward for having completed it, so it starts well before you feel ready."
                  },
                  {
                    "key": "already",
                    "headline": "Treat the finding as a permission slip, not as news.",
                    "body": "The time you give your people is the real work, whatever the list of other things says about its own urgency."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A partner",
                      "A parent"
                    ],
                    "body": "The closest ties reward maintenance most and forgive drift least, so an hour of proper attention this week is the investment."
                  },
                  {
                    "options": [
                      "An old friend",
                      "A friend who has gone quiet"
                    ],
                    "body": "The ones who have drifted cost one message to restart and the restart is nearly always welcome, since the thinning was never a falling out."
                  },
                  {
                    "options": [
                      "A brother or sister"
                    ],
                    "body": "Family lines can stay technically open and unused for years. A real call, not a thumbs-up in a group chat, is what redraws them."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "invest",
                "headline": "Who gets your time this week?",
                "helper": "Real time, not a message.",
                "options": [
                  "My partner",
                  "The old friend",
                  "A parent",
                  "My brother or sister",
                  "The friend who has gone quiet"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The investment",
                "template": "\"Across whole lives, the quality of close connection matters most, and this week I’m putting real time into {pick}.\"",
                "fallback": "\"I’ll rate my closeness to three people this week and give one relationship some real time.\"",
                "source": "checks",
                "label": "My old bet:",
                "cta": "Save this"
              }
            ],
            "sources": "The Harvard Study of Adult Development's headline finding (relationship quality as the strongest predictor of long-term health and happiness) is now stated with verified specifics: 724 men followed since 1938 across the Grant and Glueck cohorts; relationship satisfaction at 50 predicted health at 80 (study's public materials, verified; STUDY_BANK.md). The survival meta-analysis adds scale: 148 studies, 308,849 people, 50% higher survival odds with stronger relationships (Holt-Lunstad et al., 2010). Both close the flag in REWRITE_LOG.md. Connection as an antidote to the counterfeit ties to the evidence base, Part B.",
            "action": "Rate your closeness to three key people. Pick one to invest in this week.",
            "reflection": "Rate your closeness (1–5) to your three most important people. Pick the one relationship you'll put real time into this week. You're investing in the variable that most shapes a life."
          },
          {
            "number": 85,
            "heading": "Replace the parasocial with the real",
            "title": "The real version of it",
            "tag": "reframe + plausible",
            "tagColor": "#4B3F72",
            "sub": "VI.A",
            "week": 7,
            "day": 3,
            "order": 84,
            "slug": "the-real-version-of-it-85",
            "pages": [
              {
                "kind": "teach",
                "headline": "Strip porn down to what it is and what remains is a relationship that only runs in one direction.",
                "body": "You get the feeling of being wanted with nothing at all coming back the other way. It’s intimacy with the intimacy taken out of it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "So the goal changes from less porn to more real closeness, and the two are connected.",
                "body": "The substitute keeps its grip because it’s filling a gap, and as the real thing grows the substitute loses its value on its own. No fight is required, which is the useful part.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is the pull, for you?",
                "checks": [
                  {
                    "key": "wanted",
                    "label": "The feeling of being wanted",
                    "asIn": "Available on demand, with no risk and nothing owed",
                    "short": "the feeling of being wanted"
                  },
                  {
                    "key": "oneway",
                    "label": "Closeness with no exposure",
                    "asIn": "The warmth of it without ever being seen",
                    "short": "closeness with no exposure"
                  },
                  {
                    "key": "removed",
                    "label": "The shape without the substance",
                    "asIn": "It has the outline of connection and nothing inside",
                    "short": "the shape without the substance"
                  },
                  {
                    "key": "habit",
                    "label": "Mostly just habit",
                    "asIn": "For me it’s mostly habit instead of any of that",
                    "short": "mostly just habit"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "grow",
                "headline": "Where could the real version grow?",
                "helper": "Closeness is broader than romance.",
                "options": [
                  "A friend I could stop performing with",
                  "A proper phone call rather than a text thread",
                  "An hour fully present, with no phone",
                  "Letting somebody see the unedited version of me"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "wanted",
                    "headline": "The feeling of being wanted points at a real hunger, and the substitute can only ever remind you of it.",
                    "body": "The real version carries risk, and that risk is why it feeds you when the safe version doesn’t."
                  },
                  {
                    "key": "oneway",
                    "headline": "Closeness without exposure is really spectating rather than participating.",
                    "body": "The real thing costs you being seen and it pays you in being known, which is a trade most people find worth making once they have made it."
                  },
                  {
                    "key": "removed",
                    "headline": "You have already tasted how hollow the shape is, so that lesson is pre-learned.",
                    "body": "Every hour put into real connection does two jobs, since it’s a good thing in itself and it drains the substitute at the same time."
                  },
                  {
                    "key": "habit",
                    "headline": "If it’s mostly habit for you, then the intimacy reframe is a footnote, not the main point.",
                    "body": "The connection work still pays, for the reasons Lesson 84 laid out, and those reasons have nothing to do with porn at all."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A friend I could stop performing with",
                      "Letting somebody see the unedited version of me"
                    ],
                    "body": "Dropping the performance is the whole move, because being known unedited and accepted anyway is exactly the thing the substitute can only mime."
                  },
                  {
                    "options": [
                      "A proper phone call rather than a text thread",
                      "An hour fully present, with no phone"
                    ],
                    "body": "Presence is the unit that real connection is measured in, and one undivided hour outweighs a week of fragments."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "build",
                "headline": "What are you building this week?",
                "helper": "One thing, done properly.",
                "options": [
                  "A proper conversation",
                  "A real phone call",
                  "An hour fully present, with no phone"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The real version",
                "template": "\"More real closeness, starting with {pick}. The substitute fades as the real thing grows, without my having to fight it.\"",
                "fallback": "\"I’ll do one thing that builds real closeness this week, and treat it as building, not as avoiding.\"",
                "source": "checks",
                "label": "What the substitute sells me:",
                "cta": "Save this"
              }
            ],
            "sources": "Porn as a parasocial counterfeit of intimacy is a reframe. The connection-grows-as-counterfeit-fades logic ties to the loneliness and coping findings in the evidence base (Part B1(b)). Kept at reframe plus plausible; no statistic claimed.",
            "action": "Do one thing this week that builds real intimacy, a deep conversation, a real call, time fully present with someone.",
            "reflection": "Name one relationship where you could let yourself be more known this week. Real closeness (romantic or not) is what outcompetes the counterfeit."
          }
        ]
      },
      {
        "code": "VI.B",
        "title": "Out in the world",
        "description": "Ordinary contact, kept warm, and in person.",
        "lessons": [
          {
            "number": 86,
            "heading": "The opposite sex as people, not threats",
            "title": "Seeing people as people",
            "tag": "plausible — exposure / social",
            "tagColor": "#0B3C49",
            "sub": "VI.B",
            "week": 7,
            "day": 4,
            "order": 85,
            "slug": "seeing-people-as-people-86",
            "pages": [
              {
                "kind": "teach",
                "headline": "For some men, heavy use bends the picture they have of other people.",
                "body": "The people you’re attracted to stop being people and become either threats to be nervous around or objects, or an uneasy mixture of both. The science on why this happens is mixed, so hold the explanation loosely, but the avoidance that follows is real enough to name.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Avoidance is the thing that keeps the bend in place.",
                "body": "The nervous predictions never get tested against reality, and the only contact left is the substitute, which feeds the distortion further. Ordinary conversation with no agenda attached is exactly the evidence that is missing.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happens around people you’re attracted to?",
                "checks": [
                  {
                    "key": "anxious",
                    "label": "Anxiety runs the meeting",
                    "asIn": "Threat detection, where a person is standing",
                    "short": "anxiety running it"
                  },
                  {
                    "key": "blend",
                    "label": "An uneasy mixture",
                    "asIn": "Part intimidation and part consumption, with no ease in it",
                    "short": "an uneasy mixture"
                  },
                  {
                    "key": "avoid",
                    "label": "I mostly avoid it",
                    "asIn": "I keep the predictions untested by staying away",
                    "short": "mostly avoiding it"
                  },
                  {
                    "key": "fine",
                    "label": "It’s fine",
                    "asIn": "This doesn’t really apply to me",
                    "short": "it being fine"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "contact",
                "headline": "Where could you have ordinary contact?",
                "helper": "People to treat as people.",
                "options": [
                  "The person in the coffee shop",
                  "A colleague",
                  "Somebody at a class",
                  "A neighbour",
                  "A friend of a friend"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "anxious",
                    "headline": "Anxiety survives on never being tested. That’s why it stays exactly the same size for years.",
                    "body": "One ordinary conversation in which none of the dreaded things happen is worth a month of thinking about it, because it’s evidence, not argument."
                  },
                  {
                    "key": "blend",
                    "headline": "The mixture eases as the ordinary personhood accumulates.",
                    "body": "Small talk about nothing in particular, with no agenda attached, is the data the bent picture is missing."
                  },
                  {
                    "key": "avoid",
                    "headline": "Avoidance felt like safety and worked like a preservative, which is the unkind trick in it.",
                    "body": "The bend stays fresh inside it, and the way out is small and ordinary instead of brave."
                  },
                  {
                    "key": "fine",
                    "headline": "Leave this one on the shelf, and note that finding that out took two minutes.",
                    "body": "Knowing which lessons aren’t yours is worth something on its own."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The person in the coffee shop",
                      "A neighbour"
                    ],
                    "body": "Start where the stakes round down to nothing. One sentence past the transaction, and the catastrophe fails to happen on schedule."
                  },
                  {
                    "options": [
                      "A colleague",
                      "Somebody at a class"
                    ],
                    "body": "Shared context does half the work for you, because the conversation already has a subject and the person becomes a person somewhere in the middle of it."
                  },
                  {
                    "options": [
                      "A friend of a friend"
                    ],
                    "body": "A warm introduction is the gentlest version available, since you arrive half vouched for before anybody has said anything."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "convo",
                "headline": "Who will you have one conversation with?",
                "helper": "No agenda. Just an ordinary conversation.",
                "options": [
                  "The person in the coffee shop",
                  "A colleague",
                  "Somebody at the class",
                  "A neighbour"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The test",
                "template": "\"One ordinary conversation, with {pick}, and I write down how anxious I felt before and afterwards.\"",
                "fallback": "\"I’ll have one low-stakes conversation this week and write down the before and after.\"",
                "source": "checks",
                "label": "How it’s at the moment:",
                "cta": "Save this"
              }
            ],
            "sources": "Exposure reducing anticipatory anxiety is general psychological knowledge. The claim that use distorts real-world desire is kept deliberately tentative because the evidence base reports this area as mixed (Part A3/A4); framed as for some people, not asserted as settled fact. Kept at the plausible level.",
            "action": "Have one genuine in-person conversation this week. Note your anxiety before and after.",
            "reflection": "Is real-world contact with people you're attracted to something you avoid? If so, name one low-stakes, genuine conversation you could have this week, treating the person simply as a person."
          },
          {
            "number": 87,
            "heading": "Build social fitness like physical fitness",
            "title": "Keeping friendships in use",
            "tag": "evidence",
            "tagColor": "#375623",
            "sub": "VI.B",
            "week": 7,
            "day": 5,
            "order": 86,
            "slug": "keeping-friendships-in-use-87",
            "pages": [
              {
                "kind": "teach",
                "headline": "Harvard researchers use the term \"social fitness.\"",
                "body": "Friendships need regular contact. A friendship can weaken when messages, calls, and time together stop, even if nobody has done anything wrong.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The catch is that you need your people most on the hard nights.",
                "body": "And a connection can’t be built from scratch in exactly the state that leaves you least able to build one. So the practice is repetitions, not rescues, meaning small regular contact made before you need anything from anybody.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What state are your friendships in?",
                "checks": [
                  {
                    "key": "likes",
                    "label": "Thinned down to likes",
                    "asIn": "The friendship now lives in reactions",
                    "short": "thinned down to likes"
                  },
                  {
                    "key": "thinned",
                    "label": "Thinned with no falling out",
                    "asIn": "Just years of missed repetitions",
                    "short": "thinned with no falling out"
                  },
                  {
                    "key": "emergency",
                    "label": "Only in emergencies",
                    "asIn": "I get in touch when something is already wrong",
                    "short": "only in emergencies"
                  },
                  {
                    "key": "rotation",
                    "label": "In regular rotation",
                    "asIn": "The repetitions are already happening",
                    "short": "in regular rotation"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "drifted",
                "headline": "Who has drifted?",
                "helper": "Names instead of categories.",
                "options": [
                  "My oldest friend",
                  "The friends from university",
                  "A brother or sister",
                  "The friend who moved away",
                  "Somebody who would be glad to hear from me"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "likes",
                    "headline": "A like is a repetition that costs nothing and builds nothing. That’s why so many friendships die inside one.",
                    "body": "One actual message with a question in it restarts what the reactions were embalming."
                  },
                  {
                    "key": "thinned",
                    "headline": "Thinning has no villain in it, which is exactly why nobody notices it happening.",
                    "body": "The fix is equally undramatic, which is one message this week and then some kind of rhythm afterwards."
                  },
                  {
                    "key": "emergency",
                    "headline": "If you only get in touch in emergencies then the line is cold at the moment you need it warm.",
                    "body": "Check in when nothing is wrong, so that the hard-night call has somewhere to land."
                  },
                  {
                    "key": "rotation",
                    "headline": "Guard the rotation in the way you’d guard a gym habit.",
                    "body": "Drift starts in the week when the repetitions stop feeling necessary, which is usually a good week rather than a bad one."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "My oldest friend",
                      "The friend who moved away"
                    ],
                    "body": "Old close friends restart fastest, because the affection is intact under the dust and each of you assumed the other was busy."
                  },
                  {
                    "options": [
                      "The friends from university",
                      "Somebody who would be glad to hear from me"
                    ],
                    "body": "Friends from a particular era respond to specifics, so send one memory, one question and one suggestion. The group chat is where repetitions go to die."
                  },
                  {
                    "options": [
                      "A brother or sister"
                    ],
                    "body": "Family drift hides behind contact that is really obligation, so the birthday message doesn’t count as a repetition but a real call does."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "rep",
                "headline": "What is this week's repetition?",
                "helper": "Small, and with no agenda attached.",
                "options": [
                  "One message today",
                  "A standing weekly call",
                  "Coffee, booked in",
                  "A check-in with nothing behind it"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "Keeping the lines warm",
                "template": "\"Repetitions instead of rescues, so {pick}, starting with {grid}. Warm lines hold on hard nights and cold ones don’t.\"",
                "fallback": "\"I’ll send one maintenance message this week and sketch out a weekly rotation.\"",
                "source": "checks",
                "label": "The current state:",
                "cta": "Save this"
              }
            ],
            "sources": "Social fitness and relationships-need-maintenance come from the Harvard Study researchers; the study's specifics are now verified as per Day 65 (STUDY_BANK.md). The maintenance-as-reps analogy is general knowledge.",
            "action": "Send one \"maintenance\" message to a neglected friend this week. Make it a weekly habit.",
            "reflection": "Name one friend you've let drift. Write the maintenance message you'll send this week. Then decide who you'll keep \"in rotation\" as a weekly habit."
          },
          {
            "number": 88,
            "heading": "Find your people in person",
            "title": "Going somewhere regularly",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "VI.B",
            "week": 7,
            "day": 6,
            "order": 87,
            "slug": "going-somewhere-regularly-88",
            "pages": [
              {
                "kind": "teach",
                "headline": "One move takes out two of your most reliable triggers at once, which is joining something that meets in person.",
                "body": "While you’re there you’re occupied and you’re with people, and those are the two states that most often set a slip up. Neither of them can exist in that room while you’re in it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "It also works where \"go and make some friends\" fails, because connection is never the stated purpose.",
                "body": "You turn up for the climbing or the choir, and the people arrive sideways, through the shared doing. That’s how friendship has always formed, and trying to do it directly is what makes it awkward.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is missing from your week?",
                "checks": [
                  {
                    "key": "nostructure",
                    "label": "Structure",
                    "asIn": "There are shapeless stretches where the triggers grow",
                    "short": "structure"
                  },
                  {
                    "key": "nocontact2",
                    "label": "In-person contact",
                    "asIn": "Screens are carrying the whole social load",
                    "short": "in-person contact"
                  },
                  {
                    "key": "bothgaps",
                    "label": "Both of those",
                    "asIn": "One booking would cover both",
                    "short": "both of those"
                  },
                  {
                    "key": "onecovered",
                    "label": "One of them is covered",
                    "asIn": "Half of it is already sorted",
                    "short": "one of them being covered"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "groups",
                "headline": "What could you turn up to?",
                "helper": "The room matters more than the activity does.",
                "options": [
                  "A sport or a club",
                  "A class",
                  "A choir or a band",
                  "A board-game evening",
                  "A volunteering shift",
                  "A running club"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "nostructure",
                    "headline": "The recurring slot is half the point for you, quite apart from the people in it.",
                    "body": "A standing Tuesday gives the shapeless days something to organise themselves around, and it does that whether or not you enjoy the Tuesday."
                  },
                  {
                    "key": "nocontact2",
                    "headline": "The room does something the feed can’t, which is put you among actual humans.",
                    "body": "Shared air, no performance required, and turning up is the entire skill involved."
                  },
                  {
                    "key": "bothgaps",
                    "headline": "Both gaps, one booking, which makes this the cheapest thing in the whole programme.",
                    "body": "The same Tuesday fills the empty slot and the empty room simultaneously."
                  },
                  {
                    "key": "onecovered",
                    "headline": "Pick the group according to whichever gap is left.",
                    "body": "Structure wants something that recurs, and contact wants something shared, so choose on that basis, not on which sounds nicest."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A sport or a club",
                      "A running club"
                    ],
                    "body": "The sweaty versions pay three times over, since you get structure, people and the spent restlessness from Lesson 19 in a single booking."
                  },
                  {
                    "options": [
                      "A class",
                      "A choir or a band"
                    ],
                    "body": "Rooms where you’re learning have progress built into them, and progress pulls you back, so next week exists automatically."
                  },
                  {
                    "options": [
                      "A board-game evening",
                      "A volunteering shift"
                    ],
                    "body": "The low-key rooms suit anybody who is allergic to performing, because the table does the talking and the shift does the introducing."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "attend",
                "headline": "What are you going to once?",
                "helper": "Go once, and then decide.",
                "options": [
                  "The sport or club",
                  "The class",
                  "The choir",
                  "The games evening",
                  "The volunteering shift"
                ],
                "result": "Going: {pick}"
              },
              {
                "kind": "collect",
                "title": "The booking",
                "template": "\"Two triggers dealt with in one move, which is {pick}, attended once this week. The people arrive along with the doing.\"",
                "fallback": "\"I’ll go to one in-person group once this week and then decide about going back.\"",
                "source": "checks",
                "label": "What is missing:",
                "cta": "Save this"
              }
            ],
            "sources": "That an activity group simultaneously reduces boredom and isolation, two leading triggers from the evidence base, Part B1(b), and adds weekly structure (Week 2), is a synthesis of established points. Kept at the plausible level; no statistic claimed.",
            "action": "Attend one in-person group activity this week. Track whether you'd go back.",
            "reflection": "Name one real, recurring, in-person activity you'd show up for, not to \"make friends,\" just to do the thing. When's the next session?"
          }
        ]
      },
      {
        "code": "VI.C",
        "title": "Being known",
        "description": "Telling the truth once, and finding the people who hold it well.",
        "lessons": [
          {
            "number": 89,
            "heading": "Tell someone the truth",
            "title": "Telling one person the truth",
            "tag": "evidence — shame / secrecy",
            "tagColor": "#375623",
            "sub": "VI.C",
            "week": 7,
            "day": 7,
            "order": 88,
            "slug": "telling-one-person-the-truth-89",
            "pages": [
              {
                "kind": "teach",
                "headline": "Secrecy can keep the cycle going.",
                "body": "Hiding the behavior can create shame. Shame can increase the need to escape, which can lead to more use and more secrecy.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The fear of telling somebody is manufactured by the very thing that telling them would cure.",
                "body": "Shame insists that you’d be rejected. And almost every time, the secret loses its power the moment it’s spoken and the friendship gets deeper, because closeness is largely made out of being known.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How sealed is it at the moment?",
                "checks": [
                  {
                    "key": "nobody",
                    "label": "Nobody knows",
                    "asIn": "The loop is fully sealed and running in the dark",
                    "short": "nobody knowing"
                  },
                  {
                    "key": "half",
                    "label": "One person half knows",
                    "asIn": "A crack was started and never widened",
                    "short": "one person half knowing"
                  },
                  {
                    "key": "insists",
                    "label": "Shame says they would leave",
                    "asIn": "The prediction is loud and very specific",
                    "short": "shame saying they would leave"
                  },
                  {
                    "key": "open",
                    "label": "It’s already partly open",
                    "asIn": "There’s some air in the loop",
                    "short": "it being partly open"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "predicts",
                "headline": "What exactly does the fear predict?",
                "helper": "Write out the forecast, so you can check it later.",
                "options": [
                  "That they would be disgusted",
                  "That they would leave",
                  "That they would see me differently forever",
                  "That it would break something"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "nobody",
                    "headline": "A fully sealed loop runs at full power. That’s why one sentence buys you more here than almost anything else in this part.",
                    "body": "One safe person, one sentence, and the power supply is interrupted for the first time in years."
                  },
                  {
                    "key": "half",
                    "headline": "A half-crack proves that the catastrophe has already failed to happen once.",
                    "body": "They know something and they stayed. That means widening it costs less than making the first crack did."
                  },
                  {
                    "key": "insists",
                    "headline": "Notice who is making the forecast before you believe it.",
                    "body": "The fear of telling is shame protecting itself, and it writes the exact prediction that keeps the seal in place, which is a conflict of interest worth pointing out."
                  },
                  {
                    "key": "open",
                    "headline": "Keep the air moving, because loops reseal through silence.",
                    "body": "One unspoken month at a time is how it happens, so an occasional true sentence counts as maintenance, not as a confession."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "That they would be disgusted",
                      "That they would leave"
                    ],
                    "body": "Those are shame's two oldest scripts and the record runs the other way. Spoken secrets shrink and safe people stay, which is boring and reliable."
                  },
                  {
                    "options": [
                      "That they would see me differently forever"
                    ],
                    "body": "They probably will, and usually as somebody braver and easier to trust than before, since being trusted with something real is how closeness gets built."
                  },
                  {
                    "options": [
                      "That it would break something"
                    ],
                    "body": "What breaks things is years of sealed distance. The truth told to a safe person is the repair starting, not the damage."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "truething",
                "headline": "What is the one true thing?",
                "helper": "One sentence is enough.",
                "options": [
                  "\"Here is something I have been struggling with\"",
                  "The one-sentence version, with no detail",
                  "The whole shape of it, to one safe person"
                ],
                "result": "Saying: {pick}"
              },
              {
                "kind": "collect",
                "title": "The crack",
                "template": "\"One true thing, said to one safe person, which is {pick}. The ledge turns out to be solid ground.\"",
                "fallback": "\"I’ll choose the safe person and the sentence this week, and recognise the fear as shame's own forecast.\"",
                "source": "checks",
                "label": "How sealed it is:",
                "cta": "Save this"
              }
            ],
            "sources": "Secrecy and shame as engines of the cycle, and disclosure as the move that breaks them, follow directly from the shame findings in the evidence base: moral incongruence (Grubbs et al., 2019) and the shame trap (Part B3). That disclosure typically deepens rather than breaks relationships ties to the intimacy material of this week.",
            "action": "Tell one safe person one true thing about this struggle.",
            "reflection": "Name the one safe person you could tell one true thing to, and the true thing. Then notice the fear telling you not to; that fear is shame protecting itself."
          },
          {
            "number": 90,
            "heading": "An accountability partner",
            "title": "Somebody to answer to",
            "tag": "plausible — strong forum signal, conditional",
            "tagColor": "#0B3C49",
            "sub": "VI.C",
            "week": 7,
            "day": 8,
            "order": 89,
            "slug": "somebody-to-answer-to-90",
            "pages": [
              {
                "kind": "teach",
                "headline": "Of everything people in recovery give credit to, one thing sits at the top, which is having somebody to answer to.",
                "body": "It breaks the secrecy, it adds the quiet knowledge that somebody is going to ask how you’re doing, and it means the hardest part of your life finally has some company in it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "But one condition decides whether it helps or harms, which is that it has to be free of shame.",
                "body": "The wrong partner turns a slip into a small flogging, and the flogging feeds the next slip. The right one asks what happened and what you have learned. And you come away steadier. Same slip, opposite result.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What has your picture of accountability been?",
                "checks": [
                  {
                    "key": "judge",
                    "label": "Confessing to a judge",
                    "asIn": "Reporting to somebody whose job is the verdict",
                    "short": "confessing to a judge"
                  },
                  {
                    "key": "dread",
                    "label": "Dreading the check-in",
                    "asIn": "The telling itself feels like the punishment",
                    "short": "dreading the check-in"
                  },
                  {
                    "key": "never",
                    "label": "I have never had one",
                    "asIn": "It’s not something I have tried",
                    "short": "never having one"
                  },
                  {
                    "key": "have",
                    "label": "I have a good one",
                    "asIn": "It exists and it works",
                    "short": "having a good one"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "safe",
                "headline": "What makes somebody safe for this?",
                "helper": "The actual requirements, rather than closeness.",
                "options": [
                  "Steady when things are hard",
                  "Kind without going soft",
                  "No contempt in them",
                  "Has carried something themselves",
                  "Will ask"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "judge",
                    "headline": "The picture of a judge is why the idea has never worked in your head, and it’s the wrong picture.",
                    "body": "The working version is a witness, not a court, and the verdict is off the agenda because there’s not going to be one."
                  },
                  {
                    "key": "dread",
                    "headline": "If the telling feels like a flogging then the partner has been miscast, not the tool being wrong.",
                    "body": "Renegotiate the terms in daylight, or find somebody else for the seat, because dread is information about the arrangement, not about you."
                  },
                  {
                    "key": "never",
                    "headline": "Recruit somebody this week, with the requirements in your hand.",
                    "body": "Steady, kind, and with no contempt in them. One person and one agreement, and the most-credited tool in the whole field is yours."
                  },
                  {
                    "key": "have",
                    "headline": "Tend the terms instead of assuming they hold.",
                    "body": "Saying the \"slips get curiosity\" agreement out loud again once in a while is worth doing before it’s ever tested rather than after."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Steady when things are hard",
                      "No contempt in them"
                    ],
                    "body": "Steadiness matters more than closeness for this particular seat, because the right person can hear the worst sentence without flinching and without filing it away."
                  },
                  {
                    "options": [
                      "Kind without going soft",
                      "Will ask"
                    ],
                    "body": "Kind and asking is the working pair, since the warmth makes honesty possible and the asking is what keeps it regular."
                  },
                  {
                    "options": [
                      "Has carried something themselves"
                    ],
                    "body": "Somebody who has carried their own weight rarely reaches for contempt, because they know exactly what the telling costs."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "rule",
                "headline": "What is the ground rule?",
                "helper": "Agreed out loud, before anything else happens.",
                "options": [
                  "Slips get curiosity rather than contempt",
                  "A weekly honest check-in",
                  "They ask, and I answer straight"
                ],
                "result": "The terms: {pick}"
              },
              {
                "kind": "collect",
                "title": "The arrangement",
                "template": "\"One safe person, with the terms agreed up front, which are that {pick}. The condition is what makes the tool work at all.\"",
                "fallback": "\"I’ll name the safe person and agree the terms this week, before any test arrives.\"",
                "source": "checks",
                "label": "My old picture:",
                "cta": "Save this"
              }
            ],
            "sources": "Accountability is among the most-credited forum strategies, supported as a non-shaming accountability tool (Tier 1-2) in the evidence base, with the explicit, evidence-based condition that it must be non-shaming or it feeds the shame trap (Part B3, B4).",
            "action": "Recruit one accountability buddy and agree a no-shame check-in cadence.",
            "reflection": "Name one safe person who could be an accountability partner, someone who'd meet a slip with curiosity, not contempt. Write the one ground rule you'd agree with them first."
          },
          {
            "number": 91,
            "heading": "Community and groups",
            "title": "Choosing the right room",
            "tag": "plausible — with shame caveat",
            "tagColor": "#0B3C49",
            "sub": "VI.C",
            "week": 7,
            "day": 9,
            "order": 90,
            "slug": "choosing-the-right-room-91",
            "pages": [
              {
                "kind": "teach",
                "headline": "A good room does things that no single person can do for you.",
                "body": "It makes ordinary the struggle you thought made you uniquely broken, it trades strategies with people in your exact situation. And it witnesses the effort on the days when nobody else sees any of it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The caveat is doubled here, because a community amplifies whatever culture it already has.",
                "body": "Rooms that run on policing streaks and treating slips as disgrace hand the shame mechanic a crowd and a scoreboard, and heavier involvement in those rooms went with worse fallout after a slip (Prause & Binnie, 2024). So check the room before you lean on it.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What have the rooms you have been in been like?",
                "checks": [
                  {
                    "key": "scoreboard",
                    "label": "Built around day counts",
                    "asIn": "Streaks compared and zeros announced",
                    "short": "built around day counts"
                  },
                  {
                    "key": "disgrace",
                    "label": "Treating relapse as disgrace",
                    "asIn": "Slips confessed as though they were crimes",
                    "short": "treating relapse as disgrace"
                  },
                  {
                    "key": "kind",
                    "label": "Kind and practical",
                    "asIn": "Slips met as information and help traded freely",
                    "short": "kind and practical"
                  },
                  {
                    "key": "neverjoined",
                    "label": "I have never joined one",
                    "asIn": "It’s not something I have tried",
                    "short": "never joining one"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "gives",
                "headline": "What would a good room give you?",
                "helper": "Whatever you’d use.",
                "options": [
                  "The relief of finding it is common",
                  "Strategies from my exact situation",
                  "Somebody who sees the effort",
                  "Encouragement on the hard days"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "scoreboard",
                    "headline": "A room built around day counts is the zero-reset counter with an audience attached to it.",
                    "body": "Its applause runs on the exact mechanic that produces the misery, so you can leave it without any guilt whatever."
                  },
                  {
                    "key": "disgrace",
                    "headline": "A room that meets slips with disgrace is doing shame's work at scale.",
                    "body": "And the research says that heavier involvement in exactly that kind of room makes the aftermath of a slip worse instead of better."
                  },
                  {
                    "key": "kind",
                    "headline": "Lean on it, because that is what it’s for.",
                    "body": "A kind room can carry you through stretches you’d not manage on your own, and there’s nothing weak about letting it."
                  },
                  {
                    "key": "neverjoined",
                    "headline": "Check the room before you join it, and one read is enough to tell.",
                    "body": "Find the last slip somebody posted and look at how the room answered it, because that answer shows the culture more clearly than the rules do."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The relief of finding it is common",
                      "Encouragement on the hard days"
                    ],
                    "body": "Making it ordinary is the room's deepest gift, since a hundred people wrestling with the same thing dissolves \"uniquely broken\" on contact."
                  },
                  {
                    "options": [
                      "Strategies from my exact situation",
                      "Somebody who sees the effort"
                    ],
                    "body": "The practical exchange only helps inside a kind culture, because advice traded over a scoreboard always smells faintly of the standings."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "movegroup",
                "headline": "What are you doing this week?",
                "helper": "One step, with the room checked first.",
                "options": [
                  "Check one community for how it treats slips",
                  "Post once in a kind room",
                  "Go to one meeting",
                  "Leave a room that shames people"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The room",
                "template": "\"The test before leaning on any room is how it treats a slip, as information or as disgrace. This week: {pick}.\"",
                "fallback": "\"I’ll check one room this week by looking at how it answered its last slip.\"",
                "source": "checks",
                "label": "The rooms I have known:",
                "cta": "Save this"
              }
            ],
            "sources": "Peer support and shared structure are credited by members in the qualitative literature (evidence base, Part B4). The doubled shame caveat rests on the evidence base's central design warning that streak- and shame-driven communities can be harmful, and on Prause & Binnie (2024)'s finding that heavier involvement in shame-and-relapse-focused forums predicts worse emotional outcomes after a lapse (Part B3).",
            "action": "Join one group, forum, or meeting that frames slips kindly. Make one post or attend once.",
            "reflection": "If you're in (or considering) any recovery community, judge it honestly: does it treat a slip as data or as a disgrace? Keep the compassionate ones; leave the shaming ones."
          },
          {
            "number": 92,
            "heading": "The partner conversation",
            "title": "The conversation with a partner",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "VI.C",
            "week": 7,
            "day": 10,
            "order": 91,
            "slug": "the-conversation-with-a-partner-92",
            "pages": [
              {
                "kind": "teach",
                "headline": "If you have a partner, this has almost certainly touched the relationship somewhere.",
                "body": "It might be through the distance the secrecy creates, or through the intimacy itself, or through what they already know and how much it hurt. Handled badly the subject explodes, and handled well one honest conversation can start rebuilding the trust that the secrecy wore away.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Four choices make a difficult conversation safer.",
                "body": "None of them is about finding the perfect words.",
                "cta": "Next",
                "list": {
                  "ordered": true,
                  "items": [
                    "Talk when you are both calm",
                    "Be honest without adding graphic detail",
                    "Bring a clear plan instead of excuses",
                    "Give the other person room to feel what they feel"
                  ]
                }
              },
              {
                "kind": "ask",
                "headline": "Where has it touched things?",
                "checks": [
                  {
                    "key": "distance",
                    "label": "The distance the secrecy makes",
                    "asIn": "Something unnamed sitting between us",
                    "short": "the distance"
                  },
                  {
                    "key": "intimacy",
                    "label": "The intimacy itself",
                    "asIn": "Closeness thinned where the substitute was feeding",
                    "short": "the intimacy"
                  },
                  {
                    "key": "theyknow",
                    "label": "They know, and it hurt",
                    "asIn": "The conversation has already half started",
                    "short": "them knowing and it hurting"
                  },
                  {
                    "key": "nopartner",
                    "label": "I don’t have a partner",
                    "asIn": "Filed for later, since the skills transfer anyway",
                    "short": "not having a partner"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "parts",
                "headline": "What is \"handled well\" made of?",
                "helper": "The four working parts of the conversation.",
                "options": [
                  "Timing it while calm",
                  "Honesty without wounding detail",
                  "A plan rather than excuses",
                  "Room for their feelings, without collapsing"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "distance",
                    "headline": "The unnamed thing does daily damage on its own, without anybody deciding anything.",
                    "body": "Named calmly, with a plan attached to it, it stops being a wall between you and becomes a project you’re both looking at."
                  },
                  {
                    "key": "intimacy",
                    "headline": "The conversation about intimacy goes best when it’s pointed forwards.",
                    "body": "Less archaeology and more architecture, because what you’re building matters more to both of you than an inventory of what faded."
                  },
                  {
                    "key": "theyknow",
                    "headline": "Where there’s real hurt, their anger may well arrive first, and your job is to hear it and stay present.",
                    "body": "Collapsing into self-recrimination turns the moment into one where they have to comfort you, which is the opposite of what was needed."
                  },
                  {
                    "key": "nopartner",
                    "headline": "File the four parts for whenever they’re needed.",
                    "body": "Calm timing, honesty, a plan and steadiness hold up in every difficult conversation not only in this one."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Timing it while calm",
                      "Honesty without wounding detail"
                    ],
                    "body": "Those two are the entry conditions, and if you miss either one then the other two never get a hearing at all."
                  },
                  {
                    "options": [
                      "A plan rather than excuses",
                      "Room for their feelings, without collapsing"
                    ],
                    "body": "The plan and the steadiness are what rebuild trust, because being honest and accountable and not flinching is the opposite of everything the secrecy said about you."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "route",
                "headline": "How will you do it?",
                "helper": "Getting help with this is a sensible move rather than a failure.",
                "options": [
                  "On my own, planned calmly",
                  "With a couples therapist",
                  "Prepare first and talk later"
                ],
                "result": "My route: {pick}"
              },
              {
                "kind": "collect",
                "title": "The conversation",
                "template": "\"Calm, true, built round a plan, and steady. My route is {pick}.\"",
                "fallback": "\"I’ll plan the conversation this week: the timing, the true thing, the plan, and the steadiness.\"",
                "source": "checks",
                "label": "Where it has touched things:",
                "cta": "Save this"
              }
            ],
            "sources": "Practical relational guidance; no empirical claim is made. The secrecy erodes trust, honesty with care rebuilds it logic follows the shame-and-secrecy findings in the evidence base (Part B3) and Day 70. The suggestion to involve a couples therapist is offered as a sensible option, not a directive.",
            "action": "If relevant, plan one honest, non-defensive conversation with your partner. Note the outcome.",
            "reflection": "If you have a partner this touches: what's the one true, non-defensive thing you most need to say, calmly, focused on what you're doing about it? Decide whether you'd want help to hold the conversation."
          }
        ]
      }
    ]
  },
  {
    "n": 8,
    "title": "Part VII · When it goes wrong",
    "ground": "Ground VIII · High Ground",
    "description": "This part is about keeping one slip to one slip. That means the first hour afterwards, the move that gets you back on track the same day, and the long view that stops a bad day turning into a verdict.",
    "subs": [
      {
        "code": "VII.A",
        "title": "The first hour afterwards",
        "description": "Reading a slip as information, rewriting the story, and never failing twice.",
        "lessons": [
          {
            "number": 93,
            "heading": "A lapse is data, not a verdict",
            "title": "What a slip tells you",
            "tag": "evidence — abstinence-violation effect",
            "tagColor": "#375623",
            "sub": "VII.A",
            "week": 8,
            "day": 1,
            "order": 92,
            "slug": "what-a-slip-tells-you-93",
            "pages": [
              {
                "kind": "teach",
                "headline": "If you only remember one idea from all of this programme, make it this one.",
                "body": "A slip is information. It usually tells you something specific, such as that a particular trigger still has some power, or that you were exhausted, or that something had been bothering you all day and you hadn’t dealt with it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "And that is all a slip is, which is the part people find hardest to accept.",
                "body": "It doesn’t say anything about the kind of person you are. And it doesn’t cancel out the progress you have made. The staging you set up is still set up, the skills you practised are still in you, and everything you learned is still learned.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The counter that resets to zero isn’t a neutral piece of design. It’s part of the problem.",
                "body": "When one slip counts as total failure, the shame that follows is usually what drives the next episode. That means the counter manufactures the thing it claims to measure. That’s why nothing here ever puts you back to zero.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is your first reaction after a slip?",
                "checks": [
                  {
                    "key": "judge",
                    "label": "I judge myself",
                    "asIn": "I failed, so what is the point of any of it",
                    "short": "judging myself"
                  },
                  {
                    "key": "reset",
                    "label": "I write off everything before it",
                    "asIn": "All the good days suddenly stop counting",
                    "short": "writing off the good days"
                  },
                  {
                    "key": "spiral",
                    "label": "One slip becomes a bad week",
                    "asIn": "The week is ruined anyway, so I may as well",
                    "short": "letting it become a week"
                  },
                  {
                    "key": "log",
                    "label": "I write down what happened",
                    "asIn": "I already do some of what this lesson is asking for",
                    "short": "writing it down"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "fields",
                "headline": "What goes in the log",
                "helper": "Three short notes and nothing more than that.",
                "options": [
                  "What set it off",
                  "The state I was in",
                  "What it taught me"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "judge",
                    "headline": "Ask yourself plainly what the judging does for you, because it’s worth being specific about it.",
                    "body": "It doesn’t undo the slip and it doesn’t prevent the next one. What it does is make the following few days worse, which is how one bad night turns into a bad week."
                  },
                  {
                    "key": "reset",
                    "headline": "Nothing was erased, whatever the counter implied.",
                    "body": "The changes you made to your room are still there, the tools you have practised are still there, and everything you have learned is still learned. The only thing that reset was a number, and the number was working against you."
                  },
                  {
                    "key": "spiral",
                    "headline": "A spiral needs a story to run on, and it starts the moment you decide the week is ruined.",
                    "body": "If you sit down and write the three notes before that story gets going, there’s nothing for it to attach itself to and the evening stays the size it was."
                  },
                  {
                    "key": "log",
                    "headline": "You’re already doing the right thing some of the time, which is most of the way there.",
                    "body": "Make it the rule, not the exception. What set it off, the state you were in, what it taught you. It takes about two minutes and it works."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "What set it off",
                      "The state I was in"
                    ],
                    "body": "Those two are the most useful, because between them they point at exactly which of your defences needs some attention."
                  },
                  {
                    "options": [
                      "What it taught me"
                    ],
                    "body": "And the third is what makes the whole thing worth writing down at all, since a slip you learn something from is a very different event from a slip you repeat."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "line",
                "headline": "What will you say to yourself?",
                "helper": "The sentence for the minute right after.",
                "options": [
                  "\"Rerouting\"",
                  "\"That was one slip and it is over\"",
                  "\"What can I learn from that?\""
                ],
                "result": "My line: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your plan for the next slip",
                "template": "\"If I slip, I write down three things, which are what set it off, the state I was in, and what it taught me. Then I say {pick}, and then I get on with my day.\"",
                "fallback": "\"If I slip, I write down what set it off, the state I was in, and what it taught me. I’ll set the log up this week so it’s ready before I need it.\"",
                "source": "checks",
                "label": "My old reactions:",
                "cta": "Save this"
              }
            ],
            "sources": "The abstinence-violation effect (the all-or-nothing reset that turns one slip into a binge) and the finding that the streak/shame mechanic itself drives relapse are central to the evidence base (Part B3). Lapse-as-data is the app's load-bearing principle.",
            "action": "After any slip, complete a structured log (trigger, state, lesson) instead of resetting a counter.",
            "reflection": "Write the structured log you'll use after a slip (trigger, state, lesson learned) so that next time you reach for the log (the satnav) instead of the verdict (the judge)."
          },
          {
            "number": 94,
            "heading": "Restructure the lapse",
            "title": "The story afterwards",
            "tag": "evidence — relapse prevention",
            "tagColor": "#375623",
            "sub": "VII.A",
            "week": 8,
            "day": 2,
            "order": 93,
            "slug": "the-story-afterwards-94",
            "pages": [
              {
                "kind": "teach",
                "headline": "The slip itself costs you about twenty minutes. The story you tell about it can cost you three days.",
                "body": "\"I have blown it now, so I may as well carry on\" is the hinge that a small lapse swings on, and researchers call it the abstinence-violation effect. That one sentence does far more damage than the slip ever did.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "And there’s evidence that this framing hurts people, instead of it being a matter of opinion.",
                "body": "Organising everything around recovery and relapse was a large part of what kept forum members miserable (Fernandez et al., 2021), and the men most caught up in shame-and-relapse thinking had the worst time afterwards (Prause & Binnie, 2024).",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is your sentence after a slip?",
                "checks": [
                  {
                    "key": "blown",
                    "label": "\"I have blown it, so I may as well\"",
                    "asIn": "One plate breaks, so I smash the rest of the set",
                    "short": "\"I've blown it anyway\""
                  },
                  {
                    "key": "zero",
                    "label": "\"Back to zero\"",
                    "asIn": "Everything before it erased in a single phrase",
                    "short": "\"back to zero\""
                  },
                  {
                    "key": "failure",
                    "label": "\"I’m a failure\"",
                    "asIn": "The verdict jumps from what I did to who I am",
                    "short": "\"I'm a failure\""
                  },
                  {
                    "key": "data",
                    "label": "\"One event, and it’s over\"",
                    "asIn": "Sometimes I manage the calm reading of it",
                    "short": "\"one event, already over\""
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "spends",
                "headline": "What has the old story cost you?",
                "helper": "The bill for the sentence, separately from the slip.",
                "options": [
                  "Days of spiralling afterwards",
                  "A binge built on one slip",
                  "A whole attempt abandoned",
                  "The lesson it carried, never read"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "blown",
                    "headline": "Say the logic of it out loud and it falls apart almost immediately.",
                    "body": "One broken plate is no reason at all to smash the rest of the set. The slip is over and the smashing is a separate decision that you get to make."
                  },
                  {
                    "key": "zero",
                    "headline": "Nothing went back to zero, however convincingly the phrase lands.",
                    "body": "The staging is still standing, the practice is still in you, and the learning is still learned. Only the counter died, and the counter was working against you anyway."
                  },
                  {
                    "key": "failure",
                    "headline": "The verdict jumps from the act to your character, and that jump is where the damage happens.",
                    "body": "Judge the chain of events instead, since a chain can be redesigned and a character just sits there being judged."
                  },
                  {
                    "key": "data",
                    "headline": "You already own the counter-move and the job is to have it ready.",
                    "body": "Keep the sentence rehearsed, because you need it most in the sixty seconds when the old one is at its loudest."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Days of spiralling afterwards",
                      "A binge built on one slip"
                    ],
                    "body": "That arithmetic is the entire case. One small event kept being used to justify a hundred times its own harm, and the new sentence refuses to do the multiplication."
                  },
                  {
                    "options": [
                      "A whole attempt abandoned"
                    ],
                    "body": "An attempt that a story ended can restart the moment the story changes, because nothing structural broke in the first place."
                  },
                  {
                    "options": [
                      "The lesson it carried, never read"
                    ],
                    "body": "Every slip files a short report on where your defences need work, and reading it means the slip nearly pays for itself."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "sentence",
                "headline": "What is the new sentence?",
                "helper": "Ready in advance, for the sixty seconds afterwards.",
                "options": [
                  "\"One slip is one slip\"",
                  "\"That is information, not a verdict\"",
                  "\"It is over. What does it tell me?\""
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The sixty seconds",
                "template": "\"When it happens I say {pick}. The slip is one event, and the story I tell about it is mine to choose.\"",
                "fallback": "\"I’ll write the new sentence down before I need it, because everybody slips eventually.\"",
                "source": "checks",
                "label": "My old sentences:",
                "cta": "Save this"
              }
            ],
            "sources": "The abstinence-violation effect is a core concept in relapse-prevention research. That framing abstinence around recovery and relapse is a major factor maintaining distress is from Fernandez et al. (2021); that shame-and-relapse-focused involvement predicts worse emotional outcomes after a lapse is from Prause & Binnie (2024). Both are in the evidence base, Part B3. The lapse-as-data, no-zero-reset stance is this app's direct response to that finding.",
            "action": "After any slip, write what it taught you, not what it proved about you.",
            "reflection": "Write the exact sentence your mind uses to turn one slip into a binge (\"I've blown it, might as well…\"). Naming it now lets you catch it next time, and answer it with \"one slip is one slip.\""
          },
          {
            "number": 95,
            "heading": "Never fail twice",
            "title": "Never twice in a row",
            "tag": "evidence — relapse prevention / abstinence-violation effect",
            "tagColor": "#375623",
            "sub": "VII.A",
            "week": 8,
            "day": 3,
            "order": 94,
            "slug": "never-twice-in-a-row-95",
            "pages": [
              {
                "kind": "teach",
                "headline": "A flat tyre doesn’t wreck a car. Getting out and slashing the other three does.",
                "body": "The flat was bad luck and the slashing is a decision, and nearly every collapse in this whole area runs on exactly that move, not on the original puncture.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The first slip is an accident and the second one is a choice, and it’s the second that rebuilds the old pattern.",
                "body": "So here is a rule simple enough to hold onto at your lowest, which is never to fail twice in a row. Protect the recovery and let the flawless record go, because the record was never doing the work anyway.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What has usually followed a first slip?",
                "checks": [
                  {
                    "key": "slash",
                    "label": "I slash the other three tyres",
                    "asIn": "\"May as well\" finishes what the slip started",
                    "short": "slashing the other tyres"
                  },
                  {
                    "key": "weekend",
                    "label": "The weekend goes",
                    "asIn": "One evening takes over the next two days",
                    "short": "losing the weekend"
                  },
                  {
                    "key": "monday",
                    "label": "\"I’ll restart on Monday\"",
                    "asIn": "I write off the week to a calendar",
                    "short": "waiting for Monday"
                  },
                  {
                    "key": "recover",
                    "label": "I get back quickly",
                    "asIn": "The rule is half installed already",
                    "short": "getting back quickly"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "moves",
                "headline": "What is the same-day recovery move?",
                "helper": "Small, physical, and decided in advance.",
                "options": [
                  "Write it down, then have a shower",
                  "Straight outside for a walk",
                  "Message the person who knows",
                  "Back to the next thing on the plan",
                  "An early night and a clean morning"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "slash",
                    "headline": "\"May as well\" is the hinge on which twenty minutes turns into a lost weekend.",
                    "body": "Refuse that one phrase and the slip stays roughly the size it was, which is small and annoying instead of catastrophic."
                  },
                  {
                    "key": "weekend",
                    "headline": "The weekend goes because the first hour after the slip went, and that hour is the whole battlefield.",
                    "body": "Own that hour with something decided in advance and the following two days stay yours rather than being annexed."
                  },
                  {
                    "key": "monday",
                    "headline": "Monday is an accounting fiction, and waiting for it costs you five days.",
                    "body": "The recovery is available at the next meal, or the next hour, or the same evening, because recovery doesn’t read calendars."
                  },
                  {
                    "key": "recover",
                    "headline": "Formalise the thing you’re already half doing.",
                    "body": "One named move, written down, so that the worst version of the moment meets a plan, not a mood."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Write it down, then have a shower",
                      "An early night and a clean morning"
                    ],
                    "body": "The quiet versions suit a late slip, since writing it down, washing and sleeping means the recovery is the morning itself."
                  },
                  {
                    "options": [
                      "Straight outside for a walk",
                      "Back to the next thing on the plan"
                    ],
                    "body": "The moving versions break the spell of the room, because getting out of the scene and into the next right thing turns the momentum around on the spot."
                  },
                  {
                    "options": [
                      "Message the person who knows"
                    ],
                    "body": "The contact version spends the shame before it can compound, and a slip said out loud to a safe person stays one event."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "recoverymove",
                "headline": "What is your move?",
                "helper": "Decided while calm, and used quickly.",
                "options": [
                  "Write it down, then shower",
                  "Straight out for a walk",
                  "Message the person who knows",
                  "An early night and a clean morning"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The rule",
                "template": "\"One flat tyre means I change the tyre, which for me means {pick}, on the same day. A slip doesn’t become a slide.\"",
                "fallback": "\"I’ll write my recovery move down this week, calmly, before I ever need it.\"",
                "source": "checks",
                "label": "What used to follow:",
                "cta": "Save this"
              }
            ],
            "sources": "The lapse-versus-relapse distinction and the abstinence-violation effect (a single lapse progresses to full relapse largely through the guilt/\"I've blown it\" reaction rather than the lapse itself) come from Marlatt and Gordon's relapse-prevention model, and align with the evidence base's central anti-shame, lapse-as-data finding (Part B3). \"Never miss twice\" is a popular habit-formation heuristic (e.g. James Clear's writing), not a clinical finding; included as a memorable rule of thumb, not evidence.",
            "action": "Decide your \"never fail twice\" recovery move now: the single small thing you'll do immediately after any slip to get back on track the same day. Write it down.",
            "reflection": "After your next slip, before deciding anything else, zoom out and name one way the last month is trending upward despite it. Then do your recovery move, not the spiral."
          }
        ]
      },
      {
        "code": "VII.B",
        "title": "The long view",
        "description": "The line that goes up and down, and challenges that don’t turn into streaks.",
        "lessons": [
          {
            "number": 96,
            "heading": "Progress isn't linear",
            "title": "The line goes up and down",
            "tag": "reframe",
            "tagColor": "#4B3F72",
            "sub": "VII.B",
            "week": 8,
            "day": 4,
            "order": 95,
            "slug": "the-line-goes-up-and-down-96",
            "pages": [
              {
                "kind": "teach",
                "headline": "Somewhere along the way you started expecting a smooth line that climbs steadily.",
                "body": "Real change doesn’t look like that. It goes up, down, sideways, and up again, while trending upward over months, and the gap between those two pictures causes an enormous amount of unnecessary quitting.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Zoomed in on a single bad day, all you can see is the falling part.",
                "body": "Zoom out to a few months and the same dip is one notch on a line that is quite obviously climbing. Same data, different story, and the zoomed-out story is the one that is true.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do you do when the line dips?",
                "checks": [
                  {
                    "key": "proof",
                    "label": "I read it as proof of failure",
                    "asIn": "The dip becomes the verdict on the whole climb",
                    "short": "reading it as proof"
                  },
                  {
                    "key": "quitvoice",
                    "label": "I hear the voice that says stop",
                    "asIn": "The perfect run broke, so why keep going",
                    "short": "hearing the voice that says stop"
                  },
                  {
                    "key": "reversed",
                    "label": "I think the trend has reversed",
                    "asIn": "Twenty-four bad hours outweigh two good months",
                    "short": "thinking it has reversed"
                  },
                  {
                    "key": "zoomout",
                    "label": "I zoom out already",
                    "asIn": "I half have the habit of looking at the trend",
                    "short": "zooming out already"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "improved",
                "headline": "What improved this month regardless of slips?",
                "helper": "The trend, broken into pieces.",
                "options": [
                  "Sleep",
                  "Real contact with people",
                  "Fewer bad days",
                  "Lessons that now work",
                  "A tool that has become automatic"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "proof",
                    "headline": "A dip on a rising line is evidence that the line is real, not evidence against it.",
                    "body": "Nobody climbs smoothly at anything, not in fitness, not in languages, and not in this."
                  },
                  {
                    "key": "quitvoice",
                    "headline": "That voice only speaks when a promise has been broken. That means the promise is the problem.",
                    "body": "Stop promising yourself smoothness. If you expect the line to be jagged then there’s no promise there to break."
                  },
                  {
                    "key": "reversed",
                    "headline": "One day can’t reverse a trend. It can only interrupt it for a day.",
                    "body": "The month's data outvotes the day's data every single time you bother to consult it, which is the whole argument for consulting it."
                  },
                  {
                    "key": "zoomout",
                    "headline": "Keep the habit and make it formal instead of occasional.",
                    "body": "A weekly look at the trend, and never a daily look at the wobble, because the daily look is where the discouragement comes from."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Sleep",
                      "Real contact with people"
                    ],
                    "body": "Those are the quiet climbs that a streak counter is blind to, and a month with a few slips, better sleep and more people in it’s a month of real progress."
                  },
                  {
                    "options": [
                      "Fewer bad days",
                      "Lessons that now work",
                      "A tool that has become automatic"
                    ],
                    "body": "Count those up and the month you had written off as a failure usually turns out to have been a climbing one with a few notches in it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "cadence",
                "headline": "How often will you look?",
                "helper": "At the trend, and never at the dip.",
                "options": [
                  "Weekly, at the trend only",
                  "Monthly",
                  "After any bad day, zoom out first"
                ],
                "result": "Reviewing: {pick}"
              },
              {
                "kind": "collect",
                "title": "The trend",
                "template": "\"My line goes up and down and trends upward. This month held {grid}, and I review it {pick}, from far enough back that one dip can’t distort it.\"",
                "fallback": "\"I’ll review the month for its trend this week, and the worst day loses its veto.\"",
                "source": "checks",
                "label": "What dips used to do:",
                "cta": "Save this"
              }
            ],
            "sources": "Reframe; no empirical statistic is claimed. Judging the trend over time rather than the last event is the natural counterpart to the lapse-as-data / no-zero-reset principle in the evidence base (Part B3).",
            "action": "Review your progress over weeks, not the last day. Look at the trend, not the dip.",
            "reflection": "Zoom out: over the last month, what has improved (sleep, connection, lessons learned, good days) regardless of any slips? Write the honest trend. That's the real measure."
          },
          {
            "number": 97,
            "heading": "Time-boxed challenges",
            "title": "Challenges with an end date",
            "tag": "folklore / observational",
            "tagColor": "#843C3C",
            "sub": "VII.B",
            "week": 8,
            "day": 5,
            "order": 96,
            "slug": "challenges-with-an-end-date-97",
            "pages": [
              {
                "kind": "teach",
                "headline": "A challenge with a fixed length is well designed for one particular job, which is starting.",
                "body": "A fixed-length challenge gives you a clear end date, some company, and an easy way to start. It makes an excellent way in. And it’s only a way in, not the road itself.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The one caution isn’t to let the challenge curdle into a streak.",
                "body": "The moment a thirty-day experiment becomes day nineteen with a slip meaning disgrace, you have rebuilt the abstinence-violation effect and put a hashtag on it. A slip during a challenge is information, exactly as it is at any other time.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How have challenges gone for you?",
                "checks": [
                  {
                    "key": "onramps",
                    "label": "They got me started",
                    "asIn": "Momentum gained, and something learned from it",
                    "short": "getting me started"
                  },
                  {
                    "key": "curdled",
                    "label": "They turned into streaks",
                    "asIn": "The day count became the point, and then the punishment",
                    "short": "turning into streaks"
                  },
                  {
                    "key": "dread19",
                    "label": "They became dread machines",
                    "asIn": "The count climbs and the fear climbs alongside it",
                    "short": "becoming dread machines"
                  },
                  {
                    "key": "nevertried2",
                    "label": "I have never run one",
                    "asIn": "It’s not a format I have used",
                    "short": "never running one"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "rules",
                "headline": "What are the rules, decided beforehand?",
                "helper": "Written before day one rather than during day nineteen.",
                "options": [
                  "A clear end date",
                  "A slip counts as information, decided in advance",
                  "No worshipping the day count",
                  "Lessons converted into habits afterwards"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "onramps",
                    "headline": "Use them for what they’re good at instead of expecting more.",
                    "body": "Momentum in, lessons out, and then the steadier work built on your values takes over whatever the challenge started."
                  },
                  {
                    "key": "curdled",
                    "headline": "The curdling has a reliable tell, which is that the count starts mattering more than the learning.",
                    "body": "Next time, write the rules before you start, and rule one is what a slip is going to mean when it happens."
                  },
                  {
                    "key": "dread19",
                    "headline": "Dread on day nineteen is the streak mechanic wearing a party hat.",
                    "body": "An experiment with a finish line carries no dread with it, because a slip can’t void an experiment. It just becomes part of the result."
                  },
                  {
                    "key": "nevertried2",
                    "headline": "If the format appeals to you then run one properly, once, with an end date and a slip rule and a review.",
                    "body": "And if it doesn’t appeal, the steady work carries on perfectly well without a hashtag attached to it."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A clear end date",
                      "Lessons converted into habits afterwards"
                    ],
                    "body": "The end date and the review are what make it an experiment, not a vow, since it finishes and something gets kept."
                  },
                  {
                    "options": [
                      "A slip counts as information, decided in advance",
                      "No worshipping the day count"
                    ],
                    "body": "The slip rule is the entire safeguard, and written before day one it stops the challenge turning itself into a courtroom."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "runchal",
                "headline": "Are you going to run one?",
                "helper": "Both answers are perfectly good ones.",
                "options": [
                  "Yes, with an end date and a slip rule",
                  "No, steady work instead for now"
                ],
                "result": "Decided: {pick}"
              },
              {
                "kind": "collect",
                "title": "The rules",
                "template": "\"If I run a challenge it’s an experiment with a finish line, not a streak with a verdict attached. {pick}.\"",
                "fallback": "\"If I do run one, its slip rule gets written before day one.\"",
                "source": "checks",
                "label": "How they have gone:",
                "cta": "Save this"
              }
            ],
            "sources": "Time-boxed challenges are a popular community practice (folklore/observational). Their on-ramp value uses the short-horizon principle (Day 88); the caveat applies the evidence base's central warning against the streak/zero-reset shame mechanic (Part B3).",
            "action": "Run one time-boxed challenge with a clear end date. Treat it as an experiment, not a streak.",
            "reflection": "If you run a challenge, decide in advance how you'll treat a slip during it, as data that the experiment continues through, not as a failure that resets everything. Write that rule now."
          }
        ]
      }
    ]
  },
  {
    "n": 9,
    "title": "Part VIII · The deep fires",
    "ground": "Ground IX · The Gates",
    "description": "This part is for when something underneath keeps refilling the payoff side. That means looking under the behaviour, at the old wounds, and at how to get proper help.",
    "subs": [
      {
        "code": "VIII.A",
        "title": "Looking underneath",
        "description": "Reading the symptom plainly, screening for what is causing it, and keeping a record.",
        "lessons": [
          {
            "number": 98,
            "heading": "The behaviour is often a symptom",
            "title": "Smoke and fire",
            "tag": "evidence — comorbidity",
            "tagColor": "#375623",
            "sub": "VIII.A",
            "week": 9,
            "day": 1,
            "order": 97,
            "slug": "smoke-and-fire-98",
            "pages": [
              {
                "kind": "teach",
                "headline": "For a good many people the behaviour is a symptom, not the illness.",
                "body": "It’s smoke coming off a fire that is burning somewhere else, and the fire is usually low mood, or anxiety, or restlessness, or loneliness. You can spend years waving at smoke while the fire carries on burning underneath it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "This explains the ceiling that a lot of people run into and can’t understand.",
                "body": "You work hard, you use every technique in the book, and progress still stops at the same level every time. Tools aimed at the smoke do help, but while the fire goes untreated they can only do so much, and treating the fire usually needs help from somebody trained.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What does porn most reliably do for you, at the level of feeling?",
                "checks": [
                  {
                    "key": "lifts",
                    "label": "It lifts a constant low",
                    "asIn": "It’s the one thing that reliably raises a flat baseline",
                    "short": "lifting a constant low"
                  },
                  {
                    "key": "quiets",
                    "label": "It quiets an anxiety",
                    "asIn": "The fastest off switch I have for a mind that won’t stop",
                    "short": "quieting an anxiety"
                  },
                  {
                    "key": "stills",
                    "label": "It stills the restlessness",
                    "asIn": "Impulse and boredom, briefly parked",
                    "short": "stilling the restlessness"
                  },
                  {
                    "key": "fills",
                    "label": "It fills the loneliness",
                    "asIn": "The substitute standing in for people who aren’t there",
                    "short": "filling the loneliness"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "ceiling",
                "headline": "What has the ceiling looked like?",
                "helper": "The signs that something underneath is capping it.",
                "options": [
                  "Real effort with capped results",
                  "Tools that half work and then stall",
                  "Years spent fighting the same smoke",
                  "No ceiling so far"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "lifts",
                    "headline": "If porn is the one thing that lifts a constant low, then the low is the actual finding here.",
                    "body": "It matters a great deal more than any anti-porn tactic, and it’s worth taking to somebody trained instead of trying to manage it around the edges."
                  },
                  {
                    "key": "quiets",
                    "headline": "An anxiety that never switches off has a name and it has treatments that work.",
                    "body": "Effective ones exist for exactly this, and Lesson 99 has the screening tool, which is your next step, not a suggestion."
                  },
                  {
                    "key": "stills",
                    "headline": "A constant restlessness underneath this pattern is common and reasonably well understood.",
                    "body": "It’s worth screening for rather than guessing about, because the guessing hasn’t got you very far and the screen takes ten minutes."
                  },
                  {
                    "key": "fills",
                    "headline": "If it’s loneliness underneath, then that is a fire you can reach yourself.",
                    "body": "Part VI is the treatment plan for it, and treating it directly does more than any amount of waving at the smoke."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Real effort with capped results",
                      "Tools that half work and then stall"
                    ],
                    "body": "A ceiling that holds even after real effort is the classic sign that something untreated is setting the limit, and no amount of willpower moves a limit like that."
                  },
                  {
                    "options": [
                      "Years spent fighting the same smoke"
                    ],
                    "body": "After years of the same fight, one look underneath is overdue, because a fire, unlike smoke, is a thing that can be put out."
                  },
                  {
                    "options": [
                      "No ceiling so far"
                    ],
                    "body": "No ceiling is good news and worth believing. For you the surface work is the work, and it appears to be working."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "movesym",
                "headline": "What is the move?",
                "helper": "Naming what is underneath, plainly.",
                "options": [
                  "Name what I might be medicating",
                  "Take it to a professional",
                  "Watch it for a fortnight and then decide"
                ],
                "result": "My move: {pick}"
              },
              {
                "kind": "collect",
                "title": "What is underneath",
                "template": "\"What it does for me is {checks}, and my next move is to {pick}. Smoke can be waved at for years. A fire can be put out.\"",
                "fallback": "\"I’ll take one honest look underneath this week and ask what the behaviour is doing for me.\"",
                "source": "checks",
                "label": "What it does for me:",
                "cta": "Save this"
              }
            ],
            "sources": "Compulsive use frequently co-occurs with and is used to medicate underlying conditions (depression, anxiety, ADHD, trauma, loneliness), consistent with the evidence base's effects and correlates section and the coping-motive finding (Part A4, B1(b)). The treat the underlying condition stance points toward professional care; this lesson does not diagnose.",
            "action": "List honestly what you might be medicating. If it runs deep, take it to a professional.",
            "reflection": "Answer plainly: what does porn most reliably do for you at the level of feeling? If a real \"fire\" (depression, anxiety, trauma, ADHD, loneliness) sits underneath, name it. That's the thing to get help with."
          },
          {
            "number": 99,
            "heading": "Screen for what's underneath",
            "title": "Finding out what it is",
            "tag": "evidence — directs to care",
            "tagColor": "#375623",
            "sub": "VIII.A",
            "week": 9,
            "day": 2,
            "order": 98,
            "slug": "finding-out-what-it-is-99",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"Something underneath\" is far too vague to act on. That’s why the last lesson needs this one.",
                "body": "Low mood, anxiety and restlessness are different problems and they respond to different treatments, so you have to name the problem before you can do anything sensible about it.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Short, properly validated self-screens exist for exactly this purpose.",
                "body": "The PHQ-9 covers mood, the GAD-7 covers anxiety, and the ASRS covers adult ADHD. Each takes a few minutes, costs nothing, and is easy to find from a reputable source. A screen is a smoke detector, and if one keeps going off you call somebody in to look.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is the most likely candidate?",
                "checks": [
                  {
                    "key": "lowmood",
                    "label": "Low mood",
                    "asIn": "A flat baseline that colours everything else",
                    "short": "low mood"
                  },
                  {
                    "key": "anxiety",
                    "label": "Anxiety",
                    "asIn": "A hum that never quite switches off",
                    "short": "anxiety"
                  },
                  {
                    "key": "attention",
                    "label": "Attention and restlessness",
                    "asIn": "The impulse and boredom engine",
                    "short": "attention and restlessness"
                  },
                  {
                    "key": "intrusive",
                    "label": "Intrusive thoughts",
                    "asIn": "Things arriving uninvited and then looping",
                    "short": "intrusive thoughts"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "screens",
                "headline": "Which screen matches?",
                "helper": "Short, validated and free.",
                "options": [
                  "The PHQ-9, for mood",
                  "The GAD-7, for anxiety",
                  "The ASRS, for adult ADHD"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "lowmood",
                    "headline": "The PHQ-9 is your ten minutes this week, and it’s worth doing properly.",
                    "body": "Answer it on your own with nobody watching, and as the last few weeks were, not as you’d like them to have been. If the score comes back clearly high, book an appointment soon."
                  },
                  {
                    "key": "anxiety",
                    "headline": "The GAD-7 is your ten minutes this week.",
                    "body": "It can’t diagnose you and it’s not meant to. What it can do is tell you whether the hum is worth a professional's time, and it usually is."
                  },
                  {
                    "key": "attention",
                    "headline": "The ASRS is your ten minutes this week.",
                    "body": "Unmanaged restlessness sits underneath exactly this pattern often, and there’s real, specific help available for it once it has been identified."
                  },
                  {
                    "key": "intrusive",
                    "headline": "Describe intrusive, looping thoughts to a professional directly instead of screening for them yourself.",
                    "body": "That particular pattern has its own well-understood care, and it’s the worst one to guess about on your own."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The PHQ-9, for mood",
                      "The GAD-7, for anxiety"
                    ],
                    "body": "Take whichever matches your candidate first, and answer as the recent weeks were, including the bad days not only the good ones."
                  },
                  {
                    "options": [
                      "The ASRS, for adult ADHD"
                    ],
                    "body": "The ASRS surprises people who had written themselves off as lazy, because once restlessness has a name it can get help instead of blame."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "commit",
                "headline": "What are you committing to?",
                "helper": "One screen, answered straight.",
                "options": [
                  "Take the matching screen today",
                  "Take it this week",
                  "I have screened already, so book the appointment"
                ],
                "result": "My plan: {pick}"
              },
              {
                "kind": "collect",
                "title": "The reading",
                "template": "\"The most likely candidate is {checks}, and {pick}. If the signal is clear, it goes to a professional within weeks instead of months.\"",
                "fallback": "\"I’ll take one validated screen this week, and act on it if it flags something.\"",
                "source": "checks",
                "label": "The candidates:",
                "cta": "Save this"
              }
            ],
            "sources": "That compulsive use commonly co-occurs with depression, anxiety, ADHD, and OCD-spectrum presentations, each with distinct effective treatments, is consistent with the evidence base (Part A4-A5). The PHQ-9, GAD-7, and ASRS are standard, widely used validated clinical self-screening tools (general knowledge, not specific to the evidence base); the lesson directs to professional diagnosis and does not diagnose.",
            "action": "Take a validated self-screen (depression/anxiety/ADHD). If it flags, book a professional.",
            "reflection": "If you suspect something underneath, which is the most likely candidate, low mood, anxiety, attention/restlessness, intrusive urges? Note it, and commit to taking one honest self-screen this week."
          },
          {
            "number": 100,
            "heading": "The self-medication audit",
            "title": "Two weeks of notes",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "VIII.A",
            "week": 9,
            "day": 3,
            "order": 99,
            "slug": "two-weeks-of-notes-100",
            "pages": [
              {
                "kind": "teach",
                "headline": "Memory edits, and it edits in a predictable direction.",
                "body": "Slips blur, details smooth themselves over, and what you’re left with is a vague and rather flattering story that hides the real pattern. A note made at the time beats memory, because it catches the state before the tidying up begins.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The discipline itself is small, which is what makes it possible to keep.",
                "body": "At each urge you write down three things: the feeling, the situation, and whatever need you can sense underneath it. A word or two each, for two weeks. Whatever keeps recurring is your real target. And it’s exactly the map a professional would want handed to them.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "How good is your picture of your own triggers?",
                "checks": [
                  {
                    "key": "vague",
                    "label": "vague",
                    "asIn": "Stress, probably, ended with a shrug",
                    "short": "being fairly vague"
                  },
                  {
                    "key": "flattering",
                    "label": "Possibly flattering",
                    "asIn": "The version that leaves out the uncomfortable details",
                    "short": "being possibly flattering"
                  },
                  {
                    "key": "memory",
                    "label": "Put together from memory",
                    "asIn": "Hindsight doing the recording, rather badly",
                    "short": "coming from memory"
                  },
                  {
                    "key": "mapped",
                    "label": "Already mapped",
                    "asIn": "Real entries, real dates, and a visible pattern",
                    "short": "already being mapped"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "fields",
                "headline": "The three things you write down",
                "helper": "Before doing anything else about the urge.",
                "options": [
                  "The feeling, in one word",
                  "The situation, in a phrase",
                  "The need underneath it"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "vague",
                    "headline": "You can’t aim at \"stress, probably\". That’s why the vague version has never helped.",
                    "body": "Two weeks of entries turns the shrug into a sentence with an actual target in it, and a target is something you can build a plan around."
                  },
                  {
                    "key": "flattering",
                    "headline": "The flattering version is human and it costs you the pattern.",
                    "body": "A note made in the moment is the one witness that memory can’t coach afterwards, which is the whole reason for writing at the time."
                  },
                  {
                    "key": "memory",
                    "headline": "Hindsight writes down whatever the story needs rather than whatever happened.",
                    "body": "Capture it at the urge instead and the record starts outranking the narrator, which is a considerable improvement."
                  },
                  {
                    "key": "mapped",
                    "headline": "Read it for whatever recurs, not for the individual entries.",
                    "body": "The state that comes before most of your urges is your real target, and everything else in the log is secondary detail."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "The feeling, in one word",
                      "The need underneath it"
                    ],
                    "body": "Those two converge over a fortnight, and when the same ones keep repeating, the thing underneath has effectively named itself."
                  },
                  {
                    "options": [
                      "The situation, in a phrase"
                    ],
                    "body": "The situation column catches what the feelings hide, which is very often the same room, the same hour and the same day of the week."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "start",
                "headline": "When does the fortnight start?",
                "helper": "Two honest weeks of it.",
                "options": [
                  "Today, at the next urge",
                  "Monday, cleanly",
                  "Alongside the log I already keep"
                ],
                "result": "Starting: {pick}"
              },
              {
                "kind": "collect",
                "title": "The audit",
                "template": "\"Two weeks, three notes at each urge, which are the feeling, the situation and the need. {pick}. Whatever pattern turns up is the target.\"",
                "fallback": "\"I’m committing to the two-week audit now, and I’ll read the pattern at the end of it.\"",
                "source": "checks",
                "label": "My picture so far:",
                "cta": "Save this"
              }
            ],
            "sources": "Self-monitoring and functional analysis is a Tier 1-2 strategy in the evidence base, and mapping urges to their antecedent states operationalises the coping-motive finding (Part B1(b)). Kept at the plausible level as a practical synthesis; produces exactly the data a clinician would use.",
            "action": "For two weeks, log each urge with the state it was treating. Then look for the pattern.",
            "reflection": "Commit to the two-week audit. At the end, write the single clearest pattern you found, the state most of your urges were really treating. That's your real target."
          }
        ]
      },
      {
        "code": "VIII.B",
        "title": "The old wounds",
        "description": "Two ways of looking at what the behaviour might be growing out of.",
        "lessons": [
          {
            "number": 101,
            "heading": "Inner-child work",
            "title": "What is the reaching for?",
            "tag": "contested — popular frame, mixed evidence",
            "tagColor": "#7F6000",
            "sub": "VIII.B",
            "week": 9,
            "day": 4,
            "order": 100,
            "slug": "what-is-the-reaching-for-101",
            "pages": [
              {
                "kind": "teach",
                "headline": "Here is one way to look at it. The evidence is mixed.",
                "body": "Some people still find the frame useful. The idea is that compulsive behaviour may soothe a need left over from early life. The part reaching for comfort can feel much younger than the adult doing the reaching.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Notice what that picture does to your tone.",
                "body": "It’s hard to feel contempt for a frightened child looking for comfort. Compassion comes more naturally. That matters because a kinder response is also more useful after a slip.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "When the urge hits, what is underneath it?",
                "checks": [
                  {
                    "key": "comfort",
                    "label": "A need for comfort",
                    "asIn": "Warmth, softness, and the day being put down",
                    "short": "a need for comfort"
                  },
                  {
                    "key": "safety",
                    "label": "A need to feel safe",
                    "asIn": "Somewhere I can drop my guard",
                    "short": "a need to feel safe"
                  },
                  {
                    "key": "reassure",
                    "label": "A need for reassurance",
                    "asIn": "To hear that it’s all right and that I’m all right",
                    "short": "a need for reassurance"
                  },
                  {
                    "key": "notalone",
                    "label": "A need not to be alone",
                    "asIn": "Company, even silent company",
                    "short": "a need not to be alone"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "truer",
                "headline": "What would meet the need?",
                "helper": "The real answer, not the substitute.",
                "options": [
                  "Actual comfort, meaning warmth and rest",
                  "Reassurance from a real person",
                  "Somewhere that feels safe",
                  "Company, even quiet company",
                  "Rest, taken on purpose"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "comfort",
                    "headline": "If the need is comfort, then porn was a poor way of delivering it.",
                    "body": "The real thing is close to hand and almost embarrassingly simple, meaning a warm shower, a blanket, an early night, given to yourself without any contempt attached."
                  },
                  {
                    "key": "safety",
                    "headline": "If the need is safety, then the useful question is a practical one.",
                    "body": "What would let you drop your guard tonight? Whatever answers that is the real soothing, and it will settle something that a screen only postpones."
                  },
                  {
                    "key": "reassure",
                    "headline": "If the need is reassurance, then it wants an actual voice.",
                    "body": "One message to a safe person gives you what the screen can only imitate, and it takes about thirty seconds to send."
                  },
                  {
                    "key": "notalone",
                    "headline": "If the need is company, then Part VI has already made the argument for you.",
                    "body": "Even quiet, low-effort company feeds the thing the screen starves, and it doesn’t have to be a deep conversation to count."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Actual comfort, meaning warmth and rest",
                      "Rest, taken on purpose"
                    ],
                    "body": "Meeting the need directly feels too simple, which is why it gets skipped. Comfort given to yourself on purpose beats comfort smuggled in through a screen."
                  },
                  {
                    "options": [
                      "Reassurance from a real person",
                      "Company, even quiet company"
                    ],
                    "body": "Some needs are shaped like people and only a person can meet them, which is what Part VI is a plan for."
                  },
                  {
                    "options": [
                      "Somewhere that feels safe"
                    ],
                    "body": "Safety can be built, not waited for. A room, a routine, or an hour of the day that is yours. Build it and the reaching quietens down."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "question",
                "headline": "What will you ask at the next urge?",
                "helper": "Asked gently, not as an interrogation.",
                "options": [
                  "\"What does the younger me need?\"",
                  "Name the need and then meet it directly",
                  "Hold the idea loosely and write down what it shows"
                ],
                "result": "At the urge: {pick}"
              },
              {
                "kind": "collect",
                "title": "The question",
                "template": "\"When the urge hits I {pick}. What is underneath is usually {checks}, and a screen was never going to meet that.\"",
                "fallback": "\"I’ll ask the question at the next urge and write down whatever answer comes back.\"",
                "source": "checks",
                "label": "What is usually underneath:",
                "cta": "Save this"
              }
            ],
            "sources": "Inner-child work is a popular therapeutic frame with mixed formal evidence, presented explicitly as one lens, not established science. The practical move, identify the unmet need under the urge, aligns with the coping-motive finding in the evidence base (Part B1(b)) and the self-compassion stance (Day 50).",
            "action": "At an urge, ask \"what does the younger me need right now?\" and log the answer.",
            "reflection": "Next urge, ask what the younger you is really reaching for, comfort, safety, rest, reassurance? Write the honest answer, and one truer way to meet that need."
          },
          {
            "number": 102,
            "heading": "Attachment style shapes the pattern",
            "title": "How closeness feels to you",
            "tag": "contested / plausible",
            "tagColor": "#7F6000",
            "sub": "VIII.B",
            "week": 9,
            "day": 5,
            "order": 101,
            "slug": "how-closeness-feels-to-you-102",
            "pages": [
              {
                "kind": "teach",
                "headline": "How you learned to bond as a child tends to shape how closeness feels to you now.",
                "body": "For some people that early wiring steers them towards the substitute, because it offers closeness with the risk taken out, which is to say a connection that can’t reject you. The framework is debated in its details, so use it as a rough map, not as a diagnosis.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Real intimacy risks rejection and the substitute asks for nothing at all.",
                "body": "For somebody who tends to avoid closeness it offers closeness kept at arm's length, and for somebody who fears being left it offers a connection that can never leave. Once you can see which way you lean, the pull starts to make a good deal more sense.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Under stress, which one fits you?",
                "checks": [
                  {
                    "key": "anxious",
                    "label": "I want closeness and expect to lose it",
                    "asIn": "Craving it while braced for it being withdrawn",
                    "short": "wanting closeness and expecting to lose it"
                  },
                  {
                    "key": "avoidant",
                    "label": "I keep closeness at arm's length",
                    "asIn": "Uneasy with it, and practised at going it alone",
                    "short": "keeping closeness at arm's length"
                  },
                  {
                    "key": "disorganised",
                    "label": "Both at once",
                    "asIn": "Wanting it and fearing it in the same breath",
                    "short": "wanting and fearing it at once"
                  },
                  {
                    "key": "secure",
                    "label": "comfortable with it",
                    "asIn": "Close enough is fine and I can depend on people",
                    "short": "being fairly comfortable with it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "edge",
                "headline": "What is one small step towards steadier?",
                "helper": "Small and real instead of impressive.",
                "options": [
                  "Staying present when I would normally back off",
                  "Being steady without chasing reassurance",
                  "Letting somebody a step closer",
                  "Naming the fear rather than acting on it"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "anxious",
                    "headline": "If you want closeness and expect to lose it, then your work is steadiness.",
                    "body": "That means sitting with the uncertainty of closeness without panicking and without checking constantly, and one steady evening counts as a repetition."
                  },
                  {
                    "key": "avoidant",
                    "headline": "If you keep closeness at arm's length, then your work is staying put.",
                    "body": "Stay present in one moment of closeness you’d normally back away from. The backing away is the pattern, and staying is what changes it."
                  },
                  {
                    "key": "disorganised",
                    "headline": "Wanting and fearing it at the same time asks for gentleness, and probably for company.",
                    "body": "This pattern in particular tends to reward working with a professional instead of working it out alone."
                  },
                  {
                    "key": "secure",
                    "headline": "Even a secure pattern drifts under enough stress, which is worth knowing in advance.",
                    "body": "Learn which way you lean under pressure and spot it early, because the map earns its keep on the worst weeks rather than the ordinary ones."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Staying present when I would normally back off",
                      "Letting somebody a step closer"
                    ],
                    "body": "The staying moves build up your tolerance for the real thing, and every repetition takes away a little of the substitute's safety advantage."
                  },
                  {
                    "options": [
                      "Being steady without chasing reassurance",
                      "Naming the fear rather than acting on it"
                    ],
                    "body": "The steadying moves teach your system that uncertainty can be survived, which is the lesson the early wiring missed."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "securemove",
                "headline": "What is this week's step?",
                "helper": "Small, and done on purpose.",
                "options": [
                  "Stay in one moment I would normally dodge",
                  "One steady evening with no checking",
                  "Let one person a step closer",
                  "Say the fear out loud once"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The map",
                "template": "\"Under stress I lean towards {checks}, and this week's step is {pick}. It’s a tendency, not a fixed fact, and tendencies shift.\"",
                "fallback": "\"I’ll read the four patterns this week and make one small step towards steadier.\"",
                "source": "checks",
                "label": "Which one fits me:",
                "cta": "Save this"
              }
            ],
            "sources": "Attachment theory is a widely used but debated framework (presented as contested and plausible). The link to choosing the low-risk counterfeit over vulnerable intimacy ties to the loneliness and intimacy material in the evidence base (Part B); no statistic is claimed.",
            "action": "Read the four attachment styles, note which fits, and take one action toward secure behaviour.",
            "reflection": "Which attachment pattern fits you under stress, secure, anxious, or avoidant? Name your growth edge (tolerating closeness, or steadiness) and one small move toward secure behaviour this week."
          },
          {
            "number": 103,
            "heading": "The shame-trauma loop",
            "title": "Cutting off the shame",
            "tag": "evidence — shame research",
            "tagColor": "#375623",
            "sub": "VIII.B",
            "week": 9,
            "day": 6,
            "order": 102,
            "slug": "cutting-off-the-shame-103",
            "pages": [
              {
                "kind": "teach",
                "headline": "Pain, behavior, and shame can reinforce each other.",
                "body": "Pain can drive the behavior. The behavior can create shame, and the shame adds more pain. Reducing shame helps interrupt that cycle.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "You may not be able to heal the wound tonight, and that often needs professional help.",
                "body": "What you can do tonight is refuse to pour shame into it after a slip. And that alone slows the loop down. The move is accuracy without contempt. That means the same facts stated plainly with the verdict left off the end.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "After a slip, where does the old story go?",
                "checks": [
                  {
                    "key": "worthless",
                    "label": "Straight to \"see, worthless\"",
                    "asIn": "The shame feeds the exact wound it came from",
                    "short": "\"see, worthless\""
                  },
                  {
                    "key": "oldwound",
                    "label": "Into an old familiar wound",
                    "asIn": "The slip read as fresh evidence for an old verdict",
                    "short": "an old familiar wound"
                  },
                  {
                    "key": "neednumb",
                    "label": "Into a bigger need to numb",
                    "asIn": "The loop's output becomes its next input",
                    "short": "a bigger need to numb"
                  },
                  {
                    "key": "seeloop",
                    "label": "Into a loop I can now see",
                    "asIn": "Seeing the circle is the first step to breaking it",
                    "short": "a loop I can see"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "truerparts",
                "headline": "What does the truer version contain?",
                "helper": "The same facts, with nothing extra piled on top.",
                "options": [
                  "What happened, stated plainly",
                  "The pain that came before it",
                  "No verdict on my character",
                  "What it was trying to treat"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "worthless",
                    "headline": "\"See, worthless\" is the wound talking, not an observation about you.",
                    "body": "An accurate account of somebody medicating pain doesn’t contain a verdict anywhere in it. That means the kind version is also the truer one."
                  },
                  {
                    "key": "oldwound",
                    "headline": "The old verdict was there long before the behaviour was, and it uses the behaviour as evidence.",
                    "body": "Separate the two on paper and each of them can finally get the right treatment, because at the moment one is being used to prove the other."
                  },
                  {
                    "key": "neednumb",
                    "headline": "The growing need is the loop working exactly as designed, which isn’t a sign that you’re getting worse.",
                    "body": "The shame link is the one link you control tonight, so starve it there and the whole loop slows down."
                  },
                  {
                    "key": "seeloop",
                    "headline": "Being able to see the loop gives you leverage over it.",
                    "body": "From now on, every kind and accurate response to a slip is a deliberate act of sabotage against something that has been running unopposed."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "What happened, stated plainly",
                      "No verdict on my character"
                    ],
                    "body": "A plain statement with no verdict on top of it is the entire technique. It’s harder than it sounds and it gets a lot easier once it’s written down."
                  },
                  {
                    "options": [
                      "The pain that came before it",
                      "What it was trying to treat"
                    ],
                    "body": "Including the pain that came first is the part the shame version always deletes, and it’s also the part that points at what to do next."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "practice",
                "headline": "What is the practice afterwards?",
                "helper": "Cutting the fuel line to the loop.",
                "options": [
                  "Catch the story and rewrite it kinder",
                  "Read my truer version out loud",
                  "Take the wound itself to a professional"
                ],
                "result": "Mine: {pick}"
              },
              {
                "kind": "collect",
                "title": "The rewrite",
                "template": "\"The same facts without the contempt. That means {grid}. {pick}. Starved of shame, the loop slows down enough for healing to start.\"",
                "fallback": "\"I’ll rewrite my harshest story this week: the same facts, no verdict, and truer for it.\"",
                "source": "checks",
                "label": "Where the old story goes:",
                "cta": "Save this"
              }
            ],
            "sources": "That shame deepens distress and drives relapse, rather than braking it, is central to the evidence base: moral incongruence (Grubbs et al., 2019) and the shame trap, including its worse-outcomes finding for heavily shame-involved forum members (Prause & Binnie, 2024), Part B3. The shame-wound loop is the deep-level version of that finding; healing the underlying wound is directed to professional care.",
            "action": "Name one shame story you tell yourself, then write a truer, kinder version of the same facts.",
            "reflection": "Write the harshest shame story you tell yourself after a slip. Then write the same facts truthfully but without contempt. The kind version is also the more accurate one."
          }
        ]
      },
      {
        "code": "VIII.C",
        "title": "Getting help",
        "description": "The strongest moves available, taken, not as a last resort.",
        "lessons": [
          {
            "number": 104,
            "heading": "Therapy is a strategy, not a failure",
            "title": "The best-evidenced option",
            "tag": "evidence",
            "tagColor": "#375623",
            "sub": "VIII.C",
            "week": 9,
            "day": 7,
            "order": 103,
            "slug": "the-best-evidenced-option-104",
            "pages": [
              {
                "kind": "teach",
                "headline": "Of everything that has been formally tested for this problem, two talking therapies have the best evidence behind them.",
                "body": "Those are ACT and CBT (Twohig & Crosby, 2010; Crosby & Twohig, 2016). And they beat any app or book or forum, this one included. So choosing therapy means choosing the option with the strongest track record available.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Nobody describes hiring a coach as failing at your sport, and the same logic applies here.",
                "body": "The idea that therapy means defeat feeds on the extra shame around this particular struggle and on nothing else at all. A good therapist brings what self-help can’t, which is a trained outside eye, insight fitted to your case, and a fixed weekly hour that carries you through the flat weeks.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What is your reaction to the idea?",
                "checks": [
                  {
                    "key": "defeat",
                    "label": "It feels like defeat",
                    "asIn": "The white flag, still running",
                    "short": "it feeling like defeat"
                  },
                  {
                    "key": "copers",
                    "label": "It’s for people who can’t cope",
                    "asIn": "A standard I’d never apply to anyone else",
                    "short": "it being for people who cannot cope"
                  },
                  {
                    "key": "smart",
                    "label": "A sensible move I haven’t made",
                    "asIn": "The belief is there and the booking isn’t",
                    "short": "a sensible move I have not made"
                  },
                  {
                    "key": "init",
                    "label": "I’m already in it",
                    "asIn": "The strongest tool is already on the board",
                    "short": "already being in it"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "adds",
                "headline": "What would a professional add?",
                "helper": "The things a programme can’t do for you.",
                "options": [
                  "Insight fitted to my specific case",
                  "A trained eye on my blind spots",
                  "Real accountability",
                  "A fixed weekly point of momentum"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "defeat",
                    "headline": "Run the defeat story through the test you’d apply to anybody else.",
                    "body": "You’d hire a coach for a sport and see a doctor about a broken leg without a second thought. The same logic applies here, with better evidence behind it than either of those."
                  },
                  {
                    "key": "copers",
                    "headline": "\"For people who can’t cope\" is shame doing the talking instead of any kind of observation.",
                    "body": "The trials were run on people exactly like you, and the therapies won, which is the only relevant fact in the argument."
                  },
                  {
                    "key": "smart",
                    "headline": "Believing it’s sensible changes nothing at all until you book something.",
                    "body": "One email this week turns an opinion into an appointment, which is the only step that has ever mattered here."
                  },
                  {
                    "key": "init",
                    "headline": "Use the room properly rather than partially.",
                    "body": "Take the audit from Lesson 100 in with you, because two weeks of real data saves months of digging around in session."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Insight fitted to my specific case",
                      "A trained eye on my blind spots"
                    ],
                    "body": "The blind-spot work is the part no app can reach, since your own patterns are invisible to you because they’re yours."
                  },
                  {
                    "options": [
                      "Real accountability",
                      "A fixed weekly point of momentum"
                    ],
                    "body": "A standing appointment carries you through the weeks when your motivation won’t, because the structure holds whether or not Tuesday feels like it."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "step",
                "headline": "What is the concrete step?",
                "helper": "One of them, this week.",
                "options": [
                  "Look for an ACT or CBT therapist",
                  "Send one enquiry email",
                  "Ask my GP for a referral",
                  "Book the first session"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "The move",
                "template": "\"The option with the best evidence behind it, chosen. That means {pick}.\"",
                "fallback": "\"I’ll take one concrete step towards the best-evidenced help this week.\"",
                "source": "checks",
                "label": "My old reaction:",
                "cta": "Save this"
              }
            ],
            "sources": "ACT and CBT have the best controlled evidence of any approach for problematic pornography use (Twohig & Crosby, 2010; Crosby & Twohig, 2016; evidence base treatment section). The therapy as smart strategy, not failure framing follows from that, and from the app's own honesty about its still-unproven evidence status.",
            "action": "Research one ACT or CBT therapist or digital programme. Take one concrete step toward it.",
            "reflection": "Notice your own reaction to \"get a therapist\", does it feel like a defeat? Write the reframe in your words (\"therapy is the highest-evidence strategy, not a white flag\"), and the one concrete step you'll take toward it."
          },
          {
            "number": 105,
            "heading": "Medication is a legitimate tool for some",
            "title": "A conversation with a doctor",
            "tag": "contested — case-level evidence only",
            "tagColor": "#7F6000",
            "sub": "VIII.C",
            "week": 9,
            "day": 8,
            "order": 104,
            "slug": "a-conversation-with-a-doctor-105",
            "pages": [
              {
                "kind": "teach",
                "headline": "This one needs care in both directions, so here are both of them plainly.",
                "body": "For the behaviour itself the medication evidence is thin, amounting to case reports instead of trials, and there’s no proven pill for it. But where a real underlying condition is driving things, treating that condition, sometimes with medication, is legitimate.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "There’s one firm rule, which is that this conversation belongs with a GP or a psychiatrist and nowhere else.",
                "body": "Never self-prescribed, never bought online, and never run as an experiment on your own. The purpose of the appointment is to get an accurate picture, and whatever the doctor does with that picture comes afterwards.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Where do you stand?",
                "checks": [
                  {
                    "key": "suspect",
                    "label": "I suspect something treatable",
                    "asIn": "The fire may well have a clinical name",
                    "short": "suspecting something treatable"
                  },
                  {
                    "key": "treating",
                    "label": "I’m already treating something",
                    "asIn": "The tool is in a doctor's hands already",
                    "short": "already treating something"
                  },
                  {
                    "key": "wary",
                    "label": "I’m wary of the whole idea",
                    "asIn": "Noted, and a conversation still costs nothing",
                    "short": "being wary of it"
                  },
                  {
                    "key": "notrelevant",
                    "label": "It doesn’t apply to me",
                    "asIn": "No condition suspected, so this is filed",
                    "short": "it not applying"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "questions",
                "headline": "What would you ask a doctor?",
                "helper": "Written down beforehand and carried in.",
                "options": [
                  "\"What might be underneath this?\"",
                  "\"Would treating it help?\"",
                  "\"Medication, therapy, or both?\"",
                  "\"What should we watch for?\""
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "suspect",
                    "headline": "A suspicion is enough to book an appointment with, and you don’t need to be certain first.",
                    "body": "The appointment either rules it out, which is a relief, or finds something worth treating, which is what you needed to know either way."
                  },
                  {
                    "key": "treating",
                    "headline": "This lesson mostly confirms what you’re already doing.",
                    "body": "Keep the supervision, mention the behaviour plainly instead of skirting round it, and let the doctor see the whole picture instead of half of it."
                  },
                  {
                    "key": "wary",
                    "headline": "Being wary is workable and it arguably makes the conversation more useful.",
                    "body": "An accurate picture threatens nobody, and nothing gets prescribed that you haven’t agreed to, so the downside is an hour of your time."
                  },
                  {
                    "key": "notrelevant",
                    "headline": "Filed is fine, and there’s one thing worth keeping from it.",
                    "body": "The rule, in case it’s ever needed, is that this is a doctor's conversation and nobody else's."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "\"What might be underneath this?\"",
                      "\"Would treating it help?\""
                    ],
                    "body": "Those two do the real work, because they aim the appointment at getting the picture right, not at coming away with a prescription."
                  },
                  {
                    "options": [
                      "\"Medication, therapy, or both?\"",
                      "\"What should we watch for?\""
                    ],
                    "body": "Those two keep the conversation grounded, since most honest answers involve therapy alongside anything else, and good doctors like being asked what to watch for."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "prep",
                "headline": "How will you prepare?",
                "helper": "So that you walk in ready.",
                "options": [
                  "Write the questions down",
                  "Book the appointment",
                  "Both, this week",
                  "It does not apply to me"
                ],
                "result": "My preparation: {pick}"
              },
              {
                "kind": "collect",
                "title": "The rule",
                "template": "\"If the ground underneath needs treating, it happens with a doctor and only with a doctor. {pick}.\"",
                "fallback": "\"I’ll write the questions down while calm, so that the appointment, if it’s ever needed, starts ready.\"",
                "source": "checks",
                "label": "Where I stand:",
                "cta": "Save this"
              }
            ],
            "sources": "For the compulsive behaviour itself, medication evidence is thin and case-level (e.g. naltrexone, paroxetine case reports), per the evidence base (Part A5), stated honestly. Treating an underlying condition is a legitimate, doctor-supervised route; the lesson explicitly forbids self-prescription. Labelled contested.",
            "action": "If relevant, write down the questions you'd want to ask a GP or psychiatrist.",
            "reflection": "If you suspect a treatable condition underneath, write the questions you'd want to ask a doctor about it. Preparing them makes the appointment far more useful, and the appointment is the only legitimate route here."
          },
          {
            "number": 106,
            "heading": "When to get help now, not later",
            "title": "Knowing where the exits are",
            "tag": "evidence — safety",
            "tagColor": "#375623",
            "sub": "VIII.C",
            "week": 9,
            "day": 9,
            "order": 105,
            "slug": "knowing-where-the-exits-are-106",
            "pages": [
              {
                "kind": "teach",
                "headline": "Almost everything in this app is built for steady work at your own pace. A few situations are different.",
                "body": "Thoughts of suicide or of harming yourself, a depression that has flattened your ability to function, or escalation towards content that is illegal or could harm somebody. Those need a person now, before any lesson. And they’re signals, not failures of willpower.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The practical part is to find the exits while everything is calm.",
                "body": "You don’t want to be searching for a crisis line for the first time in the middle of a crisis, when searching is exactly the thing you’ll not be able to do. So save the contacts today, while it’s still nothing more than sensible preparation.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What have you got saved at the moment?",
                "checks": [
                  {
                    "key": "linesaved",
                    "label": "A crisis line",
                    "asIn": "Findable in seconds if it ever matters",
                    "short": "a crisis line saved"
                  },
                  {
                    "key": "doctornum",
                    "label": "A doctor or a service",
                    "asIn": "The professional route, one tap away",
                    "short": "a doctor or service saved"
                  },
                  {
                    "key": "trustedperson",
                    "label": "One person I trust",
                    "asIn": "An actual human being who would pick up",
                    "short": "one person saved"
                  },
                  {
                    "key": "nothing",
                    "label": "Nothing yet",
                    "asIn": "Today is the day that gets sorted out",
                    "short": "nothing saved yet"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "contacts",
                "headline": "What are you saving today?",
                "helper": "Reputable, local to you, and yours.",
                "options": [
                  "A crisis line for my country",
                  "A doctor or a mental-health service",
                  "One person I trust"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "linesaved",
                    "headline": "One exit is saved, so finish the set while you’re thinking about it.",
                    "body": "The doctor's route and the named person cover the situations that a crisis line doesn’t, and between the three of them almost everything is covered."
                  },
                  {
                    "key": "doctornum",
                    "headline": "The professional route is half the map, and the other half takes five minutes.",
                    "body": "Add the crisis line and the person you trust, and then the set is complete, not partial."
                  },
                  {
                    "key": "trustedperson",
                    "headline": "Somebody who would pick up is the best exit there is, and it’s worth saying so plainly.",
                    "body": "Back them up with the line and the service, so that no single door has to carry all of it on a bad night."
                  },
                  {
                    "key": "nothing",
                    "headline": "This lesson takes about ten minutes and is worth more than most of the others.",
                    "body": "Three contacts, saved today, while you’re calm. That’s the entire assignment and there’s nothing else in it."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "A crisis line for my country"
                    ],
                    "body": "Reputable lines for your country are easy to find and worth saving today, before there’s any moment that would need them."
                  },
                  {
                    "options": [
                      "A doctor or a mental-health service",
                      "One person I trust"
                    ],
                    "body": "The service and the person cover different moments, since one is for assessment and the other is for the night when something needs saying out loud."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "savenow",
                "headline": "How much are you doing now?",
                "helper": "Preparation, plain and simple.",
                "options": [
                  "Save all three now",
                  "Save one now and the rest this week"
                ],
                "result": "Today: {pick}"
              },
              {
                "kind": "collect",
                "title": "The exits",
                "template": "\"Sorted out while calm. That means {grid}. {pick}. And plainly: if any of this feels close to home right now, that is the cue to reach out, to a crisis line or emergency services or somebody you trust. You should not have to face that part on your own.\"",
                "fallback": "\"I’ll save the three contacts this week, while it’s still just sensible preparation.\"",
                "source": "checks",
                "label": "What I had saved:",
                "cta": "Save this"
              }
            ],
            "sources": "Safety lesson: suicidality, severe depression, and escalation toward illegal or harmful content require immediate professional help, not self-paced app work, consistent with the evidence base's note that users in crisis should be directed to appropriate professional support. Specific hotline numbers are deliberately not invented here; users should save reputable local lines themselves.",
            "action": "Save crisis and professional-help contacts in the app now, before you might need them.",
            "reflection": "While you're calm, save the contacts you'd want in a genuine crisis, a crisis line, a doctor or service, one trusted person. Putting them in place now is an act of care for a future hard moment."
          }
        ]
      }
    ]
  },
  {
    "n": 10,
    "title": "Part IX · Run the campaign",
    "ground": "Ground X · The Triumph",
    "description": "The last part covers the skills that hold everything else together, which are your own combination of tools, the experiments that find them, the record you keep, and the one-page plan that collects every decision you have made in advance.",
    "subs": [
      {
        "code": "IX.A",
        "title": "Your own method",
        "description": "Building a set of tools that fits you, and the experiments that find them.",
        "lessons": [
          {
            "number": 107,
            "heading": "Different methods fit different people",
            "title": "Building your own set of tools",
            "tag": "reframe — core to the app",
            "tagColor": "#4B3F72",
            "sub": "IX.A",
            "week": 10,
            "day": 1,
            "order": 106,
            "slug": "building-your-own-set-of-tools-107",
            "pages": [
              {
                "kind": "teach",
                "headline": "There’s no single cure for this, and the evidence doesn’t favour any one method over the rest.",
                "body": "So anybody selling you the one true way, whether that is cold showers or a single change of mindset or a detox timetable, is overselling what they have got.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "Different drivers need different tools. That’s why the same method works brilliantly for one man and does nothing for the next.",
                "body": "Emptiness needs meaning, a loaded room needs friction, a wound needs healing, and isolation needs people. Your job is to build a set of tools that fits you, and the way you build it’s by testing them.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "Which one-true-way promises have you bought before?",
                "checks": [
                  {
                    "key": "coldshowers",
                    "label": "The cold-shower cure",
                    "asIn": "One strange trick, guaranteed by a stranger",
                    "short": "the cold-shower cure"
                  },
                  {
                    "key": "mindset",
                    "label": "A single change of mindset",
                    "asIn": "One reframe to end them all",
                    "short": "a single change of mindset"
                  },
                  {
                    "key": "timeline",
                    "label": "A fixed reset timetable",
                    "asIn": "Ninety days to a new brain, apparently",
                    "short": "a fixed timetable"
                  },
                  {
                    "key": "routine",
                    "label": "Somebody else's exact routine",
                    "asIn": "What worked for him, transplanted whole",
                    "short": "somebody else's routine"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "driver",
                "headline": "What is most likely driving yours?",
                "helper": "The driver decides which toolbox is yours.",
                "options": [
                  "An emptiness that needs meaning",
                  "A room that is set up badly",
                  "A wound that needs healing",
                  "Missing connection",
                  "Plain grooves of habit"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "coldshowers",
                    "headline": "The trick that transformed a stranger tested one key in one lock, which happened to be his.",
                    "body": "Your lock may well be a different shape, and a null result on his trick tells you nothing at all about you."
                  },
                  {
                    "key": "mindset",
                    "headline": "Reframes are real tools and they fit some locks rather well.",
                    "body": "When one does nothing for you, that is a clean result about fit, not a failure of effort, and clean results are worth having."
                  },
                  {
                    "key": "timeline",
                    "headline": "Fixed timetables sell a certainty that nobody owns.",
                    "body": "Your change runs on your own drivers, not on a calendar, and a calendar has never met you."
                  },
                  {
                    "key": "routine",
                    "headline": "A transplanted routine fails wherever your drivers differ from the drivers of the man it came from.",
                    "body": "Keep whichever parts fit and drop the rest without any guilt about it, because it was never designed for your situation."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "An emptiness that needs meaning",
                      "Missing connection"
                    ],
                    "body": "Parts V and VI are your core curriculum and the mechanical tools are your supporting cast, not the other way round."
                  },
                  {
                    "options": [
                      "A room that is set up badly",
                      "Plain grooves of habit"
                    ],
                    "body": "Parts I and II carry your load. That means staging, friction and replacement doing most of the work with the deeper material in support."
                  },
                  {
                    "options": [
                      "A wound that needs healing"
                    ],
                    "body": "Part VIII is your centre, probably alongside professional help, because tools aimed anywhere else will keep hitting the same ceiling."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "test",
                "headline": "What is this week's test?",
                "helper": "The variety of it is the method.",
                "options": [
                  "Rate every tool I have tried, one to five",
                  "Drop one that has never fitted, without guilt",
                  "Run one winner again, properly"
                ],
                "result": "This week: {pick}"
              },
              {
                "kind": "collect",
                "title": "Your set of tools",
                "template": "\"There’s no single key. My likely driver is {grid}, and this week I’ll {pick}. Every 'that didn’t work for me' narrows the search.\"",
                "fallback": "\"I’ll rate the tools I have tried so far this week and build the set out of the winners.\"",
                "source": "checks",
                "label": "Promises I had bought:",
                "cta": "Save this"
              }
            ],
            "sources": "That the evidence crowns no single method, and that different approaches suit different people, is the core stance of the evidence base (\"Recommendations\": make Tier 1-2 strategies available and let users build their own combination). This is the app's founding design principle.",
            "action": "Rate each method you try 1–5 for \"fits me.\" Build your personal stack from the winners.",
            "reflection": "So far, which one or two methods have most \"fit\" you, and which clearly haven't? Start your personal stack by naming your current top tools."
          },
          {
            "number": 108,
            "heading": "The two-week experiment",
            "title": "Running a two-week experiment",
            "tag": "evidence — short horizons",
            "tagColor": "#375623",
            "sub": "IX.A",
            "week": 10,
            "day": 2,
            "order": 107,
            "slug": "running-a-two-week-experiment-108",
            "pages": [
              {
                "kind": "teach",
                "headline": "\"Never again, for the rest of my life\" is hard to follow. Here’s why.",
                "body": "The benefit feels far away. The goal is all-or-nothing, so one slip can make it feel broken. That often adds shame instead of helping you learn.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "An experiment fixes each of those problems without you having to try any harder.",
                "body": "Two weeks feels manageable. Treat it as a test: keep what helps and change what does not. Either result teaches you something useful.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What have your vows been like?",
                "checks": [
                  {
                    "key": "forever",
                    "label": "Shaped like forever",
                    "asIn": "The benefit feels too far away",
                    "short": "shaped like forever"
                  },
                  {
                    "key": "shattered",
                    "label": "Broken by one slip",
                    "asIn": "All or nothing, and then nothing",
                    "short": "broken by one slip"
                  },
                  {
                    "key": "dread",
                    "label": "Heavy with dread",
                    "asIn": "\"Never again\" hanging over every evening",
                    "short": "heavy with dread"
                  },
                  {
                    "key": "expshaped",
                    "label": "Already shaped like experiments",
                    "asIn": "I half think about it this way already",
                    "short": "already shaped like experiments"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "candidates",
                "headline": "What could the next experiment test?",
                "helper": "One method, two weeks, and then a review.",
                "options": [
                  "Riding urges out, properly",
                  "The boredom menu",
                  "Bedtime and the room set up",
                  "One daily fixed point",
                  "The values scoreboard"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "forever",
                    "headline": "A lifetime goal can feel irrelevant on a difficult Tuesday night.",
                    "body": "A two-week goal is easier to picture and act on."
                  },
                  {
                    "key": "shattered",
                    "headline": "An experiment survives a slip by definition, not by luck.",
                    "body": "The data gets richer, and nothing shatters, because nothing was brittle in the first place."
                  },
                  {
                    "key": "dread",
                    "headline": "Being temporary removes the dread that was making it impossible to start.",
                    "body": "It’s two weeks and then it’s over, and that is the design, not a concession."
                  },
                  {
                    "key": "expshaped",
                    "headline": "Run the next one cleanly rather than loosely.",
                    "body": "One method, dates written down, and a review at the end. That discipline is what turns dabbling into a set of tools you can trust."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "Riding urges out, properly",
                      "The values scoreboard"
                    ],
                    "body": "Two committed weeks of a skill teaches you more than two months of half-trying it, because half-trying never gives a clean result either way."
                  },
                  {
                    "options": [
                      "The boredom menu",
                      "Bedtime and the room set up",
                      "One daily fixed point"
                    ],
                    "body": "The mechanical experiments give the fastest and clearest data, since the week either got easier or it didn’t and you’ll know which."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "experiment",
                "headline": "Which experiment?",
                "helper": "Starting this week.",
                "options": [
                  "Riding urges out",
                  "The boredom menu",
                  "Bedtime and the room",
                  "A daily fixed point",
                  "The values scoreboard"
                ],
                "result": "Two weeks of {pick}"
              },
              {
                "kind": "collect",
                "title": "The experiment",
                "template": "\"Two weeks, one method, which is {pick}. And I have decided in advance that either result counts as a win.\"",
                "fallback": "\"I’ll pick the first two-week experiment this week and put dates on it.\"",
                "source": "checks",
                "label": "My old vows:",
                "cta": "Save this"
              }
            ],
            "sources": "The short-horizon principle (distant goals are discounted; short repeated targets hold motivation better) follows from present bias (Day 3/4, general behavioural knowledge). The experiment frame also operationalises the \"build your own stack\" stance from the evidence base's recommendations.",
            "action": "Pick one method, commit to it for two weeks only, then review what it did.",
            "reflection": "Choose your first (or next) two-week experiment: which single method, starting when? Decide in advance that either result (works or doesn't) counts as a useful win."
          }
        ]
      },
      {
        "code": "IX.B",
        "title": "Your record",
        "description": "The map you draw of yourself, and the page that holds every decision made in advance.",
        "lessons": [
          {
            "number": 109,
            "heading": "The \"why it works for you\" journal",
            "title": "Keeping your own record",
            "tag": "plausible",
            "tagColor": "#0B3C49",
            "sub": "IX.B",
            "week": 10,
            "day": 3,
            "order": 108,
            "slug": "keeping-your-own-record-109",
            "pages": [
              {
                "kind": "teach",
                "headline": "The information that matters most is which methods work for you, and why they do.",
                "body": "Nobody can hand you that, because it only exists inside your own experience and only your own attention can get it out. That question is what turns a generic programme into your programme.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "The practice is light, which is one line a week.",
                "body": "What worked, what didn’t, and what you’ll try next. It costs you a minute, and over a few months it adds up to a precise map of your own triggers and tools and patterns. That map outlasts the programme by a long way.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What do you know about your own pattern?",
                "checks": [
                  {
                    "key": "whichfit",
                    "label": "Which tools fit me",
                    "asIn": "The winners are already named",
                    "short": "which tools fit me"
                  },
                  {
                    "key": "whichnot",
                    "label": "Which ones do nothing",
                    "asIn": "The clean negative results are in",
                    "short": "which ones do nothing"
                  },
                  {
                    "key": "realtriggers",
                    "label": "My real triggers",
                    "asIn": "The dangerous ground is drawn on the map",
                    "short": "my real triggers"
                  },
                  {
                    "key": "guesses",
                    "label": "Mostly guesses",
                    "asIn": "I haven’t really started working it out",
                    "short": "mostly guesses"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "lineparts",
                "headline": "The three parts of the weekly line",
                "helper": "A minute, most weeks.",
                "options": [
                  "What worked",
                  "What did not",
                  "What I will try next"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "whichfit",
                    "headline": "Knowing which tools fit you is half the map already drawn.",
                    "body": "The weekly line keeps it current, because tools drift and what fits changes as your life does, and a map from six months ago is a map of somebody else."
                  },
                  {
                    "key": "whichnot",
                    "headline": "A clean negative result is worth keeping instead of forgetting.",
                    "body": "Every dud you have written down is effort you’ll never waste a second time, which over a year is a great deal of effort saved."
                  },
                  {
                    "key": "realtriggers",
                    "headline": "The ground is drawn, so keep surveying it instead of assuming it’s finished.",
                    "body": "Triggers age and new ones arrive, and the journal tends to notice before you do."
                  },
                  {
                    "key": "guesses",
                    "headline": "Write the first line tonight and start converting guesses into knowledge.",
                    "body": "Three short clauses, one minute, and the generic programme starts becoming yours from that point onwards."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "What worked",
                      "What did not"
                    ],
                    "body": "Those two do the real work between them, because over a few months they settle on your own set of tools without you having to decide anything."
                  },
                  {
                    "options": [
                      "What I will try next"
                    ],
                    "body": "The third clause points the journal forwards. That means it steers as well as records, and steering is what makes it worth keeping."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "slot",
                "headline": "When will you write it?",
                "helper": "Standing, small, and kept.",
                "options": [
                  "Sunday evening",
                  "Friday, at the end of the week",
                  "After my weekly review"
                ],
                "result": "My slot: {pick}"
              },
              {
                "kind": "collect",
                "title": "The record",
                "template": "\"One line a week, which is what worked, what didn’t and what is next, written on {pick}. That’s the map that outlasts the programme.\"",
                "fallback": "\"I’ll write the first line this week and make the slot a standing one.\"",
                "source": "checks",
                "label": "What I know so far:",
                "cta": "Save this"
              }
            ],
            "sources": "Metacognition and self-monitoring/journalling are general behaviour-change tools (self-monitoring is Tier 1 in the evidence base). Building a personal \"stack\" of what works for you implements the base's core recommendation and the app's founding principle (Day 84). Kept at \"plausible.\"",
            "action": "Each week, write one line: what worked, what didn't, what's next.",
            "reflection": "Start now: in one line each, what's worked for you so far, what hasn't, and what you'll try next. Then make this a standing weekly entry. It's the map that outlasts the programme."
          },
          {
            "number": 110,
            "heading": "Your written relapse-prevention plan",
            "title": "The one-page plan",
            "tag": "evidence — relapse prevention",
            "tagColor": "#375623",
            "sub": "IX.B",
            "week": 10,
            "day": 4,
            "order": 109,
            "slug": "the-one-page-plan-110",
            "pages": [
              {
                "kind": "teach",
                "headline": "Do not expect yourself to build a plan during a strong urge.",
                "body": "Write the plan earlier, while you can think clearly. During the urge, follow the steps you already chose.",
                "cta": "Next"
              },
              {
                "kind": "teach",
                "headline": "What you’re doing is the practical core of the most established framework in the field.",
                "body": "You identify your high-risk situations in advance and write out what you’ll do in each of them. A plan on paper sits outside your head, where panic can’t delete it. And it needs to be one page and short enough to use under pressure.",
                "cta": "Next"
              },
              {
                "kind": "ask",
                "headline": "What happens in your head on your worst night?",
                "checks": [
                  {
                    "key": "blank",
                    "label": "It goes blank",
                    "asIn": "Every tool learned and none of them findable",
                    "short": "going blank"
                  },
                  {
                    "key": "noassembly",
                    "label": "I can’t put a strategy together",
                    "asIn": "The pieces are there with no order to them",
                    "short": "not being able to assemble anything"
                  },
                  {
                    "key": "forgets",
                    "label": "I forget the tools exist",
                    "asIn": "The panic deletes the whole toolkit",
                    "short": "forgetting the tools exist"
                  },
                  {
                    "key": "holds",
                    "label": "It mostly holds",
                    "asIn": "The page is half written already",
                    "short": "mostly holding"
                  }
                ]
              },
              {
                "kind": "grid",
                "key": "sections",
                "headline": "What goes on the page?",
                "helper": "One page, containing all of it.",
                "options": [
                  "My high-risk situations",
                  "My first dominoes",
                  "What I will do in each case",
                  "My people, including the saved contacts",
                  "My reason, at the top"
                ],
                "cta": "Next"
              },
              {
                "kind": "branch",
                "title": "Next",
                "fromChecks": [
                  {
                    "key": "blank",
                    "headline": "Going blank is why the page exists rather than being a sign that you’re doing badly.",
                    "body": "A flooded brain can’t write a plan and it can follow one perfectly well, so on paper the toolkit survives the panic intact."
                  },
                  {
                    "key": "noassembly",
                    "headline": "Do the assembling now, while calm, once and properly.",
                    "body": "Twenty minutes and one page gives your worst night an order that it could never have built for itself in the moment."
                  },
                  {
                    "key": "forgets",
                    "headline": "Paper doesn’t forget anything, which is the whole advantage it has over you at two in the morning.",
                    "body": "The plan lives where the dangerous hour happens and meets you there, without needing to be remembered first."
                  },
                  {
                    "key": "holds",
                    "headline": "Finish the half-written page and put it somewhere.",
                    "body": "Rehearse it twice and it stops being information and becomes a route your feet already know, which is what you want when your head isn’t helping."
                  }
                ],
                "fromGrid": [
                  {
                    "options": [
                      "My high-risk situations",
                      "My first dominoes"
                    ],
                    "body": "Those two are the ground you’re working with, so name them specifically, meaning the hours and the rooms and the particular \"justs\" you use."
                  },
                  {
                    "options": [
                      "What I will do in each case",
                      "My people, including the saved contacts"
                    ],
                    "body": "Those two are the route through, so keep them small enough for your worst night and named down to who gets the message."
                  },
                  {
                    "options": [
                      "My reason, at the top"
                    ],
                    "body": "The reason goes at the top because everything else on the page is in service of it, and one sentence in your own words is enough."
                  }
                ]
              },
              {
                "kind": "pick",
                "key": "planplace",
                "headline": "Where does the page live?",
                "helper": "Put it where you will see it during a difficult moment.",
                "options": [
                  "On the fridge",
                  "In my wallet",
                  "Pinned in this app",
                  "By the bed"
                ],
                "result": "It lives: {pick}"
              },
              {
                "kind": "collect",
                "title": "The plan",
                "template": "\"One page, written while calm, containing {grid}, and kept {pick}, which is where the dangerous hour happens.\"",
                "fallback": "\"I’ll spend twenty calm minutes this week writing the page, and put it somewhere I’ll meet it.\"",
                "source": "checks",
                "label": "My worst-night head:",
                "cta": "Save this"
              }
            ],
            "sources": "Relapse-prevention planning, identifying high-risk situations in advance and rehearsing specific coping responses, is the practical core of Marlatt and Gordon's relapse-prevention model (external, well-established). It consolidates tools whose own bases are noted in their own lessons (if-then plans, HALT, stimulus control, accountability, crisis contacts). Pre-rehearsed coping is more likely to be used than improvised coping.",
            "action": "Write a one-page relapse-prevention plan: your top high-risk situations, your if-then responses, your HALT and recovery moves, your people to contact, and your why at the top. Keep it where you'll see it.",
            "reflection": "Draft your plan now, then name the one place you'll keep it so that flooded-you meets it at the dangerous hour."
          }
        ]
      }
    ]
  }
];
