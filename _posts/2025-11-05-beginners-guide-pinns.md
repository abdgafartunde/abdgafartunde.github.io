---
layout: post
title: "A Beginner's Guide to Physics-Informed Neural Networks"
description: "Understanding the mathematical foundations of PINNs"
date: 2025-11-05
tags: [deep-learning, physics, tutorial, PINNs]
---

Physics-Informed Neural Networks (PINNs) embed physical laws directly into the learning process, offering a principled approach to solving differential equations with neural networks.

## Mathematical Formulation

Consider a general PDE of the form:

$$\mathcal{N}[u](x) = f(x), \quad x \in \Omega$$

with boundary conditions $$\mathcal{B}[u](x) = g(x)$$ on $$\partial\Omega$$.

A PINN approximates the solution $$u(x)$$ by a neural network $$u\_\theta(x)$$ and minimizes:

$$\mathcal{L}(\theta) = \mathcal{L}\_{\text{PDE}} + \lambda\_b \mathcal{L}\_{\text{BC}} + \lambda\_d \mathcal{L}\_{\text{data}}$$

where:
- $$\mathcal{L}\_{\text{PDE}} = \frac{1}{N\_r}\sum\_{i=1}^{N\_r} \lvert\mathcal{N}[u\_\theta](x\_i^r) - f(x\_i^r)\rvert^2$$ enforces the PDE at collocation points
- $$\mathcal{L}\_{\text{BC}} = \frac{1}{N\_b}\sum\_{i=1}^{N\_b} \lvert\mathcal{B}[u\_\theta](x\_i^b) - g(x\_i^b)\rvert^2$$ enforces boundary conditions
- $$\mathcal{L}\_{\text{data}} = \frac{1}{N\_d}\sum\_{i=1}^{N\_d} \lvert u\_\theta(x\_i^d) - u\_i^d\rvert^2$$ fits available measurements

The key insight is that derivatives $$\partial u\_\theta / \partial x$$ are computed exactly via automatic differentiation.

## Why PINNs Matter

**Data efficiency:** The physics constraint acts as a strong regularizer, reducing the need for large datasets.

**Physical consistency:** Solutions respect conservation laws and known physics by construction.

**Inverse problems:** Unknown parameters $$\lambda$$ in $$\mathcal{N}\_\lambda[u] = f$$ can be learned jointly with the solution by including them in the optimization.

## Application to Inverse Problems

For parameter identification, we seek both $$u$$ and $$\lambda$$ such that the PDE residual vanishes while matching observations. The loss becomes:

$$\mathcal{L}(\theta, \lambda) = \mathcal{L}\_{\text{data}} + \alpha \mathcal{L}\_{\text{PDE}}(\lambda)$$

This framework naturally handles my research in EIT, where we recover conductivity $$\sigma$$ from boundary measurements.

## Challenges

- **Spectral bias:** Networks struggle with high-frequency components
- **Loss balancing:** Choosing $$\lambda\_b, \lambda\_d$$ requires care
- **Training difficulty:** Optimization can be challenging for stiff PDEs

## Further Reading

- Raissi, Perdikaris, Karniadakis (2019): *Physics-informed neural networks*
- Karniadakis et al. (2021): *Physics-informed machine learning*, Nature Reviews Physics
