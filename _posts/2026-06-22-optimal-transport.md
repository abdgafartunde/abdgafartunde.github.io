---
layout: post
title: "Optimal Transport: Moving Mass as Efficiently as Possible"
description: "An introduction to optimal transport, the Wasserstein distance, and why moving probability mass has become a central tool in mathematics, imaging, and machine learning."
date: 2026-06-22
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Optimal Transport, Inverse Problems]
math: true
---

Imagine you have a pile of earth and a hole of the same volume. You want to fill the hole by moving the earth, and you want to do it as cheaply as possible — where cost is measured by mass times distance travelled. What is the optimal transport plan?

This is Monge's problem, posed in 1781. It took nearly 200 years to resolve satisfactorily. The resolution, due primarily to Kantorovich in the 1940s and later refined by Brenier, Benamou, Villani, and many others, produced a theory of extraordinary richness. Optimal transport is now central to analysis, probability, PDEs, image processing, statistics, and machine learning. If you have encountered Wasserstein distances in generative models or geometric measure theory, you have seen one corner of this theory.

I came to optimal transport through two routes: as a tool for comparing distributions in imaging problems, and as a framework for understanding certain data misfit functionals that behave better than the standard $L^2$ norm when the data contains outliers or geometric features. This post is an introduction to the core ideas.


## The Monge Problem

Let $\mu$ and $\nu$ be two probability measures on a metric space $\mathcal{X}$, representing respectively the source and target distributions. Think of $\mu$ as the initial pile of earth and $\nu$ as the desired final configuration.

A **transport map** $T : \mathcal{X} \to \mathcal{X}$ pushes $\mu$ forward to $\nu$, meaning that for every measurable set $B$,

$$
\nu(B) = \mu(T^{-1}(B)).
$$

This is written $T_\# \mu = \nu$: the pushforward of $\mu$ under $T$ is $\nu$.

Given a cost function $c(x, y)$ measuring the cost of moving a unit of mass from $x$ to $y$, Monge's problem is:

$$
\inf_{T : T_\# \mu = \nu} \int_{\mathcal{X}} c(x, T(x))\, d\mu(x).
$$

This is elegant but problematic. The constraint $T_\# \mu = \nu$ is nonlinear (it is a PDE constraint on $T$). Worse, a transport map may not exist at all when $\mu$ is a discrete measure: you cannot split a point mass and send it to two different locations using a single map.


## The Kantorovich Relaxation

Kantorovich's key insight was to relax the problem. Instead of requiring that every particle at $x$ go to a single destination $T(x)$, allow mass splitting: a particle can be distributed across multiple destinations.

A **transport plan** is a joint probability measure $\pi$ on $\mathcal{X} \times \mathcal{X}$ with marginals $\mu$ and $\nu$:

$$
\pi(A \times \mathcal{X}) = \mu(A), \quad \pi(\mathcal{X} \times B) = \nu(B)
$$

for all measurable $A, B$. The value $\pi(dx, dy)$ represents the mass transported from $x$ to $y$.

The **Kantorovich problem** is:

$$
\inf_{\pi \in \Pi(\mu, \nu)} \int_{\mathcal{X} \times \mathcal{X}} c(x, y)\, d\pi(x, y),
$$

where $\Pi(\mu, \nu)$ is the set of all couplings with marginals $\mu$ and $\nu$. This is a *linear* program over an infinite-dimensional space. It always has a solution (under mild conditions), and its value is called the **optimal transport cost**.

When $\mu$ is absolutely continuous with respect to Lebesgue measure, the Kantorovich and Monge problems are equivalent: the optimal plan is supported on the graph of an optimal map $T$, and $\pi = (\text{id}, T)_\# \mu$.


## The Wasserstein Distance

For the cost function $c(x, y) = \lVert x - y \rVert^p$ with $p \geq 1$ on $\mathbb{R}^d$, the optimal transport cost defines the **$p$-Wasserstein distance**:

$$
W_p(\mu, \nu) = \left(\inf_{\pi \in \Pi(\mu, \nu)} \int \lVert x - y \rVert^p\, d\pi(x, y)\right)^{1/p}.
$$

The resulting $W_p$ is a genuine metric on the space of probability measures with finite $p$-th moment. It metrizes weak convergence of measures together with convergence of moments, which makes it stronger than the weak topology but weaker than total variation.

The case $p = 2$ is especially tractable. By Brenier's theorem (1991), when $\mu$ is absolutely continuous, the optimal transport map for the quadratic cost is the gradient of a convex function: $T = \nabla \varphi$ for some convex $\varphi : \mathbb{R}^d \to \mathbb{R}$. This characterization connects optimal transport to convex analysis and to the Monge-Ampère PDE:

$$
\det(D^2 \varphi(x)) = \frac{d\mu(x)}{d\nu(\nabla \varphi(x))}.
$$

For $p = 1$, the Wasserstein distance has a dual representation (the Kantorovich-Rubinstein formula):

$$
W_1(\mu, \nu) = \sup_{\lVert f \rVert_{\text{Lip}} \leq 1} \int f\, d\mu - \int f\, d\nu,
$$

where the supremum is over 1-Lipschitz functions. This formula connects $W_1$ to functional analysis and makes it computable via linear programming duality. It is the form used in Wasserstein GANs, where the discriminator is trained to be a 1-Lipschitz function.


## Why $W_p$ is Better Than $L^2$ in Imaging

The squared $L^2$ distance between two images $f$ and $g$ is

$$
\lVert f - g \rVert_{L^2}^2 = \int |f(x) - g(x)|^2\, dx.
$$

This measures pointwise discrepancy. If $f$ is a single spike at position $x_0$ and $g$ is the same spike shifted slightly to $x_0 + \varepsilon$, the $L^2$ distance is $2\lVert f \rVert_{L^2}^2$ regardless of how small $\varepsilon$ is. The metric is completely insensitive to the geometric relationship between the two signals.

The Wasserstein distance, by contrast, sees the shift. For the same $f$ and $g$, $W_p(f, g) = \varepsilon$: the cost reflects the actual displacement. This makes Wasserstein distances much more natural for comparing signals with geometric structure (images, point patterns, spectral distributions), and for defining misfit functionals in inverse problems where the unknown has geometric features.

This is not purely conceptual. In seismic full-waveform inversion, using a Wasserstein-based misfit instead of the $L^2$ misfit dramatically reduces the cycle-skipping problem: the $L^2$ objective has many spurious local minima corresponding to half-period shifts of the wave, while the Wasserstein objective is more convex. The translation invariance of the Wasserstein distance is a feature, not an accident.


## Computing Optimal Transport

For discrete measures on $n$ support points, the Kantorovich problem reduces to a linear program with $n^2$ variables and $O(n)$ constraints. The Hungarian algorithm solves this in $O(n^3)$ time. For $n = 10^4$, this is expensive but feasible. For $n = 10^6$, it is not.

**Entropic regularization.** Cuturi's 2013 paper introduced Sinkhorn's algorithm for optimal transport by adding an entropy term:

$$
\inf_{\pi \in \Pi(\mu, \nu)} \int c\, d\pi + \varepsilon \int \pi \log \pi\, d\pi.
$$

The regularized problem has a unique solution, and it can be solved by iterative row and column normalization (the Sinkhorn iterations), which converges in $O(n^2 / \varepsilon)$ operations using GPU parallelism. The approximation error is $O(\varepsilon)$. For $\varepsilon$ not too small, this is far faster than exact LP solvers and scales to millions of points.

**Sliced Wasserstein distance.** For measures on $\mathbb{R}^d$ with large $d$, the Wasserstein distance is expensive even with Sinkhorn. The sliced Wasserstein distance averages one-dimensional Wasserstein distances over random projections:

$$
\text{SW}_p(\mu, \nu) = \int_{S^{d-1}} W_p(\Pi_\theta{}_\# \mu, \Pi_\theta{}_\# \nu)\, d\theta,
$$

where $\Pi_\theta$ is the projection onto direction $\theta$. In one dimension, the Wasserstein distance is computable in $O(n \log n)$ by sorting. The sliced approximation is not a true Wasserstein distance, but it metrizes the same convergence, is much faster to compute, and often works well in practice.


## Connections to Other Areas I Work On

Optimal transport appears in several places adjacent to my research.

**Data misfit in inverse problems.** When the measured data has structure that the $L^2$ norm poorly captures (signal shifts, geometric features), a Wasserstein-based misfit is an alternative. The gradient of the Wasserstein misfit can be computed via the adjoint method I described in an earlier post, though the non-smoothness of $W_1$ requires care.

**Generative priors.** Learned priors for inverse problems often model the distribution of plausible solutions. Wasserstein distances provide a natural way to measure discrepancy between the model's output distribution and the training distribution, and to formulate the training objective in a way that is less sensitive to mode collapse than KL-divergence-based methods.

**Interpolation between measures.** The Wasserstein geodesic (the optimal interpolation between $\mu$ and $\nu$ under the $W_2$ metric) is the displacement interpolation: at time $t \in [0,1]$, the interpolated measure is $(T_t)_\# \mu$ where $T_t(x) = (1-t)x + tT(x)$. This provides a geometrically meaningful way to interpolate between conductivity distributions in EIT or between imaging data from different patients.

The theory is deep enough to occupy a career, and I am only beginning to understand it. But the connections to problems I care about are direct enough that I expect optimal transport to become a more central part of my toolkit over the next few years.
