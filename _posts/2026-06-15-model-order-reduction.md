---
layout: post
title: "Model Order Reduction: Making Big Problems Small"
description: "An introduction to model order reduction, from proper orthogonal decomposition to the reduced basis method, and why fast surrogate models matter for inverse problems."
date: 2026-06-15
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Scientific Computing, Model Order Reduction]
math: true
---

A recurrent frustration in computational inverse problems is the cost of the forward solver. To reconstruct an unknown from measurements, you typically need to evaluate the forward operator many times: once per iteration of an optimization method, hundreds of times in a sampling algorithm, thousands of times in a parameter study. If each evaluation requires solving a PDE on a fine mesh, the total computation quickly becomes prohibitive.

One response to this is to replace the full-order model with a surrogate that is fast to evaluate but sufficiently accurate. Neural operators, which I discussed in an earlier post, are one approach. **Model order reduction** (MOR) is an older, mathematically more developed family of approaches. Where neural operators learn the solution map from data, model order reduction derives a reduced model from the underlying equations, with error estimates that connect directly to the full-order solution.

The field has a long history in structural engineering and fluid dynamics, and it has become increasingly important in the inverse problems and uncertainty quantification communities. This post covers the main ideas, focusing on proper orthogonal decomposition and the reduced basis method.


## The Basic Idea

The full-order model (FOM) is the discretized PDE. Suppose the problem is parametric: for each parameter value $\mu \in \mathcal{P}$ (a conductivity distribution, a forcing term, a geometric parameter), we want the solution $u(\mu) \in \mathbb{R}^N$ to the linear system

$$
A(\mu) u(\mu) = f(\mu).
$$

Here $N$ is the dimension of the discretized state space, which might be $10^5$ or $10^6$ for a fine mesh in three dimensions. Solving this system for each $\mu$ takes $O(N^\alpha)$ operations (with $\alpha = 1$ for sparse direct solvers or iterative methods in favourable cases).

The key observation: for many parametric PDE problems, the solution $u(\mu)$ does not vary arbitrarily as $\mu$ changes. The set of all solutions,

$$
\mathcal{M} = \{u(\mu) : \mu \in \mathcal{P}\},
$$

called the **solution manifold**, is a low-dimensional structure embedded in the high-dimensional space $\mathbb{R}^N$. It may be a low-dimensional smooth manifold, or approximately so.

If $\mathcal{M}$ is well-approximated by a $k$-dimensional subspace $V_k = \text{span}\{v_1, \ldots, v_k\}$ with $k \ll N$, then we can seek the reduced solution

$$
u(\mu) \approx u_{r}(\mu) = \sum_{j=1}^k c_j(\mu) v_j = V_k c(\mu),
$$

and reduce the problem to determining $c(\mu) \in \mathbb{R}^k$ rather than $u(\mu) \in \mathbb{R}^N$. The Galerkin projection of the full system onto $V_k$ gives

$$
V_k^\top A(\mu) V_k c(\mu) = V_k^\top f(\mu),
$$

a $k \times k$ system. If $k = 50$, this costs $O(k^3) = O(125{,}000)$ operations, instead of the $O(N)$ operations required for the full system. The speedup can be factors of hundreds or thousands.

The challenge is twofold: constructing the subspace $V_k$ (the offline phase) and ensuring that the $k \times k$ system can be assembled efficiently without reference to the full system (the online phase).


## Proper Orthogonal Decomposition

Proper orthogonal decomposition (POD) is the most widely used method for constructing the reduced subspace. It is also called the Karhunen-Loève expansion or principal component analysis, depending on the community.

The procedure is:

1. **Snapshot generation.** Choose $n_s$ parameter samples $\mu_1, \ldots, \mu_{n_s}$ and solve the full-order problem for each, collecting the snapshots $\{u(\mu_1), \ldots, u(\mu_{n_s})\} \subset \mathbb{R}^N$.

2. **SVD.** Form the snapshot matrix $S = [u(\mu_1) \, | \, \cdots \, | \, u(\mu_{n_s})] \in \mathbb{R}^{N \times n_s}$ and compute its singular value decomposition $S = U \Sigma V^\top$.

3. **Basis selection.** The POD basis of dimension $k$ consists of the first $k$ left singular vectors: $V_k = [u_1, \ldots, u_k]$. The singular values $\sigma_1 \geq \sigma_2 \geq \cdots$ measure the energy captured by each mode. The relative truncation error satisfies

$$
\frac{\sum_{i=1}^N \lVert u(\mu_i) - \Pi_{V_k} u(\mu_i) \rVert^2}{\sum_{i=1}^N \lVert u(\mu_i) \rVert^2} = \frac{\sum_{j=k+1}^{n_s} \sigma_j^2}{\sum_{j=1}^{n_s} \sigma_j^2}.
$$

If the singular values decay rapidly, a small $k$ captures most of the energy. For parametric elliptic problems with smooth dependence on $\mu$, this decay can be exponential in $k$, which is why MOR is so effective.

POD is a data-driven method. It constructs the best $k$-dimensional linear approximation to the snapshot data, in the least-squares sense, without requiring any knowledge of the governing equations beyond what is encoded in the snapshots. This makes it broadly applicable but also means that the quality of the reduced model depends on the quality and coverage of the snapshot set.


## The Reduced Basis Method

The reduced basis (RB) method shares the POD framework but adds two important ingredients: a systematic strategy for choosing the snapshot parameters (the greedy algorithm), and rigorous a posteriori error bounds.

**The greedy algorithm.** Rather than choosing snapshot parameters in advance, the greedy algorithm builds the reduced basis adaptively. At each step, it chooses the next parameter as the one where the current reduced basis performs worst, according to an error indicator. Concretely:

1. Start with an arbitrary $\mu_1$; add $u(\mu_1)$ to the basis.
2. For the current basis $V_k$, compute the error indicator $\Delta_k(\mu)$ for all $\mu$ in a fine training set.
3. Add $u(\mu_{k+1})$ to the basis, where $\mu_{k+1} = \argmax_\mu \Delta_k(\mu)$.
4. Repeat until the maximum error indicator falls below a tolerance.

The error indicator $\Delta_k(\mu)$ is the key ingredient. It must be (a) computable using the reduced model alone, without solving the full problem, and (b) a reliable upper bound for the true error $\lVert u(\mu) - u_r(\mu) \rVert$.

**A posteriori error bounds.** For parametric problems with affine parameter dependence (the matrix $A(\mu) = \sum_q \theta_q(\mu) A_q$ is a sum of parameter-independent matrices weighted by scalar functions $\theta_q$), rigorous error bounds can be derived using the residual:

$$
\lVert u(\mu) - u_r(\mu) \rVert \leq \frac{\lVert A(\mu) u_r(\mu) - f(\mu) \rVert}{\alpha_{\text{LB}}(\mu)},
$$

where $\alpha_{\text{LB}}(\mu)$ is a computable lower bound for the coercivity constant of $A(\mu)$. This bound is sharp enough to be useful and can be evaluated at reduced cost if the affine decomposition is exploited.

The combination of greedy basis construction and error bounds makes the RB method more reliable than POD for certified computations. You can guarantee, offline, that the online reduced model will achieve a specified accuracy. This is important in safety-critical applications.


## The Offline-Online Decomposition

The computational savings of MOR depend on a clean separation between an expensive offline phase and a cheap online phase.

**Offline:** Solve the full-order problem for each basis vector (or snapshot). Assemble and store the reduced operators $\hat{A}_q = V_k^\top A_q V_k \in \mathbb{R}^{k \times k}$ for each term in the affine decomposition, and similarly for the right-hand side. This is done once, at large computational cost.

**Online:** For a new parameter $\mu$, assemble the reduced system $\hat{A}(\mu) = \sum_q \theta_q(\mu) \hat{A}_q$ from the stored reduced operators, and solve the $k \times k$ system. The online cost is $O(Q k^2)$ to assemble (where $Q$ is the number of affine terms) and $O(k^3)$ to solve, both independent of $N$.

If the offline phase is performed once and the reduced model is queried many times (as in an inversion loop, a Monte Carlo sampling procedure, or a real-time application), the amortized cost per evaluation can be orders of magnitude lower than the full model.

The affine decomposition assumption is crucial. If $A(\mu)$ cannot be written as a sum of parameter-independent terms, the reduced system matrix must be assembled by contracting the full-order matrix with the basis vectors, which costs $O(N k^2)$ per query and eliminates much of the speedup. Various techniques (the empirical interpolation method, discrete empirical interpolation) can enforce affine structure approximately for nonlinear problems.


## Comparison with Neural Operators

Neural operators and model order reduction are both surrogates for parametric PDE solution maps, and they occupy somewhat different niches.

**Data requirements.** MOR requires solving the full-order model for the basis snapshots; neural operators also require a training dataset of solution pairs. The data generation cost is similar. MOR typically requires fewer snapshots (tens to hundreds) than neural operators (thousands), but MOR exploits the problem structure more explicitly.

**Accuracy certification.** RB methods provide rigorous, problem-dependent error bounds. Neural operators provide empirical error estimates on validation data, but no general guarantees for out-of-distribution queries. For certified computations, RB methods are preferred.

**Flexibility.** Neural operators are more flexible: they require no affine decomposition, handle nonlinear operators more naturally, and can incorporate data from sources other than the PDE solver. MOR is more structured and more reliable within its assumptions.

**Generalization.** Both methods can fail outside their training distribution. MOR fails when the solution manifold is not well-approximated by the constructed subspace (which happens when the parameter space is large or the solution varies in a non-smooth way). Neural operators fail when the input distribution at inference time differs from the training distribution.

In my experience, MOR is preferable when the parameter space is moderate-dimensional (say, five to fifty parameters) and the solution is smooth in the parameters. Neural operators become attractive when the parameter space is high-dimensional (such as a spatially varying coefficient) or when flexibility and ease of implementation are more important than certified accuracy.


## Application to EIT

In EIT reconstruction, the forward problem is solved many times for varying conductivity distributions. The conductivity is high-dimensional (one value per mesh element), which makes direct application of MOR challenging: the parameter space is the same dimension as the state space.

One approach is to use MOR within a parametrized family. If the conductivity is constrained to a low-dimensional manifold (e.g., piecewise constant with varying values and interfaces, described by a small number of parameters), the RB method can be applied to this reduced parameter space efficiently.

A more flexible approach, which I have been exploring, is to combine MOR with a learned parameterization of the conductivity. A generative model maps a low-dimensional latent code to a conductivity distribution; the RB method is applied in the latent space. This hybrid uses the generative model's flexibility to represent a rich class of conductivities while leveraging the RB method's efficiency and error control for the forward solves.

The integration is not straightforward, and the error analysis is more involved when the parameterization is itself approximate. But the potential speedups are significant, and the certified component of the reduced basis gives a handle on the forward model error that purely data-driven surrogates lack.


## Further Reading

The standard reference for the reduced basis method is Quarteroni, Manzoni, and Negri, *Reduced Basis Methods for Partial Differential Equations* (2016). Hesthaven, Rozza, and Stamm, *Certified Reduced Basis Methods for Parametrized Partial Differential Equations* (2016), provides a more detailed treatment of the certified aspects. For POD in the context of dynamical systems, Holmes, Lumley, and Berkooz, *Turbulence, Coherent Structures, Dynamical Systems and Symmetry* (1996), is the classical reference. The connection between MOR and data-driven methods is covered in Benner, Ohlberger, Cohen, and Willcox, *Model Reduction and Approximation* (2017).
