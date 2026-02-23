---
layout: post
title: "Regularization: The Art of Choosing What to Believe"
description: "How different regularization strategies encode different assumptions about solutions, and why the choice of prior matters more than the choice of algorithm."
date: 2026-03-02
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Regularization]
math: true
---

In my earlier post on inverse problems, I described regularization as the central idea of the field. You have noisy, incomplete data. The naive inversion amplifies noise catastrophically. So you impose additional structure, a prior belief about what the solution should look like, and you solve a modified problem that balances fidelity to the data against fidelity to the prior.

What I did not emphasize enough is that the choice of regularization is not a technical detail. It is the most consequential modelling decision you will make. Two researchers working on the same data with different regularizers can obtain qualitatively different reconstructions, and both can be mathematically justified. The regularizer is where your scientific judgement enters the mathematics.

This post is about that choice: what the main options are, what each one assumes, and how to think about which one fits your problem.


## The General Framework

The setup is standard. You have a forward operator $\mathcal{A}$ mapping the unknown quantity $f$ to data $g$, and you observe noisy data $g^\delta$ with $\lVert g^\delta - g \rVert \leq \delta$. You want to recover $f$ from $g^\delta$.

The variational approach frames this as an optimization problem:

$$
\min_f \; \mathcal{D}(f, g^\delta) + \alpha \, \mathcal{R}(f),
$$

where $\mathcal{D}$ is a data fidelity term (how well $f$ explains the data), $\mathcal{R}$ is the regularization functional (your prior), and $\alpha > 0$ controls the trade-off.

Every choice of $\mathcal{R}$ encodes a belief. The question is: what do you believe about the solution?


## Tikhonov: Smooth and Well-Behaved

The simplest and most widely used choice is the quadratic penalty:

$$
\mathcal{R}(f) = \lVert f \rVert_{L^2}^2 = \int_\Omega |f(x)|^2 \, dx.
$$

This penalizes large values. The implicit assumption is that the true solution is not too far from zero (or from some reference $f_0$ if you use $\lVert f - f_0 \rVert^2$) and that all frequencies in the solution are equally important.

Through the SVD lens, Tikhonov regularization acts as a smooth low-pass filter. It damps the high-frequency components that carry mostly noise, and it does so gracefully: no sharp cutoff, just a gradual rolloff controlled by $\alpha$.

Tikhonov is appropriate when you genuinely expect the solution to be smooth and you have no reason to believe it contains sharp features. Diffusion coefficients in heat conduction, for instance, often vary smoothly in space. In those cases, Tikhonov works well and the theory is mature: convergence rates are known, parameter choice rules are well-established, and the computational cost is modest.

The limitation is obvious. If the solution contains edges, jumps, or sharp transitions, Tikhonov will smear them. The quadratic penalty treats edges as large gradients to be penalized, and the reconstruction dutifully smooths them out. This is not a failure of the algorithm; it is a consequence of using the wrong prior.


## Total Variation: Preserving Edges

Total variation (TV) regularization replaces the quadratic penalty with the TV seminorm:

$$
\mathcal{R}(f) = \operatorname{TV}(f) = \int_\Omega |\nabla f| \, dx.
$$

The key insight is that TV measures the total amount of variation in the solution without squaring it. The $L^1$ nature of the penalty allows $\nabla f$ to be large at isolated points (edges) without incurring excessive cost, while still penalizing oscillations elsewhere.

This makes TV the natural choice for piecewise constant or piecewise smooth solutions: images with distinct regions separated by sharp boundaries, conductivity distributions with inclusions, geological models with layered structures.

The Rudin-Osher-Fatemi (ROF) model, introduced in 1992, is the canonical example:

$$
\min_f \; \frac{1}{2}\lVert f - g^\delta \rVert^2 + \alpha \operatorname{TV}(f).
$$

The theory guarantees that minimizers exist and that edges in the data can be recovered in the reconstruction, something Tikhonov provably cannot do.

The practical difficulty with TV is the non-differentiability at points where $\nabla f = 0$. The functional is convex but not smooth, which rules out standard gradient descent. Efficient algorithms exist (primal-dual methods, split Bregman, ADMM) but they require more careful implementation than Tikhonov. In my own work on EIT, I use primal-dual hybrid gradient methods, and getting the step sizes right is often the difference between fast convergence and stagnation.

TV also has a well-known artifact: the *staircasing effect*. Because the penalty favours piecewise constant solutions, smooth gradients in the true solution tend to be reconstructed as a series of flat steps. If your solution is genuinely smooth, TV can introduce artificial jumps that are not present in the truth.


## Sparsity and $\ell^1$ Penalties

When the solution has a concise representation in some basis or dictionary $\{\psi_n\}$, sparsity-promoting regularization is appropriate. You write $f = \sum_n c_n \psi_n$ and penalize the coefficients:

$$
\mathcal{R}(f) = \sum_n |c_n|.
$$

The $\ell^1$ norm encourages most coefficients to be exactly zero, yielding a sparse representation. This is the mathematical foundation of compressed sensing and has had enormous impact in signal processing, medical imaging, and beyond.

The assumption is explicit: the solution is well-approximated by a small number of basis elements. If this is true, the results can be striking. LASSO-type methods can recover a signal from far fewer measurements than classical sampling theory would suggest.

If the assumption is wrong, if the solution genuinely requires contributions from many basis elements, then sparsity regularization will produce artifacts as it tries to force a sparse representation onto a non-sparse signal.


## Higher-Order Penalties

For solutions that are smooth except at a few isolated features, higher-order regularization can outperform both Tikhonov and TV. The Total Generalized Variation (TGV), introduced by Bredies, Kunisch, and Pock, uses a penalty of the form:

$$
\operatorname{TGV}_\beta^2(f) = \min_w \; \alpha_1 \int_\Omega |\nabla f - w| \, dx + \alpha_0 \int_\Omega |\mathcal{E}(w)| \, dx,
$$

where $\mathcal{E}(w) = \frac{1}{2}(\nabla w + \nabla w^T)$ is the symmetrized gradient. TGV penalizes the deviation of $\nabla f$ from an auxiliary vector field $w$, which is itself penalized through its symmetrized gradient. The effect is that piecewise affine (rather than piecewise constant) functions are favoured, eliminating the staircasing effect of TV while still preserving edges.

In practice, TGV produces more natural-looking reconstructions for many imaging problems. The cost is two additional parameters and a more complex optimization structure.


## Learned Regularizers

A direction I find particularly promising, and one I worked on during my time in Graz, is the idea of learning the regularizer from data. Instead of hand-crafting $\mathcal{R}$ based on mathematical intuition, you train a neural network to act as the regularizer or as part of the reconstruction pipeline.

The simplest version learns a denoising prior. If $D_\theta$ is a neural network trained to denoise images, you can use it implicitly as a regularizer by iterating:

$$
f_{k+1} = D_\theta\!\left( f_k + \mathcal{A}^*\!(g^\delta - \mathcal{A} f_k) \right).
$$

This is a Plug-and-Play approach: alternating between a data fidelity step and a learned denoising step. The convergence theory is still catching up with the practice, but the results can be impressive, especially when you have access to training data that captures the statistics of the solutions you expect to encounter.

The deeper question, one the community is actively working on, is whether learned regularizers can provide the same convergence and stability guarantees as classical methods. Early theoretical results are encouraging but far from complete.


## How to Choose

There is no universal answer, but there are useful guidelines.

**Start with what you know about the solution.** If it is smooth, use Tikhonov. If it has edges, use TV or TGV. If it is sparse in a known basis, use $\ell^1$. If you have training data, consider learned approaches.

**Look at the artifacts.** Every regularizer has a characteristic failure mode. Tikhonov over-smooths. TV staircases. Sparsity creates ringing near edges. If you see these artifacts in your reconstruction, it is the regularizer telling you that the prior does not match the solution.

**Use parameter choice wisely.** The regularization parameter $\alpha$ is not a tuning knob to be adjusted until the result looks good. It encodes the noise level and your confidence in the prior. The Morozov discrepancy principle says to choose $\alpha$ so that the residual $\lVert \mathcal{A}(f_\alpha) - g^\delta \rVert \approx \delta$, matching the misfit to the noise level. This is principled and avoids overfitting.

**Validate against known cases.** Before trusting a regularization strategy on real data, test it on synthetic problems where you know the ground truth. This is the only reliable way to understand what your method sees and what it misses.


## The Honest Part

I want to end with something that does not appear in textbooks. Choosing a regularizer is, at some level, a statement about what you are willing to hallucinate.

Every reconstruction contains features that are not determined by the data. The regularizer fills in the gaps. A Tikhonov reconstruction halluccinates smoothness. A TV reconstruction hallucinates sharp boundaries. A sparsity prior hallucinates a sparse representation. These are all defensible choices in the right context, and all of them are wrong in the wrong context.

The intellectual honesty of inverse problems lies in making these choices explicit and understanding their consequences. You do not pretend to recover the truth. You recover the truth as filtered through your assumptions, and you acknowledge that different assumptions yield different answers.

This is, I think, one of the most valuable lessons the field teaches. It applies far beyond mathematics.
