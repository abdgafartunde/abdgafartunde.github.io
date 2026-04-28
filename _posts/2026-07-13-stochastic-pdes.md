---
layout: post
title: "Stochastic PDEs: When the Equations Themselves Are Random"
description: "An introduction to PDEs with random inputs: why randomness arises, how solutions are defined, and the connections to uncertainty quantification and inverse problems."
date: 2026-07-13
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Stochastic PDEs, Uncertainty Quantification]
math: true
---

Most of the PDEs I work with are deterministic: given a fixed conductivity $\sigma$, the potential $u$ is the unique solution of an elliptic equation. But the real world introduces randomness at every level. The material properties are measured imprecisely. The geometry is known only approximately. The applied currents are subject to instrument noise. The boundary conditions depend on environmental conditions that fluctuate.

One response to this is what I normally do: treat the PDE deterministically and handle uncertainty through the inversion process — Bayesian inference, regularization, error bounds. But there is an alternative: incorporate the randomness directly into the PDE. The result is a **stochastic PDE** (SPDE), a PDE whose coefficients, forcing, or boundary conditions are random processes.

This framework is useful whenever the uncertainty in the inputs is large enough that its effect on the solution cannot be captured by a linearization around a single point estimate, or whenever the statistical properties of the solution are themselves of interest. It also provides a principled mathematical model for certain physical phenomena — turbulence, reaction-diffusion in heterogeneous media, wave propagation in random media — where randomness is intrinsic rather than merely a modelling artefact.


## Two Flavours of Stochastic PDEs

There is an important distinction between two types of randomness in PDEs.

**Parametric uncertainty (random coefficients).** The PDE has deterministic structure but uncertain parameters:

$$
-\nabla \cdot (a(\omega, x) \nabla u(\omega, x)) = f(x) \quad \text{in } \Omega,
$$

where $a(\omega, x)$ is a random field indexed by $\omega \in \Omega_{\text{prob}}$ (the probability space). For each realization $\omega$, this is a standard deterministic PDE. The randomness is in the coefficient, not in the differential structure.

This is the setting for uncertainty quantification: you have a model, uncertain inputs, and you want to understand how the uncertainty propagates to the output. The solution $u(\omega, \cdot)$ is a random field, and you want its statistics (mean, variance, distribution of quantities of interest).

**Stochastic forcing (noise-driven PDEs).** The PDE is driven by a random forcing term, typically modelled as (Gaussian) white noise or a spatially correlated noise:

$$
\frac{\partial u}{\partial t} = \mathcal{L} u + \dot{W}(t, x),
$$

where $\dot{W}$ is spacetime white noise: a Gaussian process with covariance $\mathbb{E}[\dot{W}(t,x)\dot{W}(s,y)] = \delta(t-s)\delta(x-y)$. This is the setting of SPDEs in the sense of Walsh (1986) and Da Prato and Zabczyk (1992), where the solutions are genuine random fields driven by stochastic forcing.

The two settings require different mathematical tools, though they share themes. I will focus primarily on the parametric setting, which is more directly connected to my work.


## Random Fields and Karhunen-Loève Expansion

A central object in the parametric SPDE setting is a **random field**: a function $a : \Omega_\text{prob} \times D \to \mathbb{R}$ that is random in $\omega$ and spatially distributed in $x \in D$.

For a Gaussian random field with mean $\bar{a}(x)$ and covariance function $C(x, x') = \text{Cov}(a(\cdot, x), a(\cdot, x'))$, the **Karhunen-Loève (KL) expansion** provides a canonical series representation:

$$
a(\omega, x) = \bar{a}(x) + \sum_{k=1}^\infty \sqrt{\lambda_k} \xi_k(\omega) \psi_k(x),
$$

where $(\lambda_k, \psi_k)$ are the eigenvalue-eigenfunction pairs of the covariance operator

$$
(C\psi)(x) = \int_D C(x, x') \psi(x')\, dx',
$$

and $\xi_k(\omega) \sim \mathcal{N}(0, 1)$ are independent standard Gaussians. Mercer's theorem guarantees this expansion converges in $L^2(\Omega_\text{prob} \times D)$.

The KL expansion separates the randomness (the $\xi_k$) from the spatial structure (the $\psi_k$). If the covariance is smooth, the eigenvalues $\lambda_k$ decay rapidly, and the field is well-approximated by truncating the series at $K$ terms:

$$
a_K(\omega, x) = \bar{a}(x) + \sum_{k=1}^K \sqrt{\lambda_k} \xi_k(\omega) \psi_k(x).
$$

This truncation is the key step: it replaces the infinite-dimensional random field by a $K$-dimensional random vector $\boldsymbol{\xi} = (\xi_1, \ldots, \xi_K)$. The PDE solution $u(\omega, \cdot)$ becomes a function of $\boldsymbol{\xi}$, and the problem reduces to understanding the function $u(\boldsymbol{\xi}, \cdot)$ defined on $\mathbb{R}^K$.


## Uncertainty Quantification: Forward and Inverse

**Forward UQ** propagates input uncertainty to output uncertainty. Given the random coefficient $a(\omega, x)$, what is the distribution of the solution $u(\omega, x)$, or of a quantity of interest $Q(\omega) = \mathcal{Q}(u(\omega))$?

The simplest approach is **Monte Carlo**: sample $\boldsymbol{\xi}^{(1)}, \ldots, \boldsymbol{\xi}^{(M)}$ from their distribution, solve the PDE for each sample, and average. The expected value is approximated by $\bar{Q} \approx \frac{1}{M}\sum_{i=1}^M Q(\boldsymbol{\xi}^{(i)})$. The mean square error decays as $O(M^{-1/2})$, independent of the dimension $K$. Monte Carlo is robust, dimension-independent, and embarrassingly parallel. Its weakness is slow convergence: achieving three digits of accuracy requires $M \approx 10^6$ samples.

**Stochastic Galerkin methods** represent $u(\boldsymbol{\xi}, x)$ as a polynomial in $\boldsymbol{\xi}$:

$$
u(\boldsymbol{\xi}, x) \approx \sum_{|\alpha| \leq p} u_\alpha(x) \Psi_\alpha(\boldsymbol{\xi}),
$$

where $\Psi_\alpha$ are multivariate Hermite (or Legendre) polynomials and $\alpha$ is a multi-index. The coefficients $u_\alpha(x)$ are deterministic functions, solved for by a Galerkin projection of the SPDE. The resulting system couples all polynomial modes, producing a large but structured linear system. For smooth dependence of $u$ on $\boldsymbol{\xi}$, the polynomial approximation achieves spectral convergence in the stochastic dimension.

**Stochastic collocation** evaluates the PDE at a set of quadrature points in $\boldsymbol{\xi}$-space, then interpolates or averages. Unlike Galerkin, it is non-intrusive: it reuses the deterministic PDE solver as a black box, which makes it far easier to implement in practice. Sparse grid quadrature rules (Smolyak grids) extend collocation to moderate dimensions ($K \leq 20$) with manageable cost.

**Inverse UQ** combines the forward UQ framework with Bayesian inference. The unknown coefficient $a(\omega, x)$ is treated as a random field to be inferred from data. The KL expansion parameterizes the unknown, the Bayesian posterior gives the distribution of $\boldsymbol{\xi}$ given the measurements, and MCMC or deterministic inference methods (Laplace approximation, transport maps) are used to characterize the posterior. This is the framework I described in the Bayesian inverse problems post, extended to the function-space setting.


## The Challenge of Infinite Dimensions

The SPDE setting raises mathematical issues that finite-dimensional stochastic analysis does not. Spacetime white noise $\dot{W}(t, x)$ is not a genuine function; it is only a distribution. Solutions to noise-driven PDEs may not be pointwise-defined functions but only elements of suitable Sobolev spaces.

For the stochastic heat equation $\partial_t u = \Delta u + \dot{W}$ in dimension $d$, the solution is a pointwise-defined function for $d = 1$, a distribution for $d \geq 2$. In the stochastic wave equation and nonlinear SPDEs, the situation is more delicate.

This is not merely a mathematical abstraction. It affects how you model physical phenomena and how you interpret numerical results. A discretization of spacetime white noise is mesh-dependent: as you refine the mesh, the noise becomes more violent. If your numerical scheme does not handle this correctly, the computed solution does not converge as the mesh is refined — it blows up. Getting this right requires understanding the renormalization (Wick products, paracontrolled distributions) that the mathematics demands.

The development of a theory of singular SPDEs — most significantly the theory of regularity structures by Martin Hairer, for which he received the Fields Medal in 2014 — resolved long-standing questions about the well-posedness of nonlinear SPDEs with rough noise. The theory is technically demanding but represents one of the major mathematical achievements of the past decade.


## Connection to Gaussian Process Priors

There is a precise connection between SPDEs and the Gaussian process priors I described in an earlier post. Lindgren, Rue, and Lindström (2011) showed that a Gaussian Markov random field (GMRF) defined by the SPDE

$$
(\kappa^2 - \Delta)^{\alpha/2} u = \mathcal{W}
$$

has a Matérn covariance with smoothness parameter $\nu = \alpha - d/2$, where $d$ is the spatial dimension and $\mathcal{W}$ is Gaussian white noise. This connection has practical consequences: the SPDE can be discretized using FEM to produce a sparse precision matrix (the inverse of the covariance matrix), which allows Gaussian process inference to scale to spatial problems with millions of observation locations.

For prior construction in inverse problems, this means that a Matérn GP prior can be implemented without forming or inverting the dense covariance matrix: instead, you work with the sparse FEM precision matrix directly. This is orders of magnitude cheaper and handles irregular geometries naturally.


## What This Framework Offers

The stochastic PDE framework offers something that standard deterministic inverse problems, by themselves, do not: a principled account of what it means to have uncertain model parameters, not just uncertain data. When the conductivity in EIT is genuinely variable (biological tissue has natural variability), treating it as fixed but unknown and recovering a single best estimate is a modelling choice that can be questioned. The stochastic framework takes a different position: the conductivity is itself a random field, and the goal is to characterize its distribution.

Whether this framework is appropriate depends on the application. For quality control (each manufactured part has a fixed conductivity, I want to find it), deterministic inversion is correct. For biological imaging (each patient's tissue properties are drawn from a population distribution), the stochastic framework is more natural. The right choice depends on what question you are actually trying to answer — and being explicit about that question is, I have found, one of the most clarifying exercises in any modelling problem.
