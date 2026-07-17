---
layout: post
title: "Primal-Dual Methods for Convex Optimization"
description: "How saddle-point formulations and primal-dual splitting algorithms handle the non-smooth objectives that arise in imaging and inverse problems; total variation regularization requires going beyond gradient descent."
date: 2026-10-05
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

where $\mathcal{X}$ and $\mathcal{Y}$ are Hilbert spaces, $K: \mathcal{X} \to \mathcal{Y}$ is a bounded linear operator, and $F: \mathcal{Y} \to \mathbb{R} \cup \{+\infty\}$ and $G: \mathcal{X} \to \mathbb{R} \cup \{+\infty\}$ are proper, convex, lower semicontinuous functions.

For variational reconstruction with total variation, $u$ is the unknown image, $G(u) = \frac{1}{2}\|Au - b\|^2$ is the data-fidelity term, $K = \nabla$ is the gradient operator, and $F(z)=\alpha\|z\|_1$. Thus $F(Ku)=\alpha\|\nabla u\|_1$. The operator composition and nonsmooth regularizer make ordinary gradient descent inapplicable.

## The Saddle-Point Reformulation

The key idea of primal-dual methods is to reformulate the composite minimization as a **saddle-point problem**. Using the Fenchel conjugate $F^*$ (defined as $F^*(y) = \sup_z \langle z, y \rangle - F(z)$), we have

$$
F(Ku) = \sup_{p \in \mathcal{Y}} \; \langle Ku, p \rangle - F^*(p).
$$

Substituting:

$$
\min_{u} \; F(Ku) + G(u) = \min_u \max_p \; \langle Ku, p \rangle - F^*(p) + G(u).
$$

This saddle-point formulation introduces a **dual variable** $p$. In a Hilbert space, the Riesz representation identifies $\mathcal{Y}$ with its dual, which is why the same space appears in the supremum.

For $F(z)=\alpha\|z\|_1$, the Fenchel conjugate is the indicator function $F^*(p)=\iota_{\|p\|_\infty\leq\alpha}(p)$. The dual variable is therefore constrained to the corresponding pointwise dual-norm ball. For isotropic TV, the norm at each pixel is the Euclidean norm of the discrete gradient vector.

## The Primal-Dual Hybrid Gradient Algorithm

The **primal-dual hybrid gradient** (PDHG) algorithm, introduced by Chambolle and Pock (2011), solves the saddle-point problem by alternating proximal steps in the primal and dual variables:

$$
\begin{aligned}
p^{k+1} &= \mathrm{prox}_{\sigma F^*}\!\left(p^k + \sigma K \bar{u}^k\right) \\
u^{k+1} &= \mathrm{prox}_{\tau G}\!\left(u^k - \tau K^* p^{k+1}\right) \\
\bar{u}^{k+1} &= u^{k+1} + \theta(u^{k+1} - u^k)
\end{aligned}
$$

where $\sigma, \tau > 0$ are step sizes, $\theta \in [0, 1]$ is an over-relaxation parameter (typically $\theta = 1$), and $\bar{u}$ is an extrapolated ("looking ahead") version of $u$.

The proximal operator $\mathrm{prox}_{\lambda f}(v) = \arg\min_u \frac{1}{2}\|u - v\|^2 + \lambda f(u)$ is the key computational primitive. For many common functions, it has a closed-form expression:

- **$F^* = \iota_{\|p\|_\infty \leq \alpha}$** (total variation): for isotropic TV, $\mathrm{prox}_{\sigma F^*}(q) = q / \max(1, \lvert q \rvert/\alpha)$ pointwise, where $\lvert q \rvert$ is the Euclidean norm of the local gradient vector. The result is the projection onto the dual ball.
- **$G(u) = \frac{1}{2}\|Au - b\|^2$** (least-squares fidelity): the proximal operator is $(I + \tau A^\top A)^{-1}(u + \tau A^\top b)$, which requires solving a linear system. For small problems this is direct; for large problems this inner solve is done iteratively (often with CG, linking back to the previous post).
- **$G = \iota_C$** (indicator of a convex set $C$): $\mathrm{prox}$ is projection onto $C$.

## Convergence

Assume that the saddle-point problem has a solution. For the standard Chambolle-Pock update with $\theta=1$, the condition $\sigma\tau\|K\|^2<1$ gives convergence, and the ergodic primal-dual gap decays as $O(1/N)$ under the usual finite-dimensional assumptions. When the primal or dual objective is uniformly convex, modified accelerated step-size rules can improve the corresponding rate to $O(1/N^2)$. Linear rates require stronger assumptions on both sides.

The algorithm requires only:
- Operator products with $K$ and $K^*$, without forming a dense matrix
- Proximal operators of $F^*$ and $G$ separately
- No joint evaluation of $F$ and $G$ together

This separation is the key to handling composite non-smooth objectives: by working with $F$ and $G$ separately, PDHG avoids having to differentiate through their composition.

## Extensions and Variants

**Multiple nonsmooth terms.** An objective containing data fidelity, TV, and a positivity constraint can be lifted to a product space with one operator block per composite term. Primal-dual splitting, Douglas-Rachford splitting, and ADMM provide different ways to handle the resulting structure; their updates and convergence assumptions are not interchangeable.

**Strongly convex acceleration.** When the primal or dual objective is uniformly convex, PDHG can use iteration-dependent primal and dual step sizes to obtain an accelerated $O(1/N^2)$ rate for the relevant error measure. Without strong convexity, the general ergodic gap rate remains $O(1/N)$.

**Nonlinear extensions.** For non-convex problems (which arise in nonlinear inverse problems), primal-dual methods can still be applied as heuristics or extended via linearization strategies. In my EIT reconstruction work, I use a linearize-and-solve approach: the nonlinear forward operator is linearized around the current iterate, and the resulting quadratic subproblem is solved with PDHG. This is a Gauss-Newton outer loop with PDHG as the inner solver.

## Why This Matters for Inverse Problems

In regularized inversion, the choice of regularizer is a modelling choice: it encodes prior belief about the structure of the unknown. Total variation says the unknown is piecewise smooth with sharp edges. The $\ell^1$ norm of coefficients in a dictionary says the unknown is sparse in that dictionary. These structural priors frequently reflect genuine knowledge about the problem, and they happen to be non-smooth.

Primal-dual methods handle nonsmooth terms without replacing them by smooth approximations. Under their convergence assumptions, the iterates approach a minimizer of the regularized objective. Implementations use operator evaluations, adjoints, and separate proximal maps or proximal subproblem solves.

The combination of variational regularization with primal-dual algorithms is, in my view, one of the most useful and underappreciated toolsets in computational mathematics. It is worth understanding well.

The convergence statements above follow Chambolle and Pock, ["A first-order primal-dual algorithm for convex problems with applications to imaging"](https://doi.org/10.1007/s10851-010-0251-1).
