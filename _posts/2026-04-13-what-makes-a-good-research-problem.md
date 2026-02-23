---
layout: post
title: "What Makes a Good Research Problem?"
description: "Thoughts on how to choose research problems that are both interesting and tractable, from someone still learning to do this well."
date: 2026-04-13
author: "Abd'gafar Tunde Tiamiyu"
tags: [Academia, Research, Reflections]
math: false
---

This is a question I think about often, especially now that I am a postdoc and the problem selection is entirely up to me. During my PhD, my advisor suggested the initial direction, and the problem evolved organically from there. Now, choosing what to work on next is one of my most consequential decisions, and I find it surprisingly difficult to do well.

What follows is not a definitive answer. It is a collection of observations from my own experience and from watching how researchers I admire select their problems. I offer them as starting points, not conclusions.


## The Standard Criteria

Most discussions of problem selection mention three criteria: a good problem should be important, tractable, and original. These are correct but not very helpful, because they do not tell you how to evaluate any of them in practice.

**Importance** is the hardest to judge. Important to whom? By what measure? A problem can be important within a narrow subfield (resolving a specific open question) or broadly impactful (enabling a new class of applications). The two do not always overlap. Some of the most technically deep results in inverse problems theory have almost no practical consequence, and some of the most practically useful techniques lack deep theoretical foundations. Both kinds of work have value, but knowing which kind you are pursuing helps you evaluate progress and identify the right audience.

**Tractability** is easier to assess but still tricky. A problem that seems intractable might become tractable with the right tool or the right reformulation. A problem that seems easy might reveal hidden complexity once you commit to it. The best I can offer is that tractability often reveals itself through the quality of the initial ideas. If, after a week of thinking, you have a concrete approach and can identify the main obstacles, the problem is probably tractable. If you cannot even formulate a clear attack, it may not be time yet.

**Originality** is the most overrated of the three, in my view. Most good research builds incrementally on existing work. Genuine novelty usually comes from combining known ideas in a way nobody has tried, or from applying tools from one area to problems in another. The obsession with novelty for its own sake can lead researchers to work on contrived problems that nobody else cares about, which is worse than working on a well-trodden problem if you have something genuinely new to say about it.


## What I Actually Look For

Beyond the standard criteria, I have developed some informal tests for whether a problem is worth my time.

**Does it teach me something?** The problems I have benefited from most were the ones that forced me to learn a new technique or understand a new area. My work on learned regularizers in Graz required me to understand generative models and the structure of training data in a way that my classical inverse problems training had not covered. The investment was significant, but it expanded my capabilities in a way that pure optimization or pure PDE theory would not have.

**Is there a gap between theory and practice?** Many of the most fertile research areas sit where theoretical understanding lags behind practical success (or vice versa). PINNs are a good example: they work surprisingly well for certain problems, but the theory explaining why is incomplete. Working in these gaps is productive because you can contribute either by explaining what is observed or by predicting something new.

**Can I explain why it matters in two sentences?** If I cannot articulate, briefly and without jargon, why a problem is interesting, I probably do not understand it well enough to work on it effectively. This test is also practical: grant applications, seminar introductions, and conversations with colleagues all require a clear pitch.

**Does it connect to other things I work on?** Research is cumulative. A problem that leverages my existing expertise in regularization theory and EIT is one where I have a genuine advantage over someone starting from scratch. Problems that are completely disconnected from my background require a larger upfront investment and carry more risk.


## Patterns I Have Observed

Looking at the problems that have produced my most satisfying work, a few patterns emerge.

**The best problems started with a concrete question.** Not "study regularization for EIT" (too broad) but "can total variation regularization recover inclusions from partial data when only a subset of the boundary is accessible?" Concrete questions have testable implications. You can run experiments, compute examples, and know whether you are making progress.

**Constraints helped.** Having access to only partial boundary data in EIT was not a limitation I chose; it was a feature of the application I was working on. But the constraint shaped the research in productive ways, ruling out approaches that only work with full data and pointing me toward methods that were specifically adapted to the incomplete-information setting.

**Collaboration expanded the scope.** Some of my best ideas came from conversations with people in adjacent fields. A comment from an imaging scientist about how noise manifests differently in EIT than in CT led me to rethink my noise model. A discussion with a machine learning researcher about distribution shift changed how I thought about the generalization of learned regularizers. These connections do not happen if you work in isolation.


## Common Traps

Some patterns to avoid, based on my own mistakes and those I have observed in others.

**Chasing trends.** Working on a topic because it is hot rather than because it interests you is a recipe for mediocre work. The people who do the best work in any trendy area are typically those who were working on it before it became fashionable, or those who bring a genuinely different perspective. If you are jumping on a bandwagon because everyone else is, you are competing on their terms, not yours.

**Premature generalization.** Trying to solve the most general version of a problem before understanding specific cases is almost always a mistake. Start with a concrete, simple case. Understand it thoroughly. Then ask which aspects of your analysis depend on the specifics and which are more general. The path from specific to general is usually more productive than the reverse.

**Avoiding negative results.** Not all problems lead to positive outcomes. Sometimes the answer is "this approach does not work, and here is why." These results are valuable when the reasoning is clear and the implications are understood, but they are harder to publish and less satisfying to arrive at. I have learned to accept negative results earlier rather than spending months trying to force a positive conclusion from a dead end.

**Undervaluing simple results.** Some of the most useful results in mathematics are simple once stated. A clean observation, a short proof of something that was previously only known via a complicated argument, a worked example that illuminates a general theory: these contributions are sometimes dismissed as minor, but they serve the community well.


## The Honest Part

Problem selection is, at some level, a bet on the future. You are investing months or years of effort based on incomplete information about what will work, what will be interesting, and what the community will value. The best you can do is make an informed guess and be willing to adjust when the evidence shifts.

I have abandoned problems that I invested significant time in because they turned out to be less interesting than I initially thought. I have also continued working on problems past the point of diminishing returns because I was too attached to let go. Both are mistakes, and I suspect both are unavoidable parts of the process.

The researchers I most admire have a portfolio approach: one or two safe projects with clear outcomes, and one high-risk project that might not work but would be significant if it did. This balance keeps the publications flowing while leaving room for serendipity.

Ultimately, I think the best research problems are the ones you find genuinely interesting rather than strategically optimal. Genuine interest sustains the effort through the inevitable difficult phases. Strategy helps you publish, but interest is what keeps you thinking about the problem in the shower, during your commute, and in the moments before falling asleep. That sustained engagement is, in my experience, the single strongest predictor of doing work that matters.
