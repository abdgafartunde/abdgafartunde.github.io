---
layout: post
title: "Krylov Methods: Solving Large Linear Systems Without Forming the Matrix"
description: "An introduction to Krylov subspace methods: the iterative solvers that make large-scale scientific computing possible, and why they work so well for the linear systems that arise in inverse problems and PDE discretizations."
date: 2026-09-07
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Scientific Computing, Numerical Methods]
math: true
---

Almost every large-scale computation in scientific computing eventually reduces to solving a linear system $Ax = b$. Whether the system comes from discretizing a PDE, from the normal equations of a least-squares problem, from the linearization step in a Newton iteration, or from the regularized inversion of a forward operator: the core computational task is the same.

For dense systems, Gaussian elimination requires $O(n^3)$ operations and $O(n^2)$ storage. Sparse direct methods can be much cheaper and remain effective for many moderate-sized problems, but fill-in can make their memory and computational costs prohibitive for large three-dimensional PDE systems. Problems in image reconstruction or seismic inversion may have millions of unknowns, so matrix-free iterative methods are often the practical choice.

Among iterative solvers, **Krylov subspace methods** are widely used because they require matrix-vector products and can exploit sparse or matrix-free operators. Their performance still depends on the matrix structure, stopping criterion, and preconditioner.

## The Krylov Subspace

Given an initial guess $x_0$ with residual $r_0=b-Ax_0$, the **Krylov subspace** of order $k$ is

$$
\mathcal{K}_k(A, r_0) = \operatorname{span}\{r_0, \, Ar_0, \, A^2 r_0, \, \ldots, \, A^{k-1} r_0\}.
$$

A Krylov method seeks an approximate solution in the affine space $x_0+\mathcal{K}_k(A,r_0)$. The meaning of "best" depends on the method: CG minimizes the energy norm of the error, while GMRES minimizes the Euclidean norm of the residual.

The key insight is that each successive Krylov subspace can be built from the previous one by multiplying by $A$, one matrix-vector product per iteration. You never need to form or store $A$ explicitly; you only need to compute matrix-vector products $A v$ for given vectors $v$. For sparse matrices arising from PDE discretizations, each product takes $O(n)$ or $O(n \log n)$ operations. This is what makes Krylov methods scalable.

## The Conjugate Gradient Method

For symmetric positive definite (SPD) matrices, the **conjugate gradient** (CG) method is optimal among Krylov methods. It minimizes the $A$-norm of the error over the Krylov subspace:

$$
x_k = \arg\min_{x \in x_0+\mathcal{K}_k(A,r_0)} \|x - x^*\|_A, \quad \|v\|_A^2 = v^\top A v.
$$

The iteration is:

$$
\begin{aligned}
r_0 &= b - Ax_0, \quad p_0 = r_0 \\
\alpha_k &= \frac{r_k^\top r_k}{p_k^\top A p_k} \\
x_{k+1} &= x_k + \alpha_k p_k \\
r_{k+1} &= r_k - \alpha_k A p_k \\
\beta_k &= \frac{r_{k+1}^\top r_{k+1}}{r_k^\top r_k} \\
p_{k+1} &= r_{k+1} + \beta_k p_k
\end{aligned}
$$

Each iteration requires one matrix-vector product $Ap_k$, two inner products, and a few vector additions. For a system of size $n$, the exact solution is reached in at most $n$ iterations in exact arithmetic. The standard worst-case bound implies $O(\sqrt{\kappa}\log(1/\varepsilon))$ iterations to reduce the energy-norm error by a factor $\varepsilon$, where $\kappa = \lambda_{\max}/\lambda_{\min}$. For preconditioned CG, $\kappa$ refers to the appropriately preconditioned SPD operator.

## Convergence and the Eigenvalue Distribution

The convergence of CG depends on the spectrum of $A$. If $A$ has $m$ distinct eigenvalues, CG converges in at most $m$ steps in exact arithmetic. More practically, if the eigenvalues are clustered into a few groups, CG can converge rapidly because a polynomial of low degree can be small on the eigenvalue clusters simultaneously.

This geometric picture (that Krylov methods implicitly find a polynomial that is small on the spectrum of $A$) unifies all Krylov methods. The differences between methods (CG, MINRES, GMRES, BiCGSTAB) correspond to different choices of what "small" means and what structure the polynomial is required to respect.

## Non-Symmetric Systems: GMRES

When $A$ is not symmetric, CG is not applicable. The most widely used alternative is **GMRES** (generalized minimal residual method), which minimizes the 2-norm of the residual over the Krylov subspace:

$$
x_k = \arg\min_{x \in x_0+\mathcal{K}_k(A,r_0)} \|b - Ax\|_2.
$$

GMRES builds an orthonormal basis for the Krylov subspace using the Arnoldi process (a Gram-Schmidt orthogonalization against all previous basis vectors), then solves a small least-squares problem in this basis. The price is memory: GMRES stores all $k$ basis vectors, so restarting (GMRES(m)) is often used in practice to bound memory use.

GMRES is commonly used for nonsymmetric systems arising from convection-diffusion equations, linearized fluid equations, and nonsymmetric Jacobian systems.

## Preconditioning

For SPD systems, condition number and eigenvalue clustering provide useful CG convergence information. For nonsymmetric and nonnormal systems, the condition number alone is insufficient to predict GMRES convergence; spectral geometry and nonnormality also matter. Many PDE-derived systems become harder to solve as the mesh is refined, making unpreconditioned iterations impractically slow.

**Preconditioning** transforms the system into one that is easier for the selected iterative method. Given a nonsingular preconditioner $P \approx A$, the left-preconditioned system $P^{-1}Ax = P^{-1}b$ has the same solution. A useful preconditioner is cheap to apply and improves the spectral or field-of-values properties relevant to convergence; a smaller condition number is not guaranteed for every nonsymmetric problem.

Common preconditioners include:

- **Incomplete LU (ILU):** a sparse approximate factorization of $A$, dropping fill-in below a threshold. Cheap to apply, often effective for mildly ill-conditioned problems.
- **Multigrid:** a hierarchical solver that operates on a sequence of coarser and coarser grids. For elliptic PDEs, optimal multigrid preconditioners give $\kappa(P^{-1}A) = O(1)$ independently of the mesh size; this is essentially optimal and is the reason large-scale CFD and structural analysis codes use multigrid.
- **Block preconditioners:** for saddle-point systems (e.g., the linearized Navier-Stokes equations, or regularized least-squares systems in inverse problems), block-diagonal or block-triangular preconditioners exploit the block structure.

The design of good preconditioners for specific problem classes is itself a significant research area.

## Krylov Methods in Inverse Problems

In computational inverse problems, Krylov methods appear in several places:

**Regularized normal equations.** Tikhonov regularization of a linear inverse problem $Au \approx b$ leads to the normal equations $(A^\top A + \alpha L^\top L)u = A^\top b$. For $\alpha>0$, this matrix is SPD when $\ker(A)\cap\ker(L)=\{0\}$. In that case CG applies. The matrix need not be formed explicitly; products with $A$, $A^\top$, $L$, and $L^\top$ are sufficient.

**Iterative regularization.** CG applied to a linear inverse problem (without explicit regularization) has a regularizing effect: early stopping acts as regularization, since the Krylov subspace captures the dominant singular components of $A$ before the noise-dominated ones. This is the basis of the CGLS and LSQR algorithms.

**Inexact Newton methods.** In nonlinear inverse problems, each Newton step requires solving a linearized system. CG is appropriate for SPD Gauss-Newton or regularized normal equations, while GMRES is used for nonsymmetric linearizations. Truncating the inner solve according to a forcing rule can reduce computation while preserving outer convergence.

**Operator preconditioning.** In function-space formulations of inverse problems (the Bayesian framework, or the Tikhonov formulation in Hilbert spaces), the preconditioner is typically the prior covariance or regularization operator. Applying it requires solving another PDE or working with the SPDE approximation to the GP prior, and this inner solve is also done iteratively.

The combination of Krylov methods with good preconditioners is what makes large-scale inverse problems computationally feasible. Without scalable iterative solvers, the algorithms I work on in EIT reconstruction and PDE-constrained optimization would be limited to toy problems.

For algorithm descriptions and guidance on matching methods to matrix structure, see Barrett et al., [*Templates for the Solution of Linear Systems*](https://www.netlib.org/templates/templates.pdf).
