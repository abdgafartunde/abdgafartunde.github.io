---
layout: post
title: "Neural Operators: Learning the Solution Map"
description: "An introduction to neural operators, from DeepONet to Fourier Neural Operators, and why learning mappings between function spaces is different from learning functions."
date: 2026-03-30
author: "Abd'gafar Tunde Tiamiyu"
tags: [Scientific Machine Learning, Neural Operators, Deep Learning]
math: true
---

In my earlier post on physics-informed neural networks, I described a method that trains a neural network to approximate the solution of a single PDE instance. You fix the coefficients, the domain, the boundary conditions, and you train a network to produce $u(x)$ at any point $x$.

This works, but it has a fundamental limitation: every time you change the problem (a different forcing term, a different boundary condition, a different coefficient), you have to retrain from scratch. For inverse problems, where you need to solve the forward problem hundreds or thousands of times with different parameter values, this is prohibitively expensive.

Neural operators take a different approach. Instead of learning a single solution, they learn the *solution map* itself: the operator that takes problem data (a forcing function, a boundary condition, a coefficient) as input and produces the solution as output. Train once, and then evaluate for any new input in milliseconds.

This is an ambitious goal. It requires learning a mapping between infinite-dimensional function spaces, not just fitting a function. The mathematical and computational challenges are substantial, but the potential payoff is enormous.


## From Functions to Operators

A neural network in the standard sense learns a function $f : \mathbb{R}^n \to \mathbb{R}^m$. The input and output are finite-dimensional vectors. This is the setting of image classification, regression, and most of traditional deep learning.

A neural operator learns a mapping $\mathcal{G} : \mathcal{U} \to \mathcal{S}$ between function spaces. The input is a function (say, a spatially varying coefficient $a(x)$), and the output is a function (say, the solution $u(x)$ of a PDE with that coefficient). Both $a$ and $u$ are, in principle, infinite-dimensional objects.

The distinction matters because the operator $\mathcal{G}$ should be *discretization-invariant*. Once trained, it should work regardless of how finely you represent the input and output functions. A network trained on a $64 \times 64$ grid should, in principle, be evaluable on a $256 \times 256$ grid without retraining. This property, called resolution independence, is what separates neural operators from standard neural networks applied to PDE data.


## DeepONet: The Operator Approximation Theorem

DeepONet, introduced by Lu, Jin, Pang, Zhang, and Karniadakis in 2021, is built on a mathematical foundation: the universal approximation theorem for operators, proved by Chen and Chen in 1995. The theorem states that a sufficiently wide network can approximate any continuous nonlinear operator to arbitrary accuracy.

The architecture has two subnetworks. The *branch net* processes the input function $a(x)$, evaluated at a fixed set of sensor locations $\{x_1, \ldots, x_m\}$, and produces a vector of coefficients $b_1, \ldots, b_p$. The *trunk net* takes a query point $y$ (where you want to evaluate the output) and produces another vector $t_1, \ldots, t_p$. The output is their inner product:

$$
\mathcal{G}_\theta(a)(y) = \sum_{k=1}^{p} b_k(a(x_1), \ldots, a(x_m)) \cdot t_k(y).
$$

The branch net encodes how the input function $a$ determines the solution, and the trunk net encodes the spatial structure of the output. Training uses input-output pairs $\{(a_i, u_i)\}$ from data or a PDE solver.

The architecture is simple and general. It applies to any operator, not just those arising from PDEs. The practical limitation is that the branch net sees the input function only through its values at fixed sensor locations, which introduces a discretization dependence that the theory claims to avoid.


## Fourier Neural Operator

The Fourier Neural Operator (FNO), introduced by Li, Kovachki, Azizzadenesheli, Liu, Bhatt, Stuard, and Anandkumar in 2021, takes a different approach. Instead of learning an operator through pointwise evaluations, it operates in the frequency domain.

The key building block is the spectral convolution layer. Given an input function $v(x)$, represented as a discretized field, the layer computes:

$$
(\mathcal{K}(v))(x) = \mathcal{F}^{-1}\!\left( R_\phi \cdot \mathcal{F}(v) \right)(x) + W v(x),
$$

where $\mathcal{F}$ is the Fourier transform, $R_\phi$ is a learnable weight tensor applied in Fourier space (truncated to a finite number of modes), and $W$ is a linear transformation applied in physical space. A nonlinear activation is applied after each layer.

The idea is that many PDE solutions have structure that is naturally expressed in the frequency domain. Low-frequency modes capture large-scale behaviour, and the truncation of high-frequency modes provides an implicit regularization. By learning the transformation in Fourier space, the network can capture global interactions at each layer, unlike convolutional networks that see only local patches.

FNO has three attractive properties. First, the Fourier transform is computed via FFT, making it efficient. Second, the architecture is inherently discretization-invariant: the Fourier modes are defined independently of the grid resolution. Third, the model has far fewer parameters than a comparable fully connected network, because it only learns weights for a truncated set of Fourier modes.

The practical results have been impressive for certain classes of problems. For the Navier-Stokes equations in turbulent regimes, FNO produces solutions that are orders of magnitude faster than classical solvers with comparable accuracy. For Darcy flow (a linear elliptic problem with heterogeneous coefficients), the method generalizes well across different coefficient realizations.


## Where Neural Operators Excel

**Parametric PDE problems.** When you need to solve the same PDE many times for different parameters (different forcing terms, coefficients, boundary conditions), neural operators offer dramatic speedups. The offline cost (generating training data, training the network) can be amortized over thousands of evaluations.

**Real-time applications.** In settings where you need a PDE solution in milliseconds rather than minutes (control systems, interactive design, real-time monitoring), neural operators fill a niche that classical solvers cannot. Once trained, a forward pass is typically under 10 milliseconds on a GPU.

**Inverse problems and optimization.** This is where I see the greatest promise. Many inverse problem algorithms require repeated forward solves. If each forward solve takes minutes, the inversion takes hours or days. Replacing the classical forward solver with a trained neural operator can reduce the total computation time by orders of magnitude. The trade-off is accuracy: the neural operator introduces an approximation error that propagates through the inversion.


## What the Enthusiasm Obscures

Neural operators are powerful, but the current discourse sometimes oversells them. Here are the caveats I think are important.

**Training data is expensive.** You need thousands of input-output pairs to train a neural operator effectively. Each pair requires solving the PDE with a classical method. If your classical solver takes five minutes per solve and you need 10,000 training samples, the data generation alone takes over a month of compute time. The speedup is only realized at inference, not during training. For problems you only need to solve a few times, the classical solver wins.

**Generalization is not guaranteed.** A neural operator trained on smooth coefficients may fail on discontinuous ones. A model trained for low Reynolds number flows may produce nonsense at high Reynolds numbers. The input distribution matters, and out-of-distribution inputs can produce confidently wrong answers. There is, at present, no general theory of generalization error for neural operators in the sense that we have for finite element methods.

**Accuracy ceilings.** Neural operators typically achieve relative errors in the range of 1-5% for well-behaved problems. This is adequate for many applications but insufficient for others. If you need six digits of accuracy, classical methods remain the only option. The accuracy tends to degrade for problems with sharp features, thin boundary layers, or strong nonlinearities, precisely the problems where classical methods also struggle but where decades of adaptive strategies provide systematic remedies.

**The comparison is not always fair.** Many papers compare neural operator inference time against classical solver time without accounting for the training cost. A fair comparison includes data generation time, training time, and amortization over the expected number of queries. When the number of queries is small, the break-even point may never be reached.


## The Theoretical Landscape

The theory of neural operators is developing rapidly but remains incomplete. Key questions include:

**Approximation rates.** How many parameters does a neural operator need to approximate an operator to a given accuracy? For FNO, results by Kovachki, Lanthaler, and Mishra provide bounds, but they depend on the regularity of the target operator and the solution in ways that are not always practical to verify.

**Stability.** If the training data is corrupted by noise, how stable is the learned operator? This connects directly to the regularization theory I work on. A neural operator that is sensitive to noise in the training data is analogous to an unstable inverse problem, and the remedies (regularization, truncation, ensemble methods) are conceptually similar.

**Discretization convergence.** Does the neural operator converge to the true operator as the resolution increases and the training data grows? For FNO, partial results exist. For DeepONet, the universal approximation theorem guarantees existence of a good approximator but says nothing about whether training will find it.


## My Perspective

I find neural operators interesting because they address a real computational bottleneck in my work. In EIT reconstruction, the forward solver is called repeatedly, and replacing it with a fast surrogate would make real-time imaging more feasible. I have been experimenting with DeepONet as a surrogate for the CEM forward problem, training on conductivity-to-voltage pairs generated by FEM.

The results so far are mixed. For conductivities in the training distribution, the surrogate is fast and reasonably accurate. For conductivities that fall outside the training distribution (the ones that tend to appear during iterative inversion, when the algorithm explores regions of parameter space far from the initial guess), the accuracy drops noticeably. This is not surprising, but it limits the usefulness of the approach.

I think the path forward involves hybrid methods: use the neural operator as a warm start or preconditioner, and refine with a classical solver when accuracy is critical. Or use the operator within a regularized inversion framework that can absorb and compensate for approximation errors in the forward model. This is an active area of research, and I expect we will see significant progress in the coming years.

The tools are not yet mature enough to replace classical methods, but they are mature enough to complement them in useful ways. Understanding both the potential and the limitations is what allows you to use them effectively.
