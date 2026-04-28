---
layout: post
title: "On Working Across Disciplines"
description: "Reflections on what it actually takes to collaborate productively with people who think differently, from someone still figuring it out."
date: 2026-06-08
author: "Abd'gafar Tunde Tiamiyu"
tags: [Academia, Collaboration, Reflections]
math: false
---

I spent the first year of my PhD largely inside mathematics. The problems were posed mathematically, the seminars were mathematical, and my sense of progress was measured in theorems. Then, about eighteen months in, my advisor suggested I attend a workshop where engineers and clinicians would be discussing medical imaging. I went mostly out of obligation. I left confused and, for the first time, genuinely excited about my research.

That experience started a slow reorientation that I am still in the middle of. Most of what I work on now sits at the boundary between mathematics, electrical engineering, and medical imaging. Some of my most useful collaborations have been with people whose technical training is entirely different from mine. And some of my biggest professional frustrations have come from the friction that interdisciplinary work almost inevitably produces.

This post is an attempt to think honestly about what working across disciplines actually involves. Not the promotional version, where collaboration sounds effortless and everybody learns from each other seamlessly. The version where you regularly feel like you are speaking different languages and have to decide whether the mutual incomprehension is a temporary obstacle or a signal to stop.


## The Language Problem

Every discipline has a vocabulary that its practitioners use with precision. Words that seem ordinary carry technical weight. In mathematics, "regular," "bounded," "compact," "dense," and "well-posed" have exact meanings that are invisible to outsiders. In medicine, clinical terms carry connotations accumulated over decades of practice. In engineering, "robust," "stable," and "reliable" describe quantitative properties that differ from their mathematical cousins.

Early in collaborations, I have learned to expect a lengthy calibration phase where you discover which shared words mean different things and which different words mean the same thing. A clinician might use "artifact" to describe any feature of an image that does not correspond to tissue, including numerical errors, noise, and algorithmic distortions. A mathematician would distinguish these carefully. A signal processing engineer might use "regularization" to mean any smoothing operation, where a mathematical analyst means something much more specific.

These are not just semantic differences. They reflect different conceptual structures, and misaligned concepts can silently corrupt a collaboration for months before anyone notices. I have been in situations where my collaborators and I believed we agreed on the problem formulation only to discover, when looking at results, that we had been solving subtly different problems.

The solution I have found is to invest in explicit, even pedantic, alignment early. Write down what you mean. Ask what your collaborator means by the same term. Draw pictures if the mathematics feels inaccessible. This is time-consuming and occasionally awkward, but it saves much more time than it costs.


## The Incentive Structure Problem

Academic disciplines do not just have different languages. They have different reward structures, and these structures are often in tension.

Mathematicians are evaluated primarily on theoretical novelty: new theorems, new frameworks, generality. Engineers are evaluated on performance: does the system work, how well, in what conditions? Clinicians are evaluated on patient outcomes and translational impact. Machine learning researchers, increasingly, are evaluated on benchmark performance, which may or may not correlate with genuine scientific progress.

A collaboration that advances one of these agendas may simultaneously feel like a distraction from another. When I contribute a mathematical analysis of why a reconstruction algorithm is stable, this is, from my perspective, the valuable output. From my engineering collaborator's perspective, the valuable output is a method that works on real patient data, and the analysis is supporting material. We are both right. But we are answering different versions of the question, and the reviewers of our respective journals will evaluate our contributions by different standards.

This is manageable when both parties are aware of it. It becomes destructive when it is invisible, and one party feels that the other is not contributing seriously to the shared project.

The most functional interdisciplinary collaborations I have observed are the ones where all parties understand each other's incentives and design the collaboration so that each party genuinely benefits. Not a favour exchange, but a structure where the work itself is interesting and valuable from multiple perspectives simultaneously. These collaborations are harder to set up but dramatically more productive.


## What Mathematics Brings to an Applied Problem

When mathematicians join an applied collaboration, the contribution is not always obvious to the other parties. Let me try to articulate what I think it actually is.

The first contribution is *formulation*. Turning a vague applied problem into a precise mathematical question is often the hardest step. It requires deciding what counts as a solution, what the relevant parameters are, what assumptions are being made, and what approximations are permissible. This work is largely invisible in the final product, but it determines what the final product can and cannot say.

The second contribution is *understanding*. Mathematical analysis can explain why a numerical method works, identify the conditions under which it will fail, and predict its behaviour in novel settings. This is valuable even when the method is already working: practitioners who understand why their tools work are less likely to misapply them and more likely to improve them when the standard approaches fail.

The third contribution is *guarantee*. Engineering intuition, however refined, can sometimes lead you astray. A method that works on twenty test cases might fail on the twenty-first. A mathematical guarantee, even a weak one, establishes something definite about performance across the full range of inputs. In safety-critical applications (medical imaging, structural testing, geophysical monitoring), the gap between "this works well in practice" and "we can bound the error in this class of cases" is consequential.

None of these contributions is valued equally in every context. A clinical collaborator may care far more about the twenty working cases than the theoretical guarantee. That is a reasonable position, and it means the mathematical contribution needs to be framed accordingly.


## What Applied Problems Bring to Mathematics

The traffic flows in both directions. Some of the most interesting mathematical problems I have encountered came directly from the demands of the application.

EIT is mathematically rich partly because it is genuinely hard as an applied problem. The data acquisition constraints (a fixed number of electrodes, limited measurement precision, safety limits on current) impose structure that a purely mathematical treatment would not have thought to impose. The insistence on real-time imaging (seconds, not hours) rules out any algorithm that does not scale. The requirement to work with patient anatomy, which violates most of the smooth, nice-boundary assumptions you would make in a textbook, forces you to think about robustness in ways that pure theory does not demand.

I have been led to mathematical questions I would not have asked otherwise by trying to understand what was actually happening in my numerical experiments. Why does the reconstruction quality degrade much faster than the regularization theory predicts when the number of electrodes drops below a threshold? That question came from data, not from a proof strategy. The answer involved a deeper look at the conditioning of the measurement operator that turned out to be interesting in its own right.

The best applied problems have this property: they generate mathematical questions that are hard, deep, and important even when stripped of the application context. When that is true, the collaboration is genuinely productive for both parties.


## On Patience and Tolerance for Ambiguity

Interdisciplinary work is slower than single-discipline work. There is no avoiding this. The calibration phase takes time. The translation of results across community boundaries takes time. Building the trust required for honest disagreement takes time.

There is also a persistent ambiguity that single-discipline work does not have. In mathematics, when a proof is complete, it is complete. In interdisciplinary work, you rarely achieve that kind of closure. There is always a remaining question about whether the mathematical model accurately represents the application, whether the experimental conditions match the theoretical assumptions, whether the result that matters for one community is the result that is publishable in another.

I have found I need to hold this ambiguity without resolving it prematurely. The temptation is to declare the collaboration finished when the mathematics is clean, or when the method works on the benchmark, or when the paper is submitted. But the genuine questions are often still open. Learning to keep working with that incompleteness is, I think, one of the more important skills for anyone doing this kind of work.


## An Honest Assessment

After four years of PhD and seven months of postdoc, I would describe my interdisciplinary competence as still developing. I am more comfortable than I was. I understand the clinician and engineer perspectives better than I did. I have a few productive cross-disciplinary collaborations that I value. But I still sometimes misjudge which aspects of my work will be legible to a non-mathematical audience, and I still sometimes fail to ask the right questions early enough to avoid wasted effort.

The experience has also changed what I find interesting mathematically. Problems that connect to real, difficult applications feel more urgent to me than problems that are purely internally motivated. This is a preference, not a prescription: I know mathematicians who do beautiful, deep work with no application in sight, and I do not think they are misguided. But for me, the constraint of a genuine application has been productive, and I expect to keep working at this boundary for as long as it continues to be.
