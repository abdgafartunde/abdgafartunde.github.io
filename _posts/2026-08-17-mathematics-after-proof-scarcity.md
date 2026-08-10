---
layout: post
title: "Mathematics After Proof Scarcity: What Terence Tao's ICM 2026 Lecture Means for Mathematicians"
description: "Reflections on Terence Tao's ICM 2026 lecture on mathematics in the age of AI: proof abundance, mathematical understanding, authorship, and what researchers should preserve as AI becomes more capable."
date: 2026-08-17
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Artificial Intelligence, Research, Reflections]
math: true
---

Terence Tao gave a public lecture at the International Congress of Mathematicians 2026 titled *Mathematics in the Age of AI*. I expected a talk about how good the latest AI systems have become at mathematics: theorem proving, formalization, benchmarks, perhaps some predictions about where the technology is heading.

That is not really the talk he gave. Tao's more interesting question was what happens *after* we grant that AI may become genuinely useful at research-level mathematics. Suppose, as a working hypothesis, that AI systems can soon perform a nontrivial fraction of mathematical research tasks with reasonable success, cost, and human supervision. What should mathematicians do then?

The question sounds practical, but it quickly becomes philosophical:

> **What are the actual goals and values of mathematical research?**

I have been thinking about this question since reading the slides, partly because it intersects with something that has bothered me for a while. I use AI in my own work. It helps me search literature, write and debug code, test ideas, check calculations, improve exposition, and sometimes explore mathematical arguments. The productivity gains are real. But there is an uncomfortable distinction between *producing mathematics* and *understanding mathematics*. We have historically been able to blur that distinction because producing a correct new result was difficult enough that the two often travelled together. AI may force us to separate them. This post is my attempt to work through Tao's argument and what I think it means for researchers, particularly those of us working in applied mathematics, computation, inverse problems, and scientific machine learning.

## The Question Is No Longer Only Whether AI Can Do Mathematics

A large fraction of the current debate is about capability. Can a language model really reason? Was a benchmark contaminated? Did the system solve a genuinely new problem? How much prompting was involved? Was the proof checked by a human or by a proof assistant? These are important questions. Tao formulates the issue as a family of "AI capability conjectures," each a template whose key terms are left as placeholders: at some point, some AI tools will, at some expense, and with some level of human supervision, be able to accomplish some research-level mathematical tasks in some fields, with some non-trivial success rate and at some level of correctness. There is not one claim called "AI can do mathematics"; there are many, depending on which placeholders you fill in.

That distinction matters. Solving a carefully selected research problem after extensive human guidance is very different from autonomously developing a new mathematical theory. But Tao deliberately puts that dispute to one side. His argument is conditional. Suppose a reasonably strong version of the capability claim turns out to be true, and he offers one controlled data point: a second batch of ten novel research-level problems, assessed under scientific conditions against four AI systems in May 2026, with seven of the ten solved at publication-level quality, at compute costs of $10–$1000 per problem. Conditioning on that working hypothesis exposes a question that remains important even if one is sceptical about the strongest claims made by AI companies. The fact that a machine *can* perform a task does not tell us whether the task should be delegated to it, how its output should be evaluated, or what responsibilities remain with the mathematician. Capability is one question; value is another.

## Mathematics Has Never Had Only One Objective

What are we trying to achieve when we do mathematical research? The obvious answer is "solve problems," but that is only part of it. We also want to build theories, develop reusable techniques, understand phenomena, train future mathematicians, connect different areas of knowledge, support applications, and sometimes create something that is beautiful simply because of the structure it reveals.

Historically, these objectives were often positively correlated. An important problem was solved, and the proof introduced a technique. The technique became part of a theory. The theory generated further questions. Students learned it. Other researchers used it. Eventually the result became part of the standard language of the field. Because these goals tended to move together, the mathematical community could use visible outputs — solved problems, theorems, papers — as rough proxies for deeper progress.

AI may break that correlation. We can imagine a system that produces a large number of correct results while contributing relatively little to theory building, mathematical taste, education, or collective understanding. In that situation, maximizing the number of solved problems is no longer the same thing as maximizing mathematical progress.

This is where Tao invokes Goodhart's law:

> **When a measure becomes a target, it ceases to be a good measure.**

The number of solved problems can be a useful measure when it emerges naturally from serious mathematical work. Once it becomes an explicit optimization target, a sufficiently capable system may become extremely good at increasing the count without necessarily increasing the thing we actually care about. That distinction feels increasingly important in academia more generally. We already know what happens when publications, citations, grant income, or benchmark scores become targets rather than indicators. AI can amplify the same problem by making the production of measurable output much cheaper. The danger is not only that AI might produce false mathematics. A more subtle danger is that it produces enormous quantities of *valid but low-value mathematics*.

## A Proof Is Not the End of the Process

One of the strongest parts of Tao's lecture is his gradual reconstruction of what it actually means to solve a mathematical problem.

The naive picture is

$$
\text{open problem}
\longrightarrow
\text{solution}.
$$

But a proposed solution might be wrong. So we need verification:

$$
\text{open problem}
\longrightarrow
\text{unverified solution}
\longrightarrow
\text{verified solution}.
$$

Even this is not enough. Suppose an AI system produces a 150-page proof, and a formal proof assistant verifies every logical step. The theorem is now correct in a strong formal sense. But nobody understands the argument. Has the mathematical problem really been solved in the sense that matters to the discipline?

Tao's answer is effectively no. The proof still needs exposition: it must be reorganized so that mathematicians can see the main mechanism, the difficult steps, the role of the assumptions, and the relationship with what was known before. Then it needs community acceptance. Experts must read it, test it, compare it with the literature, and decide whether it is important and trustworthy. And even publication is not the final stage. The strongest results are eventually *digested*: their proofs are simplified, their essential ideas extracted, they are placed in a more general framework, and they enter textbooks, graduate courses, surveys, software, formal libraries, and the working vocabulary of the field.

A more realistic pipeline is therefore

$$
\text{problem}
\rightarrow
\text{proof generation}
\rightarrow
\text{verification}
\rightarrow
\text{exposition}
\rightarrow
\text{acceptance}
\rightarrow
\text{digestion}
\rightarrow
\text{canonical theory}.
$$

I find this picture much more useful than the common debate about whether an AI has "solved" a theorem. It asks a better question: **at which stage of the mathematical knowledge pipeline has the machine actually contributed?**

## From Proof Scarcity to Proof Abundance

Tao's phrase that stayed with me most is the transition from **proof scarcity** to **proof abundance**. Our current mathematical institutions were built in a world where generating a serious new proof was expensive. The difficulty of creating the proof acted as a natural filter. There were still too many papers to read, of course, but the production rate was limited by the amount of human mathematical labour available. Suppose AI removes much of that bottleneck. Then the rate of proof generation could increase much faster than the rates of verification, exposition, peer review, and mathematical digestion.

One can think of the research system as a sequence of queues. Let $\lambda_g$ be the rate at which candidate proofs are generated, while $\mu_v$, $\mu_e$, $\mu_r$, $\mu_c$ represent our effective capacities for verification, exposition, review, and canonicalization. If AI makes $\lambda_g \gg \mu_v$, then unverified proofs accumulate. If verification is also automated but exposition remains slow, the bottleneck simply moves: $\lambda_v \gg \mu_e$. If AI becomes good at exposition too, journals and referees may become the limiting stage. And if reviewing is partially automated, we eventually encounter what seems to me the hardest bottleneck of all: human attention. There is only so much mathematics that a research community can genuinely absorb.

Tao calls the resulting phenomenon **proof indigestion**, and the term captures the problem well. Producing more mathematical objects does not automatically increase the amount of mathematics that the community understands. In fact, beyond some point, abundance can make understanding harder. Important results compete with thousands of technically correct but less consequential ones. Researchers spend more time filtering. The literature becomes harder to navigate. Priority becomes more difficult to establish. Expert refereeing becomes an increasingly scarce resource. The bottleneck shifts from *generation* to *judgment*.

## Correctness Is Not Understanding

This distinction matters even more to me than proof abundance itself. A proof can be correct without being understood. Suppose a proof assistant verifies

$$
\Gamma \vdash T,
$$

where $\Gamma$ contains the assumptions and $T$ is the theorem. This establishes something very important: the formal derivation is valid relative to the encoded assumptions and definitions. But it does not answer why $T$ is true, which assumptions in $\Gamma$ are actually doing the work, what the central mechanism of the proof is, where the difficult step is, what would fail if one assumption were weakened, whether there is a stronger theorem hiding behind the argument, whether the proof reveals a reusable idea, or how it connects to the existing theory. These are not secondary questions. They are often where the mathematics lives.

When I read a good proof, I am rarely trying to memorize the sequence of deductions. I am trying to compress it into a mental model. Maybe the key is compactness. Maybe there is a hidden coercivity estimate. Maybe the right variable makes a convex structure visible. Maybe the whole argument is really exploiting an invariant. Maybe an apparently analytic theorem is ultimately geometric. Understanding occurs when the long derivation can be reorganized around a relatively small number of structural ideas. AI may become extremely good at producing derivations; whether that automatically produces this kind of conceptual compression is a separate question.

## The Strange Importance of Friction

Tao makes another observation that connects closely with something I wrote earlier in [*On the Quiet Erosion of Deep Thinking*](/blog/2026/02/06/the-great-deskilling/). AI-generated mathematical writing can be extremely polished: the grammar is clean, the notation is consistent, every transition appears smooth. That sounds entirely desirable, but Tao points out that mathematical exposition can be *too smooth*.

In a human-written proof, the places where the author struggled often leave traces. There may be an extra paragraph explaining a subtle point, an awkward but revealing decomposition, a warning about a tempting false argument, or an example inserted exactly where intuition becomes difficult. These irregularities tell the reader where to slow down. A heavily AI-polished argument can remove both bad friction and useful friction: routine algebra and the genuinely new idea may be presented with the same confidence and at the same pace. The result is easy to read line by line while being surprisingly difficult to learn from.

This is a subtle point. We should not romanticize bad writing: confusing notation and unnecessary complication do not create depth. But there is a difference between removing obstacles to understanding and removing the evidence of where understanding is required. The best exposition does not make everything look easy; it makes the structure of the difficulty visible.

## This Is Also a Training Problem

The same issue appears in mathematical education. How did most of us learn to think mathematically? Not by continuously reading perfect solutions. We tried things that failed. We chose the wrong estimate. We constructed an example and discovered that our conjecture was false. We spent several days misunderstanding a definition before seeing why it had been formulated that way. Over time, those failures became judgment. The process looked roughly like

$$
\text{attempt}
\rightarrow
\text{failure}
\rightarrow
\text{diagnosis}
\rightarrow
\text{reformulation}
\rightarrow
\text{insight}.
$$

AI can intervene at every stage. That can be enormously helpful: a well-timed hint can save a student from wasting three days on a purely technical obstruction, a counterexample generated quickly can expose a false conjecture, and a different explanation can make an opaque definition understandable. But if the intervention occurs too early, the whole process collapses into

$$
\text{problem}
\rightarrow
\text{answer}.
$$

Then the student receives the result without developing the machinery that would have produced it. The interesting question is therefore not "Should mathematicians use AI?" (that question is already becoming outdated). The more important question is:

> **Which cognitive operations must remain ours if we want to retain mathematical independence?**

I do not yet have a complete answer. But I suspect the list includes problem formulation, recognizing structure, deciding which assumptions matter, developing examples, testing plausibility, detecting failure modes, and learning to remain productively stuck. These are not merely steps toward an answer; they are part of how mathematical taste is formed.

## Authorship Has to Mean More Than Prompting

Tao's discussion of authorship is appropriately demanding. If AI contributes substantially to a mathematical result, what makes the human researcher the author? It cannot simply be that the researcher entered the prompt. Authorship must involve responsibility. A human author should be able to state the result precisely, explain the central mechanism, justify the assumptions, situate the work in the literature, identify what is genuinely new, answer expert questions, and correct the argument when a problem is discovered.

Tao offers a useful rule of thumb: if the authors cannot convincingly give a clear, correct, properly attributed expert-level talk on their own result, then the result should not be published under their names. I think this is a strong standard and the right direction. It shifts the criterion from "Did you personally type every line?" to something more substantive: **do you possess the mathematics well enough to take responsibility for it?** This matters especially with proprietary AI systems. A model may generate an argument without revealing where the idea came from, what related material it has seen, or whether part of the proof is effectively a rediscovery of something already in the literature. Disclosure of AI use is therefore necessary, but disclosure alone is not enough. We still have to reconstruct provenance, verify novelty, and understand the argument ourselves.

## The Problem Is Even Harder in Applied Mathematics

In applied and computational mathematics, a formally correct theorem is only one layer of the problem.

Consider an inverse problem

$$
F(x)=y,
$$

where $F$ is the forward operator, $x$ is an unknown parameter or field, and $y$ is observed data.

With noisy measurements,

$$
\lVert y^\delta-y\rVert_Y\leq\delta,
$$

we might reconstruct $x$ by solving

$$
x_{\alpha,\theta}^{\delta}
\in
\operatorname*{arg\,min}_{x\in X}
\left\{
\mathcal{D}\bigl(F(x),y^\delta\bigr)
+
\alpha \mathcal{R}_{\theta}(x)
\right\}.
$$

An AI system could help derive this method, implement it, run the experiments, and perhaps even prove a convergence theorem. But none of that automatically answers the scientific questions: Is $F$ a sufficiently accurate model of the physical experiment? Is $\mathcal{D}$ the right model for the noise? What prior information is encoded in $\mathcal{R}_{\theta}$? Is the reconstruction identifiable from the available data? What happens under model mismatch? Does the discrete algorithm faithfully approximate the continuum formulation? Are the theoretical stability constants meaningful at computationally relevant scales? Does a learned regularizer still behave sensibly outside the training distribution?

These questions require judgment that lies outside the local correctness of the proof. This is one reason I think applied mathematicians should be especially careful about confusing AI-generated mathematical fluency with scientific understanding. The machine can manipulate the model we give it; we remain responsible for deciding whether it is the right model.

## What Should Become More Valuable?

If proof generation becomes cheaper, the activities that remain scarce should become more valuable. I suspect we will need to place greater weight on the following.

**Problem selection.** Knowing which questions are worth spending time on may become more important than executing every technical step of the solution.

**Theory building.** A collection of isolated theorems is not a theory. Someone has to identify the right concepts, representations, invariants, and abstractions that organize them.

**Exposition.** Not merely making arguments readable, but showing where the ideas are.

**Verification and reviewing.** The community may need far more expert checking while the current incentive structure continues to treat reviewing as secondary service work.

**Synthesis and canonicalization.** Surveys, textbooks, formal libraries, computational libraries, and definitive treatments may become increasingly important as the volume of raw output grows.

**Teaching and mentoring.** If AI can supply answers instantly, helping students learn how to *think* becomes more important, not less.

**Scientific judgment.** In applied mathematics, deciding whether a result is meaningful for the underlying phenomenon remains indispensable.

There is an interesting reversal here. The activities that have historically received less prestige because they happen *after* theorem generation may become the main bottlenecks of mathematical progress. In a world of abundant output, curation is not administrative cleanup; it is intellectual work.

## How I Want to Use AI in My Own Research

After reading Tao's lecture, I do not feel any less inclined to use AI; if anything, I think mathematicians should become much better at using these systems. But I want the division of labour to be deliberate. I am comfortable delegating more of the mechanical work: code boilerplate, syntax, routine symbolic manipulation, literature discovery, formatting, preliminary numerical experiments, and checks that can be independently verified. I am much less comfortable delegating the parts that determine what the work *means*.

Before I accept an AI-assisted result as part of my own research, I want to be able to answer:

1. What is the precise mathematical or scientific question?
2. Why should the proposed result be true?
3. What is the main mechanism of the argument?
4. Which assumptions are essential?
5. What are the limiting or failure cases?
6. How does the result relate to existing work?
7. Can I reproduce the central reasoning without the AI output in front of me?
8. Can I explain it clearly at the board to someone who knows the field?
9. Can I tell which parts are routine and which parts are genuinely new?
10. If the tool disappeared tomorrow, could I continue the project?

That final question may be the most useful test. If the answer is no, then I may possess an output, but I do not yet possess the mathematics.

## What I Think Tao's Lecture Is Really About

The title is *Mathematics in the Age of AI*, but Tao frames the lecture explicitly as describing a crisis in the foundations of mathematical values and practices, not a crisis of capability. This is an important distinction. The foundational crisis of roughly 1900–1930 forced mathematicians to make the foundations of reasoning explicit and ended by producing a rigorous, standardized framework. The present turbulence is, he argues, something different: it forces us to make explicit the values that were easy to leave implicit when human mathematical labour was the limiting resource.

What counts as understanding? What makes someone an author? What is a proof for? Why do we train mathematicians? What kinds of work should receive prestige? What turns an isolated theorem into mathematical knowledge? These questions were always there; AI makes them harder to avoid. And the urgency is real: Tao argues that mathematicians have only a narrow window to define what the profession means before those definitions get made for them by technology companies and financial incentives.

From this diagnosis he draws three concrete recommendations. First, normalize the responsible disclosure of AI assistance (covert use, concealed to dodge peer criticism, is the case to prevent, not AI use itself). Second, shift prestige away from proof generation and being "first," and toward the slower human stages of exposition, publication, and canonicalization. Third, establish a publication gate: if authors cannot convincingly present their result at expert level, answer questions about it, and demonstrate command of the argument, the result should not be published under their names.

I do not think the answer is that mathematicians should compete with machines at symbolic speed, nor that we should retreat from AI and preserve an artificial version of twentieth-century mathematical practice. The more promising path is to use these systems aggressively where they extend our capabilities, while protecting the forms of reasoning, judgment, responsibility, and education on which meaningful mathematics depends. The future mathematician may perform fewer routine deductive steps manually; that does not necessarily make the mathematician less important. It may make the distinctly human parts of the job easier to see.

Choosing the right problem. Knowing when an answer is meaningful. Finding the idea inside a proof. Connecting isolated results into theory. Explaining why something matters. Teaching another person how to see it. Taking responsibility when the mathematics is wrong. Those are not peripheral activities surrounding theorem proving. They are part of what turns proofs into mathematics, and if Tao is right that we are moving from proof scarcity to proof abundance, they may become the most important parts of the profession.

---

*This essay is based on Terence Tao's public lecture, "Mathematics in the Age of AI," delivered at the International Congress of Mathematicians 2026 on 24 July 2026. The interpretation and reflections here are my own.*
