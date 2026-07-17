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

**The likelihood $\pi(g^\delta \mid f)$:** the probability of observing the data $g^\delta$ given a particular value of $f$. For Gaussian noise with covariance $\Gamma$, this is:

$$
\pi(g^\delta \mid f) \propto \exp\!\left(-\frac{1}{2} \lVert \mathcal{A}(f) - g^\delta \rVert_\Gamma^2 \right),
$$

where $\lVert \cdot \rVert_\Gamma^2 = \langle \cdot, \Gamma^{-1} \cdot \rangle$.

**The posterior distribution $\pi_{\text{post}}(f \mid g^\delta)$:** computed via Bayes' theorem:

$$
\pi_{\text{post}}(f \mid g^\delta) = \frac{\pi(g^\delta \mid f) \, \pi_{\text{prior}}(f)}{\pi(g^\delta)} \propto \pi(g^\delta \mid f) \, \pi_{\text{prior}}(f).
$$

The normalizing constant $\pi(g^\delta)$ (the evidence) is typically intractable, but for many purposes we only need the posterior up to proportionality.


## What the Posterior Tells You

The posterior summarizes inference under the chosen forward model, likelihood, and prior. It does not account automatically for model discrepancy or misspecified prior information.

**The MAP estimate** (maximum a posteriori) is the mode of the posterior:

$$
\begin{aligned}
f_{\text{MAP}} &= \arg\max_f \; \pi_{\text{post}}(f \mid g^\delta) \\\\
&= \arg\min_f \; \frac{1}{2}\lVert \mathcal{A}(f) - g^\delta \rVert_\Gamma^2 + \mathcal{R}(f),
\end{aligned}
$$

where $\mathcal{R}(f)=-\log\pi_{\text{prior}}(f)$ in a finite-dimensional setting with densities. The MAP then coincides with the corresponding variational estimator. In function spaces, MAP points and prior penalties require a definition based on small-ball probabilities or the Onsager-Machlup functional; a formal density with respect to infinite-dimensional Lebesgue measure does not exist.

**The posterior mean** $\mathbb{E}_{\text{post}}[f]$ is the average over the posterior. It is often smoother than the MAP estimate and has optimal properties in certain loss functions (squared error loss).

**Credible regions** quantify posterior uncertainty. A 95% credible region is a set $C$ with posterior probability $0.95$. For a scalar quantity of interest, a credible interval describes its posterior range. This probability statement is conditional on the model and prior; it is not a frequentist coverage guarantee and does not by itself establish that a reconstructed feature is physically present.

**Marginal distributions** describe uncertainty about specific features. Want to know how well the average conductivity in a particular region is determined? Integrate the posterior over all other variables. The resulting marginal tells you the uncertainty about that specific quantity.


## The Gaussian Case

When the forward operator is linear ($\mathcal{A} = A$), the noise is Gaussian ($\eta \sim N(0, \Gamma)$), and the prior is Gaussian ($f \sim N(f_0, \Sigma_0)$), the posterior is also Gaussian:

$$
\pi_{\text{post}}(f \mid g^\delta) = N(f_{\text{post}}, \Sigma_{\text{post}}),
$$

where

$$
\begin{aligned}
\Sigma_{\text{post}} &= \left( A^T \Gamma^{-1} A + \Sigma_0^{-1} \right)^{-1}, \\[4pt]
f_{\text{post}} &= \Sigma_{\text{post}} \left( A^T \Gamma^{-1} g^\delta + \Sigma_0^{-1} f_0 \right).
\end{aligned}
$$

The posterior mean $f_{\text{post}}$ is the Tikhonov solution (with $\alpha$ determined by the prior and noise covariances), and the posterior covariance $\Sigma_{\text{post}}$ gives a complete description of the uncertainty. The diagonal entries of $\Sigma_{\text{post}}$ are the variances at each point, telling you how much uncertainty remains after incorporating the data.

This closed-form solution is elegant and instructive. The posterior covariance shrinks in directions where the data provides information (large singular values of $A$) and remains close to the prior covariance in directions where the data is uninformative (small singular values). The uncertainty is inherently anisotropic and problem-dependent.

**Singular value perspective.** To make this precise, introduce the rescaled forward operator $\widetilde{A} = \Gamma^{-1/2} A \Sigma_0^{1/2}$ with singular value decomposition $\widetilde{A} = U D V^T$, where $D = \operatorname{diag}(d_1, d_2, \ldots)$ and $d_1 \geq d_2 \geq \cdots \geq 0$. A direct calculation shows that the prior-normalised posterior covariance satisfies

$$
\Sigma_0^{-1/2} \Sigma_{\text{post}} \Sigma_0^{-1/2} = V \operatorname{diag}\!\left(\frac{1}{1 + d_k^2}\right) V^T.
$$

In the $k$-th direction defined by $V$, the prior variance is 1 (by normalisation) and the posterior variance is $1/(1+d_k^2)$. When $d_k \gg 1$, the posterior variance $\approx 1/d_k^2 \ll 1$: the data resolves this direction precisely. When $d_k \approx 0$, the posterior variance $\approx 1$: the data says nothing and the posterior looks like the prior. The singular values $\{d_k\}$ therefore encode the information content of the measurements. For severely ill-posed problems such as EIT, these singular values decay extremely rapidly, meaning that only a small number of directions in the parameter space are genuinely resolved by the boundary data.


## The Laplace Approximation

Full posterior sampling is expensive, but it is often unnecessary. A practical middle ground between computing only the MAP estimate (cheap, no uncertainty) and running full MCMC (expensive, complete posterior) is the **Laplace approximation**: replace the posterior by the Gaussian that matches it at the mode.

Near $f_{\text{MAP}}$, expand the negative log-posterior to second order:

$$
-\log \pi_{\text{post}}(f \mid g^\delta) \approx c + \frac{1}{2}(f - f_{\text{MAP}})^T \mathcal{H}\,(f - f_{\text{MAP}}),
$$

where $c$ is a constant and $\mathcal{H} = -\nabla^2 \log \pi_{\text{post}}(f_{\text{MAP}} \mid g^\delta)$ is the Hessian of the negative log-posterior at the MAP point. Exponentiating gives the Gaussian approximation:

$$
\pi_{\text{post}}(f \mid g^\delta) \approx N\!\left(f_{\text{MAP}},\; \mathcal{H}^{-1}\right).
$$

This is exact for a Gaussian posterior. In nonlinear problems it is a local approximation and can fail for skewed, multimodal, truncated, or weakly identified posteriors. Decreasing the noise improves the approximation only under identifiability, regularity, and posterior-concentration conditions.

**Gauss-Newton structure.** For a Gaussian prior with covariance $\Sigma_0$ and Gaussian noise with covariance $\Gamma$, the Gauss-Newton approximation to the Hessian at the MAP is

$$
\mathcal{H} = J^T \Gamma^{-1} J + \Sigma_0^{-1},
$$

where $J=\nabla_f\mathcal{A}(f_{\text{MAP}})$. For a linear operator this equals $\Sigma_{\text{post}}^{-1}$. For a nonlinear operator, the exact Hessian also contains residual-weighted second derivatives of $\mathcal{A}$. Neglecting them is justified only when the residual and nonlinearity make those terms small enough for the intended calculation.

**Low-rank posterior covariance.** For large-scale problems, $\mathcal{H}^{-1}$ cannot be formed explicitly. Instead, solve the generalised eigenvalue problem

$$
J^T \Gamma^{-1} J \; v_k = \lambda_k \; \Sigma_0^{-1} v_k, \qquad k = 1, \ldots, r,
$$

retaining the $r$ largest eigenvalues. Applying the data-misfit Hessian usually requires incremental forward and adjoint solves after the state and adjoint fields have been computed. With $v_k$ normalised so that $v_k^T \Sigma_0^{-1}v_k=1$, the covariance approximation is

$$
\mathcal{H}^{-1} \approx \Sigma_0 - \sum_{k=1}^r \frac{\lambda_k}{1 + \lambda_k}\, v_k v_k^T.
$$

In directions $v_k$, the posterior variance is reduced from the prior by the factor $\lambda_k/(1+\lambda_k)$: large $\lambda_k$ means tight posterior (data strongly constrains this direction), small $\lambda_k$ means the posterior equals the prior (data says nothing). In all other directions, the posterior simply inherits the prior covariance.

This low-rank Laplace approximation is useful in large EIT discretizations when the prior-preconditioned spectrum decays. The truncation rank must be selected from that spectrum and a stated tolerance; a fixed number of eigenpairs is not reliable across measurement protocols, meshes, or priors. The result describes local Gaussian uncertainty around the MAP, not the full nonlinear posterior.


## The Computational Challenge

For nonlinear problems and non-Gaussian priors, the posterior does not have a closed form. Computing it, or functionals of it, requires sampling.

Markov chain Monte Carlo (MCMC) is the standard approach. You construct a Markov chain whose stationary distribution is the posterior, run the chain for a long time, and use the samples to estimate posterior quantities (means, variances, credible intervals).

The challenge is computational cost. Each step of the chain requires evaluating the forward operator $\mathcal{A}(f)$, which for PDE-based problems means solving a PDE. A typical MCMC run needs thousands to millions of samples, meaning thousands to millions of PDE solves. For a forward solve that takes even a few seconds, this becomes prohibitive.

Several strategies address this bottleneck:

**Efficient proposals.** The standard random-walk Metropolis algorithm explores high-dimensional parameter spaces slowly. More sophisticated algorithms use gradient information to propose better moves. The MALA (Metropolis-adjusted Langevin algorithm) uses the gradient of the log-posterior to inform the proposal:

$$
f^* = f^n + \frac{\tau}{2} \nabla \log \pi_{\text{post}}(f^n) + \sqrt{\tau}\,\xi,
$$

where $\xi\sim N(0,I)$. MALA then accepts or rejects $f^*$ using the Metropolis-Hastings probability built from the posterior density and the asymmetric proposal density. Omitting this correction gives the unadjusted Langevin algorithm, not MALA.

Hamiltonian Monte Carlo uses gradients and an auxiliary momentum to construct long proposals, followed by a Metropolis correction. Standard HMC does not require Hessians. Riemannian and other metric-based variants may use Hessian information, which increases the cost.

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

Under the finite-dimensional density assumptions above, the MAP is a variational solution. The inverse Hessian at the MAP is a local Laplace covariance, not the posterior covariance unless the posterior is Gaussian. Marginal likelihood can compare models or hyperparameters within the specified probabilistic model.

A local Laplace covariance identifies directions of weak and strong curvature near the MAP. Small local variance indicates concentration under the assumed model, not a guarantee that a feature is correct. Prior assumptions, modelling error, and non-Gaussian posterior structure can change that interpretation.

In my own work, I primarily compute MAP estimates using variational methods. But I increasingly compute the posterior covariance (or local approximations to it) to assess which features of the reconstruction are trustworthy. For EIT with partial data, this is especially relevant: the uncertainty is much larger in regions far from the electrodes, and the posterior covariance quantifies exactly how much larger.


## When to Go Bayesian

The Bayesian approach is useful when decisions require uncertainty quantification, prior information has a defensible probabilistic form, or model and hyperparameter comparisons are part of the analysis. In medical and safety-critical settings, posterior uncertainty is only one component of validation and cannot replace clinical or engineering evidence.

For problems where a single reconstruction suffices and speed is paramount, deterministic methods are more practical. The computational overhead of MCMC, even with the best algorithms, is substantial.

My view is that the Bayesian perspective should inform how you think about inverse problems, even if you ultimately compute a deterministic solution. Understanding that your reconstruction is one point in a cloud of plausible solutions, and understanding the shape of that cloud, changes how you interpret and present results.

The mathematics is also beautiful in its own right. The interplay between measure theory, functional analysis, and computational statistics is one of the more elegant corners of applied mathematics. It is challenging, but the conceptual clarity it provides is worth the investment.
