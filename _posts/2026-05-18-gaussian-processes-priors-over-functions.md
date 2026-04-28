---
layout: post
title: "Gaussian Processes: Priors Over Functions"
description: "An introduction to Gaussian processes as priors over functions, their connection to regularization theory, and why they matter for inverse problems."
date: 2026-05-18
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Bayesian Methods, Gaussian Processes]
math: true
---

In my earlier post on Bayesian inverse problems, I described how a Gaussian prior over the unknown corresponds, through Bayes' theorem, to Tikhonov regularization. I mentioned the connection briefly and moved on. But Gaussian priors over functions deserve a post of their own, because they are far more structured and computationally tractable than the brief mention suggested.

A Gaussian process is not just a prior. It is a language for expressing beliefs about functions: how smooth they are, how they behave at different scales, whether they are stationary or vary in character across the domain. Understanding Gaussian processes well gives you a powerful tool for encoding prior knowledge in a principled way, and it connects regularization theory to a broader statistical framework that has produced some of the most elegant mathematics in modern applied probability.


## What a Gaussian Process Is

A Gaussian process (GP) is a probability distribution over functions. Formally, a random function $f : \mathcal{X} \to \mathbb{R}$ is a GP if, for any finite collection of points $x_1, \ldots, x_n \in \mathcal{X}$, the vector $(f(x_1), \ldots, f(x_n))$ follows a multivariate Gaussian distribution.

A GP is specified by two objects:

- A **mean function** $m(x) = \mathbb{E}[f(x)]$, which encodes the expected behaviour of $f$.
- A **covariance function** (kernel) $k(x, x') = \text{Cov}(f(x), f(x'))$, which encodes how values of $f$ at different points are correlated.

Typically one sets $m \equiv 0$ and lets the kernel carry all the structure. The kernel completely determines the properties of the GP: the smoothness of its sample paths, the length scale over which correlations decay, and the marginal variance at each point.

Writing $f \sim \mathcal{GP}(0, k)$ means that for any set of evaluation points,

$$
\begin{pmatrix} f(x_1) \\ \vdots \\ f(x_n) \end{pmatrix} \sim \mathcal{N}\!\left(0, K\right),
$$

where $K_{ij} = k(x_i, x_j)$ is the $n \times n$ kernel (Gram) matrix.


## The Role of the Kernel

The kernel is where the real modelling happens. Different kernels correspond to different beliefs about the function.

**Squared exponential (SE) kernel:**
$$
k_{\text{SE}}(x, x') = \sigma^2 \exp\!\left(-\frac{\lVert x - x' \rVert^2}{2\ell^2}\right).
$$
This produces infinitely differentiable sample paths. The length scale $\ell$ controls how quickly correlations decay: small $\ell$ means the function can vary rapidly, large $\ell$ means it is nearly flat. The variance $\sigma^2$ controls the marginal scale. If you believe your function is very smooth, this is a natural choice.

**Matérn kernel:**
$$
k_{\nu}(x, x') = \frac{2^{1-\nu}}{\Gamma(\nu)}\left(\frac{\sqrt{2\nu}\lVert x - x' \rVert}{\ell}\right)^\nu K_\nu\!\left(\frac{\sqrt{2\nu}\lVert x - x' \rVert}{\ell}\right),
$$
where $K_\nu$ is the modified Bessel function of the second kind and $\nu > 0$ is a smoothness parameter. For $\nu = 1/2$, the kernel becomes the exponential kernel $k(x,x') = \exp(-\|x-x'\|/\ell)$, and the sample paths are continuous but not differentiable. For $\nu = 3/2$ and $\nu = 5/2$, the paths are once and twice differentiable, respectively. As $\nu \to \infty$, the Matérn kernel converges to the SE kernel.

The Matérn family is widely used in practice because the smoothness parameter allows a calibrated model: you can choose $\nu$ based on how much smoothness you expect in the application. For conductivity distributions in EIT, which can have sharp interfaces, the exponential ($\nu = 1/2$) or Matérn $3/2$ kernels are often more appropriate than the infinitely smooth SE kernel.


## GP Regression

The canonical use of a GP is regression. Given observations $y_i = f(x_i) + \varepsilon_i$ with noise $\varepsilon_i \sim \mathcal{N}(0, \sigma_n^2)$, and a GP prior $f \sim \mathcal{GP}(0, k)$, the posterior distribution over $f$ is also a GP.

At any test point $x_*$, the posterior mean and variance are:

$$
\mu(x_*) = k(x_*, \mathbf{x})^\top \left( K + \sigma_n^2 I \right)^{-1} \mathbf{y},
$$

$$
\sigma^2(x_*) = k(x_*, x_*) - k(x_*, \mathbf{x})^\top \left( K + \sigma_n^2 I \right)^{-1} k(\mathbf{x}, x_*),
$$

where $k(x_*, \mathbf{x})$ is the vector of covariances between the test point and the training points, and $K$ is the training kernel matrix.

The posterior mean $\mu(x_*)$ is the best estimate of $f$ at $x_*$ given the data. It is, in fact, exactly the minimizer of a variational problem with Tikhonov regularization in a reproducing kernel Hilbert space (RKHS). This is the formal connection between GP regression and classical regularization: the two frameworks produce identical point estimates when the prior is Gaussian and the likelihood is also Gaussian.

The posterior variance $\sigma^2(x_*)$ is what Tikhonov regularization alone cannot provide: a principled measure of uncertainty. In regions where training data is dense, $\sigma^2(x_*)$ is small. In regions where data is sparse or the function must extrapolate, the uncertainty is large. This is free, coming directly from the probabilistic framework.


## The Reproducing Kernel Hilbert Space Connection

Every positive definite kernel $k$ defines a reproducing kernel Hilbert space (RKHS) $\mathcal{H}_k$: the space of functions $f$ for which

$$
\lVert f \rVert_{\mathcal{H}_k}^2 = \int \frac{|\hat{f}(\xi)|^2}{S(\xi)}\, d\xi < \infty,
$$

where $S(\xi)$ is the spectral density of the kernel (its Fourier transform). The RKHS norm measures smoothness relative to the kernel: functions in $\mathcal{H}_k$ are at least as regular as the kernel suggests.

The GP posterior mean is the minimizer of

$$
\min_{f \in \mathcal{H}_k} \sum_{i=1}^n \frac{(y_i - f(x_i))^2}{\sigma_n^2} + \lVert f \rVert_{\mathcal{H}_k}^2.
$$

This is precisely Tikhonov regularization with the RKHS norm as the regularizer. The kernel determines the norm, which determines what kind of functions are penalized. Choosing the SE kernel penalizes rough functions heavily. Choosing the exponential kernel allows functions with more irregular behaviour.

This connection is not merely aesthetic. It gives GP practitioners access to the convergence theory of regularization methods, and it gives regularization practitioners access to the probabilistic interpretation and uncertainty quantification of GPs.


## Learning the Hyperparameters

A GP prior is specified up to hyperparameters: the length scale $\ell$, the marginal variance $\sigma^2$, the noise level $\sigma_n^2$, and, in the Matérn family, the smoothness $\nu$. In practice, these must be estimated from data.

The standard approach is maximum likelihood, maximizing the log marginal likelihood of the data under the GP model:

$$
\log p(\mathbf{y} \mid \mathbf{x}, \theta) = -\frac{1}{2} \mathbf{y}^\top (K_\theta + \sigma_n^2 I)^{-1} \mathbf{y} - \frac{1}{2} \log \det(K_\theta + \sigma_n^2 I) - \frac{n}{2} \log 2\pi.
$$

The first term rewards good fit to the data. The second term penalizes complexity. Together they implement Occam's razor: the hyperparameters are chosen to explain the data with the simplest function consistent with the prior.

This marginal likelihood optimisation is usually done with gradient methods. The gradients are computable but the dominant cost is the $O(n^3)$ Cholesky factorisation of the kernel matrix, which limits standard GP regression to problems with at most a few thousand observations.

For larger datasets, sparse approximations (inducing point methods, Nyström approximation) reduce the cost to $O(nm^2)$ where $m \ll n$ is the number of inducing points. These approximations introduce their own errors, but they make GP methods applicable at scales that were previously inaccessible.


## Where I Find Them Useful

I use GP priors as a modelling tool in two ways in my work.

**Prior construction for EIT.** When the target conductivity has known spatial structure (e.g., roughly piecewise constant, smooth within regions), a GP with an appropriate kernel provides a more principled prior than an isotropic Gaussian. The length scale can be tuned from domain knowledge or estimated from training data. This often leads to better reconstructions than flat Tikhonov regularization without adding much computational overhead.

**Surrogate modelling.** GP regression is a natural surrogate for expensive-to-evaluate functions. In parameter studies where a classical PDE solver is called at many parameter values, a GP fitted to a subset of evaluations can interpolate to new parameter values with uncertainty estimates. This is especially useful for experimental design: the posterior variance directly identifies where new evaluations would reduce uncertainty the most.

The main limitation in both settings is the cubic cost in the number of training points. For problems in two or three spatial dimensions with fine discretizations, the kernel matrix quickly becomes unwieldy, and the sparse approximations introduce questions about how much information is lost. Getting good performance from GPs on large-scale problems remains an active area of research.


## Further Reading

The standard reference for Gaussian processes in machine learning is Rasmussen and Williams, *Gaussian Processes for Machine Learning* (2006), which is freely available online and covers both theory and algorithms in depth. For the connection to regularization and RKHS theory, Schölkopf and Smola, *Learning with Kernels* (2002), and Berlinet and Thomas-Agnan, *Reproducing Kernel Hilbert Spaces in Probability and Statistics* (2004), are comprehensive. For the use of GP priors in Bayesian inverse problems, the work of Lasanen, Dashti, Stuart, and their collaborators is the mathematical foundation.
