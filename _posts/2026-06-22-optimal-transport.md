---
layout: post
title: "Optimal Transport: Moving Mass as Efficiently as Possible"
description: "An introduction to optimal transport, the Wasserstein distance, and why moving probability mass has become a central tool in mathematics, imaging, and machine learning."
date: 2026-06-22
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Optimal Transport, Inverse Problems]
math: true
---

Imagine you have a pile of earth and a hole of the same volume. You want to fill the hole by moving the earth, and you want to do it as cheaply as possible, where cost is measured by mass times distance travelled. What is the optimal transport plan?

This is Monge's problem, posed in 1781. It took nearly 200 years to resolve satisfactorily. The resolution, due primarily to Kantorovich in the 1940s and later refined by Brenier, Benamou, Villani, and many others, produced a theory of extraordinary richness. Optimal transport is now central to analysis, probability, PDEs, image processing, statistics, and machine learning. If you have encountered Wasserstein distances in generative models or geometric measure theory, you have seen one corner of this theory.

I came to optimal transport through two routes: as a tool for comparing distributions in imaging problems, and as a framework for understanding certain data misfit functionals that behave better than the standard $L^2$ norm when the data contains outliers or geometric features. This post is an introduction to the core ideas.


## The Monge Problem

Let $\mu$ and $\nu$ be two probability measures on a metric space $\mathcal{X}$, representing respectively the source and target distributions. Think of $\mu$ as the initial pile of earth and $\nu$ as the desired final configuration.

A **transport map** $T : \mathcal{X} \to \mathcal{X}$ pushes $\mu$ forward to $\nu$, meaning that for every measurable set $B$,

$$
\nu(B) = \mu(T^{-1}(B)).
$$

This is written $T_\sharp \mu = \nu$: the pushforward of $\mu$ under $T$ is $\nu$.

Given a cost function $c(x, y)$ measuring the cost of moving a unit of mass from $x$ to $y$, Monge's problem is:

$$
\inf_{T : T_\sharp \mu = \nu} \int_{\mathcal{X}} c(x, T(x))\, d\mu(x).
$$

This is elegant but problematic. The constraint $T_\sharp \mu = \nu$ is nonlinear (it is a PDE constraint on $T$). Worse, a transport map may not exist at all when $\mu$ is a discrete measure: you cannot split a point mass and send it to two different locations using a single map.


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

For costs satisfying suitable structural conditions, absolute continuity of $\mu$ can imply that an optimal Kantorovich plan is induced by a map. For the quadratic cost on $\mathbb{R}^d$, Brenier's theorem gives this conclusion: the optimal plan is supported on the graph of an optimal map $T$, and $\pi = (\operatorname{id},T)_\sharp\mu$.


## The Wasserstein Distance

For the cost function $c(x, y) = \lVert x - y \rVert^p$ with $p \geq 1$ on $\mathbb{R}^d$, the optimal transport cost defines the **$p$-Wasserstein distance**:

$$
W_p(\mu, \nu) = \left(\inf_{\pi \in \Pi(\mu, \nu)} \int \lVert x - y \rVert^p\, d\pi(x, y)\right)^{1/p}.
$$

The resulting $W_p$ is a genuine metric on the space of probability measures with finite $p$-th moment. It metrizes weak convergence of measures together with convergence of moments, which makes it stronger than the weak topology but weaker than total variation.

The case $p = 2$ is especially tractable. By Brenier's theorem (1991), when $\mu$ is absolutely continuous, the optimal transport map for the quadratic cost is the gradient of a convex function: $T = \nabla \varphi$ for some convex $\varphi : \mathbb{R}^d \to \mathbb{R}$. This characterization connects optimal transport to convex analysis and to the Monge-Ampère PDE:

$$
\det(D^2 \varphi(x)) = \frac{\rho_\mu(x)}{\rho_\nu(\nabla \varphi(x))},
$$

where $\rho_\mu$ and $\rho_\nu$ are the source and target densities. This formula requires sufficient regularity and positivity of the densities, together with the convexity of $\varphi$.

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

This measures pointwise amplitude discrepancy. For a translated profile $g(x)=f(x-\varepsilon)$, the $L^2$ distance depends on the overlap between the two profiles and tends to zero as $\varepsilon\to0$ for every $f\in L^2$. It can nevertheless remain large relative to the displacement when narrow, weakly overlapping features are shifted.

The Wasserstein distance records the displacement directly. If $\nu$ is the translation of a probability measure $\mu$ by a vector $a$, then $W_p(\mu,\nu)=\lVert a\rVert$. This can make Wasserstein distances useful for comparing normalized nonnegative signals whose geometry matters.

In seismic full-waveform inversion, suitably constructed optimal-transport misfits can have a wider basin of attraction than an $L^2$ misfit for translated signals. This can reduce cycle skipping in model problems. Seismic traces are signed and oscillatory, so the data must be transformed or compared with an unbalanced or signed transport formulation before a Wasserstein distance is applied.


## Computing Optimal Transport

For two discrete measures with $n$ support points each, the Kantorovich problem is a linear program with $n^2$ transport variables and $2n$ marginal constraints. The Hungarian algorithm applies to the special assignment problem with uniform atomic masses. General discrete transport uses network-flow, linear-programming, or regularized methods, and storing a dense $n\times n$ cost matrix is already prohibitive for large $n$.

**Entropic regularization.** Cuturi's 2013 paper introduced Sinkhorn's algorithm for optimal transport by adding an entropy term:

$$
\inf_{\pi \in \Pi(\mu, \nu)} \int c\,d\pi
+ \varepsilon\,\operatorname{KL}(\pi\,\|\,\mu\otimes\nu).
$$

For strictly positive Gibbs kernels in the discrete setting, the regularized problem has a unique coupling and Sinkhorn iterations compute its scaling factors. Each dense iteration costs $O(n^2)$. The iteration count and regularization bias depend on the cost scale, the desired accuracy, and $\varepsilon$; small values of $\varepsilon$ can cause slow convergence and numerical underflow. Stabilized and multiscale implementations extend the practical range of the method.

**Sliced Wasserstein distance.** For measures on $\mathbb{R}^d$ with large $d$, the Wasserstein distance is expensive even with Sinkhorn. The sliced Wasserstein distance averages one-dimensional Wasserstein distances over random projections:

$$
\operatorname{SW}_p(\mu,\nu)
= \left(\int_{S^{d-1}} W_p^p((\Pi_\theta)_\sharp\mu,(\Pi_\theta)_\sharp\nu)\,d\theta\right)^{1/p},
$$

where $\Pi_\theta$ is projection onto direction $\theta$ and the sphere measure is normalized. For empirical measures with equal weights, each one-dimensional Wasserstein distance is computed by sorting. Sliced Wasserstein is itself a metric under the usual moment assumptions. A Monte Carlo average over finitely many directions approximates the sphere integral.


## Connections to Other Areas I Work On

Optimal transport appears in several places adjacent to my research.

**Data misfit in inverse problems.** When the measured data has structure that the $L^2$ norm poorly captures (signal shifts, geometric features), a Wasserstein-based misfit is an alternative. The gradient of the Wasserstein misfit can be computed via the adjoint method I described in an earlier post, though the non-smoothness of $W_1$ requires care.

**Generative priors.** Learned priors for inverse problems often model the distribution of plausible solutions. Wasserstein distances provide a natural way to measure discrepancy between the model's output distribution and the training distribution, and to formulate the training objective in a way that is less sensitive to mode collapse than KL-divergence-based methods.

**Interpolation between measures.** The Wasserstein geodesic (the optimal interpolation between $\mu$ and $\nu$ under the $W_2$ metric) is the displacement interpolation: at time $t \in [0,1]$, the interpolated measure is $(T_t)_{\sharp} \mu$ where $T_t(x) = (1-t)x + tT(x)$. This provides a geometrically meaningful way to interpolate between conductivity distributions in EIT or between imaging data from different patients.

The theory is deep enough to occupy a career, and I am only beginning to understand it. But the connections to problems I care about are direct enough that I expect optimal transport to become a more central part of my toolkit over the next few years.
