---
layout: post
title: "The Adjoint Method: Computing Gradients for Free"
description: "How the adjoint method turns the computation of gradients of PDE-constrained functionals from an expensive operation into an almost free one."
date: 2026-05-25
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Optimization]
math: true
---

Many problems in science and engineering reduce to optimizing a functional that depends on the solution of a partial differential equation. In design, you want to shape a structure to minimise drag. In inverse problems, you want to recover a coefficient from measurements. In optimal control, you want to steer a system to a target state. In all of these settings, you need gradients: derivatives of the objective with respect to the parameters you are tuning.

The naive approach is finite differences. Perturb each parameter by a small amount, solve the PDE, measure the change in the objective, divide by the perturbation. This works for a handful of parameters, but the PDE must be solved once for every parameter. If your discretized problem has thousands or millions of unknowns, finite differences is computationally hopeless.

The adjoint method resolves this. It computes the gradient of a functional with respect to arbitrarily many parameters at the cost of two PDE solves: one forward solve and one adjoint solve. The number of parameters does not matter. This is the reason the adjoint method underpins virtually every serious optimization code involving PDEs, from aerodynamic shape design to full-waveform seismic inversion to the training of physics-informed neural networks.


## The Setting

Let me set up the problem concretely. Suppose we have a PDE

$$
F(u, m) = 0
$$

where $u$ is the state (the PDE solution, e.g., a potential or a wave field), $m$ is the parameter (e.g., a coefficient, an initial condition, a boundary shape), and $F$ is the PDE operator.

We want to minimize an objective functional

$$
J(m) = \mathcal{J}(u(m), m),
$$

where $u(m)$ is the unique solution of the PDE for a given $m$, and $\mathcal{J}$ measures how well the state matches the data or satisfies a design criterion.

To minimize $J$, we need the gradient $\nabla_m J$. Computing this gradient is the problem the adjoint method solves.


## The Naive Approach and Its Cost

The simplest way to compute $\nabla_m J$ is through the implicit function theorem. Differentiating $F(u(m), m) = 0$ with respect to $m$ gives

$$
\frac{\partial F}{\partial u} \frac{\partial u}{\partial m} + \frac{\partial F}{\partial m} = 0,
$$

so

$$
\frac{\partial u}{\partial m} = -\left(\frac{\partial F}{\partial u}\right)^{-1} \frac{\partial F}{\partial m}.
$$

The full gradient is then

$$
\nabla_m J = \frac{\partial \mathcal{J}}{\partial u} \frac{\partial u}{\partial m} + \frac{\partial \mathcal{J}}{\partial m} = -\frac{\partial \mathcal{J}}{\partial u} \left(\frac{\partial F}{\partial u}\right)^{-1} \frac{\partial F}{\partial m} + \frac{\partial \mathcal{J}}{\partial m}.
$$

The problem is the term $\left(\frac{\partial F}{\partial u}\right)^{-1} \frac{\partial F}{\partial m}$. This is the *sensitivity matrix* $\partial u / \partial m$. If $m$ has $p$ components and $u$ is discretized into $n$ unknowns, this matrix is $n \times p$. Computing it requires solving a linear system with $\frac{\partial F}{\partial u}$ (the Jacobian of the PDE) once for each column: $p$ solves in total.

For inverse problems in EIT, the parameter $m$ is the conductivity distribution, discretized into thousands of pixels. Solving thousands of PDE systems to get one gradient is not feasible in practice.


## The Adjoint Method

The key observation is that we never actually need the full sensitivity matrix. We only need the product

$$
\frac{\partial \mathcal{J}}{\partial u} \cdot \frac{\partial u}{\partial m},
$$

which is a row vector times a matrix: a single vector of length $p$. Rather than computing the full matrix and then multiplying, we can compute this product directly by reversing the order of operations.

Introduce the **adjoint variable** $\lambda$ (sometimes called the adjoint state or the co-state), defined as the solution of the **adjoint equation**:

$$
\left(\frac{\partial F}{\partial u}\right)^\top \lambda = -\left(\frac{\partial \mathcal{J}}{\partial u}\right)^\top.
$$

This is a single linear system with the same coefficient matrix as the forward problem, transposed. For many PDEs, the transpose (or adjoint) of the Jacobian is associated with the adjoint PDE, which is another PDE problem of the same type. For self-adjoint problems (like the standard elliptic operators that appear in EIT), the adjoint is identical to the forward equation.

Once $\lambda$ is available, the gradient can be written as:

$$
\nabla_m J = \lambda^\top \frac{\partial F}{\partial m} + \frac{\partial \mathcal{J}}{\partial m}.
$$

This requires only:
1. One forward solve to compute $u(m)$.
2. One adjoint solve to compute $\lambda$.
3. One cheap post-processing step to assemble $\nabla_m J$.

The cost is independent of the number of parameters $p$. Whether $m$ has ten components or ten million, the gradient requires exactly two PDE solves.


## A Concrete Example: EIT

In electrical impedance tomography, the forward problem is the elliptic PDE

$$
-\nabla \cdot (\sigma \nabla u) = 0 \quad \text{in } \Omega,
$$

with appropriate boundary conditions encoding the applied currents. The parameter $m = \sigma$ is the conductivity, and the state $u$ is the electric potential. The measurements are the voltages on the boundary.

Given measured voltages $g^\delta$ and simulated voltages $\mathcal{M}(u)$ (the measurement operator applied to the forward solution), the data misfit objective is

$$
J(\sigma) = \frac{1}{2}\lVert \mathcal{M}(u(\sigma)) - g^\delta \rVert^2.
$$

The gradient is the quantity needed for iterative descent methods (gradient descent, L-BFGS, Gauss-Newton). The adjoint method computes it as follows.

**Forward solve:** Given current conductivity $\sigma^k$, solve $-\nabla \cdot (\sigma^k \nabla u) = 0$ for the potential $u$.

**Adjoint solve:** Solve the adjoint equation, which for this self-adjoint problem has the same form:

$$
-\nabla \cdot (\sigma^k \nabla \lambda) = 0 \quad \text{in } \Omega,
$$

but with boundary data driven by the data residual $\mathcal{M}(u) - g^\delta$ rather than the applied current.

**Gradient assembly:** The gradient of $J$ with respect to $\sigma$ at any point $x$ in the domain is

$$
\nabla_\sigma J (x) = \nabla u(x) \cdot \nabla \lambda(x).
$$

This pointwise formula is the key result. It says the gradient is the dot product of the forward sensitivity (the gradient of the potential) and the adjoint sensitivity (the gradient of the adjoint potential). Both are available from the two PDE solves; no additional work is needed.

In the discretized setting, this formula gives a vector of the same dimension as the conductivity discretization, regardless of the resolution.


## Connection to Backpropagation

If the adjoint method looks familiar, it should. The backpropagation algorithm in neural network training is a special case of the adjoint method, applied to the computational graph of the network rather than a PDE.

In backpropagation, the forward pass computes the network output (the "state"), and the backward pass propagates gradients from the loss function back through the network layers. This backward pass is precisely the adjoint equation for the specific PDE-like system defined by the network's computation.

This connection is not accidental. Chen et al.'s Neural ODE paper, which I discussed in a previous post, made it explicit: solving the adjoint ODE backward in time corresponds exactly to backpropagating through the continuous neural network. The adjoint method is the common language.


## Practical Considerations

**Self-adjoint vs. non-self-adjoint problems.** For self-adjoint PDE operators (symmetric elliptic equations, many eigenvalue problems), the adjoint equation has the same structure as the forward equation and can be solved with the same solver. For non-self-adjoint problems (convection-dominated equations, many fluid dynamics problems), the adjoint is a different equation and may have different numerical properties. In some cases, the adjoint is more challenging to solve numerically than the forward problem.

**Discrete vs. continuous adjoints.** There are two philosophies. The *optimize-then-discretize* approach derives the adjoint PDE in continuous form and then discretizes it. The *discretize-then-optimize* approach discretizes the forward problem first and then computes the exact adjoint of the discrete system. The two approaches give different results unless the discretization is self-consistent. For inverse problems, the *discretize-then-optimize* approach is often preferred because it provides exact gradients of the discrete objective, which makes gradient-based optimization more reliable.

**Second-order methods.** The adjoint method gives first-order gradients. For second-order optimization methods like Newton or Gauss-Newton, one needs Hessian-vector products. These can also be computed via adjoint-like techniques (tangent-adjoint or adjoint-of-adjoint methods) at the cost of a few more PDE solves. For ill-posed inverse problems, the Gauss-Newton Hessian (which drops the second-order term) is often a good approximation and sidesteps some of the additional complexity.


## Why It Matters

The adjoint method is not a trick or a shortcut. It is the correct way to think about gradient computation for PDE-constrained problems. Once you understand it, you see it everywhere: in aerodynamic design codes, in seismic inversion software, in medical imaging reconstruction algorithms, in the automatic differentiation libraries that underpin modern machine learning.

The mathematical content is simple (the chain rule, applied carefully), but the computational payoff is enormous. Problems that would be computationally intractable with finite differences become routine once the adjoint is in place. In my EIT reconstruction work, moving to adjoint-based gradients reduced the per-iteration cost from minutes to seconds, making iterative algorithms that require hundreds of gradient evaluations genuinely practical.

Understanding the adjoint method is, in my view, one of the most valuable things a researcher working at the interface of computation and PDEs can do.
