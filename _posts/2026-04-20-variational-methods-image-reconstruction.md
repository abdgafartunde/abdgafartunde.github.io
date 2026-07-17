---
layout: post
title: "Variational Methods in Image Reconstruction"
description: "How variational optimization drives modern image reconstruction, from the ROF model to primal-dual algorithms, with connections to inverse problems."
date: 2026-04-20
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Image Reconstruction, Optimization]
math: true
---

Variational methods sit at the heart of modern image reconstruction. The idea is to frame reconstruction as an optimization problem: find the image that best explains the measured data while satisfying certain regularity conditions. This framework is flexible enough to accommodate different types of data, different noise models, and different structural assumptions about the solution.

I use variational methods daily in my work on electrical impedance tomography, but the same ideas apply across medical imaging, computer vision, remote sensing, and geophysics. This post covers the main concepts, focusing on the mathematical structure rather than specific applications.


## The Variational Framework

Given observed data $g^\delta$ and a forward model $\mathcal{A}$, the variational reconstruction minimizes a functional of the form:

$$
\min_f \; \mathcal{D}(\mathcal{A} f, g^\delta) + \alpha \, \mathcal{R}(f).
$$

The data fidelity term $\mathcal{D}$ measures how well the reconstructed image $f$ explains the data. The regularization term $\mathcal{R}$ imposes structure. The parameter $\alpha > 0$ balances the two.

The choice of $\mathcal{D}$ depends on the noise model. For Gaussian noise, the natural choice is the squared $L^2$ norm:

$$
\mathcal{D}(\mathcal{A} f, g^\delta) = \frac{1}{2}\lVert \mathcal{A} f - g^\delta \rVert_2^2.
$$

For Poisson noise, which occurs in photon-counting modalities such as PET and fluorescence microscopy, the corresponding Poisson negative log-likelihood is usually more appropriate. An $L^1$ fidelity term is less sensitive than a squared $L^2$ term to isolated large residuals. A Gaussian approximation to low-count Poisson data can distort the weighting of residuals and bias the reconstruction, but the direction and magnitude of the bias depend on the estimator and forward model.


## The ROF Model

The Rudin-Osher-Fatemi (ROF) model, published in 1992, is the canonical variational model for image denoising. It minimizes:

$$
\min_f \; \frac{1}{2}\lVert f - g^\delta \rVert_2^2 + \alpha \operatorname{TV}(f),
$$

where $\operatorname{TV}(f) = \int_\Omega \lvert\nabla f\rvert \, dx$ is the total variation.

The genius of the ROF model is that the TV penalty preserves edges. Unlike the quadratic penalty $\lVert \nabla f \rVert_2^2$, which penalizes all gradients equally and smears edges, the TV penalty penalizes the total magnitude of the gradient without squaring. A sharp edge with a large gradient concentrated at one location incurs only a finite cost. By contrast, a smooth transition spread over a large region can incur the same total variation as a sharp edge. The functional is indifferent between the two, allowing the data fidelity term to decide which is more consistent with the observations.

The mathematical properties are well-understood. The minimizer exists and is unique (for the denoising problem with $L^2$ fidelity). The solution operator $g^\delta \mapsto f_\alpha$ is continuous. For piecewise constant true images, the minimizer preserves the jumps while removing noise, under suitable conditions on $\alpha$ and the noise level.


## Solving Variational Problems: Primal-Dual Methods

The main computational challenge with TV-based models is non-smoothness. The TV functional is convex but not differentiable at points where $\nabla f = 0$. Standard gradient descent does not apply directly.

Primal-dual methods, including the Chambolle-Pock algorithm, are well suited to these problems. The idea is to reformulate the problem using convex duality.

The TV functional can be written as:

$$
\begin{aligned}
\operatorname{TV}(f) &= \sup_{\lVert p \rVert_\infty \leq 1} \int_\Omega p \cdot \nabla f \, dx \\\\
&= \sup_{\lVert p \rVert_\infty \leq 1} \langle p, \nabla f \rangle,
\end{aligned}
$$

where the supremum is over vector fields $p$ with $\lvert p(x)\rvert \leq 1$ pointwise. Substituting this into the minimization yields a saddle-point problem:

$$
\min_f \max_{\lVert p \rVert_\infty \leq 1} \; \frac{1}{2}\lVert f - g^\delta \rVert_2^2 + \alpha \langle p, \nabla f \rangle.
$$

The Chambolle-Pock algorithm alternates between updating the dual variable $p$ (an ascent step in $p$) and the primal variable $f$ (a descent step in $f$):

$$
p^{n+1} = \operatorname{proj}_{\lVert \cdot \rVert_\infty \leq 1}\!\left( p^n + \sigma\alpha \nabla \bar{f}^n \right),
$$

$$
f^{n+1} = \operatorname{prox}_{\tau \mathcal{D}}\!\left( f^n + \tau \alpha \, \operatorname{div}(p^{n+1}) \right),
$$

$$
\bar{f}^{n+1} = f^{n+1} + \theta (f^{n+1} - f^n),
$$

where $\sigma$ and $\tau$ satisfy $\sigma\tau\alpha^2\lVert\nabla\rVert^2<1$, $\theta\in[0,1]$ is an extrapolation parameter, and $\operatorname{prox}$ denotes the proximal operator. Equivalently, one can absorb $\alpha$ into the dual variable and project onto a ball of radius $\alpha$.

For the basic convex formulation, an ergodic primal-dual gap bound of order $O(1/N)$ holds when the step sizes satisfy the stated condition. An $O(1/N^2)$ rate requires additional uniform convexity and the corresponding accelerated step-size updates; it is not a generic property of the basic scheme.

I use primal-dual methods extensively in my EIT work. The adaptivity of the step sizes, and the ability to handle non-smooth penalties without smoothing approximations, makes these algorithms well-suited to the TV and TGV regularization strategies I employ.


## Beyond ROF: Structured Regularization

The variational framework is not limited to total variation. Different regularization terms capture different structural priors.

**Directional TV.** When edges have a preferred orientation (as in some geological imaging problems), the isotropic TV norm $\lvert\nabla f\rvert = \sqrt{f_x^2 + f_y^2}$ can be replaced with an anisotropic version $\lvert f_x\rvert + \lvert f_y\rvert$ or a weighted version that penalizes gradients in different directions differently. This allows you to incorporate directional prior knowledge into the reconstruction.

**Infimal convolution.** The infimal convolution of two functionals $\mathcal{R}_1$ and $\mathcal{R}_2$ is defined as:

$$
(\mathcal{R}_1 \Box \mathcal{R}_2)(f) = \inf_{f_1 + f_2 = f} \mathcal{R}_1(f_1) + \mathcal{R}_2(f_2).
$$

This decomposition encourages the reconstruction to be the sum of two components, each satisfying a different structural assumption. For instance, combining TV and an $H^1$ penalty decomposes the image into a piecewise constant part (edges and flat regions) and a smooth part (gradual variations). This is more flexible than either penalty alone.

**Total Generalized Variation.** TGV extends TV to penalize not just the gradient but also higher-order derivatives, avoiding the staircasing effect that pure TV introduces on smooth regions. The second-order TGV functional:

$$
\operatorname{TGV}_{\alpha_0,\alpha_1}^2(f) = \min_w \; \alpha_1 \lVert \nabla f - w \rVert_1 + \alpha_0 \lVert \mathcal{E}(w) \rVert_1
$$

favours piecewise linear solutions (affine regions separated by edges) rather than piecewise constant ones. For many imaging problems, this produces more natural-looking reconstructions.

**Dictionary-based sparsity.** If the image is sparse in a known transform domain (wavelets, curvelets, shearlets), the penalty $\mathcal{R}(f) = \lVert \Psi f \rVert_1$ promotes sparsity of the transform coefficients. The choice of dictionary $\Psi$ encodes a prior about the geometry of the image features: wavelets capture point singularities, curvelets capture curve singularities, and shearlets combine the two.


## The Discrepancy Principle and Parameter Choice

A recurring theme in variational reconstruction is the choice of the regularization parameter $\alpha$. The Morozov discrepancy principle provides a principled approach: choose $\alpha$ so that the data residual matches the noise level,

$$
\lVert \mathcal{A} f_\alpha - g^\delta \rVert \approx \delta.
$$

The logic is that you should fit the data only as well as the noise allows. Fitting more tightly means fitting the noise. Fitting more loosely means ignoring information in the data.

In practice, implementing the discrepancy principle requires knowing (or estimating) the noise level $\delta$. When $\delta$ is unknown, alternatives include the L-curve method (plotting the data fidelity against the regularization term as $\alpha$ varies and choosing the corner of the resulting curve) and generalized cross-validation.

For nonlinear problems, nonconvexity and local minima make parameter selection more delicate. A continuation strategy starts with a large $\alpha$ and decreases it gradually, using each solution as the next initial point. This is a computational heuristic, not a guarantee of convergence to a global minimizer.


## Connections to Machine Learning

The variational framework has deep connections to machine learning that I find increasingly important.

**Weight decay is Tikhonov regularization.** Training a neural network with $L^2$ weight decay amounts to minimizing $\text{loss}(\theta) + \lambda \lVert \theta \rVert^2$, which is exactly the Tikhonov framework applied to the parameter estimation problem. Dropout, data augmentation, and early stopping are all, in a generalized sense, forms of regularization.

**Unrolled algorithms.** Learned image reconstruction can "unroll" an iterative optimization algorithm into a neural network. Each layer of the network corresponds to one iteration of the algorithm, with the step sizes and regularization parameters replaced by learnable weights. The resulting network preserves the structure of the variational approach while adapting its parameters from training data.

**Plug-and-Play methods.** These replace the proximal step of a variational algorithm with a learned denoiser, combining the data fidelity structure of the variational approach with the image prior learned by the denoiser. The convergence theory is still developing, but the practical results are strong.


## A Personal View

What draws me to variational methods is their transparency. Every component of the functional has a clear interpretation: the data fidelity says how you measure misfit, the regularizer says what you believe about the solution, and the algorithm is a systematic way to balance the two. When something goes wrong, you can diagnose the problem by examining each component separately.

This transparency is valuable in applied settings where you need to justify your choices. A clinician using an EIT reconstruction wants to know: what assumptions went into this image? Variational methods make those assumptions explicit and auditable in a way that end-to-end neural networks do not, at least not yet.

The mathematics is also satisfying in its own right. Convex analysis, function spaces, optimization theory, and PDE theory all come together in the variational framework. Understanding how these pieces fit together is one of the pleasures of working in computational inverse problems.
