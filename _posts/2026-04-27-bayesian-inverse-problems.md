---
layout: post
title: "Bayesian Inverse Problems: Quantifying What We Do Not Know"
description: "An introduction to the Bayesian approach to inverse problems, where the solution is a probability distribution rather than a single reconstruction."
date: 2026-04-27
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Bayesian Methods]
math: true
---

Classical regularization methods for inverse problems produce a single reconstruction: one image, one parameter estimate, one answer. This is clean and actionable, but it conceals an important truth. For most inverse problems, the data does not uniquely determine the solution. Many different reconstructions are consistent with the measured data. A single point estimate tells you nothing about how confident you should be in the result or which features are well-determined and which are artifacts of the regularization.

The Bayesian approach addresses this by reformulating the inverse problem as a problem of inference. Instead of seeking a single solution, you seek the *posterior distribution*: the probability distribution over all possible solutions, conditioned on the observed data. This distribution encodes everything the data tells you, along with the uncertainty in that information.

I work primarily with deterministic (variational) methods, but I find the Bayesian perspective increasingly useful, both for its theoretical insights and for the practical tools it provides. This post is an introduction for people coming from a deterministic background.


## The Framework

The setup is familiar. You have an unknown quantity $f$, a forward operator $\mathcal{A}$, and noisy data $g^\delta = \mathcal{A}(f) + \eta$, where $\eta$ represents measurement noise.

In the Bayesian framework, both $f$ and $\eta$ are treated as random variables. The components are:

**The prior distribution $\pi_{\text{prior}}(f)$:** your belief about $f$ before seeing any data. This encodes the same information as the regularizer in the variational framework. A Gaussian prior $\pi_{\text{prior}}(f) \propto \exp\!\left(-\frac{1}{2}\lVert Lf \rVert^2\right)$ corresponds to Tikhonov regularization with penalty operator $L$. A Laplace prior corresponds to $\ell^1$ regularization.

**The likelihood $\pi(g^\delta | f)$:** the probability of observing the data $g^\delta$ given a particular value of $f$. For Gaussian noise with covariance $\Gamma$, this is:

$$
\pi(g^\delta | f) \propto \exp\!\left(-\frac{1}{2} \lVert \mathcal{A}(f) - g^\delta \rVert_\Gamma^2 \right),
$$

where $\lVert \cdot \rVert_\Gamma^2 = \langle \cdot, \Gamma^{-1} \cdot \rangle$.

**The posterior distribution $\pi_{\text{post}}(f | g^\delta)$:** computed via Bayes' theorem:

$$
\pi_{\text{post}}(f | g^\delta) = \frac{\pi(g^\delta | f) \, \pi_{\text{prior}}(f)}{\pi(g^\delta)} \propto \pi(g^\delta | f) \, \pi_{\text{prior}}(f).
$$

The normalizing constant $\pi(g^\delta)$ (the evidence) is typically intractable, but for many purposes we only need the posterior up to proportionality.


## What the Posterior Tells You

The posterior distribution is a complete solution to the inverse problem in the sense that it contains all the information about $f$ that can be extracted from the data and the prior.

**The MAP estimate** (maximum a posteriori) is the mode of the posterior:

$$
f_{\text{MAP}} = \arg\max_f \; \pi_{\text{post}}(f | g^\delta) = \arg\min_f \; \frac{1}{2}\lVert \mathcal{A}(f) - g^\delta \rVert_\Gamma^2 + \mathcal{R}(f),
$$

where $\mathcal{R}(f) = -\log \pi_{\text{prior}}(f)$. This is precisely the variational formulation. The deterministic and Bayesian approaches agree on this point: the MAP estimate is the regularized solution.

**The posterior mean** $\mathbb{E}_{\text{post}}[f]$ is the average over the posterior. It is often smoother than the MAP estimate and has optimal properties in certain loss functions (squared error loss).

**Credible regions** quantify uncertainty. A 95% credible region is a set $C$ such that $\int_C \pi_{\text{post}}(f | g^\delta) \, df = 0.95$. If some feature of the reconstruction (say, the presence of an inclusion in a particular location) falls outside a credible region, you have reason to doubt it. If it falls inside, the data supports it.

**Marginal distributions** describe uncertainty about specific features. Want to know how well the average conductivity in a particular region is determined? Integrate the posterior over all other variables. The resulting marginal tells you the uncertainty about that specific quantity.


## The Gaussian Case

When the forward operator is linear ($\mathcal{A} = A$), the noise is Gaussian ($\eta \sim N(0, \Gamma)$), and the prior is Gaussian ($f \sim N(f_0, \Sigma_0)$), the posterior is also Gaussian:

$$
\pi_{\text{post}}(f | g^\delta) = N(f_{\text{post}}, \Sigma_{\text{post}}),
$$

where

$$
\Sigma_{\text{post}} = \left( A^T \Gamma^{-1} A + \Sigma_0^{-1} \right)^{-1}, \qquad f_{\text{post}} = \Sigma_{\text{post}} \left( A^T \Gamma^{-1} g^\delta + \Sigma_0^{-1} f_0 \right).
$$

The posterior mean $f_{\text{post}}$ is the Tikhonov solution (with $\alpha$ determined by the prior and noise covariances), and the posterior covariance $\Sigma_{\text{post}}$ gives a complete description of the uncertainty. The diagonal entries of $\Sigma_{\text{post}}$ are the variances at each point, telling you how much uncertainty remains after incorporating the data.

This closed-form solution is elegant and instructive. The posterior covariance shrinks in directions where the data provides information (large singular values of $A$) and remains close to the prior covariance in directions where the data is uninformative (small singular values). The uncertainty is inherently anisotropic and problem-dependent.


## The Computational Challenge

For nonlinear problems and non-Gaussian priors, the posterior does not have a closed form. Computing it, or functionals of it, requires sampling.

Markov chain Monte Carlo (MCMC) is the standard approach. You construct a Markov chain whose stationary distribution is the posterior, run the chain for a long time, and use the samples to estimate posterior quantities (means, variances, credible intervals).

The challenge is computational cost. Each step of the chain requires evaluating the forward operator $\mathcal{A}(f)$, which for PDE-based problems means solving a PDE. A typical MCMC run needs thousands to millions of samples, meaning thousands to millions of PDE solves. For a forward solve that takes even a few seconds, this becomes prohibitive.

Several strategies address this bottleneck:

**Efficient proposals.** The standard random-walk Metropolis algorithm explores high-dimensional parameter spaces slowly. More sophisticated algorithms use gradient information to propose better moves. The MALA (Metropolis-adjusted Langevin algorithm) uses the gradient of the log-posterior to inform the proposal:

$$
f^* = f^n + \frac{\tau}{2} \nabla \log \pi_{\text{post}}(f^n) + \sqrt{\tau} \, \xi, \qquad \xi \sim N(0, I).
$$

Hamiltonian Monte Carlo (HMC) goes further, using the geometry of the posterior to make long-range proposals that are accepted with high probability. The cost is computing gradients (and sometimes Hessians) of the forward model, which for PDE problems requires adjoint methods.

**Surrogate models.** Replace the expensive forward operator with a fast surrogate (a neural operator, a reduced-order model, or a polynomial chaos expansion) and sample from the resulting approximate posterior. The surrogate introduces bias, but if it is accurate enough, the bias is small compared to the uncertainty.

**Dimension reduction.** In many inverse problems, the data informs only a low-dimensional subspace of the parameter space. Identifying this subspace (for instance, through the singular value decomposition of the prior-preconditioned Hessian of the negative log-likelihood) allows you to sample only the informed directions and draw the uninformed directions directly from the prior.


## Infinite-Dimensional Bayesian Inference

A subtlety that took me a while to appreciate: the Bayesian formulation for function-valued unknowns requires care with the mathematical framework. You cannot simply define a Gaussian distribution on an infinite-dimensional function space by specifying a covariance matrix, because the Lebesgue measure does not exist in infinite dimensions.

The rigorous framework, developed extensively by Andrew Stuart and collaborators, works with Gaussian measures on function spaces. The prior is a Gaussian measure $\mu_0 = N(f_0, \mathcal{C})$ where $\mathcal{C}$ is a covariance operator. The posterior is defined via the Radon-Nikodym derivative:

$$
\frac{d\mu_{\text{post}}}{d\mu_0}(f) \propto \exp\!\left(-\Phi(f; g^\delta)\right),
$$

where $\Phi(f; g^\delta) = \frac{1}{2}\lVert \mathcal{A}(f) - g^\delta \rVert_\Gamma^2$ is the negative log-likelihood (up to constants).

The key result is that the posterior is well-defined (absolutely continuous with respect to the prior) under mild conditions on the forward operator. This is not obvious, and it fails if the prior or likelihood is chosen carelessly.

This framework has practical consequences. MCMC algorithms designed for finite-dimensional problems can behave pathologically when applied to discretized versions of infinite-dimensional problems: the acceptance rate may go to zero as the discretization refines. Algorithms that are formulated directly in function space (like the preconditioned Crank-Nicolson algorithm) maintain a mesh-independent acceptance rate, making them far more robust.


## Connections to Deterministic Methods

The Bayesian and deterministic approaches are not competitors; they are complementary perspectives on the same underlying problem.

The MAP estimate is the variational solution. The posterior covariance (at the MAP) approximates the local uncertainty. The evidence (marginal likelihood) provides a principled way to compare models and select regularization parameters.

One insight I find particularly useful: the posterior covariance at the MAP point tells you which features of the MAP reconstruction are reliable. If the posterior variance is small at a particular location, the data constrains the solution there. If the variance is large, the feature you see in the reconstruction may be an artifact of the regularization rather than a genuine signal.

In my own work, I primarily compute MAP estimates using variational methods. But I increasingly compute the posterior covariance (or local approximations to it) to assess which features of the reconstruction are trustworthy. For EIT with partial data, this is especially relevant: the uncertainty is much larger in regions far from the electrodes, and the posterior covariance quantifies exactly how much larger.


## When to Go Bayesian

The Bayesian approach is most valuable when uncertainty quantification is important (medical diagnosis, safety-critical engineering), when you have genuine prior information that is naturally expressed as a distribution, or when model comparison and parameter selection are needed.

For problems where a single reconstruction suffices and speed is paramount, deterministic methods are more practical. The computational overhead of MCMC, even with the best algorithms, is substantial.

My view is that the Bayesian perspective should inform how you think about inverse problems, even if you ultimately compute a deterministic solution. Understanding that your reconstruction is one point in a cloud of plausible solutions, and understanding the shape of that cloud, changes how you interpret and present results.

The mathematics is also beautiful in its own right. The interplay between measure theory, functional analysis, and computational statistics is one of the more elegant corners of applied mathematics. It is challenging, but the conceptual clarity it provides is worth the investment.
