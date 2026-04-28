---
layout: post
title: "Optimal Experimental Design: Choosing Measurements That Matter"
description: "An introduction to optimal experimental design: how to choose which measurements to take in order to maximally reduce uncertainty about an unknown quantity."
date: 2026-06-29
author: "Abd'gafar Tunde Tiamiyu"
tags: [Mathematics, Inverse Problems, Optimal Experimental Design]
math: true
---

Most discussions of inverse problems take the measurement setup as given. You have a set of electrodes, or a set of transducers, or a set of sensors, and you work with whatever data they produce. But there is a prior question: which measurements should you take in the first place?

This is the problem of **optimal experimental design** (OED). Given a model, a class of possible experiments, and a criterion for what "good" information looks like, OED asks: which experiment — which choice of measurement operator — extracts the most useful information about the unknown?

The question has a long history in statistics, going back at least to work by Kiefer and Wolfowitz in the 1950s. In recent years, it has become practically significant in inverse problems, where the measurement geometry is often a design choice, not a physical constraint. In EIT, you can choose which electrode pairs to stimulate and in what pattern. In seismic surveys, you can choose the shot locations. In MRI, you can choose the $k$-space trajectory. In each case, making the right choices can dramatically improve the quality of the reconstruction.


## The Setup

Suppose the unknown parameter $m$ takes values in $\mathbb{R}^n$, and we observe linear data

$$
y = Cm + \eta,
$$

where $C \in \mathbb{R}^{k \times n}$ is the measurement operator (determined by the experimental design), and $\eta \sim \mathcal{N}(0, \Gamma_\text{noise})$ is Gaussian noise.

We adopt a Bayesian viewpoint. The prior is $m \sim \mathcal{N}(m_0, \Gamma_\text{prior})$. Given data $y$, the posterior is also Gaussian:

$$
m \mid y \sim \mathcal{N}(m_\text{post}, \Gamma_\text{post}),
$$

with

$$
\Gamma_\text{post}^{-1} = \Gamma_\text{prior}^{-1} + C^\top \Gamma_\text{noise}^{-1} C.
$$

The posterior covariance $\Gamma_\text{post}$ is the key object. It measures the remaining uncertainty after the experiment. A good experiment drives $\Gamma_\text{post}$ toward zero in the directions we care about; a bad experiment leaves large posterior variance.

The problem of OED is to choose $C$ (subject to a budget constraint) to minimize a scalar summary of $\Gamma_\text{post}$.


## Design Criteria

Several scalar criteria for $\Gamma_\text{post}$ are standard.

**A-optimality** minimizes the trace of $\Gamma_\text{post}$, which is the average posterior variance across all components of $m$:

$$
\Phi_A(C) = \text{tr}(\Gamma_\text{post}) = \text{tr}\!\left(\left(\Gamma_\text{prior}^{-1} + C^\top \Gamma_\text{noise}^{-1} C\right)^{-1}\right).
$$

Minimizing trace minimizes the average squared error of the posterior mean as an estimator of $m$. It is the most common criterion in practice.

**D-optimality** minimizes the log-determinant of $\Gamma_\text{post}$, equivalently maximizing the information gain (the reduction in differential entropy from prior to posterior):

$$
\Phi_D(C) = \log\det(\Gamma_\text{post}) = -\log\det\!\left(\Gamma_\text{prior}^{-1} + C^\top \Gamma_\text{noise}^{-1} C\right) + \text{const}.
$$

The information gain is $\frac{1}{2}\log\det(\Gamma_\text{prior}) - \frac{1}{2}\log\det(\Gamma_\text{post})$, which measures (in nats) how much entropy is removed by the experiment. D-optimal designs maximize this reduction, and they have a Bayesian-invariance property: the optimal design is the same regardless of the prior's mean $m_0$.

**E-optimality** minimizes the largest eigenvalue of $\Gamma_\text{post}$, reducing the worst-case posterior variance direction. This is more conservative than A-optimality and appropriate when the largest uncertainty matters more than the average.

**Goal-oriented design** targets a specific quantity of interest $Q(m) = q^\top m$ and minimizes $q^\top \Gamma_\text{post} q$, the posterior variance of that quantity. This is appropriate when only part of the unknown is relevant; global design criteria can allocate measurement effort to directions that do not affect $Q$.


## The Sensor Placement Problem

A concrete instance of OED: you have $N$ candidate sensor locations and a budget of $k \ll N$ sensors. Which $k$ locations should you choose?

Formally, let $C_i \in \mathbb{R}^{1 \times n}$ be the measurement row corresponding to sensor $i$. You seek a subset $\mathcal{S} \subset \{1, \ldots, N\}$ of size $k$ that minimizes

$$
\text{tr}\!\left(\left(\Gamma_\text{prior}^{-1} + \sum_{i \in \mathcal{S}} C_i^\top \Gamma_\text{noise}^{-1} C_i\right)^{-1}\right).
$$

This is a combinatorial optimization problem: there are $\binom{N}{k}$ possible designs, which for $N = 100$ and $k = 10$ is about $1.7 \times 10^{13}$. Exhaustive search is hopeless.

**Greedy methods.** Add sensors one at a time, choosing at each step the sensor that maximally decreases the design criterion. For submodular criteria (and A-optimality, D-optimality, and E-optimality are all submodular functions of the sensor set), the greedy algorithm achieves a $(1 - 1/e) \approx 63\%$ approximation of the global optimum — a classical result of Nemhauser, Wolsey, and Fisher.

**Convex relaxation.** Replace the binary sensor selection indicator by a continuous weight $w_i \in [0, 1]$:

$$
\min_{w \in [0,1]^N,\, \mathbf{1}^\top w \leq k} \;\text{tr}\!\left(\left(\Gamma_\text{prior}^{-1} + \sum_{i=1}^N w_i C_i^\top \Gamma_\text{noise}^{-1} C_i\right)^{-1}\right).
$$

For A-optimality, this is a semidefinite program. Once the relaxed weights are obtained, they can be rounded to a binary selection. The convex relaxation often produces better designs than greedy methods when $k$ is small, at the cost of higher computational effort.

**Randomized methods.** Sample sensor subsets with probability proportional to their approximate contribution to the information gain. These are scalable and often produce near-optimal designs for large $N$, though without the approximation guarantees of greedy algorithms.


## Adaptive and Sequential Design

Static design — choosing all measurements before any data is collected — discards information. Sequential design interleaves measurement with inference: after each batch of measurements, the posterior is updated, and the next measurement is chosen based on the current posterior.

The optimal sequential design is the solution of a Bellman equation: at each step, choose the measurement that maximizes the expected information gain over all future steps. This is, in general, computationally intractable for non-trivial numbers of steps.

Approximate strategies that work well in practice include:

**Myopic (one-step-ahead) design.** At each step, choose the single measurement that maximally reduces the current criterion. This ignores future steps but is cheap and often effective.

**Expected information gain.** When the model is nonlinear or the prior is non-Gaussian, the information gain cannot be computed in closed form. It can be estimated by Monte Carlo: draw samples from the prior, simulate observations, compute the posterior, and average the reduction in entropy. This is expensive but general, and it is the method of choice in Bayesian OED for nonlinear inverse problems.


## Application to EIT

In EIT, the measurement protocol specifies which electrode pairs inject current and which pairs measure the resulting voltages. A standard protocol (e.g., adjacent stimulation) applies current between neighbouring electrodes and measures all remaining pairs. But this is a convention, not an optimum.

OED for EIT asks: for a given number of stimulation patterns, which patterns carry the most information about the conductivity? The answer depends on the prior: if you expect a single circular inclusion, the optimal patterns differ from those optimal for a diffuse anomaly.

Several groups have explored this question. The general finding is that the standard adjacent protocol is not optimal for any standard prior, and that tailored protocols can improve reconstruction quality by 20–40% (in terms of posterior variance reduction) with the same number of measurements. For real-time imaging where measurement bandwidth is limited, this improvement is consequential.

The challenge in applying OED to EIT is that the forward model is nonlinear (the sensitivity of the measurements to the conductivity depends on the conductivity itself), so the information matrix changes as the estimate of the conductivity changes. Adaptive protocols that update the stimulation pattern during the measurement sequence are theoretically superior but require fast online computation. This is an active area of research.


## What I Find Compelling

OED is, at its core, a question about the structure of information: which features of the unknown can be recovered from which types of data? Understanding this is not only practically useful; it is theoretically clarifying.

In my own work, thinking about optimal designs has changed how I think about the ill-posedness of EIT. The problem is not merely that the forward operator maps many conductivities to similar data; it is that the standard measurement protocols do not extract the information that would distinguish them. This is a design choice, and it can be improved.

The Bayesian framework makes the OED problem tractable and connects it naturally to the regularization and uncertainty quantification methods I described in earlier posts. The design criterion, the prior, the likelihood, and the posterior are all parts of the same coherent probabilistic framework. This integration is one of the things I find most appealing about the Bayesian approach: not just as a method for solving inverse problems, but as a language for thinking about the whole measurement-inference pipeline.
