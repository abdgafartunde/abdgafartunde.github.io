---
layout: post
title: "On the Quiet Erosion of Deep Thinking"
description: "Reflections on AI tools in research, the disappearing art of struggle, and a question worth asking."
date: 2026-02-06
author: "Abd'gafar Tunde Tiamiyu"
tags: [AI, Academia, Reflections]
math: true
---

Something has been shifting in how we do research, and it troubles me more each semester.

I watch colleagues across departments reach for large language models as reflexively as they reach for coffee. PhD students, postdocs, seasoned professors — the adoption is nearly universal. The productivity gains are real. But I keep noticing something underneath the enthusiasm that unsettles me.

For generations, deep thinking was slow. Writing well demanded years of practice. Rigorous work required patience that not everyone could sustain. Then generative AI arrived and those constraints dissolved almost overnight.

Literature reviews that once took weeks now take minutes. A stuck proof can receive hints on demand. Grant proposals emerge in polished prose from rough notes. By every efficiency metric, we have won.

And yet.

## What I Am Actually Observing

A promising researcher I know recently wrote a paper on regularization for severely ill-posed inverse problems. The numerics were beautiful. The convergence plots looked excellent. But when I asked him to walk me through why his choice of regularization parameter actually stabilizes the reconstruction, to explain the interplay between the noise level, the smoothness assumptions, and the ill-posedness degree, he could not do it without his notes. He had tuned hyperparameters until the results looked right without ever building the intuition for why they were right.

Another colleague published impressive work on nonlinear PDEs. The existence and uniqueness proofs were there, typeset perfectly. But during a seminar, someone asked about the compactness argument at the heart of the proof. He struggled to reproduce the reasoning on the board. The proof had been assembled with AI assistance, refined into publishable form, yet the deep structure of the argument had never truly entered his understanding.

These are not minor gaps. In inverse problems, understanding the source of instability is everything. In PDE theory, the compactness argument is often where the real insight lives. When we skip the struggle of building these intuitions ourselves, we end up with results we cannot fully defend, extend, or teach.

Reviewers are beginning to notice patterns too. Manuscripts arrive with impeccable prose and correct mathematics, yet something essential is missing. The writing is *too* smooth. The arguments feel strangely generic, as though every rough edge that once signaled genuine thought has been polished away. Technical terms are used correctly but without the confidence that comes from hard-won understanding.

I keep returning to a question I cannot shake: did we augment human intelligence, or did we simply outsource the struggle? And was that struggle perhaps the thing that made us capable thinkers in the first place?

## The Gymnasium of the Mind

Consider how any of us actually learned to think mathematically. Not the mechanics of differentiation or matrix multiplication, but the deeper skills: knowing when a problem is well-posed, sensing when an estimate is sharp, recognizing the shape of an argument before the details are filled in.

These abilities came from repetition and failure. Staring at a blank page for hours. Reading the same paragraph eight times, hunting for the flaw in our reasoning. Copying proofs by hand because nothing else made them stick. Writing a terrible first draft, confronting how little we understood, then slowly beating that draft into something coherent over days and weeks.

I remember working through stability estimates for my first inverse problem. The algebra was manageable, but understanding *why* the condition number exploded in certain regimes took me months. I worked through dozens of toy examples, made wrong guesses about the spectral behaviour, stared at plots that contradicted my intuition, and slowly built a mental picture of how information propagates — and degrades — through ill-conditioned systems. No shortcut would have given me that understanding. The months of confusion were not an obstacle to learning. They *were* the learning.

None of that was pleasant. But it was the gymnasium where intellectual muscle was built.

Now there is little incentive to endure any of it. Why face the blank page when an outline appears on request? Why wrestle with exposition when the machine writes more fluent English than most of us ever will? Why spend a week understanding a stability argument when you can generate plausible-looking analysis in an afternoon?

The pattern is familiar: mental faculties atrophy when they go unused. We invented automobiles and gradually forgot how to walk long distances. Air conditioning made us less tolerant of heat. GPS eroded our sense of direction. I suspect we are doing something similar — quietly, incrementally — with sustained analytical thought.

## The Particular Danger in Computational Mathematics

Our field is especially vulnerable to this erosion, I think.

Computational and applied mathematics lives at the intersection of theory and practice. We write code, run simulations, produce figures. There are many places where AI assistance feels natural: debugging code, generating boilerplate, formatting results. The temptation to let the tools handle more and more of the cognitive work is strong.

But the core of our discipline is understanding *why* algorithms work, *when* they fail, and *how* to fix them when they do. This understanding cannot be generated; it must be constructed through patient engagement with the mathematics.

When a Newton iteration fails to converge, you need to understand the spectral properties of your Jacobian. When a regularization method produces artifacts, you need intuition about the null space of your forward operator. When a finite element solution oscillates, you need to reason about stability and the inf-sup condition.

An AI can suggest fixes. It can propose alternative formulations. But if you lack the underlying understanding, you cannot distinguish between a correct suggestion and a plausible-sounding wrong one. You become dependent on the tool in a way that is invisible to you until the moment it fails — during a seminar question, a referee's challenge, or an experiment that refuses to match prediction.

I have watched students accept AI-generated explanations that were subtly wrong because they lacked the foundation to spot the error. The explanation was fluent. The notation was consistent. But there was a sign error buried in line three, a missing hypothesis that invalidated the main estimate, an unjustified exchange of limits that happened to produce the right answer for the wrong reason. They could not see any of it, and they did not know to look.

## Those Who Are Getting It Right

The sharpest young researchers I know have developed a discipline. They do the difficult cognitive work first, on paper, without autocomplete, without "help me structure this." Only after genuinely wrestling with a problem do they reach for AI tools.

One colleague told me she uses a simple rule: before asking for help with any mathematical argument, she must be able to state precisely where she is stuck and what she has already tried. This forces her to engage deeply before outsourcing. Often, the act of formulating the question clearly leads her to the answer.

Another friend described it like rock climbing. The safety bolts exist for protection, but you do not clip in unless truly necessary. The goal is to free-climb whenever possible, because that is what maintains strength and skill.

These researchers turn out to be the most effective AI users precisely because they understand where the tools fail. They recognize when a model is hallucinating. They know how to steer it toward substance rather than mere plausibility. They can verify what the machine produces because they have built the intuition to do so.

There is a lesson here. The goal is not to reject these tools but to use them from a position of strength rather than dependence.

## What We Risk Losing

Let me be concrete about what I fear we are losing.

**The ability to be stuck productively.** Some of the best ideas in mathematics come from sitting with a problem that seems impossible, letting it percolate, approaching it from different angles over weeks or months. If we reach for AI assistance at the first sign of difficulty, we never enter that generative state of productive confusion.

**The development of taste.** Experienced mathematicians have a sense for which problems are interesting, which approaches are promising, which results are deep versus merely technically impressive. This taste is developed through years of engaging with mathematics at a deep level. I am not sure it can be developed by those who consistently take shortcuts.

**The capacity for original thought.** If every literature review is AI-generated, every proof is AI-assisted, every paper is AI-polished, then we become very good at combining and refining existing ideas. But true originality requires the ability to think thoughts that have not been thought before. That ability, I suspect, is cultivated precisely in those difficult hours of unassisted struggle.

**The ability to teach.** Those who have not truly understood the material themselves cannot effectively guide others through it. They can point to resources, but they cannot illuminate. The next generation learns from our understanding, not from our outputs.

## An Honest Uncertainty

I want to be clear: I am not opposed to these tools. I use them regularly, and they have made certain aspects of my work more efficient. I am faster at writing code, at formatting documents, at searching literature.

But efficiency was never the hard part of mathematics. The hard part was sitting with a problem long enough for something genuinely new to emerge. That required a kind of patience and discomfort that AI now allows us to bypass entirely.

I also recognize that I may be wrong. Perhaps the next generation will develop new forms of deep thinking that I cannot anticipate. Perhaps the time saved on mechanical tasks will be redirected to more profound contemplation. Perhaps I am simply an older researcher uncomfortable with change, mistaking novelty for decline.

But I do not think so. What I observe feels real and concerning.

## The Question of Incentives

There is also a structural problem that worries me.

Academia rewards output: papers published, grants won, citations accumulated. If AI tools allow researchers to produce more output with less deep engagement, then the incentives push toward shallow, high-volume work. The researchers who insist on struggling through problems the hard way may find themselves at a competitive disadvantage, at least in the short term.

How do we create incentives for depth when the tools optimize for breadth?

I do not have an answer, but I think this is a question institutions will need to grapple with. Perhaps we need new forms of evaluation that test understanding rather than just output. Perhaps we need a cultural shift in how we value different kinds of contribution. Perhaps individual researchers simply need to accept that choosing depth may come with professional costs.

## A Question Worth Sitting With

Can we cultivate deep thinkers in a world where shallow thinking achieves eighty percent of the results with a fraction of the effort?

I genuinely do not know.

What I do know is that the researchers I most admire, the ones who have made lasting contributions to our field, are uniformly people who have spent years in deep engagement with hard problems. They built their understanding the slow way, through struggle and failure and eventual insight. That process shaped how they think.

If we are designing a system that allows the next generation to skip that process, we should at least be honest about what we might be giving up.

This is a question that stays with me — late at night, when the tools are closed and I sit alone with a notebook and a pen, working through a calculation by hand because I want to make sure I still can.

I do not have the answer. But I believe the question is worth sitting with, worth taking seriously, worth letting the discomfort linger.

The hard problems have always been solved by people who were willing to think longer than felt comfortable. If we are building a world that makes that willingness unnecessary, we should at least be clear-eyed about the trade.
