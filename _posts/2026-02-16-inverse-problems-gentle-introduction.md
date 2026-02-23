---
layout: post
title: "Inverse Problems: The Art of Working Backwards"
description: "A gentle introduction to inverse problems — what they are, why they resist easy solutions, and why they matter across science and engineering."
date: 2026-02-16
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Tutorial]
math: true
---

Suppose a doctor places electrodes around a patient's chest and measures tiny electrical currents on the skin. From those surface measurements alone, she wants to reconstruct what is happening inside — locate a tumour, identify damaged tissue, map the electrical conductivity of the body.

This is an inverse problem. And it is, in a precise mathematical sense, extraordinarily difficult.

I have spent the better part of my research career working on problems like this one. The specific setting I work in is called electrical impedance tomography, but the broader class of inverse problems shows up everywhere: in CT scans, seismic exploration, radar, astronomy, materials testing, and increasingly in machine learning. Once you learn to recognise the pattern, you find it in places you would never have expected.

This post is an attempt to explain what inverse problems actually are, why they resist straightforward solutions, and why a substantial community of mathematicians and engineers has devoted careers to understanding them.


## Forward and Inverse

The clearest way to understand an inverse problem is to first understand a forward problem.

A forward problem starts with a cause and computes an effect. You know the internal structure of an object, and you predict what measurements you would observe. Given the conductivity distribution inside a body, compute the voltages you would measure on the surface when you inject known currents.

Mathematically, if we denote the unknown quantity by $f$ and the measurements by $g$, a forward problem means evaluating

$$g = \mathcal{A}(f),$$

where $\mathcal{A}$ is some operator — often involving a partial differential equation — that models the underlying physics.

Forward problems are generally well-behaved. If you know $f$ and you know $\mathcal{A}$, computing $g$ is usually a matter of standard numerical analysis (though it can be computationally expensive).

An inverse problem reverses the direction: given the measurements $g$, recover the unknown $f$. You want to solve

$$\mathcal{A}(f) = g$$

for $f$. This is where the difficulty begins.


## Why Inversion Is Hard

In 1902, Jacques Hadamard articulated what it means for a problem to be *well-posed*. He required three conditions:

1. **Existence**: a solution must exist.
2. **Uniqueness**: the solution must be unique.
3. **Stability**: the solution must depend continuously on the data.

A problem that violates any of these conditions is called *ill-posed*. Most inverse problems of practical interest violate at least the third condition, and often the first or second as well.

The third condition is the one that causes the most grief in practice. In plain terms, it says that small errors in your measurements should produce only small changes in your reconstruction. But in many inverse problems, the opposite happens. A tiny perturbation in the data — a fraction of a percent of noise — can change the reconstructed solution completely.

This instability is not a bug in your code. It is not a numerical glitch you can fix by using more decimal places. It is a fundamental property of the mathematical problem itself. The operator $\mathcal{A}$ typically maps a large, rich space of possible internal structures to a much smaller space of measurements. Information is irretrievably lost in the forward process. No algorithm, no matter how clever, can conjure that information back into existence.

What it means in practice: if you naively try to invert your data — say, by least squares — the result will be dominated by amplified noise. Instead of recovering the true signal, you reconstruct whatever pattern in $f$ most effectively fits the noise in $g$. The output looks like chaos.


## A Concrete Example: Electrical Impedance Tomography

Let me be specific with an example from my own work.

In electrical impedance tomography (EIT), you place electrodes on the boundary of a domain — a cross-section of the human torso, say. You inject small alternating currents through some electrodes and measure the resulting voltages on others. From these boundary voltages, you want to reconstruct the electrical conductivity $\sigma(x)$ inside the domain.

The physics is governed by a standard elliptic PDE. In the continuum model, the electric potential $u$ satisfies

$$\nabla \cdot (\sigma \nabla u) = 0 \quad \text{in } \Omega,$$

with boundary conditions determined by the electrode configuration.

The forward problem — given $\sigma$, compute the boundary voltages — is well-posed and solvable by standard finite element methods. It is a bread-and-butter elliptic problem.

The inverse problem — given boundary voltages, recover $\sigma$ — is severely ill-posed. Alberto Calderón posed the mathematical foundation in 1980, asking whether the conductivity is uniquely determined by boundary measurements. Even this question, purely about uniqueness, took the community decades to resolve. The stability question is worse: Alessandrini showed that stability is at best logarithmic, meaning you need exponentially precise data to recover even moderately detailed features.

What does this look like in practice? Two very different conductivity distributions — one with a tumour, one without — can produce boundary voltages that differ by less than the measurement noise. Your data physically cannot distinguish them. If you apply a naive solver, it will oscillate wildly between the possibilities, producing a reconstruction that looks nothing like either.

You cannot solve this problem without bringing something extra to the table.


## Regularization: Taming Instability

This is where *regularization* enters, and it is arguably the central idea in the entire field.

The principle is straightforward: since the data alone cannot determine a stable solution, you must incorporate additional information — prior knowledge, assumptions, constraints — to select a meaningful reconstruction from among all the candidates that roughly fit the data.

The most classical approach is Tikhonov regularization. Instead of minimizing the data misfit $\|\mathcal{A}(f) - g\|^2$ alone, you minimize

$$J_\alpha(f) = \|\mathcal{A}(f) - g\|^2 + \alpha \|f\|^2,$$

where $\alpha > 0$ is a regularization parameter. The second term penalises solutions that are too large or too rough, pulling the reconstruction toward something reasonable.

The choice of $\alpha$ is critical. Too large, and you over-smooth — edges and fine features vanish. Too small, and the noise creeps back in. The optimal choice depends on the noise level $\delta$ in your data and the smoothness of the true solution, and there is a rich theory — the Morozov discrepancy principle, the L-curve method, generalised cross-validation — addressing exactly how to choose $\alpha$ in practice.

Tikhonov is not the only option. Total variation regularization preserves edges, making it natural for problems where the solution has sharp boundaries (like detecting an inclusion in EIT). Sparsity penalties work when the solution has a concise representation in some basis. Iterative methods — Landweber iteration, conjugate gradient applied to the normal equations — use early stopping as a form of implicit regularization: the first few iterations recover large-scale features, and you stop before the iteration begins amplifying noise.

Each approach encodes different assumptions, and choosing the right regularization for a given problem requires understanding both the mathematics and the physics. It is a discipline of intellectual honesty: you must confront the limits of what your data can tell you and make your modelling choices explicit.


## Inverse Problems Are Everywhere

I have focused on EIT because it is my home territory, but the same structure appears across a remarkable range of fields.

**Medical imaging.** Computed tomography reconstructs internal density from X-ray projections — mathematically, inverting the Radon transform. Allan Cormack and Godfrey Hounsfield shared the 1979 Nobel Prize in Medicine for CT, which is, at its mathematical heart, an inverse problem. MRI, PET, and ultrasound imaging involve related but distinct inversions.

**Geophysics.** Seismologists record seismic waves at the Earth's surface and try to reconstruct the planet's internal structure. The petroleum industry uses similar techniques to find hydrocarbon deposits. The inverse problem involves wave equations, and the non-uniqueness is substantial. Multiple subsurface configurations can produce nearly identical seismograms.

**Non-destructive testing.** Engineers use ultrasound, eddy currents, or thermal measurements to detect cracks and defects inside materials without cutting them open. Can you find a crack from surface temperature measurements alone? In principle, yes. In practice, it is an ill-posed inverse problem that requires careful regularization.

**Astronomy.** The Event Horizon Telescope produced the first image of a black hole in 2019. The reconstruction was a massive inverse problem: recovering an image from sparse, noisy Fourier measurements taken by a network of radio telescopes spread across the globe. The algorithms that made this possible draw directly on the theory of ill-posed problems and regularization.

**Machine learning.** Though rarely framed this way, training a neural network is itself an inverse problem. You observe input-output pairs and seek the underlying function. The problem is massively ill-posed — many different networks fit the training data equally well — and the standard practical tools (weight decay, dropout, early stopping) are, mathematically, forms of regularization.

The mathematical structure is the same in every case: incomplete, noisy observations; a desire to recover something not directly measured; instability that demands additional assumptions. The specifics — different PDEs, different measurement physics, different noise models — change, but the core challenge does not.


## Why It Matters

I sometimes get asked why anyone would devote a career to problems that are, by definition, impossible to solve perfectly. The answer is that *impossible to solve perfectly* is not the same as *impossible to solve usefully*.

A CT scan does not produce a mathematically exact representation of the body's density. But it produces one accurate enough to diagnose a tumour, guide a biopsy, or plan a surgery. The difference between a useful reconstruction and a meaningless one is precisely the mathematics: the regularization theory, the convergence analysis, the stability estimates that tell you what resolution is achievable with a given amount of data and noise.

The same is true in every application. Geophysicists do not need a perfect model of the subsurface; they need one reliable enough to decide where to drill. Engineers do not need to locate a crack to the micrometer; they need to know whether the structure is safe to operate.

Regularization theory, convergence analysis, error estimates — these are not academic indulgences. They are the tools that separate principled reconstruction from hopeful guesswork. They tell us when to trust a result, when to be cautious, and when to go back and collect more data.


## An Active and Growing Field

Inverse problems have been studied seriously since the mid-twentieth century, but the field shows no signs of slowing. Several directions are generating intense activity right now.

The intersection with machine learning is the most visible. Can neural networks learn to solve inverse problems faster or more accurately than classical iterative methods? Under what conditions? With what guarantees? These questions are producing a new wave of research — and they demand people who understand both the mathematics of ill-posedness and the mechanics of deep learning.

High-dimensional inverse problems, where the unknown has thousands or millions of degrees of freedom, push the limits of existing theory and computation. Bayesian approaches to inverse problems, which quantify uncertainty in the reconstruction rather than producing a single point estimate, are gaining traction across applications. And foundational questions persist: the Calderón problem is not fully resolved in all geometries, stability estimates for many nonlinear inverse problems remain essentially unknown, and the theoretical understanding of iterative regularization methods still has significant gaps.

If you are a graduate student or early-career researcher looking for a field at the intersection of rigorous mathematics, computation, and genuine real-world impact, inverse problems is a good place to be. The problems are deep, the applications are broad, and the questions are far from settled.

I will write more about specific topics — regularization theory, numerical methods, and the role of machine learning in this field — in future posts.
