---
layout: post
title: "ADMM and Operator Splitting: Decomposing Hard Problems"
description: "How the alternating direction method of multipliers and related operator-splitting techniques break large, non-smooth optimization problems into tractable subproblems."
date: 2026-05-18
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Optimization, Inverse Problems]
math: true
---

Variational methods for inverse problems produce optimization problems that are, in general, large, non-smooth, and sometimes non-convex. The challenge is not writing down the functional; it is computing its minimizer efficiently. Many of the most effective algorithms for this are built on a single idea: *decomposition*. Break the hard problem into smaller, simpler subproblems that can be solved cheaply, and then coordinate the solutions to converge to the answer to the original problem.

Operator splitting methods formalize this idea. The alternating direction method of multipliers (ADMM) is the most widely used instance, but it belongs to a broader family that includes the Split Bregman method, Douglas-Rachford splitting, and the PDHG algorithm I discussed in the [variational methods post](/2026/04/20/variational-methods-image-reconstruction/). This post develops the ideas from first principles and describes why they work so well in practice.


## The Core Difficulty: Non-Smoothness

The total variation functional $\operatorname{TV}(f) = \int_\Omega |\nabla f|\, dx$ is convex but not differentiable at points where $\nabla f = 0$. This is not a minor inconvenience. Most of the solutions we care about in imaging are piecewise constant or piecewise smooth, and the set of such functions is dense in the non-differentiable points of TV. Standard gradient descent simply does not apply.

One response is smoothing: replace $|\nabla f|$ with $\sqrt{|\nabla f|^2 + \varepsilon}$ for small $\varepsilon > 0$. The smoothed functional is differentiable, and gradient descent applies. But the smoothing introduces bias — the minimizer of the smoothed problem is not the minimizer of the original — and decreasing $\varepsilon$ to reduce the bias requires increasingly small step sizes, which slows convergence.

The correct response is to embrace the non-smoothness and use algorithms designed for it. Operator splitting is the principled way to do this.


## Variable Splitting and the Augmented Lagrangian

The key technique is *variable splitting*. Consider the ROF problem:

$$
\min_f \; \frac{1}{2}\lVert f - g^\delta \rVert^2 + \alpha \operatorname{TV}(f).
$$

Introduce an auxiliary variable $v = \nabla f$ and rewrite the problem as:

$$
\min_{f,\, v} \; \frac{1}{2}\lVert f - g^\delta \rVert^2 + \alpha \lVert v \rVert_1 \quad \text{subject to} \quad v = \nabla f,
$$

where $\lVert v \rVert_1 = \int_\Omega |v(x)|\, dx$ is the $L^1$ norm of the vector field $v$. The constraint $v = \nabla f$ enforces equivalence with the original. The benefit is that the two terms in the objective are now *separated*: the data fidelity depends only on $f$, and the TV term depends only on $v$.

To handle the constraint, form the augmented Lagrangian:

$$
\mathcal{L}_\rho(f, v, \lambda) = \frac{1}{2}\lVert f - g^\delta \rVert^2 + \alpha \lVert v \rVert_1 + \langle \lambda, v - \nabla f \rangle + \frac{\rho}{2}\lVert v - \nabla f \rVert^2,
$$

where $\lambda$ is the Lagrange multiplier (a vector field) and $\rho > 0$ is a penalty parameter. The quadratic term $\frac{\rho}{2}\lVert v - \nabla f \rVert^2$ penalises constraint violation and stabilises the iterations; this is what distinguishes the augmented Lagrangian from the standard Lagrangian.


## The ADMM Algorithm

The ADMM updates each variable in turn, holding the others fixed, and then updates the Lagrange multiplier. For the problem above, the three steps are:

$$
f^{n+1} = \arg\min_f \; \frac{1}{2}\lVert f - g^\delta \rVert^2 + \langle \lambda^n, -\nabla f \rangle + \frac{\rho}{2}\lVert v^n - \nabla f \rVert^2,
$$

$$
v^{n+1} = \arg\min_v \; \alpha \lVert v \rVert_1 + \langle \lambda^n, v \rangle + \frac{\rho}{2}\lVert v - \nabla f^{n+1} \rVert^2,
$$

$$
\lambda^{n+1} = \lambda^n + \rho\,(v^{n+1} - \nabla f^{n+1}).
$$

Each subproblem is much easier than the original:

**The $f$-update** is a quadratic problem. Completing the square and differentiating gives:

$$
(I - \rho\, \Delta) f^{n+1} = g^\delta + \operatorname{div}(\lambda^n) + \rho\, \operatorname{div}(v^n),
$$

where $\Delta$ is the Laplacian. This is a linear system that can be solved efficiently using FFTs (on regular grids) or sparse direct solvers. The cost is $O(N \log N)$ per iteration for an $N$-pixel image, which is fast.

**The $v$-update** decouples pointwise. After completing the square, it reduces to the proximal operator of $\alpha\lVert \cdot \rVert_1$:

$$
v^{n+1}(x) = \operatorname{shrink}\!\left(\nabla f^{n+1}(x) - \frac{\lambda^n(x)}{\rho},\; \frac{\alpha}{\rho}\right),
$$

where the soft-thresholding (shrinkage) operator is:

$$
\operatorname{shrink}(u,\, \tau) = \frac{u}{|u|}\max(|u| - \tau,\, 0).
$$

This is an $O(N)$ operation applied independently at each pixel.

**The $\lambda$-update** is an explicit formula requiring no minimization.

The full iteration costs $O(N \log N)$ per step (dominated by the $f$-update), which is remarkably cheap for a non-smooth optimization problem.

### Convergence

For convex problems where both $f$ and $v$ objectives are convex and one is strongly convex, ADMM converges to the global minimizer. The convergence rate is $O(1/n)$ in the primal-dual gap, the same as the PDHG algorithm. The penalty parameter $\rho$ affects the practical convergence speed but not the theoretical guarantees.

Choosing $\rho$ well matters in practice. A large $\rho$ enforces the constraint strongly, making the $v$-update easy (small threshold) but the $f$-update harder (the linear system is better conditioned but the solution is closer to just $g^\delta$). A small $\rho$ does the reverse. Adaptive schemes that adjust $\rho$ based on the primal and dual residuals work well in practice: increase $\rho$ when the primal residual is much larger than the dual, and decrease it otherwise.


## The Split Bregman Method

The Split Bregman method, introduced by Goldstein and Osher in 2009, is closely related to ADMM and is sometimes preferred in the imaging community. The key difference is in how the constraint is incorporated.

Instead of the augmented Lagrangian, Split Bregman uses the *Bregman iteration*. The idea is to iteratively solve a sequence of subproblems:

$$
f^{n+1} = \arg\min_f \; \frac{1}{2}\lVert f - g^\delta \rVert^2 + \frac{\rho}{2}\lVert \nabla f - v^n + b^n \rVert^2,
$$

$$
v^{n+1} = \operatorname{shrink}\!\left(\nabla f^{n+1} + b^n,\; \frac{\alpha}{\rho}\right),
$$

$$
b^{n+1} = b^n + \nabla f^{n+1} - v^{n+1}.
$$

The variable $b$ plays the role of the rescaled Lagrange multiplier $\lambda/\rho$ in ADMM. The subproblems are identical in structure to ADMM, and for the ROF model the two methods produce exactly the same iterates (with appropriate identification of variables). The Split Bregman formulation is often found to be more transparent in the imaging literature because the Bregman update $b \leftarrow b + \nabla f - v$ has a clear interpretation: it accumulates the cumulative constraint violation, guiding future iterates to satisfy the constraint.


## Generalizations

ADMM generalises naturally to problems with more than two blocks of variables. For a problem of the form

$$
\min_{f_1, \ldots, f_m} \; \sum_{i=1}^m g_i(f_i) \quad \text{subject to} \quad \sum_{i=1}^m A_i f_i = b,
$$

the multi-block ADMM cycles through the blocks, updating each in turn while holding the others fixed. This handles complex regularization strategies that combine multiple terms — for example, TV plus a sparsity penalty in a wavelet frame — by separating them into different blocks, each with a cheap proximal step.

For nonlinear forward operators $\mathcal{A}$, the $f$-update becomes a nonlinear least-squares problem rather than a linear system. Linearising around the current iterate (Gauss-Newton style) restores a linear solve per step, at the cost of an inner iteration. This linearized ADMM is effective for mildly nonlinear problems like EIT, where the forward operator is Fréchet differentiable and the Jacobian is available.


## Douglas-Rachford Splitting

At a deeper level, ADMM is a special case of the *Douglas-Rachford* (DR) splitting algorithm applied to a dual problem. This connection is mathematically clean and explains why ADMM works.

For a problem of the form $\min_f F(f) + G(f)$, Douglas-Rachford splitting maintains a variable $z$ and iterates:

$$
f^{n+1} = \operatorname{prox}_{\tau F}(z^n),
$$

$$
y^{n+1} = \operatorname{prox}_{\tau G}(2f^{n+1} - z^n),
$$

$$
z^{n+1} = z^n + y^{n+1} - f^{n+1}.
$$

Convergence holds whenever both $F$ and $G$ are proper, convex, and lower semi-continuous — a very weak condition. The proximal operators of $F$ and $G$ need not be easy to compute analytically, but as long as they can be computed efficiently, DR splitting converges.

The connection to ADMM is that the DR splitting on the dual of the split problem reproduces the ADMM iterations. This dual viewpoint explains why ADMM is robust: it is essentially performing proximal-point iterations on the dual problem, which has strong convergence guarantees.


## In My Work

I use ADMM and Split Bregman extensively for EIT reconstruction problems. The forward problem is nonlinear, so I linearise around the current conductivity estimate at each outer iteration and solve the resulting quadratic subproblem with a few steps of ADMM. The inner ADMM is warm-started from the previous outer iterate, and the convergence is fast because the linearised problem is well-posed.

The advantage of ADMM over the primal-dual hybrid gradient (Chambolle-Pock) algorithm depends on the problem. For problems where one subproblem has a closed-form solution and the other requires an iterative solver, ADMM allows more flexibility in how many inner iterations you run. For problems where both subproblems are cheap (like the ROF model), PDHG is competitive and sometimes preferable because of its simpler parameter tuning.

What these methods share is the commitment to preserving the structure of the problem rather than smoothing it away. Non-smoothness is not an obstacle; it is exploited. The discontinuities that TV regularization creates in the solution are exactly the edges we are trying to recover, and the algorithm is designed to find them without introduction of spurious artefacts.
