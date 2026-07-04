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

For small systems, Gaussian elimination (LU factorization) is optimal. But in scientific computing, "small" means something like $n \lesssim 10^4$. Beyond that, direct methods face two problems: the factorization takes $O(n^3)$ operations, and the factored matrices require $O(n^2)$ storage. For the systems that arise in 3D PDE discretizations, image reconstruction, or seismic inversion, $n$ can be $10^6$ to $10^9$. Direct methods are simply not viable.

Iterative methods solve this. Among them, **Krylov subspace methods** are the most important family: they are faster, more memory-efficient, and better understood theoretically than alternatives. This post explains how they work and why they are the solver of choice across scientific computing.

## The Krylov Subspace

Given a matrix $A$ and a right-hand side $b$, the **Krylov subspace** of dimension $k$ is

$$
\mathcal{K}_k(A, b) = \text{span}\{b, \, Ab, \, A^2 b, \, \ldots, \, A^{k-1} b\}.
$$

A Krylov method seeks an approximate solution $x_k$ that is the best vector (in some sense) in $\mathcal{K}_k(A, b)$, then $\mathcal{K}_{k+1}(A, b)$, and so on, until the residual $\|b - Ax_k\|$ is small enough.

The key insight is that each successive Krylov subspace can be built from the previous one by multiplying by $A$, one matrix-vector product per iteration. You never need to form or store $A$ explicitly; you only need to compute matrix-vector products $A v$ for given vectors $v$. For sparse matrices arising from PDE discretizations, each product takes $O(n)$ or $O(n \log n)$ operations. This is what makes Krylov methods scalable.

## The Conjugate Gradient Method

For symmetric positive definite (SPD) matrices, the **conjugate gradient** (CG) method is optimal among Krylov methods. It minimizes the $A$-norm of the error over the Krylov subspace:

$$
x_k = \arg\min_{x \in \mathcal{K}_k(A,b)} \|x - x^*\|_A^2, \quad \|v\|_A^2 = v^\top A v.
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

Each iteration requires one matrix-vector product $Ap_k$, two inner products, and a few vector additions. For a system of size $n$, the exact solution is reached in at most $n$ iterations (in exact arithmetic). In practice, with preconditioning, convergence to any desired tolerance typically takes $O(\sqrt{\kappa})$ iterations, where $\kappa = \lambda_{\max}/\lambda_{\min}$ is the condition number of $A$.

## Convergence and the Eigenvalue Distribution

The convergence of CG depends on the spectrum of $A$. If $A$ has $m$ distinct eigenvalues, CG converges in exactly $m$ steps. More practically, if the eigenvalues are clustered into a few groups, CG converges rapidly because a polynomial of low degree can be small on all the eigenvalue clusters simultaneously.

This geometric picture (that Krylov methods implicitly find a polynomial that is small on the spectrum of $A$) unifies all Krylov methods. The differences between methods (CG, MINRES, GMRES, BiCGSTAB) correspond to different choices of what "small" means and what structure the polynomial is required to respect.

## Non-Symmetric Systems: GMRES

When $A$ is not symmetric, CG is not applicable. The most widely used alternative is **GMRES** (generalized minimal residual method), which minimizes the 2-norm of the residual over the Krylov subspace:

$$
x_k = \arg\min_{x \in \mathcal{K}_k(A,b)} \|b - Ax\|_2.
$$

GMRES builds an orthonormal basis for the Krylov subspace using the Arnoldi process (a Gram-Schmidt orthogonalization against all previous basis vectors), then solves a small least-squares problem in this basis. The price is memory: GMRES stores all $k$ basis vectors, so restarting (GMRES(m)) is often used in practice to bound memory use.

For the systems arising from non-symmetric PDE discretizations (convection-diffusion equations, the linearized Navier-Stokes equations, EIT with nonsymmetric regularizers), GMRES is the standard choice.

## Preconditioning

The convergence of Krylov methods depends critically on the condition number $\kappa(A)$. For many PDE-derived systems, $\kappa$ grows as the mesh is refined, making unpreconditioned Krylov methods impractically slow on fine grids.

**Preconditioning** transforms the system to one with a better-conditioned matrix. Given a preconditioner $P \approx A$, the preconditioned system $P^{-1}Ax = P^{-1}b$ has the same solution but a smaller condition number. The preconditioner must be cheap to apply (solving $Py = v$ must be fast) and effective (the eigenvalues of $P^{-1}A$ must be well-clustered).

Common preconditioners include:

- **Incomplete LU (ILU):** a sparse approximate factorization of $A$, dropping fill-in below a threshold. Cheap to apply, often effective for mildly ill-conditioned problems.
- **Multigrid:** a hierarchical solver that operates on a sequence of coarser and coarser grids. For elliptic PDEs, optimal multigrid preconditioners give $\kappa(P^{-1}A) = O(1)$ independently of the mesh size; this is essentially optimal and is the reason large-scale CFD and structural analysis codes use multigrid.
- **Block preconditioners:** for saddle-point systems (e.g., the linearized Navier-Stokes equations, or regularized least-squares systems in inverse problems), block-diagonal or block-triangular preconditioners exploit the block structure.

The design of good preconditioners for specific problem classes is itself a significant research area.

## Krylov Methods in Inverse Problems

In computational inverse problems, Krylov methods appear in several places:

**Regularized normal equations.** Tikhonov regularization of a linear inverse problem $Au \approx b$ leads to the normal equations $(A^\top A + \alpha L^\top L)u = A^\top b$. The matrix $A^\top A + \alpha L^\top L$ is SPD for any $\alpha > 0$, so CG applies. The matrix need never be formed explicitly; only matrix-vector products with $A$ and $A^\top$ are needed.

**Iterative regularization.** CG applied to a linear inverse problem (without explicit regularization) has a regularizing effect: early stopping acts as regularization, since the Krylov subspace captures the dominant singular components of $A$ before the noise-dominated ones. This is the basis of the CGLS and LSQR algorithms.

**Inexact Newton methods.** In nonlinear inverse problems, each Newton step requires solving a linearized system. Solving this system approximately with GMRES (the "inexact Newton-CG" or Gauss-Newton-CG method) allows inner iterations to be truncated early, saving computation while maintaining outer convergence.

**Operator preconditioning.** In function-space formulations of inverse problems (the Bayesian framework, or the Tikhonov formulation in Hilbert spaces), the preconditioner is typically the prior covariance or regularization operator. Applying it requires solving another PDE or working with the SPDE approximation to the GP prior, and this inner solve is also done iteratively.

The combination of Krylov methods with good preconditioners is what makes large-scale inverse problems computationally feasible. Without scalable iterative solvers, the algorithms I work on in EIT reconstruction and PDE-constrained optimization would be limited to toy problems.
