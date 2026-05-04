---
layout: post
title: "Primal-Dual Methods for Convex Optimization"
description: "How saddle-point formulations and primal-dual splitting algorithms handle the non-smooth objectives that arise in imaging and inverse problems; total variation regularization requires going beyond gradient descent."
date: 2026-08-24
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Optimization, Inverse Problems, Scientific Computing]
math: true
---

Gradient descent is the workhorse of smooth optimization, and much of machine learning runs on it or variants of it. But the objectives that arise naturally in imaging and inverse problems are often not smooth. Total variation regularization, $\ell^1$ norms, indicator functions of convex sets: these are non-differentiable, and gradient descent simply does not apply.

The standard workaround is to replace the non-smooth term with a smooth approximation. This works, but it introduces a smoothing parameter that must be tuned and that alters the problem being solved. For applications where the non-smooth structure matters (edge-preserving regularization, exact sparsity, or hard constraints), this is not ideal.

Primal-dual methods offer an alternative: algorithms designed specifically for non-smooth convex objectives that converge to the exact solution of the original problem. They are the basis of the optimization algorithms I use in my own EIT reconstruction work, and understanding their structure is useful for anyone working on imaging or variational inverse problems.

## The Setting: Composite Convex Minimization

The problems we want to solve have the form

$$
\min_{u \in \mathcal{X}} \; F(Ku) + G(u),
$$

where $\mathcal{X}$ is a Hilbert space, $K: \mathcal{X} \to \mathcal{Y}$ is a bounded linear operator, $F: \mathcal{Y} \to \mathbb{R} \cup \{+\infty\}$ and $G: \mathcal{X} \to \mathbb{R} \cup \{+\infty\}$ are proper, convex, lower-semicontinuous functions.

For Tikhonov regularization with total variation: $u$ is the unknown image, $G(u) = \frac{\alpha}{2}\|Au - b\|^2$ is the data fidelity term (smooth), and $F(Ku) = \|Ku\|_1$ where $K = \nabla$ is the gradient operator and the $\ell^1$ norm of the gradient field is the total variation. Neither term alone is the problem; it is their combination through the linear operator that creates the difficulty.

## The Saddle-Point Reformulation

The key idea of primal-dual methods is to reformulate the composite minimization as a **saddle-point problem**. Using the Fenchel conjugate $F^*$ (defined as $F^*(y) = \sup_z \langle z, y \rangle - F(z)$), we have

$$
F(Ku) = \sup_{p \in \mathcal{Y}} \; \langle Ku, p \rangle - F^*(p).
$$

Substituting:

$$
\min_{u} \; F(Ku) + G(u) = \min_u \max_p \; \langle Ku, p \rangle - F^*(p) + G(u).
$$

This saddle-point formulation introduces a **dual variable** $p$. The primal problem is the original minimization over $u$; the dual variable $p$ lives in the dual space $\mathcal{Y}^*$.

For total variation with the $\ell^1$ norm, the Fenchel conjugate is the indicator function of the unit ball: $F^*(p) = \iota_{\|p\|_\infty \leq 1}(p)$, which is zero if $\|p\|_\infty \leq 1$ and $+\infty$ otherwise. The dual variable $p$ is a vector field constrained to lie in the $\ell^\infty$ unit ball.

## The Primal-Dual Hybrid Gradient Algorithm

The **primal-dual hybrid gradient** (PDHG) algorithm, introduced by Chambolle and Pock (2011), solves the saddle-point problem by alternating proximal steps in the primal and dual variables:

$$
\begin{aligned}
p^{k+1} &= \mathrm{prox}_{\sigma F^*}\!\left(p^k + \sigma K \bar{u}^k\right) \\
u^{k+1} &= \mathrm{prox}_{\tau G}\!\left(u^k - \tau K^\top p^{k+1}\right) \\
\bar{u}^{k+1} &= u^{k+1} + \theta(u^{k+1} - u^k)
\end{aligned}
$$

where $\sigma, \tau > 0$ are step sizes, $\theta \in [0, 1]$ is an over-relaxation parameter (typically $\theta = 1$), and $\bar{u}$ is an extrapolated ("looking ahead") version of $u$.

The proximal operator $\mathrm{prox}_{\lambda f}(v) = \arg\min_u \frac{1}{2}\|u - v\|^2 + \lambda f(u)$ is the key computational primitive. For many common functions, it has a closed-form expression:

- **$F^* = \iota_{\|p\|_\infty \leq 1}$** (total variation): $\mathrm{prox}_{\sigma F^*}(q) = q / \max(1, |q|)$, the pointwise projection onto the $\ell^\infty$ ball. This is the TV proximal step.
- **$G(u) = \frac{1}{2}\|Au - b\|^2$** (least-squares fidelity): the proximal operator is $(I + \tau A^\top A)^{-1}(u + \tau A^\top b)$, which requires solving a linear system. For small problems this is direct; for large problems this inner solve is done iteratively (often with CG, linking back to the previous post).
- **$G = \iota_C$** (indicator of a convex set $C$): $\mathrm{prox}$ is projection onto $C$.

## Convergence

Under the condition $\sigma \tau \|K\|^2 < 1$, PDHG converges for any convex $F$ and $G$. The convergence rate is $O(1/N)$ in the ergodic sense (for the running average), and $O(1/N^2)$ for strongly convex $G$ or $F^*$. These rates are optimal for first-order methods applied to this problem class.

The algorithm requires only:
- Matrix-vector products with $K$ and $K^\top$ (never the full matrix)
- Proximal operators of $F^*$ and $G$ separately
- No joint evaluation of $F$ and $G$ together

This separation is the key to handling composite non-smooth objectives: by working with $F$ and $G$ separately, PDHG avoids having to differentiate through their composition.

## Extensions and Variants

**Multiple non-smooth terms.** Many imaging problems have more than two terms: data fidelity + TV + a positivity constraint, for instance. The Douglas-Rachford splitting and ADMM (alternating direction method of multipliers) handle multiple terms by introducing one dual variable per term and alternating proximal steps. ADMM in particular has become extremely popular in signal processing and statistics.

**Strongly convex acceleration.** When one or both of $F, G$ is strongly convex, PDHG can be accelerated to achieve $O(1/N^2)$ convergence even in the non-strongly-convex regime, by using an adaptive step size strategy.

**Nonlinear extensions.** For non-convex problems (which arise in nonlinear inverse problems), primal-dual methods can still be applied as heuristics or extended via linearization strategies. In my EIT reconstruction work, I use a linearize-and-solve approach: the nonlinear forward operator is linearized around the current iterate, and the resulting quadratic subproblem is solved with PDHG. This is a Gauss-Newton outer loop with PDHG as the inner solver.

## Why This Matters for Inverse Problems

In regularized inversion, the choice of regularizer is a modelling choice: it encodes prior belief about the structure of the unknown. Total variation says the unknown is piecewise smooth with sharp edges. The $\ell^1$ norm of coefficients in a dictionary says the unknown is sparse in that dictionary. These structural priors frequently reflect genuine knowledge about the problem, and they happen to be non-smooth.

Primal-dual methods are the natural algorithmic framework for exploiting these priors without approximation. They handle the non-smoothness directly, converge to the exact regularized solution, and require only matrix-vector products with the forward operator and its adjoint, exactly what is available in most inverse problem settings.

The combination of variational regularization with primal-dual algorithms is, in my view, one of the most useful and underappreciated toolsets in computational mathematics. It is worth understanding well.
