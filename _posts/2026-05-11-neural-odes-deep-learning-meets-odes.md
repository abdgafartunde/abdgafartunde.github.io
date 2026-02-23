---
layout: post
title: "Deep Learning Meets Differential Equations: Neural ODEs and Beyond"
description: "How viewing neural networks as continuous dynamical systems opens new connections between deep learning and differential equations."
date: 2026-05-11
author: "Abd'gafar Tunde Tiamiyu"
tags: [Scientific Machine Learning, Neural ODEs, Deep Learning]
math: true
---

One of the more surprising developments in scientific machine learning is the realization that deep neural networks and differential equations are, in a precise sense, two views of the same thing. A residual network is a discretized dynamical system. A neural ODE is the continuous limit of that system. And the tools of numerical analysis (stability, convergence, adaptivity) apply directly to the design and training of neural networks.

This connection has been productive in both directions. It has given the deep learning community new architectures, new training algorithms, and new theoretical insight. It has given the scientific computing community new tools for modeling dynamical systems, learning physics from data, and solving high-dimensional problems. Whether the full promise will be realized remains an open question, but the ideas are worth understanding.


## From ResNets to Dynamical Systems

A standard residual network applies a sequence of transformations:

$$
h_{k+1} = h_k + f_\theta(h_k, t_k), \qquad k = 0, 1, \ldots, K-1,
$$

where $h_k$ is the hidden state at layer $k$, $f_\theta$ is a parameterized transformation (typically a small neural network), and $t_k$ is a "time" label for layer $k$.

This is the forward Euler method applied to the ODE $\dot{h}(t) = f_\theta(h(t), t)$ with step size 1. The connection is immediate: a residual network with $K$ layers is a $K$-step numerical solution of a dynamical system.

Chen, Rubanova, Bettencourt, and Duvenaud made this precise in their 2018 NeurIPS paper on Neural ODEs. Instead of stacking a fixed number of layers, they define the network as the continuous-time ODE:

$$
\frac{dh}{dt} = f_\theta(h(t), t), \qquad h(0) = x,
$$

where $x$ is the input and the output is $h(T)$ for some terminal time $T$. The ODE is solved numerically during both the forward pass (to compute the output) and the backward pass (to compute gradients), using an adaptive ODE solver.

The elegance of this formulation is that the model has no fixed depth. The ODE solver automatically determines how many function evaluations (analogous to layers) are needed, allocating more computation where the dynamics are complex and less where they are simple. The number of parameters is independent of the effective depth, which can reduce memory costs substantially.


## Training: The Adjoint Method

Training a neural ODE requires computing gradients of the loss with respect to the parameters $\theta$. The naive approach (backpropagating through the operations of the ODE solver) stores all intermediate states, making the memory cost proportional to the number of solver steps.

The adjoint method offers an alternative. Define the adjoint state $a(t) = \frac{dL}{dh(t)}$, where $L$ is the loss. The adjoint satisfies a backward ODE:

$$
\frac{da}{dt} = -a(t)^T \frac{\partial f_\theta}{\partial h}(h(t), t),
$$

integrated backward from $t = T$ to $t = 0$, with the terminal condition $a(T) = \frac{dL}{dh(T)}$. The gradient with respect to $\theta$ is:

$$
\frac{dL}{d\theta} = -\int_0^T a(t)^T \frac{\partial f_\theta}{\partial \theta}(h(t), t) \, dt.
$$

The adjoint method computes the gradient by solving another ODE backward in time, requiring only $O(1)$ memory (independent of the number of solver steps). This is the same adjoint method used in optimal control, data assimilation, and PDE-constrained optimization, applied here to the neural network training problem.

In practice, the theoretical memory savings are partially offset by the need to recompute (or checkpoint) the forward trajectory during the backward solve. Interpolation errors and numerical instability of the backward ODE can also introduce inaccuracies in the gradient. These are active areas of research.


## Where Neural ODEs Are Useful

**Irregular time series.** Classical recurrent networks (LSTMs, GRUs) process data at fixed time steps. Neural ODEs define a continuous dynamics that can be evaluated at arbitrary times, making them natural for irregularly sampled data: patient records with varying visit frequencies, sensor data with gaps, event-driven measurements.

**Generative models.** Continuous normalizing flows (CNFs) use neural ODEs to define a continuous transformation from a simple base distribution (Gaussian) to a complex data distribution. The log-density is tracked through the ODE via the instantaneous change of variables formula:

$$
\frac{d \log p(h(t))}{dt} = -\operatorname{tr}\!\left( \frac{\partial f_\theta}{\partial h} \right).
$$

Computing the trace of the Jacobian is expensive for high-dimensional problems. The Hutchinson trace estimator (approximating the trace via random projections) makes this feasible, and flow matching (Lipman et al., 2023) provides an even more efficient training framework that avoids the trace computation entirely.

**Modeling physical systems.** When the data comes from a physical system governed by differential equations, parameterizing the right-hand side with a neural network lets you learn the dynamics directly. This is particularly useful when the governing equations are partially known: you model the known physics explicitly and use the neural network to capture the unknown or difficult-to-model components.


## Extensions and Variations

The neural ODE idea has spawned a family of related methods.

**Augmented Neural ODEs.** The standard neural ODE has a fundamental limitation: the flow of an ODE is a homeomorphism, meaning it cannot change the topology of the state. In practice, this limits the expressiveness of neural ODEs for classification tasks where the decision boundary has complex topology. Augmented Neural ODEs (Dupont et al., 2019) resolve this by adding extra dimensions to the state, allowing the dynamics to operate in a higher-dimensional space where the topological constraint is relaxed.

**Neural SDEs.** Replacing the ODE with a stochastic differential equation,

$$
dh = f_\theta(h, t) \, dt + g_\phi(h, t) \, dW,
$$

where $dW$ is a Wiener process, adds stochasticity to the model. This is useful for modeling systems with intrinsic noise and for uncertainty quantification: the distribution of the SDE's output reflects uncertainty in the prediction. Training requires stochastic adjoint methods and is more expensive, but the added expressiveness is valuable for certain applications.

**Hamiltonian and Lagrangian Neural Networks.** When the system you are modeling has conserved quantities (energy, momentum), encoding these conservation laws into the architecture can dramatically improve both accuracy and generalization. Hamiltonian Neural Networks (Greydanus et al., 2019) parameterize the Hamiltonian $H_\theta(q, p)$ and evolve the system via Hamilton's equations:

$$
\dot{q} = \frac{\partial H_\theta}{\partial p}, \qquad \dot{p} = -\frac{\partial H_\theta}{\partial q}.
$$

Energy conservation is built in by construction. The network learns the Hamiltonian, and the dynamics follow from the structure. For mechanical systems, this produces physically plausible long-term predictions that standard neural ODEs cannot match.

**Neural Controlled Differential Equations.** CDEs (Kidger et al., 2020) generalize Neural ODEs to handle sequential input data naturally:

$$
\frac{dh}{dt} = f_\theta(h(t)) \frac{dX}{dt}(t),
$$

where $X(t)$ is a continuous interpolation of the input data. This provides a principled continuous-time analogue of RNNs and has shown strong performance on time series tasks.


## Connections to Numerical Analysis

What I find most interesting about the neural ODE framework is how it connects deep learning design choices to well-understood concepts from numerical analysis.

**Stability.** A residual network $h_{k+1} = h_k + f_\theta(h_k)$ is stable in the numerical analysis sense when the dynamics do not amplify perturbations. The condition for stability of the forward Euler method is that the eigenvalues of the Jacobian $\partial f_\theta / \partial h$ lie within the stability region. This constraint informs architecture design: networks with controlled spectral properties train more stably.

**Order of accuracy.** Different architectures correspond to different numerical integrators. A ResNet is forward Euler (first order). Multi-step architectures correspond to multi-step methods. The theoretical accuracy of the integrator affects how well the discrete network approximates its continuous limit.

**Adaptivity.** Adaptive ODE solvers automatically adjust the step size based on local error estimates. In the neural ODE framework, this means the effective depth of the network varies with the input. Inputs that require more computation (complex dynamics) get more solver steps; simple inputs get fewer. This is a form of computational efficiency that fixed-depth architectures cannot achieve.

**Reversibility.** Using a reversible ODE solver (or the adjoint method) entirely avoids storing intermediate activations, which is the dominant memory cost in training deep networks. This connection between time-reversibility in ODEs and memory-efficient training is elegant and practically useful.


## Limitations

Neural ODEs are not without drawbacks.

**Training is slow.** Each forward pass requires solving an ODE, and each backward pass requires solving the adjoint ODE. Adaptive solvers make this robust, but the wall-clock time per training step is significantly higher than for a standard residual network with a fixed number of layers. For large-scale problems (image classification on ImageNet, for instance), this overhead is often prohibitive.

**Stiff dynamics are problematic.** If the learned dynamics $f_\theta$ produces stiff equations, implicit solvers are needed, which substantially increase the cost per step. During training, the dynamics can become stiff as the parameters change, causing the solver to slow down unpredictably.

**Expressiveness limitations.** The homeomorphism constraint of ODE flows limits what neural ODEs can represent without augmentation. For classification tasks, this is a real limitation. For modeling physical systems, it is less of an issue because physical dynamics are typically continuous.

**Gradient accuracy.** The adjoint method introduces numerical errors in the gradient computation. For long integration intervals or chaotic dynamics, these errors can accumulate and degrade training. Checkpointing strategies and careful solver tolerances help, but the problem persists for challenging dynamics.


## My Perspective

I find the neural ODE framework valuable primarily for the conceptual bridge it builds between deep learning and dynamical systems. In my own work, the most relevant offshoot is the connection to PDE-constrained optimization: the adjoint method for neural ODEs is the same adjoint method I use for computing sensitivities in inverse problems. Tools and intuitions transfer directly.

For learning dynamics of physical systems, the approach is genuinely useful, especially when combined with structural priors (Hamiltonian structure, conservation laws, symmetries). The resulting models are more data-efficient and produce more physically plausible predictions than unstructured neural networks.

Whether neural ODEs will become a standard tool in the practitioner's toolbox or remain a primarily theoretical contribution is still unclear. What is clear is that the ideas have enriched both the machine learning and the scientific computing communities, and the cross-pollination between the two fields continues to produce interesting work.

The differential equations perspective does not make deep learning simple. But it makes it more understandable, and in research, understanding is progress.
