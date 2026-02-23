---
layout: post
title: "Presenting Mathematics So People Actually Listen"
description: "Lessons on giving clear, engaging mathematical talks, from conference presentations to seminar lectures, learned mostly through painful trial and error."
date: 2026-05-04
author: "Abd'gafar Tunde Tiamiyu"
tags: [Academia, Communication, Advice]
math: false
---

I have given what I consider a truly good mathematical talk perhaps three or four times. I have given mediocre talks more often than I would like to admit, and a few that I would classify as actively bad. The bad ones taught me more than the good ones, mostly because the specific ways in which they failed illuminated principles I had not previously understood.

This post collects what I have learned about presenting mathematics effectively. It is written for graduate students and early-career researchers preparing conference talks or seminar presentations. None of these ideas are original; they are borrowed from speakers I admire, adapted to the particular challenges of communicating mathematical ideas.


## The Fundamental Mistake

The most common mistake in mathematical presentations is trying to show too much. This is also the most natural mistake, because you have spent months or years working on a result, and your instinct is to convey the full complexity and depth of what you have done.

This instinct is wrong, or at least unworkable. A 20-minute conference talk cannot convey a research paper's worth of content. A 50-minute seminar cannot replicate the experience of reading a monograph. The purpose of a talk is not to transmit the result; it is to make the audience care about the result enough to read the paper.

This shift in goal changes everything. You are not teaching; you are advertising. You are not proving; you are motivating. You are not being comprehensive; you are being selective.

The best talks I have attended left me thinking: "I need to read that paper." The worst left me thinking: "I have no idea what just happened." The difference was rarely mathematical depth; it was the clarity and restraint of the presentation.


## Structure

A mathematical talk that works usually has the following structure, even if it is not made explicit.

**The problem (30% of your time).** What question are you answering? Why does it matter? Who should care? This is the most important part of the talk. If the audience does not understand and care about the problem by the time you move to the solution, nothing else will land.

For inverse problems, I find that a concrete physical example works best. "We place electrodes on a patient's chest and measure tiny voltages. From those measurements, we want to see inside the body." This is immediately comprehensible. The mathematical formulation comes after the audience understands what you are trying to do and why it is hard.

**The difficulty (15% of your time).** Why is the problem hard? What goes wrong if you try the obvious approach? For inverse problems, this means explaining ill-posedness in terms the audience can grasp. "Small measurement errors cause the reconstruction to blow up." Show a picture: the noisy reconstruction next to the true solution. Let the audience feel the problem before you offer the solution.

**Your contribution (40% of your time).** What did you do? This is where most speakers rush and where care is most needed. Present the *idea*, not the details. If your method uses a particular type of regularization, explain the intuition behind the choice. If you developed a new algorithm, show the structure without every step. If you proved a theorem, state it clearly and sketch the proof strategy without the full argument.

One technique I have found effective: present a simplified version of your result first. State the theorem in a special case where the statement is clean and the ideas are transparent. Then mention that the full result handles additional complications, and leave those for the paper.

**Results and conclusions (15% of your time).** Show numerical or experimental results that support your claims. Figures should be clear and self-contained: axis labels, legends, and a brief statement of what the figure demonstrates. Do not show a dozen nearly identical convergence plots; show the one or two that make the point most effectively.

End with a clear statement of what you showed and what questions remain open. "We proved that this method converges at the optimal rate for problems satisfying a source condition. The open question is whether the source condition can be weakened." This gives the audience something specific to take away and think about.


## Slides

**Less text, more pictures.** A slide full of text is a slide the audience will read instead of listening to you. If you need a detailed mathematical statement, put it on the slide, but strip away everything else. One equation per slide, with the notation clearly defined, is almost always better than three equations competing for attention.

**One idea per slide.** This is the rule I violate most often and regret most consistently. When a slide tries to communicate two things, the audience retains neither.

**Figures do the heavy lifting.** A good figure can replace paragraphs of explanation. For inverse problems, side-by-side comparisons (true vs. reconstructed), convergence plots, and schematic diagrams of your method are worth far more than bullet points describing the same information.

**Animate sparingly.** Slide animations can reveal information progressively, which is sometimes useful for building up a complex figure or equation. But excessive animation creates a disjointed experience. If every click changes something, the audience spends cognitive energy tracking transitions instead of absorbing content.

**Consistent notation.** Define notation once, early, and use it consistently throughout. If $\alpha$ is the regularization parameter on slide 5, it should still be the regularization parameter on slide 15. This sounds obvious; violations are surprisingly common.


## Delivery

**Speak to the audience, not the screen.** This is the most basic presentation skill, and it is remarkably difficult to maintain when you are nervous and the screen has the equations you are trying to explain. Practice enough that you can explain each slide while facing the audience, glancing at the screen only briefly to orient yourself.

**Pace yourself.** Most nervous speakers talk too fast. The antidote is deliberate pausing. After stating a key definition or result, pause for a few seconds and let it sink in. These pauses feel awkward to you; they feel natural to the audience.

**Anticipate the questions.** Before the talk, identify the three or four most likely questions and prepare answers. "Why did you choose this particular regularizer?" "How does this compare to method X?" "Can you extend this to the nonlinear case?" Having thought through these in advance makes the Q&A much smoother.

**Handle questions gracefully.** If you do not know the answer, say so. "That is a good question. I have not thought about that specific setting, but I suspect the analysis would need modification because..." is always better than a vague non-answer. Admitting the limits of your knowledge is a sign of maturity, not weakness.


## Common Failure Modes

**The theorem dump.** Statement after statement, lemma after lemma, with no motivation between them. The audience stops following after the second theorem and spends the rest of the talk checking their email. Interleave formal statements with informal explanations. For every theorem, answer: what does this mean, and why should I care?

**The notation avalanche.** Introducing ten symbols in the first five minutes, with no time to absorb any of them. If your problem requires complex notation, introduce it gradually. Better yet, simplify the notation for the talk, even if the paper uses a more general version.

**The missing example.** Abstract frameworks are powerful but hard to absorb without a concrete instance. Always have at least one worked example ready. For a regularization method, show what it does on a specific test problem. For a convergence result, plot the convergence curve. The example makes the abstract tangible.

**The overlong introduction.** Spending fifteen minutes of a twenty-minute talk on background and related work, then rushing through your contribution in five minutes. The audience came to learn about *your* work. Give the background concisely and get to the point.


## Preparing the Talk

My process, refined over several years of getting it wrong:

1. **Write the story first.** Before opening any slide software, I write a one-paragraph summary of the talk. What is the problem? What did I do? What is the main result? This paragraph becomes the backbone.

2. **Decide on the figures.** The key figures determine the structure. If I know I need a schematic of the problem setup, a picture of the method, and a results comparison, I have the skeleton of the talk.

3. **Build the slides.** I aim for 1-1.5 slides per minute for a conference talk. For a 20-minute talk, that means 20-30 slides, including the title slide. If I have more, something needs to be cut.

4. **Practice out loud.** At least twice, with a timer. The first run is always too long. I cut material, simplify slides, and practice again. By the third run, the timing is usually right and I have internalized the flow well enough to speak naturally.

5. **Practice for a friend.** If possible, give the talk to a colleague beforehand. Their questions reveal the parts that are unclear, and their attention (or lack of it) reveals the parts that are boring.


## The Audience Perspective

The most important thing I have learned about presenting mathematics is also the simplest: remember what it feels like to be in the audience.

You are tired. You have been sitting through talks all day. You are distracted by the email you need to send, the flight you need to catch, the result in your own research that you are stuck on. The speaker has twenty minutes to capture your attention and hold it.

Everything about the talk should be designed with this in mind. Clear slides. Concrete motivation. A pace that allows absorption. A story that holds together. Generosity in explaining things that might seem obvious to you but are not obvious to someone seeing the work for the first time.

The best mathematical talks I have attended were given by people who clearly cared about being understood. They had thought about what the audience needed rather than what they wanted to display. They were generous with their explanations, economical with their notation, and honest about the limitations of their work.

That generosity is, I think, the single most important attribute of a good mathematical speaker. It is not about showmanship or charisma. It is about respecting the audience enough to make their time worthwhile.
